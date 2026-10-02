'use client'

import { useEffect, useRef, useState } from 'react'
import { readEmailConfirmation, type EmailConfirmation } from '@/lib/auth/emailConfirmation'

export default function ConfirmSignIn() {
  const [data, setData] = useState<EmailConfirmation | null>(null)
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const initialized = useRef(false)
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    setData(readEmailConfirmation(new URLSearchParams(window.location.hash.slice(1)), window.location.origin))
    window.history.replaceState(null, '', window.location.pathname)
    setReady(true)
  }, [])
  return <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-6 py-16">
    <section className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-xl text-center" aria-labelledby="confirm-heading">
      <div className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">BetterClose</div>
      <h1 id="confirm-heading" className="mb-3 text-3xl font-black text-gray-900">Confirm your sign-in</h1>
      {data ? <>
        <p className="mb-2 text-sm text-gray-600">Continue as</p>
        <p className="mb-5 break-all font-semibold text-gray-900">{data.email}</p>
        <p className="mb-6 text-sm leading-relaxed text-gray-600">This extra step keeps email security checks from using your link before you do. No password needed.</p>
        <form action="/api/auth/callback/email" method="post" onSubmit={event => {
          if (busy) { event.preventDefault(); return }
          setBusy(true)
        }}>
          {Object.entries(data).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
          <button type="submit" disabled={busy} className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
            {busy ? 'Signing in…' : 'Continue signing in'}
          </button>
        </form>
        <a href="/login" className="mt-5 inline-block text-sm text-gray-600 underline underline-offset-4">Use a different email</a>
        <p className="mt-5 text-xs leading-relaxed text-gray-500">Your personal link works once and expires after 24 hours. Please don’t forward it.</p>
      </> : ready ? <>
        <p className="mb-6 text-sm leading-relaxed text-gray-600">Open the link in your sign-in email, or request a new one below.</p>
        <a href="/login" className="block rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white">Get a new sign-in link</a>
      </> : <p className="text-sm text-gray-600" role="status">Preparing your secure sign-in…</p>}
    </section>
  </main>
}
