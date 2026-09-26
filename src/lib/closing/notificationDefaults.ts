import type { Prisma } from '@prisma/client'
import { borrowerPermission, normalizeEmail, PRO_ROLES } from './notificationPolicy'
import { BORROWER_EMAIL_KINDS } from './notificationChoices'

// Called only by new-file creation, never by refresh, sign-in, a settings save,
// or a milestone retry. No authority is inferred from an unverified contact.
export async function seedNewFileBorrowerDefaults(tx: Prisma.TransactionClient, closingId: string, orderingEmail?: string | null) {
  const c = await tx.closing.findUniqueOrThrow({ where: { id: closingId }, include: {
    teammates: { where: { mayManageBorrowerEmails: true, role: { in: PRO_ROLES } }, include: { user: true } },
  } })
  if (c.borrowerEmailPermissionVersion || !c.teammates.length) return
  // Creation paths supply the ordering contact. Use that account's defaults,
  // not another participant's. Without a known orderer, retain consensus-only
  // behavior; never infer the orderer from member order or a browser argument.
  const members = normalizeEmail(orderingEmail)
    ? c.teammates.filter(member => normalizeEmail(member.matchedEmail) === normalizeEmail(orderingEmail)) : c.teammates
  if (!members.length) return
  const choices = members.map(member => {
    if (!member.user?.emailVerified || normalizeEmail(member.user.email) !== normalizeEmail(member.matchedEmail) ||
      normalizeEmail(member.matchedEmail) === normalizeEmail(c.borrowerEmail) ||
      normalizeEmail(member.matchedEmail) === normalizeEmail(c.escrowOfficerEmail)) return []
    return BORROWER_EMAIL_KINDS.filter(kind => member.user!.borrowerEmailDefaults.includes(kind))
  })
  const types = choices[0]
  if (!types.length || choices.some(value => JSON.stringify(value) !== JSON.stringify(types))) return
  const actor = members[0].user!
  const recipient = normalizeEmail(c.borrowerEmail)
  const changed = await tx.closing.updateMany({ where: { id: closingId, borrowerEmailPermissionVersion: null,
    borrowerEmail: c.borrowerEmail }, data: { ...borrowerPermission(recipient, actor.id, recipient ? 'pro' : 'pro_pending', Boolean(recipient)), borrowerEmailTypes: types } })
  if (changed.count) await tx.notificationLog.create({ data: { closingId, userId: actor.id,
    recipient: actor.email, kind: 'borrower_permission:defaults', status: 'skipped',
    subject: `New-file borrower email defaults: ${types.join(', ')}` } })
}
