import Link from 'next/link'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import UnderwriterLogos from '@/components/UnderwriterLogos'
import RotatingSavingsPill from '@/components/RotatingSavingsPill'
import { formatCurrency } from '@/lib/feeReport'
import { estimateCostBasis, estimateSavings } from '@/lib/stateSavings'

// Example-card numbers derive from the shared savings model (national
// anchor, $500k purchase) — identical to the realtor page and the homepage
// hero, so no surface can drift from another.
const EXAMPLE_SAVINGS = estimateSavings(500000, 'purchase', null)
const EXAMPLE_BASIS = estimateCostBasis(500000, 'purchase', null)

export const metadata = {
  title: 'BetterClose · For Mortgage Brokers & Loan Officers',
  description:
    'Give your borrower a lower-cost closing without adding work to your file — lower title and settlement costs, real closing support, and live file visibility. A co-branded borrower page is available when you want it.',
}

const SIGN_IN_HREF = '/login?callbackUrl=/teammate/dashboard'
// Public, ungated quote/savings test. No login required.
// ?source=broker tags the flow so /quote/results renders broker-context CTAs
// (Send to my borrower / Open a closing) instead of generic borrower CTAs.
const PUBLIC_QUOTE_HREF = '/quote?source=broker'
// Broker-only quote builder (co-branding, save, send, convert). Gated.
const CREATE_BROKER_QUOTE_HREF = '/login?callbackUrl=/teammate/quotes/new'

const REQUEST_ACCESS_BODY = `Hi BetterClose team,

We'd like to request access to the broker/LO portal.

Company name:
NPN:
State licenses:
Approximate monthly closings:
How you found us:

Thanks,`

const REQUEST_ACCESS_HREF = `mailto:partners@betterclose.co?subject=${encodeURIComponent(
  'Broker portal access request',
)}&body=${encodeURIComponent(REQUEST_ACCESS_BODY)}`

const EMAIL_ORDER_BODY = `Hi BetterClose team,

Please open a new title file:

Borrower(s):
Property address:
City, State, Zip:
Estimated closing date:
Loan amount:
Transaction type: (purchase / refinance)
Sale price (if purchase):

Broker / loan officer name:
Company:
Phone:
NMLS:

Anything else we should know:

Thanks,`

const EMAIL_ORDER_HREF = `mailto:orders@betterclose.co?subject=${encodeURIComponent(
  'New title order',
)}&body=${encodeURIComponent(EMAIL_ORDER_BODY)}`

const COMPANY_INFO_REQUEST_HREF = `mailto:orders@betterclose.co?subject=${encodeURIComponent(
  'BetterClose company info request',
)}`

// Broker-framed credibility stats. Values match the borrower TrustStripSection
// (src/components/TrustStripSection.tsx); labels are written for a broker
// audience. "Closing coverage" (not "Licensed nationally") because the 50-state
// figure includes workshare states — see the footnote and FooterComprehensive.
const BROKER_TRUST_STATS = [
  { value: '30,000+', label: 'Closings completed' },
  { value: 'A-rated', label: 'Underwriters only' },
  { value: '50 states', label: 'Closing coverage' },
] as const

// Outline-style icons sized to fit OrderTile (w-5) and ReasonCard (w-6)
// emerald/primary tinted backgrounds. Inline SVGs keep parity with the rest
// of the site (no icon-lib dependency).
const iconClass = 'w-5 h-5'
const ICONS = {
  // OrderTile (4 of them)
  dashboard: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  envelope: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  workflow: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h11M4 12h11M4 18h7m5-2l3 3m0 0l3-3m-3 3V8" />
    </svg>
  ),
  clipboard: (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  // ReasonCard (5) — slightly larger (w-6) reads better in the card layout
  cash: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  chartDown: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
  ),
  document: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  bolt: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  scale: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  pin: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  // "Where the savings come from" (3)
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
  receipt: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h6m0 0l-3-3m3 3l-3 3M5 19a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v4" />
    </svg>
  ),
}

export default function BrokersPage() {
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
                FOR MORTGAGE BROKERS &amp; LOAN OFFICERS
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-dark-900 mb-5 leading-tight">
                Give your borrower a lower-cost closing{' '}
                <span className="text-primary-600">without adding work to your file.</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                BetterClose helps you offer lower title and settlement costs, backed by
                real closing support, trusted underwriters, and live file visibility.
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
                No login required. Create an account when you&apos;re ready to send or open a closing.
              </p>
            </div>

            {/* Right grid cell: savings card + the "this buys" pill beneath it,
                wrapped together so they form ONE column (otherwise the pill
                becomes a third grid item and wraps to the next row). */}
            <div>
            {/* Savings summary card — clean financial summary, NOT a CTA. The
                only large green element in the hero is the primary button; this
                card uses light surfaces with green number accents. The two
                savings figures (at closing / over the loan) carry the emphasis.
                Figures come from the shared savings model (EXAMPLE_* above). */}
            <div className="bg-white rounded-2xl shadow-2xl p-7 border border-gray-200">
              <div className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">
                Example borrower savings
              </div>

              {/* Two equal savings cards — the primary emphasis */}
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

              {/* Rotating payoff pill directly under the savings figures —
                  same placement as the homepage hero. */}
              <RotatingSavingsPill savings={EXAMPLE_SAVINGS.saveOverLoan} tail="back in your borrower's pocket" className="mt-4" />

              {/* Smaller comparison row */}
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
                Example purchase shown. Actual quote uses the borrower&apos;s loan, property, and location.
              </p>
            </div>

            </div>
          </div>
        </div>
      </section>

      {/* 1.5. Trust band — "who are these guys?" answered with company volume
          and credentials, broker-framed. Underwriter logos (section 5) cover
          underwriter backing; this covers BetterClose's own track record. */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-8">
            The settlement partner behind your file
          </div>
          <div className="grid grid-cols-3 gap-px bg-gray-100 rounded-3xl overflow-hidden border border-gray-200">
            {BROKER_TRUST_STATS.map((s) => (
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
            A-rated underwriters only · in-house and partner attorneys when a file needs legal work · directly licensed in 34 states; remaining states through licensed workshare partners · a division of First National Title &amp; Escrow.
          </p>
        </div>
      </section>

      {/* 2. Dashboard visualization — "Your pipeline, in one place" */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
            <div>
              <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm font-bold mb-4">
                ✓ Live in the broker dashboard
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-5 leading-tight">
                Your closing pipeline,{' '}
                <span className="text-primary-600">in one place.</span>
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Every quote and every closing you&apos;ve placed shows up the moment you sign in.
                No spreadsheets, no chasing escrow officers for status updates.
              </p>
              <ul className="space-y-3 mb-8">
                <FeatureBullet>Create quotes in under a minute.</FeatureBullet>
                <FeatureBullet>See when borrowers view them.</FeatureBullet>
                <FeatureBullet>Convert approved quotes into real BetterClose closings.</FeatureBullet>
                <FeatureBullet>Track every file by status and milestone.</FeatureBullet>
                <FeatureBullet>Keep email-order fallback for files that start outside the portal.</FeatureBullet>
              </ul>
            </div>

            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* 2.5. How the portal works — placed after the pipeline overview so the
          big-picture value lands first, then the step-by-step detail. */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-dark-900 mb-3">How the portal works</h2>
            <p className="text-lg text-gray-600">Five steps from first quote to closed file.</p>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            <StepCard
              step="1"
              title="Create a client quote"
              body="Enter the borrower&apos;s basics — purchase or refi, ZIP, loan amount — and we freeze a fee report."
            />
            <StepCard
              step="2"
              title="Share it with the borrower"
              body="Send a public-view link they can open without a login. We track when they view it."
            />
            <StepCard
              step="3"
              title="Convert to a closing"
              body="When the borrower says yes, one click turns the quote into a real BetterClose closing. We open the file, notify the borrower, and begin tracking the closing milestones."
            />
            <StepCard
              step="4"
              title="Track the file in pipeline"
              body="Your pipeline shows every file you&apos;ve placed — active, pending, closed — with milestone counts and direct links to each file."
            />
            <StepCard
              step="5"
              title="Or email an order instead"
              body="Prefer the email workflow? Send orders to orders@betterclose.co. Same ops team, same SLA, same outcome."
            />
          </div>
        </div>
      </section>

      {/* 3. Sign in or request access */}
      <section id="signin-or-request" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            <ActionCard
              title="Already onboarded? Sign in."
              body="Your company has been onboarded by BetterClose admin? Sign in with your work email — we&apos;ll match your account to every BetterClose file you&apos;ve ever been on."
              primary={{ label: 'Sign in to broker dashboard →', href: SIGN_IN_HREF, style: 'solid' }}
              secondary={{ label: 'Or jump straight to creating a broker quote →', href: CREATE_BROKER_QUOTE_HREF }}
            />
            <ActionCard
              title="Not onboarded yet? Request access."
              body="BetterClose onboards brokerages and lending teams one at a time after a quick verification call (NPN, licenses, settlement-agent arrangement). Email us your company details and we&apos;ll set up your portal."
              primary={{ label: 'Request portal access →', href: REQUEST_ACCESS_HREF, style: 'outline' }}
              footnote="Approval typically within one business day."
            />
          </div>
        </div>
      </section>

      {/* 4. Place orders your way */}
      <section id="place-orders" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-dark-900 mb-3">Place orders your way</h2>
            <p className="text-lg text-gray-600">Four ways to send BetterClose an order — pick what fits your workflow today.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <OrderTile
              icon={ICONS.dashboard}
              title="Broker dashboard"
              body="Use the portal to create quotes, convert to closings, and track the pipeline."
              cta={{ label: 'Sign in →', href: SIGN_IN_HREF }}
            />
            <OrderTile
              icon={ICONS.envelope}
              title="Email an order"
              body="Send a single email to orders@betterclose.co with the borrower and property details. We confirm within one business day."
              cta={{ label: 'Email an order →', href: EMAIL_ORDER_HREF }}
            />
            <OrderTile
              icon={ICONS.workflow}
              title="Your existing workflow"
              body="Use the LOS, pricing engine, or platform your team already runs on — SmartFees, Encompass, Qualia, ResWare, or email — and send the order to BetterClose."
            />
            <OrderTile
              icon={ICONS.clipboard}
              title="Need our company info?"
              body="If your LOS, pricing engine, or closing instructions require settlement-agent details, email us and we&apos;ll provide the correct BetterClose information for the file."
              cta={{ label: 'Request company info', href: COMPANY_INFO_REQUEST_HREF }}
            />
          </div>
        </div>
      </section>

      {/* 5. Underwriter trust strip */}
      <UnderwriterLogos />

      {/* 6. Why brokers use BetterClose */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-dark-900 mb-3">Why brokers use BetterClose</h2>
            <p className="text-lg text-gray-600">
              A lower-cost closing for your borrower, a stronger pitch for you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <ReasonCard
              icon={ICONS.cash}
              title="Lower cash to close"
              body="Cut your borrower's title and settlement costs without changing the underwriter."
            />
            <ReasonCard
              icon={ICONS.chartDown}
              title="Two savings numbers to show your borrower"
              body="Save at closing and save over the loan — both clearly displayed."
            />
            <ReasonCard
              icon={ICONS.document}
              title="A co-branded savings page, if you want it"
              body="Send a polished page with your name on it, or simply use the BetterClose numbers in your own borrower quote. Your choice."
            />
            <ReasonCard
              icon={ICONS.bolt}
              title="Convert quote to order"
              body="When the borrower says yes, one click opens the closing. No re-keying."
            />
            <ReasonCard
              icon={ICONS.pin}
              title="Track every milestone"
              body="Live pipeline status from order to close — no chasing title for updates."
            />
            <ReasonCard
              icon={ICONS.scale}
              title="Legal snags don't slip your close date"
              body="A lien that won't release, an estate or vesting problem, a missing signer — when a file needs legal work, our in-house and partner attorneys clear it so your clear-to-close holds."
            />
          </div>
        </div>
      </section>

      {/* 7. Credibility — defensible savings */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-dark-900 mb-3 leading-tight">
              Built to compete with your best title option
            </h2>
            <p className="text-lg text-gray-600">
              No inflated comparisons. No fake savings on pass-through fees.
            </p>
          </div>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            BetterClose is designed to be compared against real quotes, not inflated estimates.
            We price the parts of title and settlement we can control more competitively and
            clearly separate government fees, recording charges, transfer taxes, and
            lender-required third-party costs.
          </p>
        </div>
      </section>

      {/* 8. Where the savings come from */}
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
              body="We price the parts of title we can control more competitively and pass those savings to the borrower."
            />
            <ReasonCard
              icon={ICONS.receipt}
              title="Pass-through fees clearly labeled"
              body="Recording fees, transfer taxes, and lender-required third-party costs are passed through and shown line by line."
            />
          </div>

          {/* For brokers who already have a low-cost option — invite the comparison. */}
          <div className="max-w-3xl mx-auto mt-10 bg-white border border-gray-200 rounded-2xl shadow-sm p-7">
            <h3 className="text-2xl font-black text-dark-900 mb-2">
              Already have a preferred title option?
            </h3>
            <p className="text-base text-gray-700 leading-relaxed mb-5">
              Put BetterClose next to it. If we&apos;re lower, you have another
              option for your borrower. If we&apos;re not, you still have a clear
              comparison.
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

function StepCard({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="text-center md:text-left">
      <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-black mb-4 mx-auto md:mx-0">
        {step}
      </div>
      <h3 className="font-bold text-base mb-2 text-dark-900">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
    </div>
  )
}

interface CtaSpec {
  label: string
  href: string
  style?: 'solid' | 'outline'
}

function ActionCard({
  title,
  body,
  primary,
  secondary,
  footnote,
}: {
  title: string
  body: string
  primary: CtaSpec
  secondary?: { label: string; href: string }
  footnote?: string
}) {
  const primaryClass =
    primary.style === 'outline'
      ? 'bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow'
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 flex flex-col">
      <h3 className="text-xl font-black text-dark-900 mb-3">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">{body}</p>
      <Link
        href={primary.href}
        className={`inline-flex items-center justify-center px-5 py-3 rounded-lg font-bold text-sm transition-colors ${primaryClass}`}
      >
        {primary.label}
      </Link>
      {secondary && (
        <Link
          href={secondary.href}
          className="mt-3 text-sm font-semibold text-primary-700 hover:underline text-center"
        >
          {secondary.label}
        </Link>
      )}
      {footnote && <p className="mt-3 text-xs text-gray-500 text-center">{footnote}</p>}
    </div>
  )
}

function OrderTile({
  icon,
  title,
  body,
  cta,
}: {
  icon: React.ReactNode
  title: string
  body: string
  cta?: { label: string; href: string }
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start gap-3 mb-3">
        <span
          className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center"
          aria-hidden="true"
        >
          {icon}
        </span>
        <h3 className="text-lg font-bold text-dark-900 leading-tight pt-2">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{body}</p>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex items-center text-sm font-bold text-primary-700 hover:text-primary-800 hover:underline"
        >
          {cta.label}
        </Link>
      )}
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

// Inline visual mockup of the broker portal dashboard. Sample data is
// hard-coded so it reads like a screenshot — no fetch, no real auth, no
// shared component import. Lives only on /for-brokers as a marketing device.
function DashboardMockup() {
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
        <MockTab label="Files" />
        <MockTab label="Pipeline" active />
        <MockTab label="Quotes" />
      </div>

      <div className="grid md:grid-cols-[1.6fr_1fr] divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-gray-50">
        {/* Center: rows */}
        <div className="p-4 sm:p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-1">
            Broker Portal
          </div>
          <div className="text-base font-black text-dark-900 mb-4">Your pipeline</div>

          <div className="space-y-2.5">
            <MockRow
              borrower="Sarah Chen"
              status="Quote viewed"
              statusTone="violet"
              detail={`${formatCurrency(EXAMPLE_SAVINGS.saveAtClosing)} estimated savings`}
              cta="Convert"
              progress={null}
            />
            <MockRow
              borrower="Miguel Alvarez"
              status="Active closing"
              statusTone="emerald"
              detail="Title search"
              cta={null}
              progress={{ done: 2, total: 5 }}
            />
            <MockRow
              borrower="Priya Shah"
              status="Pending"
              statusTone="amber"
              detail="Awaiting order"
              cta={null}
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
            <SummaryRow label="Quotes sent" value="14" />
            <SummaryRow label="Viewed by borrower" value="9" tone="violet" />
            <SummaryRow label="Active closings" value="6" tone="emerald" />
            <SummaryRow label="Closing this week" value="2" tone="amber" />
          </div>
          <div className="mt-5 pt-4 border-t border-gray-200 text-[10px] text-gray-400 italic leading-relaxed">
            Sample data. Real numbers appear once you place your first quote.
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
        active
          ? 'text-emerald-700 border-emerald-600'
          : 'text-gray-500 border-transparent'
      }`}
    >
      {label}
    </div>
  )
}

interface MockRowProps {
  borrower: string
  status: string
  statusTone: 'violet' | 'emerald' | 'amber'
  detail: string
  cta: string | null
  progress: { done: number; total: number } | null
}

function MockRow({ borrower, status, statusTone, detail, cta, progress }: MockRowProps) {
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
          <div className="text-[13px] font-bold text-dark-900 leading-tight">{borrower}</div>
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
                className={`h-1.5 flex-1 rounded-full ${
                  i < progress.done ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
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
