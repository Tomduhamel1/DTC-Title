'use client'

import {
  CATEGORY_LABELS,
  FeeLineItem,
  FeeReport,
  computeTotals,
  conservativeLineSavings,
  formatCurrency,
  formatRange,
  formatSavings,
  groupByCategory,
} from '@/lib/feeReport'
import { serviceBandFor } from '@/lib/marketBaseline'

interface FeeReportTableProps {
  report: FeeReport
  // 'preview' drops the shadow and the built-in header so the caller can wrap it.
  variant?: 'full' | 'preview'
  // Override the title shown in the built-in header. Ignored in preview variant.
  title?: string
}

// Column grid shared by the header row, fee rows, and the totals row so the
// four columns stay aligned: Item | Typical | BetterClose | Savings.
// (Typical collapses on very small screens; savings never does.)
const COLS =
  'grid grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] sm:grid-cols-[minmax(0,1fr)_7.5rem_5rem_5rem] gap-x-3 items-baseline'

export default function FeeReportTable({
  report,
  variant = 'full',
  title = 'Closing fees',
}: FeeReportTableProps) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)
  const isPreview = variant === 'preview'

  // Market-comparison model (2026-08-11): the whole verified package delta is
  // attributed to the settlement line; other service lines sit at parity
  // (typical low = our price → no claimed savings on them). Identify the
  // anchor line so its row can say where the comparison comes from.
  const stack = report.lineItems.filter((li) => !li.isCredit && !li.isFixed && li.typicalRange)
  const stackTotal = stack.reduce((s, li) => s + li.ourCost, 0)
  const anchor = stack.find((li) => conservativeLineSavings(li) > 0) ?? null
  const stackLow = anchor ? stackTotal + conservativeLineSavings(anchor) : stackTotal
  // Legacy guard: reports generated under the OLD model (pre-2026-08-11)
  // carry per-line multiplied ranges, so more than one line claims savings
  // and parity lines have low > ourCost. The derivation sentence would then
  // fabricate a "verified competitor quote" figure that never existed —
  // suppress it for that data. (Frozen totals still display verbatim.)
  const isNewModelData =
    anchor !== null &&
    stack.every((li) => li === anchor || (li.typicalRange && li.typicalRange.low === li.ourCost))
  const band = serviceBandFor(report.state, report.transactionType, report.zip)
  const basisPhrase =
    band.basis === 'quoted'
      ? `the lowest competing ${report.state} provider quote we've verified`
      : band.basis === 'published'
      ? `the lowest of ${band.providers ?? 'several'} published ${report.state} fee schedules`
      : band.basis === 'calculator'
      ? `the lowest of ${band.providers ?? 'several'} ${report.state} provider quotes`
      : `a conservative estimate (no published ${report.state} competitor fees yet)`

  return (
    <div
      className={`bg-white rounded-3xl border border-gray-200 overflow-hidden ${
        isPreview ? '' : 'shadow-md'
      }`}
    >
      {/* Header (skipped in preview — caller provides its own) */}
      {!isPreview && (
        <div className="px-6 pt-7 pb-6 border-b border-gray-100">
          <h3 className="text-2xl font-black text-dark-900 leading-tight tracking-tight">
            {title}
          </h3>
          <div className="text-sm text-gray-500 mt-1">
            {report.transactionType === 'purchase' ? 'Purchase' : 'Refinance'} · {report.state} · {formatCurrency(report.homeValue)}
          </div>
        </div>
      )}

      {/* Column headers */}
      <div className={`${COLS} px-6 pt-5 pb-3 border-b border-gray-100`}>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Item</span>
        <span className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 text-right">
          Typical
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-dark-900 text-right">
          BetterClose
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 text-right">
          Savings
        </span>
      </div>

      {/* Fee rows */}
      <div className="px-6 py-5">
        {Array.from(grouped.entries()).map(([cat, items], catIdx) => (
          <div key={cat} className={catIdx === 0 ? '' : 'mt-5'}>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
              {CATEGORY_LABELS[cat]}
            </div>
            <div className="space-y-2.5">
              {items.map((item) => (
                <FeeRow
                  key={item.id}
                  item={item}
                  state={report.state}
                  isAnchor={item === anchor}
                  anchorNote={
                    item === anchor && isNewModelData
                      ? `Compared against ${basisPhrase}: ${formatCurrency(stackLow)} all-in for the same services we bill ${formatCurrency(stackTotal)} for.`
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        ))}

        {/* Totals row — the savings column sums right here, in the open. */}
        <div className={`${COLS} mt-5 pt-4 border-t-2 border-gray-200`}>
          <span className="text-sm font-bold text-dark-900">Total</span>
          <span className="hidden sm:block text-xs text-gray-400 line-through text-right tabular-nums whitespace-nowrap">
            {formatRange(totals.marketLow, totals.marketHigh)}
          </span>
          <span className="text-sm font-black text-dark-900 text-right tabular-nums whitespace-nowrap">
            {formatCurrency(totals.ourTotal)}
          </span>
          <span className="text-sm font-black text-emerald-700 text-right tabular-nums whitespace-nowrap">
            {formatSavings(totals.estimatedSavings)}
          </span>
        </div>
      </div>

      {/* The savings, called out. */}
      <div className="mx-6 mb-6 rounded-2xl bg-emerald-600 px-5 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">
            Your total savings
          </div>
          <div className="text-[11px] text-emerald-100 mt-0.5 leading-snug">
            Itemized above — the settlement comparison plus BetterClose Bucks
          </div>
        </div>
        <div className="text-3xl font-black text-white tabular-nums whitespace-nowrap">
          {formatSavings(totals.estimatedSavings)}
        </div>
      </div>

      {/* Two savings buckets */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
              Save at closing
            </div>
            <div className="text-2xl font-black text-emerald-700 tabular-nums leading-none">
              {formatSavings(totals.estimatedSavings)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1.5">Title &amp; settlement</div>
          </div>
          {totals.lifetimeSavings > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
                Save over the loan
              </div>
              <div className="text-2xl font-black text-emerald-700 tabular-nums leading-none">
                {formatSavings(totals.lifetimeSavings)}
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

      <div className="px-6 py-3 text-[11px] text-gray-400 italic text-center border-t border-gray-100">
        Estimate. Our settlement charge is compared against the lowest
        competing service package we&apos;ve verified for your state (or a
        conservative estimate where competitors publish nothing); other
        service fees are shown from our price up — we claim no savings on
        them. Title insurance premiums are essentially the same across
        providers, and recording fees and taxes are set by the government —
        never counted toward savings. BetterClose Bucks is an introductory
        promotional credit from BetterClose, applied at closing.
      </div>
    </div>
  )
}

function FeeRow({
  item,
  state,
  isAnchor = false,
  anchorNote,
}: {
  item: FeeLineItem
  state: string
  isAnchor?: boolean
  anchorNote?: string
}) {
  const lineSavings = item.isCredit ? -item.ourCost : conservativeLineSavings(item)

  const subLabel = item.isCredit
    ? item.description ?? 'Promotional credit, applied at closing.'
    : isAnchor
    ? anchorNote
    : item.feeSource === 'state'
    ? `Set by ${state} — same everywhere`
    : item.feeSource === 'county'
    ? 'Set by county — same everywhere'
    : item.feeSource === 'underwriter' || /closing protection letter/i.test(item.label)
    ? 'Same across providers'
    : item.isFixed
    ? 'Same everywhere'
    : undefined

  // Typical column: the market's number for this line. Fixed/pass-through
  // lines cost the same everywhere, so the typical IS our number (gray);
  // parity service lines show a from-our-price range; the credit has no
  // market equivalent.
  const typical = item.isCredit ? (
    <span className="text-gray-300">—</span>
  ) : item.typicalRange ? (
    <span className="text-gray-500">
      {formatRange(item.typicalRange.low, item.typicalRange.high)}
    </span>
  ) : (
    <span className="text-gray-400">{formatCurrency(item.ourCost)}</span>
  )

  return (
    <div className={COLS}>
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-dark-900 leading-tight">
          {item.label}
          {item.isCredit && (
            <span className="ml-2 align-middle inline-block text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5">
              New
            </span>
          )}
        </div>
        {subLabel && (
          <div
            className={`text-[10.5px] mt-0.5 leading-snug ${
              isAnchor ? 'text-emerald-700' : 'text-gray-400'
            }`}
          >
            {subLabel}
          </div>
        )}
      </div>
      <div className="hidden sm:block text-xs text-right tabular-nums whitespace-nowrap">
        {typical}
      </div>
      <div
        className={`text-[13px] font-bold text-right tabular-nums whitespace-nowrap ${
          item.isCredit ? 'text-emerald-700' : 'text-dark-900'
        }`}
      >
        {item.isCredit ? formatSavings(item.ourCost) : formatCurrency(item.ourCost)}
      </div>
      <div className="text-[13px] font-bold text-right tabular-nums whitespace-nowrap">
        {lineSavings > 0 ? (
          <span className="text-emerald-700">{formatSavings(lineSavings)}</span>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </div>
    </div>
  )
}
