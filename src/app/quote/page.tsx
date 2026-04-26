'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMockFeeReport } from '@/lib/feeReport'

export default function QuotePage() {
  const router = useRouter()
  const [transactionType, setTransactionType] = useState<'purchase' | 'refinance'>('purchase')
  const [homeValue, setHomeValue] = useState('500000')
  const [state, setState] = useState('Texas')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Stash inputs for the working/results screens. When the real API lands,
    // the working screen will issue the request using these inputs.
    const inputs = {
      transactionType,
      homeValue: parseFloat(homeValue.replace(/[^0-9.]/g, '')) || 500000,
      state,
    }
    sessionStorage.setItem('feeReportInputs', JSON.stringify(inputs))

    // Pre-compute mock report so working screen has something to hand off.
    // Replace this with the real API call inside the working screen later.
    const report = getMockFeeReport(inputs)
    sessionStorage.setItem('feeReport', JSON.stringify(report))

    router.push('/quote/working')
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-white py-16 px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-dark-900 mb-3">Get your fee report</h1>
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
            <label htmlFor="homeValue" className="block text-sm font-semibold text-gray-700 mb-2">
              Home value
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

          <div>
            <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
              State
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none bg-white"
            >
              {['Texas', 'Florida', 'California', 'New York', 'Georgia', 'Arizona', 'North Carolina'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-4 rounded-lg shadow-md transition-colors disabled:opacity-60"
          >
            {submitting ? 'Building your report…' : 'Get my fee report'}
          </button>
        </form>
      </div>
    </div>
  )
}
