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

// Upsert a single (matchedEmail, closingId) -> TeammateClosing row. Used when
// TPS opens an order and tells us who placed it. If a User with that email
// already exists, we link them; otherwise we leave userId null and the
// row gets claimed when the teammate signs up.
export async function upsertTeammateClosing(opts: {
  closingId: string
  email: string
  role?: 'lender' | 'broker' | 'realtor' | 'unknown'
}): Promise<void> {
  const matchedEmail = normaliseEmail(opts.email)
  if (!matchedEmail) return

  const existingUser = await prisma.user.findUnique({
    where: { email: matchedEmail },
    select: { id: true },
  })

  await prisma.teammateClosing.upsert({
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
  })
}
