'use client'

import { useEffect, useRef, useState } from 'react'
import {
  CATEGORY_LABELS,
  FeeLineItem,
  FeeReport,
  computeTotals,
  formatCurrency,
  formatRange,
  groupByCategory,
} from '@/lib/feeReport'

export default function DesignInvoice({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-10 py-8 border-b border-gray-200 flex items-start justify-between flex-wrap gap-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Estimate · {report.transactionType === 'purchase' ? 'Purchase' : 'Refinance'} · {report.state}
          </div>
          <div className="text-3xl font-bold text-dark-900">Closing Cost Estimate</div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Total
          </div>
          <div className="text-4xl font-black text-dark-900 tabular-nums">
            {formatCurrency(totals.ourTotal)}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            {formatRange(totals.estimatedSavingsLow, totals.estimatedSavingsHigh)} below typical
          </div>
        </div>
      </div>

      {/* Column header */}
      <div className="grid grid-cols-12 gap-4 px-10 py-3 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <div className="col-span-6">Item</div>
        <div className="col-span-4">Where it sits in the typical range</div>
        <div className="col-span-2 text-right">Amount</div>
      </div>

      {/* Sections */}
      {Array.from(grouped.entries()).map(([cat, items]) => (
        <div key={cat}>
          <div className="px-10 py-2 bg-white border-t border-gray-100">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              {CATEGORY_LABELS[cat]}
            </div>
          </div>
          {items.map((item) => (
            <InvoiceRow key={item.id} item={item} state={report.state} />
          ))}
        </div>
      ))}

      {/* Total row */}
      <div className="grid grid-cols-12 gap-4 px-10 py-5 border-t-2 border-gray-300 bg-gray-50">
        <div className="col-span-6 font-bold text-dark-900">Total due at closing</div>
        <div className="col-span-4 text-xs text-gray-500 self-center">
          Typical range: {formatRange(totals.marketLow, totals.marketHigh)}
        </div>
        <div className="col-span-2 text-right font-black text-2xl text-dark-900 tabular-nums">
          {formatCurrency(totals.ourTotal)}
        </div>
      </div>

      <div className="px-10 py-3 text-xs text-gray-400 italic border-t border-gray-100">
        Recording fees are pass-through and identical regardless of provider.
      </div>
    </div>
  )
}

function InvoiceRow({ item, state }: { item: FeeLineItem; state: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.3 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="grid grid-cols-12 gap-4 px-10 py-4 border-t border-gray-100 items-center">
      <div className="col-span-6">
        <div className="text-sm font-medium text-dark-900">{item.label}</div>
        {item.description && (
          <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
        )}
        {item.isFixed && (
          <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mt-1">
            Set by {item.feeSource === 'state' ? state : 'county'} · pass-through
          </div>
        )}
      </div>
      <div ref={ref} className="col-span-4">
        {item.isFixed ? (
          <div className="text-xs text-gray-400">—</div>
        ) : (
          <RangeViz
            ourCost={item.ourCost}
            low={item.typicalRange!.low}
            high={item.typicalRange!.high}
            visible={visible}
          />
        )}
      </div>
      <div className="col-span-2 text-right">
        <div className="font-bold text-dark-900 tabular-nums">{formatCurrency(item.ourCost)}</div>
      </div>
    </div>
  )
}

function RangeViz({
  ourCost,
  low,
  high,
  visible,
}: {
  ourCost: number
  low: number
  high: number
  visible: boolean
}) {
  const axisLow = Math.min(low, ourCost) * 0.95
  const axisSpan = Math.max(high - axisLow, 1)
  const ourPct = ((ourCost - axisLow) / axisSpan) * 100
  const lowPct = ((low - axisLow) / axisSpan) * 100

  return (
    <div className="relative h-8">
      {/* Range track */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded-full bg-gray-100">
        <div
          className="absolute h-1 rounded-full bg-gray-200"
          style={{ left: `${lowPct}%`, right: 0 }}
        />
      </div>
      {/* Range labels */}
      <div className="absolute top-0 text-[10px] text-gray-400" style={{ left: `${lowPct}%` }}>
        <span className="-translate-x-1/2 inline-block">{formatCurrency(low)}</span>
      </div>
      <div className="absolute top-0 right-0 text-[10px] text-gray-400">
        {formatCurrency(high)}
      </div>
      {/* Marker */}
      <div
        className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
        style={{ left: visible ? `${ourPct}%` : '0%', opacity: visible ? 1 : 0 }}
      >
        <div className="-translate-x-1/2 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>
      </div>
      {/* You label */}
      <div
        className="absolute bottom-0 text-[10px] font-bold text-emerald-600 transition-all duration-700"
        style={{ left: visible ? `${ourPct}%` : '0%', opacity: visible ? 1 : 0 }}
      >
        <span className="-translate-x-1/2 inline-block">you</span>
      </div>
    </div>
  )
}
