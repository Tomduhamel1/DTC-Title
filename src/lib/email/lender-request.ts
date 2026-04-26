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
  const subject = `${client} would like you to consider BetterClose for their closing`
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
    ? `<p><em>Estimated savings on this closing: <strong>$${d.savingsEstimate.toLocaleString()}</strong>.</em></p>`
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
    <p>${escapeHtml(d.client)} is preparing for their upcoming home closing and asked us to introduce you to BetterClose, an alternative title and closing company they'd like considered for the transaction.</p>
    <p><strong>Why your client is reaching out:</strong> Closing costs vary widely between title companies — often by thousands of dollars on the same transaction. BetterClose offers transparent flat-rate pricing, the same A-rated underwriters you already work with (First American, Old Republic, Stewart, Fidelity), and full digital coordination.</p>
    ${savings}
    <p><strong>What we're asking:</strong> Take 60 seconds to review BetterClose at the link below. If it works for the file, you can place the title order directly — or find us in SmartFees, Encompass, Qualia, or ResWare.</p>
    ${note}
    <p style="margin:28px 0;">
      <a href="${d.reviewUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;">Review BetterClose →</a>
    </p>
    <p>Questions? Reply to this email.</p>
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
  const savings = d.savingsEstimate ? `\nEstimated savings on this closing: $${d.savingsEstimate.toLocaleString()}.\n` : ''
  const note = d.note ? `\n"${d.note}"\n` : ''
  return `${d.greeting}

${d.client} is preparing for their upcoming home closing and asked us to introduce you to BetterClose.

Why your client is reaching out: Closing costs vary widely between title companies — often by thousands of dollars on the same transaction. BetterClose offers transparent flat-rate pricing, the same A-rated underwriters you already work with (First American, Old Republic, Stewart, Fidelity), and full digital coordination.
${savings}
What we're asking: Take 60 seconds to review BetterClose. If it works for the file, you can place the title order directly — or find us in SmartFees, Encompass, Qualia, or ResWare.
${note}
Review BetterClose: ${d.reviewUrl}

Questions? Reply to this email.

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
