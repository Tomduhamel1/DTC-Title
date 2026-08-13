// Friendly notice for when the upstream rate calculator fails (5xx/timeout).
// Deliberately NOT styled as an error: the visitor did nothing wrong and the
// outage is usually temporary — so this reads as a helpful note with a
// phone fallback, not a red alert.
export default function CalculatorUnresponsiveNotice({ stateName }: { stateName?: string }) {
  return (
    <div className="rounded-xl border border-primary-100 bg-primary-50/70 px-5 py-4">
      <div className="flex gap-3.5">
        <div
          className="flex-none w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center"
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <polyline points="21 3 21 9 15 9" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-dark-900">
            {stateName
              ? `${stateName}'s rates system was unresponsive — likely temporarily.`
              : 'The rates system was unresponsive — likely temporarily.'}
          </p>
          <p className="mt-1 text-sm text-gray-700 leading-relaxed">
            Please try again in a moment. If the error persists, call us at{' '}
            <a href="tel:+18003169508" className="font-semibold text-primary-700 whitespace-nowrap">
              1-800-316-9508
            </a>{' '}
            and we&rsquo;ll get you your quote!
          </p>
        </div>
      </div>
    </div>
  )
}
