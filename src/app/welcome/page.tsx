'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'

function WelcomeInner() {
  const searchParams = useSearchParams()
  const prefilledEmail = searchParams.get('email') || ''

  const [email, setEmail] = useState(prefilledEmail)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

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
    <>
      <NavigationCredible />
      <div className="h-20" />
      <main className="bg-gradient-to-br from-emerald-50 to-white min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10">
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-3">
                <span className="text-3xl">🎉</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-700 mb-2">
                Your closing was placed with BetterClose
              </div>
              <h1 className="text-3xl font-black text-dark-900 mb-2">Welcome to BetterClose</h1>
              <p className="text-sm text-gray-600">
                Your lender placed your title order with us. Create your dashboard to track it.
              </p>
            </div>

            {sent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <div className="text-base font-bold text-emerald-900 mb-1">Check your email</div>
                <p className="text-sm text-emerald-800">
                  Tap the sign-in link we sent to <strong>{email}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Your email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!valid || submitting}
                  className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending sign-in link…' : 'Email me a sign-in link →'}
                </button>
                <p className="text-xs text-gray-500 text-center">
                  We'll email you a one-tap link. No password needed.
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <WelcomeInner />
    </Suspense>
  )
}
