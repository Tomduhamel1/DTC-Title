'use client'

import Link from 'next/link'
import { useState } from 'react'
import FeeReportTable from './FeeReportTable'
import ShareWithTeamSheet from './lender-request/ShareWithTeamSheet'
import { getSampleFeeReport } from '@/lib/feeReport'

export default function FeeReportPreviewSection() {
  const sample = getSampleFeeReport()
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy + CTA */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 text-primary-800 text-sm font-semibold mb-4">
                Full transparency
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 leading-tight tracking-tight mb-5">
                See every fee, line by line.
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                No surprises at closing. Get an itemized breakdown of every cost, with our price compared to the typical range so you know exactly what you're saving — and what's set by the state.
              </p>
              <p className="text-gray-600 mb-5">
                Want a real estimate for your closing? Takes about 30 seconds.
              </p>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Get my fee estimate
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <p className="mt-4 text-sm text-gray-500">
                Or skip the quote and{' '}
                <button
                  onClick={() => setShareOpen(true)}
                  className="text-primary-700 font-semibold hover:text-primary-800 underline-offset-2 hover:underline"
                >
                  alert your team in 30 seconds →
                </button>
              </p>
            </div>

            {/* Right: Sample report */}
            <div className="relative">
              <div className="absolute -top-3 left-6 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-900 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Sample report
                </span>
              </div>
              <FeeReportTable report={sample} variant="preview" />
            </div>
          </div>
        </div>
      </div>
      <ShareWithTeamSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        source="fee_report_preview"
      />
    </section>
  )
}
