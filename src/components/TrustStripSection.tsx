const PILLARS = [
  {
    title: 'Save at closing',
    body: 'Lower title and settlement costs from the same A-rated underwriters. No junk fees.',
  },
  {
    title: 'Save over the loan',
    body: 'Lower closing costs can mean borrowing less — and a lower total loan cost over time.',
  },
  {
    title: 'Close with confidence',
    body: 'Every fee line by line, a dedicated closing officer, and live status. No chasing.',
  },
] as const

const STATS = [
  { value: '30,000+', label: 'Closings completed' },
  { value: '$5M', label: 'Bonded & insured' },
  { value: 'A-rated', label: 'Underwriters only' },
  { value: '50 states', label: 'Licensed nationally' },
] as const

export default function TrustStripSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-block bg-primary-100 text-primary-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Why BetterClose
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-dark-900 leading-tight">
            Lower cost. Faster closings. Every fee in the open.
            <br />
            <span className="text-primary-600">BetterClose.</span>
          </h2>
        </div>

        {/* Three pillars */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7"
            >
              <div className="text-2xl font-black text-primary-600 mb-2">
                {p.title}
              </div>
              <p className="text-gray-700 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            {STATS.map((s) => (
              <div key={s.label} className="text-center p-6">
                <div className="text-3xl md:text-4xl font-black text-dark-900 leading-none mb-1">
                  {s.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
