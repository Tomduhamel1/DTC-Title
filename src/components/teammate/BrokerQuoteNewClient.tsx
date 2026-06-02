'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import BrokerQuoteForm, {
  type BrokerQuoteFormPrefill,
  type BrokerQuoteIntent,
} from './BrokerQuoteForm'
import { formatCurrency, computeTotals, type FeeReport } from '@/lib/feeReport'
import {
  readBrokerEstimateContext,
  type BrokerEstimateContext,
} from '@/lib/brokerEstimateContext'

interface CompanyOption {
  id: string
  name: string
}

interface Props {
  companies: CompanyOption[]
}

// Map full state names (which is what the public /quote flow stores in
// feeReport.state) to the 2-letter codes the broker form expects. Covers
// every state + DC. If a value comes in already as a 2-letter code, we use
// it directly.
const STATE_NAME_TO_CODE: Record<string, string> = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA',
  hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA',
  kansas: 'KS', kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD',
  massachusetts: 'MA', michigan: 'MI', minnesota: 'MN', mississippi: 'MS', missouri: 'MO',
  montana: 'MT', nebraska: 'NE', nevada: 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND',
  ohio: 'OH', oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI',
  'south carolina': 'SC', 'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT',
  vermont: 'VT', virginia: 'VA', washington: 'WA', 'west virginia': 'WV',
  wisconsin: 'WI', wyoming: 'WY', 'district of columbia': 'DC',
}

function normalizeStateToCode(stateValue: string | undefined): string | undefined {
  if (!stateValue) return undefined
  const trimmed = stateValue.trim()
  // Already a 2-letter code
  if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase()
  const code = STATE_NAME_TO_CODE[trimmed.toLowerCase()]
  return code
}

type ImportStatus = 'idle' | 'ok' | 'fallback' | 'no-prefill-requested'

// Client wrapper that handles the public-quote import for the broker builder.
// Renders the form pre-filled from sessionStorage when the URL says
// ?prefillFromPublic=1, with success / failure banners. Falls back to a
// blank form (no banner) for the normal "new quote" entry point.
export default function BrokerQuoteNewClient({ companies }: Props) {
  const searchParams = useSearchParams()
  const prefillRequested = searchParams.get('prefillFromPublic') === '1'
  const intentParam = searchParams.get('intent')
  const intent: BrokerQuoteIntent | undefined =
    intentParam === 'send' || intentParam === 'convert' ? intentParam : undefined

  // null = not yet attempted (initial SSR render); object = attempted.
  const [prefill, setPrefill] = useState<BrokerQuoteFormPrefill | null>(null)
  const [importStatus, setImportStatus] = useState<ImportStatus>(
    prefillRequested ? 'idle' : 'no-prefill-requested',
  )
  const [importedReport, setImportedReport] = useState<FeeReport | null>(null)
  // Lead-capture payload imported alongside the FeeReport. May contain fields
  // the broker form doesn't take yet (target close date, lender info) — those
  // surface in the success banner so they aren't silently lost.
  const [importedContext, setImportedContext] = useState<BrokerEstimateContext | null>(null)

  useEffect(() => {
    if (!prefillRequested) return
    try {
      const reportRaw = sessionStorage.getItem('feeReport')
      if (!reportRaw) {
        setImportStatus('fallback')
        setPrefill({})
        return
      }
      const report = JSON.parse(reportRaw) as FeeReport
      // Lead/file context is independent of the FeeReport — it travels in its
      // own sessionStorage key so calc and lead payloads stay decoupled.
      const ctx = readBrokerEstimateContext() ?? {}
      // ZIP precedence: prefer the broker-entered property ZIP from the
      // estimate context. Only fall back to the FeeReport's ZIP when the
      // estimate was 'detailed' precision — meaning the FeeReport ZIP is a
      // real one the broker actually typed, not a representative substitution
      // for a state-only run.
      const reportZipIsReal = report.precision === 'detailed' ? report.zip : undefined
      const hydrated: BrokerQuoteFormPrefill = {
        transactionType: report.transactionType,
        zip: ctx.propertyZip ?? reportZipIsReal,
        homeValue: report.homeValue > 0 ? report.homeValue : undefined,
        loanAmount: report.loanAmount,
        // Prefer the broker-entered state code; fall back to deriving from
        // the FeeReport's state string.
        propertyState: ctx.propertyState ?? normalizeStateToCode(report.state),
        borrowerName: ctx.borrowerName,
        borrowerEmail: ctx.borrowerEmail,
        borrowerPhone: ctx.borrowerPhone,
        propertyAddress: ctx.propertyAddress,
        propertyCity: ctx.propertyCity,
      }
      setImportedReport(report)
      setImportedContext(ctx)
      setPrefill(hydrated)
      setImportStatus('ok')
    } catch {
      setImportStatus('fallback')
      setPrefill({})
    }
  }, [prefillRequested])

  // If a prefill was requested, wait for the effect to resolve before rendering
  // the form — otherwise the form mounts with empty defaults that become its
  // permanent initial state. (useState initializer runs once.)
  if (prefillRequested && prefill === null) {
    return (
      <div className="text-sm text-gray-500 text-center py-10">Importing estimate…</div>
    )
  }

  return (
    <div className="space-y-5">
      {importStatus === 'ok' && (
        <ImportSuccessBanner
          report={importedReport}
          context={importedContext}
          intent={intent}
        />
      )}
      {importStatus === 'fallback' && <ImportFallbackBanner />}

      <BrokerQuoteForm
        companies={companies}
        initialPrefill={prefill ?? undefined}
        intent={intent}
      />
    </div>
  )
}

function ImportSuccessBanner({
  report,
  context,
  intent,
}: {
  report: FeeReport | null
  context: BrokerEstimateContext | null
  intent?: BrokerQuoteIntent
}) {
  const totals = report ? computeTotals(report) : null
  // State/county-level imports are missing ZIP (and possibly other details
  // the broker builder needs before sending or opening a closing). We don't
  // block import — we just tell the broker what's still missing.
  const isFastEstimate =
    report?.precision === 'state' || report?.precision === 'county'
  const completionLine = isFastEstimate
    ? 'Add ZIP and any missing details before sending or opening the closing.'
    : intent === 'send'
    ? 'Review the details, add your borrower, and send the quote.'
    : intent === 'convert'
    ? 'Review the details, add your borrower, and open the closing.'
    : 'Review the details, add your borrower, and send or open the closing.'
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="text-emerald-600 mt-0.5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-emerald-900">
            Estimate imported.{isFastEstimate ? ' (Fast estimate)' : ''}
          </div>
          <div className="text-sm text-emerald-800 mt-0.5">{completionLine}</div>
          {totals && totals.estimatedSavings > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2 max-w-md">
              <div className="bg-white border border-emerald-200 rounded-lg px-3 py-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Save at closing
                </div>
                <div className="text-lg font-black text-emerald-700 tabular-nums leading-none mt-1">
                  {formatCurrency(totals.estimatedSavings)}
                </div>
              </div>
              <div className="bg-white border border-emerald-200 rounded-lg px-3 py-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Save over the loan
                </div>
                <div className="text-lg font-black text-emerald-700 tabular-nums leading-none mt-1">
                  {formatCurrency(totals.lifetimeSavings)}
                </div>
              </div>
            </div>
          )}
          <ParkedFieldsCallout context={context} />
        </div>
      </div>
    </div>
  )
}

// Surface fields the broker entered on the public estimate that the gated
// builder doesn't yet ask for. These will be re-collected and persisted once
// FeeQuote schema gains the columns — for now, we just acknowledge them so
// the broker doesn't think they were lost.
function ParkedFieldsCallout({ context }: { context: BrokerEstimateContext | null }) {
  if (!context) return null
  const parked: { label: string; value: string }[] = []
  if (context.targetClosingDate) parked.push({ label: 'Target closing', value: context.targetClosingDate })
  if (context.lenderName) parked.push({ label: 'Lender / LO', value: context.lenderName })
  if (context.lenderCompany) parked.push({ label: 'Lender company', value: context.lenderCompany })
  if (context.lenderEmail) parked.push({ label: 'Lender email', value: context.lenderEmail })
  if (parked.length === 0) return null
  return (
    <div className="mt-3 text-[11px] text-emerald-900/80 bg-white/60 border border-emerald-200 rounded-md px-3 py-2">
      <div className="font-bold uppercase tracking-wider text-[10px] text-emerald-700 mb-1">
        Also captured
      </div>
      <ul className="space-y-0.5">
        {parked.map((p) => (
          <li key={p.label}>
            <span className="text-emerald-700">{p.label}:</span>{' '}
            <span className="font-medium">{p.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ImportFallbackBanner() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="text-amber-600 mt-0.5">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-amber-900">
            We couldn&apos;t import the estimate.
          </div>
          <div className="text-sm text-amber-800 mt-0.5">
            <a href="/quote?source=broker" className="underline font-semibold">
              Run another estimate
            </a>{' '}
            or enter the details manually below.
          </div>
        </div>
      </div>
    </div>
  )
}
