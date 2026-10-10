import Link from 'next/link'
import DiscoveryArticle from '@/components/DiscoveryArticle'
import { publicMetadata } from '@/lib/publicMetadata'

export const metadata = publicMetadata('/guides/keep-your-realtor-and-lender', 'Choose a Title Company & Keep Your Team | BetterClose', 'Learn how to compare a title company while keeping your realtor and lender, confirm lender acceptance and coordinate timing before changing an existing order.')
export default function KeepYourTeam() {
  return <DiscoveryArticle title="Can I choose a title company and keep my realtor and lender?"
    introduction="In many transactions, yes. Comparing a title and settlement provider is a separate decision from choosing your real estate agent or mortgage lender. Confirm your lender’s acceptance, any contract requirements and the closing timeline before placing or changing an order.">
    <section><h2>Start with your lender’s requirements</h2>
      <p>For mortgages using a Loan Estimate, Section C on page 2 identifies services you can shop for. Your lender also provides a written list of providers. An alternative outside that list may be possible if the lender agrees to work with it. <a href="https://www.consumerfinance.gov/ask-cfpb/what-required-mortgage-closing-services-can-i-shop-for-en-154/">See the CFPB’s explanation of services you can shop for</a>.</p>
      <p>Ask your loan officer which title and settlement services are open to your choice and what the lender needs to approve a provider. Your transaction’s contract and local closing requirements may also affect who performs particular services.</p>
    </section>
    <section><h2>Keep your team involved</h2>
      <ol className="list-decimal pl-6">
        <li><strong>Tell your agent and loan officer you are comparing options.</strong> Share your expected closing date and ask whether title work has already been ordered.</li>
        <li><strong>Request equivalent written estimates.</strong> Use the same property, loan, coverage and services. <Link href="/compare-title-fees">Use the title-fee comparison worksheet</Link>.</li>
        <li><strong>Confirm acceptance and timing.</strong> Ask the lender to confirm it can work with your selected provider and ask the closing team whether it can meet the deadline.</li>
        <li><strong>Coordinate the order.</strong> Confirm who will place it and which company will handle each responsibility. Share the closing team’s contact information with your agent and lender.</li>
      </ol>
    </section>
    <section><h2>What if title work has already started?</h2>
      <p>Before changing providers, ask what work is complete, whether charges have been incurred, what documents can be transferred and whether the change could affect your closing date or rate lock. Obtain those answers before asking anyone to cancel an existing order.</p>
      <p>There is no universal “safe to switch” deadline. The answer depends on your file, the work already performed and the parties’ ability to coordinate.</p>
    </section>
    <section><h2>What BetterClose handles</h2>
      <p>BetterClose provides title and settlement services through First National Title &amp; Escrow LLC. Your assigned escrow officer coordinates the closing work with the participants in your file. You can request an estimate while continuing to work with your existing agent and lender.</p>
      <p>Service availability depends on the property and transaction. <Link href="/licenses">Ask our team for state licensing and availability details</Link> before ordering. Getting an estimate does not open a closing or authorize paid work.</p>
    </section>
    <section><h2>A simple way to start the conversation</h2>
      <blockquote className="border-l-4 border-primary-500 pl-5 text-lg">“I’m comparing title and settlement costs while keeping our current team. Has title work been ordered yet? What would you need to confirm you can work with BetterClose, and is there anything in our contract or timeline we should check first?”</blockquote>
    </section>
  </DiscoveryArticle>
}
