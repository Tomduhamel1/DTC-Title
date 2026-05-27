import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import TeammateTabs from '@/components/teammate/TeammateTabs'
import FeeReportTable from '@/components/FeeReportTable'
import BrokerQuoteActions from '@/components/teammate/BrokerQuoteActions'
import { requireUser, requireBrokerMember } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { computeTotals, formatCurrency, type FeeReport } from '@/lib/feeReport'

// Broker quote detail page. Renders the frozen outputJson via the existing
// FeeReportTable component plus borrower/property summary.
//
// Company-scoped: any member of the FeeQuote's brokerCompany can view it,
// regardless of which co-member created it. Non-member access returns 404
// (not 403) to avoid leaking quote-id existence.

export const dynamic = 'force-dynamic'

export default async function TeammateQuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireUser()
  const { id } = await params
  if (!user) redirect(`/login?callbackUrl=/teammate/quotes/${id}`)

  const ctx = await requireBrokerMember()
  if (!ctx) redirect('/teammate/dashboard')

  // Company-scoped: any member of the FeeQuote's brokerCompany can view it,
  // regardless of which co-member created it. Non-member access returns 404
  // (not 403) to avoid leaking quote-id existence.
  const companyIds = ctx.memberships.map((m) => m.companyId)
  const quote = await prisma.feeQuote.findFirst({
    where: { id, brokerCompanyId: { in: companyIds } },
    select: {
      id: true,
      status: true,
      shareToken: true,
      convertedClosingId: true,
      borrowerName: true,
      borrowerEmail: true,
      borrowerPhone: true,
      propertyAddress: true,
      propertyCity: true,
      propertyState: true,
      propertyZip: true,
      outputJson: true,
      createdAt: true,
      expiresAt: true,
      brokerCompany: { select: { name: true, verifiedAt: true } },
      brokerUser: { select: { id: true, name: true, email: true } },
      events: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, kind: true, createdAt: true },
      },
    },
  })
  if (!quote) notFound()

  // Resolve the absolute base URL so the client component can build the
  // public share link without guessing. Prefer the request's actual host
  // header; fall back to NEXTAUTH_URL for environments where it isn't set.
  const h = await headers()
  const host = h.get('host')
  const protocol = h.get('x-forwarded-proto') || (host?.startsWith('localhost') ? 'http' : 'https')
  const publicViewBaseUrl = host ? `${protocol}://${host}` : process.env.NEXTAUTH_URL || ''

  const report = quote.outputJson as unknown as FeeReport | null
  const totals = report ? computeTotals(report) : null
  const savingsAvg = totals
    ? Math.round((totals.estimatedSavingsLow + totals.estimatedSavingsHigh) / 2)
    : null

  const fullAddress =
    [quote.propertyAddress, quote.propertyCity, quote.propertyState, quote.propertyZip]
      .filter(Boolean)
      .join(', ') || 'Property TBD'

  const expired = new Date(quote.expiresAt) < new Date()

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />
      <main className="bg-gray-100 min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <TeammateTabs active="quotes" isBrokerMember={true} />

          <Link
            href="/teammate/quotes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-700 mb-4"
          >
            ← All quotes
          </Link>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">
                  Quote{quote.brokerCompany ? ` · ${quote.brokerCompany.name}` : ''}
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-dark-900">
                  {quote.borrowerName || quote.borrowerEmail || '(unnamed borrower)'}
                </h1>
                <div className="text-sm text-gray-500 mt-1">{fullAddress}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={quote.status} />
                {expired && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                    expired
                  </span>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-x-6 gap-y-2 mt-4 text-sm">
              <Field label="Borrower email" value={quote.borrowerEmail} />
              <Field label="Borrower phone" value={quote.borrowerPhone} />
              <Field label="Created" value={new Date(quote.createdAt).toLocaleDateString()} />
              <Field
                label="Created by"
                value={quote.brokerUser?.name || quote.brokerUser?.email || null}
              />
              <Field label="Expires" value={new Date(quote.expiresAt).toLocaleDateString()} />
              <Field
                label="Estimated savings (avg)"
                value={savingsAvg !== null ? formatCurrency(savingsAvg) : '—'}
              />
              <Field
                label="Verified company"
                value={
                  quote.brokerCompany?.verifiedAt
                    ? 'Yes'
                    : quote.brokerCompany
                    ? 'No (cannot convert)'
                    : 'Company unlinked'
                }
              />
            </div>

            {quote.convertedClosingId && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-baseline justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Converted
                    </div>
                    <div className="text-sm text-emerald-900">
                      This quote was converted into a real closing.
                    </div>
                  </div>
                  <a
                    href={`/teammate/dashboard/${quote.convertedClosingId}`}
                    className="text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    View file →
                  </a>
                </div>
              </div>
            )}

            <div className="mt-5 pt-5 border-t border-gray-100">
              <BrokerQuoteActions
                quoteId={quote.id}
                status={quote.status}
                shareToken={quote.shareToken}
                hasBorrowerEmail={Boolean(quote.borrowerEmail)}
                hasMinimumOrderFields={Boolean(
                  quote.borrowerName &&
                    quote.borrowerEmail &&
                    quote.propertyAddress &&
                    quote.propertyCity &&
                    quote.propertyState &&
                    quote.propertyZip,
                )}
                initial={{
                  borrowerName: quote.borrowerName,
                  borrowerEmail: quote.borrowerEmail,
                  borrowerPhone: quote.borrowerPhone,
                  propertyAddress: quote.propertyAddress,
                  propertyCity: quote.propertyCity,
                  propertyState: quote.propertyState,
                  propertyZip: quote.propertyZip,
                }}
                publicViewBaseUrl={publicViewBaseUrl}
                companyVerified={Boolean(quote.brokerCompany?.verifiedAt)}
                convertedClosingId={quote.convertedClosingId}
              />
            </div>
          </div>

          {report ? (
            <FeeReportTable report={report} />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-sm text-gray-500 text-center">
              No fee report stored on this quote.
            </div>
          )}

          {quote.events.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 mt-6 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-baseline justify-between">
                <h3 className="text-sm font-bold text-dark-900">
                  Recent activity ({quote.events.length})
                </h3>
                <span className="text-xs text-gray-500">Most recent first</span>
              </div>
              <ul className="divide-y divide-gray-100">
                {quote.events.map((e) => (
                  <li
                    key={e.id}
                    className="px-5 py-2.5 flex items-baseline justify-between gap-3 text-sm"
                  >
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                      {e.kind}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(e.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div className="text-sm font-semibold text-dark-900 break-words">{value || '—'}</div>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const palette: Record<string, string> = {
    draft: 'bg-amber-100 text-amber-800',
    sent: 'bg-blue-100 text-blue-800',
    viewed: 'bg-violet-100 text-violet-800',
    converted: 'bg-emerald-100 text-emerald-800',
    expired: 'bg-gray-100 text-gray-700',
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        palette[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  )
}

