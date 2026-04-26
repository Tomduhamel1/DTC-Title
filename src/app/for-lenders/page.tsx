'use client'

import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import PortalWaitlist from '@/components/professional/PortalWaitlist'
import Link from 'next/link'

export default function LendersPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationCredible />
      <div className="h-20"></div>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold mb-4">
                FOR LENDERS
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-dark-900 mb-6 leading-tight">
                Title Insurance Your Borrowers Will <span className="text-blue-600">Thank You For</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                API-first integration. Instant quotes. Happier borrowers. Faster closings. Reduce closing costs and improve satisfaction scores.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:api@betterclose.co"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Request API Access
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="mailto:api@betterclose.co"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors"
                >
                  Schedule Technical Demo
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-blue-200">
              <div className="text-center mb-6">
                <div className="text-5xl font-black text-blue-600 mb-2">API-First</div>
                <div className="text-lg text-gray-600">Seamless Integration</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-dark-900">
                    <strong>Quick Quote API</strong> for instant estimates
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-dark-900">
                    <strong>Advanced Quote API</strong> for detailed scenarios
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-dark-900">
                    <strong>TPS integration</strong> for order submission
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Preview */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-black text-center mb-4">
            Simple, Powerful API
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12">
            Integrate title insurance ordering into your lending platform in minutes
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Request */}
            <div>
              <div className="bg-gray-800 rounded-t-lg px-4 py-2 font-mono text-sm text-gray-400">
                REQUEST
              </div>
              <div className="bg-gray-950 rounded-b-lg p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-green-400">
{`POST /api/quote/quick

{
  "homeValue": 500000,
  "state": "TX",
  "transactionType": "purchase"
}`}
                </pre>
              </div>
            </div>

            {/* Response */}
            <div>
              <div className="bg-gray-800 rounded-t-lg px-4 py-2 font-mono text-sm text-gray-400">
                RESPONSE
              </div>
              <div className="bg-gray-950 rounded-b-lg p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-blue-400">
{`{
  "ourPrice": 800,
  "avgPrice": 3200,
  "savings": 2400,
  "underwriter": "Stewart Title"
}`}
                </pre>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="mailto:api@betterclose.co"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Request Full API Documentation
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Benefits for Lenders */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-4xl font-black text-center text-dark-900 mb-12">
            Benefits for Lenders
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '💰', title: 'Reduce Closing Costs', desc: 'Lower total closing costs improve borrower satisfaction and loan approvals' },
              { icon: '⚡', title: 'Streamline Workflow', desc: 'API integration automates title ordering and eliminates manual processes' },
              { icon: '📊', title: 'Bulk Pricing', desc: 'Volume discounts available for high-volume lenders' },
              { icon: '✅', title: 'Compliance Reporting', desc: 'Automated compliance documentation and audit trails' },
              { icon: '🔔', title: 'Webhook Notifications', desc: 'Real-time status updates pushed to your system' },
              { icon: '🤝', title: 'Dedicated Support', desc: 'Technical account managers for integration and ongoing support' }
            ].map((item, idx) => (
              <div key={idx} className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-dark-900">{item.title}</h3>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Waitlist */}
      <PortalWaitlist
        title="Developer Portal Coming Soon"
        description="Access API documentation, test environment, integration guides, and webhook management all in one developer portal."
        portalType="lender"
      />

      <FooterComprehensive />
    </div>
  )
}
