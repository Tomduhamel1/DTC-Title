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

// Variation A — Centered spine with numbered steps
// All items numbered sequentially. Spine runs down the middle. Each item alternates
// label-side / price-side balance using a single column with the spine on the left
// of a centered column. Designed to translate naturally into a closing-progress view.

export default function DesignTimelineA({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)
  let counter = 0

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
          {report.transactionType} · {report.state}
        </div>
        <h3 className="text-xl font-bold text-dark-900">Closing fees</h3>
      </div>

      <div className="px-6 py-7">
        <div className="relative">
          {/* Spine */}
          <div className="absolute left-1/2 -translate-x-px top-3 bottom-3 w-0.5 bg-gray-200" />

          {Array.from(grouped.entries()).map(([cat, items], catIdx) => (
            <div key={cat} className={catIdx === 0 ? '' : 'mt-7'}>
              {/* Category */}
              <div className="relative flex items-center justify-center mb-4">
                <div className="bg-white px-3 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                    {CATEGORY_LABELS[cat]}
                  </span>
                </div>
              </div>
              <div className="space-y-5">
                {items.map((item) => {
                  counter += 1
                  return (
                    <NumberedRow
                      key={item.id}
                      item={item}
                      state={report.state}
                      number={counter}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
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

function NumberedRow({
  item,
  state,
  number,
}: {
  item: FeeLineItem
  state: string
  number: number
}) {
  const setBy =
    item.feeSource === 'state'
      ? `Set by ${state}`
      : item.feeSource === 'county'
      ? 'Set by county'
      : null

  return (
    <div className="relative grid grid-cols-[1fr_auto_1fr] items-start gap-3">
      {/* Left: label */}
      <div className="text-right pt-0.5">
        <div className="text-[14px] font-medium text-dark-900 leading-snug">{item.label}</div>
        {setBy && <div className="text-[11px] text-gray-400 mt-0.5">{setBy}</div>}
        {!item.isFixed && item.typicalRange && (
          <div className="text-[11px] text-gray-400 mt-0.5">
            Typical {formatRange(item.typicalRange.low, item.typicalRange.high)}
          </div>
        )}
      </div>

      {/* Center: numbered node */}
      <div className="relative flex items-start justify-center pt-0.5">
        <div
          className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ring-4 ring-white ${
            item.isFixed
              ? 'bg-gray-200 text-gray-500'
              : 'bg-emerald-500 text-white shadow'
          }`}
        >
          {number}
        </div>
      </div>

      {/* Right: price */}
      <div className="pt-0.5">
        <div
          className={`text-[17px] font-black tabular-nums leading-tight ${
            item.isFixed ? 'text-gray-700' : 'text-emerald-700'
          }`}
        >
          {formatCurrency(item.ourCost)}
        </div>
      </div>
    </div>
  )
}
