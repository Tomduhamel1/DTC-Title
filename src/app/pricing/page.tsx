'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSupportedStates } from '@/lib/title-calculator'

export default function PricingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    transactionType: '',
    homeValue: '',
    loanAmount: '',
    state: '',
    county: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const states = getSupportedStates()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionType: formData.transactionType,
          homeValue: parseFloat(formData.homeValue),
          loanAmount: parseFloat(formData.loanAmount),
          state: formData.state,
          county: formData.county || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate savings')
      }

      // Store the quote data and navigate to results
      sessionStorage.setItem('quoteData', JSON.stringify(data))
      router.push('/pricing/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - eLEND Style */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <nav className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-2xl font-bold text-dark-800 hover:text-primary-600 transition-colors">
                TrueFee Closing
              </Link>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-sm text-gray-500 font-medium">powered by eLEND</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="tel:1-800-316-9508" className="hidden lg:flex items-center text-dark-800 hover:text-primary-600 font-medium">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                1.800.316.9508
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Calculate Your Closing Cost Savings
            </h1>
            <p className="text-lg text-gray-600">
              See how much you can save on title insurance and settlement fees.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="transactionType" className="label">
                  Transaction Type
                </label>
                <select
                  id="transactionType"
                  name="transactionType"
                  value={formData.transactionType}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select transaction type</option>
                  <option value="purchase">Home Purchase</option>
                  <option value="refinance">Refinance</option>
                </select>
              </div>

              <div>
                <label htmlFor="homeValue" className="label">
                  Home Value / Purchase Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="homeValue"
                    name="homeValue"
                    value={formData.homeValue}
                    onChange={handleChange}
                    className="input-field pl-8"
                    placeholder="500,000"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="loanAmount" className="label">
                  Loan Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="loanAmount"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    className="input-field pl-8"
                    placeholder="400,000"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="state" className="label">
                  Property State
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select state</option>
                  {states.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="county" className="label">
                  County (Optional)
                </label>
                <input
                  type="text"
                  id="county"
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Los Angeles"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Calculating...' : 'See My Savings'}
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-6">
              Estimate only. Actual costs determined by property details and state regulations.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
