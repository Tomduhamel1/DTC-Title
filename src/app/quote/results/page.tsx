'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import FeeReportTable from '@/components/FeeReportTable'
import NextStepsPanel from '@/components/lender-request/NextStepsPanel'
import { FeeReport, computeTotals, formatCurrency, getMockFeeReport } from '@/lib/feeReport'

// Where post-login the broker should land. The broker builder reads
// ?prefillFromPublic=1 to hydrate inputs from the public sessionStorage quote.
const BROKER_SEND_PATH = '/teammate/quotes/new?prefillFromPublic=1&intent=send'
const BROKER_OPEN_PATH = '/teammate/quotes/new?prefillFromPublic=1&intent=convert'

// Broker-funnel sign-in / signup. mode=signup+source=broker tells /login to
// render broker account-creation copy instead of the default "Sign in" page.
// callbackUrl preserves the intended destination through the magic-link
// redirect; sessionStorage (feeReport + brokerEstimateContext) carries the
// estimate itself through the same-tab login flow.
function buildBrokerSignupHref(callbackPath: string) {
  const cb = encodeURIComponent(callbackPath)
  return `/login?mode=signup&source=broker&callbackUrl=${cb}`
}

export default function QuoteResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status: authStatus } = useSession()
  const sourceParam = searchParams.get('source')
  // Same precedence as /quote/working: querystring first, then sessionStorage.
  const [isBrokerSource, setIsBrokerSource] = useState(sourceParam === 'broker')
  useEffect(() => {
    if (sourceParam === 'broker') return
    if (sessionStorage.getItem('quoteSource') === 'broker') setIsBrokerSource(true)
  }, [sourceParam])

  const [report, setReport] = useState<FeeReport | null>(null)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('feeReport')
    if (stored) {
      try {
        setReport(JSON.parse(stored))
        return
      } catch {}
    }
    setReport(
      getMockFeeReport({ state: 'Georgia', homeValue: 500000, transactionType: 'purchase' })
    )
    setIsFallback(true)
  }, [router])

  if (!report) return null

  const totals = computeTotals(report)
  const isLoggedIn = authStatus === 'authenticated'

  return (
    <div className="bg-gray-100 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={isBrokerSource ? '/quote?source=broker' : '/quote'}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            ← Start over
          </Link>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            BetterClose
          </div>
        </div>

        {isFallback && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 text-sm text-amber-900">
            You're viewing a sample report.{' '}
            <Link
              href={isBrokerSource ? '/quote?source=broker' : '/quote'}
              className="underline font-semibold"
            >
              Get your real estimate →
            </Link>
          </div>
        )}

        {/* Broker-context framing — shown above the report when source=broker */}
        {isBrokerSource && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-700 mb-2">
              For the broker
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-dark-900 mb-2 leading-tight">
              Here&apos;s what your borrower could save
            </h1>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Use this estimate to show your borrower a lower-cost closing option.
              Create a broker account to co-brand it, send it, save it, or convert it into an order.
            </p>
          </div>
        )}

        {report.precision === 'state' || report.precision === 'county' ? (
          <StateLevelSummary report={report} totals={totals} />
        ) : (
          <FeeReportTable report={report} />
        )}

        {/* Next steps — broker version replaces the borrower NextStepsPanel */}
        <div className="mt-8">
          {isBrokerSource ? (
            <BrokerNextSteps isLoggedIn={isLoggedIn} />
          ) : (
            <NextStepsPanel
              savingsEstimate={totals.lifetimeSavings}
              source="quote_results"
            />
          )}
        </div>
      </div>
    </div>
  )
}

// State- and county-level results show only the two savings cards, a clear
// precision badge, and an "Add ZIP" upgrade CTA. No synthetic line items, no
// fabricated savings breakdown — every detail surfaced is derived from the
// state-keyed model. Anything more granular waits for an actual ZIP.
function StateLevelSummary({
  report,
  totals,
}: {
  report: FeeReport
  totals: ReturnType<typeof computeTotals>
}) {
  const isCountyLevel = report.precision === 'county'
  // Representative ZIP disclosure: when the broker entered state-only, we
  // used a representative ZIP for the calc. Surface it here so the broker
  // understands what the number is based on. report.representativeZip may
  // be undefined (edge case — legacy reports without the field); we have a
  // ZIP-unknown variant for that case.
  const usedRepresentativeZip = report.representativeZipUsed === true
  const repZip = report.representativeZip
  const repDisclosure = usedRepresentativeZip
    ? repZip
      ? `We used representative ZIP ${repZip} for ${report.state || 'this state'} to estimate pricing. Add the property ZIP for an itemized quote.`
      : 'We used a representative ZIP for this state to estimate pricing. Add the property ZIP for an itemized quote.'
    : `Based on ${isCountyLevel ? 'county-level' : 'state-level'} pricing. Add ZIP for an itemized quote.`
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-[0.18em]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Fast estimate
        </span>
        <span className="text-[11px] text-gray-500">
          {report.state}
          {isCountyLevel && report.county ? ` · ${report.county}` : ''}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-5">{repDisclosure}</p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl py-4 px-3 text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
            Save at closing
          </div>
          <div className="text-3xl font-black text-emerald-600 tabular-nums leading-none">
            {formatCurrency(totals.estimatedSavings)}
          </div>
          <div className="text-[11px] text-gray-500 mt-1.5">Title &amp; settlement</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl py-4 px-3 text-center">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
            Save over the loan
          </div>
          <div className="text-3xl font-black text-emerald-600 tabular-nums leading-none">
            {formatCurrency(totals.lifetimeSavings)}
          </div>
          <div className="text-[11px] text-gray-500 mt-1.5">Long-term savings</div>
        </div>
      </div>

      <Link
        href="/quote?source=broker"
        className="block text-center w-full bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50 font-bold text-sm px-4 py-3 rounded-xl transition-colors"
      >
        Add ZIP for itemized breakdown →
      </Link>

      <p className="mt-3 text-[11px] text-gray-400 leading-snug">
        Loan savings assumes you borrow less or get better loan pricing because
        your closing costs are lower. Based on 6.5% over 30 years. Final terms
        may vary.
      </p>
    </div>
  )
}

// Broker-context CTAs. Each gated CTA routes through /login with a callbackUrl
// that preserves the quote — the same-tab redirect keeps sessionStorage intact,
// so post-login the broker builder hydrates from the public report.
function BrokerNextSteps({ isLoggedIn }: { isLoggedIn: boolean }) {
  const sendHref = isLoggedIn ? BROKER_SEND_PATH : buildBrokerSignupHref(BROKER_SEND_PATH)
  const openHref = isLoggedIn ? BROKER_OPEN_PATH : buildBrokerSignupHref(BROKER_OPEN_PATH)

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-7 shadow-sm">
      <div className="text-center mb-5">
        <h2 className="text-xl md:text-2xl font-black text-dark-900 mb-1.5">
          Turn this estimate into a closing
        </h2>
        <p className="text-sm text-gray-600">
          {isLoggedIn
            ? 'Open the broker builder to co-brand, send, or convert.'
            : 'Create a free broker account to co-brand this estimate, send it to your borrower, save it to your dashboard, or open the closing.'}
        </p>
      </div>

      {/* Primary CTA — open a closing (brokers are far more likely to do this
          than co-brand/send). */}
      <Link
        href={openHref}
        className="block w-full bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] bg-white/20 inline-block px-2 py-0.5 rounded-full mb-1.5">
              Primary
            </div>
            <div className="text-lg font-black">Open a closing from this estimate</div>
            <div className="text-sm text-emerald-50">
              Convert this estimate into a BetterClose order.
            </div>
          </div>
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </Link>

      {/* Secondary — send to borrower */}
      <Link
        href={sendHref}
        className="mt-3 block rounded-xl border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50/50 p-4 transition-colors"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-primary-700 mb-0.5">
              Send this to my borrower
            </h4>
            <p className="text-xs text-gray-600">
              Co-brand the savings page and share it with your borrower.
            </p>
          </div>
          <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>

      {/* Tertiary — run another estimate, ungated */}
      <Link
        href="/quote?source=broker"
        className="mt-3 block rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 p-4 transition-colors"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-semibold text-gray-700 mb-0.5">
              Run another estimate
            </h4>
            <p className="text-xs text-gray-500">
              Try a different loan, property, or location.
            </p>
          </div>
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </div>
  )
}
