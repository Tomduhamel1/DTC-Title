import type { Closing } from '@prisma/client'
import { borrowerMayReceive, normalizeEmail, officerConfiguration, PRO_ROLES } from './notificationPolicy'

type Member = { matchedEmail: string; role: string; muted: boolean; mayManageBorrowerEmails: boolean }
type DeliveryGroup = { status: string; _count: { _all: number } }

/** Advisory snapshot only. No queries, writes, retries or sends in this helper. */
export function notificationReadiness(
  closing: Closing & { teammates: Member[]; milestones: { kind: string; status: string }[] },
  groups: DeliveryGroup[],
) {
  const { officer, issues } = officerConfiguration(closing)
  if (!closing.gardenFileNumber) issues.push('Wait for the Garden file identity to be received.')
  const borrower = normalizeEmail(closing.borrowerEmail)
  const eoEmail = normalizeEmail(closing.escrowOfficerEmail)
  const eligible = new Set(closing.teammates.filter(t => t.mayManageBorrowerEmails && !t.muted &&
    PRO_ROLES.includes(t.role) && normalizeEmail(t.matchedEmail) &&
    normalizeEmail(t.matchedEmail) !== borrower && normalizeEmail(t.matchedEmail) !== eoEmail)
    .map(t => normalizeEmail(t.matchedEmail)))
  const counts = { pending: 0, sending: 0, sent: 0, cancelled: 0 }
  for (const key of Object.keys(counts) as (keyof typeof counts)[]) {
    counts[key] = groups.find(g => g.status === key)?._count._all || 0
  }
  return {
    version: 1, checkedAt: new Date().toISOString(),
    eoIntroduction: { configurationReady: Boolean(officer && closing.gardenFileNumber), issues },
    eligibleProCount: eligible.size,
    borrowerUpdatesEnabled: borrowerMayReceive(closing, borrower),
    openingEventRecorded: closing.milestones.some(m => m.kind === 'title_ordered' && m.status === 'done'),
    dryRun: process.env.AUTH_EMAIL_DRY_RUN === 'true',
    milestoneDeliveries: counts,
    deliveryVerified: false,
  }
}
