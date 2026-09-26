import { createHash, randomBytes } from 'crypto'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { PRO_ROLES, normalizeEmail } from '@/lib/closing/notificationPolicy'

// Distinct from NextAuth's email identifiers/hash namespace. No schema change:
// these are short-lived verification credentials, not invitations or grants.
const PREFIX = 'file-access:v1:'
const LIFETIME_MS = 24 * 60 * 60 * 1000
export const validFileId = (id: string) => /^[A-Za-z0-9_-]{1,160}$/.test(id)
const tokenHash = (token: string) => createHash('sha256').update(PREFIX + token).digest('hex')

export function fileAccessOrigin() {
  const url = new URL(process.env.NEXTAUTH_URL || 'https://www.betterclose.co')
  if (url.username || url.password || (url.protocol !== 'https:' &&
    !(url.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(url.hostname)))) {
    throw new Error('Invalid file access origin')
  }
  return url.origin
}

export function fileDestination(closingId: string) {
  if (!validFileId(closingId)) throw new Error('Invalid file identity')
  return `/teammate/dashboard/${encodeURIComponent(closingId)}`
}

async function privilegedRecipient(db: Prisma.TransactionClient, email: string) {
  // Routine file emails must never double as administrator login credentials.
  if ((process.env.ADMIN_EMAILS || '').split(',').map(normalizeEmail).includes(email)) return true
  return (await db.user.findUnique({ where: { email }, select: { accountType: true } }))?.accountType === 'admin'
}

function canonicalAccessEmail(email: string) {
  // The normal NextAuth sign-in endpoint applies NFKC and splits comma suffixes.
  // This handoff bypasses that endpoint: refuse ambiguous identities instead of
  // silently authenticating a different address or rewriting stored membership.
  return email === normalizeEmail(email) && email === email.normalize('NFKC') &&
    /^[\x21-\x7e]+$/.test(email) && /^[^@\s",;<>]+@[^@\s",;<>]+\.[^@\s",;<>]+$/.test(email)
}

async function eligibleRecipient(db: Prisma.TransactionClient, closingId: string, email: string) {
  if (!canonicalAccessEmail(email) || await privilegedRecipient(db, email)) return false
  const member = await db.teammateClosing.findFirst({ where: {
    closingId, matchedEmail: email, role: { in: PRO_ROLES }, mayManageBorrowerEmails: true,
  }, include: { user: true, closing: { select: { borrowerEmail: true, escrowOfficerEmail: true } } } })
  if (!member || member.user?.accountType === 'admin' ||
    (member.user && normalizeEmail(member.user.email) !== email)) return false
  return email !== normalizeEmail(member.closing.borrowerEmail) &&
    email !== normalizeEmail(member.closing.escrowOfficerEmail)
}

/** Called only at the existing authorized Pro notification send boundary. */
export async function createFileAccessLink(closingId: string, recipient: string) {
  const destination = fileDestination(closingId)
  const origin = fileAccessOrigin()
  const email = normalizeEmail(recipient)
  if (!canonicalAccessEmail(email)) throw new Error('File access unavailable')
  if (await privilegedRecipient(prisma, email)) return origin + destination
  if (!process.env.NEXTAUTH_SECRET) throw new Error('File access unavailable')
  const token = randomBytes(32).toString('hex')
  const identifier = PREFIX + JSON.stringify({ closingId, email })
  await prisma.$transaction(async tx => {
    if (!await eligibleRecipient(tx, closingId, email)) throw new Error('File access unavailable')
    await tx.verificationToken.create({ data: {
      identifier, token: tokenHash(token), expires: new Date(Date.now() + LIFETIME_MS),
    } })
  })
  // Fragments aren't sent in HTTP requests or Referer headers. The landing
  // page removes it from browser history and POSTs only after an explicit click.
  return `${origin}/file-access/${encodeURIComponent(closingId)}#key=${token}`
}

/** A GET, preview, or mail scanner must never consume this credential. */
export async function redeemFileAccessLink(closingId: string, token: string): Promise<string | null> {
  if (!validFileId(closingId) || !/^[a-f0-9]{64}$/.test(token)) return null
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) return null
  const origin = fileAccessOrigin()
  const callbackToken = randomBytes(32).toString('hex')
  const now = new Date()
  const email = await prisma.$transaction(async tx => {
    const record = await tx.verificationToken.findUnique({ where: { token: tokenHash(token) } })
    if (!record || record.expires <= now || !record.identifier.startsWith(PREFIX)) return null
    let data: { closingId?: unknown; email?: unknown }
    try { data = JSON.parse(record.identifier.slice(PREFIX.length)) } catch { return null }
    if (data.closingId !== closingId || typeof data.email !== 'string' ||
      normalizeEmail(data.email) !== data.email || !await eligibleRecipient(tx, closingId, data.email)) return null
    // Conditional delete is the atomic single-use gate, including concurrent clicks.
    const used = await tx.verificationToken.deleteMany({ where: {
      token: record.token, identifier: record.identifier, expires: { gt: now },
    } })
    if (used.count !== 1) return null
    // Hand off to the existing NextAuth v4 Email provider, never manufacture a
    // session cookie or grant membership here. Its callback creates/claims the
    // verified user and the destination rechecks live per-file authorization.
    await tx.verificationToken.create({ data: {
      identifier: data.email,
      token: createHash('sha256').update(callbackToken + secret).digest('hex'),
      expires: new Date(now.getTime() + 60 * 1000),
    } })
    return data.email
  })
  if (!email) return null
  const url = new URL('/api/auth/callback/email', origin)
  url.search = new URLSearchParams({ email, token: callbackToken,
    callbackUrl: origin + fileDestination(closingId) }).toString()
  return url.href
}
