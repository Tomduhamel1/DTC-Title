import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { MILESTONE_KINDS, normalizePhoneKey, normalizePropertyKey } from '@/lib/closing'
import { applyEscrowOfficer, type EscrowOfficerInput } from '@/lib/closing/officer'
import { upsertTeammateClosing, type TeammateRole } from '@/lib/teammate/match'
import type { CreateClosingFromOrderInput } from '@/lib/closing/createFromOrder'
import { ensureInitialEstimate } from '@/lib/fileWorkspace/estimates'

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
export async function ingestGardenOrder(input: CreateClosingFromOrderInput & {
  escrowOfficer?: EscrowOfficerInput, gardenOrderId?: string, betterCloseRequestId?: string,
}) {
  const gardenFileNumber = String(input.gardenFileNumber || '').trim()
  if (!gardenFileNumber) throw new IngestConflict(['gardenFileNumber'])
  const gardenOrderId = text(input.gardenOrderId)?.toLowerCase() || null
  const requestId = text(input.betterCloseRequestId)
  if ((requestId && !gardenOrderId) || (gardenOrderId &&
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(gardenOrderId))) {
    throw new IngestConflict(['gardenOrderId'])
  }
  const borrowerEmail = email(input.borrowerEmail)
  const teammateEmail = email(input.teammateEmail || input.placedByEmail || input.lenderContactEmail ||
    input.orderingPartyEmail || input.lenderEmail)
  const teammateRole: TeammateRole = ['lender', 'broker', 'realtor'].includes(String(input.teammateRole))
    ? input.teammateRole as TeammateRole : teammateEmail && teammateEmail === email(input.lenderEmail) ? 'lender' : 'unknown'
  const fields = {
    transactionType: input.transactionType ?? null,
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
    const byRequest = requestId ? await tx.closing.findUnique({ where: { id: requestId } }) : null
    if (requestId && !byRequest) throw new IngestConflict(['betterCloseRequestId'])
    const byOrder = gardenOrderId ? await tx.closing.findUnique({ where: { gardenOrderId } }) : null
    const byFile = await tx.closing.findUnique({ where: { gardenFileNumber } })
    const candidates = [byRequest, byOrder, byFile].filter(c => c !== null)
    if (new Set(candidates.map(c => c.id)).size > 1) throw new IngestConflict(['gardenIdentity'])
    const existing = byRequest || byOrder || byFile
    if (existing && ((existing.gardenOrderId && existing.gardenOrderId !== gardenOrderId) ||
        (existing.gardenFileNumber && existing.gardenFileNumber !== gardenFileNumber))) {
      throw new IngestConflict(['gardenIdentity'])
    }
    if (byRequest && !byRequest.gardenOrderId && !byRequest.gardenFileNumber &&
        !['pending', 'active'].includes(byRequest.status)) throw new IngestConflict(['status'])
    if (existing) {
      const conflicts = Object.entries(fields).filter(([key, value]) => {
        const old = existing[key as keyof typeof existing]
        return value !== null && old !== null && old !== '' && !same(old, value)
      }).map(([key]) => key)
      if (conflicts.length) throw new IngestConflict(conflicts)
    }
    const data = Object.fromEntries(Object.entries(fields).filter(([key, value]) => value !== null &&
      (!existing || existing[key as keyof typeof existing] == null || existing[key as keyof typeof existing] === '')))
    const binding = gardenOrderId && !existing?.gardenOrderId ? {
      gardenOrderId, gardenLinkedAt: new Date(),
      gardenLinkSource: requestId ? 'explicit_request' : existing ? 'legacy_file_number' : 'garden_first',
    } : {}
    const closing = existing
      ? await tx.closing.update({ where: { id: existing.id }, data: { ...data, ...binding, gardenFileNumber } })
      : await tx.closing.create({ data: {
        ...data, ...binding, gardenFileNumber, status: 'active', source: 'garden',
        milestones: { create: MILESTONE_KINDS.map(kind => ({ kind })) },
      } })
    // Identity only. Opening emails are sent by the milestone delivery path.
    let teammateLinked = false
    if (teammateEmail) {
      const linked = await upsertTeammateClosing({ closingId: closing.id, email: teammateEmail, role: teammateRole,
        ...(['broker', 'realtor', 'lender'].includes(teammateRole) ? { mayManageBorrowerEmails: true } : {}) }, tx)
      if (!linked) throw new Error('Teammate association was not created')
      teammateLinked = true
    }
    const officerFieldsSet = input.escrowOfficer ? await applyEscrowOfficer(closing.id, input.escrowOfficer, tx) : 0
    return { closingId: closing.id, matchedBy: byRequest ? 'betterclose_request_id' :
      byOrder ? 'garden_order_id' : byFile ? 'garden_file_number' : null, teammateLinked, officerFieldsSet }
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
  // Cancel superseded legacy opening messages; this ingest never sends email.
  // The separate opening milestone queues the permission-aware EO introduction.
  await deliverIngestNotifications(result.closingId)
  await ensureInitialEstimate(result.closingId)
  return { ok: true, contractVersion: gardenOrderId ? 3 : 2, ingestApplied: true, gardenFileNumber,
    ...(gardenOrderId ? { gardenOrderId, betterCloseRequestId: requestId } : {}), ...result }
}

export async function deliverIngestNotifications(closingId: string) {
  // Retire unsent legacy opening emails. Milestones use their own namespace.
  await prisma.ingestDelivery.updateMany({
    where: { closingId, kind: { in: ['welcome', 'teammate_invite'] }, status: { in: ['pending', 'sending'] } },
    data: { status: 'cancelled', leaseToken: null, leaseUntil: null, lastError: 'superseded_by_pro_first_policy' },
  })
}
