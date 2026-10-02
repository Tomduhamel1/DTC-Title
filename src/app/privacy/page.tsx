import PolicyPage, { PolicySection } from '@/components/PolicyPage'

export const metadata = {
  title: 'Privacy Policy · BetterClose · Review draft',
  description: 'Review draft of the BetterClose website and file portal privacy policy.',
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  return <PolicyPage title="Privacy Policy"
    introduction="How information is used when you request an estimate, open a file, or use the BetterClose portal."
    reviewItems={[
      'Have the company\'s legal reviewer align this website policy with FNTE\'s supplied customer Privacy Policy Notice. That notice permits marketing-related disclosures; BetterClose\'s owner confirmed that the marketing activities excluded below do not occur. The notice is not evidence that those disclosures actually occur.',
      'Confirm the record-specific retention and privacy-request procedures, including applicable state and underwriter requirements. This draft does not promise an automatic deletion deadline or change stored records.',
      'Confirm applicable financial privacy notices, state-specific rights and request or opt-out mechanisms. The supplied customer notice has been reviewed; this website policy does not replace transaction-specific notices.',
      'Use the final publication date as the effective date, as approved by the owner. This draft is not yet effective; complete final legal and publication checks before removing the draft notice or allowing search indexing.',
    ]}>
    <PolicySection title="About this policy">
      <p>BetterClose is a DBA (doing business as) of First National Title &amp; Escrow LLC. This policy covers the BetterClose website and file portal and describes information handled through these online services.</p>
      <p>Your lender, title insurer, real estate professional, and other transaction participants may have their own privacy notices. Separate notices may also apply to your title, escrow, or settlement services.</p>
    </PolicySection>
    <PolicySection title="Information you provide">
      <p>Depending on the features you use, we receive contact and account information such as your name, email address, phone number, company, and role in a transaction.</p>
      <p>For estimates and file services, we receive property details, purchase price, loan amount, transaction type, closing information, and information you provide in forms or messages. Documents you upload may contain personal or financial information. Upload only information needed for your transaction and that you are authorized to share.</p>
    </PolicySection>
    <PolicySection title="Information received from others">
      <p>Your lender, broker, real estate agent, or closing team may provide your contact details and transaction information to open or manage a file. Connected closing systems may provide file details, assigned team members, status updates, estimates, and documents selected for sharing.</p>
    </PolicySection>
    <PolicySection title="Browser and service information">
      <p>Cookies and browser storage support sign-in, security, and the estimate process. The site also records service activity, such as submitted requests, document actions, and notification delivery. Hosting and diagnostic services may process technical information such as IP addresses, browser details, request information, and errors.</p>
      <p>You can control cookies and stored site data through your browser. Blocking or clearing them may sign you out or remove an estimate you have not saved.</p>
    </PolicySection>
    <PolicySection title="How information is used">
      <ul className="list-disc pl-5 space-y-2">
        <li>Generate fee estimates using the transaction and location details you provide.</li>
        <li>Receive and respond to requests, coordinate file opening, and provide access to file information.</li>
        <li>Exchange documents with the closing team and authorized participants.</li>
        <li>Send sign-in links, requested communications, and file updates according to the applicable notification choices.</li>
        <li>Maintain service records, investigate errors, protect access, and respond to questions or legal requirements.</li>
      </ul>
    </PolicySection>
    <PolicySection title="When information is shared">
      <p>Information needed to handle your request or transaction is available to the closing team and, as appropriate, the lender, broker, agent, borrower, and other authorized file participants. File documents use document-specific access and sharing controls; being on a file does not automatically make every document available.</p>
      <p>Service providers process information to support hosting, data and document storage, email delivery, fee calculation, security, and diagnostics. Information may also need to be disclosed to meet applicable legal requirements or protect the service and its users.</p>
      <p>A shared quote link can be viewed by anyone who has that link, without signing in. It can display the estimate and property or professional information included with it. Send those links only to intended recipients. Sign-in links are personal and should not be forwarded.</p>
    </PolicySection>
    <PolicySection title="No sale of information or marketing use">
      <p>We do not sell your personal information or share it with other companies for their own marketing. We do not send promotional emails or use customer lists for targeted advertising.</p>
      <p>This does not prevent us from sharing information needed to provide the services described above, responding to your requests, or sending sign-in links and file updates according to the applicable notification choices.</p>
    </PolicySection>
    <PolicySection title="Email and file choices">
      <p>Agents, brokers, and lenders can set default borrower-update preferences in My settings and adjust the choices for an individual file. Borrower updates for professional-initiated files are off by default unless enabled through those choices. A borrower who starts their own request can receive communications about that request.</p>
      <p>Borrower-update settings do not change the professional&apos;s own updates or provide access to documents. Where available, you can mute your own file updates from the file page. Sign-in links you request and other essential service communications are separate.</p>
      <p>Contact us about incorrect information, account access, or a privacy request. Applicable rights depend on the information and the law that applies. We may need to verify your identity and your connection to the file before providing information or making a change.</p>
    </PolicySection>
    <PolicySection title="Retention and protection">
      <p>How long records need to be kept depends on the type of information, whether a transaction was opened or completed, applicable legal and regulatory requirements, underwriter obligations, and legitimate needs such as completing services or resolving claims and disputes. Different retention requirements can apply to unused estimates and inquiries and to title, escrow, and settlement records.</p>
      <p>Records may need to be preserved for an audit, investigation, claim, or legal proceeding. Closing a portal account, changing email preferences, or requesting deletion does not necessarily remove transaction records that must be retained by the closing team or other participants.</p>
      <p>BetterClose uses sign-in and file-access controls to protect information. No online service can guarantee absolute security. Protect access to your email account, avoid forwarding sign-in links, and contact the closing team if you suspect unauthorized access.</p>
    </PolicySection>
    <PolicySection title="Other services and policy updates">
      <p>Links to another organization&apos;s website are subject to that organization&apos;s policies. Updated versions of this policy will identify their effective date. Review the current version when you have questions about these online services.</p>
    </PolicySection>
  </PolicyPage>
}
