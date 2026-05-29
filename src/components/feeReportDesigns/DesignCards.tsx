'use client'

import { useEffect, useRef, useState } from 'react'
import {
  FeeLineItem,
  FeeReport,
  computeTotals,
  formatCurrency,
  formatRange,
} from '@/lib/feeReport'

export default function DesignCards({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const variable = report.lineItems.filter((i) => !i.isFixed)
  const fixed = report.lineItems.filter((i) => i.isFixed)
  const fixedTotal = fixed.reduce((s, i) => s + i.ourCost, 0)

  return (
    <div className="bg-gray-50 rounded-3xl p-6 lg:p-8">
      {/* Top summary */}
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8 px-2">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Total · all-in
          </div>
          <div className="text-5xl font-black text-dark-900 tabular-nums leading-none">
            {formatCurrency(totals.ourTotal)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            You save vs. typical
          </div>
          <div className="text-3xl font-black text-emerald-600 tabular-nums leading-none">
            {formatRange(totals.estimatedSavingsLow, totals.estimatedSavingsHigh)}
          </div>
        </div>
      </div>

      {/* Variable fees as feature cards */}
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-2">
          Title & settlement — where the savings happen
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {variable.map((item) => (
            <VariableCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Fixed fees as a tight summary card */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 px-2">
          Recording fees — set by the state · pass-through
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="space-y-2">
            {fixed.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{item.label}</span>
                <span className="font-semibold text-gray-700 tabular-nums">
                  {formatCurrency(item.ourCost)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-900">Recording subtotal</span>
              <span className="font-bold text-gray-900 tabular-nums">
                {formatCurrency(fixedTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-400 italic text-center mt-6">
        Estimate. Recording fees are the same regardless of which company you use.
      </div>
    </div>
  )
}

function VariableCard({ item }: { item: FeeLineItem }) {
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

  const range = item.typicalRange!
  const pct = Math.round((item.ourCost / range.high) * 100)
  const youSaveLow = Math.max(0, range.low - item.ourCost)
  const youSaveHigh = Math.max(0, range.high - item.ourCost)

  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <div className="text-sm font-semibold text-dark-900">{item.label}</div>
        <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
          Save {formatRange(youSaveLow, youSaveHigh)}
        </div>
      </div>
      {item.description && (
        <div className="text-xs text-gray-500 mb-4">{item.description}</div>
      )}

      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-3xl font-black text-emerald-600 tabular-nums leading-none">
          {formatCurrency(item.ourCost)}
        </span>
        <span className="text-xs text-gray-400">
          most charge {formatRange(range.low, range.high)}
        </span>
      </div>

      {/* Bar */}
      <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
          style={{ width: visible ? `${pct}%` : '0%' }}
        />
        <div
          className="absolute top-0 bottom-0 w-px bg-gray-400"
          style={{ left: `${(range.low / range.high) * 100}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[10px] text-gray-400">
        <span>You</span>
        <span>Typical low</span>
        <span>Typical high</span>
      </div>
    </div>
  )
}
