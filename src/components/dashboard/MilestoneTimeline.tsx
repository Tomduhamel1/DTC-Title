'use client'

import { MILESTONE_LABELS, MILESTONE_DESCRIPTIONS } from '@/lib/closing'
import { CUSTOMER_MILESTONE_KINDS, customerMilestoneProgress } from '@/lib/closing/customerMilestones'
import StatusNode from './StatusNode'
import type { Prisma } from '@prisma/client'

export interface Milestone {
  kind: string
  status: string
  completedAt?: Date | string | null
  metadata?: Prisma.JsonValue
}

interface MilestoneTimelineProps {
  milestones: Milestone[]
  closingDate?: Date | string | null
}

export default function MilestoneTimeline({ milestones, closingDate }: MilestoneTimelineProps) {
  const { byKind, doneCount, totalCount, fillPct } = customerMilestoneProgress(milestones)

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
            Closing progress
          </div>
          <h3 className="text-xl font-black text-dark-900">
            {doneCount === 0
              ? 'Ready when your closing team opens the order'
              : doneCount === totalCount
              ? 'Closed!'
              : `${doneCount} of ${totalCount} milestones complete`}
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
            {CUSTOMER_MILESTONE_KINDS.map((kind) => {
              const m = byKind.get(kind)
              const status: 'done' | 'active' | 'pending' =
                m?.status === 'done' || m?.status === 'active' ? m.status : 'pending'

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
                      {MILESTONE_LABELS[kind]}
                    </div>
                    <div
                      className={`text-[12px] mt-0.5 ${
                        status === 'pending' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {MILESTONE_DESCRIPTIONS[kind]}
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
