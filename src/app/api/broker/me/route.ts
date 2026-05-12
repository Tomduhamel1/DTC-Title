import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/session'
import { getProfessionalContext } from '@/lib/professional'

// GET /api/broker/me
//
// Returns the signed-in user's professional/broker context. Used by:
//   - server pages that need to decide whether to render broker UI
//   - any future client-side surface that wants to ask "am I a broker?"
//
// Always requires a signed-in user. Returns 401 if not signed in. If signed in
// but with no BrokerMembership, returns the context anyway with memberships: []
// and isBrokerMember: false — the caller can decide what to do with that.

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await requireUser()
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }
  const ctx = await getProfessionalContext(user.id)
  if (!ctx) {
    // User session points at a User row that no longer exists. Treat as
    // 401 so the client knows to re-auth.
    return NextResponse.json({ error: 'user not found' }, { status: 401 })
  }
  return NextResponse.json(ctx)
}
