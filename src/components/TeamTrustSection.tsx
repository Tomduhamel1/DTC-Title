'use client'

import { useSavings } from '@/contexts/SavingsContext'

export default function TeamTrustSection() {
  const { savings } = useSavings()

  return (
    <>
      {/* Everything Else Stays The Same Section */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-dark-900 mb-3">
              Keep the <span className="text-primary-600">Team You Trust</span>
            </h2>
            <p className="text-xl text-gray-600">
              Same people. Same protection. <span className="font-bold text-green-600">${savings.totalSavings.toLocaleString()} Saved.</span>
            </p>
          </div>

          {/* Four Column Layout */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {/* Your Realtor */}
            <div className="text-center flex-shrink-0">
              <div className="relative inline-block mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">Your Realtor</h3>
              <p className="text-gray-600">Same trusted advisor</p>
            </div>

            {/* Plus Sign */}
            <div className="text-4xl font-bold text-primary-600 hidden md:block">+</div>

            {/* Your Lender */}
            <div className="text-center flex-shrink-0">
              <div className="relative inline-block mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">Your Lender</h3>
              <p className="text-gray-600">Works with all banks</p>
            </div>

            {/* Plus Sign */}
            <div className="text-4xl font-bold text-primary-600 hidden md:block">+</div>

            {/* Your Mortgage Broker */}
            <div className="text-center flex-shrink-0">
              <div className="relative inline-block mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">Your Mortgage Broker</h3>
              <p className="text-gray-600">Same trusted partner</p>
            </div>

            {/* Plus Sign */}
            <div className="text-4xl font-bold text-primary-600 hidden md:block">+</div>

            {/* BetterClose */}
            <div className="text-center flex-shrink-0">
              <div className="relative inline-block mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl">
                  <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 16L16 4L28 16V30C28 31.1046 27.1046 32 26 32H6C4.89543 32 4 31.1046 4 30V16Z"
                      fill="#0693e3"
                      stroke="#0693e3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 20L14 24L22 14"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">BetterClose</h3>
              <p className="text-gray-600">Your closing partner</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
