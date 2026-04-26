'use client'

import Link from 'next/link'
import { useSavings } from '@/contexts/SavingsContext'

export default function HowItWorksSection() {
  const { savings } = useSavings()
  const steps = [
    {
      number: "1",
      title: "Get Instant Quote",
      description: "Use our AI-powered calculator to see your exact savings in 60 seconds. No hidden fees, no surprises.",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      highlight: "60 seconds"
    },
    {
      number: "2",
      title: "Submit Documents",
      description: "Upload your documents securely and track your status in real-time. Same-day underwriting approval.",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      highlight: "Same-day approval"
    },
    {
      number: "3",
      title: "Close & Save",
      description: "Close with confidence knowing you have the same protection as big companies, just at a fair price.",
      icon: (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      highlight: "$2,400 avg savings"
    }
  ]

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-4">
            Saving <span className="text-green-600">${savings.totalSavings.toLocaleString()}</span> Takes 2 Min
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to save thousands on title insurance
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-24 left-1/2 w-full h-1 bg-gradient-to-r from-primary-200 to-primary-300 z-0" style={{ width: 'calc(100% + 2rem)' }} />
              )}

              {/* Step Card */}
              <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border-2 border-primary-100">
                {/* Step Number & Icon */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                    {step.icon}
                  </div>
                  <div className="text-6xl font-black text-primary-100">
                    {step.number}
                  </div>
                </div>

                {/* Step Content */}
                <h3 className="text-2xl font-black text-dark-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Highlight Badge */}
                <div className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-lg font-bold text-sm">
                  ✓ {step.highlight}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/start"
            className="inline-flex items-center gap-3 bg-primary-600 text-white px-10 py-4 rounded-xl font-bold text-xl hover:bg-primary-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 group"
          >
            <span>Get Started Now</span>
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Takes 2 minutes • No commitment required
          </p>
        </div>
      </div>
    </section>
  )
}
