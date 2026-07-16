'use client'

import {
  CATEGORY_LABELS,
  FeeLineItem,
  FeeReport,
  computeTotals,
  conservativeLineSavings,
  formatCurrency,
  formatRange,
  groupByCategory,
} from '@/lib/feeReport'

interface FeeReportTableProps {
  report: FeeReport
  // 'preview' drops the shadow and the built-in header so the caller can wrap it.
  variant?: 'full' | 'preview'
  // Override the title shown in the built-in header. Ignored in preview variant.
  title?: string
}

export default function FeeReportTable({
  report,
  variant = 'full',
  title = 'Closing fees',
}: FeeReportTableProps) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)
  const isPreview = variant === 'preview'

  return (
    <div
      className={`bg-white rounded-3xl border border-gray-200 overflow-hidden ${
        isPreview ? '' : 'shadow-md'
      }`}
    >
      {/* Header (skipped in preview — caller provides its own) */}
      {!isPreview && (
        <div className="px-7 pt-7 pb-6 border-b border-gray-100">
          <h3 className="text-2xl font-black text-dark-900 leading-tight tracking-tight">
            {title}
          </h3>
          <div className="text-sm text-gray-500 mt-1">
            {report.transactionType === 'purchase' ? 'Purchase' : 'Refinance'} · {report.state} · {formatCurrency(report.homeValue)}
          </div>
        </div>
      )}

      {/* Column headers */}
      <div className="px-7 pt-5 pb-3 flex items-baseline justify-between border-b border-gray-100">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 pl-9">
          Item
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-700">
          BetterClose
        </span>
      </div>

      {/* Timeline */}
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
                  <FeeRow key={item.id} item={item} state={report.state} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
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
        {/* Two savings buckets, visually separated. Single conservative
            number (no low–high range) — compared against the LOW end of
            typical local pricing only. */}
        <div className="border-t border-gray-200 pt-4 grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
              Save at closing
            </div>
            <div className="text-2xl font-black text-emerald-700 tabular-nums leading-none">
              {formatCurrency(totals.estimatedSavings)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1.5">Title &amp; settlement</div>
          </div>
          {totals.lifetimeSavings > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                Save over the loan
              </div>
              <div className="text-2xl font-black text-emerald-700 tabular-nums leading-none">
                {formatCurrency(totals.lifetimeSavings)}
              </div>
              <div className="text-[11px] text-gray-500 mt-1.5">Long-term savings</div>
            </div>
          )}
        </div>
        {totals.lifetimeSavings > 0 && (
          <p className="text-[11px] text-gray-400 mt-3 leading-snug">
            Loan savings assumes you borrow less or get better loan pricing
            because your closing costs are lower. Based on 6.5% over 30 years.
            Final terms may vary.
          </p>
        )}
      </div>

      <div className="px-7 py-3 text-[11px] text-gray-400 italic text-center border-t border-gray-100">
        Estimate. Recording fees — and, in states with promulgated or uniform
        rates, title insurance premiums — are set by the state and the same
        regardless of provider; we never count those toward savings.
        &ldquo;Typical&rdquo; ranges reflect our estimate of local market
        pricing for comparable services, and savings are measured against the
        low end of that range.
      </div>
    </div>
  )
}

function FeeRow({ item, state }: { item: FeeLineItem; state: string }) {
  const setBy =
    item.feeSource === 'state'
      ? `Set by ${state}`
      : item.feeSource === 'county'
      ? 'Set by county'
      : null

  // Same conservative definition computeTotals sums — badges must add up to
  // the headline "Save at closing" figure.
  const lineSavings = conservativeLineSavings(item)

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
          {lineSavings > 0 && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mt-1">
              save {formatCurrency(lineSavings)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
