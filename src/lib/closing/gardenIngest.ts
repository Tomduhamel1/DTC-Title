import { randomUUID } from 'crypto'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { MILESTONE_KINDS, normalizePhoneKey, normalizePropertyKey } from '@/lib/closing'
import { applyEscrowOfficer, type EscrowOfficerInput } from '@/lib/closing/officer'
import { upsertTeammateClosing, type TeammateRole } from '@/lib/teammate/match'
import { sendWelcomeEmail, type WelcomeEmailData } from '@/lib/email/welcome'
import { sendTeammateInviteEmail, type TeammateInviteEmailData } from '@/lib/email/teammate-invite'
import type { CreateClosingFromOrderInput } from '@/lib/closing/createFromOrder'

export class IngestConflict extends Error {
  constructor(public fields: string[]) { super('Existing BetterClose values differ; review field ownership before retrying') }
}
export class IngestPending extends Error {
  constructor() { super('Notification delivery is pending; retry this same Garden file number') }
}
const text = (value: unknown) => typeof value === 'string' && value.trim() ? value.trim() : null
const email = (value: unknown) => text(value)?.toLowerCase() || null
const same = (a: unknown, b: unknown) => a instanceof Date && b instanceof Date
  ? a.getTime() === b.getTime() : a === b

// A Garden file is a transaction identity, not a person/property identity.
// Existing unbound web leads must be linked explicitly by an operator.
// No contact fallback is allowed on this authenticated integration path.
export async function ingestGardenOrder(input: CreateClosingFromOrderInput & { escrowOfficer?: EscrowOfficerInput }) {
  const gardenFileNumber = String(input.gardenFileNumber || '').trim()
  if (!gardenFileNumber) throw new IngestConflict(['gardenFileNumber'])
  const borrowerEmail = email(input.borrowerEmail)
  const teammateEmail = email(input.teammateEmail || input.placedByEmail || input.lenderContactEmail ||
    input.orderingPartyEmail || input.lenderEmail)
  const teammateRole: TeammateRole = ['lender', 'broker', 'realtor'].includes(String(input.teammateRole))
    ? input.teammateRole as TeammateRole : teammateEmail && teammateEmail === email(input.lenderEmail) ? 'lender' : 'unknown'
  const fields = {
    propertyAddress: text(input.propertyAddress), propertyCity: text(input.propertyCity),
    propertyState: text(input.propertyState), propertyZip: text(input.propertyZip),
    propertyAddressKey: normalizePropertyKey(text(input.propertyAddress)),
    propertyType: text(input.propertyType), closingDate: text(input.closingDate) ? new Date(String(input.closingDate)) : null,
    salePrice: typeof input.salePrice === 'number' ? input.salePrice : null,
    loanAmount: typeof input.loanAmount === 'number' ? input.loanAmount : null,
    borrowerEmail, borrowerPhone: normalizePhoneKey(text(input.borrowerPhone)),
    lenderName: text(input.lenderName), lenderCompany: text(input.lenderCompany),
    lenderEmail: email(input.lenderEmail), lenderPhone: text(input.lenderPhone), lenderNmls: text(input.lenderNmls),
  }
  const result = await prisma.$transaction(async tx => {
    const existing = await tx.closing.findUnique({ where: { gardenFileNumber } })
    if (existing) {
      const conflicts = Object.entries(fields).filter(([key, value]) => {
        const old = existing[key as keyof typeof existing]
        return value !== null && old !== null && old !== '' && !same(old, value)
      }).map(([key]) => key)
      if (conflicts.length) throw new IngestConflict(conflicts)
    }
    const data = Object.fromEntries(Object.entries(fields).filter(([key, value]) => value !== null &&
      (!existing || existing[key as keyof typeof existing] == null || existing[key as keyof typeof existing] === '')))
    const closing = existing
      ? await tx.closing.update({ where: { id: existing.id }, data })
      : await tx.closing.create({ data: {
        ...data, gardenFileNumber, status: 'active', source: 'garden',
        milestones: { create: MILESTONE_KINDS.map(kind => ({ kind })) },
      } })
    const queue = async (kind: string, recipient: string, payload: object) => tx.ingestDelivery.upsert({
      where: { closingId_kind_recipient: { closingId: closing.id, kind, recipient } },
      create: { closingId: closing.id, kind, recipient, payload: payload as Prisma.InputJsonValue },
      update: {},
    })
    if ((!existing || !existing.borrowerEmail) && borrowerEmail) await queue('welcome', borrowerEmail, {
      closingId: closing.id,
      borrowerEmail, borrowerName: text(input.borrowerName), propertyAddress: fields.propertyAddress,
      baseUrl: process.env.NEXTAUTH_URL || 'https://www.betterclose.co',
      placingParty: { role: teammateRole, lenderCompany: fields.lenderCompany },
    })
    let teammateLinked = false
    if (teammateEmail) {
      const linked = await upsertTeammateClosing({ closingId: closing.id, email: teammateEmail, role: teammateRole }, tx)
      if (!linked) throw new Error('Teammate association was not created')
      teammateLinked = true
      if (linked.created && !linked.linkedToUser) await queue('teammate_invite', teammateEmail, {
        email: teammateEmail, role: linked.role, closingId: closing.id,
        placingBorrowerName: text(input.borrowerName), propertyAddress: fields.propertyAddress,
      })
    }
    const officerFieldsSet = input.escrowOfficer ? await applyEscrowOfficer(closing.id, input.escrowOfficer, tx) : 0
    return { closingId: closing.id, matchedBy: existing ? 'garden_file_number' : null, teammateLinked, officerFieldsSet }
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
  // Commit the closing AND delivery intent before contacting email. An email
  // failure cannot erase the intent; subsequent Garden retries drain it.
  await deliverIngestNotifications(result.closingId)
  return { ok: true, contractVersion: 2, ingestApplied: true, gardenFileNumber, ...result }
}

export async function deliverIngestNotifications(closingId: string) {
  const pending = await prisma.ingestDelivery.findMany({ where: { closingId, status: { not: 'sent' } } })
  for (const item of pending) {
    const now = new Date()
    const leaseToken = randomUUID()
    const claimed = await prisma.ingestDelivery.updateMany({
      where: { id: item.id, OR: [{ status: 'pending' }, { status: 'sending', leaseUntil: { lt: now } }] },
      data: { status: 'sending', leaseToken, leaseUntil: new Date(now.getTime() + 5 * 60_000), attempts: { increment: 1 } },
    })
    if (!claimed.count) continue
    try {
      const messageId = item.kind === 'welcome'
        // The durable row is authoritative, including legacy queued payloads
        // created before welcome links included a closing ID.
        ? await sendWelcomeEmail({ ...(item.payload as unknown as WelcomeEmailData), closingId: item.closingId })
        : await sendTeammateInviteEmail(item.payload as unknown as TeammateInviteEmailData)
      // A dry-run is not delivery.
      if (!messageId) throw new Error('Email was not accepted by the provider')
      await prisma.ingestDelivery.updateMany({ where: { id: item.id, leaseToken }, data: {
        status: 'sent', sentAt: new Date(), leaseToken: null, leaseUntil: null, lastError: null,
      } })
    } catch (_) {
      await prisma.ingestDelivery.updateMany({ where: { id: item.id, leaseToken }, data: {
        status: 'pending', leaseToken: null, leaseUntil: null, lastError: 'email_send_failed',
      } })
    }
  }
  if (await prisma.ingestDelivery.count({ where: { closingId, status: { not: 'sent' } } })) throw new IngestPending()
}
