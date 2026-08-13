'use client'

import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import Link from 'next/link'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationCredible />
      <div className="h-20"></div>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full font-bold mb-6">
            ⚠️ CRITICAL INFORMATION
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-dark-900 mb-6">
            Security & Fraud Protection
          </h1>
          <p className="text-2xl text-gray-700 leading-relaxed">
            <span className="text-red-600 font-bold">$17.1 billion</span> has been lost to wire fraud since 2014. Your security is our top priority.
          </p>
        </div>
      </section>

      {/* Wire Fraud Warning */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-xl mb-12">
            <h2 className="text-3xl font-black text-red-900 mb-4">
              🚨 Wire Fraud Alert
            </h2>
            <p className="text-lg text-red-900 mb-4">
              <strong>Criminals are targeting homebuyers with fake wire instructions.</strong> This is the most common way people lose money in real estate transactions.
            </p>
            <p className="text-lg text-red-900">
              <strong>Always verify wire instructions by phone before sending money.</strong> Call us at <a href="tel:1-800-316-9508" className="underline font-bold">1-800-316-9508</a> to confirm any wire transfer details.
            </p>
          </div>

          <h2 className="text-4xl font-black text-dark-900 mb-8">
            How We Protect You
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-900 mb-2">256-Bit SSL Encryption</h3>
                  <p className="text-gray-700">
                    All documents and data are encrypted with bank-level security. Your information is protected in transit and at rest.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-900 mb-2">Multi-Factor Wire Verification</h3>
                  <p className="text-gray-700">
                    All wire instructions are verified through multiple channels. We'll call you to confirm details before any wire transfer is processed.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-900 mb-2">Secure Document Portal</h3>
                  <p className="text-gray-700">
                    Upload and download documents through our encrypted portal. No sensitive information is ever sent via email.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-900 mb-2">24/7 Security Monitoring</h3>
                  <p className="text-gray-700">
                    Our systems are monitored around the clock for suspicious activity. Any unusual behavior triggers immediate investigation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices Checklist */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-black text-dark-900 mb-8 text-center">
            Protect Yourself: Best Practices
          </h2>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-lg text-dark-900 mb-2">Always Verify Wire Instructions by Phone</h3>
                  <p className="text-gray-700">
                    Call us at 1-800-316-9508 to confirm wire details. Use a number you look up yourself - not one from an email.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-lg text-dark-900 mb-2">Never Email Sensitive Banking Information</h3>
                  <p className="text-gray-700">
                    Legitimate companies will never ask for account numbers, passwords, or SSNs via email.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-lg text-dark-900 mb-2">Be Suspicious of Last-Minute Changes</h3>
                  <p className="text-gray-700">
                    If wire instructions change suddenly, it's likely fraud. Always verify by phone before sending money.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-lg text-dark-900 mb-2">Double-Check Email Addresses</h3>
                  <p className="text-gray-700">
                    Scammers use addresses that look similar to legitimate ones. Look for small differences like extra letters or domains.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="font-bold text-lg text-dark-900 mb-2">Report Suspicious Activity Immediately</h3>
                  <p className="text-gray-700">
                    If something feels off, call us right away. It's better to be cautious than to lose your life savings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Certifications */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-black text-dark-900 mb-8">
            Compliance & Certifications
          </h2>
          <div className="max-w-md mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-4">🏛️</div>
              <h3 className="font-bold text-lg mb-2">State Licensed</h3>
              <p className="text-gray-600 text-sm">Licensed and regulated in every state we serve</p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-gradient-to-br from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-4xl font-black mb-4">
            Suspect Fraud?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Contact us immediately if you receive suspicious emails or wire instructions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:1-800-316-9508"
              className="inline-flex items-center justify-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call 1-800-316-9508
            </a>
            <a
              href="mailto:fraud@betterclose.co"
              className="inline-flex items-center justify-center gap-2 bg-red-800 text-white border-2 border-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Fraud Team
            </a>
          </div>
          <p className="mt-6 text-sm text-red-200">
            24/7 fraud hotline • Immediate response
          </p>
        </div>
      </section>

      <FooterComprehensive />
    </div>
  )
}
