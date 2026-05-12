// Professional / broker context resolver. Pure server logic — read-only,
// no mutations. Consumed by:
//   - GET /api/broker/me                  (JSON response)
//   - server guards in src/lib/auth/session.ts
//   - server-component pages under /teammate
//
// The contract: BrokerMembership is the source of truth for broker access.
// User.accountType is informational — a user can be 'professional' without
// any memberships (we don't gate on it). Conversely, an admin or borrower
// with a membership IS treated as a broker for portal access (rare in
// practice but harmless).

import { prisma } from '@/lib/db'

export interface ProfessionalMembership {
  membershipId: string
  role: string // 'owner' | 'member' (DB column is free String for forward-compat)
  companyId: string
  companyName: string
  companySlug: string
  companyVerifiedAt: Date | null
  createdAt: Date
}

export interface ProfessionalContext {
  userId: string
  email: string
  accountType: string
  memberships: ProfessionalMembership[]
  isBrokerMember: boolean
  hasVerifiedBrokerCompany: boolean
}

/**
 * Load the professional context for a user. Returns `null` if the user does
 * not exist (defensive — the caller normally has a valid session at this point).
 */
export async function getProfessionalContext(
  userId: string,
): Promise<ProfessionalContext | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      accountType: true,
      brokerMemberships: {
        select: {
          id: true,
          role: true,
          createdAt: true,
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              verifiedAt: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!user) return null

  const memberships: ProfessionalMembership[] = user.brokerMemberships.map((m) => ({
    membershipId: m.id,
    role: m.role,
    companyId: m.company.id,
    companyName: m.company.name,
    companySlug: m.company.slug,
    companyVerifiedAt: m.company.verifiedAt,
    createdAt: m.createdAt,
  }))

  return {
    userId: user.id,
    email: user.email,
    accountType: user.accountType,
    memberships,
    isBrokerMember: memberships.length > 0,
    hasVerifiedBrokerCompany: memberships.some((m) => m.companyVerifiedAt !== null),
  }
}
