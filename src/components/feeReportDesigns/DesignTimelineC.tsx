'use client'

import {
  CATEGORY_LABELS,
  FeeLineItem,
  FeeReport,
  computeTotals,
  formatCurrency,
  formatRange,
  groupByCategory,
} from '@/lib/feeReport'

// Variation C — Status-aware spine (dual-purpose: fees + closing progress)
// Same left spine but nodes carry explicit states. Demonstrates the closing-tracker
// reuse: nodes can be done (filled emerald + check), active (ring + dot), or
// pending (gray ring). The spine fills with a gradient between done items.

export default function DesignTimelineC({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)

  // For demonstration, simulate progress: first 3 items "done", next is "active",
  // remaining are "pending". In real fee-report mode all items would be "done".
  const allItems = report.lineItems
  const doneCount = 3
  const activeIndex = doneCount

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
              {report.transactionType} · {report.state}
            </div>
            <h3 className="text-xl font-bold text-dark-900">Closing fees</h3>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">
              Demo: progress mode
            </div>
            <div className="text-xs text-gray-500">
              {doneCount} of {allItems.length} done
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="relative">
          {/* Spine */}
          <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-200" />
          {/* Filled portion */}
          <div
            className="absolute left-3 top-3 w-0.5 bg-emerald-500 transition-all duration-700"
            style={{ height: `${(doneCount / allItems.length) * 100}%` }}
          />

          {Array.from(grouped.entries()).map(([cat, items], catIdx) => (
            <div key={cat} className={catIdx === 0 ? '' : 'mt-6'}>
              <div className="relative pl-10 mb-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  {CATEGORY_LABELS[cat]}
                </div>
              </div>
              <div className="space-y-3">
                {items.map((item) => {
                  const globalIdx = allItems.indexOf(item)
                  const status: 'done' | 'active' | 'pending' =
                    globalIdx < doneCount
                      ? 'done'
                      : globalIdx === activeIndex
                      ? 'active'
                      : 'pending'
                  return (
                    <StatusRow
                      key={item.id}
                      item={item}
                      state={report.state}
                      status={status}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-sm font-semibold text-gray-600">Total</span>
          <span className="text-3xl font-black text-dark-900 tabular-nums">
            {formatCurrency(totals.ourTotal)}
          </span>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-emerald-900">You save</span>
          <span className="text-xl font-black text-emerald-700 tabular-nums">
            {formatRange(totals.estimatedSavingsLow, totals.estimatedSavingsHigh)}
          </span>
        </div>
      </div>
    </div>
  )
}

function StatusRow({
  item,
  state,
  status,
}: {
  item: FeeLineItem
  state: string
  status: 'done' | 'active' | 'pending'
}) {
  const setBy =
    item.feeSource === 'state'
      ? `Set by ${state}`
      : item.feeSource === 'county'
      ? 'Set by county'
      : null

  return (
    <div className="relative pl-10">
      <div className="absolute left-1 top-1.5">
        <StatusNode status={status} />
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div
            className={`text-[14px] leading-snug ${
              status === 'pending'
                ? 'text-gray-400'
                : status === 'active'
                ? 'font-bold text-dark-900'
                : 'font-medium text-dark-900'
            }`}
          >
            {item.label}
          </div>
          {setBy && (
            <div className="text-[11px] text-gray-400 mt-0.5">{setBy}</div>
          )}
          {!item.isFixed && item.typicalRange && (
            <div className="text-[11px] text-gray-400 mt-0.5">
              Typical {formatRange(item.typicalRange.low, item.typicalRange.high)}
            </div>
          )}
        </div>
        <div
          className={`text-[16px] font-black tabular-nums whitespace-nowrap ${
            status === 'pending'
              ? 'text-gray-300'
              : item.isFixed
              ? 'text-gray-700'
              : 'text-emerald-700'
          }`}
        >
          {formatCurrency(item.ourCost)}
        </div>
      </div>
    </div>
  )
}

function StatusNode({ status }: { status: 'done' | 'active' | 'pending' }) {
  if (status === 'done') {
    return (
      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center ring-4 ring-white shadow-sm">
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
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
  return <div className="w-5 h-5 rounded-full bg-white border-2 border-gray-300 ring-4 ring-white" />
}
