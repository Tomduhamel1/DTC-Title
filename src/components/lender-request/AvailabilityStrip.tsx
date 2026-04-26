'use client'

interface AvailabilityStripProps {
  className?: string
}

export default function AvailabilityStrip({ className = '' }: AvailabilityStripProps) {
  return (
    <div
      className={`flex items-center justify-center gap-4 sm:gap-6 flex-wrap text-xs text-gray-600 pt-4 border-t border-gray-100 ${className}`}
    >
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-medium text-gray-700">We're here now</span>
      </span>

      <span className="text-gray-300">·</span>

      <a
        href="mailto:hello@betterclose.com"
        className="flex items-center gap-1.5 hover:text-primary-700 font-medium transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Chat
      </a>

      <span className="text-gray-300">·</span>

      <a
        href="tel:18555557283"
        className="flex items-center gap-1.5 hover:text-primary-700 font-medium transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        (855) 555-SAVE
      </a>

      <span className="text-gray-300 hidden sm:inline">·</span>

      <span className="text-gray-400 italic hidden sm:inline">Most replies in &lt; 2 hrs</span>
    </div>
  )
}
