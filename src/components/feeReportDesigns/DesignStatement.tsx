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

// Design 10 — Premium financial statement
// Apple Card / private-banking aesthetic. Heavy reliance on typography hierarchy
// and whitespace. No decorations, no progress bars. Numbers do the work.

export default function DesignStatement({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md mx-auto overflow-hidden">
      {/* Brand strip */}
      <div className="px-7 pt-7 pb-3 flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-dark-900">
          BetterClose
        </div>
        <div className="text-[10px] uppercase tracking-wider text-gray-400">
          Estimate
        </div>
      </div>

      {/* Hero total */}
      <div className="px-7 pt-4 pb-8">
        <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-3">
          Total at closing
        </div>
        <div className="text-[64px] font-black text-dark-900 tabular-nums leading-[0.95] tracking-tight">
          {formatCurrency(totals.ourTotal)}
        </div>
        <div className="text-sm text-gray-500 mt-3">
          {report.transactionType === 'purchase' ? 'Purchase' : 'Refinance'} · {report.state} · {formatCurrency(report.homeValue)}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Items */}
      <div className="px-7 py-4">
        {Array.from(grouped.entries()).map(([cat, items], catIdx) => (
          <div key={cat} className={catIdx === 0 ? '' : 'mt-6'}>
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-3">
              {CATEGORY_LABELS[cat]}
            </div>
            <div>
              {items.map((item, idx) => (
                <StatementRow
                  key={item.id}
                  item={item}
                  state={report.state}
                  isLast={idx === items.length - 1}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Comparison + savings block */}
      <div className="bg-gray-50 border-t border-gray-100 px-7 py-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm text-gray-500">You pay</span>
          <span className="text-base font-bold text-dark-900 tabular-nums">
            {formatCurrency(totals.ourTotal)}
          </span>
        </div>
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-sm text-gray-500">Typical {report.state}</span>
          <span className="text-base text-gray-400 tabular-nums line-through">
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

      <div className="px-7 py-3 text-[10px] text-gray-400 italic text-center">
        Estimate only · Some fees set by state or county
      </div>
    </div>
  )
}

function StatementRow({
  item,
  state,
  isLast,
}: {
  item: FeeLineItem
  state: string
  isLast: boolean
}) {
  const setBy =
    item.feeSource === 'state'
      ? `Set by ${state}`
      : item.feeSource === 'county'
      ? 'Set by county'
      : null

  return (
    <div className={`flex items-start justify-between gap-3 py-3 ${isLast ? '' : 'border-b border-gray-100'}`}>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] text-dark-900">{item.label}</div>
        {setBy && <div className="text-[11px] text-gray-400 mt-0.5">{setBy}</div>}
        {!item.isFixed && item.typicalRange && (
          <div className="text-[11px] text-gray-400 mt-0.5">
            Typical {formatRange(item.typicalRange.low, item.typicalRange.high)}
          </div>
        )}
      </div>
      <div className="text-[15px] font-semibold text-dark-900 tabular-nums whitespace-nowrap">
        {formatCurrency(item.ourCost)}
      </div>
    </div>
  )
}
