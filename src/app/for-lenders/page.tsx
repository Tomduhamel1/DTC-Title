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

export default function LendersPage() {
  return (
    <div className="min-h-screen bg-white text-dark-900">
      <NavigationCredible />
      <main className="pt-20">
        <section aria-labelledby="lender-heading" className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-14 sm:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-5 text-sm font-bold uppercase tracking-widest text-emerald-700">For lenders &amp; loan officers</p>
              <h1 id="lender-heading" className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Your lending workflow.<br />
                <span className="text-emerald-700">Our closing team.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl">
                Get a clear title and settlement estimate, order through Encompass or email,
                and work with an escrow officer who knows your file.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={QUOTE_HREF} className="rounded-xl bg-emerald-700 px-7 py-4 text-center font-bold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">Get a quote</Link>
                <a href="#place-an-order" className="rounded-xl border border-gray-300 bg-white px-7 py-4 text-center font-bold hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">How to order</a>
              </div>
              <p className="mt-5 text-sm text-gray-600">No software project needed to get started.</p>
            </div>
            <aside aria-labelledby="closing-path-heading" className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-lg sm:p-8">
              <p className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">Encompass integration available</p>
              <h2 id="closing-path-heading" className="text-2xl font-bold tracking-tight">A straightforward path to closing</h2>
              <ol className="mt-7 space-y-6">
                {CLOSING_STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-800">{index + 1}</span>
                    <div><h3 className="font-bold">{step.title}</h3><p className="mt-1 text-sm leading-relaxed text-gray-600">{step.description}</p></div>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        <section id="place-an-order" aria-labelledby="order-heading" className="scroll-mt-24 py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="mb-8 max-w-2xl">
              <h2 id="order-heading" className="text-3xl font-black tracking-tight sm:text-4xl">Order the way you already work.</h2>
              <p className="mt-4 text-lg text-gray-600">Use your existing platform, or send the order directly to our team.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">Your loan workflow</p>
                <h3 className="mt-3 text-2xl font-bold">Work through Encompass</h3>
                <p className="mb-6 mt-3 leading-relaxed text-gray-700">BetterClose integrates with Encompass. Contact our team for help getting started and confirming the setup for your organization.</p>
                <a href={ENCOMPASS_HREF} className="mt-auto self-start rounded-lg bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800">Ask about Encompass</a>
              </div>
              <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Direct to our team</p>
                <h3 className="mt-3 text-2xl font-bold">Email your title order</h3>
                <p className="mb-6 mt-3 leading-relaxed text-gray-600">
                  Send your property and loan details to{' '}
                  <a href={EMAIL_ORDER_HREF} className="break-words font-semibold text-emerald-800 underline underline-offset-4">orders@betterclose.co</a>.
                  You don’t need a BetterClose account to send an order.
                </p>
                <a href={EMAIL_ORDER_HREF} className="mt-auto self-start rounded-lg border border-gray-300 px-5 py-3 font-bold hover:bg-gray-50">Email an order</a>
                <p className="mt-3 text-xs text-gray-500">Opens your email app with an order template.</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="support-heading" className="border-y border-gray-100 bg-gray-50 py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <h2 id="support-heading" className="text-3xl font-black tracking-tight">Clear costs. A real person. One place for your file.</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {BENEFITS.map(benefit => (
                <div key={benefit.title}><h3 className="text-lg font-bold">{benefit.title}</h3><p className="mt-3 leading-relaxed text-gray-600">{benefit.description}</p></div>
              ))}
            </div>
            <p className="mt-8 text-sm text-gray-600">Already have a file with us?{' '}<Link href="/login?callbackUrl=/teammate/dashboard" className="font-bold text-emerald-800 underline underline-offset-4">View your files</Link>.</p>
          </div>
        </section>

        <section aria-labelledby="lender-contact-heading" className="py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="flex flex-col justify-between gap-6 rounded-2xl bg-dark-900 p-7 text-white sm:p-9 md:flex-row md:items-center">
              <div><h2 id="lender-contact-heading" className="text-2xl font-bold">Let’s talk about your next closing.</h2><p className="mt-2 text-gray-300">Questions about ordering or working with BetterClose? We’re here to help.</p></div>
              <a href={`tel:${SUPPORT_PHONE_TEL}`} className="shrink-0 self-start rounded-xl bg-white px-6 py-4 font-bold text-dark-900 hover:bg-gray-100 md:self-auto">Call {SUPPORT_PHONE_DISPLAY}</a>
            </div>
            <div className="mt-10 max-w-3xl">
              <h2 className="text-lg font-bold">Need a custom integration?</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">Have a lender-specific workflow? We can discuss whether a custom API integration would be a fit. Scope and availability would be agreed separately; we don’t currently offer self-service API access.</p>
              <a href={CUSTOM_INTEGRATION_HREF} className="mt-3 inline-block text-sm font-semibold text-emerald-800 underline underline-offset-4">Discuss your workflow</a>
            </div>
          </div>
        </section>
      </main>
      <FooterComprehensive />
    </div>
  )
}
