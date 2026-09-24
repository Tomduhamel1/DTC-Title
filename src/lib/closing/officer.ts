import { prisma } from '@/lib/db'
import type { Prisma } from '@prisma/client'
import { upsertTeammateClosing } from '@/lib/teammate/match'

// Shared escrow-officer write path, used by:
//   - PATCH /api/tps/closings/[id]/details (Garden assigns/updates an officer)
//   - POST /api/orders/ingest (Garden opens a file with the officer already known)
//
// Semantics (must stay identical to the details route contract):
//   key ABSENT  → field untouched
//   key = null  → field cleared (destructive — Garden must drop nulls it
//                 doesn't mean; see docs/tps-integration.md FAQ)
//   key = value → field set

export interface EscrowOfficerInput {
  name?: string | null
  title?: string | null
  email?: string | null
  phone?: string | null
  nmls?: string | null
  photoUrl?: string | null
}

export async function applyEscrowOfficer(
  closingId: string,
  eo: EscrowOfficerInput,
  db: Prisma.TransactionClient = prisma,
): Promise<number> {
  const data: Record<string, string | null> = {}
  if ('name' in eo) data.escrowOfficerName = eo.name ?? null
  if ('title' in eo) data.escrowOfficerTitle = eo.title ?? null
  if ('email' in eo) data.escrowOfficerEmail = eo.email ?? null
  if ('phone' in eo) data.escrowOfficerPhone = eo.phone ?? null
  if ('nmls' in eo) data.escrowOfficerNmls = eo.nmls ?? null
  if ('photoUrl' in eo) data.escrowOfficerPhotoUrl = eo.photoUrl ?? null

  if (Object.keys(data).length === 0) return 0
  const acknowledged = Object.keys(data).length

  if ('email' in eo) {
    const current = await db.closing.findUniqueOrThrow({ where: { id: closingId }, select: { escrowOfficerEmail: true } })
    const normalized = (v: string | null | undefined) => v?.trim().toLowerCase() || null
    if (normalized(current.escrowOfficerEmail) !== normalized(eo.email)) {
      // A new officer must not inherit the previous person's photo/contact
      // card when Garden has no photo field to send. Hold the intro until the
      // new profile is verified; omitted fields are preserved only SAME-officer.
      for (const [inputKey, field] of Object.entries({ name: 'escrowOfficerName', title: 'escrowOfficerTitle',
        phone: 'escrowOfficerPhone', nmls: 'escrowOfficerNmls', photoUrl: 'escrowOfficerPhotoUrl' })) {
        if (!(inputKey in eo)) data[field] = null
      }
    }
    const changed = await db.closing.updateMany({ where: { id: closingId, escrowOfficerEmail: current.escrowOfficerEmail }, data })
    if (changed.count !== 1) throw new Error('Officer changed concurrently; retry assignment')
  } else {
    await db.closing.update({ where: { id: closingId }, data })
  }

  // The officer is also a teammate of the file — surface them in the teammate
  // index so the file appears on their dashboard if they ever sign in.
  if (eo.email) {
    await upsertTeammateClosing({ closingId, email: eo.email, role: 'unknown' }, db)
  }

  return acknowledged
}
