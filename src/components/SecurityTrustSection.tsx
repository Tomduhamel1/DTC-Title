import Link from 'next/link'

export default function SecurityTrustSection() {
  return (
    <section data-security-guidance className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Describe file controls without promising complete protection. */}
          <div>
            <div className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
              YOUR CLOSING FILE
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Document sharing with clear controls
            </h2>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              Being part of a closing does not automatically give someone access to every document.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Sharing selected by the closing team</h3>
                  <p className="text-gray-300">The closing team chooses which other file participants can access each uploaded document.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Access checked for each document</h3>
                  <p className="text-gray-300">The portal checks file membership and document permissions before providing a preview or download link.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Know what a link shares</h3>
                  <p className="text-gray-300">Quote-sharing links are different: anyone with that link can view the shared estimate. Keep sign-in links to yourself.</p>
                </div>
              </div>
            </div>

            <Link
              href="/security"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold transition-colors"
            >
              Document access &amp; payment guidance
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Payment guidance, not a certification badge or bank-security claim. */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 sm:p-10 text-center shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-xl">
              <svg aria-hidden="true" className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>

            <h3 className="text-3xl font-black mb-3">Before you send funds</h3>
            <p className="text-white mb-6 leading-relaxed">
              Call your closing team using a known, trusted phone number to independently confirm payment instructions. Do not use a new number supplied in the message requesting payment.
            </p>
            <p className="text-white leading-relaxed">
              A portal message or uploaded document is not verification of payment instructions.
            </p>
            <Link href="/privacy" className="inline-block mt-6 text-white underline underline-offset-4">
              How we use your information
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
