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

export default function DesignDashboard({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)
  const savingsMid = totals.estimatedSavings

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white p-10 lg:p-14">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100 mb-3">
          Your estimated savings
        </div>
        <div className="text-7xl lg:text-8xl font-black tabular-nums leading-none mb-4">
          {formatCurrency(savingsMid)}
        </div>
        <div className="text-emerald-50 text-lg">
          Compared to conservative local pricing in {report.state}
        </div>

        {/* Stacked bar */}
        <div className="mt-10">
          <StackedBar
            ourTotal={totals.ourTotal}
            typicalHigh={totals.marketHigh}
          />
          <div className="grid grid-cols-2 mt-4 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-sm bg-white"></span>
                <span className="text-emerald-100 font-semibold uppercase text-[11px] tracking-wider">
                  You pay
                </span>
              </div>
              <div className="text-2xl font-black tabular-nums">
                {formatCurrency(totals.ourTotal)}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1 justify-end">
                <span className="text-emerald-100 font-semibold uppercase text-[11px] tracking-wider">
                  Typical max
                </span>
                <span className="w-3 h-3 rounded-sm bg-emerald-900/40"></span>
              </div>
              <div className="text-2xl font-black tabular-nums opacity-70">
                {formatCurrency(totals.marketHigh)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="p-8 lg:p-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-dark-900">Where the savings come from</h3>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            {report.lineItems.length} line items
          </span>
        </div>

        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([cat, items]) => (
            <div key={cat}>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                {CATEGORY_LABELS[cat]}
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <DashboardRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-10 py-3 bg-gray-50 text-xs text-gray-500 italic text-center border-t border-gray-100">
        Estimate. Recording fees are set by the state or county and the same regardless of provider.
      </div>
    </div>
  )
}

function StackedBar({ ourTotal, typicalHigh }: { ourTotal: number; typicalHigh: number }) {
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

  const pct = Math.min(100, Math.round((ourTotal / typicalHigh) * 100))

  return (
    <div ref={ref} className="relative h-14 bg-emerald-900/30 rounded-xl overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 bg-white shadow-inner transition-all duration-1000 ease-out flex items-center justify-end px-4"
        style={{ width: visible ? `${pct}%` : '0%' }}
      >
        <span className="text-emerald-700 font-black tabular-nums text-sm">
          {pct}%
        </span>
      </div>
    </div>
  )
}

function DashboardRow({ item }: { item: FeeLineItem }) {
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

  if (item.isFixed) {
    return (
      <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">↓</span>
          <span className="text-sm text-gray-700">{item.label}</span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            pass-through
          </span>
        </div>
        <span className="text-sm font-semibold text-gray-700 tabular-nums">
          {formatCurrency(item.ourCost)}
        </span>
      </div>
    )
  }

  const pct = Math.round((item.ourCost / item.typicalRange!.high) * 100)

  return (
    <div ref={ref} className="py-3 px-3 rounded-lg hover:bg-emerald-50/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-dark-900">{item.label}</span>
        <div className="text-right">
          <span className="text-base font-bold text-emerald-700 tabular-nums">
            {formatCurrency(item.ourCost)}
          </span>
          <span className="text-xs text-gray-400 ml-2">
            vs {formatRange(item.typicalRange!.low, item.typicalRange!.high)}
          </span>
        </div>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: visible ? `${pct}%` : '0%' }}
        />
      </div>
    </div>
  )
}
