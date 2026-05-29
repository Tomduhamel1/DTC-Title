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

// Design 9 — Side-by-side ledger
// Two-column "you vs typical" but rows are tight and stacked-friendly. No bars.
// Sticky-style total bar at the bottom. Comparison via numbers, not graphics.

export default function DesignLedger({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)

  return (
    <div className="bg-white rounded-3xl border border-gray-200 max-w-md mx-auto overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
          Closing fees · {report.state}
        </div>
        <h3 className="text-xl font-bold text-dark-900">Your itemized estimate</h3>
      </div>

      {/* Column heads */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 px-6 py-2.5 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
        <div>Item</div>
        <div className="text-right">You</div>
        <div className="text-right w-20">Typical</div>
      </div>

      {/* Rows */}
      {Array.from(grouped.entries()).map(([cat, items]) => (
        <div key={cat}>
          <div className="px-6 py-2 bg-white border-t border-gray-100">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
              {CATEGORY_LABELS[cat]}
            </div>
          </div>
          {items.map((item, idx) => (
            <LedgerRow
              key={item.id}
              item={item}
              state={report.state}
              isLast={idx === items.length - 1}
            />
          ))}
        </div>
      ))}

      {/* Total row */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 px-6 py-4 bg-gray-50 border-t-2 border-gray-300 items-center">
        <div className="text-sm font-bold text-dark-900">Total</div>
        <div className="text-right text-xl font-black text-dark-900 tabular-nums">
          {formatCurrency(totals.ourTotal)}
        </div>
        <div className="text-right w-20 text-sm text-gray-400 tabular-nums line-through">
          {formatCurrency(totals.marketHigh)}
        </div>
      </div>

      {/* Savings strip */}
      <div className="px-6 py-4 bg-emerald-600 text-white flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-wider">You save</span>
        <span className="text-2xl font-black tabular-nums">
          {formatRange(totals.estimatedSavingsLow, totals.estimatedSavingsHigh)}
        </span>
      </div>

      <div className="px-6 py-3 text-[11px] text-gray-400 italic text-center bg-white">
        Compared to typical {report.state} range. Estimate only.
      </div>
    </div>
  )
}

function LedgerRow({
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
    <div
      className={`grid grid-cols-[1fr_auto_auto] gap-x-3 px-6 py-3 items-start ${
        isLast ? '' : 'border-b border-gray-100'
      }`}
    >
      <div className="min-w-0">
        <div className="text-[14px] text-dark-900 leading-snug">{item.label}</div>
        {setBy && <div className="text-[11px] text-gray-400 mt-0.5">{setBy}</div>}
      </div>
      <div className="text-right text-[14px] font-bold text-dark-900 tabular-nums whitespace-nowrap">
        {formatCurrency(item.ourCost)}
      </div>
      <div className="text-right w-20 whitespace-nowrap">
        {item.isFixed ? (
          <span className="text-[12px] text-gray-300">same</span>
        ) : (
          <span className="text-[12px] text-gray-400 tabular-nums">
            {formatCurrency(item.typicalRange!.high)}
          </span>
        )}
      </div>
    </div>
  )
}
