'use client'

import { useState } from 'react'
import Link from 'next/link'
import ShareWithTeamSheet from './ShareWithTeamSheet'
import AvailabilityStrip from './AvailabilityStrip'

interface NextStepsPanelProps {
  savingsEstimate?: number
  source: string
  // 'pre-quote' = on the homepage, before the user has gotten a quote.
  //               Headline + secondary tile reflect that quoting is optional.
  // 'post-quote' = on /quote/results, after the user has a real number.
  mode?: 'pre-quote' | 'post-quote'
}

export default function NextStepsPanel({
  savingsEstimate,
  source,
  mode = 'post-quote',
}: NextStepsPanelProps) {
  const [shareOpen, setShareOpen] = useState(false)
  const isPre = mode === 'pre-quote'

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-7 shadow-sm">
        <div className="text-center mb-5">
          <h2 className="text-2xl md:text-3xl font-black text-dark-900 mb-1.5">
            {isPre ? (
              'Tell your team you want to use BetterClose.'
            ) : savingsEstimate ? (
              <>
                Lock in <span className="text-emerald-600">${savingsEstimate.toLocaleString()}</span> over your loan
              </>
            ) : (
              'Make BetterClose your closing company'
            )}
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            {isPre
              ? '30 seconds — alert your team you want to use BetterClose. No quote needed.'
              : savingsEstimate
              ? 'Tell your team to use BetterClose so you actually capture these savings — at closing and over the loan.'
              : 'Three ways to make BetterClose your closing company.'}
          </p>
        </div>

        {/* Primary tile — same in both modes */}
        <button
          onClick={() => setShareOpen(true)}
          className="w-full bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl p-6 text-left shadow-md hover:shadow-lg transition-all group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-white/20 px-2 py-0.5 rounded-full">
                  {isPre ? 'Start here · 30 sec' : 'Recommended'}
                </span>
              </div>
              <h3 className="text-xl font-black mb-1">
                {isPre
                  ? 'Send BetterClose to my team'
                  : 'Send BetterClose to my lender or agent'}
              </h3>
              <p className="text-sm text-emerald-50">
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

        {/* Secondary tiles — different by mode */}
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {isPre ? (
            <Link
              href="/quote"
              className="block rounded-xl border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 p-5 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-emerald-700 mb-0.5">
                    See your savings first
                  </h4>
                  <p className="text-xs text-gray-600">
                    Get a personalized fee estimate. Takes 30 seconds.
                  </p>
                </div>
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ) : (
            <Link
              href="/for-my-team"
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
          )}

          <Link
            href="/dashboard"
            className="block rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 p-5 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-base font-semibold text-gray-700 mb-0.5">
                  Just create my dashboard for now
                </h4>
                <p className="text-xs text-gray-500">
                  We'll match it when your team places the order.
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Availability strip */}
        <AvailabilityStrip className="mt-5" />
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
