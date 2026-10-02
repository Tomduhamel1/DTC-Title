import Link from 'next/link'

export default function SecurityTrustSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Security Messaging */}
          <div>
            <div className="inline-block bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
              ⚠️ IMPORTANT
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Protect Your Largest Investment
            </h2>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              Protect your information and independently verify payment instructions before sending money.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Encrypted Website Connection</h3>
                  <p className="text-gray-400">HTTPS encrypts the connection between your browser and BetterClose.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Verify Payment Instructions</h3>
                  <p className="text-gray-400">Call your closing team using a known, trusted phone number before sending funds.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Private Document Sharing</h3>
                  <p className="text-gray-400">Share sensitive documents through your file’s document section.</p>
                </div>
              </div>
            </div>

            <Link
              href="/security"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold transition-colors"
            >
              Learn more about our security measures
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Right: Security Badge/Visual */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-12 text-center shadow-2xl">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-full mb-6 shadow-xl">
              <svg className="w-20 h-20 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <h3 className="text-3xl font-black mb-3">Your Privacy Matters</h3>
            <p className="text-primary-100 mb-6">
              We never sell your information. Your privacy is our priority.
            </p>

            <div className="flex justify-center gap-6 mb-6">
              <div>
                <div className="text-4xl font-black mb-1">HTTPS</div>
                <div className="text-sm text-primary-200">Website Connection</div>
              </div>
              <div className="w-px bg-primary-400"></div>
              <div>
                <div className="text-4xl font-black mb-1">Private</div>
                <div className="text-sm text-primary-200">File Access</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
