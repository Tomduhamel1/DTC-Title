import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db'

// PATCH /api/teammate/closings/[id]/role
//
// id is a TeammateClosing.id (the membership id, not the closing id) so that
// only the row's owning user can change their own self-identified role.
//
// Body: { role: 'broker' | 'lender' | 'realtor' | 'unknown' }
//
// Used by the "How are you involved in this closing?" self-identification
// prompt on /teammate/dashboard for rows where role was set to 'unknown' by
// the borrower-led claim path (LenderRequest invite -> claim). The endpoint
// is otherwise idempotent: repeatedly PATCHing the same role is a no-op.

const Body = z.object({
  role: z.enum(['broker', 'lender', 'realtor', 'unknown']),
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const json = await req.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  // Ownership check — the row has to belong to this user. Returning 404 for
  // unauthorized matches the mute route's pattern (don't leak existence of
  // other users' memberships).
  const membership = await prisma.teammateClosing.findUnique({
    where: { id: params.id },
    select: { id: true, userId: true, closingId: true, role: true },
  })
  if (!membership || membership.userId !== user.id) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  await prisma.teammateClosing.update({
    where: { id: membership.id },
    data: { role: parsed.data.role },
  })

  // Audit trail — useful for tracking how often self-identification fires.
  // Best-effort; an audit failure does not block the role update.
  await prisma.notificationLog
    .create({
      data: {
        userId: user.id,
        closingId: membership.closingId,
        channel: 'email',
        kind: 'teammate:role_self_identified',
        recipient: user.email,
        subject: `Teammate self-identified as ${parsed.data.role}`,
        status: 'skipped',
      },
    })
    .catch(() => {
      /* audit failures shouldn't break the role update */
    })

  return NextResponse.json({ ok: true, role: parsed.data.role })
}
