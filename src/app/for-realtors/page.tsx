'use client'

import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import PortalWaitlist from '@/components/professional/PortalWaitlist'
import Link from 'next/link'

export default function RealtorsPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationCredible />
      <div className="h-20"></div>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold mb-4">
                FOR REAL ESTATE AGENTS
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-dark-900 mb-6 leading-tight">
                Give Your Buyers an Extra <span className="text-emerald-600">$2,400</span> at Closing
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Stand out from other agents. Close faster with same-day approvals. Zero hidden fees means happy clients who refer their friends.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="mailto:agents@betterclose.co"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  Become a Preferred Agent
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a
                  href="mailto:agents@betterclose.co"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-emerald-200">
              <div className="text-center mb-6">
                <div className="text-5xl font-black text-emerald-600 mb-2">$2,400</div>
                <div className="text-lg text-gray-600">Extra Savings for Your Buyers</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-dark-900">
                    <strong>Same-day</strong> title approval
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-dark-900">
                    <strong>Real-time tracking</strong> for all transactions
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-dark-900">
                    <strong>Works with any lender</strong> they choose
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Agents Choose BetterClose */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-black text-center text-dark-900 mb-12">
            Why Agents Choose BetterClose
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border-2 border-emerald-100">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-dark-900 mb-3">Stand Out</h3>
              <p className="text-gray-700">
                Buyers remember the agent who saved them $2,400. That's furniture, moving costs, or a head start on renovations.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border-2 border-emerald-100">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-dark-900 mb-3">Close Faster</h3>
              <p className="text-gray-700">
                Same-day underwriting approval means no title delays. More transactions per year means more commissions.
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border-2 border-emerald-100">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-dark-900 mb-3">No More Explaining Hidden Fees</h3>
              <p className="text-gray-700">
                Transparent pricing means no surprises at closing. Your buyers trust the process and trust you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map(star => (
                <svg key={star} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed italic">
              "I've been a realtor for 15 years, and BetterClose is a game-changer. My first-time buyers especially appreciate the savings - it helps them with moving costs and furniture. Plus it makes me look like a hero. I recommend them on every deal now."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-600">
                JP
              </div>
              <div>
                <div className="font-bold text-dark-900">James P.</div>
                <div className="text-gray-600">Real Estate Agent, Seattle WA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Waitlist */}
      <PortalWaitlist
        title="Agent Portal Coming Soon"
        description="Track all your transactions, communicate with clients, and access marketing materials - all in one place."
        portalType="realtor"
      />

      <FooterComprehensive />
    </div>
  )
}
