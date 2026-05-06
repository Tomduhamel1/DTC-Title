import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireUser } from '@/lib/auth/session'
import { prisma } from '@/lib/db'

// PATCH /api/teammate/closings/[id]/mute
// id is a TeammateClosing.id (the membership id, not the closing id) so that
// no two teammates on the same file can clobber each other's preference.
//
// Body: { muted: boolean }

const Body = z.object({ muted: z.boolean() })

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

  // Verify ownership: the membership has to belong to this user.
  const membership = await prisma.teammateClosing.findUnique({
    where: { id: params.id },
    select: { id: true, userId: true, closingId: true },
  })
  if (!membership || membership.userId !== user.id) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  await prisma.teammateClosing.update({
    where: { id: membership.id },
    data: { muted: parsed.data.muted },
  })

  // Audit trail (optional but cheap).
  await prisma.notificationLog
    .create({
      data: {
        userId: user.id,
        closingId: membership.closingId,
        channel: 'email',
        kind: parsed.data.muted ? 'teammate:mute_on' : 'teammate:mute_off',
        recipient: user.email,
        subject: `Teammate ${parsed.data.muted ? 'muted' : 'unmuted'} closing`,
        status: 'skipped',
      },
    })
    .catch(() => {
      /* audit failures shouldn't break the toggle */
    })

  return NextResponse.json({ ok: true, muted: parsed.data.muted })
}
