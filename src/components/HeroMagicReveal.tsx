'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { estimateLifetimeSavings } from '@/lib/regionRates'

const STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
]

type Mode = 'purchase' | 'refinance'

export default function HeroMagicReveal() {
  const [mode, setMode] = useState<Mode>('purchase')
  const [homeValue, setHomeValue] = useState(500000)
  const [state, setState] = useState<string | null>(null)
  const [city, setCity] = useState<string | null>(null)
  const [editingLocation, setEditingLocation] = useState(false)

  // IP geolocation on mount. Failure is silent — we just default to national.
  useEffect(() => {
    let cancelled = false
    fetch('/api/geo')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data.state) setState(data.state)
        if (data.city) setCity(data.city)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const savings = estimateLifetimeSavings(homeValue, mode, state)
  const locationLabel = city
    ? `${city}${state ? `, ${state}` : ''}`
    : state
    ? state
    : 'your area'
  const headlineCopy =
    mode === 'refinance'
      ? `${city ? `Refinancing in ${city}?` : 'Refinancing?'} You'd save`
      : `${city ? `Buyers in ${city}` : 'Buyers in your area'} save on average`

  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-white py-12 md:py-16 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: hero copy */}
        <div className="text-left">
          <div className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            ✓ Same realtor. Same lender. Better cost.
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark-900 leading-tight mb-5">
            Don't overpay for closing costs.
            <span className="block text-emerald-600 mt-2">Save thousands.</span>
          </h1>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            BetterClose handles your title and settlement at a fair price.
            Same A-rated underwriters every other title company uses — just up
            to <strong>75% less</strong>.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">✓ <span>50 states</span></span>
            <span className="flex items-center gap-1.5">✓ <span>Bonded $5M</span></span>
            <span className="flex items-center gap-1.5">✓ <span>30,000+ closings</span></span>
          </div>
        </div>

        {/* Right: Magic Reveal calculator */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-7">
          <div className="text-center mb-5">
            {/* Purchase / Refinance toggle */}
            <div className="inline-flex p-1 bg-gray-100 rounded-full mb-3">
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

            <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-700 mb-1">
              📍 {headlineCopy}
            </div>
            <div className="text-6xl md:text-7xl font-black text-emerald-600 tabular-nums leading-none">
              ${savings.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              over the life of a 30-year mortgage
            </div>
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
            Get my exact estimate
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {/* Location override */}
          <div className="mt-2.5 text-center text-[11px] text-gray-400">
            📍 Auto-detected{' '}
            {!editingLocation ? (
              <button
                onClick={() => setEditingLocation(true)}
                className="underline hover:text-gray-600"
              >
                change
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 ml-1">
                <select
                  value={state || ''}
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
                  className="text-emerald-700 underline"
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
