import { getServerSession } from 'next-auth'
import { authOptions } from './options'
import { getProfessionalContext, type ProfessionalContext } from '@/lib/professional'

export async function getSession() {
  return getServerSession(authOptions)
}

export async function requireUser() {
  const session = await getSession()
  // @ts-expect-error — id is added in session callback
  if (!session?.user?.id) return null
  // @ts-expect-error
  return { id: session.user.id as string, email: session.user.email as string, name: session.user.name as string | null }
}

// Guard for routes/pages that require an active BrokerMembership.
// Returns the full ProfessionalContext when the caller is a broker member,
// null otherwise (covers both unauthenticated and signed-in-without-membership).
// Callers decide how to respond (redirect to /login, redirect to /teammate/dashboard,
// 404, etc.) — same pattern as requireUser.
export async function requireBrokerMember(): Promise<ProfessionalContext | null> {
  const user = await requireUser()
  if (!user) return null
  const ctx = await getProfessionalContext(user.id)
  if (!ctx || !ctx.isBrokerMember) return null
  return ctx
}

// Tighter variant for the future quote-to-Closing conversion flow:
// requires at least one BrokerMembership whose BrokerCompany.verifiedAt is set.
// Unused in PR 4 — added now so future PRs don't need a session.ts edit.
export async function requireVerifiedBrokerCompany(): Promise<ProfessionalContext | null> {
  const ctx = await requireBrokerMember()
  if (!ctx || !ctx.hasVerifiedBrokerCompany) return null
  return ctx
}
