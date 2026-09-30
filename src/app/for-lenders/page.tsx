import Link from 'next/link'
import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from '@/lib/contact'

export const metadata = {
  title: 'BetterClose · Title & Closing for Lenders',
  description: 'Title and settlement for lenders, with Encompass integration, email ordering, clear estimates and a dedicated closing team.',
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
  { title: 'Start with a clear estimate', description: 'Review title and settlement costs for your borrower’s property and loan scenario.' },
  { title: 'Send your title order', description: 'Use the Encompass integration or email our closing team.' },
  { title: 'Work with your escrow officer', description: 'Your file-opening email introduces the person handling your closing.' },
] as const

const BENEFITS = [
  { title: 'Know the costs', description: 'Get an itemized estimate before you place the order. Review the details with your borrower as the file develops.' },
  { title: 'Know your closing team', description: 'Connect with the escrow officer assigned to your file for questions, documents and next steps.' },
  { title: 'Keep the file together', description: 'View shared documents and file information in BetterClose, without digging through an email thread.' },
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
                Your lending workflow.{' '}
                <span className="text-primary-600">Our closing team.</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Get a clear title and settlement estimate, order through Encompass or email,
                and work with an escrow officer who knows your file.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link href={QUOTE_HREF} className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg">Get estimate <ArrowIcon /></Link>
                <a href="#place-an-order" className="text-base font-semibold text-primary-700 hover:underline whitespace-nowrap">How to order</a>
              </div>
              <p className="text-sm text-gray-500 mt-4">No login required for an estimate. Order through Encompass or email when you’re ready.</p>
            </div>
            <aside aria-labelledby="integration-heading" className="bg-white rounded-2xl shadow-2xl p-7 border border-gray-200">
              <div className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">YOUR EXISTING WORKFLOW</div>
              <h2 id="integration-heading" className="text-4xl font-black text-primary-600 text-center mb-3">Encompass</h2>
              <p className="text-lg text-gray-600 text-center mb-8">Encompass integration available</p>
              <ul className="space-y-3 mb-8">
                {['Work from your existing loan platform.', 'Email an order when that’s easier.', 'Connect with your assigned escrow officer.'].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5" aria-hidden="true"><svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                    <div className="text-base text-gray-800 leading-relaxed">{item}</div>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-gray-400 leading-relaxed mt-4">Contact our team to confirm Encompass setup for your organization.</p>
            </aside>
          </div>
          </div>
        </section>

        <section id="place-an-order" aria-labelledby="order-heading" className="scroll-mt-24 py-16 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-12">
              <h2 id="order-heading" className="text-4xl font-black text-dark-900 mb-3">Place orders your way</h2>
              <p className="text-lg text-gray-600">Use Encompass, or send the order directly to our team.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-start gap-3 mb-3"><span className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center"><WorkflowIcon /></span><h3 className="text-lg font-bold text-dark-900 leading-tight pt-2">Work through Encompass</h3></div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">BetterClose integrates with Encompass. Contact our team for help getting started and confirming the setup for your organization.</p>
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

        <section aria-labelledby="support-heading" className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12"><h2 id="support-heading" className="text-4xl font-black text-dark-900 mb-3">Why lenders use BetterClose</h2><p className="text-lg text-gray-600">Clear costs. A real person. One place for your file.</p></div>
            <div className="grid md:grid-cols-3 gap-8">
              {BENEFITS.map(benefit => (
                <div key={benefit.title} className="text-center md:text-left"><div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 mb-3" aria-hidden="true"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><h3 className="text-lg font-bold text-dark-900 mb-2">{benefit.title}</h3><p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p></div>
              ))}
            </div>
            <p className="mt-8 text-sm text-gray-600 text-center">Already have a file with us?{' '}<Link href="/login?callbackUrl=/teammate/dashboard" className="font-semibold text-primary-700 hover:underline">View your files</Link>.</p>
          </div>
        </section>

        <section aria-labelledby="lender-contact-heading" className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-7">
              <h2 id="lender-contact-heading" className="text-2xl font-black text-dark-900 mb-2">Let’s talk about your next closing.</h2><p className="text-base text-gray-700 leading-relaxed mb-5">Questions about ordering or working with BetterClose? We’re here to help.</p>
              <a href={`tel:${SUPPORT_PHONE_TEL}`} className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold text-base px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow">Call {SUPPORT_PHONE_DISPLAY}</a>
            </div>
            <div className="max-w-3xl mx-auto mt-10">
              <h2 className="text-lg font-bold text-dark-900 mb-2">Need a custom integration?</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">Have a lender-specific workflow? We can discuss whether a custom API integration would be a fit. Scope and availability would be agreed separately; we don’t currently offer self-service API access.</p>
              <a href={CUSTOM_INTEGRATION_HREF} className="mt-3 inline-block text-sm font-semibold text-primary-700 hover:underline">Discuss your workflow</a>
            </div>
          </div>
        </section>
      </main>
      <FooterComprehensive />
    </div>
  )
}
