// The celebratory final-closing email. Includes the savings summary frozen
// from the dashboard's fee report at the moment of closing — so this number
// is the one the customer locked in, not whatever the live API returns later.

import { sendEmail } from '@/lib/aws/ses'
import { computeTotals, formatCurrency, type FeeReport } from '@/lib/feeReport'
import { emailButton, emailMeta, emailMetric, emailPanel, escapeEmailHtml as escapeHtml, renderEmail } from './layout'

const dryRun = () => process.env.AUTH_EMAIL_DRY_RUN === 'true'

export interface ClosingCompletedEmailData {
  to: string
  borrowerFirstName?: string | null
  propertyAddress?: string | null
  feeReport: FeeReport | null
  dashboardUrl: string
}

export async function sendClosingCompletedEmail(d: ClosingCompletedEmailData): Promise<string | null> {
  const greeting = d.borrowerFirstName ? `Hi ${d.borrowerFirstName},` : 'Hi,'
  const subject = "You're closed! · Your BetterClose savings"
  const propertyLine = d.propertyAddress
    ? emailMeta(d.propertyAddress)
    : ''

  const totals = d.feeReport ? computeTotals(d.feeReport) : null
  // Same "Save at closing" / "Save over the loan" figures shown on the quote
  // pages — the email and the site must never disagree.
  const closingSavingsAvg = totals ? totals.estimatedSavings : 0
  const lifetimeSavingsAvg = totals ? totals.lifetimeSavings : 0

  const savingsBlock = totals
    ? emailPanel(`${emailMetric('You saved at closing', formatCurrency(closingSavingsAvg), `vs the typical ${d.feeReport?.state || 'market'} title company`)}
        ${
          lifetimeSavingsAvg > 0
            ? `<div style="margin-top:14px;padding-top:14px;border-top:1px solid #d1fae5;">
                ${emailMetric('Save over the loan', formatCurrency(lifetimeSavingsAvg), 'Assumes you borrow less or get better loan pricing because your closing costs are lower. Based on 6.5% over 30 years.')}
              </div>`
            : ''
        }
      `)
    : ''

  const html = renderEmail({
    title: "You're closed. 🎉",
    contentHtml: `<p>${escapeHtml(greeting)}</p>
    ${propertyLine}
    <p style="margin-top:18px;">
      Your closing team has marked the file closed. Your escrow officer can
      confirm disbursement, recording and delivery of your final documents.
    </p>
    ${savingsBlock}
    <p style="margin-top:18px;">
      Your closing team can help with the next steps:
    </p>
    <ul style="color:#334155;line-height:1.7;">
      <li>Ask your escrow officer when and how your title policy and recorded documents will be delivered.</li>
      <li>Keep your final documents somewhere safe.</li>
      <li>Your dashboard stays open — sign in any time to revisit the fee breakdown or download your closing documents.</li>
    </ul>
    ${emailButton(d.dashboardUrl, 'View your closing summary →')}
    <p style="margin-top:28px;">— The BetterClose Team</p>`,
    footerHtml: 'Thank you for choosing BetterClose. If we did right by you, telling a friend or family member is the best gift you can give us — and them.',
  })

  const text = `${greeting}

You're closed.${d.propertyAddress ? `\n${d.propertyAddress}` : ''}

Your closing team has marked the file closed. Your escrow officer can confirm disbursement, recording and delivery of your final documents.
${
  totals
    ? `\n\nSave at closing: ${formatCurrency(closingSavingsAvg)}\nSave over the loan: ${formatCurrency(lifetimeSavingsAvg)} (assumes you borrow less or get better loan pricing because your closing costs are lower; based on 6.5% over 30 years).`
    : ''
}

Your closing team can help with the next steps:
- Ask your escrow officer when and how your title policy and recorded documents will be delivered.
- Keep your final documents somewhere safe.
- Dashboard stays open: ${d.dashboardUrl}

Thank you for choosing BetterClose.

— The BetterClose Team`

  if (dryRun()) {
    console.log('\n[email] closing-completed (dry run)')
    console.log('  to:', d.to)
    console.log('  closingSavingsAvg:', closingSavingsAvg)
    console.log('  lifetimeSavingsAvg:', lifetimeSavingsAvg)
    return null
  }

  return sendEmail({
    to: d.to,
    replyTo: process.env.HELLO_EMAIL || 'hello@betterclose.co',
    subject,
    htmlBody: html,
    textBody: text,
  })
}
