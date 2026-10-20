'use client'

import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import Link from 'next/link'
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from '@/lib/contact'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationCredible />
      <div className="h-20" />
      <main data-security-guidance className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-gray-700 leading-relaxed">
        <h1 className="text-3xl sm:text-5xl font-black text-dark-900 mb-6">Security & Wire-Fraud Awareness</h1>
        <p className="text-lg mb-10">
          Before sending closing funds, independently confirm payment instructions with your closing team.
          A familiar name, logo or email address is not proof that a request is genuine.
        </p>

        <section aria-labelledby="before-sending" className="mb-10">
          <h2 id="before-sending" className="text-2xl font-bold text-dark-900 mb-4">Before you send funds</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Call your closing team using a trusted number.</strong> Use a phone number you previously verified with your closing team.
              Do not use a new number supplied in the message requesting payment.
            </li>
            <li>
              <strong>Confirm the instructions directly.</strong> Verify the recipient, bank and account details before initiating the transfer.
              Do not rely on an email reply alone.
            </li>
            <li>
              <strong>Stop if instructions change.</strong> Unexpected or last-minute changes and pressure to act immediately
              are reasons to pause and independently verify the request.
            </li>
          </ol>
          <p className="mt-6">
            Banks process funds transfers. A portal message or uploaded document does not verify payment instructions.
            Independently confirm instructions with your closing team before sending funds.
          </p>
        </section>

        <section aria-labelledby="suspect-fraud" className="mb-10 border-l-4 border-red-600 bg-red-50 p-5 sm:p-6 rounded-r-xl">
          <h2 id="suspect-fraud" className="text-2xl font-bold text-red-900 mb-4">If you suspect wire fraud</h2>
          <p className="mb-4">
            If you already sent funds to a suspected fraudulent account, contact your sending bank immediately and request a wire recall. Then notify your closing team. Recovery is not guaranteed.
          </p>
          <p>
            Report suspected fraud to the FBI’s <a href="https://www.ic3.gov/" className="text-primary-700 underline">Internet Crime Complaint Center</a>.
            {' '}Do not wait for a BetterClose email response before contacting your bank.
          </p>
        </section>

        <section aria-labelledby="your-information" className="mb-10">
          <h2 id="your-information" className="text-2xl font-bold text-dark-900 mb-4">Protect your information</h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Keep sign-in links private and protect access to the email account you use to sign in.</li>
            <li>Do not send passwords or sensitive banking details in ordinary email. Ask your closing team which documents are required and how to share them.</li>
            <li>Quote-sharing links can be opened by anyone with the link. Send them only to intended recipients.</li>
            <li>Contact your closing team if you see an unfamiliar file or suspect someone has accessed your account.</li>
          </ul>
          <p className="mt-6">
            Read our <Link href="/privacy" className="text-primary-700 underline">Privacy Policy</Link> for information about how personal information is collected, used and shared.
          </p>
        </section>

        <section aria-labelledby="contact-team" className="border-t border-gray-200 pt-8">
          <h2 id="contact-team" className="text-2xl font-bold text-dark-900 mb-4">Contact BetterClose</h2>
          <p>
            Need help reaching your closing team? Call <a href={`tel:${SUPPORT_PHONE_TEL}`} className="text-primary-700 underline">{SUPPORT_PHONE_DISPLAY}</a> or email{' '}
            <a href="mailto:contact@betterclose.co" className="text-primary-700 underline break-words">contact@betterclose.co</a>.
          </p>
          <p className="mt-4 text-sm">
            Additional guidance: <a href="https://www.consumerfinance.gov/archive/blog/mortgage-closing-scams-how-protect-yourself-and-your-closing-funds/" className="text-primary-700 underline">Consumer Financial Protection Bureau — mortgage closing scams</a>.
          </p>
        </section>
      </main>
      <FooterComprehensive />
    </div>
  )
}
