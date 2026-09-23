// Broker → borrower quote email. Sent when a broker clicks "Send to
// borrower" on a saved FeeQuote. Includes the savings summary computed
// from the frozen outputJson and a link to the public /quote/view page.
//
// Respects AUTH_EMAIL_DRY_RUN — local dev logs to console instead of
// hitting SES, matching closing-update.ts / closing-completed.ts.

import { sendEmail } from '@/lib/aws/ses'
import { computeTotals, formatCurrency, type FeeReport } from '@/lib/feeReport'
import { emailButton, emailMeta, emailMetric, emailPanel, escapeEmailHtml as escapeHtml, renderEmail } from './layout'

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
    ? emailMeta(d.propertyAddress)
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
        savingsBlockHtml = emailPanel(emailMetric('Estimated savings', formatCurrency(avg), 'at closing, vs. the typical market range'))
        savingsBlockText = `\nEstimated savings at closing: ${formatCurrency(avg)} (vs. the typical market range)\n`
      }
    }
  } catch {
    // intentional: malformed outputJson → omit the savings block
  }

  const subject = 'Your BetterClose title & settlement quote'
  const htmlBody = renderEmail({
    title: 'Your BetterClose quote',
    contentHtml: `<p>${escapeHtml(greeting)}</p>
    <p>${broker} prepared a BetterClose title &amp; settlement quote for you showing estimated savings on your closing.</p>
    ${propertyLine}
    ${savingsBlockHtml}
    ${emailButton(d.publicViewUrl, 'View my quote →')}
    <p style="font-size:13px;color:#64748b;">
      This is an estimate based on the property and loan details provided. Final fees are determined at closing and may vary; some items are set by state/county or the lender and are not negotiable. Title insurance underwritten by A-rated underwriters.
    </p>`,
    footerHtml: 'Questions? Reply to this email — a real person will get back to you.',
  })

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
