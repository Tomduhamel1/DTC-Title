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

// Design 6 — Sticky-summary list
// iOS-native feeling: minimal chrome, generous whitespace, sticky savings panel
// pinned to bottom. Best for actual mobile.

export default function DesignList({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)

  return (
    <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-200 max-w-md mx-auto">
      {/* Top */}
      <div className="bg-white px-6 pt-7 pb-5 border-b border-gray-100">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
          {report.transactionType === 'purchase' ? 'Purchase' : 'Refinance'} · {report.state} · {formatCurrency(report.homeValue)}
        </div>
        <h3 className="text-2xl font-bold text-dark-900">Closing fees</h3>
      </div>

      {/* List */}
      <div>
        {Array.from(grouped.entries()).map(([cat, items]) => (
          <div key={cat}>
            <div className="px-6 pt-5 pb-2 bg-gray-50">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                {CATEGORY_LABELS[cat]}
              </div>
            </div>
            <div className="bg-white">
              {items.map((item, idx) => (
                <ListRow
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

      {/* Sticky-style summary */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="px-6 py-5">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Total</span>
            <span className="text-3xl font-black text-dark-900 tabular-nums">
              {formatCurrency(totals.ourTotal)}
            </span>
          </div>
          <div className="bg-emerald-50 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-emerald-900">You save</span>
            <span className="text-xl font-black text-emerald-700 tabular-nums">
              {formatCurrency(totals.estimatedSavings)}
            </span>
          </div>
          <div className="text-[11px] text-gray-400 italic text-center mt-3">
            Compared to the typical {report.state} range. Estimate only.
          </div>
        </div>
      </div>
    </div>
  )
}

function ListRow({
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
    <div className={`px-6 py-4 ${isLast ? '' : 'border-b border-gray-100'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-medium text-dark-900 leading-snug">{item.label}</div>
          {setBy && <div className="text-xs text-gray-500 mt-0.5">{setBy}</div>}
          {!item.isFixed && item.typicalRange && (
            <div className="text-xs text-gray-500 mt-0.5">
              Typical {formatRange(item.typicalRange.low, item.typicalRange.high)}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-[17px] font-bold text-dark-900 tabular-nums whitespace-nowrap">
            {formatCurrency(item.ourCost)}
          </div>
        </div>
      </div>
    </div>
  )
}
