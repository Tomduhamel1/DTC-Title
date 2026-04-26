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

// Design 8 — Vertical timeline
// A center spine runs down. Each fee is a node on the spine. Variable fees
// show the "you" number prominently with a small "vs typical" hint. Set-by
// nodes are visually quieter so attention flows to where it matters.

export default function DesignTimeline({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-dark-900 mb-1">Your closing fees</h3>
        <div className="text-sm text-gray-500">
          {report.transactionType === 'purchase' ? 'Purchase' : 'Refinance'} · {report.state}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="relative">
          {/* Spine */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-200" aria-hidden="true" />

          {Array.from(grouped.entries()).map(([cat, items]) => (
            <div key={cat} className="mb-6 last:mb-0">
              <div className="relative pl-10 mb-3">
                <div className="absolute left-0 top-1.5 w-7 h-px bg-gray-200" aria-hidden="true" />
                <div className="absolute left-2 top-0 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white" />
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  {CATEGORY_LABELS[cat]}
                </div>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <TimelineNode key={item.id} item={item} state={report.state} />
                ))}
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
        <div className="text-[11px] text-gray-400 italic text-center mt-3">
          Compared to typical {report.state} closing. Estimate only.
        </div>
      </div>
    </div>
  )
}

function TimelineNode({ item, state }: { item: FeeLineItem; state: string }) {
  const setBy =
    item.feeSource === 'state'
      ? `Set by ${state}`
      : item.feeSource === 'county'
      ? 'Set by county'
      : null

  if (item.isFixed) {
    return (
      <div className="relative pl-10">
        <div
          className="absolute left-2 top-2 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white"
          aria-hidden="true"
        />
        <div className="flex items-start justify-between gap-3 py-1">
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-700">{item.label}</div>
            {setBy && <div className="text-[11px] text-gray-400 mt-0.5">{setBy}</div>}
          </div>
          <div className="text-sm font-medium text-gray-700 tabular-nums whitespace-nowrap">
            {formatCurrency(item.ourCost)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative pl-10">
      <div
        className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white shadow"
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-semibold text-dark-900 leading-snug">
            {item.label}
          </div>
          {item.typicalRange && (
            <div className="text-[11px] text-gray-500 mt-0.5">
              Typical {formatRange(item.typicalRange.low, item.typicalRange.high)}
            </div>
          )}
        </div>
        <div className="text-right whitespace-nowrap">
          <div className="text-lg font-black text-emerald-700 tabular-nums leading-tight">
            {formatCurrency(item.ourCost)}
          </div>
        </div>
      </div>
    </div>
  )
}
