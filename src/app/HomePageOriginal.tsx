import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import InlineCalculator from '@/components/InlineCalculator'
import TrustBadges from '@/components/TrustBadges'
import UnderwriterLogos from '@/components/UnderwriterLogos'
import SavingsExamples from '@/components/SavingsExamples'
import Testimonials from '@/components/Testimonials'
import TrueFeelogo from '@/components/TrueFeelogo'
import HomePageContent from '@/components/HomePageContent'

interface HomePageOriginalProps {
  hideSavingsCards?: boolean
  useAlternateHero?: boolean
}

export default function HomePageOriginal({ hideSavingsCards = false, useAlternateHero = false }: HomePageOriginalProps = {}) {
  return (
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
                For Brokers
              </Link>
              <Link href="/start" className="text-dark-800 hover:text-primary-600 font-medium transition-colors">
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
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-md">
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
              <Link href="/start" className="bg-primary-600 text-white px-5 py-2.5 rounded-md font-semibold hover:bg-primary-700 transition-colors">
                Save now
              </Link>
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
                    Don't overpay for closing costs!<br />
                    <span className="text-primary-600">You have a choice.</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-8">
                    Same realtor. Same lender. Same insurer.<br />
                    <span className="text-primary-600">Different closing cost.</span>
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-dark-900 leading-tight">
                    Save Hundreds on Closing Costs
                  </h1>
                  <p className="text-xl mb-8 text-gray-600">
                    30-40% lower fees. Same coverage. Same underwriters.
                  </p>
                </>
              )}

              {/* Savings Preview Cards */}
              {!hideSavingsCards && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white rounded-xl shadow-lg p-4 text-center border-2 border-green-200">
                    <div className="text-xs font-semibold text-gray-500 mb-2">TEXAS • $500K HOME</div>
                    <div className="text-sm text-gray-500 mb-1">Others charge</div>
                    <div className="text-lg font-bold text-gray-400 line-through mb-1">$1,600</div>
                    <div className="text-xs font-bold text-green-700 mb-1">YOU SAVE</div>
                    <div className="text-5xl font-black text-green-600 mb-2">-$800</div>
                    <div className="text-xs text-gray-600">Pay only <span className="font-bold text-gray-800">$800</span></div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-4 text-center border-2 border-green-200">
                    <div className="text-xs font-semibold text-gray-500 mb-2">CALIFORNIA • $750K</div>
                    <div className="text-sm text-gray-500 mb-1">Others charge</div>
                    <div className="text-lg font-bold text-gray-400 line-through mb-1">$2,400</div>
                    <div className="text-xs font-bold text-green-700 mb-1">YOU SAVE</div>
                    <div className="text-5xl font-black text-green-600 mb-2">-$950</div>
                    <div className="text-xs text-gray-600">Pay only <span className="font-bold text-gray-800">$1,450</span></div>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
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

      {/* Underwriter Logos Section - Uses Client Component for error handling */}
      <UnderwriterLogos />

      {/* Simple Online Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image & Visual Trust Indicators */}
            <div className="relative">
              <div className="flex items-center justify-center gap-6">
                {/* Main Operator Image */}
                <div className="relative">
                  <img
                    src="/operator-face.png"
                    alt="Your dedicated closing specialist"
                    className="w-48 h-48 rounded-2xl object-cover border-4 border-primary-500 shadow-2xl"
                  />
                  {/* Online Chat Indicator */}
                  <div className="absolute -bottom-3 -right-3 bg-green-500 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border-4 border-white">
                    <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold text-sm">Chat Available</span>
                  </div>
                  {/* Years of Experience Badge */}
                  <div className="absolute -top-3 -left-3 bg-primary-600 text-white px-3 py-2 rounded-lg shadow-xl border-4 border-white">
                    <div className="font-black text-2xl leading-none">15+</div>
                    <div className="text-xs font-semibold">Years</div>
                  </div>
                </div>

                {/* Communication Channel Icons */}
                <div className="hidden md:flex flex-col gap-3">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 border-3 border-white shadow-lg flex items-center justify-center" title="Live Chat">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 border-3 border-white shadow-lg flex items-center justify-center" title="Text/Email">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="text-center text-xs font-bold text-gray-600">
                    Chat, text,<br/>or email
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Copy */}
            <div>
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-bold mb-4">
                ✓ Start Online. Get Support Your Way.
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-4 leading-tight">
                Simple Online Process.<br />
                <span className="text-primary-600">Real People When You Need Them.</span>
              </h2>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Your home is your biggest investment. Start online in minutes, and know that a dedicated closing specialist will be available by chat, text, or email throughout your entire journey.
              </p>

              {/* Trust Points */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-dark-900 text-lg">Start Online in 2 Minutes</div>
                    <div className="text-gray-600">Fast, simple process. No sales calls required.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-dark-900 text-lg">Chat, Text, or Email Support</div>
                    <div className="text-gray-600">Get answers on your schedule. No phone tag.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-dark-900 text-lg">Easy to Share with Your Team</div>
                    <div className="text-gray-600">Loop in your realtor, lender, or broker in seconds.</div>
                  </div>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="space-y-3">
                <Link
                  href="/start"
                  className="inline-flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-primary-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 group"
                >
                  <span>Get Started Online</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <div className="text-sm text-gray-500">
                  Takes 2 minutes • No commitment
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything Else Stays The Same Section */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-dark-900 mb-3">
              Keep the <span className="text-primary-600">Team You Trust</span>
            </h2>
            <p className="text-xl text-gray-600">Same people. Same protection. Same quality.</p>
          </div>

          {/* Four Column Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Your Realtor */}
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">Your Realtor</h3>
              <p className="text-gray-600">Same trusted advisor</p>
            </div>

            {/* Your Lender */}
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">Your Lender</h3>
              <p className="text-gray-600">Works with all banks</p>
            </div>

            {/* Your Mortgage Broker */}
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">Your Mortgage Broker</h3>
              <p className="text-gray-600">Same trusted partner</p>
            </div>

            {/* Same Insurance */}
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-dark-900 mb-2">Same Insurance</h3>
              <p className="text-gray-600">Same protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges - Professional icons matching eLEND style */}
      <TrustBadges />

      {/* Ready to Get Started Section */}
      <section className="w-full bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-4">
              Ready to Save?
            </h2>
            <p className="text-xl text-gray-600">
              Choose the option that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Get Started Online - PRIMARY */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-black text-2xl text-white mb-3">Start Online</h3>
              <p className="text-white/90 text-sm mb-6 leading-relaxed">
                Complete our quick application online. Takes just 2 minutes. No commitment or credit check required.
              </p>
              <Link
                href="/start"
                className="block w-full bg-white text-primary-600 px-6 py-3 rounded-lg font-bold text-center hover:bg-gray-50 transition-colors shadow-lg"
              >
                Begin Application →
              </Link>
            </div>

            {/* Share with Team */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-emerald-500 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="font-black text-2xl text-dark-900 mb-3">Share with Team</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Send BetterClose info to your realtor, lender, or broker. They can coordinate your closing directly with us.
              </p>
              <Link
                href="/share"
                className="block w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold text-center hover:bg-emerald-700 transition-colors"
              >
                Send Link
              </Link>
            </div>

            {/* Chat with Us */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-black text-2xl text-dark-900 mb-3">Chat with Us</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Have questions? Get instant answers from our team. We're here to help you understand your options.
              </p>
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                Start Chat
              </button>
            </div>

            {/* Call Us */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:border-gray-400 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <h3 className="font-black text-2xl text-dark-900 mb-3">Call Us</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Prefer to talk? Call to speak with a closing specialist who can answer all your questions.
              </p>
              <a
                href="tel:1-800-316-9508"
                className="block w-full bg-gray-800 text-white px-6 py-3 rounded-lg font-bold text-center hover:bg-gray-900 transition-colors"
              >
                1.800.316.9508
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - MOVED UP */}
      <Testimonials />

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

              <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-lg">
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

              <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-lg">
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

              <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-lg">
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
                  <Link href="/start" className="hover:text-white transition-colors">
                    Get Started
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
  )
}
