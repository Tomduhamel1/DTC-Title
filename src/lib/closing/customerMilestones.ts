import type { MilestoneKind } from '@/lib/closing'

// Customer progress tracks title work only. Keep legacy loan_locked records
// and the integration contract intact; they do not affect this presentation.
export const CUSTOMER_MILESTONE_KINDS = [
  'title_ordered',
  'title_search',
  'title_issued',
  'closed',
] as const satisfies readonly MilestoneKind[]

export function customerMilestoneProgress<T extends { kind: string; status: string }>(milestones: readonly T[]) {
  const byKind = new Map(milestones.map((milestone) => [milestone.kind, milestone]))
  const visible = CUSTOMER_MILESTONE_KINDS.flatMap((kind) => {
    const milestone = byKind.get(kind)
    return milestone ? [milestone] : []
  })
  const doneCount = visible.filter((milestone) => milestone.status === 'done').length
  const totalCount = CUSTOMER_MILESTONE_KINDS.length
  return {
    byKind,
    doneCount,
    totalCount,
    activeMilestone: visible.find((milestone) => milestone.status === 'active'),
    fillPct: (doneCount / totalCount) * 100,
  }
}
