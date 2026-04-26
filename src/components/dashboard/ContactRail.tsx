'use client'

export default function ContactRail() {
  return (
    <aside className="lg:sticky lg:top-24 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-base">
          💬
        </div>
        <div>
          <h3 className="text-base font-black text-dark-900 leading-tight">Need help?</h3>
          <p className="text-xs text-gray-600 mt-0.5">
            We're here for every step of your closing.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <a
          href="mailto:hello@betterclose.co"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors group"
        >
          <span className="text-lg flex-shrink-0">✉️</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Email
            </div>
            <div className="text-sm font-medium text-dark-900 truncate">
              hello@betterclose.co
            </div>
          </div>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>

        <a
          href="tel:18555557283"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors group"
        >
          <span className="text-lg flex-shrink-0">📞</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Call
            </div>
            <div className="text-sm font-medium text-dark-900">
              (855) 555-SAVE
            </div>
          </div>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <div className="mt-5 pt-4 border-t border-emerald-100 text-xs text-gray-600 leading-relaxed">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-900">We're here now</span>
        </div>
        <p className="text-gray-500">Most replies in &lt; 2 hrs. Mon–Fri 8a–7p ET.</p>
      </div>
    </aside>
  )
}
