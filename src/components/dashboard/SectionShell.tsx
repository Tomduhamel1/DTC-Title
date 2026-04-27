'use client'

import { useState } from 'react'

interface SectionShellProps {
  title: string
  icon?: React.ReactNode
  /** When true, renders the icon without the rounded emerald background (useful for brand marks with their own colors). */
  iconBare?: boolean
  subtitle?: string
  /** When true, the body is collapsed by default with a chevron toggle. */
  collapsible?: boolean
  defaultOpen?: boolean
  children: React.ReactNode
  /** Right-aligned content in the header (e.g. "Pending" pill, edit button) */
  headerRight?: React.ReactNode
}

export default function SectionShell({
  title,
  icon,
  iconBare = false,
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
        {icon && (
          <span
            className={
              iconBare
                ? 'inline-flex items-center justify-center w-9 h-9 flex-shrink-0'
                : 'inline-flex items-center justify-center w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex-shrink-0'
            }
          >
            {icon}
          </span>
        )}
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
