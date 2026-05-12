import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import FeeReportTable from '@/components/FeeReportTable'
import { computeTotals, formatCurrency, type FeeReport } from '@/lib/feeReport'
import { rateLimit } from '@/lib/rate-limit'

// Public borrower-facing quote view. Looked up by shareToken — no login.
// Wraps in the existing /quote layout (NavigationCredible + footer).
//
// What is shown:
//   - frozen outputJson via FeeReportTable
//   - borrower-safe metadata: property, broker company name, savings, expires
//
// What is NOT shown (deliberate):
//   - quote.id, shareToken, brokerUserId, brokerCompanyId, broker user email,
//     inputJson, event history, internal admin fields
//
// First-view event recording: if status='sent', write a FeeQuoteEvent with
// kind='viewed' and transition status → 'viewed'. After that, repeat views
// don't record new events — duplicate-event flood is avoided by gating on
// status instead of trying to dedupe per-IP. Best-effort: any DB hiccup
// during event recording is swallowed so a transient outage never breaks
// the public render.
//
// Rate limit: 10 requests per minute per (ip, token) pair, evaluated BEFORE
// any DB query so a flood can't pound the DB or the event-record path.
// Missing-token requests get their own bucket keyed on 'missing' so blank
// /quote/view requests don't share quota with real tokens.

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams?: Promise<{ token?: string }>
}

export default async function PublicQuoteViewPage({ searchParams }: PageProps) {
  const sp = (await searchParams) || {}
  const token = sp.token?.trim()

  // ── Rate limit (runs before any DB query) ──────────────────────────────
  // Per-(ip,token) bucket. Honors x-forwarded-for / x-real-ip the same way
  // src/app/api/geo/route.ts does. In-memory limiter — fine for the single-
  // instance beta deploy; swap for Upstash when scaling out (same TODO as
  // src/lib/rate-limit.ts).
  const h = await headers()
  const ipHeader = h.get('x-forwarded-for') || h.get('x-real-ip') || ''
  const ip = ipHeader.split(',')[0].trim() || 'unknown'
  const bucketKey = `quote-view:${ip}:${token || 'missing'}`
  const limit = rateLimit(bucketKey, 10, 60_000)
  if (!limit.ok) {
    return <RateLimitedView retryAfterSeconds={Math.ceil(limit.resetMs / 1000)} />
  }

  if (!token) notFound()

  const quote = await prisma.feeQuote.findUnique({
    where: { shareToken: token },
    select: {
      // Public-safe fields only — NEVER select brokerUserId or shareToken into
      // any response sent to the page.
      status: true,
      outputJson: true,
      expiresAt: true,
      borrowerName: true,
      propertyAddress: true,
      propertyCity: true,
      propertyState: true,
      propertyZip: true,
      brokerCompany: { select: { name: true } },
    },
  })
  if (!quote) notFound()

  const expired = new Date(quote.expiresAt) < new Date()

  // Record first-view event when transitioning from 'sent' → 'viewed'.
  // Skip when the quote is expired (no point recording a view for a quote
  // the borrower can't use anyway). Status update + event are wrapped in a
  // transaction so partial failures don't desync them.
  if (!expired && quote.status === 'sent') {
    try {
      await prisma.$transaction(async (tx) => {
        // Re-check inside the transaction to avoid a race with another
        // concurrent first-view writing the same transition twice.
        const fresh = await tx.feeQuote.findUnique({
          where: { shareToken: token },
          select: { id: true, status: true },
        })
        if (fresh && fresh.status === 'sent') {
          await tx.feeQuote.update({
            where: { id: fresh.id },
            data: { status: 'viewed' },
          })
          await tx.feeQuoteEvent.create({
            data: { feeQuoteId: fresh.id, kind: 'viewed' },
          })
        }
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[quote/view] view-event recording failed:', err)
      // Continue rendering — the borrower's view is more important than
      // our event log.
    }
  }

  const report = quote.outputJson as unknown as FeeReport | null
  const totals = report
    ? (() => {
        try {
          return computeTotals(report)
        } catch {
          return null
        }
      })()
    : null
  const savingsAvg = totals
    ? Math.round((totals.estimatedSavingsLow + totals.estimatedSavingsHigh) / 2)
    : null

  const fullAddress =
    [quote.propertyAddress, quote.propertyCity, quote.propertyState, quote.propertyZip]
      .filter(Boolean)
      .join(', ') || null

  return (
    <div className="bg-gray-100 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-1">
            BetterClose Quote
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-dark-900">
            {quote.borrowerName ? `${quote.borrowerName}'s quote` : 'Your quote'}
          </h1>
          {quote.brokerCompany?.name && (
            <p className="text-sm text-gray-600 mt-1">
              Prepared by {quote.brokerCompany.name}
            </p>
          )}
          {fullAddress && (
            <p className="text-xs text-gray-500 mt-1">{fullAddress}</p>
          )}
        </div>

        {expired ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center mb-6">
            <h2 className="text-xl font-black text-amber-900 mb-2">This quote has expired</h2>
            <p className="text-sm text-amber-800 max-w-md mx-auto leading-relaxed">
              Title fees change over time. Reach out to your broker for an updated quote.
            </p>
          </div>
        ) : savingsAvg !== null && savingsAvg > 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 mb-1">
              Estimated savings
            </div>
            <div className="text-4xl font-black text-emerald-900 tabular-nums">
              {formatCurrency(savingsAvg)}
            </div>
            <div className="text-xs text-emerald-800 mt-1">
              at closing, vs. the typical market range
            </div>
          </div>
        ) : null}

        {report ? (
          <FeeReportTable report={report} />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-sm text-gray-500 text-center">
            No fee detail available on this quote.
          </div>
        )}

        <p className="text-xs text-gray-500 text-center mt-6 max-w-lg mx-auto leading-relaxed">
          This is an estimate based on the property and loan details provided. Final fees are
          determined at closing and may vary; some items are set by state/county or the lender
          and are not negotiable. Title insurance underwritten by A-rated underwriters.
        </p>
      </div>
    </div>
  )
}

function RateLimitedView({ retryAfterSeconds }: { retryAfterSeconds: number }) {
  const waitText =
    retryAfterSeconds >= 60
      ? `${Math.ceil(retryAfterSeconds / 60)} minute${Math.ceil(retryAfterSeconds / 60) === 1 ? '' : 's'}`
      : `${Math.max(retryAfterSeconds, 1)} second${retryAfterSeconds === 1 ? '' : 's'}`
  return (
    <div className="bg-gray-100 py-16 px-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 p-10 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">
          BetterClose
        </div>
        <h1 className="text-2xl font-black text-dark-900 mb-3">Too many requests</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          We&apos;ve received a lot of requests from your network in a short time. Please
          wait about {waitText} and try again. If this keeps happening, contact the broker
          who sent you the quote.
        </p>
      </div>
    </div>
  )
}
