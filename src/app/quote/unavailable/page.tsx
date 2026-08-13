'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import TrueFeelogo from '@/components/TrueFeelogo'
import { STATE_NAMES, offeredStateCount } from '@/lib/stateMaster'

// Shown when a visitor asks for an estimate somewhere we don't close yet.
// Params (all optional): state=XX, type=purchase|refinance, zip=NNNNN,
// source=broker. Collects an email so we can tell them when we open there.
export default function QuoteUnavailablePage() {
  const [params, setParams] = useState<{
    state: string | null
    type: string | null
    zip: string | null
    source: string | null
  }>({ state: null, type: null, zip: null, source: null })
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    setParams({
      state: q.get('state'),
      type: q.get('type'),
      zip: q.get('zip'),
      source: q.get('source'),
    })
  }, [])

  const stateName = params.state ? (STATE_NAMES[params.state] ?? params.state) : null
  const modeWord = params.type === 'refinance' ? 'refinances' : 'closings'
  const backHref = params.source === 'broker' ? '/quote?source=broker' : '/quote'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          state: params.state ?? undefined,
          zipCode: params.zip ?? undefined,
          source: 'availability-waitlist',
          notes: `Availability waitlist: ${params.type ?? 'unknown type'} in ${
            params.state ?? 'unknown state'
          }${params.zip ? ` (zip ${params.zip})` : ''}`,
        }),
      })
      const json = await res.json().catch(() => null)
      setStatus(json?.success ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full text-center">
        <div className="flex justify-center mb-10">
          <Link href="/">
            <TrueFeelogo className="h-12" />
          </Link>
        </div>

        <div className="inline-block bg-primary-100 text-primary-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6">
          Coming soon{stateName ? ` to ${stateName}` : ''}
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-dark-900 leading-tight mb-6">
          We're not in {stateName ?? 'your area'} yet —
          <br />
          <span className="text-primary-600">but we're on our way.</span>
        </h1>

        <p className="text-lg text-gray-700 mb-10 leading-relaxed max-w-xl mx-auto">
          BetterClose handles {modeWord} in {offeredStateCount()} states today, and
          we're expanding. Leave your email and we'll let you know the moment we
          open{stateName ? ` in ${stateName}` : ' near you'} — nothing else, no
          spam.
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 max-w-md mx-auto">
          {status === 'done' ? (
            <div>
              <div className="text-3xl mb-3">✓</div>
              <div className="font-bold text-dark-900 mb-1">You're on the list</div>
              <p className="text-sm text-gray-600">
                We'll email you as soon as we're live
                {stateName ? ` in ${stateName}` : ' in your area'}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Get notified when we launch
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="block w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow transition-colors"
              >
                {status === 'sending' ? 'Adding you…' : 'Notify me'}
              </button>
              {status === 'error' && (
                <p className="text-xs text-red-600 mt-3">
                  Something went wrong — please try again, or email
                  hello@betterclose.co.
                </p>
              )}
              <p className="text-xs text-gray-500 mt-3">
                Optional — we only use this to tell you when we're available.
              </p>
            </form>
          )}
        </div>

        <div className="mt-8">
          <Link
            href={backHref}
            className="text-sm font-semibold text-primary-700 hover:text-primary-800"
          >
            ← Try a different location
          </Link>
        </div>

        <div className="flex justify-center gap-6 mt-10 text-xs text-gray-500">
          <span>30,000+ closings</span>
          <span>·</span>
          <span>Every fee published</span>
          <span>·</span>
          <span>{offeredStateCount()} states and growing</span>
        </div>
      </div>
    </main>
  )
}
