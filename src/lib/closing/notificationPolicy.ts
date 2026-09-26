import { randomUUID } from 'crypto'
import { officerPhotoUrl } from './officerPhoto'
export const PRO_ROLES = ['broker', 'realtor', 'lender']
export const normalizeEmail = (value: string | null | undefined) => value?.trim().toLowerCase() || ''

type Permission = {
  borrowerEmailsEnabled?: boolean
  borrowerEmailPermissionRecipient?: string | null
  borrowerEmailPermissionAt?: Date | null
  borrowerEmailPermissionVersion?: string | null
  borrowerEmail?: string | null
  borrowerEmailTypes?: string[]
}

export function borrowerMayReceive(closing: Permission, recipient: string, version?: string | null, kind?: string) {
  return closing.borrowerEmailsEnabled === true && Boolean(normalizeEmail(recipient)) &&
    normalizeEmail(closing.borrowerEmail) === normalizeEmail(recipient) &&
    normalizeEmail(closing.borrowerEmailPermissionRecipient) === normalizeEmail(recipient) &&
    Boolean(closing.borrowerEmailPermissionAt && closing.borrowerEmailPermissionVersion) &&
    (version === undefined || version === closing.borrowerEmailPermissionVersion) &&
    (kind === undefined || Boolean(closing.borrowerEmailTypes?.includes(kind)))
}

export function borrowerPermission(email: string, actorId: string, source: 'pro' | 'borrower', enabled: boolean) {
  return { borrowerEmailsEnabled: enabled, borrowerEmailPermissionRecipient: normalizeEmail(email),
    borrowerEmailPermissionBy: actorId, borrowerEmailPermissionSource: source,
    borrowerEmailPermissionAt: new Date(), borrowerEmailPermissionVersion: randomUUID() }
}

export type OfficerIntroduction = { name: string; title: string; photoUrl: string; replyEmail: string; phone?: string | null }

// Operator-maintained allowlist ONLY after mailbox/forwarding and controlled
// reply verification. Garden/admin contact data cannot declare itself verified.
// Keys: actual Garden EO email. Values: working EO-owned @betterclose.co alias.
type OfficerFields = {
  escrowOfficerName: string | null; escrowOfficerTitle: string | null;
  escrowOfficerEmail: string | null; escrowOfficerPhotoUrl: string | null;
  escrowOfficerPhone: string | null;
}

// Shared by delivery and the read-only operator check. Config presence is not
// proof of mailbox ownership, photo availability or provider delivery.
export function officerConfiguration(closing: OfficerFields): { officer: OfficerIntroduction | null; issues: string[] } {
  const issues: string[] = []
  const name = closing.escrowOfficerName?.trim()
  const email = normalizeEmail(closing.escrowOfficerEmail)
  if (!name || /[\r\n]/.test(name)) issues.push('Add the assigned Escrow Officer name.')
  if (!email) issues.push('Add the assigned Escrow Officer email.')
  let photo: URL | undefined
  try {
    photo = new URL(officerPhotoUrl(closing) || '')
    if (photo.protocol !== 'https:' || photo.username || photo.password) throw new Error('invalid')
  } catch { issues.push('Add a valid HTTPS photo for the assigned Escrow Officer.') }
  let reply: unknown
  try {
    const routes = JSON.parse(process.env.BC_EO_REPLY_ROUTES || '{}')
    if (!routes || typeof routes !== 'object' || Array.isArray(routes)) throw new Error('invalid')
    reply = Object.hasOwn(routes, email) ? routes[email] : undefined
    if (typeof reply !== 'string' || !/^[a-z0-9.!#$%&'*+\-/=?^_`{|}~]+@betterclose\.co$/i.test(reply)) {
      issues.push('Configure the EO BetterClose reply address after verifying its mailbox or forwarding.')
    }
  } catch { issues.push('Correct the server EO reply-routing configuration.') }
  return { issues, officer: issues.length ? null : {
    name: name!, title: closing.escrowOfficerTitle || 'Escrow Officer',
    photoUrl: photo!.href, replyEmail: (reply as string).toLowerCase(), phone: closing.escrowOfficerPhone,
  } }
}

export function verifiedOfficer(closing: OfficerFields): OfficerIntroduction | null {
  return officerConfiguration(closing).officer
}
