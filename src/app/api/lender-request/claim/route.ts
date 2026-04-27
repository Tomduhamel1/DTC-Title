import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

const Body = z.object({
  refId: z.string().min(4).max(64),
})

export async function POST(req: Request) {
  const session = await getSession()
  // @ts-expect-error — id is added in session callback
  const userId = session?.user?.id as string | undefined
  if (!userId) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  const json = await req.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  const invite = await prisma.lenderRequest.findUnique({
    where: { refId: parsed.data.refId },
    select: { id: true, userId: true },
  })
  if (!invite) return NextResponse.json({ ok: false, error: 'not found' }, { status: 404 })

  // Don't steal an invite already claimed by a different account.
  if (invite.userId && invite.userId !== userId) {
    return NextResponse.json({ ok: false, error: 'already claimed' }, { status: 409 })
  }

  const closing = await prisma.closing.findFirst({
    where: { userId, status: { in: ['pending', 'active'] } },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  })

  await prisma.lenderRequest.update({
    where: { id: invite.id },
    data: { userId, closingId: closing?.id ?? null },
  })

  return NextResponse.json({ ok: true })
}
