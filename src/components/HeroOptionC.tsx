'use client'

import { Suspense, useState } from 'react'
import AICalculatorWithIdeas from './AICalculatorWithIdeas'
import ShareWithTeamSheet from './lender-request/ShareWithTeamSheet'

export default function HeroOptionC() {
  const [shareOpen, setShareOpen] = useState(false)
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-white py-20 lg:py-28">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Headline + lender trust strip */}
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-5 text-dark-900 leading-tight">
                Don't overpay for closing costs!
                <br />
                <span className="text-primary-600">You have a choice.</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-8 leading-snug">
                Same realtor. Same lender. Same insurer.
                <br />
                <span className="text-primary-600">Different closing cost.</span>
              </p>

              {/* Trust strip */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-bold text-dark-900">Works with ANY lender you choose</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 pl-7">
                  <div className="h-8 px-4 bg-white rounded border border-gray-200 flex items-center justify-center">
                    <img
                      src="/lenders/Rocket-Companies-Logo-New-500x281.png"
                      alt="Rocket Mortgage"
                      className="h-7 object-contain"
                    />
                  </div>
                  <div className="h-8 px-3 bg-white rounded border border-gray-200 flex items-center justify-center">
                    <img
                      src="/lenders/Chase_logo_2007.svg.png"
                      alt="Chase"
                      className="h-6 object-contain"
                    />
                  </div>
                  <div className="h-8 px-3 bg-white rounded border border-gray-200 flex items-center justify-center">
                    <img
                      src="/lenders/wells-fargo-logo-transparent.png"
                      alt="Wells Fargo"
                      className="h-6 object-contain"
                    />
                  </div>
                  <div className="h-8 px-3 bg-white rounded border border-gray-200 flex items-center justify-center">
                    <img
                      src="/lenders/Bank_of_America-Logo.wine.svg"
                      alt="Bank of America"
                      className="h-6 object-contain"
                    />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">+500 more</span>
                </div>
              </div>
            </div>

            {/* Right: Calculator */}
            <div id="hero-calculator">
              <h2 className="text-lg md:text-xl font-semibold text-dark-900 mb-3 text-center">
                Estimate your savings
              </h2>
              <Suspense
                fallback={
                  <div className="bg-white rounded-2xl shadow-2xl p-6 flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  </div>
                }
              >
                <AICalculatorWithIdeas compact />
              </Suspense>
              <div className="text-center mt-4">
                <button
                  onClick={() => setShareOpen(true)}
                  className="text-sm text-primary-700 font-semibold hover:text-primary-800 underline-offset-2 hover:underline"
                >
                  Or, send BetterClose to my lender →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ShareWithTeamSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        source="hero"
      />
    </section>
  )
}
