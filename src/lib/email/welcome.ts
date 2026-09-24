import { sendEmail } from '@/lib/aws/ses'
import { SUPPORT_PHONE_DISPLAY, SUPPORT_PHONE_TEL } from '@/lib/contact'
import type { TeammateRole } from '@/lib/professional/pronoun'
import { emailButton, escapeEmailHtml as escapeHtml, renderEmail } from './layout'

export interface PlacingParty {
  role: TeammateRole
  // Only consumed when role === 'lender'. For any other role, lenderCompany
  // is ignored so we never produce "Your broker from Acme Lending".
  lenderCompany?: string | null
}

export interface WelcomeEmailData {
  borrowerEmail: string
  closingId?: string
  borrowerName?: string
  propertyAddress?: string
  baseUrl: string
  // Only server-side intake callers select receipt copy. A dashboard welcome
  // is not evidence of the Garden title_ordered milestone, including pre-open.
  purpose?: 'request_received' | 'dashboard_ready'
  // Optional structured placing-party, never inferred from a borrower's role.
  placingParty?: PlacingParty
}

// Build the attribution prefix without asserting that the file is open.
// Only the lender case opts into the company-name suffix — brokers/realtors/
// unknown never append a lender company even if one was passed.
function placingPartySentencePrefix(p?: PlacingParty): string {
  if (!p) return 'Your closing team'
  switch (p.role) {
    case 'lender':
      return p.lenderCompany ? `Your lender from ${p.lenderCompany}` : 'Your lender'
    case 'broker':
      return 'Your broker'
    case 'realtor':
      return 'Your real estate agent'
    default:
      return 'Your closing team'
  }
}

export async function sendWelcomeEmail(d: WelcomeEmailData): Promise<string> {
  const greeting = d.borrowerName ? `Hi ${d.borrowerName.split(' ')[0]},` : 'Hi,'
  const claimUrl = `${d.baseUrl}/welcome?email=${encodeURIComponent(d.borrowerEmail)}` +
    (d.closingId ? `&closingId=${encodeURIComponent(d.closingId)}` : '')
  const property = d.propertyAddress ? ` for <strong>${escapeHtml(d.propertyAddress)}</strong>` : ''
  const propertyText = d.propertyAddress ? ` for ${d.propertyAddress}` : ''
  const placingPrefix = placingPartySentencePrefix(d.placingParty)

  const isReceipt = d.purpose === 'request_received'
  const receiptLead = d.placingParty && d.placingParty.role !== 'unknown'
    ? `${placingPrefix} submitted your title order request with BetterClose`
    : "We've received your title order request"
  const lead = isReceipt ? receiptLead : `${placingPrefix} shared your title order details with BetterClose`
  const explanation = isReceipt
    ? 'This confirms receipt of the request; your closing team still needs to open the file. Your BetterClose dashboard is ready to follow updates from your closing team.'
    : 'Your dashboard is ready to follow updates from your closing team. A separate title-order update confirms when the file is opened.'
  const subject = isReceipt ? 'We received your title order request · BetterClose' : 'Your BetterClose dashboard is ready'
  // Do not print the support-number placeholder as a real contact option.
  const supportText = `Questions? Reply to this email${SUPPORT_PHONE_TEL ? ` or call ${SUPPORT_PHONE_DISPLAY}` : ''}.`
  const htmlBody = renderEmail({
    title: isReceipt ? 'Your title order request was received' : 'Your BetterClose dashboard is ready',
    contentHtml: `<p>${escapeHtml(greeting)}</p>
    <p>${escapeHtml(lead)}${property}. ${escapeHtml(explanation)}</p>
    ${emailButton(claimUrl, 'Open my dashboard →')}
    <p>One-tap sign-in. No password to remember.</p>
    <p style="margin-top:28px;">
      Welcome,<br>
      The BetterClose Team
    </p>`,
    footerHtml: escapeHtml(supportText),
  })

  const textBody = `${greeting}

${lead}${propertyText}. ${explanation}

Open your dashboard: ${claimUrl}

One-tap sign-in. No password to remember.

Welcome,
The BetterClose Team

${supportText}`

  return sendEmail({
    to: d.borrowerEmail,
    replyTo: process.env.HELLO_EMAIL || 'hello@betterclose.co',
    subject,
    htmlBody,
    textBody,
  })
}
