'use client'

import { useState, useEffect } from 'react'
import { calculateSavings, getInitialSavings } from '@/lib/savingsCalculator'

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
]

// Calculate monthly mortgage payment
function calculateMonthlyPayment(principal: number, annualRate: number, years: number = 30): number {
  const monthlyRate = annualRate / 100 / 12
  const numPayments = years * 12

  if (monthlyRate === 0) return principal / numPayments

  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                  (Math.pow(1 + monthlyRate, numPayments) - 1)

  return Math.round(payment)
}

export default function LoanCalculator() {
  // Form state
  const [transactionType, setTransactionType] = useState<'purchase' | 'refinance'>('purchase')
  const [homeValue, setHomeValue] = useState('')
  const [downPayment, setDownPayment] = useState('20')
  const [currentRate, setCurrentRate] = useState('')
  const [selectedState, setSelectedState] = useState('Texas')

  // Get user's location to set default state
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.region && STATES.includes(data.region)) {
          setSelectedState(data.region)
        }
      })
      .catch(() => {})
  }, [])

  // Format currency input
  const handleHomeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    if (value) {
      const formatted = parseInt(value).toLocaleString()
      setHomeValue(formatted)
    } else {
      setHomeValue('')
    }
  }

  // Calculations
  const homeValueNum = parseFloat(homeValue.replace(/[^0-9.]/g, '')) || 500000
  const downPaymentPercent = parseFloat(downPayment) || 20
  const downPaymentAmount = homeValueNum * (downPaymentPercent / 100)
  const loanAmount = homeValueNum - downPaymentAmount

  // Our best rate (competitive market rate)
  const ourBestRate = 6.625
  const userCurrentRate = parseFloat(currentRate) || 7.0

  // Calculate savings
  const savings = calculateSavings(transactionType, homeValueNum, selectedState, {
    remoteSigning: true,
    docsReady: true,
    hasCD: true,
    titleComplexity: 'simple',
    lenderSwitch: true
  })

  // Monthly payments
  const ourMonthlyPayment = calculateMonthlyPayment(loanAmount, ourBestRate)
  const theirMonthlyPayment = calculateMonthlyPayment(loanAmount, userCurrentRate)
  const monthlyPaymentSavings = theirMonthlyPayment - ourMonthlyPayment

  // Total first year costs (closing + 12 months payments)
  const ourFirstYearCost = savings.estimatedClosingCost + (ourMonthlyPayment * 12)
  const theirFirstYearCost = savings.averageClosingCost + (theirMonthlyPayment * 12)
  const firstYearSavings = theirFirstYearCost - ourFirstYearCost

  // 30-year total savings
  const thirtyYearPaymentSavings = monthlyPaymentSavings * 360
  const totalThirtyYearSavings = savings.totalSavings + thirtyYearPaymentSavings

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-semibold text-dark-900 mb-4 text-center">See Your Complete Savings</h2>
      <p className="text-sm text-gray-600 text-center mb-4">Closing costs + Best loan rates from our partners</p>

      {/* Input Form */}
      <div className="space-y-3 mb-6">
        {/* Purchase/Refi Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setTransactionType('purchase')}
            className={`flex-1 px-4 py-2 border-2 rounded-lg font-semibold text-sm ${
              transactionType === 'purchase'
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-gray-200 text-gray-600 hover:border-primary-300'
            }`}
          >
            Purchase
          </button>
          <button
            onClick={() => setTransactionType('refinance')}
            className={`flex-1 px-4 py-2 border-2 rounded-lg font-semibold text-sm ${
              transactionType === 'refinance'
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-gray-200 text-gray-600 hover:border-primary-300'
            }`}
          >
            Refinance
          </button>
        </div>

        {/* Home Value */}
        <div className="relative">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Home Value</label>
          <span className="absolute left-3 top-[30px] text-sm text-dark-900 pointer-events-none">$</span>
          <input
            type="text"
            value={homeValue}
            onChange={handleHomeValueChange}
            placeholder="500,000"
            className="w-full pl-6 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm text-dark-900 placeholder-gray-400"
          />
        </div>

        {/* Down Payment & State */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Down Payment %</label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              min="0"
              max="100"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm text-dark-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm text-dark-900"
            >
              {STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Rate */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Your Current Rate (optional)</label>
          <input
            type="number"
            value={currentRate}
            onChange={(e) => setCurrentRate(e.target.value)}
            step="0.125"
            placeholder="7.0"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm text-dark-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Comparison Results */}
      <div className="space-y-4">
        {/* Our Best Offer */}
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-4 border-2 border-primary-200">
          <div className="text-center mb-3">
            <div className="text-xs font-bold text-primary-700 mb-1">WITH TRUEFEE + OUR LENDERS</div>
            <div className="text-4xl font-black text-primary-600">{ourBestRate}%</div>
            <div className="text-xs text-gray-600">Best rate from our partners</div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Closing Costs:</span>
              <span className="font-bold text-dark-900">${savings.estimatedClosingCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Payment:</span>
              <span className="font-bold text-dark-900">${ourMonthlyPayment.toLocaleString()}/mo</span>
            </div>
            <div className="border-t border-primary-200 pt-2 flex justify-between">
              <span className="font-semibold text-gray-700">First Year Total:</span>
              <span className="font-bold text-primary-700">${ourFirstYearCost.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Traditional Comparison */}
        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
          <div className="text-center mb-3">
            <div className="text-xs font-bold text-gray-500 mb-1">TRADITIONAL TITLE + {userCurrentRate}%</div>
            <div className="text-2xl font-bold text-gray-400 line-through">${theirFirstYearCost.toLocaleString()}</div>
            <div className="text-xs text-gray-500">First year total</div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Closing Costs:</span>
              <span className="text-gray-400 line-through">${savings.averageClosingCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Monthly Payment:</span>
              <span className="text-gray-400 line-through">${theirMonthlyPayment.toLocaleString()}/mo</span>
            </div>
          </div>
        </div>

        {/* Savings Summary */}
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-xl p-4 border-2 border-emerald-200">
          <div className="text-center mb-3">
            <div className="text-xs font-bold text-emerald-700 mb-1">YOUR TOTAL SAVINGS</div>
            <div className="text-5xl font-black text-emerald-600">${firstYearSavings.toLocaleString()}</div>
            <div className="text-xs text-gray-600">in the first year alone!</div>
          </div>

          <div className="space-y-2 text-sm border-t border-emerald-200 pt-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Closing Cost Savings:</span>
              <span className="font-bold text-emerald-700">${savings.totalSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Monthly Payment Savings:</span>
              <span className="font-bold text-emerald-700">${monthlyPaymentSavings.toLocaleString()}/mo</span>
            </div>
            <div className="border-t border-emerald-200 pt-2 flex justify-between">
              <span className="font-semibold text-gray-700">30-Year Total Savings:</span>
              <span className="font-black text-emerald-700 text-lg">${totalThirtyYearSavings.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full mt-4 bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-lg">
        Get This Rate →
      </button>

      <p className="text-xs text-gray-500 text-center mt-2">
        Rate quote from our partner lenders. Subject to credit approval.
      </p>
    </div>
  )
}
