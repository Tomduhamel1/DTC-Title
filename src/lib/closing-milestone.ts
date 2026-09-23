// Shared milestone-transition logic. Called by:
//   - POST /api/admin/closing/[id]/milestone (admin UI)
//   - POST /api/tps/closings/[id]/milestone  (TPS-side webhooks)
// so both paths run identical side-effects (email fanout, fee-report
// snapshot, idempotency tracking).

import { prisma } from '@/lib/db'
import { type MilestoneKind } from './closing'
import { Prisma } from '@prisma/client'
import { borrowerMayReceive, normalizeEmail, PRO_ROLES } from '@/lib/closing/notificationPolicy'
import { deliverMilestoneNotifications } from '@/lib/closing/milestoneDelivery'
import { fetchElendFeeEstimate } from './elendCalc'
import type { FeeReport } from './feeReport'

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
    // skipAvailabilityCheck: existing closings must snapshot even in states
    // that have since been switched OFF in stateMaster.
    return await fetchElendFeeEstimate(
      { transactionType: txType, zip, homeValue, loanAmount },
      { skipAvailabilityCheck: true },
    )
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
  const before = await prisma.closing.findUnique({ where: { id: closingId } })
  if (!before) return { ok: false, error: 'not found', status: 404 }
  // External fee lookup outside the short write transaction.
  const fees = kind === 'closed' && status === 'done' && !before.closedAt
    ? await buildSnapshotFeeReport(before) : null
  let snapshotted = false
  try {
    await prisma.$transaction(async tx => {
      const c = await tx.closing.findUniqueOrThrow({ where: { id: closingId } })
      const m = await tx.milestone.upsert({ where: { closingId_kind: { closingId, kind } },
        create: { closingId, kind, status: 'pending' }, update: {} })
      const prepare = status === 'done' && m.status !== 'done' && !m.deliveryPreparedAt && !m.notifiedAt
      await tx.milestone.update({ where: { id: m.id }, data: {
        status, completedAt: status === 'done' ? m.completedAt || new Date() : null,
        ...(status === 'done' && !m.deliveryPreparedAt ? { deliveryPreparedAt: new Date() } : {}),
      } })
      if (kind === 'closed' && status === 'done' && !c.closedAt) {
        await tx.closing.update({ where: { id: closingId }, data: { status: 'closed', closedAt: new Date(),
          ...(fees ? { snapshotFeeReport: fees as unknown as Prisma.InputJsonValue } : {}) } })
        snapshotted = Boolean(fees)
      }
      if (!prepare) return // No historical replay on enabling permission or retries.
      const queue = async (audience: string, recipient: string) => {
        const deliveryKind = 'milestone:' + kind + ':' + audience
        await tx.ingestDelivery.upsert({ where: {
          closingId_kind_recipient: { closingId, kind: deliveryKind, recipient },
        }, create: { closingId, kind: deliveryKind, recipient,
          payload: { kind, audience, permissionVersion: c.borrowerEmailPermissionVersion } }, update: {} })
      }
      const recipient = normalizeEmail(c.borrowerEmail)
      if (borrowerMayReceive(c, recipient)) await queue('borrower', recipient)
      const pros = await tx.teammateClosing.findMany({ where: { closingId,
        role: { in: PRO_ROLES }, muted: false, mayManageBorrowerEmails: true } })
      for (const pro of pros) {
        const email = normalizeEmail(pro.matchedEmail)
        if (email && email !== recipient && email !== normalizeEmail(c.escrowOfficerEmail)) await queue('pro', email)
      }
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
    const delivery = await deliverMilestoneNotifications(closingId)
    if (delivery.pending) return { ok: false, error: 'notification_pending', status: 503 }
    const accepted = await prisma.ingestDelivery.count({ where: { closingId,
      kind: { startsWith: 'milestone:' + kind + ':' }, status: 'sent' } })
    if (accepted) await prisma.milestone.update({ where: { closingId_kind: { closingId, kind } },
      data: { notifiedAt: new Date() } })
    return { ok: true, closingId, kind, status, emailed: delivery.sent > 0, snapshotted }
  } catch {
    // A transient transaction/queue error must be retried, never acknowledged
    // as a successful send. No database/contact details in the API response.
    return { ok: false, error: 'notification_pending', status: 503 }
  }
}
