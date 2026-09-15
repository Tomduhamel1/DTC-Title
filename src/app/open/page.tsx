'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import { STATE_NAMES } from '@/lib/stateMaster'

// Public open-a-file form — the one CTA target that actually creates an order.
// Works for all four personas; professionals add their own contact so the file
// lands on their teammate dashboard too. POSTs to /api/orders/open, which
// shares the exact write path Garden/TPS ingestion uses.

type Role = 'borrower' | 'broker' | 'realtor' | 'lender'

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'borrower', label: "I'm the buyer / borrower" },
  { value: 'broker', label: "I'm a loan officer / broker" },
  { value: 'realtor', label: "I'm a real estate agent" },
  { value: 'lender', label: "I'm a lender" },
]

const STATE_CODES = Object.keys(STATE_NAMES).sort()

export default function OpenFilePage() {
  const [role, setRole] = useState<Role>('borrower')
  const [submitterName, setSubmitterName] = useState('')
  const [submitterEmail, setSubmitterEmail] = useState('')
  const [submitterCompany, setSubmitterCompany] = useState('')
  const [submitterPhone, setSubmitterPhone] = useState('')
  const [borrowerName, setBorrowerName] = useState('')
  const [borrowerEmail, setBorrowerEmail] = useState('')
  const [borrowerPhone, setBorrowerPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [zip, setZip] = useState('')
  const [transactionType, setTransactionType] = useState<'purchase' | 'refinance'>('purchase')
  const [salePrice, setSalePrice] = useState('')
  const [loanAmount, setLoanAmount] = useState('')
  const [closingDate, setClosingDate] = useState('')
  const [notes, setNotes] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<null | { accountExists: boolean }>(null)

  // Prefill from query params (quote flow hands over state/zip/type/amounts).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const r = q.get('role')
    if (r === 'broker' || r === 'realtor' || r === 'lender' || r === 'borrower') setRole(r)
    const st = q.get('state')
    if (st && STATE_NAMES[st.toUpperCase()]) setStateCode(st.toUpperCase())
    if (q.get('zip')) setZip(q.get('zip')!.slice(0, 5))
    const t = q.get('type')
    if (t === 'purchase' || t === 'refinance') setTransactionType(t)
    if (q.get('price')) setSalePrice(q.get('price')!)
    if (q.get('loan')) setLoanAmount(q.get('loan')!)

    // Deeper prefill from the broker-estimate context stashed by the broker
    // quote form (address, borrower contact) — see src/lib/brokerEstimateContext.
    try {
      const raw = sessionStorage.getItem('brokerEstimateContext')
      if (raw) {
        const ctx = JSON.parse(raw) as Record<string, string | undefined>
        if (ctx.propertyAddress) setAddress(ctx.propertyAddress)
        if (ctx.propertyCity) setCity(ctx.propertyCity)
        if (ctx.propertyState && STATE_NAMES[ctx.propertyState.toUpperCase()])
          setStateCode(ctx.propertyState.toUpperCase())
        if (ctx.propertyZip) setZip(ctx.propertyZip.slice(0, 5))
        if (ctx.borrowerName) setBorrowerName(ctx.borrowerName)
        if (ctx.borrowerEmail) setBorrowerEmail(ctx.borrowerEmail)
        if (ctx.borrowerPhone) setBorrowerPhone(ctx.borrowerPhone)
        if (ctx.targetClosingDate) setClosingDate(ctx.targetClosingDate)
      }
    } catch {}
  }, [])

  const isProfessional = role !== 'borrower'
  const num = (s: string) => {
    const n = parseFloat(s.replace(/[^0-9.]/g, ''))
    return Number.isFinite(n) && n > 0 ? n : undefined
  }
  const valid =
    /\S+@\S+\.\S+/.test(borrowerEmail) &&
    address.trim().length >= 4 &&
    stateCode.length === 2 &&
    /^\d{5}$/.test(zip) &&
    (!isProfessional || /\S+@\S+\.\S+/.test(submitterEmail))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/orders/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          submitterName: isProfessional ? submitterName || undefined : undefined,
          submitterEmail: isProfessional ? submitterEmail || undefined : undefined,
          submitterCompany: isProfessional ? submitterCompany || undefined : undefined,
          submitterPhone: isProfessional ? submitterPhone || undefined : undefined,
          borrowerName: borrowerName || undefined,
          borrowerEmail,
          borrowerPhone: borrowerPhone || undefined,
          propertyAddress: address,
          propertyCity: city || undefined,
          propertyState: stateCode,
          propertyZip: zip,
          transactionType,
          salePrice: num(salePrice),
          loanAmount: num(loanAmount),
          closingDate: closingDate || undefined,
          notes: notes || undefined,
        }),
      })
      const json = await res.json().catch(() => null)
      if (json?.notOffered) {
        window.location.href = `/quote/unavailable?state=${json.state ?? stateCode}&type=${transactionType}`
        return
      }
      if (!res.ok || !json?.ok) {
        setError(json?.error || 'Something went wrong — please try again, or email orders@betterclose.co.')
        setSubmitting(false)
        return
      }
      setDone({ accountExists: Boolean(json.accountExists) })
    } catch {
      setError('Something went wrong — please try again, or email orders@betterclose.co.')
      setSubmitting(false)
    }
  }

  const dashboardHref = isProfessional
    ? '/login?callbackUrl=/teammate/dashboard'
    : '/login?callbackUrl=/dashboard'

  const inputCls =
    'w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
  const labelCls = 'block text-xs font-semibold text-gray-700 mb-1.5'

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />
      <main className="bg-gradient-to-br from-primary-50 to-white min-h-[calc(100vh-5rem)] py-14 px-6">
        <div className="max-w-2xl mx-auto">
          {done ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-black mx-auto mb-5">
                ✓
              </div>
              <h1 className="text-3xl font-black text-dark-900 mb-3">Your file is opened</h1>
              <p className="text-gray-600 mb-2">
                Our closing team confirms new orders within one business day. As soon as your
                escrow officer opens the file, their name, email, and direct phone number will
                appear on the dashboard.
              </p>
              <p className="text-gray-600 mb-8">
                {done.accountExists
                  ? 'Sign in to track it — milestones, contacts, and your closing officer, all in one place.'
                  : "We've emailed a secure dashboard link to " +
                    (isProfessional ? submitterEmail : borrowerEmail) +
                    ' — no password needed. You can also sign in any time with that email.'}
              </p>
              <Link
                href={dashboardHref}
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl shadow transition-colors"
              >
                {done.accountExists ? 'Sign in to your dashboard →' : 'Go to sign-in →'}
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-black text-dark-900 mb-3">Open your file</h1>
                <p className="text-gray-600">
                  Tell us about the closing and we&apos;ll take it from here — your escrow
                  officer&apos;s contact info lands on your dashboard as soon as the file is
                  opened. Confirmed within one business day.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6"
              >
                <div>
                  <label className={labelCls}>Who are you?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRole(opt.value)}
                        className={`px-3 py-2.5 rounded-lg border text-sm font-semibold transition-colors text-left ${
                          role === opt.value
                            ? 'border-primary-500 bg-primary-50 text-primary-800'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {isProfessional && (
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Your contact info
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Your name</label>
                        <input className={inputCls} value={submitterName} onChange={(e) => setSubmitterName(e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Work email *</label>
                        <input type="email" required className={inputCls} value={submitterEmail} onChange={(e) => setSubmitterEmail(e.target.value)} placeholder="you@company.com" />
                      </div>
                      <div>
                        <label className={labelCls}>Company</label>
                        <input className={inputCls} value={submitterCompany} onChange={(e) => setSubmitterCompany(e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Phone</label>
                        <input type="tel" className={inputCls} value={submitterPhone} onChange={(e) => setSubmitterPhone(e.target.value)} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      The file shows up on your dashboard under this email.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {isProfessional ? 'Borrower / buyer' : 'Your contact info'}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>{isProfessional ? 'Borrower name' : 'Your name'}</label>
                      <input className={inputCls} value={borrowerName} onChange={(e) => setBorrowerName(e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>{isProfessional ? 'Borrower email *' : 'Your email *'}</label>
                      <input type="email" required className={inputCls} value={borrowerEmail} onChange={(e) => setBorrowerEmail(e.target.value)} placeholder="name@example.com" />
                    </div>
                    <div>
                      <label className={labelCls}>{isProfessional ? 'Borrower phone' : 'Your phone'}</label>
                      <input type="tel" className={inputCls} value={borrowerPhone} onChange={(e) => setBorrowerPhone(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Property</div>
                  <div>
                    <label className={labelCls}>Street address *</label>
                    <input required className={inputCls} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={labelCls}>City</label>
                      <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>State *</label>
                      <select required className={inputCls} value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
                        <option value="">Select…</option>
                        {STATE_CODES.map((c) => (
                          <option key={c} value={c}>
                            {STATE_NAMES[c]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>ZIP *</label>
                      <input required inputMode="numeric" maxLength={5} className={inputCls} value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Transaction</div>
                  <div className="grid grid-cols-2 gap-3">
                    {(['purchase', 'refinance'] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setTransactionType(opt)}
                        className={`px-3 py-2.5 rounded-lg border text-sm font-semibold capitalize transition-colors ${
                          transactionType === opt
                            ? 'border-primary-500 bg-primary-50 text-primary-800'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {transactionType === 'purchase' && (
                      <div>
                        <label className={labelCls}>Sale price</label>
                        <input inputMode="numeric" className={inputCls} value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="$500,000" />
                      </div>
                    )}
                    <div>
                      <label className={labelCls}>Loan amount</label>
                      <input inputMode="numeric" className={inputCls} value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="$400,000" />
                    </div>
                    <div>
                      <label className={labelCls}>Target closing date</label>
                      <input type="date" className={inputCls} value={closingDate} onChange={(e) => setClosingDate(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Anything else we should know?</label>
                  <textarea rows={3} maxLength={1000} className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!valid || submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 rounded-lg shadow-md transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Opening your file…' : 'Open my file'}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Prefer email? Send the details to{' '}
                  <a href="mailto:orders@betterclose.co" className="text-primary-700 font-semibold">
                    orders@betterclose.co
                  </a>{' '}
                  and we&apos;ll open it for you. No obligation until you confirm with your officer.
                </p>
              </form>
            </>
          )}
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}
