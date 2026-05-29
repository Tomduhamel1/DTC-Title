import Link from 'next/link'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import TeammateTabs from '@/components/teammate/TeammateTabs'
import BrokerQuoteNewClient from '@/components/teammate/BrokerQuoteNewClient'
import { requireUser, requireBrokerMember } from '@/lib/auth/session'

// New broker quote page. Renders the BrokerQuoteForm client component
// pre-loaded with the broker's company memberships (so a single-company
// broker doesn't see a picker).

export const dynamic = 'force-dynamic'

export default async function TeammateQuoteNewPage() {
  const user = await requireUser()
  if (!user) redirect('/login?callbackUrl=/teammate/quotes/new')

  const ctx = await requireBrokerMember()
  if (!ctx) redirect('/teammate/dashboard')

  const companies = ctx.memberships.map((m) => ({
    id: m.companyId,
    name: m.companyName,
  }))

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

          <div className="mb-6">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">
              Broker Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-dark-900">New quote</h1>
            <div className="text-sm text-gray-500 mt-1">
              Enter the borrower and property. We&apos;ll freeze the savings figure into a
              draft you can review before sending.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <Suspense fallback={<div className="text-sm text-gray-500 text-center py-10">Loading…</div>}>
              <BrokerQuoteNewClient companies={companies} />
            </Suspense>
          </div>
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}
