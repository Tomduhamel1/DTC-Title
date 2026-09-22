'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Ops: open a file from an emailed/phoned-in order in under a minute.
// Posts to /api/admin/closings (same write path as Garden ingest), then
// lands on the closing detail page to assign the officer + milestones.
// Layout auth: /admin/layout.tsx gates this route; the API re-checks.

export default function AdminNewClosingPage() {
  const router = useRouter()
  const [f, setF] = useState<Record<string, string>>({
    borrowerName: '',
    borrowerEmail: '',
    borrowerPhone: '',
    propertyAddress: '',
    propertyCity: '',
    propertyState: '',
    propertyZip: '',
    propertyType: 'purchase',
    salePrice: '',
    loanAmount: '',
    closingDate: '',
    placedByName: '',
    placedByEmail: '',
    placedByCompany: '',
    placedByRole: 'lender',
    gardenFileNumber: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.value })

  const num = (s: string) => {
    const n = parseFloat(s.replace(/[^0-9.]/g, ''))
    return Number.isFinite(n) && n > 0 ? n : undefined
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/closings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borrowerName: f.borrowerName || undefined,
          borrowerEmail: f.borrowerEmail || undefined,
          borrowerPhone: f.borrowerPhone || undefined,
          propertyAddress: f.propertyAddress || undefined,
          propertyCity: f.propertyCity || undefined,
          propertyState: f.propertyState || undefined,
          propertyZip: f.propertyZip || undefined,
          propertyType: (f.propertyType as 'purchase' | 'refinance') || undefined,
          salePrice: num(f.salePrice),
          loanAmount: num(f.loanAmount),
          closingDate: f.closingDate || undefined,
          placedByName: f.placedByName || undefined,
          placedByEmail: f.placedByEmail || undefined,
          placedByCompany: f.placedByCompany || undefined,
          placedByRole: f.placedByEmail
            ? (f.placedByRole as 'lender' | 'broker' | 'realtor')
            : undefined,
          gardenFileNumber: f.gardenFileNumber || undefined,
        }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) {
        setError(json?.error || `Failed (${res.status})`)
        setSubmitting(false)
        return
      }
      router.push(`/admin/closings/${json.closingId}${json.matched ? '?matched=1' : ''}`)
    } catch {
      setError('Request failed — try again.')
      setSubmitting(false)
    }
  }

  const input =
    'w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none'
  const label = 'block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1'

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/closings" className="text-sm text-gray-500 hover:text-gray-700 inline-block mb-4">
          ← All closings
        </Link>
        <h1 className="text-2xl font-black text-dark-900 mb-1">Open a file (ops)</h1>
        <p className="text-sm text-gray-600 mb-6">
          For orders that arrive by email or phone. Everything is optional except a
          borrower email <em>or</em> a property address; matching/dedupe, the borrower
          welcome email, and the teammate dashboard invite all run automatically. You
          land on the file page next — assign the escrow officer there.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-dark-900 uppercase tracking-wider mb-4">Borrower</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <div><label className={label}>Name</label><input className={input} value={f.borrowerName} onChange={set('borrowerName')} /></div>
              <div><label className={label}>Email</label><input type="email" className={input} value={f.borrowerEmail} onChange={set('borrowerEmail')} /></div>
              <div><label className={label}>Phone</label><input type="tel" className={input} value={f.borrowerPhone} onChange={set('borrowerPhone')} /></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-dark-900 uppercase tracking-wider mb-4">Property & transaction</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><label className={label}>Street address</label><input className={input} value={f.propertyAddress} onChange={set('propertyAddress')} /></div>
              <div><label className={label}>City</label><input className={input} value={f.propertyCity} onChange={set('propertyCity')} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={label}>State</label><input maxLength={2} placeholder="RI" className={input} value={f.propertyState} onChange={set('propertyState')} /></div>
                <div><label className={label}>ZIP</label><input maxLength={5} className={input} value={f.propertyZip} onChange={set('propertyZip')} /></div>
              </div>
              <div>
                <label className={label}>Type</label>
                <select className={`${input} bg-white`} value={f.propertyType} onChange={set('propertyType')}>
                  <option value="purchase">Purchase</option>
                  <option value="refinance">Refinance</option>
                </select>
              </div>
              <div><label className={label}>Closing date</label><input type="date" className={input} value={f.closingDate} onChange={set('closingDate')} /></div>
              <div><label className={label}>Sale price ($)</label><input inputMode="numeric" className={input} value={f.salePrice} onChange={set('salePrice')} /></div>
              <div><label className={label}>Loan amount ($)</label><input inputMode="numeric" className={input} value={f.loanAmount} onChange={set('loanAmount')} /></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-dark-900 uppercase tracking-wider mb-1">Placed by</h3>
            <p className="text-xs text-gray-500 mb-4">
              From the email signature. They get a dashboard-invite email and the file
              shows on their teammate dashboard under this address.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><label className={label}>Name</label><input className={input} value={f.placedByName} onChange={set('placedByName')} /></div>
              <div><label className={label}>Work email</label><input type="email" className={input} value={f.placedByEmail} onChange={set('placedByEmail')} /></div>
              <div><label className={label}>Company</label><input className={input} value={f.placedByCompany} onChange={set('placedByCompany')} /></div>
              <div>
                <label className={label}>Role</label>
                <select className={`${input} bg-white`} value={f.placedByRole} onChange={set('placedByRole')}>
                  <option value="lender">Lender / LO</option>
                  <option value="broker">Broker</option>
                  <option value="realtor">Real estate agent</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-dark-900 uppercase tracking-wider mb-4">Garden link (optional)</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><label className={label}>Garden file #</label><input className={input} value={f.gardenFileNumber} onChange={set('gardenFileNumber')} /></div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl disabled:opacity-50"
          >
            {submitting ? 'Opening…' : 'Open the file →'}
          </button>
        </form>
      </div>
    </div>
  )
}
