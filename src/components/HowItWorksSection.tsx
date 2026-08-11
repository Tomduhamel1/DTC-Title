'use client'

import { useState } from 'react'
import Link from 'next/link'
import ShareWithTeamSheet from './lender-request/ShareWithTeamSheet'
import { formatCurrency } from '@/lib/feeReport'
import { estimateSavings } from '@/lib/stateSavings'

// National-average at-closing savings on the anchor $500k purchase — same
// engine-derived number the hero and calculators use, so this badge can
// never drift from what the quote flow actually shows.
const TYPICAL_SAVE = formatCurrency(
  estimateSavings(500000, 'purchase', null).saveAtClosing,
)

export default function HowItWorksSection() {
  const [shareOpen, setShareOpen] = useState(false)

  const steps = [
    {
      number: '1',
      title: 'Alert Your Team',
      description:
        "Tell your lender or realtor you'd like to use BetterClose. Text, email, or copy a link — your choice. We can email them for you too.",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.069-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      highlight: '30 seconds · no commitment',
    },
    {
      number: '2',
      title: 'Track Progress',
      description:
        "Watch your closing happen in real time. Every milestone — loan locked, title ordered, title issued, closed — updates as parties and services fill in.",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      highlight: 'Live dashboard',
    },
    {
      number: '3',
      title: 'Close & Save',
      description:
        "We coordinate with your lender, realtor, and underwriter. You show up to closing with the same protection — and a smaller bill.",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      highlight: `Typically −${TYPICAL_SAVE} saved on a $500k purchase`,
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three steps. The first one takes 30 seconds — and you don't even need a quote.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-24 left-1/2 w-full h-1 bg-gradient-to-r from-primary-200 to-primary-300 z-0"
                  style={{ width: 'calc(100% + 2rem)' }}
                />
              )}

              {/* Step Card */}
              <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border-2 border-primary-100">
                {/* Step Number & Icon */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                    {step.icon}
                  </div>
                  <div className="text-6xl font-black text-primary-100">{step.number}</div>
                </div>

                {/* Step Content */}
                <h3 className="text-2xl font-black text-dark-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>

                {/* Highlight Badge */}
                <div className="inline-block bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-bold text-sm">
                  ✓ {step.highlight}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => setShareOpen(true)}
            className="inline-flex items-center gap-3 bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-emerald-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 group"
          >
            <span>Send BetterClose to my team</span>
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Takes 30 seconds. Or,{' '}
            <Link href="/quote" className="text-primary-700 font-semibold hover:text-primary-800 underline-offset-2 hover:underline">
              see your savings first →
            </Link>
          </p>
        </div>
      </div>

      <ShareWithTeamSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        source="how_it_works"
      />
    </section>
  )
}
