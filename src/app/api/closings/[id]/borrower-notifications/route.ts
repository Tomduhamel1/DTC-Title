import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth/session'
import { borrowerPermission, normalizeEmail, PRO_ROLES } from '@/lib/closing/notificationPolicy'
import { BORROWER_EMAIL_KINDS } from '@/lib/closing/notificationChoices'
import { requireSameOrigin } from '@/lib/fileWorkspace/access'

const Body = z.union([
  z.object({ types: z.array(z.enum(['title_ordered', 'title_search', 'title_issued', 'closed'])).max(4),
    expectedVersion: z.string().nullable(), recipient: z.string() }).strict(),
  // Keep already-open legacy pages functional; new UI always sends a version.
  z.object({ enabled: z.boolean() }).strict(),
])

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const actor = await requireUser()
  if (!actor) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  try { requireSameOrigin(req) } catch { return NextResponse.json({ error: 'Please use this file’s notification settings.' }, { status: 403 }) }
  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  const result = await prisma.$transaction(async tx => {
    const closing = await tx.closing.findUnique({ where: { id: params.id } })
    if (!closing) return null
    const self = closing.userId === actor.id && normalizeEmail(actor.email) === normalizeEmail(closing.borrowerEmail)
    const member = await tx.teammateClosing.findFirst({ where: { closingId: closing.id,
      userId: actor.id, matchedEmail: normalizeEmail(actor.email), role: { in: PRO_ROLES }, mayManageBorrowerEmails: true } })
    if (!self && !member) return null
    const input = parsed.data
    if ('types' in input && (input.expectedVersion !== closing.borrowerEmailPermissionVersion ||
      normalizeEmail(input.recipient) !== normalizeEmail(closing.borrowerEmail))) return 'conflict'
    const types = 'types' in input ? BORROWER_EMAIL_KINDS.filter(kind => input.types.includes(kind)) :
      input.enabled ? closing.borrowerEmailTypes.length ? [...closing.borrowerEmailTypes] : [...BORROWER_EMAIL_KINDS] : []
    // Type choices can be saved before a recipient exists. They are not an
    // opt-in: a later explicit save must bind permission to the actual address.
    // Legacy boolean callers still cannot enable without an address.
    const enabled = 'enabled' in input ? input.enabled : types.length > 0 && Boolean(normalizeEmail(closing.borrowerEmail))
    if (enabled && !normalizeEmail(closing.borrowerEmail)) return 'missing_recipient'
    const pendingRecipientConfirmation = 'types' in input && types.length > 0 && !enabled
    if (closing.borrowerEmailPermissionVersion && closing.borrowerEmailsEnabled === enabled &&
      normalizeEmail(closing.borrowerEmailPermissionRecipient) === normalizeEmail(closing.borrowerEmail) &&
      (!pendingRecipientConfirmation || closing.borrowerEmailPermissionSource === 'pro_pending') &&
      JSON.stringify([...closing.borrowerEmailTypes].sort()) === JSON.stringify([...types].sort())) {
      return { enabled, types, version: closing.borrowerEmailPermissionVersion, pendingRecipientConfirmation }
    }
    const data = { ...borrowerPermission(closing.borrowerEmail || '', actor.id, pendingRecipientConfirmation ? 'pro_pending' : self ? 'borrower' : 'pro', enabled),
      borrowerEmailTypes: 'enabled' in input && !enabled ? closing.borrowerEmailTypes : types }
    const changed = await tx.closing.updateMany({ where: { id: closing.id,
      borrowerEmailPermissionVersion: closing.borrowerEmailPermissionVersion, borrowerEmail: closing.borrowerEmail }, data })
    if (!changed.count) return 'conflict'
    await tx.notificationLog.create({ data: { closingId: closing.id, userId: actor.id,
      kind: pendingRecipientConfirmation ? 'borrower_preferences:pending_recipient' : enabled ? 'borrower_permission:on' : 'borrower_permission:off', recipient: actor.email,
      subject: `Borrower email choices changed: ${pendingRecipientConfirmation ? 'pending recipient: ' + types.join(', ') : enabled ? types.join(', ') : 'off'}`, status: 'skipped' } })
    return { enabled, types: enabled || pendingRecipientConfirmation ? types : [], version: data.borrowerEmailPermissionVersion, pendingRecipientConfirmation }
  })
  if (result === null) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (result === 'conflict') return NextResponse.json({ error: 'These settings or the borrower changed. Refresh the file before saving.' }, { status: 409 })
  if (result === 'missing_recipient') return NextResponse.json({ error: 'Add the borrower email before enabling updates.' }, { status: 409 })
  return NextResponse.json({ ok: true, ...result })
}
