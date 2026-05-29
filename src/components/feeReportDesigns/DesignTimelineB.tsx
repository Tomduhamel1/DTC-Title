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

// Variation B — Right-aligned spine
// Spine on the right, content fills the left. Prices sit immediately to the
// right of the spine for a tight number-spine rhythm. This translates very well
// into a status-tracker dashboard where you scan vertically for state.

export default function DesignTimelineB({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
          {report.transactionType} · {report.state}
        </div>
        <h3 className="text-xl font-bold text-dark-900">Closing fees</h3>
      </div>

      <div className="px-6 py-6">
        <div className="relative">
          {/* Spine on right */}
          <div className="absolute right-[88px] top-2 bottom-2 w-px bg-gray-200" />

          {Array.from(grouped.entries()).map(([cat, items], catIdx) => (
            <div key={cat} className={catIdx === 0 ? '' : 'mt-6'}>
              <div className="relative pr-[110px] mb-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 text-right">
                  {CATEGORY_LABELS[cat]}
                </div>
              </div>
              <div className="space-y-4">
                {items.map((item) => (
                  <RightSpineRow key={item.id} item={item} state={report.state} />
                ))}
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

function RightSpineRow({ item, state }: { item: FeeLineItem; state: string }) {
  const setBy =
    item.feeSource === 'state'
      ? `Set by ${state}`
      : item.feeSource === 'county'
      ? 'Set by county'
      : null

  return (
    <div className="relative grid grid-cols-[1fr_auto_80px] gap-3 items-start">
      {/* Label */}
      <div className="pt-0.5 text-right">
        <div className="text-[14px] font-medium text-dark-900 leading-snug">{item.label}</div>
        {setBy && <div className="text-[11px] text-gray-400 mt-0.5">{setBy}</div>}
        {!item.isFixed && item.typicalRange && (
          <div className="text-[11px] text-gray-400 mt-0.5">
            Typical {formatRange(item.typicalRange.low, item.typicalRange.high)}
          </div>
        )}
      </div>
      {/* Node */}
      <div className="flex items-start justify-center pt-1.5">
        <div
          className={`relative z-10 rounded-full ring-4 ring-white ${
            item.isFixed ? 'w-2 h-2 bg-gray-300' : 'w-3 h-3 bg-emerald-500 shadow'
          }`}
        />
      </div>
      {/* Price */}
      <div className="text-right">
        <div
          className={`text-[16px] font-black tabular-nums leading-tight ${
            item.isFixed ? 'text-gray-700' : 'text-emerald-700'
          }`}
        >
          {formatCurrency(item.ourCost)}
        </div>
      </div>
    </div>
  )
}
