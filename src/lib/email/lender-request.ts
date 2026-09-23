/**
 * "We'll email your lender for you" — sends the introduction email on the
 * borrower's behalf. Pre-written, professional. CC's the borrower if they
 * provided their email.
 */

import { sendEmail } from '@/lib/aws/ses'
import { emailButton, escapeEmailHtml as escapeHtml, renderEmail } from './layout'

export interface LenderRequestEmailData {
  lenderEmail: string
  lenderFirstName?: string
  clientName?: string
  clientEmail?: string
  note?: string
  savingsEstimate?: number
  refId: string
  baseUrl: string // e.g. https://betterclose.co
}

export async function sendLenderRequestEmail(d: LenderRequestEmailData): Promise<string> {
  const greeting = d.lenderFirstName ? `Hi ${d.lenderFirstName},` : 'Hi there,'
  const client = d.clientName || 'Your client'
  const subject = `${client} is using BetterClose for title & settlement on their closing`
  const reviewUrl = `${d.baseUrl}/for-my-team?ref=${d.refId}`

  const cc = d.clientEmail ? [d.clientEmail] : undefined

  return sendEmail({
    to: d.lenderEmail,
    cc,
    replyTo: process.env.HELLO_EMAIL || 'hello@betterclose.co',
    subject,
    htmlBody: renderHtml({ ...d, greeting, client, reviewUrl }),
    textBody: renderText({ ...d, greeting, client, reviewUrl }),
  })
}

function renderHtml(d: LenderRequestEmailData & { greeting: string; client: string; reviewUrl: string }) {
  const savings = d.savingsEstimate
    ? `<p><strong>Estimated savings for ${escapeHtml(d.client)} on this closing: $${d.savingsEstimate.toLocaleString()}</strong> over the life of the loan, on the same A-rated underwriters.</p>`
    : ''
  const note = d.note
    ? `<p style="border-left:3px solid #cbd5e1;padding:8px 12px;color:#475569;font-style:italic;background:#f8fafc;">"${escapeHtml(d.note)}"</p>`
    : ''

  return renderEmail({
    title: "Your client's closing",
    contentHtml: `<p>${escapeHtml(d.greeting)}</p>
    <p><strong>${escapeHtml(d.client)} is using BetterClose for title and settlement on their upcoming closing</strong> and asked us to send you everything you need to place the order.</p>
    <p>BetterClose uses the same A-rated underwriters you already work with (First American, AmTrust, Westcor, Old Republic) and integrates with SmartFees, Encompass, Qualia, and ResWare. Same coverage, transparent flat-rate pricing.</p>
    ${savings}
    ${note}
    ${emailButton(d.reviewUrl, 'Get the order details →')}
    <p>If you have questions about the file, reply to this email — we'll get back to you in minutes, not days.</p>
    <p style="margin-top:28px;">
      Thanks,<br>
      The BetterClose Team<br>
      <span style="color:#94a3b8;font-style:italic;">On behalf of ${escapeHtml(d.client)}</span>
    </p>`,
    footerHtml: `Sent at the request of ${escapeHtml(d.client)}${d.clientEmail ? ` (${escapeHtml(d.clientEmail)})` : ''}.`,
  })
}

function renderText(d: LenderRequestEmailData & { greeting: string; client: string; reviewUrl: string }) {
  const savings = d.savingsEstimate
    ? `\nEstimated savings for ${d.client} on this closing: $${d.savingsEstimate.toLocaleString()} over the life of the loan, on the same A-rated underwriters.\n`
    : ''
  const note = d.note ? `\n"${d.note}"\n` : ''
  return `${d.greeting}

${d.client} is using BetterClose for title and settlement on their upcoming closing and asked us to send you everything you need to place the order.

BetterClose uses the same A-rated underwriters you already work with (First American, AmTrust, Westcor, Old Republic) and integrates with SmartFees, Encompass, Qualia, and ResWare. Same coverage, transparent flat-rate pricing.
${savings}${note}
Get the order details: ${d.reviewUrl}

If you have questions about the file, reply to this email — we'll get back to you in minutes, not days.

Thanks,
The BetterClose Team
On behalf of ${d.client}

---
Sent at the request of ${d.client}${d.clientEmail ? ` (${d.clientEmail})` : ''}.`
}
