// Helpers for BrokerCompany admin tooling. Pure logic kept out of route
// handlers so the rules are easy to reason about and (eventually) test.
//
// All callers are admin-gated. The DB writes (User upsert, BrokerMembership
// upsert) run in a single transaction. After a successful new-membership
// commit, addBrokerCompanyMember fires a best-effort broker portal welcome
// email — never inside the transaction, never blocking the admin write.

import { prisma } from '@/lib/db'
import { sendBrokerPortalWelcomeEmail } from '@/lib/email/broker-portal-welcome'

const MAX_SLUG_LEN = 64

/**
 * Normalize an arbitrary string into a URL-safe slug. Lowercased, non-
 * alphanumerics collapsed to '-', leading/trailing '-' trimmed, capped at 64
 * chars. Returns the empty string if the input has no slug-able characters.
 */
export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LEN)
}

/**
 * Derive a slug from `name` when admin didn't supply one. If derivation
 * produces an empty string (name was all symbols), fall back to a short
 * random hex tag so the company is still creatable.
 */
export function slugFromName(name: string): string {
  const base = normalizeSlug(name)
  if (base) return base
  return 'co-' + Math.random().toString(16).slice(2, 8)
}

export interface AddMemberResult {
  ok: true
  membershipId: string
  userId: string
  // True when the email did not previously have a User row and one was
  // created as part of this call. The new User has accountType='professional'
  // and no Account/Session — first sign-in via magic link will hydrate those
  // via PrismaAdapter.findUserByEmail (same orphan-claim pattern used for
  // Closing and TeammateClosing).
  userCreated: boolean
  // True when an existing User had accountType='borrower' and was flipped
  // to 'professional' as part of this call. False if the user was already
  // 'professional' or 'admin' (we never demote).
  accountTypeUpgraded: boolean
  // True when a BrokerMembership row was newly inserted. False when the
  // user was already a member of this company (idempotent no-op).
  membershipCreated: boolean
}

/**
 * Add (or re-discover) a member by email on a BrokerCompany.
 *
 * Idempotent — relies on BrokerMembership's @@unique([userId, companyId])
 * so calling this twice with the same (email, companyId) is safe.
 *
 * Behavior matrix:
 *   - email matches no User    → create minimal User (email + name? + accountType='professional')
 *                                   AND create BrokerMembership
 *   - email matches a User
 *       accountType='borrower' → flip to 'professional', create membership
 *                                   if it doesn't exist yet
 *       accountType=other      → leave accountType, create membership if missing
 *
 * Caller must validate the email format upstream; this function trusts the input.
 */
export async function addBrokerCompanyMember(args: {
  companyId: string
  email: string
  name?: string | null
  role?: 'owner' | 'member'
}): Promise<AddMemberResult> {
  const email = args.email.trim().toLowerCase()
  const role = args.role ?? 'member'

  // All DB work in one transaction so a half-completed add (e.g. User created
  // but membership insert fails) can't leave orphan rows. Email sending lives
  // OUTSIDE this block so an SES failure can't roll back the membership.
  const txResult = await prisma.$transaction(async (tx) => {
    // Read company name + verifiedAt so the post-transaction welcome email
    // can branch its body without a second round-trip. Cheap PK lookup.
    const company = await tx.brokerCompany.findUnique({
      where: { id: args.companyId },
      select: { name: true, verifiedAt: true },
    })

    let user = await tx.user.findUnique({
      where: { email },
      select: { id: true, accountType: true },
    })
    let userCreated = false
    let accountTypeUpgraded = false

    if (!user) {
      const created = await tx.user.create({
        data: {
          email,
          name: args.name?.trim() || null,
          accountType: 'professional',
        },
        select: { id: true, accountType: true },
      })
      user = created
      userCreated = true
    } else if (user.accountType === 'borrower') {
      await tx.user.update({
        where: { id: user.id },
        data: { accountType: 'professional' },
      })
      accountTypeUpgraded = true
    }

    // Upsert relies on the (userId, companyId) unique. `update` is a no-op
    // semantically — we don't want to mutate role on a re-add (admin can
    // edit role separately if we ever build that). But Prisma's upsert
    // requires SOMETHING in `update`, so we just touch a field to the same
    // value. Using the existing role we read first is cleanest.
    const existing = await tx.brokerMembership.findUnique({
      where: { userId_companyId: { userId: user.id, companyId: args.companyId } },
      select: { id: true },
    })

    let membership
    let membershipCreated = false
    if (existing) {
      membership = existing
    } else {
      membership = await tx.brokerMembership.create({
        data: {
          userId: user.id,
          companyId: args.companyId,
          role,
        },
        select: { id: true },
      })
      membershipCreated = true
    }

    return {
      ok: true as const,
      membershipId: membership.id,
      userId: user.id,
      userCreated,
      accountTypeUpgraded,
      membershipCreated,
      // Internal-only — used to drive the post-transaction welcome email.
      // Stripped before return to the caller so the public AddMemberResult
      // shape is unchanged.
      _companyName: company?.name ?? null,
      _isVerifiedCompany: company?.verifiedAt != null,
    }
  })

  // Best-effort welcome email — fires only on initial membership creation,
  // never on idempotent re-add. Wrapped in try/catch so SES failures cannot
  // affect the admin write that already committed.
  if (txResult.membershipCreated) {
    try {
      await sendBrokerPortalWelcomeEmail({
        email,
        memberName: args.name?.trim() || null,
        brokerCompanyName: txResult._companyName,
        isVerifiedCompany: txResult._isVerifiedCompany,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[brokerCompany] portal-welcome email send failed', {
        companyId: args.companyId,
        err,
      })
    }
  }

  // Strip internal fields so the public AddMemberResult shape is unchanged.
  const { _companyName: _cn, _isVerifiedCompany: _iv, ...publicResult } = txResult
  return publicResult
}
