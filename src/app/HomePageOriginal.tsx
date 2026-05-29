'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Suspense, useState } from 'react'
import ShareWithTeamSheet from '@/components/lender-request/ShareWithTeamSheet'
import InlineCalculator from '@/components/InlineCalculator'
import TrustBadges from '@/components/TrustBadges'
import UnderwriterLogos from '@/components/UnderwriterLogos'
import SavingsExamples from '@/components/SavingsExamples'
import TrustStripSection from '@/components/TrustStripSection'
import TrueFeelogo from '@/components/TrueFeelogo'
import HomePageContent from '@/components/HomePageContent'
import TeamTrustSection from '@/components/TeamTrustSection'
import PeaceOfMindSection from '@/components/PeaceOfMindSection'
import ReadyToSaveSection from '@/components/ReadyToSaveSection'
import { SavingsProvider } from '@/contexts/SavingsContext'

interface HomePageOriginalProps {
  hideSavingsCards?: boolean
  useAlternateHero?: boolean
}

export default function HomePageOriginal({ hideSavingsCards = false, useAlternateHero = false }: HomePageOriginalProps = {}) {
  const [shareOpen, setShareOpen] = useState(false)
  return (
    <SavingsProvider>
      <div className="min-h-screen bg-white">
      {/* Header - eLEND Style */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6">
          <nav className="flex justify-between items-center h-20">
            {/* Left: Logo/Branding */}
            <div className="flex items-center space-x-2">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <TrueFeelogo className="h-10" />
              </Link>
            </div>

            {/* Center: Main Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/pricing" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
                For Mortgage Brokers
              </Link>
              <Link href="/for-realtors" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
                For Realtors
              </Link>
              <Link href="#how-it-works" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
                For Lenders
              </Link>
            </div>

            {/* Right: Contact & CTA */}
            <div className="flex items-center space-x-6">
              <a href="tel:1-800-316-9508" className="hidden lg:flex items-center gap-3 text-dark-800 hover:text-primary-600 font-medium transition-colors group">
                <div className="relative">
                  <img
                    src="/operator-face.png"
                    alt="Customer service representative"
                    className="w-16 h-16 rounded-full object-cover border-3 border-primary-400 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-3 border-white flex items-center justify-center shadow-md">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-500 font-medium">Talk to a real person</div>
                  <div className="font-bold text-lg text-primary-600 group-hover:text-primary-700">1.800.316.9508</div>
                </div>
              </a>
              <Link href="/login" className="text-dark-800 hover:text-primary-600 font-semibold transition-colors">
                Log in
              </Link>
              <button
                onClick={() => setShareOpen(true)}
                className="bg-primary-600 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
              >
                Send to my team
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      {/* Hero Section with Background Image */}
      <section className="relative flex items-center bg-gradient-to-br from-primary-50 to-white py-12">
        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left: Headline + Savings Preview */}
            <div className="text-center lg:text-left">
              {useAlternateHero ? (
                <>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-dark-900 leading-tight">
                    Save at closing. Save over the loan.<br />
                    <span className="text-primary-600">Close with confidence.</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-8">
                    Same realtor. Same lender. Lower cost.<br />
                    <span className="text-primary-600">Every fee in the open.</span>
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-dark-900 leading-tight">
                    Save at closing. Save over the loan.
                  </h1>
                  <p className="text-xl mb-8 text-gray-600">
                    Lower closing costs. Same coverage. Same A-rated underwriters.
                  </p>
                </>
              )}

              {/* Savings Preview Cards */}
              {!hideSavingsCards && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white rounded-xl shadow-lg p-4 text-center border-2 border-emerald-200">
                    <div className="text-xs font-semibold text-gray-500 mb-2">TEXAS • $500K HOME</div>
                    <div className="text-sm text-gray-500 mb-1">Others charge</div>
                    <div className="text-lg font-bold text-gray-400 line-through mb-1">$1,600</div>
                    <div className="text-xs font-bold text-emerald-700 mb-1">YOU SAVE</div>
                    <div className="text-5xl font-black text-emerald-600 mb-2">-$800</div>
                    <div className="text-xs text-gray-600">Pay only <span className="font-bold text-gray-800">$800</span></div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-4 text-center border-2 border-emerald-200">
                    <div className="text-xs font-semibold text-gray-500 mb-2">CALIFORNIA • $750K</div>
                    <div className="text-sm text-gray-500 mb-1">Others charge</div>
                    <div className="text-lg font-bold text-gray-400 line-through mb-1">$2,400</div>
                    <div className="text-xs font-bold text-emerald-700 mb-1">YOU SAVE</div>
                    <div className="text-5xl font-black text-emerald-600 mb-2">-$950</div>
                    <div className="text-xs text-gray-600">Pay only <span className="font-bold text-gray-800">$1,450</span></div>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold text-dark-900">Works with ANY lender you choose</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 pl-7">
                  <div className="h-8 px-4 bg-white rounded border border-gray-200 flex items-center justify-center">
                    <img src="/lenders/Rocket-Companies-Logo-New-500x281.png" alt="Rocket Mortgage" className="h-7 object-contain" />
                  </div>
                  <div className="h-8 px-3 bg-white rounded border border-gray-200 flex items-center justify-center">
                    <img src="/lenders/Chase_logo_2007.svg.png" alt="Chase" className="h-6 object-contain" />
                  </div>
                  <div className="h-8 px-3 bg-white rounded border border-gray-200 flex items-center justify-center">
                    <img src="/lenders/wells-fargo-logo-transparent.png" alt="Wells Fargo" className="h-6 object-contain" />
                  </div>
                  <div className="h-8 px-3 bg-white rounded border border-gray-200 flex items-center justify-center">
                    <img src="/lenders/Bank_of_America-Logo.wine.svg" alt="Bank of America" className="h-6 object-contain" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">+500 more</span>
                </div>
              </div>
            </div>

            {/* Right: Compact Calculator */}
            <Suspense fallback={
              <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            }>
              <HomePageContent originalCalculator={
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-semibold text-dark-900 mb-4 text-center">Calculate your savings</h2>

                  <div className="space-y-3">
                    {/* Purchase/Refi Toggle */}
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 border-2 border-primary-600 bg-primary-600 text-white rounded-lg font-semibold text-sm">
                        Purchase
                      </button>
                      <button className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-600 rounded-lg font-semibold text-sm hover:border-primary-300">
                        Refinance
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Home value (e.g., $500,000)"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    />

                    <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-gray-600">
                      <option>Select your state</option>
                      <option>California</option>
                      <option>Texas</option>
                      <option>Florida</option>
                      <option>New York</option>
                    </select>

                    <button className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-lg">
                      See My Savings →
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="text-primary-600 font-semibold hover:text-primary-700 flex items-center justify-center mx-auto text-sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Have a quote? Upload it
                    </button>
                  </div>
                </div>
              } />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Everything Else Stays The Same Section */}
      <TeamTrustSection />

      {/* Underwriter Logos Section - Uses Client Component for error handling */}
      <UnderwriterLogos />

      {/* Peace of Mind Section */}
      <PeaceOfMindSection />

      {/* Trust Badges - Professional icons matching eLEND style */}
      <TrustBadges />

      {/* Ready to Get Started Section */}
      <ReadyToSaveSection />

      {/* Trust Strip — pillars + stats */}
      <TrustStripSection />

      {/* Dramatic Price Comparison Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4">
              See The Savings For Yourself
            </h2>
            <p className="text-xl text-gray-600">
              Real examples. Real savings. Same trusted coverage.
            </p>
          </div>

          {/* Price Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Texas Example */}
            <div className="bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
              <div className="text-sm font-semibold text-primary-600 mb-2">TEXAS</div>
              <div className="text-lg text-gray-600 mb-4">$500K Home Purchase</div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Traditional Title Company</div>
                  <div className="text-3xl font-bold text-gray-400 line-through">$1,600</div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-primary-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-primary-600 font-bold">YOU SAVE</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-primary-600 font-semibold mb-1">BetterClose</div>
                  <div className="text-5xl font-black text-primary-600">$800</div>
                </div>
              </div>

              <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold text-lg">
                Save -$800
              </div>
            </div>

            {/* California Example */}
            <div className="bg-gradient-to-br from-accent-50 to-white border-2 border-accent-200 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
              <div className="text-sm font-semibold text-accent-600 mb-2">CALIFORNIA</div>
              <div className="text-lg text-gray-600 mb-4">$750K Home Purchase</div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Traditional Title Company</div>
                  <div className="text-3xl font-bold text-gray-400 line-through">$2,400</div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-accent-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-accent-600 font-bold">YOU SAVE</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-accent-600 font-semibold mb-1">BetterClose</div>
                  <div className="text-5xl font-black text-accent-600">$1,450</div>
                </div>
              </div>

              <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold text-lg">
                Save -$950
              </div>
            </div>

            {/* Florida Example */}
            <div className="bg-gradient-to-br from-primary-50 to-white border-2 border-primary-200 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
              <div className="text-sm font-semibold text-primary-600 mb-2">FLORIDA</div>
              <div className="text-lg text-gray-600 mb-4">$600K Refinance</div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Traditional Title Company</div>
                  <div className="text-3xl font-bold text-gray-400 line-through">$1,900</div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-primary-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-3 text-primary-600 font-bold">YOU SAVE</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-primary-600 font-semibold mb-1">BetterClose</div>
                  <div className="text-5xl font-black text-primary-600">$1,100</div>
                </div>
              </div>

              <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold text-lg">
                Save -$800
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/pricing" className="inline-block bg-primary-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-primary-700 transition-colors shadow-lg">
              Calculate Your Exact Savings →
            </Link>
          </div>
        </div>
      </section>

      {/* Savings Examples */}
      <SavingsExamples />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">BetterClose</div>
              <p className="text-gray-400">
                Transparent, discounted title insurance and settlement services for your home purchase or refinance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Calculate Savings
                  </Link>
                </li>
                <li>
                  <Link href="/quote" className="hover:text-white transition-colors">
                    Fee estimate
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Questions? We're here to help.<br />
                Reach out for a quote or support.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BetterClose. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
      <ShareWithTeamSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        source="nav_cta"
      />
    </SavingsProvider>
  )
}
