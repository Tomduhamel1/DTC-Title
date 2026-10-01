import Link from 'next/link'
import PolicyPage, { PolicySection } from '@/components/PolicyPage'

export const metadata = {
  title: 'Terms of Service · BetterClose · Review draft',
  description: 'Review draft of terms for the BetterClose website and file portal.',
  robots: { index: false, follow: false },
}

export default function TermsPage() {
  return <PolicyPage title="Terms of Service"
    introduction="Guidelines for using BetterClose estimates, file services, and document sharing."
    reviewItems={[
      'BetterClose is a DBA of First National Title & Escrow, as confirmed by the owner. Confirm the full legal entity name, including any suffix, and align these terms with the applicable closing and settlement agreements.',
      'Review whether an acceptance step is needed for account or order terms without adding one to free estimates. This draft does not add a click-to-accept requirement or record agreement on behalf of existing users.',
      'Have counsel confirm any required eligibility, jurisdiction, consumer-protection, and other provisions. No arbitration clause, governing-law choice, or liability cap has been invented.',
      'Create and verify contact@betterclose.co and its forwarding to Steve before publishing it as the legal and privacy contact.',
      'Use the final publication date as the effective date, as approved by the owner. This draft is not yet effective; approve the final text before removing the draft notice or allowing search indexing.',
    ]}>
    <PolicySection title="What BetterClose provides">
      <p>BetterClose is a DBA (doing business as) of First National Title &amp; Escrow. BetterClose provides online title and settlement fee estimates, request forms, and a portal for file information and documents. Available features and services depend on the transaction, location, and participating closing team.</p>
      <p>These website terms do not replace a signed engagement, escrow instruction, settlement agreement, title insurance policy, loan document, or other agreement governing your transaction.</p>
    </PolicySection>
    <PolicySection title="Free estimates, no obligation">
      <p>Requesting a BetterClose estimate is free and carries no obligation to order title or settlement services. Getting an estimate does not authorize paid work.</p>
      <p>If you decide to order title or settlement services, the scope of work and any applicable charges are addressed separately with your closing team and in the agreements governing your transaction.</p>
    </PolicySection>
    <PolicySection title="Estimates are not final closing figures">
      <p>Estimates depend on the information provided and the fees and assumptions available when they are generated. Final fees can change with the property, loan, title work, services required, and applicable government or third-party charges.</p>
      <p>A comparison or savings illustration is not a guarantee of savings or a lender&apos;s Loan Estimate or Closing Disclosure. It is not a loan approval, rate lock, title commitment, or insurance policy. Review the final figures and transaction documents with your lender and closing team.</p>
    </PolicySection>
    <PolicySection title="Opening and following a file">
      <p>Submitting a request or receiving an automated acknowledgment does not by itself confirm acceptance of an engagement or that title work has started. Confirm your file&apos;s status and any deadlines with the assigned closing team.</p>
      <p>The portal displays information supplied by participants and connected systems. Updates may not appear immediately. If information is missing or seems incorrect, contact your closing team rather than relying on a displayed milestone for a time-sensitive decision.</p>
    </PolicySection>
    <PolicySection title="Your account and access">
      <p>Use an email account you control and provide accurate information about your role. You may access only files and documents you are authorized to see. Do not share sign-in links, use another person&apos;s access, misrepresent your identity, or try to bypass access controls.</p>
      <p>If you receive access to an unfamiliar file or believe your email account or access link has been compromised, stop using that access and contact BetterClose.</p>
    </PolicySection>
    <PolicySection title="Documents and information you share">
      <p>Submit accurate information and only documents you are authorized to provide for the transaction. Do not upload malicious software, unrelated sensitive information, or content that violates another person&apos;s rights.</p>
      <p>Documents you upload to a file are available to you and the closing team. The closing team controls sharing with other file participants. Review the document&apos;s status and recipients where shown, and confirm receipt of deadline-sensitive material with the team. Uploading a document is not confirmation that it has been accepted, reviewed, signed, or recorded.</p>
      <p>A shared quote link does not require sign-in and can be forwarded. Share it only with intended recipients. Information handling is described in the{' '}
        <Link href="/privacy" className="text-primary-700 underline underline-offset-4">Privacy Policy</Link>.
      </p>
    </PolicySection>
    <PolicySection title="Email preferences">
      <p>File participants can manage the notification choices available to their role. Agents, brokers, and lenders can choose borrower-update defaults and adjust them per file; enable updates only for the correct borrower and intended recipients.</p>
      <p>Those choices do not authorize document sharing, change another participant&apos;s own preferences, or replace direct communication about deadlines. You can still request a sign-in link when optional file updates are off.</p>
    </PolicySection>
    <PolicySection title="Verify money-transfer instructions independently">
      <p>Do not send money based solely on an email, portal message, or uploaded document. Independently verify wire or payment instructions with your closing team using a known, trusted phone number. Treat a request to change payment instructions as a reason to verify again.</p>
    </PolicySection>
    <PolicySection title="Responsible use and service availability">
      <p>Do not interfere with the service, attempt unauthorized access, distribute access links publicly, or use the service for unlawful activity. Access may be restricted to address security, unauthorized use, or legal requirements.</p>
      <p>Online features may be unavailable during maintenance, interruptions, or third-party outages. Contact the closing team directly if an interruption could affect your transaction. Service availability for a state or transaction should be confirmed with the team.</p>
    </PolicySection>
    <PolicySection title="Questions and updates">
      <p>Contact BetterClose if you have questions about the website or these terms. For legal, tax, lending, or insurance advice about your circumstances, consult the appropriate qualified professional. Updated website terms will identify their effective date.</p>
    </PolicySection>
  </PolicyPage>
}
