import Link from 'next/link'
import { redirect } from 'next/navigation'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import TeammateTabs from '@/components/teammate/TeammateTabs'
import { requireUser, requireBrokerMember } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { computeTotals, type FeeReport } from '@/lib/feeReport'

// Broker quote list page. Replaces the PR 4 placeholder. Shows quotes the
// current broker user has created, most recent first.
//
// User-scoped only — does NOT yet show other company members' quotes.
// Adding company-scoped visibility later is purely additive (broaden the
// where clause) and won't break this contract.

export const dynamic = 'force-dynamic'

export default async function TeammateQuotesPage() {
  const user = await requireUser()
  if (!user) redirect('/login?callbackUrl=/teammate/quotes')

  const ctx = await requireBrokerMember()
  if (!ctx) redirect('/teammate/dashboard')

  // Company-scoped: every quote at any of this broker's BrokerCompanies,
  // regardless of which co-member created it. The "Created by" column tells
  // the broker who originated each quote in multi-member companies.
  const companyIds = ctx.memberships.map((m) => m.companyId)
  const quotes = await prisma.feeQuote.findMany({
    where: { brokerCompanyId: { in: companyIds } },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      borrowerName: true,
      borrowerEmail: true,
      propertyAddress: true,
      propertyCity: true,
      propertyState: true,
      createdAt: true,
      expiresAt: true,
      outputJson: true,
      brokerCompany: { select: { name: true } },
      brokerUser: { select: { id: true, name: true, email: true } },
    },
  })

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />
      <main className="bg-gray-100 min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <TeammateTabs active="quotes" isBrokerMember={true} />

          <div className="mb-6 flex items-baseline justify-between flex-wrap gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">
                Broker Portal
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-dark-900">Quotes</h1>
              <div className="text-sm text-gray-500 mt-1">
                Quotes you&apos;ve prepared for your borrowers.
              </div>
            </div>
            <Link
              href="/teammate/quotes/new"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700"
            >
              + New quote
            </Link>
          </div>

          {quotes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="text-left px-5 py-2.5 font-bold">Borrower</th>
                      <th className="text-left px-5 py-2.5 font-bold">Property</th>
                      <th className="text-left px-5 py-2.5 font-bold">Status</th>
                      <th className="text-left px-5 py-2.5 font-bold">Savings est.</th>
                      <th className="text-left px-5 py-2.5 font-bold">Created by</th>
                      <th className="text-left px-5 py-2.5 font-bold">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {quotes.map((q) => {
                      const savings = savingsFromOutputJson(q.outputJson)
                      const property = [q.propertyAddress, q.propertyCity, q.propertyState]
                        .filter(Boolean)
                        .join(', ') || <span className="text-gray-400 italic">not set</span>
                      const createdBy =
                        q.brokerUser?.name ||
                        q.brokerUser?.email ||
                        <span className="text-gray-400 italic">unlinked</span>
                      return (
                        <tr key={q.id} className="hover:bg-gray-50">
                          <td className="px-5 py-3">
                            <Link
                              href={`/teammate/quotes/${q.id}`}
                              className="font-semibold text-dark-900 hover:text-emerald-700"
                            >
                              {q.borrowerName || q.borrowerEmail || '(unnamed borrower)'}
                            </Link>
                            {q.borrowerName && q.borrowerEmail && (
                              <div className="text-xs text-gray-500">{q.borrowerEmail}</div>
                            )}
                          </td>
                          <td className="px-5 py-3 text-gray-700 truncate max-w-[260px]">{property}</td>
                          <td className="px-5 py-3">
                            <StatusPill status={q.status} />
                          </td>
                          <td className="px-5 py-3 tabular-nums text-gray-700">
                            {savings ? formatRange(savings.low, savings.high) : '—'}
                          </td>
                          <td className="px-5 py-3 text-gray-700 text-xs truncate max-w-[180px]">
                            {createdBy}
                          </td>
                          <td className="px-5 py-3 text-gray-500 text-xs">
                            {new Date(q.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
      <h2 className="text-xl font-black text-dark-900 mb-2">No quotes yet</h2>
      <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
        Generate your first quote — enter the borrower and property, and we&apos;ll freeze
        the savings figure you can share with them.
      </p>
      <Link
        href="/teammate/quotes/new"
        className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700"
      >
        + New quote
      </Link>
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

function savingsFromOutputJson(o: unknown): { low: number; high: number } | null {
  if (!o || typeof o !== 'object') return null
  try {
    const totals = computeTotals(o as FeeReport)
    // Single conservative figure (formatRange collapses low===high) — same
    // "Save at closing" number shown on the quote detail and public view.
    return { low: totals.estimatedSavings, high: totals.estimatedSavings }
  } catch {
    return null
  }
}

function formatRange(low: number, high: number): string {
  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  if (low === high) return fmt(low)
  return `${fmt(low)} – ${fmt(high)}`
}
