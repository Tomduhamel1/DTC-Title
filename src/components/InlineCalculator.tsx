'use client'

import { useState, useEffect } from 'react'
import { calculateTitleSavings, getSupportedStates } from '@/lib/title-calculator'

export default function InlineCalculator() {
  const [formData, setFormData] = useState({
    transactionType: 'purchase' as 'purchase' | 'refinance',
    homeValue: '',
    loanAmount: '',
    state: '',
    county: '',
  })

  const [results, setResults] = useState<{
    savings: number
    traditionalCosts: number
    trueFeeClosingCosts: number
    savingsPercentage: number
  } | null>(null)

  const states = getSupportedStates()

  // Calculate results whenever form data changes
  useEffect(() => {
    const homeValue = parseFloat(formData.homeValue)
    const loanAmount = parseFloat(formData.loanAmount)

    // Only calculate if we have required fields
    if (homeValue > 0 && loanAmount > 0 && formData.state) {
      try {
        const calculation = calculateTitleSavings({
          transactionType: formData.transactionType,
          homeValue,
          loanAmount,
          state: formData.state,
          county: formData.county || undefined,
        })

        setResults({
          savings: calculation.savings,
          traditionalCosts: calculation.traditionalCosts.total,
          gardenDTCCosts: calculation.gardenDTCCosts.total,
          savingsPercentage: calculation.savingsPercentage,
        })
      } catch (error) {
        setResults(null)
      }
    } else {
      setResults(null)
    }
  }, [formData])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculate Your Savings</h2>

      {/* Form */}
      <div className="space-y-4 mb-6">
        {/* Transaction Type Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, transactionType: 'purchase' })}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                formData.transactionType === 'purchase'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Purchase
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, transactionType: 'refinance' })}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                formData.transactionType === 'refinance'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Refinance
            </button>
          </div>
        </div>

        {/* Home Value */}
        <div>
          <label htmlFor="homeValue" className="block text-sm font-medium text-gray-700 mb-1">
            {formData.transactionType === 'purchase' ? 'Purchase Price' : 'Home Value'}
          </label>
          <input
            type="number"
            id="homeValue"
            value={formData.homeValue}
            onChange={(e) => setFormData({ ...formData, homeValue: e.target.value })}
            placeholder="500000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Loan Amount */}
        <div>
          <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount
          </label>
          <input
            type="number"
            id="loanAmount"
            value={formData.loanAmount}
            onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
            placeholder="400000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            Property State
          </label>
          <select
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* County (Optional) */}
        <div>
          <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1">
            County or ZIP <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            type="text"
            id="county"
            value={formData.county}
            onChange={(e) => setFormData({ ...formData, county: e.target.value })}
            placeholder="Los Angeles"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Live Results */}
      {results && (
        <div className="border-t border-gray-200 pt-6">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-600 mb-2">You'll likely save</div>
            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-1">
              {formatCurrency(results.savings)}
            </div>
            <div className="text-sm text-gray-600">
              on closing costs ({results.savingsPercentage}% savings)
            </div>
          </div>

          {/* Comparison Table */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Traditional</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(results.traditionalCosts)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Standard closing costs</div>
            </div>

            <div className="bg-primary-50 rounded-lg p-4 border-2 border-primary-200">
              <div className="text-xs text-primary-700 mb-1 uppercase tracking-wide font-medium">
                TrueFee Closing
              </div>
              <div className="text-2xl font-bold text-primary-600">
                {formatCurrency(results.trueFeeClosingCosts)}
              </div>
              <div className="text-xs text-primary-700 mt-1">Your discounted rate</div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Same underwriters, same coverage, better rates
            </p>
          </div>
        </div>
      )}

      {/* Placeholder when no results */}
      {!results && (
        <div className="border-t border-gray-200 pt-6">
          <p className="text-center text-gray-500 text-sm">
            Fill out the fields above to see your estimated savings
          </p>
        </div>
      )}
    </div>
  )
}
