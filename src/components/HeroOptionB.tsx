'use client'

import { useState, useEffect } from 'react'
import { useSavings } from '@/contexts/SavingsContext'
import { getInitialSavings, type TransactionType } from '@/lib/savingsCalculator'

export default function HeroOptionB() {
  const { savings, setSavings } = useSavings()
  const [homeValue, setHomeValue] = useState(500000)
  const [selectedState, setSelectedState] = useState('Texas')
  const [transactionType, setTransactionType] = useState<TransactionType>('purchase')

  // Update savings when inputs change
  useEffect(() => {
    const newSavings = getInitialSavings(transactionType, homeValue, selectedState)
    setSavings(newSavings)
  }, [homeValue, selectedState, transactionType, setSavings])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-green-50 py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Alert Badge */}
          <div className="inline-block bg-red-100 text-red-700 px-6 py-3 rounded-full font-bold text-sm mb-8">
            ⚠️ MOST HOMEBUYERS OVERPAY BY THOUSANDS
          </div>

          {/* Main Headline with Inline Calculator */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark-900 leading-tight mb-8">
            Buying a{' '}
            <div className="inline-block relative mx-2">
              <input
                type="text"
                value={formatCurrency(homeValue)}
                onChange={(e) => {
                  const num = parseInt(e.target.value.replace(/\D/g, ''))
                  if (!isNaN(num)) setHomeValue(num)
                }}
                className="w-56 px-4 py-2 text-center font-black text-primary-600 bg-white border-4 border-primary-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-200"
              />
            </div>
            {' '}home in{' '}
            <div className="inline-block relative mx-2">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-2 text-center font-black text-primary-600 bg-white border-4 border-primary-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-200 cursor-pointer"
              >
                <option>Texas</option>
                <option>California</option>
                <option>Florida</option>
                <option>New York</option>
                <option>Illinois</option>
              </select>
            </div>
            ?
          </h1>

          {/* Savings Result - BIG */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-12 shadow-2xl mb-8 transform hover:scale-105 transition-transform">
            <div className="text-white">
              <div className="text-xl md:text-2xl font-bold mb-2">You could save</div>
              <div className="text-6xl md:text-7xl lg:text-8xl font-black mb-4">
                {formatCurrency(savings.totalSavings)}
              </div>
              <div className="text-xl md:text-2xl font-bold mb-6">
                on title insurance
              </div>
              <div className="flex justify-center gap-8 text-sm md:text-base">
                <div>
                  <div className="text-green-100">They charge</div>
                  <div className="font-bold text-xl">{formatCurrency(savings.avgPrice)}</div>
                </div>
                <div className="text-4xl font-bold">→</div>
                <div>
                  <div className="text-green-100">We charge</div>
                  <div className="font-bold text-xl">{formatCurrency(savings.ourPrice)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Subheading */}
          <p className="text-2xl md:text-3xl text-gray-800 font-bold mb-4">
            Same coverage. Same A-rated insurers. <span className="text-green-600">75% less cost.</span>
          </p>

          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            You can keep your realtor, your lender, and get the exact same title insurance protection – just at a fair price.
          </p>

          {/* CTA Button */}
          <a
            href="/quote"
            className="inline-flex items-center gap-3 bg-primary-600 text-white px-12 py-5 rounded-xl font-bold text-2xl hover:bg-primary-700 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 group"
          >
            <span>Get my fee estimate</span>
            <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <p className="mt-4 text-sm text-gray-600">
            Takes 30 seconds • No commitment
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Licensed in all 50 states</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">A+ rated underwriters</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">12,000+ closings</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
