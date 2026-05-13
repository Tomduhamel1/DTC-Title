import Link from 'next/link'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import UnderwriterLogos from '@/components/UnderwriterLogos'
import {
  buildOrderMailto,
  getLenderRequestContext,
} from '@/lib/teammate/lender-request-context'

// /for-my-team is the page a borrower-invited professional lands on. The
// borrower's invite is role-agnostic — they invited "their closing team",
// not a specifically-classified mortgage broker or real estate agent. This
// page lets the professional choose what they want to do next:
//   1. Generate a quote for the client
//   2. Send/email the title order
//   3. Create or sign in to their free dashboard
// plus a soft below-fold path to request broker/LO portal access.
//
// When the URL has ?ref=<refId>, we hydrate the linked LenderRequest +
// Closing server-side so the email-order mailto is prefilled with the
// borrower's transaction details and the dashboard claim binds the new
// account to the right TeammateClosing (with role='unknown' per PR 16).

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'BetterClose · For your closing team',
  description:
    "A client asked you to consider BetterClose. Generate a quote for them, send an order, or create your free dashboard to track every BetterClose file you're on.",
}

interface Props {
  searchParams?: { ref?: string }
}

export default async function ForMyTeamPage({ searchParams }: Props) {
  const refId = searchParams?.ref
  const ctx = await getLenderRequestContext(refId)
  const { subject, body } = buildOrderMailto(ctx)
  const isPersonalized = Boolean(ctx?.closing)

  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.betterclose.co'

  const emailOrderHref = `mailto:orders@betterclose.co?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`

  const dashboardClaimHref = refId
    ? `/login?callbackUrl=${encodeURIComponent(`/teammate/dashboard?claim=${refId}`)}`
    : `/login?callbackUrl=${encodeURIComponent('/teammate/dashboard')}`

  const createQuoteHref = `/login?callbackUrl=${encodeURIComponent('/teammate/quotes/new')}`

  const companyInfoHref = `mailto:orders@betterclose.co?subject=${encodeURIComponent(
    'BetterClose company info request',
  )}`

  const brokerPortalAccessHref = `mailto:partners@betterclose.co?subject=${encodeURIComponent(
    'Broker portal access request',
  )}&body=${encodeURIComponent(
    `Hi BetterClose team,

We'd like to request access to the broker/LO portal.

Company name:
NPN:
State licenses:
Approximate monthly closings:
How you found us:

Thanks,`,
  )}`

  const clientName = ctx?.clientName || ctx?.borrower?.name || null
  const propertyAddressFull = ctx?.closing
    ? [
        ctx.closing.propertyAddress,
        ctx.closing.propertyCity,
        ctx.closing.propertyState,
        ctx.closing.propertyZip,
      ]
        .filter(Boolean)
        .join(', ') || null
    : null

  // Suppress unused-var warning while we expose baseUrl for any future
  // helper that needs an absolute href. Kept as a no-op reference.
  void baseUrl

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />

      {/* 1. Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider mb-5">
              A closing team invite
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark-900 leading-tight tracking-tight mb-5">
              A client asked you to consider BetterClose.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
              Help them compare costs, open the order, or track the file —
              whichever step you&apos;re ready for.
            </p>
            {isPersonalized && (clientName || propertyAddressFull) && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-700 shadow-sm">
                {clientName && <span className="font-semibold text-dark-900">{clientName}</span>}
                {clientName && propertyAddressFull && (
                  <span className="text-gray-300">·</span>
                )}
                {propertyAddressFull && <span>{propertyAddressFull}</span>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Three action cards */}
      <section id="actions" className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-5">
              <ActionCard
                emoji="⚡"
                title="Generate a quote for this client"
                body={
                  isPersonalized
                    ? 'Use the details from this invite to create a borrower-facing quote with line-item savings and transparent fees.'
                    : 'See exact BetterClose savings and transparent fees. Send your client a quote page they can open without signing in.'
                }
                cta={{ label: 'Sign in to create →', href: createQuoteHref }}
                helper="Sign in to create a quote. You can use the borrower and property details from this invite."
                primary
              />
              <ActionCard
                emoji="✉️"
                title="Send the title order"
                body="Email orders@betterclose.co with the borrower's details. We confirm within one business day."
                cta={{ label: 'Email an order →', href: emailOrderHref }}
                helper={
                  isPersonalized
                    ? "Pre-filled with your client's details from this invite."
                    : 'Opens your mail app with a blank order template.'
                }
              />
              <ActionCard
                emoji="📊"
                title="Create your free dashboard"
                body="Track every BetterClose file you're on. Get milestone updates. Tell us your role once you sign in."
                cta={{ label: 'Create / sign in →', href: dashboardClaimHref }}
                helper={
                  isPersonalized
                    ? "We'll link this client's file the moment you sign in."
                    : 'One-tap magic-link sign-in. No password.'
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why your client is asking */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-dark-900 mb-3">
                Why your client is asking
              </h2>
              <p className="text-lg text-gray-600">
                Same protection your client expects. Lower price. Easier on you.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ReasonCard
                emoji="🛡️"
                title="Same A-rated underwriters"
                body="The title insurance is identical to what you place with any other settlement company."
              />
              <ReasonCard
                emoji="📊"
                title="Transparent line-item pricing"
                body="Your client sees every fee ahead of time. No junk fees, no surprises at the closing table."
              />
              <ReasonCard
                emoji="⏱️"
                title="Smoother coordination"
                body="We work with you and the borrower directly. You name BetterClose in closing instructions; we handle scheduling, docs, and disbursement."
              />
              <ReasonCard
                emoji="💰"
                title="Lower closing costs"
                body="Borrowers typically save several hundred to a few thousand dollars at closing versus the typical market range."
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. What your client will see */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-dark-900 mb-3">
                What your client will see
              </h2>
              <p className="text-lg text-gray-600">
                From quote to closing day — full visibility, no surprises.
              </p>
            </div>
            <ul className="space-y-3">
              <FeatureBullet>
                A quote page showing line-item savings versus the typical market range.
              </FeatureBullet>
              <FeatureBullet>
                Who is handling their closing, with direct contact details.
              </FeatureBullet>
              <FeatureBullet>
                Live milestones — loan locked, title ordered, title issued, closed — as each step completes.
              </FeatureBullet>
              <FeatureBullet>
                Credit to you for helping them choose a transparent settlement provider.
              </FeatureBullet>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Ways to work with BetterClose */}
      <section id="place-order" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-dark-900 mb-3">
                Ways to work with BetterClose
              </h2>
              <p className="text-lg text-gray-600">
                Four paths — pick what fits your workflow today.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <OrderTile
                emoji="📊"
                title="Broker/LO portal"
                body="Create quotes, convert approved quotes into closings, and track files in your pipeline. Built for mortgage brokers and loan officers."
                cta={{ label: 'Sign in →', href: dashboardClaimHref }}
              />
              <OrderTile
                emoji="✉️"
                title="Email an order"
                body="Send to orders@betterclose.co with the borrower and property details. We confirm within one business day."
                cta={{ label: 'Email an order →', href: emailOrderHref }}
              />
              <OrderTile
                emoji="🔧"
                title="Your existing workflow"
                body="Use the LOS, pricing engine, or platform your team already runs on — SmartFees, Encompass, Qualia, ResWare, or email — and send the order to BetterClose."
              />
              <OrderTile
                emoji="📋"
                title="Need our company info?"
                body="If your LOS, pricing engine, or closing instructions require settlement-agent details, email us and we'll provide the correct BetterClose information for the file."
                cta={{ label: 'Request company info →', href: companyInfoHref }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Underwriter trust strip */}
      <UnderwriterLogos />

      {/* 7. Create your free dashboard */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
            <div>
              <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm font-bold mb-4">
                ✓ Free for closing teammates
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-dark-900 mb-5 leading-tight">
                Track every BetterClose file you&apos;re on{' '}
                <span className="text-primary-600">— in one place.</span>
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                We auto-link every file where your email appears. Sign in with
                your work email, then pick your role on each file.
              </p>
              <ul className="space-y-3 mb-8">
                <FeatureBullet>Live milestones for each of your active files.</FeatureBullet>
                <FeatureBullet>
                  Pick your role per file — mortgage broker, loan officer, real
                  estate agent, or other closing team member.
                </FeatureBullet>
                <FeatureBullet>
                  Mute updates per client when you don&apos;t need them.
                </FeatureBullet>
                <FeatureBullet>
                  Direct line to the escrow officer assigned to each file.
                </FeatureBullet>
              </ul>
              <Link
                href={dashboardClaimHref}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Create / sign in →
              </Link>
              <p className="text-xs text-gray-500 mt-3">
                Takes 30 seconds. No commitment.
              </p>
            </div>

            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* 8. Below-fold: Request broker/LO portal access */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-700 mb-3">
              Run a brokerage or lending team? You can also request portal access for your company.
            </p>
            <Link
              href={brokerPortalAccessHref}
              className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-bold border-2 border-primary-600 text-primary-700 bg-white hover:bg-primary-50 transition-colors"
            >
              Request broker/LO portal access →
            </Link>
          </div>
        </div>
      </section>

      <FooterComprehensive />
    </>
  )
}

// ─── Inline helpers (lifted from /for-brokers patterns) ──────────────────

interface CtaSpec {
  label: string
  href: string
}

function ActionCard({
  emoji,
  title,
  body,
  cta,
  helper,
  primary,
}: {
  emoji: string
  title: string
  body: string
  cta: CtaSpec
  helper?: string
  primary?: boolean
}) {
  const ctaClass = primary
    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow'
    : 'bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50'
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
      <div className="text-3xl mb-3" aria-hidden="true">
        {emoji}
      </div>
      <h3 className="text-lg font-black text-dark-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-5 flex-1">{body}</p>
      <Link
        href={cta.href}
        className={`inline-flex items-center justify-center px-4 py-2.5 rounded-lg font-bold text-sm transition-colors ${ctaClass}`}
      >
        {cta.label}
      </Link>
      {helper && <p className="text-[11px] text-gray-500 mt-3">{helper}</p>}
    </div>
  )
}

function ReasonCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="text-center md:text-left">
      <div className="text-4xl mb-3" aria-hidden="true">
        {emoji}
      </div>
      <h3 className="text-base font-bold text-dark-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
    </div>
  )
}

function FeatureBullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
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
      <div className="text-base text-gray-800 leading-relaxed">{children}</div>
    </li>
  )
}

function OrderTile({
  emoji,
  title,
  body,
  cta,
}: {
  emoji: string
  title: string
  body: string
  cta?: CtaSpec
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl flex-shrink-0" aria-hidden="true">
          {emoji}
        </span>
        <h3 className="text-lg font-bold text-dark-900 leading-tight pt-1">{title}</h3>
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

// Inline visual mockup of the teammate dashboard. Sample data is hard-coded
// so it reads like a screenshot — no fetch, no auth, no shared component.
// Role labels use PR 9's role-safe vocabulary: real estate agent, loan
// officer, mortgage broker — three distinct roles, one row each.
function DashboardMockup() {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Browser chrome */}
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
        <div className="text-base font-black text-dark-900 mb-4">
          Your BetterClose files
        </div>

        <div className="space-y-2.5">
          <MockRow
            role="Real estate agent"
            tone="violet"
            borrower="Sarah Chen"
            address="4218 Cedar Lake Dr, Austin TX"
            status="Title search complete"
          />
          <MockRow
            role="Loan officer"
            tone="emerald"
            borrower="Miguel Alvarez"
            address="900 N Lake Shore Dr, Chicago IL"
            status="Loan locked"
          />
          <MockRow
            role="Mortgage broker"
            tone="amber"
            borrower="Jordan Kim"
            address="1840 Vermont Ave, Brooklyn NY"
            status="Order received"
          />
        </div>

        <div className="mt-3 text-[10px] text-gray-400 text-center italic">
          Mute toggles, milestone history, and escrow officer details on each
          file&apos;s detail page.
        </div>
      </div>
    </div>
  )
}

function MockRow({
  role,
  tone,
  borrower,
  address,
  status,
}: {
  role: string
  tone: 'violet' | 'emerald' | 'amber'
  borrower: string
  address: string
  status: string
}) {
  const toneClasses: Record<typeof tone, string> = {
    violet: 'bg-violet-50 text-violet-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-800',
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-3 py-3">
      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
        <span
          className={`inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${toneClasses[tone]}`}
        >
          {role}
        </span>
      </div>
      <div className="text-[13px] font-bold text-dark-900 leading-tight truncate">
        {borrower}
      </div>
      <div className="text-[11px] text-gray-500 mt-0.5 truncate">{address}</div>
      <div className="text-[10px] text-gray-500 mt-1">Status: {status}</div>
    </div>
  )
}
