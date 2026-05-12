import { prisma } from '@/lib/db'

// Email-matching logic for teammate-side attribution. Used in three places:
//   1. NextAuth signin — claim orphan TeammateClosing rows for the new user.
//   2. /api/orders/ingest — when TPS sends teammateEmail with a new order,
//      upsert a TeammateClosing row for that closing.
//   3. The backfill migration (translated to SQL there).
//
// All emails are compared lower-cased and trimmed.

export function normaliseEmail(s: string | null | undefined): string | null {
  if (!s) return null
  const t = s.trim().toLowerCase()
  return t || null
}

// Claim every orphan TeammateClosing row (userId IS NULL) whose matchedEmail
// matches this user's email. Returns the number of rows updated. Idempotent —
// if the user already has rows, the unique constraint prevents duplication.
export async function claimTeammateClosingsForUser(
  userId: string,
  email: string,
): Promise<number> {
  const lowered = normaliseEmail(email)
  if (!lowered) return 0

  const result = await prisma.teammateClosing.updateMany({
    where: { userId: null, matchedEmail: lowered },
    data: { userId },
  })
  return result.count
}

export type TeammateRole = 'lender' | 'broker' | 'realtor' | 'unknown'

export interface UpsertTeammateClosingResult {
  // True when the (matchedEmail, closingId) row did not exist before this call.
  // Idempotency scope is per (email, closingId) — the same teammate email on a
  // different closing is a fresh row and reports created=true.
  created: boolean
  // True when the row has a populated userId after the upsert (either we
  // matched an existing User in this call or the row was already linked).
  linkedToUser: boolean
  matchedEmail: string
  userId: string | null
  role: TeammateRole
}

// Upsert a single (matchedEmail, closingId) -> TeammateClosing row. Used when
// TPS opens an order and tells us who placed it. If a User with that email
// already exists, we link them; otherwise we leave userId null and the
// row gets claimed when the teammate signs up.
export async function upsertTeammateClosing(opts: {
  closingId: string
  email: string
  role?: TeammateRole
}): Promise<UpsertTeammateClosingResult | null> {
  const matchedEmail = normaliseEmail(opts.email)
  if (!matchedEmail) return null

  const existingUser = await prisma.user.findUnique({
    where: { email: matchedEmail },
    select: { id: true },
  })

  const existingRow = await prisma.teammateClosing.findUnique({
    where: { matchedEmail_closingId: { matchedEmail, closingId: opts.closingId } },
    select: { id: true, userId: true, role: true },
  })

  const upserted = await prisma.teammateClosing.upsert({
    where: { matchedEmail_closingId: { matchedEmail, closingId: opts.closingId } },
    create: {
      closingId: opts.closingId,
      matchedEmail,
      role: opts.role ?? 'unknown',
      userId: existingUser?.id ?? null,
    },
    update: {
      // If we now have a User record, link it (handles the case where the
      // teammate signed up between two TPS pings).
      ...(existingUser?.id ? { userId: existingUser.id } : {}),
      // Don't clobber a previously inferred role with 'unknown'.
      ...(opts.role && opts.role !== 'unknown' ? { role: opts.role } : {}),
    },
    select: { userId: true, role: true },
  })

  return {
    created: !existingRow,
    linkedToUser: Boolean(upserted.userId),
    matchedEmail,
    userId: upserted.userId ?? null,
    role: (upserted.role as TeammateRole) ?? 'unknown',
  }
}
