import { redirect } from 'next/navigation'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import TeammateTabs from '@/components/teammate/TeammateTabs'
import { requireUser, requireBrokerMember } from '@/lib/auth/session'

// Placeholder broker pipeline page. Real pipeline view (broker-attributed
// closings, status buckets, milestone counts) arrives in a later PR.
//
// Access rules: same as /teammate/quotes — see that file's header for details.

export const dynamic = 'force-dynamic'

export default async function TeammatePipelinePage() {
  const sessionUser = await requireUser()
  if (!sessionUser) {
    redirect('/login?callbackUrl=/teammate/pipeline')
  }

  const ctx = await requireBrokerMember()
  if (!ctx) {
    redirect('/teammate/dashboard')
  }

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />
      <main className="bg-gray-100 min-h-[calc(100vh-5rem)] py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <TeammateTabs active="pipeline" isBrokerMember={true} />

          <div className="mb-8">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">
              Broker Portal
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-dark-900">Pipeline</h1>
            <div className="text-sm text-gray-500 mt-1">
              Closings where you&apos;re the placing broker, grouped by status.
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
                  d="M9 17v-2a4 4 0 014-4h4m-4 4l4-4-4-4m0 8h-7a4 4 0 01-4-4V5"
                />
              </svg>
            </div>
            <h2 className="text-xl font-black text-dark-900 mb-2">
              Your pipeline will appear here
            </h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Once you convert a quote into a closing — or TPS attributes a new file
              to you — it will show up in this pipeline view, grouped by milestone
              progress.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              In the meantime, every file you&apos;re named on is visible under{' '}
              <a href="/teammate/dashboard" className="underline text-emerald-700">
                Files
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <FooterComprehensive />
    </>
  )
}
