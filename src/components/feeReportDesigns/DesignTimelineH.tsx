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

// Variation H — Status-aware, dual-mode (no fake demo)
// In fee-report mode, all nodes are emerald-filled or gray-filled (matches Original).
// In closing-tracker mode, nodes carry done/active/pending. A toggle in the header
// lets you preview both. The mode prop drives node treatment.

type Mode = 'fees' | 'tracker'

export default function DesignTimelineH({ report }: { report: FeeReport }) {
  const totals = computeTotals(report)
  const grouped = groupByCategory(report.lineItems)
  const [mode, setMode] = useState<Mode>('fees')

  const allItems = report.lineItems
  // For tracker preview: simulate a closing in progress
  const trackerDoneCount = 4

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
            {report.transactionType} · {report.state}
          </div>
          <h3 className="text-xl font-bold text-dark-900">
            {mode === 'fees' ? 'Closing fees' : 'Your closing'}
          </h3>
          {mode === 'tracker' && (
            <div className="text-xs text-gray-500 mt-0.5">
              {trackerDoneCount} of {allItems.length} steps done
            </div>
          )}
        </div>
        {/* Mode toggle */}
        <div className="inline-flex rounded-full bg-gray-100 p-0.5 text-[11px] font-bold">
          <button
            onClick={() => setMode('fees')}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              mode === 'fees' ? 'bg-white shadow text-dark-900' : 'text-gray-500'
            }`}
          >
            Fees
          </button>
          <button
            onClick={() => setMode('tracker')}
            className={`px-3 py-1.5 rounded-full transition-colors ${
              mode === 'tracker' ? 'bg-white shadow text-dark-900' : 'text-gray-500'
            }`}
          >
            Tracker
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="relative">
          <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-gray-200" />
          {mode === 'tracker' && (
            <div
              className="absolute left-[7px] top-3 w-0.5 bg-emerald-500 transition-all duration-700"
              style={{ height: `${(trackerDoneCount / allItems.length) * 100}%` }}
            />
          )}

          {Array.from(grouped.entries()).map(([cat, items], catIdx) => (
            <div key={cat} className={catIdx === 0 ? '' : 'mt-6'}>
              <div className="pl-9 mb-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  {CATEGORY_LABELS[cat]}
                </div>
              </div>
              <div className="space-y-3">
                {items.map((item) => {
                  const globalIdx = allItems.indexOf(item)
                  return (
                    <DualRow
                      key={item.id}
                      item={item}
                      state={report.state}
                      mode={mode}
                      trackerStatus={
                        globalIdx < trackerDoneCount
                          ? 'done'
                          : globalIdx === trackerDoneCount
                          ? 'active'
                          : 'pending'
                      }
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

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
            {formatCurrency(totals.estimatedSavings)}
          </span>
        </div>
      </div>
    </div>
  )
}

function DualRow({
  item,
  state,
  mode,
  trackerStatus,
}: {
  item: FeeLineItem
  state: string
  mode: Mode
  trackerStatus: 'done' | 'active' | 'pending'
}) {
  const setBy =
    item.feeSource === 'state'
      ? `Set by ${state}`
      : item.feeSource === 'county'
      ? 'Set by county'
      : null

  // Decide visual node treatment by mode
  const node =
    mode === 'fees' ? (
      <FeeNode isFixed={item.isFixed} />
    ) : (
      <TrackerNode status={trackerStatus} />
    )

  const dimmed = mode === 'tracker' && trackerStatus === 'pending'

  return (
    <div className="relative pl-9">
      <div className="absolute left-0 top-1.5">{node}</div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div
            className={`text-[14px] leading-snug ${
              dimmed ? 'text-gray-400' : 'font-medium text-dark-900'
            }`}
          >
            {item.label}
          </div>
          {setBy && (
            <div className="text-[11px] text-gray-400 mt-0.5">{setBy}</div>
          )}
          {!item.isFixed && item.typicalRange && (
            <div className="text-[11px] text-gray-400 mt-0.5">
              Typical {formatRange(item.typicalRange.low, item.typicalRange.high)}
            </div>
          )}
        </div>
        <div
          className={`text-[16px] font-bold tabular-nums whitespace-nowrap ${
            dimmed ? 'text-gray-300' : 'text-dark-900'
          }`}
        >
          {formatCurrency(item.ourCost)}
        </div>
      </div>
    </div>
  )
}

function FeeNode({ isFixed }: { isFixed: boolean }) {
  return (
    <div
      className={`w-3.5 h-3.5 rounded-full ring-4 ring-white ${
        isFixed ? 'bg-gray-300' : 'bg-emerald-500'
      }`}
    />
  )
}

function TrackerNode({ status }: { status: 'done' | 'active' | 'pending' }) {
  if (status === 'done') {
    return (
      <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center ring-4 ring-white">
        <svg
          className="w-2.5 h-2.5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )
  }
  if (status === 'active') {
    return (
      <div className="w-4 h-4 rounded-full bg-white border-2 border-emerald-500 ring-4 ring-white flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    )
  }
  return (
    <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300 ring-4 ring-white" />
  )
}
