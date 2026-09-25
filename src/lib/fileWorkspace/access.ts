import crypto from 'crypto'
import { prisma } from '@/lib/db'
import { requireUser } from '@/lib/auth/session'
import { isAdminEmail } from '@/lib/auth/admin'

import { WorkspaceError } from './errors'
export { WorkspaceError } from './errors'
export type FileActor = { id: string; staff: boolean; garden: boolean }

// Membership is checked on EVERY request, including download and confirmation.
// A displayed EO name/email and borrower-notification permission confer no access.
export async function fileActor(req: Request, closingId: string, garden = false): Promise<FileActor> {
  if (garden) {
    const secret = process.env.ORDER_INGEST_SECRET
    const provided = req.headers.get('authorization') || ''
    const expected = `Bearer ${secret || ''}`
    if (!secret || Buffer.byteLength(provided) !== Buffer.byteLength(expected) ||
        !crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) throw new WorkspaceError(401, 'Sign in required')
    const orderId = req.headers.get('x-garden-order-id') || ''
    const fileNumber = req.headers.get('x-garden-file-number') || ''
    const operator = req.headers.get('x-garden-actor-id') || ''
    if (!/^[0-9a-f-]{36}$/i.test(orderId) || !/^[1-9][0-9]*$/.test(operator) || !fileNumber) {
      throw new WorkspaceError(400, 'Garden file identity and operator are required')
    }
    const closing = await prisma.closing.findFirst({ where: { id: closingId, gardenOrderId: orderId.toLowerCase(), gardenFileNumber: fileNumber }, select: { id: true } })
    if (!closing) throw new WorkspaceError(404, 'File not found')
    return { id: `garden:${operator}`, staff: true, garden: true }
  }
  const user = await requireUser()
  if (!user) throw new WorkspaceError(401, 'Sign in required')
  const closing = await prisma.closing.findUnique({ where: { id: closingId }, select: { userId: true } })
  const staff = isAdminEmail(user.email)
  const member = closing && !staff && closing.userId !== user.id
    ? await prisma.teammateClosing.findFirst({ where: { closingId, userId: user.id, matchedEmail: user.email.toLowerCase() }, select: { id: true } }) : null
  if (!closing || (!staff && closing.userId !== user.id && !member)) throw new WorkspaceError(404, 'File not found')
  return { id: user.id, staff, garden: false }
}

export async function fileRecipients(closingId: string) {
  const closing = await prisma.closing.findUniqueOrThrow({ where: { id: closingId }, include: {
    user: { select: { id: true, name: true, email: true } },
    teammates: { include: { user: { select: { id: true, name: true, email: true } } } },
  } })
  const recipients = new Map<string, { id: string; label: string }>()
  if (closing.user) recipients.set(closing.user.id, { id: closing.user.id, label: `Borrower — ${closing.user.name || closing.user.email}` })
  for (const member of closing.teammates) {
    if (member.user && member.user.email.toLowerCase() === member.matchedEmail.toLowerCase() && !recipients.has(member.user.id)) {
      recipients.set(member.user.id, { id: member.user.id, label: `${member.role} — ${member.user.name || member.user.email}` })
    }
  }
  return [...recipients.values()]
}

export function requireStaff(actor: FileActor) {
  if (!actor.staff) throw new WorkspaceError(403, 'Only the closing team can change sharing or estimates')
}

export function requireSameOrigin(req: Request) {
  // Session-authenticated mutations cannot be submitted cross-site.
  const origin = req.headers.get('origin')
  const expected = new URL(process.env.NEXTAUTH_URL || req.url).origin
  if (!origin || origin !== expected) throw new WorkspaceError(403, 'Please use the file page to make this change')
}
