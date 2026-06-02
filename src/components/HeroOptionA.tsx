'use client'

import { Suspense } from 'react'
import { useSavings } from '@/contexts/SavingsContext'
import AICalculatorWithIdeas from './AICalculatorWithIdeas'

export default function HeroOptionA() {
  const { savings } = useSavings()

  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-white py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Savings Message */}
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-dark-900 leading-tight mb-6">
                Save at closing. Save over the loan.
                <span className="block text-emerald-600 mt-3">
                  Close with confidence.
                </span>
              </h1>

              <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Same realtor. Same lender. Lower cost.
              </p>

              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                BetterClose helps you lower title and settlement costs, understand every fee, and track your closing with a trusted team.
              </p>

              <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg mb-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">💰</div>
                  <div>
                    <div className="font-black text-2xl text-emerald-700 mb-1">
                      Average savings: ${savings.totalSavings.toLocaleString()}
                    </div>
                    <div className="text-gray-700">
                      That's furniture for your new home, moving costs covered, or a head start on renovations.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Same A-rated underwriters</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Licensed in all 50 states</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Closes in days, not weeks</span>
                </div>
              </div>
            </div>

            {/* Right: Compact Calculator */}
            <div>
              <Suspense fallback={
                <div className="bg-white rounded-2xl shadow-2xl p-6 flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              }>
                <AICalculatorWithIdeas compact />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
