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

// Variation I — Refined E (premium with savings glyph)
// E's hairline spine and ring nodes, refined: variable items get a small
// "↓ $X under typical" line under the price, plus the rings get filled emerald
// for variable items so savings drivers stand out at a glance.

export default function DesignTimelineI({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="px-7 pt-7 pb-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-dark-900 mb-1">
          BetterClose
        </div>
        <h3 className="text-2xl font-black text-dark-900 leading-tight">Closing fees</h3>
        <div className="text-sm text-gray-500 mt-1">
          {report.transactionType === 'purchase' ? 'Purchase' : 'Refinance'} · {report.state} · {formatCurrency(report.homeValue)}
        </div>
      </div>

      <div className="px-7 pb-2">
        <div className="relative">
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-gray-200" />

          {Array.from(grouped.entries()).map(([cat, items], catIdx) => (
            <div key={cat} className={catIdx === 0 ? '' : 'mt-7'}>
              <div className="relative pl-9 mb-4">
                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border border-gray-300 bg-white" />
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
                  {CATEGORY_LABELS[cat]}
                </div>
              </div>
              <div className="space-y-5">
                {items.map((item) => (
                  <RefinedRow key={item.id} item={item} state={report.state} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-7 pt-5 pb-7">
        <div className="border-t border-gray-100 pt-5">
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
          <div className="border-t border-gray-100 pt-4 flex items-baseline justify-between">
            <span className="text-base font-bold text-emerald-700">You save</span>
            <span className="text-3xl font-black text-emerald-700 tabular-nums">
              {formatRange(totals.estimatedSavingsLow, totals.estimatedSavingsHigh)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function RefinedRow({ item, state }: { item: FeeLineItem; state: string }) {
  const setBy =
    item.feeSource === 'state'
      ? `Set by ${state}`
      : item.feeSource === 'county'
      ? 'Set by county'
      : null

  const savingsLow = !item.isFixed && item.typicalRange
    ? Math.max(0, item.typicalRange.low - item.ourCost)
    : 0
  const savingsHigh = !item.isFixed && item.typicalRange
    ? Math.max(0, item.typicalRange.high - item.ourCost)
    : 0
  const showSavings = savingsHigh > 0

  return (
    <div className="relative pl-9">
      <div
        className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full ${
          item.isFixed
            ? 'bg-white border border-gray-300'
            : 'bg-emerald-500 ring-2 ring-emerald-100'
        }`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-semibold text-dark-900 leading-tight tracking-tight">
            {item.label}
          </div>
          {setBy && (
            <div className="text-[11px] text-gray-400 mt-1 tracking-wide">{setBy}</div>
          )}
          {!item.isFixed && item.typicalRange && (
            <div className="text-[11px] text-gray-400 mt-1 tracking-wide">
              Typical {formatRange(item.typicalRange.low, item.typicalRange.high)}
            </div>
          )}
        </div>
        <div className="text-right whitespace-nowrap">
          <div className="text-[18px] font-black text-dark-900 tabular-nums leading-none tracking-tight">
            {formatCurrency(item.ourCost)}
          </div>
          {showSavings && (
            <div className="text-[11px] font-semibold text-emerald-600 mt-1 tabular-nums">
              ↓ {savingsLow === savingsHigh
                ? formatCurrency(savingsLow)
                : `${formatCurrency(savingsLow)}–${formatCurrency(savingsHigh)}`}{' '}
              under
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
