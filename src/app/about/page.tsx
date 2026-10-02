'use client'

import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import UnderwriterLogos from '@/components/UnderwriterLogos'
import { useState } from 'react'
import ShareWithTeamSheet from '@/components/lender-request/ShareWithTeamSheet'
import { formatCurrency } from '@/lib/feeReport'
import { estimateSavings } from '@/lib/stateSavings'

// Engine-derived national-average savings at the $500k purchase anchor —
// same number the hero and quote flow produce, so this page can't drift.
const TYPICAL_SAVE = formatCurrency(
  estimateSavings(500000, 'purchase', null).saveAtClosing,
)

export default function AboutPage() {
  const [shareOpen, setShareOpen] = useState(false)
  return (
    <div className="min-h-screen bg-white">
      <NavigationCredible />
      <div className="h-20"></div>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-black text-dark-900 mb-6">
            About BetterClose
          </h1>
          <p className="text-2xl text-gray-700 leading-relaxed">
            Making title and settlement pricing <span className="text-primary-600 font-bold">transparent</span>, <span className="text-primary-600 font-bold">competitive</span>, and <span className="text-primary-600 font-bold">easy to compare</span>.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-black text-dark-900 mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              BetterClose was built around a simple idea: <strong>lower closing costs with transparent pricing, line by line</strong>.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              BetterClose is a DBA of First National Title &amp; Escrow LLC. We combine
              title and settlement experience with digital tools that help your closing
              team coordinate the file and make costs easier to understand.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              You should be able to see what each service costs, compare fees, and
              understand where you can save before choosing your closing company.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We show service fees separately from title insurance premiums,
              recording fees, and taxes. Our savings comparisons focus on service
              charges—not discounts to insurance premiums or government charges.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Technology supports the process; people handle your closing. If title
              issues require legal work, the closing team coordinates with the
              appropriate attorneys and explains the effect on costs and timing.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Competitive service fees can leave you with more at closing. Our national
              $500,000 purchase example shows <strong className="text-primary-600">{TYPICAL_SAVE} in estimated savings at closing</strong>.
              Actual savings depend on your property, services, and comparison quote.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-3">Transparency</h3>
              <p className="text-gray-700">
                See what each charge covers, how our fees compare, and where you can save.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-3">Affordability</h3>
              <p className="text-gray-700">
                Save on closing services while working with a dedicated closing team.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-3">Simplicity</h3>
              <p className="text-gray-700">
                Technology that makes closing easy, not complicated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Underwriter Partnerships */}
      <UnderwriterLogos />

      {/* Service Areas */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-black text-dark-900 mb-6">
            Where We Close Today
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Check your property's location and transaction type for available estimates.
            Contact our team for licensing and service details in your state.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-700 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-black mb-4">
            Ready to Save on Your Closing?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Tell your lender or realtor — takes 30 seconds
          </p>
          <button
            onClick={() => setShareOpen(true)}
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition-colors shadow-xl"
          >
            Send BetterClose to my team
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>

      <FooterComprehensive />
      <ShareWithTeamSheet open={shareOpen} onClose={() => setShareOpen(false)} source="about" />
    </div>
  )
}
