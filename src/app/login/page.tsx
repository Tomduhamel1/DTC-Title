'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'

function LoginInner() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const error = searchParams.get('error')

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
              <h1 className="text-3xl font-black text-dark-900 mb-2">Sign in</h1>
              <p className="text-sm text-gray-600">
                We'll email you a one-tap link. No password needed.
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
                className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending sign-in link…' : 'Email me a sign-in link →'}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-6">
              By signing in you agree to our{' '}
              <Link href="/terms" className="underline">terms</Link> and{' '}
              <Link href="/privacy" className="underline">privacy policy</Link>.
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
