// Broker → borrower quote email. Sent when a broker clicks "Send to
// borrower" on a saved FeeQuote. Includes the savings summary computed
// from the frozen outputJson and a link to the public /quote/view page.
//
// Respects AUTH_EMAIL_DRY_RUN — local dev logs to console instead of
// hitting SES, matching closing-update.ts / closing-completed.ts.

import { sendEmail } from '@/lib/aws/ses'
import { computeTotals, formatCurrency, type FeeReport } from '@/lib/feeReport'

const dryRun = () => process.env.AUTH_EMAIL_DRY_RUN === 'true'

export interface BrokerQuoteEmailData {
  to: string
  borrowerFirstName?: string | null
  brokerCompanyName?: string | null
  brokerDisplayName?: string | null // broker's name or email, for attribution
  propertyAddress?: string | null
  // Frozen FeeReport from FeeQuote.outputJson. Used to compute a savings
  // summary. If null or malformed, the email falls back to generic copy.
  feeReport: FeeReport | null
  publicViewUrl: string
}

export async function sendBrokerQuoteEmail(d: BrokerQuoteEmailData): Promise<string | null> {
  const greeting = d.borrowerFirstName ? `Hi ${d.borrowerFirstName},` : 'Hi,'
  const broker = d.brokerDisplayName
    ? d.brokerCompanyName
      ? `${escapeHtml(d.brokerDisplayName)} at ${escapeHtml(d.brokerCompanyName)}`
      : escapeHtml(d.brokerDisplayName)
    : d.brokerCompanyName
    ? `your broker at ${escapeHtml(d.brokerCompanyName)}`
    : 'your broker'
  const brokerText = d.brokerDisplayName
    ? d.brokerCompanyName
      ? `${d.brokerDisplayName} at ${d.brokerCompanyName}`
      : d.brokerDisplayName
    : d.brokerCompanyName
    ? `your broker at ${d.brokerCompanyName}`
    : 'your broker'
  const propertyLine = d.propertyAddress
    ? `<p style="color:#64748b;font-size:14px;margin:4px 0 16px;">${escapeHtml(d.propertyAddress)}</p>`
    : ''
  const propertyText = d.propertyAddress ? `\nProperty: ${d.propertyAddress}\n` : ''

  // Savings — defensively computed. computeTotals can throw on a malformed
  // outputJson; we swallow that and fall through to generic copy.
  let savingsBlockHtml = ''
  let savingsBlockText = ''
  try {
    if (d.feeReport) {
      const totals = computeTotals(d.feeReport)
      // Same "Save at closing" figure shown on the quote pages.
      const avg = totals.estimatedSavings
      if (avg > 0) {
        savingsBlockHtml = `
  <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:18px 20px;margin:20px 0;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.18em;color:#047857;text-transform:uppercase;">Estimated savings</div>
    <div style="font-size:28px;font-weight:800;color:#065f46;margin-top:2px;">${formatCurrency(avg)}</div>
    <div style="font-size:12px;color:#065f46;margin-top:4px;">at closing, vs. the typical market range</div>
  </div>`
        savingsBlockText = `\nEstimated savings at closing: ${formatCurrency(avg)} (vs. the typical market range)\n`
      }
    }
  } catch {
    // intentional: malformed outputJson → omit the savings block
  }

  const subject = 'Your BetterClose title & settlement quote'
  const htmlBody = `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#f8fafc;color:#0f172a;padding:32px 16px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:36px 32px;border:1px solid #e2e8f0;line-height:1.6;font-size:15px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#0f172a;margin-bottom:24px;">BETTERCLOSE</div>
    <h1 style="font-size:24px;font-weight:800;margin:0 0 16px 0;">Your BetterClose quote</h1>
    <p>${greeting}</p>
    <p>${broker} prepared a BetterClose title &amp; settlement quote for you showing estimated savings on your closing.</p>
    ${propertyLine}
    ${savingsBlockHtml}
    <p style="margin:28px 0;">
      <a href="${d.publicViewUrl}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;">View my quote →</a>
    </p>
    <p style="font-size:13px;color:#64748b;">
      This is an estimate based on the property and loan details provided. Final fees are determined at closing and may vary; some items are set by state/county or the lender and are not negotiable. Title insurance underwritten by A-rated underwriters.
    </p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;">
    <p style="font-size:12px;color:#94a3b8;">
      Questions? Reply to this email — a real person will get back to you.
    </p>
  </div>
</body>
</html>`

  const textBody = `Your BetterClose quote

${greeting}

${brokerText} prepared a BetterClose title & settlement quote for you showing estimated savings on your closing.
${propertyText}${savingsBlockText}
View your quote: ${d.publicViewUrl}

This is an estimate based on the property and loan details provided. Final fees are determined at closing and may vary; some items are set by state/county or the lender and are not negotiable. Title insurance underwritten by A-rated underwriters.

Questions? Reply to this email — a real person will get back to you.

— The BetterClose Team`

  if (dryRun()) {
    // eslint-disable-next-line no-console
    console.log('\n[email] broker-quote (dry run)')
    // eslint-disable-next-line no-console
    console.log('  to:', d.to)
    // eslint-disable-next-line no-console
    console.log('  subject:', subject)
    // eslint-disable-next-line no-console
    console.log('  url:', d.publicViewUrl)
    return null
  }

  return sendEmail({
    to: d.to,
    replyTo: process.env.HELLO_EMAIL || 'hello@betterclose.co',
    subject,
    htmlBody,
    textBody,
  })
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
