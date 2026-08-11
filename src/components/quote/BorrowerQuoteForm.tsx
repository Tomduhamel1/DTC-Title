'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Borrower-facing quote form. Extracted verbatim from src/app/quote/page.tsx
// when the broker estimate split out — preserves the exact pre-extraction
// behavior so the borrower flow is provably isolated from broker iterations.
// Required fields: ZIP + (purchase price | loan amount).
export default function BorrowerQuoteForm() {
  const router = useRouter()
  const [transactionType, setTransactionType] = useState<'purchase' | 'refinance'>('purchase')
  const [zip, setZip] = useState('')
  const [homeValue, setHomeValue] = useState('500000')
  const [loanAmount, setLoanAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // 'unavailable' renders as an amber informational notice (service-area), not a red error.
  const [errorKind, setErrorKind] = useState<'error' | 'unavailable'>('error')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stashed = sessionStorage.getItem('feeReportError')
    if (stashed) {
      setError(stashed)
      setErrorKind(sessionStorage.getItem('feeReportErrorKind') === 'unavailable' ? 'unavailable' : 'error')
      sessionStorage.removeItem('feeReportError')
      sessionStorage.removeItem('feeReportErrorKind')
    }
  }, [])

  const isPurchase = transactionType === 'purchase'
  const zipValid = /^\d{5}$/.test(zip)
  const homeValueNum = parseFloat(homeValue.replace(/[^0-9.]/g, '')) || 0
  const loanAmountNum = parseFloat(loanAmount.replace(/[^0-9.]/g, '')) || 0
  const valid = zipValid && (isPurchase ? homeValueNum > 0 : loanAmountNum > 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid || submitting) return
    setSubmitting(true)
    setError(null)

    const payload = {
      transactionType,
      zip,
      homeValue: isPurchase ? homeValueNum : undefined,
      loanAmount: loanAmountNum > 0 ? loanAmountNum : undefined,
    }

    sessionStorage.setItem('feeReportInputs', JSON.stringify(payload))
    sessionStorage.removeItem('feeReport')
    sessionStorage.removeItem('feeReportError')

    router.push('/quote/working')
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white py-16 px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-dark-900 mb-3">Get your fee estimate</h1>
          <p className="text-gray-600">
            Tell us about your closing. We'll show you every fee and how we compare to the typical range.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transaction type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['purchase', 'refinance'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTransactionType(opt)}
                  className={`py-3 rounded-lg border-2 font-semibold capitalize transition-colors ${
                    transactionType === opt
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="zip" className="block text-sm font-semibold text-gray-700 mb-2">
              ZIP code
            </label>
            <input
              id="zip"
              type="text"
              inputMode="numeric"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
              maxLength={5}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>

          {isPurchase && (
            <div>
              <label htmlFor="homeValue" className="block text-sm font-semibold text-gray-700 mb-2">
                Purchase amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  id="homeValue"
                  type="text"
                  inputMode="numeric"
                  value={homeValue}
                  onChange={(e) => setHomeValue(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="loanAmount" className="block text-sm font-semibold text-gray-700 mb-2">
              Loan amount{' '}
              {isPurchase && (
                <span className="text-gray-400 font-normal">(optional)</span>
              )}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                id="loanAmount"
                type="text"
                inputMode="numeric"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>
          </div>

          {error && (
            <div
              className={
                errorKind === 'unavailable'
                  ? 'bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-900'
                  : 'bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800'
              }
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!valid || submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 rounded-lg shadow-md transition-colors disabled:opacity-60"
          >
            {submitting ? 'Building your estimate…' : 'Get my fee estimate'}
          </button>
        </form>
      </div>
    </div>
  )
}
