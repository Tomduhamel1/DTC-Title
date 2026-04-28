'use client'

import { useState, useEffect } from 'react'
import { calculateSavings } from '@/lib/savingsCalculator'

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

export default function SideBySideCalculator() {
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
  const hasEnteredRate = currentRate.trim() !== ''
  const userCurrentRate = parseFloat(currentRate) || 7.0

  // Calculate closing cost savings
  const closingCostSavings = calculateSavings(transactionType, homeValueNum, selectedState, {
    remoteSigning: true,
    docsReady: true,
    hasCD: true,
    titleComplexity: 'simple',
    lenderSwitch: true
  })

  // Monthly payments - only calculate if user entered their rate
  const ourMonthlyPayment = calculateMonthlyPayment(loanAmount, ourBestRate)
  const theirMonthlyPayment = hasEnteredRate ? calculateMonthlyPayment(loanAmount, userCurrentRate) : 0
  const monthlyPaymentSavings = hasEnteredRate ? theirMonthlyPayment - ourMonthlyPayment : 0

  // 30-year total payment savings
  const thirtyYearPaymentSavings = monthlyPaymentSavings * 360

  // Bundle selection state
  const [selectedBundle, setSelectedBundle] = useState<'closing' | 'both' | null>(null)

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-semibold text-dark-900 mb-4 text-center">Complete Savings Calculator</h2>
      <p className="text-sm text-gray-600 text-center mb-4">See how much you save on closing costs AND monthly payments</p>

      {/* Single Row Input Form */}
      <div className="flex gap-3 mb-6 items-end">
        {/* Purchase/Refi Toggle */}
        <div className="flex flex-col">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Transaction</label>
          <div className="flex gap-1 border-2 border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setTransactionType('purchase')}
              className={`px-3 py-2 rounded text-xs font-semibold transition-all ${
                transactionType === 'purchase'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Purchase
            </button>
            <button
              onClick={() => setTransactionType('refinance')}
              className={`px-3 py-2 rounded text-xs font-semibold transition-all ${
                transactionType === 'refinance'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Refi
            </button>
          </div>
        </div>

        {/* Home Value */}
        <div className="flex-1 relative">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Home Value</label>
          <span className="absolute left-3 bottom-[10px] text-sm text-dark-900 pointer-events-none">$</span>
          <input
            type="text"
            value={homeValue}
            onChange={handleHomeValueChange}
            placeholder="500,000"
            className="w-full pl-6 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-sm text-dark-900 placeholder-gray-400"
          />
        </div>

        {/* Down Payment */}
        <div className="w-32">
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

        {/* State */}
        <div className="w-36">
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

        {/* Current Rate */}
        <div className="w-32">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Your Current Rate</label>
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

      {/* Side by Side Options */}
      <div className="grid grid-cols-2 gap-4">
        {/* LEFT: Core Offering - Closing Services */}
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-5 border-2 border-primary-200">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-dark-900 mb-1">TrueFee Closing</h3>
            <p className="text-xs text-gray-600">Title • Settlement • Escrow</p>
          </div>

          {/* Savings Breakdown */}
          <div className="space-y-3 mb-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-gray-600">Traditional closing:</span>
                <span className="text-sm font-semibold text-gray-400 line-through">${closingCostSavings.averageClosingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-primary-700 font-semibold">With TrueFee:</span>
                <span className="text-lg font-black text-primary-600">${closingCostSavings.estimatedClosingCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-3 border border-emerald-200">
              <div className="text-center">
                <div className="text-xs font-bold text-emerald-700 mb-1">YOU SAVE</div>
                <div className="text-3xl font-black text-emerald-600">${closingCostSavings.totalSavings.toLocaleString()}</div>
                <div className="text-xs text-gray-600">on closing costs</div>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-4 text-xs text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Digital title & escrow</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Remote or in-person signing</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Works with any lender</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => setSelectedBundle(selectedBundle === 'closing' ? null : 'closing')}
            className={`w-full px-4 py-3 rounded-lg font-bold transition-colors shadow-md ${
              selectedBundle === 'closing' || selectedBundle === 'both'
                ? 'bg-primary-700 text-white'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {selectedBundle === 'closing' || selectedBundle === 'both' ? '✓ Selected' : 'Get TrueFee Closing →'}
          </button>
        </div>

        {/* RIGHT: Optional Add-on - Loan Bundle */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-purple-200">
          <div className="text-center mb-4">
            <div className="inline-block bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full mb-2">OPTIONAL ADD-ON</div>
            <h3 className="text-lg font-bold text-dark-900 mb-1">Bundle with Our Lenders</h3>
            <p className="text-xs text-gray-600">Save even more on your loan</p>
          </div>

          {hasEnteredRate ? (
            <>
              {/* Loan Savings Breakdown - Shown when rate entered */}
              <div className="space-y-3 mb-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-gray-600">Your current rate:</span>
                    <span className="text-sm font-semibold text-gray-400">{userCurrentRate}%</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs text-purple-700 font-semibold">Our best rate:</span>
                    <span className="text-lg font-black text-purple-600">{ourBestRate}%</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
                    <span className="text-xs text-gray-600">Your monthly payment:</span>
                    <span className="text-sm font-bold text-dark-900">${ourMonthlyPayment.toLocaleString()}/mo</span>
                  </div>
                </div>

                {monthlyPaymentSavings > 0 ? (
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 rounded-lg p-3 border border-emerald-200">
                    <div className="text-center">
                      <div className="text-xs font-bold text-emerald-700 mb-1">ADDITIONAL SAVINGS</div>
                      <div className="text-3xl font-black text-emerald-600">${monthlyPaymentSavings.toLocaleString()}</div>
                      <div className="text-xs text-gray-600 mb-1">per month</div>
                      <div className="text-xs text-emerald-700 font-semibold">
                        ${thirtyYearPaymentSavings.toLocaleString()} over 30 years
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-center">
                      <div className="text-xs font-semibold text-blue-700 mb-1">COMPETITIVE RATE</div>
                      <p className="text-xs text-gray-600">Our {ourBestRate}% rate is already competitive with your current rate. We can still help streamline your process!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* What's Included */}
              <div className="mb-4 text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Pre-vetted lender partners</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Competitive rates & fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Seamless closing process</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => setSelectedBundle('both')}
                className={`w-full px-4 py-3 rounded-lg font-bold transition-colors shadow-md ${
                  selectedBundle === 'both'
                    ? 'bg-purple-700 text-white'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {selectedBundle === 'both' ? '✓ Bundle Selected' : 'Add Loan Bundle →'}
              </button>
            </>
          ) : (
            <>
              {/* Prompt to enter rate */}
              <div className="space-y-4 mb-4">
                <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                  <div className="text-purple-600 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-dark-900 mb-2">See your loan savings!</p>
                  <p className="text-xs text-gray-600 mb-3">Enter your current rate above to see how much you could save with our lender partners.</p>
                  <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
                    <span className="text-xs font-semibold text-purple-700">Our best rate:</span>
                    <span className="text-lg font-black text-purple-600">{ourBestRate}%</span>
                  </div>
                </div>

                {/* What's Included */}
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Pre-vetted lender partners</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Competitive rates & fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Seamless closing process</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 px-4 py-3 rounded-lg font-bold cursor-not-allowed shadow-md"
              >
                Enter Rate to Compare
              </button>
            </>
          )}
        </div>
      </div>

      {/* Combined Potential Savings - Only show if they entered rate */}
      {hasEnteredRate && monthlyPaymentSavings > 0 && (
        <div className="mt-4 bg-gradient-to-r from-emerald-600 to-emerald-600 rounded-xl p-4 text-white text-center">
          <div className="text-sm font-bold mb-1">TOTAL POTENTIAL SAVINGS (WITH BOTH)</div>
          <div className="text-4xl font-black mb-1">${(closingCostSavings.totalSavings + thirtyYearPaymentSavings).toLocaleString()}</div>
          <div className="text-xs opacity-90">Closing savings + 30-year loan savings</div>
        </div>
      )}

      {/* Unified CTA */}
      <div className="mt-4">
        {selectedBundle === 'both' ? (
          <button className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-4 rounded-lg font-bold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg text-lg">
            Get Started with Both →
          </button>
        ) : selectedBundle === 'closing' ? (
          <button className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-lg text-lg">
            Get Started with TrueFee Closing →
          </button>
        ) : (
          <button className="w-full bg-gray-200 text-gray-400 px-6 py-4 rounded-lg font-bold cursor-not-allowed shadow-md text-lg">
            Select a service above to continue
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center mt-3">
        Closing services available for any lender. Loan rate quotes subject to credit approval.
      </p>
    </div>
  )
}
