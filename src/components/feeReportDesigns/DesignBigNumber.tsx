'use client'

import { useState } from 'react'
import {
  CATEGORY_LABELS,
  FeeLineItem,
  FeeReport,
  computeTotals,
  formatCurrency,
  formatRange,
  groupByCategory,
} from '@/lib/feeReport'

// Design 7 — Big number + collapsible details
// Lead with the answer (a giant savings number and a you-vs-typical comparison),
// hide the line items behind tappable category accordions. Mobile-first.

export default function DesignBigNumber({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)
  const savingsMid = Math.round((totals.estimatedSavingsLow + totals.estimatedSavingsHigh) / 2)

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-md mx-auto border border-gray-200">
      {/* Hero number */}
      <div className="px-7 pt-9 pb-7 text-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700 mb-3">
          Your savings
        </div>
        <div className="text-6xl font-black text-emerald-700 tabular-nums leading-none mb-2">
          {formatCurrency(savingsMid)}
        </div>
        <div className="text-sm text-gray-500">
          range {formatRange(totals.estimatedSavingsLow, totals.estimatedSavingsHigh)}
        </div>
      </div>

      {/* Comparison */}
      <div className="px-7 py-6 border-y border-gray-100 grid grid-cols-2 divide-x divide-gray-200">
        <div className="pr-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 mb-1">
            You pay
          </div>
          <div className="text-2xl font-black text-dark-900 tabular-nums">
            {formatCurrency(totals.ourTotal)}
          </div>
        </div>
        <div className="pl-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Typical {report.state}
          </div>
          <div className="text-2xl font-black text-gray-400 tabular-nums">
            {formatRange(totals.marketLow, totals.marketHigh)}
          </div>
        </div>
      </div>

      {/* Accordion of categories */}
      <div>
        <div className="px-7 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          See the breakdown
        </div>
        {Array.from(grouped.entries()).map(([cat, items]) => (
          <CategoryAccordion key={cat} title={CATEGORY_LABELS[cat]} items={items} state={report.state} />
        ))}
      </div>

      {/* Bottom total */}
      <div className="px-7 py-5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">Total at closing</span>
        <span className="text-2xl font-black text-dark-900 tabular-nums">
          {formatCurrency(totals.ourTotal)}
        </span>
      </div>
      <div className="px-7 py-3 text-[11px] text-gray-400 italic text-center bg-gray-50">
        Estimate. Some fees set by state or county.
      </div>
    </div>
  )
}

function CategoryAccordion({
  title,
  items,
  state,
}: {
  title: string
  items: FeeLineItem[]
  state: string
}) {
  const [open, setOpen] = useState(true)
  const subtotal = items.reduce((s, i) => s + i.ourCost, 0)

  return (
    <div className="border-t border-gray-100">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-7 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[15px] font-semibold text-dark-900">{title}</span>
          <span className="text-xs text-gray-400">{items.length} items</span>
        </div>
        <span className="text-sm font-bold text-dark-900 tabular-nums">{formatCurrency(subtotal)}</span>
      </button>
      {open && (
        <div className="bg-gray-50/60">
          {items.map((item, idx) => (
            <BreakdownRow
              key={item.id}
              item={item}
              state={state}
              isLast={idx === items.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BreakdownRow({
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
      className={`px-7 py-3 pl-14 flex items-start justify-between gap-3 ${
        isLast ? 'pb-4' : 'border-b border-gray-100'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm text-dark-900">{item.label}</div>
        {setBy && <div className="text-[11px] text-gray-500 mt-0.5">{setBy}</div>}
        {!item.isFixed && item.typicalRange && (
          <div className="text-[11px] text-gray-500 mt-0.5">
            Typical {formatRange(item.typicalRange.low, item.typicalRange.high)}
          </div>
        )}
      </div>
      <div className="text-sm font-semibold text-dark-900 tabular-nums whitespace-nowrap">
        {formatCurrency(item.ourCost)}
      </div>
    </div>
  )
}
