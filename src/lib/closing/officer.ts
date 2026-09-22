import { prisma } from '@/lib/db'
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
): Promise<number> {
  const data: Record<string, string | null> = {}
  if ('name' in eo) data.escrowOfficerName = eo.name ?? null
  if ('title' in eo) data.escrowOfficerTitle = eo.title ?? null
  if ('email' in eo) data.escrowOfficerEmail = eo.email ?? null
  if ('phone' in eo) data.escrowOfficerPhone = eo.phone ?? null
  if ('nmls' in eo) data.escrowOfficerNmls = eo.nmls ?? null
  if ('photoUrl' in eo) data.escrowOfficerPhotoUrl = eo.photoUrl ?? null

  if (Object.keys(data).length === 0) return 0

  await prisma.closing.update({ where: { id: closingId }, data })

  // The officer is also a teammate of the file — surface them in the teammate
  // index so the file appears on their dashboard if they ever sign in.
  if (eo.email) {
    try {
      await upsertTeammateClosing({ closingId, email: eo.email, role: 'unknown' })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[closing/officer] escrow-officer teammate upsert failed', err)
    }
  }

  return Object.keys(data).length
}
