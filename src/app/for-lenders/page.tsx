import Link from 'next/link'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import RotatingSavingsPill from '@/components/RotatingSavingsPill'
import UnderwriterLogos from '@/components/UnderwriterLogos'
import DashboardTrustSection from '@/components/DashboardTrustSection'
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from '@/lib/contact'
import { formatCurrency, LIFETIME_RATE_PCT, LIFETIME_TERM_YEARS } from '@/lib/feeReport'
import { estimateCostBasis, estimateSavings } from '@/lib/stateSavings'

// Same illustrative national $500k purchase and shared model as the broker
// and agent pages. This is not a lender-specific discount or a live quote.
const EXAMPLE_HOME_VALUE = 500000
const EXAMPLE_SAVINGS = estimateSavings(EXAMPLE_HOME_VALUE, 'purchase', null)
const EXAMPLE_BASIS = estimateCostBasis(EXAMPLE_HOME_VALUE, 'purchase', null)

export const metadata = {
  title: 'BetterClose · Title & Closing for Lenders',
  description: 'Help your borrowers lower title and settlement costs and make your loan offer stand out, with clear savings estimates, a dedicated closing team, Encompass ordering and document exchange, and custom API discussions.',
}

// Reuse the existing professional estimate flow, which also serves lenders.
const QUOTE_HREF = '/quote?source=broker'
const ENCOMPASS_HREF = `mailto:orders@betterclose.co?subject=${encodeURIComponent('Encompass integration — lender inquiry')}`
const CUSTOM_INTEGRATION_HREF = `mailto:partners@betterclose.co?subject=${encodeURIComponent('Custom lender integration inquiry')}`
const EMAIL_ORDER_HREF = `mailto:orders@betterclose.co?subject=${encodeURIComponent('New title order')}&body=${encodeURIComponent(`Hi BetterClose team,

Please open a new title file:

Borrower(s):
Property address:
City, State, Zip:
Estimated closing date:
Loan amount:
Transaction type: (purchase / refinance)
Sale price (if purchase):

Lender / loan officer name:
Company:
Phone:

Anything else we should know:

Thanks,`)}`

const CLOSING_STEPS = [
  { title: 'Show your borrower the savings', description: 'Get an itemized estimate for the property and loan, and compare it with the borrower’s other title and settlement options.' },
  { title: 'Send your title order', description: 'Use the Encompass integration or email our closing team.' },
  { title: 'Work with your escrow officer', description: 'Your file-opening email introduces the person handling your closing.' },
] as const

const BENEFITS = [
  { title: 'Lower costs for your borrower', description: 'Offer a competitively priced title and settlement option alongside your financing. When the fees are lower, your borrower keeps more at closing.' },
  { title: 'A stronger cost comparison', description: 'Give your loan officers an itemized estimate to review with borrowers comparing their closing options. Show where the savings come from, not just a headline number.' },
  { title: 'Closing support for your team', description: 'Work with the escrow officer assigned to the file and keep shared documents and file information together. Lower cost still comes with a real closing team.' },
] as const

const SAVINGS_SOURCES = [
  { title: 'Competitively priced settlement services', description: 'BetterClose prices the title and settlement services it can control more competitively, passing those savings to the borrower where available.' },
  { title: 'Title costs, clearly itemized', description: 'Title insurance premiums, government fees, recording charges and transfer taxes are shown separately, so your borrower can see the full picture—not just the settlement fee.' },
  { title: 'A comparison your team can explain', description: 'Compare the same property, loan and services against a real alternative quote. Actual savings depend on the file and location—not every borrower will save the same amount.' },
] as const

// Presentation follows /for-brokers: primary-blue hero/type, emerald primary
// CTA, white bordered order tiles, blue numbered steps and neutral sections.
// Keep the lender-specific copy separate from that established visual style.
function ArrowIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
}

function WorkflowIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h11M4 12h11M4 18h7m5-2l3 3m0 0l3-3m-3 3V8" /></svg>
}

function EmailIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
}

function CodeIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7l-5 5 5 5m8-10l5 5-5 5M14 4l-4 16" /></svg>
}

export default function LendersPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationCredible />
      <main className="pt-20">
        <section aria-labelledby="lender-heading" className="py-20 bg-gradient-to-br from-primary-50 to-white">
          <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-bold mb-4">FOR LENDERS &amp; LOAN OFFICERS</div>
              <h1 id="lender-heading" className="text-4xl md:text-5xl font-black text-dark-900 mb-5 leading-tight">
                Give your borrowers lower closing costs.{' '}
                <span className="text-primary-600">Make your loan offer stand out.</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Offer your borrowers a lower-cost title and settlement option alongside your
                financing. Show the savings with a clear, itemized estimate—backed by trusted
                underwriters, an assigned escrow officer, and shared file information for your team.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link href={QUOTE_HREF} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg">Get estimate <ArrowIcon /></Link>
                <a href="#place-an-order" className="text-base font-semibold text-primary-700 hover:underline whitespace-nowrap">How to order</a>
              </div>
              <p className="text-sm text-gray-500 mt-4">No login required for an estimate. Connect with our closing team when you’re ready.</p>
            </div>
            <aside aria-labelledby="borrower-savings-heading" className="bg-white rounded-2xl shadow-2xl p-7 border border-gray-200">
              <h2 id="borrower-savings-heading" className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">Example borrower savings · Illustrative</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-center">
                  <div data-testid="savings-at-closing" className="text-2xl sm:text-3xl whitespace-nowrap font-black text-emerald-700 leading-none">−{formatCurrency(EXAMPLE_SAVINGS.saveAtClosing)}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/80 mt-1.5">Save at closing</div>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-center">
                  <div data-testid="savings-over-loan" className="text-2xl sm:text-3xl whitespace-nowrap font-black text-emerald-700 leading-none">−{formatCurrency(EXAMPLE_SAVINGS.saveOverLoan)}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/80 mt-1.5">Save over the loan</div>
                </div>
              </div>
              <RotatingSavingsPill savings={EXAMPLE_SAVINGS.saveOverLoan} tail="back in your borrower's pocket" className="mt-4" />
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
                <div className="flex items-baseline justify-between gap-3"><span className="text-xs text-gray-600">BetterClose estimate</span><span data-testid="betterclose-estimate" className="text-sm font-bold text-dark-900">{formatCurrency(EXAMPLE_BASIS.ourTotal)}</span></div>
                <div className="flex items-baseline justify-between gap-3"><span className="text-xs text-gray-400">Typical cost · national example</span><span data-testid="comparison-estimate" className="text-sm font-semibold text-gray-400 line-through decoration-gray-300">{formatCurrency(EXAMPLE_BASIS.typicalTotal)}</span></div>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed mt-4">
                Illustrative {formatCurrency(EXAMPLE_HOME_VALUE)} purchase, not a quote or guarantee.
                Actual savings depend on the borrower’s loan, property, location and comparison quote.
              </p>
              <p className="text-[11px] text-gray-400 leading-relaxed mt-2">
                Over-loan savings include the at-closing savings plus modeled interest avoided
                if that amount is borrowed less, at {LIFETIME_RATE_PCT}% over {LIFETIME_TERM_YEARS} years.
                Not additional cash at closing or a change to your loan rate.
              </p>
            </aside>
          </div>
          </div>
        </section>

        <section aria-labelledby="support-heading" className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12"><h2 id="support-heading" className="text-4xl font-black text-dark-900 mb-3">A lower-cost closing. A stronger borrower experience.</h2><p className="text-lg text-gray-600">Savings your loan officers can explain, with closing support your team can use.</p></div>
            <div className="grid md:grid-cols-3 gap-8">
              {BENEFITS.map(benefit => (
                <div key={benefit.title} className="text-center md:text-left"><div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 mb-3" aria-hidden="true"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><h3 className="text-lg font-bold text-dark-900 mb-2">{benefit.title}</h3><p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p></div>
              ))}
            </div>
          </div>
        </section>

        <DashboardTrustSection />

        <section id="place-an-order" aria-labelledby="order-heading" className="scroll-mt-24 py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 id="order-heading" className="text-4xl font-black text-dark-900 mb-3">Ordering &amp; integrations</h2>
              <p className="text-lg text-gray-600">Order through an available integration or email. Talk to us about a custom connection.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-start gap-3 mb-3"><span className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center"><WorkflowIcon /></span><h3 className="text-lg font-bold text-dark-900 leading-tight pt-2">Encompass integration</h3></div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">Available today: one-touch title ordering and document exchange through Encompass. Contact our team to confirm setup for your organization.</p>
                <a href={ENCOMPASS_HREF} className="inline-flex items-center text-sm font-bold text-primary-700 hover:text-primary-800 hover:underline">Ask about Encompass →</a>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-start gap-3 mb-3"><span className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center"><EmailIcon /></span><h3 className="text-lg font-bold text-dark-900 leading-tight pt-2">Email your title order</h3></div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Send your property and loan details to{' '}
                  <a href={EMAIL_ORDER_HREF} className="break-words font-semibold text-primary-700 hover:underline">orders@betterclose.co</a>.
                  You don’t need a BetterClose account to send an order.
                </p>
                <a href={EMAIL_ORDER_HREF} className="inline-flex items-center text-sm font-bold text-primary-700 hover:text-primary-800 hover:underline">Email an order →</a>
                <p className="mt-3 text-xs text-gray-500">Opens your email app with an order template.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-start gap-3 mb-3"><span className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center"><CodeIcon /></span><h3 className="text-lg font-bold text-dark-900 leading-tight pt-2">Custom lender APIs</h3></div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">Need a direct connection to your own systems? We can discuss building a custom API for your lending team. Scope, security requirements and availability would be agreed before development.</p>
                <a href={CUSTOM_INTEGRATION_HREF} className="inline-flex items-center text-sm font-bold text-primary-700 hover:text-primary-800 hover:underline">Discuss a custom API →</a>
                <p className="mt-3 text-xs text-gray-500">Custom development, not an existing self-service API.</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="closing-path-heading" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12"><h2 id="closing-path-heading" className="text-4xl font-black text-dark-900 mb-3">A straightforward path to closing</h2><p className="text-lg text-gray-600">From your first estimate to your assigned closing team.</p></div>
            <ol className="grid md:grid-cols-3 gap-6">
              {CLOSING_STEPS.map((step, index) => <li key={step.title} className="text-center md:text-left"><div aria-hidden="true" className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-black mb-4 mx-auto md:mx-0">{index + 1}</div><h3 className="font-bold text-base mb-2 text-dark-900">{step.title}</h3><p className="text-sm text-gray-600 leading-relaxed">{step.description}</p></li>)}
            </ol>
          </div>
        </section>

        <section aria-labelledby="savings-source-heading" className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12"><h2 id="savings-source-heading" className="text-4xl font-black text-dark-900 mb-3">Where your borrower saves</h2><p className="text-lg text-gray-600">Competitive fees. Clear comparisons. More clarity for your borrower.</p></div>
            <div className="grid md:grid-cols-3 gap-6">
              {SAVINGS_SOURCES.map(item => <div key={item.title} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"><h3 className="text-lg font-bold text-dark-900 mb-2">{item.title}</h3><p className="text-sm text-gray-600 leading-relaxed">{item.description}</p></div>)}
            </div>
            <p className="mt-8 text-sm text-gray-600 text-center">Already have a file with us?{' '}<Link href="/login?callbackUrl=/teammate/dashboard" className="font-semibold text-primary-700 hover:underline">View your files</Link>.</p>
          </div>
        </section>

        <UnderwriterLogos />

        <section aria-labelledby="lender-contact-heading" className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-7">
              <h2 id="lender-contact-heading" className="text-2xl font-black text-dark-900 mb-2">Put BetterClose beside your current title option.</h2><p className="text-base text-gray-700 leading-relaxed mb-5">Compare an itemized estimate for your next borrower. If we’re lower, you have another way to help them save. If not, you still have a clear comparison.</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link href={QUOTE_HREF} className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-base px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow">Get an estimate <ArrowIcon /></Link>
              <a href={`tel:${SUPPORT_PHONE_TEL}`} className="text-base font-semibold text-primary-700 hover:underline whitespace-nowrap">Call {SUPPORT_PHONE_DISPLAY}</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterComprehensive />
    </div>
  )
}
