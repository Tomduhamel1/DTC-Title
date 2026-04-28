'use client'

import { useState, useEffect } from 'react'

interface StorytellingProps {
  homeValue: number
  state: string
  transactionType: 'purchase' | 'refinance'
  estimatedSavings: number
}

// Fun things you could do with your savings
const getSavingsIdeas = (amount: number) => {
  const ideas = []

  if (amount >= 200) {
    ideas.push(
      { text: 'a hot air balloon ride at sunrise', icon: 'balloon' },
      { text: 'new AirPods Pro', icon: 'headphones' },
      { text: `${Math.floor(amount / 100)} couples massages at a fancy spa`, icon: 'spa' },
      { text: `${Math.floor(amount / 40)} bottomless mimosa brunches`, icon: 'glass' },
      { text: 'a sushi-making class for two', icon: 'food' },
      { text: 'weekend camping in Yosemite', icon: 'tent' },
      { text: 'Taylor Swift concert tickets', icon: 'music' },
      { text: `${Math.floor(amount / 5)} Starbucks lattes`, icon: 'coffee' },
      { text: 'a weekend in Nashville', icon: 'guitar' },
      { text: 'new Nike sneakers and Lululemon gear', icon: 'shoe' },
      { text: 'a beachside Airbnb weekend', icon: 'beach' },
      { text: `${Math.floor(amount / 50)} TopGolf sessions`, icon: 'golf' },
      { text: 'NFL game with club seats', icon: 'football' },
      { text: 'Austin BBQ crawl weekend', icon: 'bbq' },
      { text: 'a Nintendo Switch and games', icon: 'game' },
      { text: 'Hamilton on Broadway tickets', icon: 'theater' },
      { text: `${Math.floor(amount / 150)} Six Flags day trips`, icon: 'coaster' },
      { text: 'professional family photoshoot', icon: 'camera' },
      { text: `${Math.floor(amount / 60)} hibachi dinners`, icon: 'fire' }
    )
  }

  if (amount >= 1000) {
    ideas.push(
      { text: 'flights to anywhere in the US', icon: 'plane' },
      { text: 'a wild weekend in Vegas with show tickets', icon: 'dice' },
      { text: 'Aspen ski trip with gear rental', icon: 'ski' },
      { text: 'a Carnival cruise to Cozumel', icon: 'ship' },
      { text: 'a MacBook Air', icon: 'laptop' }
    )
  }

  if (amount >= 1500) {
    ideas.push(
      { text: 'a week in Maui with luau tickets', icon: 'island' },
      { text: 'all-inclusive resort in Cancun', icon: 'resort' },
      { text: 'Disney World for the whole family', icon: 'castle' }
    )
  }

  if (amount >= 2500) {
    ideas.push(
      { text: 'a week backpacking through Italy', icon: 'travel' },
      { text: '10 days exploring Iceland', icon: 'mountain' },
      { text: 'a romantic Paris getaway with Eiffel Tower dinner', icon: 'tower' }
    )
  }

  return ideas
}

export default function StorytellingSection({ homeValue, state, transactionType, estimatedSavings }: StorytellingProps) {
  // Rotating savings ideas
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0)
  const savingsIdeas = getSavingsIdeas(estimatedSavings)

  useEffect(() => {
    if (savingsIdeas.length > 0) {
      const interval = setInterval(() => {
        setCurrentIdeaIndex(prev => (prev + 1) % savingsIdeas.length)
      }, 3500)

      return () => clearInterval(interval)
    }
  }, [savingsIdeas.length])

  const traditionalCost = estimatedSavings + 1200 // Approximate traditional cost

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-4">
            You're Already Spending <span className="text-primary-600">${homeValue.toLocaleString()}</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-6">
            Why pay <span className="font-bold text-red-600">${estimatedSavings.toLocaleString()} extra</span> when you have a choice?
          </p>

          {/* Rotating Savings Ideas */}
          {savingsIdeas.length > 0 && (
            <div className="inline-block">
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl px-8 py-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="text-emerald-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-emerald-700">Save ${estimatedSavings.toLocaleString()} = Enjoy</div>
                    <div className="text-lg font-bold text-emerald-800 transition-all duration-500">
                      {savingsIdeas[currentIdeaIndex].text}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Visual Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Traditional Path */}
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-gray-700 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                THE OLD WAY
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-300 shadow-lg h-full">
              {/* Flow */}
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 rounded-xl p-4 shrink-0">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 mb-1">Realtor or Broker Recommends</div>
                    <div className="text-sm text-gray-600">They suggest their usual title company</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 rounded-xl p-4 shrink-0">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 mb-1">Local Escrow Office</div>
                    <div className="text-sm text-gray-600">Paper-heavy process, traditional fees</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Result */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 text-center border-2 border-red-300">
                  <div className="text-sm text-gray-600 mb-2">You Pay</div>
                  <div className="text-4xl font-black text-gray-800 mb-2">${traditionalCost.toLocaleString()}</div>
                  <div className="inline-block bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full">
                    Overpaying ${estimatedSavings.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TrueFee Path */}
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                YOUR CHOICE
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-8 border-2 border-primary-400 shadow-2xl h-full ring-4 ring-primary-200">
              {/* Flow */}
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 rounded-xl p-4 shrink-0">
                    <svg className="w-8 h-8 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-primary-900 mb-1">You Choose TrueFee</div>
                    <div className="text-sm text-primary-700">Take control. It's your choice!</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <svg className="w-8 h-8 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 rounded-xl p-4 shrink-0">
                    <svg className="w-8 h-8 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-primary-900 mb-1">Digital-First Closing</div>
                    <div className="text-sm text-primary-700">Streamlined, secure, & cost-effective</div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <svg className="w-8 h-8 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>

                {/* Result */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-50 rounded-xl p-6 text-center border-2 border-emerald-400 shadow-lg">
                  <div className="text-sm text-emerald-700 font-semibold mb-2">You Pay</div>
                  <div className="text-4xl font-black text-emerald-700 mb-3">${(traditionalCost - estimatedSavings).toLocaleString()}</div>
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-600 text-white text-lg font-black px-6 py-3 rounded-full shadow-lg animate-pulse">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    SAVE ${estimatedSavings.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-dark-900 mb-2">Same Security. Same Quality. Better Price.</h3>
            <p className="text-gray-600">Nothing changes except what you pay</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-50 rounded-xl p-6 mb-3">
                <svg className="w-16 h-16 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <div className="font-bold text-lg text-gray-900 mb-1">Same Underwriters</div>
              <div className="text-sm text-gray-600">Major title insurance companies you know and trust</div>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 rounded-xl p-6 mb-3">
                <svg className="w-16 h-16 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="font-bold text-lg text-gray-900 mb-1">Works With Any Lender</div>
              <div className="text-sm text-gray-600">All major banks and mortgage companies accepted</div>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 rounded-xl p-6 mb-3">
                <svg className="w-16 h-16 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="font-bold text-lg text-gray-900 mb-1">Just as Secure</div>
              <div className="text-sm text-gray-600">Bank-level encryption and certified processes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
