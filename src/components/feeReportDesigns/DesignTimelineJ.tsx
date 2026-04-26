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

// Variation J — Hybrid synthesis
// Combines what worked from Original / C / E:
//  - Hairline spine (E)
//  - Variable items: small filled emerald node (Original) with a subtle savings glyph (I)
//  - Fixed items: smaller hollow ring (E)
//  - Section headers visually quieter — no spine node, just a label
//  - Premium typography (E) but with the unified-color price treatment so the
//    timeline reads as a single document, not a list of unrelated rows

export default function DesignTimelineJ({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)

  return (
    <div className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
      <div className="px-7 pt-7 pb-6 border-b border-gray-100">
        <h3 className="text-2xl font-black text-dark-900 leading-tight tracking-tight">
          Closing fees
        </h3>
        <div className="text-sm text-gray-500 mt-1">
          {report.transactionType === 'purchase' ? 'Purchase' : 'Refinance'} · {report.state} · {formatCurrency(report.homeValue)}
        </div>
      </div>

      <div className="px-7 py-7">
        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200" />

          {Array.from(grouped.entries()).map(([cat, items], catIdx) => (
            <div key={cat} className={catIdx === 0 ? '' : 'mt-7'}>
              <div className="pl-9 mb-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
                  {CATEGORY_LABELS[cat]}
                </div>
              </div>
              <div className="space-y-5">
                {items.map((item) => (
                  <HybridRow key={item.id} item={item} state={report.state} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-100 px-7 py-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm text-gray-500">You pay</span>
          <span className="text-base font-bold text-dark-900 tabular-nums">
            {formatCurrency(totals.ourTotal)}
          </span>
        </div>
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-sm text-gray-500">Typical {report.state}</span>
          <span className="text-base text-gray-400 line-through tabular-nums">
            {formatRange(totals.marketLow, totals.marketHigh)}
          </span>
        </div>
        <div className="border-t border-gray-200 pt-4 flex items-baseline justify-between">
          <span className="text-base font-bold text-emerald-700">You save</span>
          <span className="text-3xl font-black text-emerald-700 tabular-nums">
            {formatRange(totals.estimatedSavingsLow, totals.estimatedSavingsHigh)}
          </span>
        </div>
      </div>
    </div>
  )
}

function HybridRow({ item, state }: { item: FeeLineItem; state: string }) {
  const setBy =
    item.feeSource === 'state'
      ? `Set by ${state}`
      : item.feeSource === 'county'
      ? 'Set by county'
      : null

  const savingsHigh = !item.isFixed && item.typicalRange
    ? Math.max(0, item.typicalRange.high - item.ourCost)
    : 0

  return (
    <div className="relative pl-9">
      <div
        className={`absolute top-1 ${
          item.isFixed
            ? 'left-[1px] w-3 h-3 rounded-full bg-white border border-gray-300'
            : 'left-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100'
        }`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-semibold text-dark-900 leading-tight tracking-tight">
            {item.label}
          </div>
          {setBy ? (
            <div className="text-[11px] text-gray-400 mt-1">{setBy}</div>
          ) : item.typicalRange ? (
            <div className="text-[11px] text-gray-400 mt-1">
              Typical {formatRange(item.typicalRange.low, item.typicalRange.high)}
            </div>
          ) : null}
        </div>
        <div className="text-right whitespace-nowrap">
          <div className="text-[17px] font-black text-dark-900 tabular-nums leading-none tracking-tight">
            {formatCurrency(item.ourCost)}
          </div>
          {savingsHigh > 0 && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mt-1">
              save {formatCurrency(savingsHigh)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
