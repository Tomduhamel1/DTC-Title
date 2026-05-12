import { redirect } from 'next/navigation'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import TeammateTabs from '@/components/teammate/TeammateTabs'
import { requireUser, requireBrokerMember } from '@/lib/auth/session'

// Placeholder broker quotes page. Real quote creation arrives in a later PR.
// Access rules:
//   - unauthenticated         → /login?callbackUrl=/teammate/quotes
//   - signed-in, no membership → /teammate/dashboard (no broker access)
//   - broker member            → renders the empty state below

export const dynamic = 'force-dynamic'

export default async function TeammateQuotesPage() {
  const sessionUser = await requireUser()
  if (!sessionUser) {
    redirect('/login?callbackUrl=/teammate/quotes')
  }

  const ctx = await requireBrokerMember()
  if (!ctx) {
    // Authenticated but not a broker member — back to the regular teammate
    // dashboard. They have legitimate teammate access; just nothing here.
    redirect('/teammate/dashboard')
  }

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />
      <main className="bg-gray-100 min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <TeammateTabs active="quotes" isBrokerMember={true} />

          <div className="mb-8">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">
              Broker Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-dark-900">Quotes</h1>
            <div className="text-sm text-gray-500 mt-1">
              Quotes you&apos;ve prepared for your borrowers.
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-black text-dark-900 mb-2">
              Quotes will appear here
            </h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Quote creation is coming soon. Once available, every fee estimate you
              prepare for a borrower will be listed here so you can resend, convert
              to a closing, or follow up on it.
            </p>
          </div>
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}
