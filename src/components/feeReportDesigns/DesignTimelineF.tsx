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

// Variation F — Quiet emerald (refined Original)
// Refined version of the Original. Smaller spine, smaller nodes. Prices all in
// the same dark color so the table feels unified. Emerald is a cue, not the star.

export default function DesignTimelineF({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
          {report.transactionType} · {report.state} · {formatCurrency(report.homeValue)}
        </div>
        <h3 className="text-xl font-bold text-dark-900">Closing fees</h3>
      </div>

      <div className="px-6 py-6">
        <div className="relative">
          <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gray-200" />

          {Array.from(grouped.entries()).map(([cat, items], catIdx) => (
            <div key={cat} className={catIdx === 0 ? '' : 'mt-5'}>
              <div className="pl-7 mb-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  {CATEGORY_LABELS[cat]}
                </div>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <QuietRow key={item.id} item={item} state={report.state} />
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

function QuietRow({ item, state }: { item: FeeLineItem; state: string }) {
  const setBy =
    item.feeSource === 'state'
      ? `Set by ${state}`
      : item.feeSource === 'county'
      ? 'Set by county'
      : null

  return (
    <div className="relative pl-7">
      <div
        className={`absolute left-0.5 top-2 w-2 h-2 rounded-full ring-2 ring-white ${
          item.isFixed ? 'bg-gray-300' : 'bg-emerald-500'
        }`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-medium text-dark-900 leading-snug">{item.label}</div>
          {setBy && <div className="text-[11px] text-gray-500 mt-0.5">{setBy}</div>}
          {!item.isFixed && item.typicalRange && (
            <div className="text-[11px] text-gray-500 mt-0.5">
              Typical {formatRange(item.typicalRange.low, item.typicalRange.high)}
            </div>
          )}
        </div>
        <div className="text-[15px] font-bold text-dark-900 tabular-nums whitespace-nowrap">
          {formatCurrency(item.ourCost)}
        </div>
      </div>
    </div>
  )
}
