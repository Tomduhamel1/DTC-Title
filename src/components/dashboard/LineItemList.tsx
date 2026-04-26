'use client'

import { useState } from 'react'

export interface LineItem {
  label: string
  description?: string
  /** Final dollar amount once the order arrives. Null = pending. */
  amount: number | null
  /** "set by state/county" pass-through items — won't have a comparison. */
  isFixed?: boolean
}

interface LineItemListProps {
  title: string
  items: LineItem[]
  /** Defaults closed. */
  defaultOpen?: boolean
}

export default function LineItemList({ title, items, defaultOpen = false }: LineItemListProps) {
  const [open, setOpen] = useState(defaultOpen)
  const pendingCount = items.filter((i) => i.amount == null).length
  const total = items.reduce((s, i) => s + (i.amount ?? 0), 0)
  const allPending = pendingCount === items.length

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 text-left hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-sm font-semibold text-dark-900">{title}</span>
          <span className="text-xs text-gray-500">({items.length} items)</span>
        </div>
        <span className="text-xs text-gray-500">
          {allPending ? 'Pending' : `$${Math.round(total).toLocaleString()}`}
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-2 pl-6">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-start justify-between gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-dark-900">{item.label}</div>
                {item.description && (
                  <div className="text-[11px] text-gray-500 mt-0.5">{item.description}</div>
                )}
                {item.isFixed && (
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mt-1">
                    Set by state · pass-through
                  </div>
                )}
              </div>
              <div className="text-right whitespace-nowrap">
                {item.amount == null ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                    Pending
                  </span>
                ) : (
                  <span className="text-[13px] font-bold text-dark-900 tabular-nums">
                    ${Math.round(item.amount).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
