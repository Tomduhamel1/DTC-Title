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
  // Optional structured placing-party. If omitted, copy defaults to "Your
  // closing team just opened your title order..."
  placingParty?: PlacingParty
}

// Build the sentence prefix for "${prefix} just opened your title order...".
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

  const subject = 'Your BetterClose dashboard is ready'
  // Do not print the support-number placeholder as a real contact option.
  const supportText = `Questions? Reply to this email${SUPPORT_PHONE_TEL ? ` or call ${SUPPORT_PHONE_DISPLAY}` : ''}.`
  const htmlBody = renderEmail({
    title: 'Your closing is with BetterClose',
    contentHtml: `<p>${escapeHtml(greeting)}</p>
    <p>${escapeHtml(placingPrefix)} just opened your title order with BetterClose${property}. We've created a dashboard so you can track every step — loan locked, title ordered, title issued, and closed.</p>
    ${emailButton(claimUrl, 'Open my dashboard →')}
    <p>One-tap sign-in. No password to remember.</p>
    <p style="margin-top:28px;">
      Welcome,<br>
      The BetterClose Team
    </p>`,
    footerHtml: escapeHtml(supportText),
  })

  const textBody = `${greeting}

${placingPrefix} just opened your title order with BetterClose${propertyText}. We've created a dashboard so you can track every step — loan locked, title ordered, title issued, and closed.

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
