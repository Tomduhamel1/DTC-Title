import TrueFeelogo from '@/components/TrueFeelogo'

export const metadata = {
  title: 'BetterClose — Coming soon',
  description: 'BetterClose is launching soon. Save thousands on your closing costs with the same A-rated underwriters you already trust.',
}

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full text-center">
        <div className="flex justify-center mb-10">
          <TrueFeelogo className="h-12" />
        </div>

        <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6">
          Coming soon
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-dark-900 leading-tight mb-6">
          Better cost. Better speed.
          <br />
          <span className="text-primary-600">Better closings.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed max-w-xl mx-auto">
          BetterClose is launching soon. Same A-rated underwriters every other
          title company uses — at a fair price, with full transparency.
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 max-w-md mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Want early access?
          </div>
          <a
            href="mailto:hello@betterclose.co?subject=BetterClose%20early%20access"
            className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow transition-colors"
          >
            Email hello@betterclose.co →
          </a>
          <p className="text-xs text-gray-500 mt-3">
            We'll let you know the moment we're ready.
          </p>
        </div>

        <div className="flex justify-center gap-6 mt-10 text-xs text-gray-500">
          <span>30,000+ closings</span>
          <span>·</span>
          <span>Bonded $5M</span>
          <span>·</span>
          <span>50 states</span>
        </div>
      </div>
    </main>
  )
}
