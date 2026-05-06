// Shared milestone-transition logic. Called by:
//   - POST /api/admin/closing/[id]/milestone (admin UI)
//   - POST /api/tps/closings/[id]/milestone  (TPS-side webhooks)
// so both paths run identical side-effects (email fanout, fee-report
// snapshot, idempotency tracking).

import { prisma } from '@/lib/db'
import { MILESTONE_LABELS, type MilestoneKind } from './closing'
import { sendClosingUpdateEmail } from './email/closing-update'
import { sendClosingCompletedEmail } from './email/closing-completed'
import { fetchElendFeeEstimate } from './elendCalc'
import type { FeeReport } from './feeReport'
import { logNotification } from './notificationLog'

function firstName(name?: string | null): string | null {
  if (!name) return null
  return name.split(' ')[0] || null
}

function fullAddress(c: {
  propertyAddress: string | null
  propertyCity: string | null
  propertyState: string | null
  propertyZip: string | null
}): string | null {
  const parts = [c.propertyAddress, c.propertyCity, c.propertyState, c.propertyZip].filter(Boolean)
  return parts.length ? parts.join(', ') : null
}

async function buildSnapshotFeeReport(input: {
  propertyZip: string | null
  loanAmount: number | null
  salePrice: number | null
  propertyType: string | null
}): Promise<FeeReport | null> {
  const zip = input.propertyZip
  if (!zip || !/^\d{5}$/.test(zip)) return null
  const txType: 'purchase' | 'refinance' =
    input.propertyType === 'refinance' ? 'refinance' : 'purchase'
  const homeValue = input.salePrice || 0
  let loanAmount = input.loanAmount || 0
  if (txType === 'purchase' && !loanAmount && homeValue) loanAmount = Math.round(homeValue * 0.8)
  if (!loanAmount) return null
  try {
    return await fetchElendFeeEstimate({ transactionType: txType, zip, homeValue, loanAmount })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[closing-milestone] snapshot fee-estimate failed:', err)
    return null
  }
}

export interface ApplyMilestoneTransitionInput {
  closingId: string
  kind: MilestoneKind
  status: 'pending' | 'active' | 'done'
  // Tag attached to NotificationLog 'kind' so audit shows where the change
  // came from. 'admin' (default) or 'tps'.
  origin?: 'admin' | 'tps'
}

export interface ApplyMilestoneTransitionResult {
  ok: true
  closingId: string
  kind: MilestoneKind
  status: 'pending' | 'active' | 'done'
  emailed: boolean
  snapshotted: boolean
}

export async function applyMilestoneTransition(
  input: ApplyMilestoneTransitionInput,
): Promise<ApplyMilestoneTransitionResult | { ok: false; error: string; status?: number }> {
  const { closingId, kind, status } = input
  const origin = input.origin ?? 'admin'

  const closing = await prisma.closing.findUnique({
    where: { id: closingId },
    include: {
      milestones: true,
      user: { select: { id: true, email: true, name: true } },
    },
  })
  if (!closing) {
    return { ok: false, error: 'not found', status: 404 }
  }

  let milestone = closing.milestones.find((m) => m.kind === kind)
  if (!milestone) {
    milestone = await prisma.milestone.create({
      data: { closingId: closing.id, kind, status: 'pending' },
    })
  }

  const wasDone = milestone.status === 'done'
  const goingToDone = status === 'done'

  const completedAt = goingToDone ? milestone.completedAt || new Date() : milestone.completedAt
  await prisma.milestone.update({
    where: { id: milestone.id },
    data: { status, completedAt: goingToDone ? completedAt : null },
  })

  let emailed = false
  let snapshotted = false
  if (goingToDone && !wasDone && !milestone.notifiedAt) {
    const recipient = closing.borrowerEmail || closing.user?.email
    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.betterclose.co'
    const dashboardUrl = `${baseUrl}/dashboard`
    const dryRun = process.env.AUTH_EMAIL_DRY_RUN === 'true'

    if (recipient) {
      if (kind === 'closed') {
        const snapshot = await buildSnapshotFeeReport(closing)
        await prisma.closing.update({
          where: { id: closing.id },
          data: {
            status: 'closed',
            closedAt: new Date(),
            snapshotFeeReport: snapshot ? (snapshot as unknown as object) : undefined,
          },
        })
        snapshotted = !!snapshot

        const subject = "You're closed! · Your BetterClose savings"
        try {
          const messageId = await sendClosingCompletedEmail({
            to: recipient,
            borrowerFirstName: firstName(closing.user?.name),
            propertyAddress: fullAddress(closing),
            feeReport: snapshot,
            dashboardUrl,
          })
          emailed = true
          await logNotification({
            userId: closing.user?.id || null,
            closingId: closing.id,
            kind: `${origin}:milestone:closed`,
            recipient,
            subject,
            status: dryRun ? 'skipped' : 'sent',
            providerMessageId: messageId,
          })
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[closing-milestone] closing-completed email failed:', err)
          await logNotification({
            userId: closing.user?.id || null,
            closingId: closing.id,
            kind: `${origin}:milestone:closed`,
            recipient,
            subject,
            status: 'failed',
            error: err instanceof Error ? err.message : String(err),
          })
        }
      } else {
        const subject = `${MILESTONE_LABELS[kind]} · BetterClose`
        try {
          const messageId = await sendClosingUpdateEmail({
            to: recipient,
            borrowerFirstName: firstName(closing.user?.name),
            milestoneKind: kind,
            propertyAddress: fullAddress(closing),
            dashboardUrl,
          })
          emailed = true
          await logNotification({
            userId: closing.user?.id || null,
            closingId: closing.id,
            kind: `${origin}:milestone:${kind}`,
            recipient,
            subject,
            status: dryRun ? 'skipped' : 'sent',
            providerMessageId: messageId,
          })
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[closing-milestone] closing-update email failed:', err)
          await logNotification({
            userId: closing.user?.id || null,
            closingId: closing.id,
            kind: `${origin}:milestone:${kind}`,
            recipient,
            subject,
            status: 'failed',
            error: err instanceof Error ? err.message : String(err),
          })
        }
      }

      // Teammate fanout — same email, same milestone, but to anyone named
      // on the file (lender / broker / realtor) who has a BetterClose
      // account and hasn't muted this client.
      if (kind !== 'closed') {
        try {
          const teammates = await prisma.teammateClosing.findMany({
            where: { closingId: closing.id, userId: { not: null } },
            include: { user: { select: { id: true, email: true, name: true } } },
          })
          for (const t of teammates) {
            if (!t.user?.email) continue
            if (recipient && t.user.email.toLowerCase() === recipient.toLowerCase()) continue

            const teammateDashboardUrl = `${baseUrl}/teammate/dashboard/${closing.id}`
            const teammateSubject = `${MILESTONE_LABELS[kind]} · ${fullAddress(closing) || 'BetterClose'}`

            if (t.muted) {
              await logNotification({
                userId: t.user.id,
                closingId: closing.id,
                kind: `teammate:milestone_skipped:${kind}`,
                recipient: t.user.email,
                subject: teammateSubject,
                status: 'skipped',
              })
              continue
            }

            try {
              const messageId = await sendClosingUpdateEmail({
                to: t.user.email,
                borrowerFirstName: firstName(t.user.name),
                milestoneKind: kind,
                propertyAddress: fullAddress(closing),
                dashboardUrl: teammateDashboardUrl,
              })
              await logNotification({
                userId: t.user.id,
                closingId: closing.id,
                kind: `teammate:milestone:${kind}`,
                recipient: t.user.email,
                subject: teammateSubject,
                status: dryRun ? 'skipped' : 'sent',
                providerMessageId: messageId,
              })
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error('[closing-milestone] teammate milestone email failed:', err)
              await logNotification({
                userId: t.user.id,
                closingId: closing.id,
                kind: `teammate:milestone:${kind}`,
                recipient: t.user.email,
                subject: teammateSubject,
                status: 'failed',
                error: err instanceof Error ? err.message : String(err),
              })
            }
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('[closing-milestone] teammate fanout failed:', err)
        }
      }

      await prisma.milestone.update({
        where: { id: milestone.id },
        data: { notifiedAt: new Date() },
      })
    }
  }

  return { ok: true, closingId: closing.id, kind, status, emailed, snapshotted }
}
