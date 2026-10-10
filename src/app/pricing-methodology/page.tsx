import Link from 'next/link'
import DiscoveryArticle from '@/components/DiscoveryArticle'
import { publicMetadata } from '@/lib/publicMetadata'
import { LIFETIME_RATE_PCT, LIFETIME_TERM_YEARS, formatCurrency } from '@/lib/feeReport'
import { estimateSavings } from '@/lib/stateSavings'

export const metadata = publicMetadata('/pricing-methodology', 'How BetterClose Calculates Estimated Savings', 'Understand BetterClose service-fee comparisons, promotional credits, market evidence and the assumptions behind at-closing and over-loan savings.')
const NATIONAL_EXAMPLE_VALUE = 500000
const example = estimateSavings(NATIONAL_EXAMPLE_VALUE, 'purchase', null)
export default function PricingMethodology() {
  return <DiscoveryArticle title="How BetterClose calculates estimated savings"
    introduction="Our estimate separates the fees you would pay from the comparison used to illustrate possible savings. The comparison is a model, and your own itemized alternative quote is the best way to check what you could save on your closing.">
    <section><h2>Compare a service package</h2>
      <p>Providers bundle title and settlement work differently. Our model groups comparable service charges into a package, then compares that package with the low end of the applicable comparison range. Using one provider’s settlement line alone can miss fees listed elsewhere.</p>
      <p>The estimated service saving is the comparison’s low-end service total minus BetterClose’s comparable service total, with a minimum of zero. A zero saving means the model shows no positive service-fee advantage. It does not establish that the providers charge the same total.</p>
      <p>Lines without a comparison range do not create modeled service savings. Confirm that the services and policy coverage in two real quotes match before drawing a conclusion.</p>
    </section>
    <section><h2>What is—and is not—in the savings figure</h2>
      <ul className="list-disc pl-6">
        <li><strong>Comparable service charges</strong> can contribute to the estimated savings.</li>
        <li><strong>Title insurance premiums, government charges and other pass-through fees</strong> are kept separate and are not counted as savings under our current pricing policy.</li>
        <li><strong>An applicable promotional credit</strong> lowers the estimated amount paid and contributes to the at-closing savings figure. It appears separately and is counted once. Availability and terms depend on the transaction and location; confirm them with the closing team.</li>
      </ul>
      <p>A credit and a lower service fee are different sources of savings. Review both when deciding whether an estimate is competitive. The displayed saving is not a guarantee that BetterClose is the lowest-priced option.</p>
    </section>
    <section><h2>Where comparison ranges come from</h2>
      <p>The model uses published fee schedules, calculator results or collected quotes where available. Evidence varies by state and transaction type. Some comparisons have several providers; others have only one or two. Where local evidence is insufficient, the model can use an inferred range drawn from other observed markets.</p>
      <p>An inferred range is not a survey of current providers in your location. Even a published schedule may differ from the fees for your specific property, coverage and closing date. Ask which basis applies to your estimate and compare a current written quote with equivalent scope.</p>
      <p>We do not present the national illustration as average customer savings, a nationwide price ranking or proof that every customer will save.</p>
    </section>
    <section><h2>“At closing” and “over the loan” are different</h2>
      <p>The at-closing figure is the modeled service saving plus any applicable promotional credit. The over-loan figure includes that same amount plus modeled interest avoided if you borrow that much less and keep the loan for the full modeled term.</p>
      <p>The current model uses {LIFETIME_RATE_PCT}% over {LIFETIME_TERM_YEARS} years. It does not change your mortgage rate or mean you receive the larger figure in cash at closing. Your actual rate, financing choices, repayment timing or refinance can change the interest outcome.</p>
      <div className="rounded-xl border border-gray-200 p-5">
        <h3>Illustration from the shared model</h3>
        <p className="mt-2">For the national {formatCurrency(NATIONAL_EXAMPLE_VALUE)} purchase illustration: <strong>{formatCurrency(example.saveAtClosing)} at closing</strong> and <strong>{formatCurrency(example.saveOverLoan)} total over the loan</strong>. The {formatCurrency(example.saveOverLoan)} includes the {formatCurrency(example.saveAtClosing)}; the two figures must not be added together.</p>
        <p className="text-sm">This is an illustrative model output, not a current property quote or an observed customer result.</p>
      </div>
    </section>
    <section><h2>Check your own estimate</h2>
      <ol className="list-decimal pl-6"><li>Confirm the property location, purchase or refinance details, loan amount and estimate date.</li><li>Match the included services and insurance coverage with your alternative quote.</li><li>Separate service-fee differences from credits and confirm credit eligibility.</li><li>Ask your closing team to explain missing items, the comparison basis and any changed charges.</li></ol>
      <p><Link href="/compare-title-fees">Use the fee-comparison worksheet</Link> or <Link href="/licenses">check service availability with our team</Link>.</p>
    </section>
  </DiscoveryArticle>
}
