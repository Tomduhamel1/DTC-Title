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
import { feeReportAmountLabel } from '@/lib/feeReportPresentation'

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
const PREVIEW_COLS =
  'grid grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] sm:grid-cols-[minmax(0,1fr)_6rem_4.5rem_4rem] lg:grid-cols-[minmax(0,1fr)_4.5rem_4.5rem] xl:grid-cols-[minmax(0,1fr)_6rem_4.5rem_4rem] gap-x-3 items-baseline'
// The homepage switches to two columns at lg. Hide only the secondary
// comparison column until xl gives the fee descriptions room again.
const PREVIEW_TYPICAL = 'hidden sm:block lg:hidden xl:block'

function reportComparison(report: FeeReport) {
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

  return {
    anchor,
    note: isNewModelData
      ? `Compared against ${basisPhrase}: ${formatCurrency(stackLow)} all-in for the same services we bill ${formatCurrency(stackTotal)} for.`
      : undefined,
  }
}

export default function FeeReportTable({
  report,
  variant = 'full',
  title = 'Closing fees',
}: FeeReportTableProps) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)
  const isPreview = variant === 'preview'
  const columns = isPreview ? PREVIEW_COLS : COLS
  const { anchor, note } = reportComparison(report)

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
            {report.transactionType === 'purchase' ? 'Purchase' : 'Refinance'} · {report.state} · {feeReportAmountLabel(report)}
          </div>
        </div>
      )}

      {/* Column headers */}
      <div className={`${columns} px-6 ${isPreview ? 'pt-4' : 'pt-5'} pb-3 border-b border-gray-100`}>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Item</span>
        <span className={`${isPreview ? PREVIEW_TYPICAL : 'hidden sm:block'} text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 text-right`}>
          Typical
        </span>
        <span className={`${isPreview ? 'text-[9px] tracking-normal' : 'text-[10px] tracking-[0.2em]'} font-bold uppercase text-dark-900 text-right`}>
          BetterClose
        </span>
        <span className={`${isPreview ? 'text-[9px] tracking-normal sm:text-[10px]' : 'text-[10px] tracking-[0.2em]'} font-bold uppercase text-emerald-700 text-right`}>
          Savings
        </span>
      </div>

      {/* Fee rows */}
      <div className={`px-6 ${isPreview ? 'py-2' : 'py-5'}`}>
        {Array.from(grouped.entries()).map(([cat, items], catIdx) => (
          <div key={cat} className={catIdx === 0 ? '' : isPreview ? 'mt-3' : 'mt-5'}>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
              {CATEGORY_LABELS[cat]}
            </div>
            <div className={isPreview ? 'space-y-1.5' : 'space-y-2.5'}>
              {items.map((item) => (
                <FeeRow
                  key={item.id}
                  item={item}
                  state={report.state}
                  isAnchor={item === anchor}
                  positiveSavings={isPreview}
                  anchorNote={
                    item === anchor && note
                      ? isPreview ? 'Services compared as a package.' : note
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        ))}

        {/* Totals row — the savings column sums right here, in the open. */}
        <div className={`${columns} ${isPreview ? 'mt-3 pt-3' : 'mt-5 pt-4'} border-t-2 border-gray-200`}>
          <span className="text-sm font-bold text-dark-900">Total</span>
          <span className={`${isPreview ? PREVIEW_TYPICAL : 'hidden sm:block'} text-xs text-gray-400 line-through text-right tabular-nums whitespace-nowrap`}>
            {formatRange(totals.marketLow, totals.marketHigh)}
          </span>
          <span className="text-sm font-black text-dark-900 text-right tabular-nums whitespace-nowrap">
            {formatCurrency(totals.ourTotal)}
          </span>
          <span className="text-sm font-black text-emerald-700 text-right tabular-nums whitespace-nowrap">
            {isPreview ? formatCurrency(totals.estimatedSavings) : formatSavings(totals.estimatedSavings)}
          </span>
        </div>
      </div>

      {/* Preview keeps both time horizons together, without a duplicate banner. */}
      {isPreview ? <div className="mx-6 mb-3 rounded-2xl bg-emerald-600 px-4 py-3 text-white">
        <div className="grid grid-cols-2 gap-4">
          <div data-preview-closing-savings className="flex flex-col">
            <div className="flex-1 text-[10px] font-bold uppercase tracking-wide text-emerald-100">Save at closing</div>
            <div className="mt-1 text-3xl font-black tabular-nums">{formatCurrency(totals.estimatedSavings)}</div>
          </div>
          <div data-preview-lifetime-savings className="flex flex-col">
            <div className="flex-1 text-[10px] font-bold uppercase tracking-wide text-emerald-100">Save over the life of the loan</div>
            <div className="mt-1 text-3xl font-black tabular-nums">{formatCurrency(totals.lifetimeSavings)}</div>
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-snug text-emerald-100">
          Loan-life total includes closing savings plus modeled interest avoided
          if you finance that much less at 6.5% over 30 years.
        </p>
      </div> : <div className="mx-6 mb-6 rounded-2xl bg-emerald-600 px-5 py-4 flex items-center justify-between gap-4">
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
      </div>}

      {/* Preserve the full report's existing summary layout. */}
      {!isPreview && <div className="px-6 pb-6">
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
      </div>}

      {isPreview ? (
        <p className="px-6 pb-4 text-xs text-gray-600 leading-relaxed">
          Sample only. Includes any BetterClose Bucks credit shown above.
          Premiums and government fees are not discounted. See estimate notes below.
        </p>
      ) : <div className="px-6 py-3 text-[11px] text-gray-400 italic text-center border-t border-gray-100">
        <EstimateDisclaimer />
      </div>}
    </div>
  )
}

function EstimateDisclaimer() {
  return <>Estimate. Our settlement charge is compared against the lowest
        competing service package we&apos;ve verified for your state (or a
        conservative estimate where competitors publish nothing); other
        service fees are shown from our price up — we claim no savings on
        them. Title insurance premiums are essentially the same across
        providers, and recording fees and taxes are set by the government —
        never counted toward savings. BetterClose Bucks is an introductory
        promotional credit from BetterClose, applied at closing.</>
}

// Keep detailed qualifications with the sample, outside its narrow table column.
export function FeeReportEstimateNotes({ report }: { report: FeeReport }) {
  const { note } = reportComparison(report)
  return (
    <details className="mt-6 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-600">
      <summary className="cursor-pointer font-semibold text-dark-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-600">
        About this sample &amp; savings estimate
      </summary>
      <div className="mt-3 space-y-3 leading-relaxed">
        {report.isSample && <p>
          Fixed purchase example calculated by our quote engine on
          {' '}{report.generatedAt.slice(0, 10)} (UTC) for ZIP {report.zip}.
          This is an example estimate, not a completed customer closing or a quote
          for your property. Fees and savings depend on your transaction.
        </p>}
        <p><EstimateDisclaimer /></p>
        {note && <p>{note}</p>}
        {computeTotals(report).lifetimeSavings > 0 && <p>
          The loan-life total includes the at-closing savings, not an additional
          amount to add to it. It models principal and interest avoided if you
          finance that much less at 6.5% over 30 years. It does not assume a lower
          interest rate; cash purchases have only the at-closing savings.
        </p>}
      </div>
    </details>
  )
}

function FeeRow({
  item,
  state,
  isAnchor = false,
  anchorNote,
  positiveSavings = false,
}: {
  item: FeeLineItem
  state: string
  isAnchor?: boolean
  anchorNote?: string
  positiveSavings?: boolean
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
    <div className={positiveSavings ? PREVIEW_COLS : COLS}>
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-dark-900 leading-tight">
          {item.label}
          {item.isCredit && (
            <span className="ml-2 align-middle inline-block text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5">
              New
            </span>
          )}
        </div>
        {subLabel && (!positiveSavings || isAnchor) && (
          <div
            className={`text-[10.5px] mt-0.5 leading-snug ${
              isAnchor ? 'text-emerald-700' : 'text-gray-400'
            }`}
          >
            {subLabel}
          </div>
        )}
      </div>
      <div className={`${positiveSavings ? PREVIEW_TYPICAL : 'hidden sm:block'} text-xs text-right tabular-nums whitespace-nowrap`}>
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
          <span className="text-emerald-700">{positiveSavings ? formatCurrency(lineSavings) : formatSavings(lineSavings)}</span>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </div>
    </div>
  )
}
