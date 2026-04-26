'use client'

import { useState } from 'react'
import Link from 'next/link'
import ShareWithTeamSheet from './ShareWithTeamSheet'

interface NextStepsPanelProps {
  savingsEstimate?: number
  source: string
}

export default function NextStepsPanel({ savingsEstimate, source }: NextStepsPanelProps) {
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-7 shadow-sm">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-black text-dark-900 mb-1">
            {savingsEstimate
              ? `Lock in $${savingsEstimate.toLocaleString()} in savings`
              : 'Make BetterClose your closing company'}
          </h2>
          <p className="text-sm text-gray-600">
            Three ways to make BetterClose your closing company.
          </p>
        </div>

        {/* Primary tile */}
        <button
          onClick={() => setShareOpen(true)}
          className="w-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl p-6 text-left shadow-md hover:shadow-lg transition-all group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-white/20 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
              <h3 className="text-xl font-black mb-1">Send BetterClose to my lender or agent</h3>
              <p className="text-sm text-green-50">
                Text, email, or copy a link — your choice. We can email them for you too.
              </p>
            </div>
            <svg
              className="w-6 h-6 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </button>

        {/* Secondary + tertiary */}
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <Link
            href="/for-my-lender"
            className="block rounded-xl border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50/50 p-5 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-base font-bold text-primary-700 mb-0.5">
                  I'm a lender or agent
                </h4>
                <p className="text-xs text-gray-600">
                  Place a title order or learn how we work with you.
                </p>
              </div>
              <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/start"
            className="block rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 p-5 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold text-gray-700 mb-0.5">
                  I'm ready to start now
                </h4>
                <p className="text-xs text-gray-500">
                  Have your CD or Loan Estimate? Begin the full intake.
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        <p className="text-center text-xs text-gray-500 mt-5">
          Prefer to talk? Call <a href="tel:18555557283" className="font-semibold text-gray-700 hover:text-gray-900">(855) 555-SAVE</a>.
        </p>
      </div>

      <ShareWithTeamSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        savingsEstimate={savingsEstimate}
        source={source}
      />
    </>
  )
}
