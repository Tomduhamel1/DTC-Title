'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { estimateSavings, resolveStateCode } from '@/lib/stateSavings'
import { offeredStateCount, stateOffered } from '@/lib/stateMaster'
import { useSavings } from '@/contexts/SavingsContext'
import RotatingSavingsPill from '@/components/RotatingSavingsPill'
import SavingsCard from '@/components/SavingsCard'

const STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
]

type Mode = 'purchase' | 'refinance'

export default function HeroMagicReveal() {
  const [mode, setMode] = useState<Mode>('purchase')
  const [homeValue, setHomeValue] = useState(500000)
  const [state, setState] = useState<string | null>(null)
  const [editingLocation, setEditingLocation] = useState(false)
  const { savings: ctxSavings, setSavings } = useSavings()

  useEffect(() => {
    let cancelled = false
    fetch('/api/geo')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data.state) setState(data.state)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // A geo-detected state we don't serve must never be promised local
  // savings — drop the local labeling and show the national example
  // (estimateSavings already falls back to national numbers for OFF states).
  const code = resolveStateCode(state)
  const served = !!code && (stateOffered(code, 'purchase') || stateOffered(code, 'refinance'))

  const { saveAtClosing, saveOverLoan } = estimateSavings(homeValue, mode, state)

  // Push hero savings into the shared SavingsContext so downstream sections
  // (TeamTrustSection, etc.) display the same numbers the user is seeing here.
  // totalSavings = at-closing bucket, lifetimeSavings = over-the-loan bucket.
  useEffect(() => {
    setSavings({ ...ctxSavings, totalSavings: saveAtClosing, lifetimeSavings: saveOverLoan })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveAtClosing, saveOverLoan])

  // Local copy requires a selected/detected state we serve.
  // Unknown or unserved locations still show the existing national example.
  const subject = mode === 'refinance' ? 'Refinancings' : 'Buyers'
  const headlineCopy =
    served ? `${subject} in your area typically save` : `${subject} typically save`

  return (
    <section data-home-hero className="relative bg-white pt-7 pb-10 sm:py-12 md:py-16 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-7 sm:gap-12 items-center">
        {/* Left: hero copy */}
        <div data-hero-copy className="text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark-900 leading-[1.08] tracking-tight mb-4 sm:mb-5">
            Don't overpay for closing costs.
            <span className="block text-emerald-600 mt-2">Save hundreds.</span>
          </h1>
          <p data-hero-description className="max-w-xl text-base sm:text-lg text-gray-700 leading-relaxed">
            Choose BetterClose for <strong className="font-semibold text-dark-900">title and settlement at a lower cost.</strong>{' '}
            Get a dedicated closing team and transparent pricing, line by line.
          </p>
          <p data-hero-reassurance className="mt-4 flex items-start gap-2 text-sm font-medium text-dark-800">
            <span aria-hidden="true" className="text-emerald-600">✓</span>
            <span>Keep your agent. Keep your lender.</span>
          </p>
          <div data-hero-mobile-action className="mt-5 lg:hidden">
            <Link href="/quote" className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-3 font-bold text-white shadow-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
              See my savings <span aria-hidden="true">→</span>
            </Link>
            <p className="mt-2 text-center sm:text-left text-xs text-gray-500">Free estimate. No obligation.</p>
          </div>
          <div data-hero-proof className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-gray-600">
            <span className="flex items-center gap-1.5"><span aria-hidden="true" className="text-emerald-600">✓</span> <span>{offeredStateCount()} states</span></span>
            <span className="flex items-center gap-1.5"><span aria-hidden="true" className="text-emerald-600">✓</span> <span>30,000+ closings</span></span>
          </div>
        </div>

        {/* Right: Magic Reveal calculator */}
        <div data-hero-calculator className="min-w-0 bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl border border-gray-100 p-4 sm:p-6 md:p-7">
          <div className="text-center mb-5">
            {/* Purchase / Refinance toggle */}
            <div className="inline-flex p-1 bg-gray-100 rounded-full mb-4">
              <button
                onClick={() => setMode('purchase')}
                className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all ${
                  mode === 'purchase' ? 'bg-white text-dark-900 shadow' : 'text-gray-600'
                }`}
              >
                Purchase
              </button>
              <button
                onClick={() => setMode('refinance')}
                className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all ${
                  mode === 'refinance' ? 'bg-white text-dark-900 shadow' : 'text-gray-600'
                }`}
              >
                Refinance
              </button>
            </div>

            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-3">
              {headlineCopy}
            </div>
            {/* Two savings buckets, visually separated */}
            <div className="grid grid-cols-2 gap-3">
              <SavingsCard label="Save at closing" amount={`$${saveAtClosing.toLocaleString()}`} caption="Title & settlement" />
              <SavingsCard label="Total over the loan" amount={`$${saveOverLoan.toLocaleString()}`} caption="Includes at-closing savings" />
            </div>

            {/* Everyday comparisons use at-closing savings, not future interest. */}
            <RotatingSavingsPill savings={saveAtClosing} tail="back in your pocket" className="mt-4" />
          </div>

          {/* Slider */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-700">
                {mode === 'refinance' ? 'On a home valued at' : 'For a home priced at'}
              </span>
              <span className="text-base font-black text-dark-900 tabular-nums">
                ${homeValue.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={150000}
              max={1500000}
              step={25000}
              value={homeValue}
              aria-label={mode === 'refinance' ? 'Home value' : 'Home purchase price'}
              onChange={(e) => setHomeValue(parseInt(e.target.value))}
              className="magic-slider w-full"
            />
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
              <span>$150k</span>
              <span>$1.5M</span>
            </div>
          </div>

          <Link
            href="/quote"
            className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md text-base transition-colors"
          >
            Get my fee estimate
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {/* Plain-English footnote for the over-the-loan number */}
          <p className="mt-3 text-[11px] text-gray-400 leading-snug">
            The loan total includes at-closing savings plus modeled interest avoided
            if you borrow that much less, at 6.5% over 30 years. It is not
            additional cash at closing or a lower loan rate.
          </p>

          {/* Location override */}
          <div className="mt-2.5 text-center text-xs text-gray-600">
            <span className="font-semibold">In your area:</span>{' '}
            {served ? code : code ? `${code} not yet available · National example` : 'National example'}{' '}
            {!editingLocation ? (
              <button
                onClick={() => setEditingLocation(true)}
                className="underline hover:text-gray-800"
              >
                {code ? 'Change state' : 'Choose your state'}
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 ml-1">
                <select
                  value={state || ''}
                  aria-label="Your state"
                  onChange={(e) => setState(e.target.value || null)}
                  className="text-[11px] border border-gray-300 rounded px-1.5 py-0.5 bg-white"
                >
                  <option value="">National avg</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setEditingLocation(false)}
                  className="text-emerald-600 underline"
                >
                  done
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .magic-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 4px;
          background: #e5e7eb;
          outline: none;
        }
        .magic-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          background: white;
          border: 4px solid #10b981;
          cursor: grab;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
          transition: transform 0.12s;
        }
        .magic-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.15);
        }
        .magic-slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          background: white;
          border: 4px solid #10b981;
          cursor: grab;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
        }
      `}</style>
    </section>
  )
}
