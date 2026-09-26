import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth/session'
import { BORROWER_EMAIL_KINDS } from '@/lib/closing/notificationChoices'
import { requireSameOrigin } from '@/lib/fileWorkspace/access'

const Body = z.object({ types: z.array(z.enum(['title_ordered', 'title_search', 'title_issued', 'closed'])).max(4),
  expectedTypes: z.array(z.string()).max(4) }).strict()
export async function PATCH(req: Request) {
  const actor = await requireUser()
  if (!actor) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  try { requireSameOrigin(req) } catch { return NextResponse.json({ error: 'Please use My settings.' }, { status: 403 }) }
  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid choices' }, { status: 400 })
  const types = BORROWER_EMAIL_KINDS.filter(kind => parsed.data.types.includes(kind))
  const changed = await prisma.$transaction(async tx => {
    const result = await tx.user.updateMany({ where: { id: actor.id,
      borrowerEmailDefaults: { equals: parsed.data.expectedTypes } }, data: { borrowerEmailDefaults: types } })
    if (result.count) await tx.notificationLog.create({ data: { userId: actor.id, recipient: actor.email,
      kind: 'borrower_defaults:changed', subject: `Future-file borrower email defaults: ${types.join(', ') || 'off'}`, status: 'skipped' } })
    return result.count
  })
  if (!changed) return NextResponse.json({ error: 'Your defaults changed in another window. Refresh before saving.' }, { status: 409 })
  return NextResponse.json({ ok: true, types })
}
