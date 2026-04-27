/**
 * "We'll email your lender for you" — sends the introduction email on the
 * borrower's behalf. Pre-written, professional. CC's the borrower if they
 * provided their email.
 */

import { sendEmail } from '@/lib/aws/ses'

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
  const reviewUrl = `${d.baseUrl}/for-my-lender?ref=${d.refId}`

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

  return `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#f8fafc;color:#0f172a;padding:32px 16px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:36px 32px;border:1px solid #e2e8f0;line-height:1.6;font-size:15px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#0f172a;margin-bottom:24px;">BETTERCLOSE</div>
    <p>${d.greeting}</p>
    <p><strong>${escapeHtml(d.client)} is using BetterClose for title and settlement on their upcoming closing</strong> and asked us to send you everything you need to place the order.</p>
    <p>BetterClose uses the same A-rated underwriters you already work with (First American, Old Republic, Stewart, Fidelity) and integrates with SmartFees, Encompass, Qualia, and ResWare. Same coverage, transparent flat-rate pricing.</p>
    ${savings}
    ${note}
    <p style="margin:28px 0;">
      <a href="${d.reviewUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;">Get the order details →</a>
    </p>
    <p>If you have questions about the file, reply to this email — we'll get back to you in minutes, not days.</p>
    <p style="margin-top:28px;">
      Thanks,<br>
      The BetterClose Team<br>
      <span style="color:#94a3b8;font-style:italic;">On behalf of ${escapeHtml(d.client)}</span>
    </p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;">
    <p style="font-size:12px;color:#94a3b8;font-style:italic;">
      Sent at the request of ${escapeHtml(d.client)}${d.clientEmail ? ` (${d.clientEmail})` : ''}.
    </p>
  </div>
</body>
</html>`
}

function renderText(d: LenderRequestEmailData & { greeting: string; client: string; reviewUrl: string }) {
  const savings = d.savingsEstimate
    ? `\nEstimated savings for ${d.client} on this closing: $${d.savingsEstimate.toLocaleString()} over the life of the loan, on the same A-rated underwriters.\n`
    : ''
  const note = d.note ? `\n"${d.note}"\n` : ''
  return `${d.greeting}

${d.client} is using BetterClose for title and settlement on their upcoming closing and asked us to send you everything you need to place the order.

BetterClose uses the same A-rated underwriters you already work with (First American, Old Republic, Stewart, Fidelity) and integrates with SmartFees, Encompass, Qualia, and ResWare. Same coverage, transparent flat-rate pricing.
${savings}${note}
Get the order details: ${d.reviewUrl}

If you have questions about the file, reply to this email — we'll get back to you in minutes, not days.

Thanks,
The BetterClose Team
On behalf of ${d.client}

---
Sent at the request of ${d.client}${d.clientEmail ? ` (${d.clientEmail})` : ''}.`
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
