'use client'

import { useState } from 'react'

interface SectionShellProps {
  number: number
  title: string
  emoji: string
  subtitle?: string
  /** When true, the body is collapsed by default with a chevron toggle. */
  collapsible?: boolean
  defaultOpen?: boolean
  children: React.ReactNode
  /** Right-aligned content in the header (e.g. "Pending" pill, edit button) */
  headerRight?: React.ReactNode
}

export default function SectionShell({
  number,
  title,
  emoji,
  subtitle,
  collapsible = false,
  defaultOpen = true,
  children,
  headerRight,
}: SectionShellProps) {
  const [open, setOpen] = useState(defaultOpen)
  const isOpen = !collapsible || open

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div
        className={`px-5 py-4 ${isOpen ? 'border-b border-gray-100' : ''} flex items-center gap-3`}
      >
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black flex-shrink-0">
          {number}
        </span>
        <span className="text-xl flex-shrink-0" aria-hidden="true">{emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-dark-900 leading-tight">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>}
        </div>
        {headerRight}
        {collapsible && (
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
          >
            <svg
              className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      {isOpen && <div className="px-5 py-5">{children}</div>}
    </div>
  )
}
