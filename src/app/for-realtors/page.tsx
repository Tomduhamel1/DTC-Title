import Link from 'next/link'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import UnderwriterLogos from '@/components/UnderwriterLogos'
import DashboardTrustSection from '@/components/DashboardTrustSection'

export const metadata = {
  title: 'BetterClose · For Real Estate Agents',
  description:
    "Help your buyer lower closing costs and keep the deal on track — a lower-cost title and settlement option, real closing support, trusted underwriters, and live file visibility. We coordinate with the lender your buyer chooses.",
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
  { value: '$5M', label: 'Bonded & insured' },
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
                Lower closing costs for your buyer.{' '}
                <span className="text-primary-600">Keep the deal on track.</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                BetterClose helps agents give buyers a lower-cost title and settlement
                option, backed by real closing support, trusted underwriters, and live
                file visibility.
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

            {/* Right cell: example savings card. Numbers are STATIC LITERALS,
                consistent with the homepage/broker model and the same
                $500k-purchase example: $520 at closing → $1,180 over the loan
                (that $520 financed at 6.5% over 30 years); comparable option =
                $1,452 + $520 = $1,972. Labeled "illustrative / not a quote". */}
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
                  <div className="text-3xl font-black text-emerald-700 leading-none">$520</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/80 mt-1.5">
                    Save at closing
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-center">
                  <div className="text-3xl font-black text-emerald-700 leading-none">$1,180</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/80 mt-1.5">
                    Save over the loan
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-600">BetterClose estimate</span>
                  <span className="text-sm font-bold text-dark-900">$1,452</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-gray-400">Comparable option</span>
                  <span className="text-sm font-semibold text-gray-400 line-through decoration-gray-300">$1,972</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed mt-4">
                Example purchase only — not a quote or guarantee. Actual savings
                depend on your buyer&apos;s loan, property, and location.
              </p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 rounded-3xl overflow-hidden border border-gray-200">
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
              title="Lower cash to close for your buyer"
              body="Lower title and settlement costs mean your buyer keeps more at closing — real help for first-timers covering movers and furniture."
            />
            <ReasonCard
              icon={ICONS.bolt}
              title="An on-time close that protects your deal"
              body="A smooth, predictable close so the deal doesn't fall apart at the table — protecting your timeline, your commission, and your reputation."
            />
            <ReasonCard
              icon={ICONS.receipt}
              title="No awkward fee conversations"
              body={"Transparent, line-by-line fees mean no “what’s this charge?” surprises at signing — just a clean closing your client trusts."}
            />
            <ReasonCard
              icon={ICONS.pin}
              title="Live status — stop chasing the title company"
              body="See every milestone in real time so you always know where the file stands, without emailing escrow for updates."
            />
            <ReasonCard
              icon={ICONS.workflow}
              title="Works with the buyer's lender"
              body="We coordinate with the lender your buyer chooses."
            />
          </div>
        </div>
      </section>

      {/* 5. Testimonial */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed italic">
              &ldquo;I&apos;ve been an agent for 15 years and BetterClose changed how my
              closings go. My first-time buyers love keeping more cash at the table, the
              fees are clear so there are no surprises, and the file just moves — I&apos;m
              not chasing the title company for updates. It makes me look like a hero. I
              recommend them on every deal now.&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl font-bold text-emerald-600">
                JP
              </div>
              <div>
                <div className="font-bold text-dark-900">James P.</div>
                <div className="text-gray-600">Real Estate Agent, Seattle WA</div>
              </div>
            </div>
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
