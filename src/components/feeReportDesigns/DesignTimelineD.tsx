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

// Variation D — Tight density (Apple Wallet feel)
// Same left spine but with tighter spacing, smaller nodes, and 13px labels.
// Maximum information at a glance. Best for power users / dashboard reuse where
// you want all closing steps visible without scrolling.

export default function DesignTimelineD({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
          {report.transactionType} · {report.state} · {formatCurrency(report.homeValue)}
        </div>
        <h3 className="text-base font-bold text-dark-900 mt-0.5">Closing fees</h3>
      </div>

      <div className="px-5 py-4">
        <div className="relative">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-200" />

          {Array.from(grouped.entries()).map(([cat, items], catIdx) => (
            <div key={cat} className={catIdx === 0 ? '' : 'mt-4'}>
              <div className="relative pl-7 mb-2">
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  {CATEGORY_LABELS[cat]}
                </div>
              </div>
              <div>
                {items.map((item, idx) => (
                  <TightRow
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
      </div>

      <div className="bg-gray-50 px-5 py-4 border-t border-gray-200">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs font-semibold text-gray-600">Total</span>
          <span className="text-2xl font-black text-dark-900 tabular-nums">
            {formatCurrency(totals.ourTotal)}
          </span>
        </div>
        <div className="bg-emerald-50 rounded-lg px-3 py-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-900">You save</span>
          <span className="text-base font-black text-emerald-700 tabular-nums">
            {formatCurrency(totals.estimatedSavings)}
          </span>
        </div>
      </div>
    </div>
  )
}

function TightRow({
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
    <div className={`relative pl-7 ${isLast ? '' : 'pb-2.5 mb-2.5 border-b border-gray-50'}`}>
      <div
        className={`absolute left-1 top-1.5 w-2 h-2 rounded-full ring-2 ring-white ${
          item.isFixed ? 'bg-gray-300' : 'bg-emerald-500'
        }`}
      />
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-dark-900 leading-tight">{item.label}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">
            {setBy
              ? setBy
              : item.typicalRange
              ? `Typical ${formatRange(item.typicalRange.low, item.typicalRange.high)}`
              : ''}
          </div>
        </div>
        <div
          className={`text-[14px] font-bold tabular-nums whitespace-nowrap ${
            item.isFixed ? 'text-gray-700' : 'text-emerald-700'
          }`}
        >
          {formatCurrency(item.ourCost)}
        </div>
      </div>
    </div>
  )
}
