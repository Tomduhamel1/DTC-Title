import { randomUUID } from 'crypto'
import { prisma } from '@/lib/db'
import { MILESTONE_KINDS, type MilestoneKind } from '@/lib/closing'
import { borrowerMayReceive, normalizeEmail, PRO_ROLES, verifiedOfficer } from '@/lib/closing/notificationPolicy'
import { sendClosingUpdateEmail } from '@/lib/email/closing-update'
import { sendClosingUpdateTeammateEmail } from '@/lib/email/closing-update-teammate'
import { sendClosingCompletedEmail } from '@/lib/email/closing-completed'
import { sendEOIntroductionEmail } from '@/lib/email/eo-introduction'
import type { TeammateRole } from '@/lib/professional/pronoun'
import type { FeeReport } from '@/lib/feeReport'
import { createFileAccessLink } from '@/lib/auth/fileAccess'

// Durable per-recipient intents. At-least-once: provider acceptance followed
// by a process crash before recording sent may resend. Never claim exactly-once.
export async function deliverMilestoneNotifications(closingId: string) {
  const items = await prisma.ingestDelivery.findMany({ where: {
    closingId, kind: { startsWith: 'milestone:' }, status: { in: ['pending', 'sending'] },
  }, orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] })
  let sent = 0
  for (const item of items) {
    const leaseToken = randomUUID()
    const claimed = await prisma.ingestDelivery.updateMany({ where: { id: item.id, OR: [
      { status: 'pending' }, { status: 'sending', leaseUntil: { lt: new Date() } },
    ] }, data: { status: 'sending', leaseToken, leaseUntil: new Date(Date.now() + 300000), attempts: { increment: 1 } } })
    if (!claimed.count) continue
    const finish = (status: string, lastError: string | null) => prisma.ingestDelivery.updateMany({
      where: { id: item.id, leaseToken }, data: { status, lastError, leaseToken: null, leaseUntil: null },
    })
    try {
      const c = await prisma.closing.findUnique({ where: { id: closingId }, include: { user: true, milestones: true } })
      const p = item.payload as { kind: MilestoneKind; audience: string; permissionVersion?: string | null }
      const milestone = c?.milestones.find(m => m.kind === p.kind)
      if (!c || !MILESTONE_KINDS.includes(p.kind) || milestone?.status !== 'done') {
        await finish('cancelled', 'milestone_no_longer_done'); continue
      }
      const base = process.env.NEXTAUTH_URL || 'https://www.betterclose.co'
      const address = [c.propertyAddress, c.propertyCity, c.propertyState, c.propertyZip].filter(Boolean).join(', ')
      let messageId: string | null = null
      if (p.audience === 'borrower') {
        // Re-read at delivery/retry. Revoking and re-enabling cannot release an
        // old intent because each explicit permission change has a new version.
        if (!borrowerMayReceive(c, item.recipient, p.permissionVersion ?? null, p.kind)) {
          await finish('cancelled', 'borrower_permission_changed'); continue
        }
        const common = { to: item.recipient, borrowerFirstName: c.user?.name?.split(' ')[0],
          propertyAddress: address, dashboardUrl: `${base}/dashboard?closingId=${encodeURIComponent(c.id)}` }
        messageId = p.kind === 'closed'
          ? await sendClosingCompletedEmail({ ...common, feeReport: c.snapshotFeeReport as unknown as FeeReport | null })
          : await sendClosingUpdateEmail({ ...common, milestoneKind: p.kind })
      } else if (p.audience === 'pro') {
        const member = await prisma.teammateClosing.findFirst({ where: { closingId,
          matchedEmail: item.recipient, role: { in: PRO_ROLES }, mayManageBorrowerEmails: true }, include: { user: true } })
        if (!member || member.muted || normalizeEmail(c.borrowerEmail) === item.recipient ||
          normalizeEmail(c.escrowOfficerEmail) === item.recipient) {
          await finish('cancelled', 'pro_unsubscribed_or_no_longer_eligible'); continue
        }
        if (p.kind === 'title_ordered') {
          const officer = verifiedOfficer(c)
          if (!officer || !c.gardenFileNumber) {
            await finish('pending', 'eo_introduction_not_ready'); continue
          }
          const dashboardUrl = await createFileAccessLink(c.id, item.recipient)
          messageId = await sendEOIntroductionEmail({ to: item.recipient, propertyAddress: address,
            gardenFileNumber: c.gardenFileNumber, dashboardUrl, officer })
        } else {
          const dashboardUrl = await createFileAccessLink(c.id, item.recipient)
          messageId = await sendClosingUpdateTeammateEmail({ to: item.recipient,
            recipientFirstName: member.user?.name?.split(' ')[0], role: member.role as TeammateRole,
            milestoneKind: p.kind, propertyAddress: address, borrowerName: c.user?.name,
            teammateDashboardUrl: dashboardUrl })
        }
      } else { await finish('cancelled', 'unknown_audience'); continue }
      if (!messageId) throw new Error('provider_not_accepted')
      const markedSent = await prisma.$transaction(async tx => {
        const marked = await tx.ingestDelivery.updateMany({ where: { id: item.id, leaseToken }, data: {
          status: 'sent', sentAt: new Date(), lastError: null, leaseToken: null, leaseUntil: null,
        } })
        if (marked.count) await tx.notificationLog.create({ data: { closingId, kind: item.kind,
          recipient: item.recipient, subject: p.kind === 'title_ordered' && p.audience === 'pro'
            ? 'File opened — Escrow Officer introduction' : `File milestone: ${p.kind}`,
          status: 'sent', providerMessageId: messageId } })
        return marked.count > 0
      })
      if (markedSent) sent++
    } catch {
      await finish('pending', 'email_delivery_pending')
    }
  }
  const pending = await prisma.ingestDelivery.count({ where: { closingId,
    kind: { startsWith: 'milestone:' }, status: { in: ['pending', 'sending'] } } })
  return { sent, pending }
}
