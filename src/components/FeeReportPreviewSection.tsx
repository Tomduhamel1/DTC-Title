'use client'

import Link from 'next/link'
import { useState } from 'react'
import FeeReportTable, { FeeReportEstimateNotes } from './FeeReportTable'
import ShareWithTeamSheet from './lender-request/ShareWithTeamSheet'
import { buildSampleFeeReport, PURCHASE_SAMPLE_LOCATION } from '@/lib/sampleReport'
import { computeTotals, formatCurrency } from '@/lib/feeReport'

export default function FeeReportPreviewSection() {
  const sample = buildSampleFeeReport()
  const totals = computeTotals(sample)
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <section aria-labelledby="fee-preview-heading" className="py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div data-fee-preview-grid className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            {/* Left: Copy + CTA */}
            <div data-fee-preview-copy className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 text-primary-800 text-sm font-semibold mb-4">
                Full transparency
              </div>
              <h2 id="fee-preview-heading" className="text-4xl md:text-5xl font-black text-dark-900 leading-tight tracking-tight mb-5">
                See every fee, line by line.
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                Transparent pricing, line by line. See the service charges you can
                compare, with title insurance and government fees shown separately.
              </p>
              <p className="text-gray-600 mb-5">
                Want a real estimate for your closing? Takes about 30 seconds.
              </p>
              <p className="text-sm text-gray-500 mb-5">
                A {formatCurrency(sample.homeValue)} purchase in {PURCHASE_SAMPLE_LOCATION},
                with a {formatCurrency(sample.loanAmount!)} loan. Calculated with
                our quote engine—not a quote for your property.
              </p>
              <p className="text-sm text-gray-600 mb-5">
                This example saves {formatCurrency(totals.estimatedSavings)} at closing:
                {' '}{formatCurrency(totals.serviceStack?.savings ?? 0)} in service fees
                plus a {formatCurrency(totals.breakdown.promotional_credit ?? 0)} BetterClose Bucks credit.
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
            <div data-fee-preview-report className="relative min-w-0">
              <div className="absolute -top-3 left-6 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-900 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Purchase example · RI
                </span>
              </div>
              <FeeReportTable report={sample} variant="preview" />
            </div>
          </div>
          <FeeReportEstimateNotes report={sample} />
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
