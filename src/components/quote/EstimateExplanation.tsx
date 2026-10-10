import Link from 'next/link'

export default function EstimateExplanation() {
  return <section aria-labelledby="estimate-explained" className="max-w-4xl mx-auto px-5 py-12 text-gray-700">
    <h2 id="estimate-explained" className="text-2xl font-bold text-dark-900 mb-4">What your fee estimate includes</h2>
    <p className="mb-6 leading-relaxed">See the title and settlement charges returned for your property and transaction, with insurance premiums, service fees, government charges and any applicable credit identified separately. An estimate is a starting point for review with your closing team, not a final bill or your full cash to close.</p>
    <div className="grid md:grid-cols-2 gap-8">
      <div><h3 className="font-bold text-dark-900 mb-2">Have your property and loan details ready</h3>
        <p className="leading-relaxed">For a purchase, enter the ZIP code and purchase amount. Add the actual loan amount when you know it; if omitted, the estimate assumes a loan of 80% of the purchase amount. For a refinance, enter the ZIP code and loan amount.</p>
        <p className="mt-3 leading-relaxed">The professional form also accepts a state as an initial pricing location. A state-only estimate uses a representative ZIP, which may differ from the actual property. Use the property ZIP for a more specific estimate.</p>
      </div>
      <div><h3 className="font-bold text-dark-900 mb-2">Check the scope before ordering</h3>
        <p className="leading-relaxed">Coverage, endorsements, property details and the services your transaction requires can affect final charges. Ask your closing team to confirm the line items and anything not shown. Lender charges, prepaids and escrow deposits may also affect your full cash to close.</p>
        <p className="mt-3 leading-relaxed">Requesting an estimate is free and does not open a closing or authorize paid work. Availability depends on the location and transaction.</p>
      </div>
    </div>
    <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-4 text-primary-700 font-semibold underline underline-offset-4">
      <Link href="/compare-title-fees">Compare two title quotes</Link>
      <Link href="/pricing-methodology">How savings are calculated</Link>
      <Link href="/closing-comparison-kit">A guide to share with your team</Link>
    </div>
  </section>
}
