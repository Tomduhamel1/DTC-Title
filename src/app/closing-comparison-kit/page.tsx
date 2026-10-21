import Link from 'next/link'
import DiscoveryArticle from '@/components/DiscoveryArticle'
import MarketingDisclosure from '@/components/MarketingDisclosure'
import { publicMetadata } from '@/lib/publicMetadata'
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from '@/lib/contact'

export const metadata = publicMetadata('/closing-comparison-kit', 'Closing Cost Comparison Guide for Buyers & Their Team | BetterClose', 'A shareable closing checklist for buyers, real estate agents and loan officers: match title quotes, confirm lender acceptance and coordinate the title order.')
export default function ClosingComparisonKit() {
  return <div className="closing-comparison-kit">
    <DiscoveryArticle title="Compare your closing costs. Keep your team."
      introduction="A practical checklist for homebuyers, real estate agents and loan officers comparing title and settlement providers together.">
      <section><h2>1. Compare the same closing</h2>
        <p>Ask for written estimates using the same property, purchase or refinance details, loan amount, coverage and expected closing date. Compare all required service fees together; one low settlement fee may not include the full package.</p>
        <p>List insurance premiums, government charges and promotional credits separately. Ask about anything missing. <Link href="/compare-title-fees">Use the side-by-side worksheet</Link>.</p>
      </section>
      <section><h2>2. Confirm that the provider fits your file</h2>
        <p>Ask your loan officer which services you can shop for and whether the lender can work with the provider you choose. Check your contract and local closing requirements. Confirm the provider’s legal entity, service availability, point of contact and ability to meet the deadline.</p>
        <p><Link href="/guides/keep-your-realtor-and-lender">Read about choosing title services while keeping your agent and lender</Link>.</p>
      </section>
      <section><h2>3. Coordinate before placing or changing an order</h2>
        <p>Find out whether title work has already started. Ask about completed work, incurred charges, document transfer and timing before canceling an existing order. Confirm who will place the new order and share the closing team’s contact information.</p>
      </section>
      <section><h2>Questions to send with the estimates</h2>
        <ul className="list-disc pl-6"><li>Do both quotes include the same services, policies and endorsements?</li><li>Which amounts are service fees, premiums, government charges or credits?</li><li>Are any fees missing, estimated differently or bundled into another line?</li><li>Can the lender accept this provider, and can the team meet our closing date?</li></ul>
      </section>
      <section><h2>Start a BetterClose comparison</h2>
        <p>Requesting an estimate is free and does not open a closing or authorize paid work. Service availability and fees depend on your transaction and location.</p>
        <p><Link href="/quote">Buyer estimate</Link> · <Link href="/quote?source=broker">Professional estimate</Link> · <Link href="/pricing-methodology">Savings methodology</Link></p>
        <p>Questions? <a href={`tel:${SUPPORT_PHONE_TEL}`}>{SUPPORT_PHONE_DISPLAY}</a> · <a href="mailto:contact@betterclose.co">contact@betterclose.co</a></p>
        <MarketingDisclosure />
      </section>
      <section className="print:hidden"><h2>Share the checklist</h2><p>Copy this page’s address for your buyer, agent or loan officer. <a href="/pdfs/betterclose-closing-comparison-guide.pdf" download>Download the printable guide</a>.</p></section>
    </DiscoveryArticle>
  </div>
}
