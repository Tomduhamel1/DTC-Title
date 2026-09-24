import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth/session'
import { borrowerPermission, normalizeEmail, PRO_ROLES } from '@/lib/closing/notificationPolicy'

const Body = z.object({ enabled: z.boolean() }).strict()

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const actor = await requireUser()
  if (!actor) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  const result = await prisma.$transaction(async tx => {
    const closing = await tx.closing.findUnique({ where: { id: params.id } })
    if (!closing) return null
    const self = closing.userId === actor.id && normalizeEmail(actor.email) === normalizeEmail(closing.borrowerEmail)
    const member = await tx.teammateClosing.findFirst({ where: { closingId: closing.id,
      userId: actor.id, matchedEmail: normalizeEmail(actor.email), role: { in: PRO_ROLES }, mayManageBorrowerEmails: true } })
    if (!self && !member) return null
    if (parsed.data.enabled && !normalizeEmail(closing.borrowerEmail)) return 'missing_recipient'
    if (closing.borrowerEmailsEnabled === parsed.data.enabled &&
      normalizeEmail(closing.borrowerEmailPermissionRecipient) === normalizeEmail(closing.borrowerEmail)) return parsed.data.enabled
    const data = borrowerPermission(closing.borrowerEmail || '', actor.id, self ? 'borrower' : 'pro', parsed.data.enabled)
    await tx.closing.update({ where: { id: closing.id }, data })
    // Permissions and their audit record commit together. Never send/replay on toggle.
    await tx.notificationLog.create({ data: { closingId: closing.id, userId: actor.id,
      kind: parsed.data.enabled ? 'borrower_permission:on' : 'borrower_permission:off',
      recipient: actor.email, subject: 'Automatic borrower file email permission changed',
      status: 'skipped' } })
    return data.borrowerEmailsEnabled
  })
  if (result === null) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (result === 'missing_recipient') return NextResponse.json({ error: 'Add the borrower email before enabling updates.' }, { status: 409 })
  return NextResponse.json({ ok: true, enabled: result })
}
