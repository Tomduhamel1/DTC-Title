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

export default function DesignReceipt({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)

  return (
    <div className="flex justify-center">
      <div className="relative max-w-md w-full">
        {/* Torn top edge */}
        <div className="h-3 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 95% 100%, 90% 60%, 85% 100%, 80% 60%, 75% 100%, 70% 60%, 65% 100%, 60% 60%, 55% 100%, 50% 60%, 45% 100%, 40% 60%, 35% 100%, 30% 60%, 25% 100%, 20% 60%, 15% 100%, 10% 60%, 5% 100%, 0 60%)' }}></div>

        <div className="bg-white px-8 py-6 shadow-2xl font-mono">
          {/* Header */}
          <div className="text-center pb-5 border-b border-dashed border-gray-300">
            <div className="text-[10px] tracking-[0.3em] text-gray-500 mb-1">BETTERCLOSE</div>
            <div className="text-base font-bold text-dark-900">Closing Cost Estimate</div>
            <div className="text-[10px] text-gray-500 mt-1">
              {report.transactionType.toUpperCase()} · {report.state.toUpperCase()} · {formatCurrency(report.homeValue)}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              {new Date(report.generatedAt).toLocaleDateString()}
            </div>
          </div>

          {/* Sections */}
          {Array.from(grouped.entries()).map(([cat, items]) => (
            <div key={cat} className="py-4 border-b border-dashed border-gray-300">
              <div className="text-[10px] tracking-[0.2em] text-gray-500 mb-3">
                {CATEGORY_LABELS[cat].toUpperCase()}
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <ReceiptRow key={item.id} item={item} state={report.state} />
                ))}
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Subtotal (you)</span>
              <span className="text-gray-700 tabular-nums">{formatCurrency(totals.ourTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-400 line-through">Typical max</span>
              <span className="text-gray-400 line-through tabular-nums">
                {formatCurrency(totals.marketHigh)}
              </span>
            </div>
            <div className="border-t-2 border-dark-900 mt-3 pt-3 flex items-center justify-between">
              <span className="text-sm font-black text-dark-900 tracking-wider">TOTAL</span>
              <span className="text-2xl font-black text-dark-900 tabular-nums">
                {formatCurrency(totals.ourTotal)}
              </span>
            </div>
            <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded p-3 text-center">
              <div className="text-[10px] text-emerald-700 tracking-widest font-bold mb-0.5">
                YOU SAVED
              </div>
              <div className="text-xl font-black text-emerald-700 tabular-nums">
                {formatRange(totals.estimatedSavingsLow, totals.estimatedSavingsHigh)}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-[9px] text-gray-400 mt-5 leading-relaxed">
            Estimate only · Recording fees set by state/county<br />
            Thank you for choosing transparency
          </div>
        </div>

        {/* Torn bottom edge */}
        <div className="h-3 bg-white" style={{ clipPath: 'polygon(0 40%, 5% 0, 10% 40%, 15% 0, 20% 40%, 25% 0, 30% 40%, 35% 0, 40% 40%, 45% 0, 50% 40%, 55% 0, 60% 40%, 65% 0, 70% 40%, 75% 0, 80% 40%, 85% 0, 90% 40%, 95% 0, 100% 40%, 100% 100%, 0 100%)' }}></div>
      </div>
    </div>
  )
}

function ReceiptRow({ item, state }: { item: FeeLineItem; state: string }) {
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
    <div ref={ref}>
      <div className="flex items-start justify-between gap-3 text-sm">
        <div className="flex-1 min-w-0">
          <div className="text-dark-900 truncate">{item.label}</div>
          {item.isFixed && (
            <div className="text-[9px] text-gray-400 tracking-wider uppercase mt-0.5">
              ({item.feeSource === 'state' ? state : 'county'} fee · pass-through)
            </div>
          )}
        </div>
        <div className="text-right whitespace-nowrap">
          <div className="text-dark-900 tabular-nums">{formatCurrency(item.ourCost)}</div>
          {!item.isFixed && (
            <div className="text-[10px] text-gray-400 line-through tabular-nums">
              {formatCurrency(item.typicalRange!.high)}
            </div>
          )}
        </div>
      </div>
      {!item.isFixed && (
        <div className="mt-1.5 relative h-1 bg-gray-100 rounded-sm overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-emerald-500 rounded-sm transition-all duration-700 ease-out"
            style={{
              width: visible
                ? `${Math.round((item.ourCost / item.typicalRange!.high) * 100)}%`
                : '0%',
            }}
          />
        </div>
      )}
    </div>
  )
}
