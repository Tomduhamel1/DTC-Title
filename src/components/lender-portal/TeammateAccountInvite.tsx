import Link from 'next/link'

// Soft, non-blocking pitch on /for-my-team: create a free account to track
// every BetterClose file you're on. Lives just above the footer.
//
// Renders a static mockup of what the teammate dashboard will look like —
// re-uses the browser-chrome pattern from DashboardTrustSection. No real
// auth/DB; sample data is hard-coded so it reads like a screenshot.

const SAMPLE_FILES = [
  {
    role: 'Lender',
    address: '4218 Cedar Lake Dr, Austin, TX 78704',
    borrower: 'sarah.chen@example.com',
    status: 'Title search complete',
    closingDate: 'May 14',
    progress: 0.6,
  },
  {
    role: 'Realtor',
    address: '900 N Lake Shore Dr #2401, Chicago, IL 60611',
    borrower: 'mike.alvarez@example.com',
    status: 'Loan locked',
    closingDate: 'May 22',
    progress: 0.4,
  },
  {
    role: 'Lender',
    address: '1840 Vermont Ave, Brooklyn, NY 11207',
    borrower: 'jordan.kim@example.com',
    status: 'Order received',
    closingDate: 'Jun 03',
    progress: 0.2,
  },
]

interface TeammateAccountInviteProps {
  /**
   * The current ?ref= from the URL, threaded into the signup link so we can
   * retroactively bind this LenderRequest to the new account on first
   * sign-in.
   */
  refId?: string
}

export default function TeammateAccountInvite({ refId }: TeammateAccountInviteProps) {
  const callbackUrl = '/teammate/dashboard'
  const signupHref = refId
    ? `/login?callbackUrl=${encodeURIComponent(`${callbackUrl}?claim=${refId}`)}`
    : `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm font-bold mb-4">
              ✓ Free for teammates
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-5 leading-tight">
              Track every BetterClose file you&apos;re on{' '}
              <span className="text-primary-600">— in one place.</span>
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              We auto-link every file where you&apos;re named as the lender, broker, or
              realtor. No setup. No commitment. Just sign in with your work email.
            </p>

            <ul className="space-y-4 mb-8">
              <Bullet>Live milestones for each of your active files</Bullet>
              <Bullet>Mute updates per client when you don&apos;t need them</Bullet>
              <Bullet>Direct line to the escrow officer assigned to each file</Bullet>
            </ul>

            <Link
              href={signupHref}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Create my free account →
            </Link>
            <p className="text-xs text-gray-500 mt-3">Takes 30 seconds. No commitment.</p>
          </div>

          {/* Right: mockup */}
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <div className="flex-shrink-0 w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
        <svg
          className="w-4 h-4 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="text-base text-gray-800 font-medium">{children}</div>
    </li>
  )
}

function DashboardMockup() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* browser chrome */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-3 text-[11px] text-gray-500 font-medium">
          betterclose.co/teammate/dashboard
        </span>
      </div>

      <div className="bg-gray-50 p-4 sm:p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">
          Team Dashboard
        </div>
        <div className="text-base font-black text-dark-900 mb-4">Your BetterClose files</div>

        <div className="space-y-2">
          {SAMPLE_FILES.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 px-3 py-3 flex items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="inline-block bg-emerald-50 text-emerald-700 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                    {f.role}
                  </span>
                </div>
                <div className="text-[12px] font-bold text-dark-900 leading-tight truncate">
                  {f.address}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5 truncate">{f.borrower}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                  Status
                </div>
                <div className="text-[11px] font-bold text-dark-900">{f.status}</div>
                <div className="text-[9px] text-gray-500 mt-0.5">Close {f.closingDate}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-[10px] text-gray-400 text-center italic">
          Mute toggles, milestone history, and escrow officer details on each file&apos;s detail page.
        </div>
      </div>
    </div>
  )
}
