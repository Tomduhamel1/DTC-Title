'use client'

import { MILESTONE_KINDS, MILESTONE_LABELS, MILESTONE_DESCRIPTIONS, type MilestoneKind } from '@/lib/closing'

interface Milestone {
  kind: string
  status: string
  completedAt?: Date | string | null
  metadata?: string | null
}

interface MilestoneTimelineProps {
  milestones: Milestone[]
  closingDate?: Date | string | null
}

export default function MilestoneTimeline({ milestones, closingDate }: MilestoneTimelineProps) {
  // Index by kind for quick lookup
  const byKind = new Map(milestones.map((m) => [m.kind, m]))
  const doneCount = milestones.filter((m) => m.status === 'done').length
  const activeIndex = milestones.findIndex((m) => m.status === 'active')

  const fillPct = (doneCount / MILESTONE_KINDS.length) * 100

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
            Closing progress
          </div>
          <h3 className="text-xl font-black text-dark-900">
            {doneCount === 0
              ? 'Ready when your lender places the order'
              : doneCount === MILESTONE_KINDS.length
              ? 'Closed!'
              : `${doneCount} of ${MILESTONE_KINDS.length} milestones complete`}
          </h3>
        </div>
        {closingDate && (
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Target close
            </div>
            <div className="text-base font-bold text-dark-900">
              {new Date(closingDate).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-7">
        <div className="relative">
          <div className="absolute left-[10px] top-2 bottom-2 w-0.5 bg-gray-200" />
          <div
            className="absolute left-[10px] top-2 w-0.5 bg-emerald-500 transition-all duration-700"
            style={{ height: `${fillPct}%` }}
          />

          <ol className="space-y-5">
            {MILESTONE_KINDS.map((kind, idx) => {
              const m = byKind.get(kind)
              const status: 'done' | 'active' | 'pending' =
                (m?.status as 'done' | 'active' | 'pending') ||
                (idx === activeIndex ? 'active' : 'pending')

              return (
                <li key={kind} className="relative pl-10">
                  <div className="absolute left-0 top-0">
                    <StatusNode status={status} />
                  </div>
                  <div>
                    <div
                      className={`text-[15px] leading-tight ${
                        status === 'pending'
                          ? 'text-gray-400'
                          : status === 'active'
                          ? 'font-bold text-dark-900'
                          : 'font-semibold text-dark-900'
                      }`}
                    >
                      {MILESTONE_LABELS[kind as MilestoneKind]}
                    </div>
                    <div
                      className={`text-[12px] mt-0.5 ${
                        status === 'pending' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {MILESTONE_DESCRIPTIONS[kind as MilestoneKind]}
                    </div>
                    {status === 'done' && m?.completedAt && (
                      <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                        ✓ Completed {new Date(m.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}

function StatusNode({ status }: { status: 'done' | 'active' | 'pending' }) {
  if (status === 'done') {
    return (
      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center ring-4 ring-white shadow-sm">
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )
  }
  if (status === 'active') {
    return (
      <div className="w-5 h-5 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center ring-4 ring-white">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    )
  }
  return (
    <div className="w-5 h-5 rounded-full bg-white border-2 border-gray-300 ring-4 ring-white" />
  )
}
