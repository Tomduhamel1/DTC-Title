'use client'

import { useEffect, useRef, useState } from 'react'

export default function FileAccessCard({ closingId, signedIn }: { closingId: string; signedIn: boolean }) {
  const [token, setToken] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [retry, setRetry] = useState(false)
  const initialized = useRef(false)
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const key = new URLSearchParams(window.location.hash.slice(1)).get('key')
    setToken(key && /^[a-f0-9]{64}$/.test(key) ? key : null)
    window.history.replaceState(null, '', window.location.pathname)
    setReady(true)
  }, [])
  const login = `/login?callbackUrl=${encodeURIComponent(`/teammate/dashboard/${closingId}`)}`
  async function openFile() {
    if (!token || busy) return
    setBusy(true); setRetry(false)
    try {
      const response = await fetch(`/api/file-access/${encodeURIComponent(closingId)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }),
      })
      if (response.ok) {
        const { url } = await response.json()
        const target = new URL(url)
        if (target.origin !== window.location.origin || target.pathname !== '/api/auth/callback/email') throw new Error('Invalid access response')
        window.location.replace(target.href)
      } else if (response.status === 410) { setToken(null); setUnavailable(true) }
      else setRetry(true)
    } catch { setRetry(true) }
    finally { setBusy(false) }
  }
  const expired = unavailable || (ready && !token)
  return <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-6 py-16">
    <section className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-xl text-center" aria-labelledby="access-heading">
      <div className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">BetterClose</div>
      <h1 id="access-heading" className="mb-3 text-3xl font-black text-gray-900">View your file</h1>
      <p className="mb-6 text-sm leading-relaxed text-gray-600">
        {expired ? 'This link has expired, has already been used, or is no longer available. Request a fresh secure link using the email that received your file update.'
          : 'Your email includes secure access to your file. No password or account setup needed.'}
      </p>
      {!expired && signedIn && <p className="mb-5 text-sm text-gray-600">Continuing will switch to the account that received this email.</p>}
      {retry && <p role="alert" className="mb-4 text-sm text-red-700">We couldn’t open the file yet. Please try again.</p>}
      {expired ? <a href={login} className="block rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">Get a new access link</a>
        : <button onClick={openFile} disabled={!ready || busy} className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
          {busy ? 'Opening your file…' : 'View my file'}
        </button>}
      <p className="mt-5 text-xs leading-relaxed text-gray-500">This personal access link expires after 24 hours. Please don’t forward it.</p>
      {!expired && <a href={login} className="mt-4 inline-block text-sm text-gray-600 underline underline-offset-4">Use a different email</a>}
    </section>
  </main>
}
