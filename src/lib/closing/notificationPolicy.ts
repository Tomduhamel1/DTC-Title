import { randomUUID } from 'crypto'
export const PRO_ROLES = ['broker', 'realtor', 'lender']
export const normalizeEmail = (value: string | null | undefined) => value?.trim().toLowerCase() || ''

type Permission = {
  borrowerEmailsEnabled?: boolean
  borrowerEmailPermissionRecipient?: string | null
  borrowerEmailPermissionAt?: Date | null
  borrowerEmailPermissionVersion?: string | null
  borrowerEmail?: string | null
}

export function borrowerMayReceive(closing: Permission, recipient: string, version?: string | null) {
  return closing.borrowerEmailsEnabled === true && Boolean(normalizeEmail(recipient)) &&
    normalizeEmail(closing.borrowerEmail) === normalizeEmail(recipient) &&
    normalizeEmail(closing.borrowerEmailPermissionRecipient) === normalizeEmail(recipient) &&
    Boolean(closing.borrowerEmailPermissionAt && closing.borrowerEmailPermissionVersion) &&
    (version === undefined || version === closing.borrowerEmailPermissionVersion)
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
export function verifiedOfficer(closing: {
  escrowOfficerName: string | null; escrowOfficerTitle: string | null;
  escrowOfficerEmail: string | null; escrowOfficerPhotoUrl: string | null;
  escrowOfficerPhone: string | null;
}): OfficerIntroduction | null {
  try {
    const routes = JSON.parse(process.env.BC_EO_REPLY_ROUTES || '{}')
    const reply = routes[normalizeEmail(closing.escrowOfficerEmail)]
    if (typeof reply !== 'string' || !/^[a-z0-9.!#$%&'*+\-/=?^_`{|}~]+@betterclose\.co$/i.test(reply)) return null
    const name = closing.escrowOfficerName?.trim()
    const photo = new URL(closing.escrowOfficerPhotoUrl || '')
    if (!name || /[\r\n]/.test(name) || photo.protocol !== 'https:' || photo.username || photo.password) return null
    return { name, title: closing.escrowOfficerTitle || 'Escrow Officer',
      photoUrl: photo.href, replyEmail: reply.toLowerCase(), phone: closing.escrowOfficerPhone }
  } catch { return null }
}
