'use client'

import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from '@/lib/contact'

interface AvailabilityStripProps {
  className?: string
}

export default function AvailabilityStrip({ className = '' }: AvailabilityStripProps) {
  return (
    <div
      className={`flex items-center justify-center gap-4 sm:gap-6 flex-wrap text-xs text-gray-600 pt-4 border-t border-gray-100 ${className}`}
    >
      <span className="font-medium text-gray-700">Need help?</span>

      <span className="text-gray-300">·</span>

      <a
        href="mailto:hello@betterclose.co"
        className="flex items-center gap-1.5 hover:text-primary-700 font-medium transition-colors"
      >
        <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Email us
      </a>

      <span className="text-gray-300">·</span>

      {SUPPORT_PHONE_TEL ? (
        <a
          href={`tel:${SUPPORT_PHONE_TEL}`}
          className="flex items-center gap-1.5 hover:text-primary-700 font-medium transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {SUPPORT_PHONE_DISPLAY}
        </a>
      ) : (
        <span className="flex items-center gap-1.5 font-medium">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {SUPPORT_PHONE_DISPLAY}
        </span>
      )}

    </div>
  )
}
