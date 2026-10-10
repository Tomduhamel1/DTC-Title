import Link from 'next/link'
import DiscoveryArticle from '@/components/DiscoveryArticle'
import { publicMetadata } from '@/lib/publicMetadata'

export const metadata = publicMetadata('/compare-title-fees', 'How to Compare Title & Settlement Fees | BetterClose', 'Compare itemized title quotes for the same property, loan and services. Use a free worksheet to separate service fees, premiums, government charges and credits.')
const rows = [
  ['Settlement or closing fee', 'Who conducts the closing, and what is included?'],
  ['Title search and examination', 'Included in another fee or charged separately?'],
  ['Other title and settlement service fees', 'List every required item, including document, delivery and signing charges.'],
  ['Total service fees', 'Add all required service fees without counting bundled items twice.'],
  ["Lender’s title insurance", 'Match policy coverage, loan amount and endorsements.'],
  ["Owner’s title insurance", 'Match coverage and confirm whether it is included.'],
  ['Government charges', 'Match recording charges and transfer taxes; these are not provider service fees.'],
  ['Credits or promotions', 'Show the amount, eligibility, expiry and who receives it.'],
  ['Total quoted title and settlement cost', 'Add service fees, premiums and government charges; subtract applicable credits once.'],
]

export default function CompareTitleFees() {
  return <DiscoveryArticle title="How to compare title and settlement fees"
    introduction="Put two itemized quotes side by side for the same property, loan and closing services. Compare the total package first, then identify which fees explain the difference.">
    <section><h2>Start with the same transaction</h2>
      <p>Give each provider the same property location, purchase or refinance details, purchase price where applicable, loan amount and expected closing date. Ask each to identify its assumptions, exclusions and estimate date.</p>
      <p>A lower settlement fee alone does not establish a lower total. One provider may bundle work that another lists separately. Ask for written clarification of any missing item before comparing totals.</p>
    </section>
    <section><h2>Separate four parts of the quote</h2>
      <ol className="list-decimal pl-6">
        <li><strong>Service fees.</strong> Compare the complete package of title search, examination, settlement and other required services. Note which items are bundled.</li>
        <li><strong>Title insurance premiums.</strong> Compare equivalent coverage and ask which endorsements and any applicable discounts are included. Keep premiums separate from service-fee savings.</li>
        <li><strong>Government charges.</strong> Check that both estimates use the same recording and tax assumptions. A different estimate of a government charge is not evidence that a provider charges less for its services.</li>
        <li><strong>Credits.</strong> Separate recurring fee differences from a promotion. Confirm eligibility and count a credit only once.</li>
      </ol>
    </section>
    <section><h2>A worksheet for your two quotes</h2>
      <p>Use this checklist with both written quotes. Print the page or copy the rows into your own notes. “Not shown” means you still need an answer; it does not mean $0.</p>
      <div className="space-y-3">
        {rows.map(([name, note]) => <div key={name} className="border border-gray-200 rounded-xl p-4 break-inside-avoid">
          <h3>{name}</h3><p className="text-sm mt-1">{note}</p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm"><p>Quote A: <span className="block border-b border-gray-400 h-6" /></p><p>Quote B: <span className="block border-b border-gray-400 h-6" /></p></div>
        </div>)}
      </div>
      <p className="text-sm mt-5">This worksheet compares title and settlement costs. It is not a Loan Estimate and does not calculate your full cash to close, which can include other loan costs, prepaids and escrow deposits.</p>
    </section>
    <section><h2>Ask about service as well as price</h2>
      <p>Confirm who will handle your file, how to reach them, what happens when a title issue arises and whether the team can meet your timeline. Ask for the legal name of the company handling your transaction and licensing information for the property’s state.</p>
      <p>Request a BetterClose estimate to see the actual line items for your transaction. A general example or a headline savings figure cannot tell you which provider costs less for your particular closing.</p>
    </section>
    <section><h2>Where to find the services you can shop for</h2>
      <p>The CFPB points borrowers to Section C on page 2 of the Loan Estimate. For title costs, it recommends comparing the combined total rather than relying on individual line items. <a href="https://www.consumerfinance.gov/owning-a-home/close/shop-for-title-insurance-and-other-closing-services/">Read the CFPB’s closing-service shopping guide</a>.</p>
      <p><Link href="/guides/keep-your-realtor-and-lender">Learn how choosing a title company fits with keeping your realtor and lender</Link>.</p>
    </section>
  </DiscoveryArticle>
}
