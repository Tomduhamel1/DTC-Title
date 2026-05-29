'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'

function LoginInner() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const error = searchParams.get('error')
  // Broker-funnel signup variant — when ?mode=signup&source=broker is present
  // (set by /quote/results CTAs when the broker is logged out), swap headline,
  // subhead, CTA label, and add a reassurance line about preserving the
  // estimate. Magic-link mechanics underneath are unchanged: NextAuth's Email
  // provider creates the user on first sign-in, so "signup" and "login" use
  // the same call.
  const isBrokerSignup =
    searchParams.get('mode') === 'signup' &&
    searchParams.get('source') === 'broker'

  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setSubmitting(true)
    await signIn('email', { email, callbackUrl, redirect: true })
  }

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />
      <main className="bg-gradient-to-br from-primary-50 to-white min-h-[calc(100vh-5rem)] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10">
            <div className="text-center mb-7">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-dark-900 mb-2">
                BetterClose
              </div>
              <h1 className="text-3xl font-black text-dark-900 mb-2">
                {isBrokerSignup ? 'Create your broker account' : 'Sign in'}
              </h1>
              <p className="text-sm text-gray-600">
                {isBrokerSignup
                  ? 'Save this estimate, send it to your borrower, or open the closing.'
                  : "We'll email you a one-tap link. No password needed."}
              </p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                {error === 'EmailSignin'
                  ? 'Could not send email. Please try again or contact us.'
                  : error === 'Verification'
                  ? 'That sign-in link has expired. Request a new one below.'
                  : 'Something went wrong. Please try again.'}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoFocus
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !email.includes('@')}
                className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? isBrokerSignup
                    ? 'Sending setup link…'
                    : 'Sending sign-in link…'
                  : isBrokerSignup
                  ? 'Email me a setup link →'
                  : 'Email me a sign-in link →'}
              </button>
            </form>

            {isBrokerSignup && (
              <p className="mt-5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center">
                We&apos;ll bring this estimate with you after you sign in.
              </p>
            )}

            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing, you agree to receive a secure sign-in link from BetterClose.
            </p>
          </div>
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginInner />
    </Suspense>
  )
}
