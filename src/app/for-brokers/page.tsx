'use client'

import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import PortalWaitlist from '@/components/professional/PortalWaitlist'
import Link from 'next/link'

export default function BrokersPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationCredible />
      <div className="h-20"></div>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-bold mb-4">
                FOR MORTGAGE BROKERS
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-dark-900 mb-6 leading-tight">
                Help Your Clients Save <span className="text-primary-600">$2,400</span> on Average
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Transparent pricing your clients will love. Higher referral satisfaction. More closed deals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="mailto:partners@betterclose.co"
                  className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg"
                >
                  Partner with BetterClose
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a
                  href="mailto:partners@betterclose.co"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-50 transition-colors"
                >
                  Schedule a Demo
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-primary-200">
              <div className="text-center mb-6">
                <div className="text-5xl font-black text-green-600 mb-2">$2,400</div>
                <div className="text-lg text-gray-600">Average Client Savings</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-dark-900">
                    <strong>Instant quotes</strong> your clients can see
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-dark-900">
                    <strong>Transparent commission</strong> structure
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-dark-900">
                    <strong>Same-day approval</strong> for faster closings
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works for Brokers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-black text-center text-dark-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Send the Link',
                desc: 'Share our calculator with your client'
              },
              {
                step: '2',
                title: 'Client Sees Savings',
                desc: 'Instant quote shows exact comparison'
              },
              {
                step: '3',
                title: 'We Handle Everything',
                desc: 'Same-day underwriting, full support'
              },
              {
                step: '4',
                title: 'You Close Happy Clients',
                desc: 'Clients remember who saved them money'
              }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-black mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
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
              "My clients love BetterClose's transparent pricing. I close more deals because buyers see the savings and trust the process. It's become my go-to recommendation for every transaction."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600">
                LT
              </div>
              <div>
                <div className="font-bold text-dark-900">Lisa T.</div>
                <div className="text-gray-600">Mortgage Broker, Miami FL</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Waitlist */}
      <PortalWaitlist
        title="Broker Portal Coming Soon"
        description="Track referrals, view commissions, and manage all your BetterClose transactions in one dashboard."
        portalType="broker"
      />

      <FooterComprehensive />
    </div>
  )
}
