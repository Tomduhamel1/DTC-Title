'use client'

// Single-page professional-facing quote flow used by /for-my-team/quote.
//
// State machine: 'form' | 'loading' | 'result' | 'error'. No sessionStorage,
// no cross-page handoff — the form, loading animation, and result render
// inline in this component so refresh-on-result returns to the form (an
// acceptable v1 trade-off; persistence requires a shareToken/FeeQuote write
// which is deliberately out of scope here).
//
// Submits to the same public /api/fee-estimate endpoint the borrower-facing
// /quote flow uses. The crucial difference is in the result state's CTAs:
// professional next-steps (email order, continue-with-email to dashboard,
// request broker/LO portal access) — not the borrower-funnel CTAs that
// /quote/results renders below the fee table.
//
// All hrefs are prebuilt server-side by the route page and passed in via
// props so this component never has to construct mailto/login URLs from
// refId — it just renders them.

import { useMemo, useState } from 'react'
import Link from 'next/link'
import FeeReportTable from '@/components/FeeReportTable'
import { computeTotals, formatCurrency, type FeeReport } from '@/lib/feeReport'

export interface ProfessionalQuoteFlowProps {
  // Form defaults (may be empty strings or 'purchase' default).
  initialInputs: {
    transactionType: 'purchase' | 'refinance'
    zip: string
    homeValue: string
    loanAmount: string
  }
  // True when getLenderRequestContext resolved a Closing — used to show the
  // personalization strip in the result state.
  isPersonalized: boolean
  clientName: string | null
  propertyAddress: string | null
  // Prebuilt hrefs from the server. Don't reconstruct client-side.
  emailOrderHref: string
  dashboardClaimHref: string
  brokerPortalAccessHref: string
  // Borrower-invite ref, if any. Sent to the persist route for server-side-only
  // attribution (never exposed on the public quote view).
  refId?: string | null
}

type FlowState = 'form' | 'loading' | 'result' | 'error'

export default function ProfessionalQuoteFlow({
  initialInputs,
  isPersonalized,
  clientName,
  propertyAddress,
  emailOrderHref,
  dashboardClaimHref,
  brokerPortalAccessHref,
  refId,
}: ProfessionalQuoteFlowProps) {
  const [state, setState] = useState<FlowState>('form')
  const [transactionType, setTransactionType] = useState<'purchase' | 'refinance'>(
    initialInputs.transactionType,
  )
  const [zip, setZip] = useState(initialInputs.zip)
  const [homeValue, setHomeValue] = useState(initialInputs.homeValue)
  const [loanAmount, setLoanAmount] = useState(initialInputs.loanAmount)
  const [report, setReport] = useState<FeeReport | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  // Relative /quote/view?token=... path returned by the persist route. Null
  // when persistence failed — the result still renders (ephemeral fallback),
  // just without a shareable link.
  const [viewUrl, setViewUrl] = useState<string | null>(null)

  const isPurchase = transactionType === 'purchase'
  const zipValid = /^\d{5}$/.test(zip)
  const homeValueNum = parseFloat(homeValue.replace(/[^0-9.]/g, '')) || 0
  const loanAmountNum = parseFloat(loanAmount.replace(/[^0-9.]/g, '')) || 0
  const valid = zipValid && (isPurchase ? homeValueNum > 0 : loanAmountNum > 0)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || state === 'loading') return
    setState('loading')
    setErrorMessage(null)
    setViewUrl(null)
    try {
      // Persist route: returns the fee report AND a durable shareable link in
      // one round-trip (one upstream fee-estimate call). If persistence failed
      // server-side, viewUrl comes back null and we render the ephemeral
      // result without a share link — the report is still present.
      const res = await fetch('/api/professional/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionType,
          zip,
          homeValue: isPurchase ? homeValueNum : undefined,
          loanAmount: loanAmountNum > 0 ? loanAmountNum : undefined,
          borrowerName: clientName || undefined,
          refId: refId || undefined,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok || !json.report) {
        throw new Error(json.error || `Request failed (${res.status})`)
      }
      setReport(json.report as FeeReport)
      setViewUrl(typeof json.viewUrl === 'string' ? json.viewUrl : null)
      setState('result')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
      setState('error')
    }
  }

  function onEditEstimate() {
    setState('form')
    setErrorMessage(null)
    // Keep current form values + last report — user can resubmit or change inputs.
  }

  const personalizationStrip =
    isPersonalized && (clientName || propertyAddress) ? (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-700 shadow-sm">
        {clientName && <span className="font-semibold text-dark-900">{clientName}</span>}
        {clientName && propertyAddress && <span className="text-gray-300">·</span>}
        {propertyAddress && <span>{propertyAddress}</span>}
      </div>
    ) : null

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-12 lg:py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider mb-4">
              Professional quote
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-dark-900 leading-tight tracking-tight mb-4">
              Show your client exactly what they save.
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-4">
              Real fees, line-item pricing, same A-rated underwriters. No login
              required.
            </p>
            {personalizationStrip}
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-50 min-h-[40vh]">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            {state === 'form' || state === 'error' ? (
              <FormCard
                transactionType={transactionType}
                setTransactionType={setTransactionType}
                zip={zip}
                setZip={setZip}
                homeValue={homeValue}
                setHomeValue={setHomeValue}
                loanAmount={loanAmount}
                setLoanAmount={setLoanAmount}
                valid={valid}
                errorMessage={state === 'error' ? errorMessage : null}
                onSubmit={onSubmit}
              />
            ) : state === 'loading' ? (
              <LoadingCard />
            ) : (
              report && (
                <ResultPanel
                  report={report}
                  viewUrl={viewUrl}
                  emailOrderHref={emailOrderHref}
                  dashboardClaimHref={dashboardClaimHref}
                  brokerPortalAccessHref={brokerPortalAccessHref}
                  isPersonalized={isPersonalized}
                  onEditEstimate={onEditEstimate}
                />
              )
            )}
          </div>
        </div>
      </section>
    </>
  )
}

// ─── Form state ─────────────────────────────────────────────────────────

interface FormCardProps {
  transactionType: 'purchase' | 'refinance'
  setTransactionType: (v: 'purchase' | 'refinance') => void
  zip: string
  setZip: (v: string) => void
  homeValue: string
  setHomeValue: (v: string) => void
  loanAmount: string
  setLoanAmount: (v: string) => void
  valid: boolean
  errorMessage: string | null
  onSubmit: (e: React.FormEvent) => void
}

function FormCard({
  transactionType,
  setTransactionType,
  zip,
  setZip,
  homeValue,
  setHomeValue,
  loanAmount,
  setLoanAmount,
  valid,
  errorMessage,
  onSubmit,
}: FormCardProps) {
  const isPurchase = transactionType === 'purchase'
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-7 lg:p-8 space-y-5"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Transaction type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['purchase', 'refinance'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setTransactionType(opt)}
              className={`py-3 rounded-lg border-2 font-semibold capitalize transition-colors ${
                transactionType === opt
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="zip" className="block text-sm font-semibold text-gray-700 mb-2">
          ZIP code
        </label>
        <input
          id="zip"
          type="text"
          inputMode="numeric"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
          maxLength={5}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
        />
      </div>

      {isPurchase && (
        <div>
          <label htmlFor="homeValue" className="block text-sm font-semibold text-gray-700 mb-2">
            Purchase amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="homeValue"
              type="text"
              inputMode="numeric"
              value={homeValue}
              onChange={(e) => setHomeValue(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="loanAmount" className="block text-sm font-semibold text-gray-700 mb-2">
          Loan amount{' '}
          {isPurchase && (
            <span className="text-gray-400 font-normal">(optional)</span>
          )}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            id="loanAmount"
            type="text"
            inputMode="numeric"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
          />
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">
          Couldn&apos;t build the estimate right now. {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!valid}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 rounded-lg shadow-md transition-colors disabled:opacity-60"
      >
        Get the fee estimate
      </button>

      <p className="text-xs text-gray-500 text-center">
        No login required. Uses the same fee engine as the borrower-facing quote.
      </p>
    </form>
  )
}

// ─── Loading state ──────────────────────────────────────────────────────

function LoadingCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 text-center">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
      <div className="text-base font-bold text-dark-900 mb-1">
        Building the estimate…
      </div>
      <div className="text-sm text-gray-500">
        Pulling fees, comparing to the typical market range.
      </div>
    </div>
  )
}

// ─── Result state ───────────────────────────────────────────────────────

interface ResultPanelProps {
  report: FeeReport
  // Relative /quote/view?token=... path, or null if persistence failed.
  viewUrl: string | null
  emailOrderHref: string
  dashboardClaimHref: string
  brokerPortalAccessHref: string
  isPersonalized: boolean
  onEditEstimate: () => void
}

function ResultPanel({
  report,
  viewUrl,
  emailOrderHref,
  dashboardClaimHref,
  brokerPortalAccessHref,
  isPersonalized,
  onEditEstimate,
}: ResultPanelProps) {
  const totals = useMemo(() => {
    try {
      return computeTotals(report)
    } catch {
      return null
    }
  }, [report])

  // Same figure the embedded FeeReportTable shows as "Save at closing" —
  // the banner and the table must never disagree.
  const avgSavings = totals ? totals.estimatedSavings : null

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={onEditEstimate}
          className="text-sm font-semibold text-gray-500 hover:text-dark-900"
        >
          ← Edit estimate
        </button>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          BetterClose · Professional
        </div>
      </div>

      {avgSavings !== null && avgSavings > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 mb-1">
            Estimated savings at closing
          </div>
          <div className="text-4xl md:text-5xl font-black text-emerald-800 tabular-nums">
            {formatCurrency(avgSavings)}
          </div>
          <div className="text-xs text-emerald-800/80 mt-1">
            vs. the typical market range — for your client&apos;s closing
          </div>
        </div>
      )}

      <FeeReportTable report={report} />

      {viewUrl && <ShareLinkCard viewUrl={viewUrl} />}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-black text-dark-900 mb-1">Your next step</h2>
        <p className="text-sm text-gray-600 mb-5">
          Use this estimate to decide whether to send the order. The
          borrower&apos;s actual closing costs are confirmed at closing.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href={emailOrderHref}
            className="block rounded-xl border-2 border-emerald-500 bg-emerald-600 hover:bg-emerald-700 p-5 text-white shadow-sm transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl" aria-hidden="true">
                ✉️
              </span>
              <h3 className="text-base font-black">Send this order to BetterClose</h3>
            </div>
            <p className="text-xs text-emerald-50">
              Send the file details to BetterClose so we can help open or route
              the order.
              {isPersonalized
                ? " Pre-filled with your client's details."
                : ' Uses a generic order template.'}
            </p>
            <div className="text-sm font-bold mt-3">Email the order team →</div>
          </a>

          <Link
            href={dashboardClaimHref}
            className="block rounded-xl border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50/50 p-5 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl" aria-hidden="true">
                📊
              </span>
              <h3 className="text-base font-black text-primary-700">
                Track this file online
              </h3>
            </div>
            <p className="text-xs text-gray-600">
              We&apos;ll email you a magic link so you can view this file in your
              BetterClose dashboard. No password &mdash; we&apos;ll create your
              account if you don&apos;t have one.
            </p>
            <div className="text-sm font-bold text-primary-700 mt-3">
              Get a secure sign-in link →
            </div>
          </Link>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-700">
            Need broker/LO portal access? For brokers and loan officers who want
            to create quotes and manage files.{' '}
            <a
              href={brokerPortalAccessHref}
              className="font-bold underline underline-offset-2 text-primary-700 hover:text-primary-800"
            >
              Request portal access →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Shareable link ─────────────────────────────────────────────────────
//
// Rendered only when the persist route returned a viewUrl. The link is the
// public /quote/view?token=... page — durable (survives tab close), no login.
// We build the absolute URL from the current origin so the copied value is a
// full shareable link the professional can paste to a borrower.

function ShareLinkCard({ viewUrl }: { viewUrl: string }) {
  const [copied, setCopied] = useState(false)

  const absoluteUrl = useMemo(() => {
    if (typeof window === 'undefined') return viewUrl
    return `${window.location.origin}${viewUrl}`
  }, [viewUrl])

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(absoluteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API can be unavailable (insecure context / permissions).
      // The input is selectable as a manual fallback, so do nothing here.
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-black text-dark-900 mb-1">Share this quote</h2>
      <p className="text-sm text-gray-600 mb-4">
        A durable link to this estimate — your client can open it any time, no
        login needed. The quote is saved for 30 days.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          readOnly
          value={absoluteUrl}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 font-mono truncate"
        />
        <button
          type="button"
          onClick={onCopy}
          className="px-5 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition-colors whitespace-nowrap"
        >
          {copied ? 'Copied ✓' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}
