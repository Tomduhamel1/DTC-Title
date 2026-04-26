'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

interface LenderRequestConfirmationProps {
  lenderEmail: string
  clientEmail?: string
}

export default function LenderRequestConfirmation({
  lenderEmail,
  clientEmail,
}: LenderRequestConfirmationProps) {
  return (
    <div>
      {/* Sent confirmation */}
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-3">
          <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-dark-900 mb-1">Email sent</h3>
        <p className="text-sm text-gray-600">
          We introduced you to <strong className="text-dark-900">{lenderEmail}</strong>.
          {clientEmail && <> You're CC'd at <strong className="text-dark-900">{clientEmail}</strong>.</>}
        </p>
      </div>

      {/* Track-this-closing prompt */}
      <TrackThisClosingPrompt prefilledEmail={clientEmail} />
    </div>
  )
}

function TrackThisClosingPrompt({ prefilledEmail }: { prefilledEmail?: string }) {
  const [email, setEmail] = useState(prefilledEmail || '')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
        <div className="text-base font-bold text-emerald-900 mb-1">Check your email</div>
        <p className="text-sm text-emerald-800">
          Tap the sign-in link we sent to <strong>{email}</strong> to open your dashboard.
        </p>
      </div>
    )
  }

  const valid = email.includes('@')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return
    setSubmitting(true)
    await signIn('email', { email, callbackUrl: '/dashboard', redirect: false })
    setSent(true)
    setSubmitting(false)
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg">
          📊
        </div>
        <div>
          <div className="text-base font-black text-dark-900 leading-tight">
            Track this closing
          </div>
          <p className="text-sm text-gray-600 mt-0.5">
            Create a free dashboard. See lender, agent, and milestones update as your closing happens — 30 seconds.
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="flex-1 min-w-0 px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
        />
        <button
          type="submit"
          disabled={!valid || submitting}
          className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold whitespace-nowrap shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? '…' : 'Track →'}
        </button>
      </form>
      <p className="text-[11px] text-gray-500 mt-2 text-center">
        We'll email you a one-tap sign-in link. No password.
      </p>
    </div>
  )
}
