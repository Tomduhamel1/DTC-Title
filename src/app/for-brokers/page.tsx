import Link from 'next/link'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import UnderwriterLogos from '@/components/UnderwriterLogos'

export const metadata = {
  title: 'BetterClose · For Mortgage Brokers & Loan Officers',
  description:
    "Create instant fee quotes for your borrowers, convert them into real closings with one click, and track every file in your pipeline. BetterClose's broker/LO portal is live in early access.",
}

const SIGN_IN_HREF = '/login?callbackUrl=/teammate/dashboard'
const CREATE_QUOTE_HREF = '/login?callbackUrl=/teammate/quotes/new'

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
              <h1 className="text-5xl md:text-6xl font-black text-dark-900 mb-6 leading-tight">
                Create quotes. Open closings. <span className="text-primary-600">Track every file.</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                BetterClose&apos;s broker/LO portal is live in early access for approved brokerages and lending
                teams. Build instant fee quotes for your borrowers, convert them into real closings with one
                click, and see every file&apos;s milestones in your pipeline.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={SIGN_IN_HREF}
                  className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg"
                >
                  Sign in to broker dashboard
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href={CREATE_QUOTE_HREF}
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-50 transition-colors"
                >
                  Create a quote
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Already onboarded? One-tap sign-in. New here? See <a href="#signin-or-request" className="underline font-semibold">Request access</a> below.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-primary-200">
              <div className="text-center mb-6">
                <div className="text-5xl font-black text-emerald-600 mb-2">$2,400</div>
                <div className="text-lg text-gray-600">Average borrower savings</div>
              </div>
              <div className="space-y-4">
                <ValuePropRow>Instant fee quotes branded for your borrowers</ValuePropRow>
                <ValuePropRow>One-click convert quote → closing</ValuePropRow>
                <ValuePropRow>Live pipeline of every file you&apos;ve placed</ValuePropRow>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How the portal works */}
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
              secondary={{ label: 'Or jump straight to creating a quote →', href: CREATE_QUOTE_HREF }}
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
              emoji="🟢"
              title="Broker dashboard"
              body="Use the portal to create quotes, convert to closings, and track the pipeline."
              cta={{ label: 'Sign in →', href: SIGN_IN_HREF }}
            />
            <OrderTile
              emoji="✉️"
              title="Email an order"
              body="Send a single email to orders@betterclose.co with the borrower and property details. We confirm within one business day."
              cta={{ label: 'Email an order →', href: EMAIL_ORDER_HREF }}
            />
            <OrderTile
              emoji="🔧"
              title="Your existing workflow"
              body="Use the LOS, pricing engine, or platform your team already runs on — SmartFees, Encompass, Qualia, ResWare, or email — and send the order to BetterClose."
            />
            <OrderTile
              emoji="📋"
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
              Same protection your borrower expects. Lower price. Easier on you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <ReasonCard
              emoji="🛡️"
              title="Same A-rated underwriters"
              body="The title insurance is identical to what you place with any other settlement company."
            />
            <ReasonCard
              emoji="📊"
              title="Transparent line-item pricing"
              body="Your borrower sees every fee ahead of time. No junk fees, no surprises at the closing table — fewer last-minute escalations for you."
            />
            <ReasonCard
              emoji="⚡"
              title="Built for speed"
              body="Quote in 60 seconds. Convert with one click. Pipeline updates in real time as milestones fire."
            />
          </div>
        </div>
      </section>

      <FooterComprehensive />
    </div>
  )
}

function ValuePropRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="text-dark-900 font-medium">{children}</div>
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
  emoji,
  title,
  body,
  cta,
}: {
  emoji: string
  title: string
  body: string
  cta?: { label: string; href: string }
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl flex-shrink-0" aria-hidden="true">{emoji}</span>
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

function ReasonCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="text-center md:text-left">
      <div className="text-4xl mb-3" aria-hidden="true">
        {emoji}
      </div>
      <h3 className="text-lg font-bold text-dark-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
    </div>
  )
}
