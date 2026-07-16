import Link from 'next/link'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import UnderwriterLogos from '@/components/UnderwriterLogos'
import DashboardTrustSection from '@/components/DashboardTrustSection'
import RotatingSavingsPill from '@/components/RotatingSavingsPill'
import { formatCurrency } from '@/lib/feeReport'
import { estimateCostBasis, estimateSavings } from '@/lib/stateSavings'

// Example-card numbers derive from the shared savings model (national
// anchor, $500k purchase) so this page can never drift from the hero or the
// quote flow. Recompute happens at render; regenerating the anchor table
// updates this copy automatically.
const EXAMPLE_SAVINGS = estimateSavings(500000, 'purchase', null)
const EXAMPLE_BASIS = estimateCostBasis(500000, 'purchase', null)

export const metadata = {
  title: 'BetterClose · For Real Estate Agents',
  description:
    "Help your buyer lower closing costs and keep the closing on track. Whether you're opening title, coordinating escrow, or giving your buyer options — a lower-cost title and settlement option, trusted closing support, and live file visibility.",
}

// Public, ungated estimate flow. ?source=realtor preserves attribution; the
// quote/results/working pages only special-case source=broker, so realtor falls
// through to the neutral borrower experience today — and we can add
// realtor-specific behavior later without changing this CTA.
const PUBLIC_QUOTE_HREF = '/quote?source=realtor'
const SIGN_IN_HREF = '/login?callbackUrl=/teammate/dashboard'

// Company-credibility stats for the trust band — same values used across the
// site. Labels are audience-neutral; "Closing coverage" (not "licensed
// nationally") because the 50-state figure includes workshare states.
const AGENT_TRUST_STATS = [
  { value: '30,000+', label: 'Closings completed' },
  { value: 'A-rated', label: 'Underwriters only' },
  { value: '50 states', label: 'Closing coverage' },
] as const

// Outline-style icons (w-6) for the reason cards. Inline SVGs keep parity with
// the rest of the site (no icon-lib dependency). Copied from for-brokers.
const ICONS = {
  cash: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  bolt: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  receipt: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h6m0 0l-3-3m3 3l-3 3M5 19a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v4" />
    </svg>
  ),
  pin: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  workflow: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h11M4 12h11M4 18h7m5-2l3 3m0 0l3-3m-3 3V8" />
    </svg>
  ),
  gear: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  scroll: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
}

export default function RealtorsPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationCredible />
      <div className="h-20" />

      {/* 1. Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-bold mb-4">
                FOR REAL ESTATE AGENTS
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-dark-900 mb-5 leading-tight">
                Help your buyer lower closing costs —{' '}
                <span className="text-primary-600">and keep the closing on track.</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Whether you&apos;re opening title, coordinating escrow, or giving your
                buyer options, BetterClose gives you a lower-cost title and settlement
                option backed by trusted closing support and live file visibility.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link
                  href={PUBLIC_QUOTE_HREF}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  Get estimate
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href={SIGN_IN_HREF}
                  className="text-base font-semibold text-primary-700 hover:underline whitespace-nowrap"
                >
                  Sign in
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                No login required. See your buyer&apos;s estimate in under a minute.
              </p>
            </div>

            {/* Right cell: example savings card + rotating "that's enough for"
                pill, wrapped in ONE div so the pill forms part of the same grid
                column rather than becoming a stray third grid item.
                Numbers come from the shared savings model (EXAMPLE_* above) —
                the same national $500k-purchase anchor the homepage hero shows. */}
            <div>
            <div className="bg-white rounded-2xl shadow-2xl p-7 border border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-5">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
                  Example buyer savings
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  · Illustrative
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-center">
                  <div className="text-3xl font-black text-emerald-700 leading-none">{formatCurrency(EXAMPLE_SAVINGS.saveAtClosing)}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/80 mt-1.5">
                    Save at closing
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-center">
                  <div className="text-3xl font-black text-emerald-700 leading-none">{formatCurrency(EXAMPLE_SAVINGS.saveOverLoan)}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/80 mt-1.5">
                    Save over the loan
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-600">BetterClose estimate</span>
                  <span className="text-sm font-bold text-dark-900">{formatCurrency(EXAMPLE_BASIS.ourTotal)}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-400">Comparable option</span>
                  <span className="text-sm font-semibold text-gray-400 line-through decoration-gray-300">{formatCurrency(EXAMPLE_BASIS.typicalTotal)}</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed mt-4">
                Example purchase only — not a quote or guarantee. Actual savings
                depend on your buyer&apos;s loan, property, and location.
              </p>
            </div>

            {/* Rotating "that's enough for" pill, anchored to the over-the-loan
                figure so the items scale with the number shown. */}
            <RotatingSavingsPill savings={EXAMPLE_SAVINGS.saveOverLoan} tail="back in your buyer's pocket" className="mt-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 1.5. Trust band — "who are these guys?" answered with company volume and
          credentials. Underwriter logos (below) cover underwriter backing. */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-8">
            The settlement partner behind your file
          </div>
          <div className="grid grid-cols-3 gap-px bg-gray-100 rounded-3xl overflow-hidden border border-gray-200">
            {AGENT_TRUST_STATS.map((s) => (
              <div key={s.label} className="bg-white p-6">
                <div className="text-3xl md:text-4xl font-black text-dark-900 leading-none mb-1">
                  {s.value}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-6">
            A-rated underwriters only · Directly licensed in 34 states; remaining states through licensed workshare partners · a division of First National Title &amp; Escrow.
          </p>
        </div>
      </section>

      {/* 1.75. Agent portal / workflow — agents open, route, and track files;
          not just refer. Modeled on the broker dashboard-visualization section. */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
            <div>
              <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm font-bold mb-4">
                ✓ Live in the agent dashboard
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-5 leading-tight">
                Your purchase files,{' '}
                <span className="text-primary-600">in one place.</span>
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Open a file, track title and settlement milestones, and see what&apos;s
                waiting on the buyer, lender, seller, or closing team — without chasing
                escrow for status updates.
              </p>
              <ul className="space-y-3 mb-8">
                <FeatureBullet>Start a title and settlement estimate for a buyer.</FeatureBullet>
                <FeatureBullet>Open the file when your buyer is ready.</FeatureBullet>
                <FeatureBullet>Upload the contract or file details.</FeatureBullet>
                <FeatureBullet>Track title, escrow, signing, funding, and recording milestones.</FeatureBullet>
                <FeatureBullet>See what&apos;s waiting on the buyer, lender, seller, or closing team.</FeatureBullet>
                <FeatureBullet>Use email fallback when that&apos;s easier.</FeatureBullet>
              </ul>
            </div>

            <AgentDashboardMockup />
          </div>
        </div>
      </section>

      {/* 2. Real people / live status — the agent's "stop chasing title" message */}
      <DashboardTrustSection />

      {/* 3. Underwriter trust strip */}
      <UnderwriterLogos />

      {/* 4. Why agents work with BetterClose */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-dark-900 mb-3">Why agents work with BetterClose</h2>
            <p className="text-lg text-gray-600">
              A better closing for your buyer — and a smoother deal for you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <ReasonCard
              icon={ICONS.cash}
              title="Lower buyer cash to close"
              body="Lower title and settlement costs mean your buyer keeps more at closing — real help for first-timers covering movers and furniture."
            />
            <ReasonCard
              icon={ICONS.bolt}
              title="Trusted closing support"
              body="An experienced settlement team and A-rated underwriters behind every file, so the closing goes smoothly and your deal stays on track."
            />
            <ReasonCard
              icon={ICONS.pin}
              title="Track the file without chasing escrow"
              body="Live milestone status — title, escrow, signing, funding, recording — so you always know where the file stands without emailing for updates."
            />
            <ReasonCard
              icon={ICONS.workflow}
              title="Open or route title when the deal is ready"
              body="Open the file yourself or send the order to our settlement team — through the portal or by email, whichever fits your workflow."
            />
            <ReasonCard
              icon={ICONS.receipt}
              title="Works with the buyer's lender"
              body="We coordinate with the lender your buyer chooses."
            />
          </div>
        </div>
      </section>

      {/* 5. Credibility — defensible savings (agent-voiced) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-dark-900 mb-3 leading-tight">
              Savings your buyer can actually see
            </h2>
            <p className="text-lg text-gray-600">
              No inflated comparisons. No fake savings on pass-through fees.
            </p>
          </div>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            BetterClose is built to be compared against real quotes, not inflated
            estimates. We price the parts of title and settlement we can control more
            competitively, and clearly separate government fees, recording charges,
            transfer taxes, and lender-required third-party costs.
          </p>
        </div>
      </section>

      {/* 6. Where the savings come from */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-dark-900 mb-3">
              Where the savings come from
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <ReasonCard
              icon={ICONS.gear}
              title="Lower settlement fees"
              body="Settlement, processing, wire, and closing-related services priced more competitively."
            />
            <ReasonCard
              icon={ICONS.scroll}
              title="Lower title-related charges where permitted"
              body="We price the parts of title we can control more competitively and pass those savings to your buyer."
            />
            <ReasonCard
              icon={ICONS.receipt}
              title="Pass-through fees clearly labeled"
              body="Recording fees, transfer taxes, and lender-required third-party costs are passed through and shown line by line."
            />
          </div>

          {/* Already have a title company? Invite the comparison. */}
          <div className="max-w-3xl mx-auto mt-10 bg-white border border-gray-200 rounded-2xl shadow-sm p-7">
            <h3 className="text-2xl font-black text-dark-900 mb-2">
              Already have a title company you use?
            </h3>
            <p className="text-base text-gray-700 leading-relaxed mb-5">
              Put BetterClose next to it. If we&apos;re lower, you have another option for
              your buyer. If we&apos;re not, you still have a clear comparison.
            </p>
            <Link
              href={PUBLIC_QUOTE_HREF}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-base px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow"
            >
              Get an estimate
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <FooterComprehensive />
    </div>
  )
}

function ReasonCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode
  title: string
  body: string
}) {
  return (
    <div className="text-center md:text-left">
      <div
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 mb-3"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold text-dark-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
    </div>
  )
}

function FeatureBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="text-base text-gray-800 leading-relaxed">{children}</div>
    </li>
  )
}

// Inline visual mockup of the agent portal dashboard. Sample data is hard-coded
// so it reads like a screenshot — no fetch, no real auth. Agent-flavored (files,
// milestones, "waiting on" status) — distinct from the broker quote pipeline.
function AgentDashboardMockup() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Browser chrome */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-yellow-400" />
        <span className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-3 text-[11px] text-gray-500 font-medium">betterclose.co/teammate/pipeline</span>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 flex items-end gap-1">
        <MockTab label="Files" active />
        <MockTab label="Pipeline" />
        <MockTab label="Estimates" />
      </div>

      <div className="grid md:grid-cols-[1.6fr_1fr] divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-gray-50">
        {/* Center: file rows */}
        <div className="p-4 sm:p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">
            Agent Portal
          </div>
          <div className="text-base font-black text-dark-900 mb-4">Your files</div>

          <div className="space-y-2.5">
            <MockRow
              property="14 Birch Ct"
              status="Closing this week"
              statusTone="emerald"
              detail="Signing scheduled"
              cta={null}
              progress={{ done: 4, total: 5 }}
            />
            <MockRow
              property="88 Pine Ave"
              status="Active"
              statusTone="violet"
              detail="Title search"
              cta={null}
              progress={{ done: 2, total: 5 }}
            />
            <MockRow
              property="123 Oak St"
              status="Waiting on buyer"
              statusTone="amber"
              detail="Awaiting signed contract"
              cta="Open file"
              progress={{ done: 0, total: 5 }}
            />
          </div>
        </div>

        {/* Right: summary */}
        <div className="p-4 sm:p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">
            This month
          </div>
          <div className="space-y-3">
            <SummaryRow label="Active files" value="6" tone="emerald" />
            <SummaryRow label="Closing this week" value="2" tone="amber" />
            <SummaryRow label="Awaiting buyer" value="3" tone="violet" />
            <SummaryRow label="Recorded" value="11" />
          </div>
          <div className="mt-5 pt-4 border-t border-gray-200 text-[10px] text-gray-400 italic leading-relaxed">
            Sample data. Real files appear once you open your first one.
          </div>
        </div>
      </div>
    </div>
  )
}

function MockTab({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`px-3 py-2.5 text-xs font-bold border-b-2 -mb-px ${
        active ? 'text-emerald-700 border-emerald-600' : 'text-gray-500 border-transparent'
      }`}
    >
      {label}
    </div>
  )
}

interface MockRowProps {
  property: string
  status: string
  statusTone: 'violet' | 'emerald' | 'amber'
  detail: string
  cta: string | null
  progress: { done: number; total: number } | null
}

function MockRow({ property, status, statusTone, detail, cta, progress }: MockRowProps) {
  const toneClasses: Record<MockRowProps['statusTone'], string> = {
    violet: 'bg-violet-50 text-violet-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-800',
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-3 py-3">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <span
              className={`inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${toneClasses[statusTone]}`}
            >
              {status}
            </span>
          </div>
          <div className="text-[13px] font-bold text-dark-900 leading-tight">{property}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">{detail}</div>
        </div>
        {cta && (
          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-600 text-white">
              {cta} →
            </span>
          </div>
        )}
      </div>
      {progress && (
        <div className="mt-2.5">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: progress.total }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i < progress.done ? 'bg-emerald-500' : 'bg-gray-200'}`}
              />
            ))}
            <span className="text-[10px] font-bold tabular-nums text-gray-500 ml-1.5 whitespace-nowrap">
              {progress.done} / {progress.total}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone?: 'violet' | 'emerald' | 'amber'
}) {
  const valueColor =
    tone === 'violet'
      ? 'text-violet-700'
      : tone === 'emerald'
      ? 'text-emerald-700'
      : tone === 'amber'
      ? 'text-amber-700'
      : 'text-dark-900'
  return (
    <div className="flex items-baseline justify-between gap-2">
      <div className="text-[11px] text-gray-600">{label}</div>
      <div className={`text-xl font-black tabular-nums ${valueColor}`}>{value}</div>
    </div>
  )
}
