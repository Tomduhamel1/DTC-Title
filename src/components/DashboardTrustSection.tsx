'use client'

import Image from 'next/image'

// Marketing section that previews the dashboard. The right column is a
// hand-rendered mockup of the two cards a customer cares most about during
// closing — the closing-progress timeline and their assigned escrow officer.
// We don't import the real dashboard components because (a) they require auth
// + Prisma and (b) we want fixed sample state (3 of 5 milestones, "Jamie Doe"
// assigned) regardless of who's viewing the marketing page.

const SAMPLE_OFFICER = {
  name: 'Jamie Doe',
  title: 'Senior Escrow Officer',
  email: 'jamie.doe@betterclose.co',
  phone: '(855) 555-0142',
  nmls: '2184593',
  // Tight face-area crop matches the dashboard photo styling.
  photoUrl:
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=512&h=512&fit=facearea&facepad=2.5',
}

interface SampleMilestone {
  label: string
  description: string
  status: 'done' | 'active' | 'pending'
  completedDate?: string
}

const SAMPLE_MILESTONES: SampleMilestone[] = [
  {
    label: 'Loan locked',
    description: 'Your lender finalizes your interest rate.',
    status: 'done',
    completedDate: '5/4/2026',
  },
  {
    label: 'Title ordered',
    description: 'Your lender or you placed the order with BetterClose.',
    status: 'done',
    completedDate: '5/4/2026',
  },
  {
    label: 'Title search complete',
    description: 'We confirm clean title — no liens, no surprises.',
    status: 'done',
    completedDate: '5/4/2026',
  },
  {
    label: 'Title issued',
    description: 'Title insurance is issued by an A-rated underwriter.',
    status: 'pending',
  },
  {
    label: 'Closed',
    description: 'Funds disbursed. Keys handed over. Done.',
    status: 'pending',
  },
]

export default function DashboardTrustSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm font-bold mb-4">
              ✓ Real people. Real-time progress.
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-5 leading-tight">
              A real person handles your closing.
              <br />
              <span className="text-primary-600">You watch every step from one dashboard.</span>
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              You&apos;re not buying a service from a faceless company. The moment your order
              opens, you&apos;ll meet the dedicated escrow officer who owns your closing — and a
              live dashboard where every milestone, every contact, and every fee is one click
              away.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-dark-900 text-lg leading-tight">
                    A dedicated escrow officer
                  </div>
                  <div className="text-gray-600 mt-0.5">
                    Same person, start to finish. You&apos;ll know their name, see their face, and
                    have their direct line.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-dark-900 text-lg leading-tight">
                    Live progress tracking
                  </div>
                  <div className="text-gray-600 mt-0.5">
                    Every milestone — loan lock, title search, issuance, closing — checked off in
                    real time. No more wondering where your file stands.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-dark-900 text-lg leading-tight">
                    Human support, whenever
                  </div>
                  <div className="text-gray-600 mt-0.5">
                    Email, text, or call. Most replies in under 2 hours, Monday through Friday.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Dashboard mockup */}
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}

function DashboardMockup() {
  const doneCount = SAMPLE_MILESTONES.filter((m) => m.status === 'done').length

  return (
    <div className="relative">
      {/* Browser-chrome frame to read as a screenshot */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
          <span className="ml-3 text-[11px] text-gray-500 font-medium">
            betterclose.co/dashboard
          </span>
        </div>

        <div className="bg-gray-50 p-4 sm:p-5 grid grid-cols-[1fr_180px] gap-4">
          {/* Closing Progress card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 text-emerald-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h3 className="text-sm font-bold text-dark-900">Closing Progress</h3>
            </div>

            <div className="px-5 py-4">
              <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-gray-500">
                    Closing progress
                  </div>
                  <div className="text-base font-black text-dark-900 leading-tight">
                    {doneCount} of {SAMPLE_MILESTONES.length} milestones complete
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Target close
                  </div>
                  <div className="text-sm font-bold text-dark-900">May 8, 2026</div>
                </div>
              </div>

              <ol className="space-y-3 relative">
                <div className="absolute left-[10px] top-2 bottom-2 w-0.5 bg-gray-200" />
                <div
                  className="absolute left-[10px] top-2 w-0.5 bg-emerald-500"
                  style={{ height: `${(doneCount / SAMPLE_MILESTONES.length) * 100}%` }}
                />
                {SAMPLE_MILESTONES.map((m) => (
                  <li key={m.label} className="relative pl-9">
                    <div className="absolute left-0 top-0">
                      <StatusDot status={m.status} />
                    </div>
                    <div
                      className={`text-[12px] leading-tight font-semibold ${
                        m.status === 'pending' ? 'text-gray-400' : 'text-dark-900'
                      }`}
                    >
                      {m.label}
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 leading-snug ${
                        m.status === 'pending' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {m.description}
                    </div>
                    {m.status === 'done' && m.completedDate && (
                      <div className="text-[9px] text-emerald-700 font-semibold mt-0.5">
                        ✓ Completed {m.completedDate}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right rail mini cards */}
          <div className="space-y-4">
            {/* Escrow Officer card */}
            <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm">
              <div className="text-[8px] font-bold uppercase tracking-[0.18em] text-emerald-700 mb-3">
                Your closing officer
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 ring-4 ring-emerald-50 mb-2">
                  <Image
                    src={SAMPLE_OFFICER.photoUrl}
                    alt={SAMPLE_OFFICER.name}
                    width={80}
                    height={80}
                    className="object-cover object-[center_30%] w-full h-full"
                    unoptimized
                  />
                </div>
                <div className="font-bold text-dark-900 text-[12px] leading-tight">
                  {SAMPLE_OFFICER.name}
                </div>
                <div className="text-[10px] text-gray-500 leading-tight mt-0.5">
                  {SAMPLE_OFFICER.title}
                </div>
                <div className="text-[8px] text-gray-400 mt-0.5">NMLS #{SAMPLE_OFFICER.nmls}</div>
              </div>
              <div className="mt-3 space-y-1 text-[10px] text-center">
                <div className="text-emerald-700 font-medium truncate">
                  {SAMPLE_OFFICER.email}
                </div>
                <div className="text-gray-700 font-medium">{SAMPLE_OFFICER.phone}</div>
              </div>
            </div>

            {/* Need help mini card */}
            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">
                  💬
                </span>
                <div>
                  <div className="text-[11px] font-black text-dark-900 leading-tight">
                    Need help?
                  </div>
                  <div className="text-[9px] text-gray-600 leading-tight">
                    Every step of the way.
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 mt-2">
                <div className="px-2 py-1.5 rounded-md bg-white border border-gray-200 text-[9px]">
                  <div className="font-semibold text-gray-500 uppercase tracking-wider text-[7px]">
                    Email
                  </div>
                  <div className="text-dark-900 font-medium truncate">hello@betterclose.co</div>
                </div>
                <div className="px-2 py-1.5 rounded-md bg-white border border-gray-200 text-[9px]">
                  <div className="font-semibold text-gray-500 uppercase tracking-wider text-[7px]">
                    Call
                  </div>
                  <div className="text-dark-900 font-medium">(855) 555-SAVE</div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[8px] font-semibold text-emerald-900">
                  We&apos;re here now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusDot({ status }: { status: 'done' | 'active' | 'pending' }) {
  if (status === 'done') {
    return (
      <span className="relative inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    )
  }
  if (status === 'active') {
    return (
      <span className="relative inline-flex items-center justify-center w-5 h-5 rounded-full bg-white border-2 border-emerald-500">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
      </span>
    )
  }
  return (
    <span className="inline-block w-5 h-5 rounded-full bg-white border-2 border-gray-300" />
  )
}
