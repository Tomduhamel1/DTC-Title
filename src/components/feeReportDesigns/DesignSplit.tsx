'use client'

import {
  CATEGORY_LABELS,
  FeeReport,
  computeTotals,
  formatCurrency,
  formatRange,
  groupByCategory,
} from '@/lib/feeReport'

export default function DesignSplit({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)

  return (
    <div className="rounded-3xl overflow-hidden shadow-xl bg-white">
      {/* Top totals strip */}
      <div className="grid grid-cols-2">
        <div className="bg-emerald-600 text-white p-8">
          <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">
            Your closing
          </div>
          <div className="text-5xl font-black tabular-nums leading-none mb-2">
            {formatCurrency(totals.ourTotal)}
          </div>
          <div className="text-sm opacity-90">All buyer-side fees, itemized below.</div>
        </div>
        <div className="bg-gray-200 text-gray-700 p-8 relative">
          <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            Typical {report.state} closing
          </div>
          <div className="text-5xl font-black tabular-nums leading-none mb-2 line-through decoration-2 decoration-gray-400">
            {formatRange(totals.marketLow, totals.marketHigh)}
          </div>
          <div className="text-sm">
            You save{' '}
            <span className="font-bold text-emerald-700">
              {formatRange(totals.estimatedSavingsLow, totals.estimatedSavingsHigh)}
            </span>
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50">
        <div className="px-8 py-3 text-xs font-bold uppercase tracking-wider text-emerald-700 border-r border-gray-200">
          You pay
        </div>
        <div className="px-8 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          Typical range
        </div>
      </div>

      {/* Rows by category */}
      {Array.from(grouped.entries()).map(([cat, items]) => (
        <div key={cat}>
          <div className="px-8 py-3 bg-gray-50 border-b border-gray-100">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-600">
              {CATEGORY_LABELS[cat]}
            </div>
          </div>
          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-2 border-b border-gray-100 last:border-b-0"
            >
              {/* You pay */}
              <div className="px-8 py-5 border-r border-gray-100 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-dark-900">{item.label}</div>
                  {item.isFixed && (
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Set by {item.feeSource === 'state' ? report.state : 'county'}
                    </div>
                  )}
                </div>
                <div className="font-bold text-lg text-dark-900 tabular-nums whitespace-nowrap">
                  {formatCurrency(item.ourCost)}
                </div>
              </div>
              {/* Typical */}
              <div className="px-8 py-5 flex items-center justify-end gap-4">
                {item.isFixed ? (
                  <div className="text-sm text-gray-400 italic">same — pass-through</div>
                ) : (
                  <>
                    <div className="text-xs text-gray-500">
                      most charge {formatRange(item.typicalRange!.low, item.typicalRange!.high)}
                    </div>
                    <div className="font-bold text-lg text-gray-400 line-through tabular-nums whitespace-nowrap">
                      {formatCurrency(item.typicalRange!.high)}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Footer */}
      <div className="px-8 py-4 bg-gray-50 text-xs text-gray-500 italic text-center">
        Estimate. Recording fees are set by the state or county and the same regardless of provider.
      </div>
    </div>
  )
}
