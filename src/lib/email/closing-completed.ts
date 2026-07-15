// The celebratory final-closing email. Includes the savings summary frozen
// from the dashboard's fee report at the moment of closing — so this number
// is the one the customer locked in, not whatever the live API returns later.

import { sendEmail } from '@/lib/aws/ses'
import { computeTotals, formatCurrency, type FeeReport } from '@/lib/feeReport'

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
    ? `<p style="color:#64748b;font-size:14px;margin:4px 0 0;">${escapeHtml(d.propertyAddress)}</p>`
    : ''

  const totals = d.feeReport ? computeTotals(d.feeReport) : null
  // Same "Save at closing" / "Save over the loan" figures shown on the quote
  // pages — the email and the site must never disagree.
  const closingSavingsAvg = totals ? totals.estimatedSavings : 0
  const lifetimeSavingsAvg = totals ? totals.lifetimeSavings : 0

  const savingsBlock = totals
    ? `<div style="background:linear-gradient(135deg,#ecfdf5,#fff);border:2px solid #a7f3d0;border-radius:14px;padding:22px;margin:24px 0;text-align:center;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#047857;text-transform:uppercase;">You saved at closing</div>
        <div style="font-size:48px;font-weight:900;color:#047857;line-height:1;margin:6px 0;">${formatCurrency(closingSavingsAvg)}</div>
        <div style="font-size:12px;color:#64748b;">vs the typical ${escapeHtml(d.feeReport?.state || 'market')} title company</div>
        ${
          lifetimeSavingsAvg > 0
            ? `<div style="margin-top:14px;padding-top:14px;border-top:1px solid #d1fae5;">
                <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#047857;text-transform:uppercase;">Save over the loan</div>
                <div style="font-size:32px;font-weight:900;color:#047857;line-height:1;margin-top:4px;">${formatCurrency(lifetimeSavingsAvg)}</div>
                <div style="font-size:11px;color:#64748b;margin-top:4px;">Assumes you borrow less or get better loan pricing because your closing costs are lower. Based on 6.5% over 30 years.</div>
              </div>`
            : ''
        }
      </div>`
    : ''

  const html = `<!DOCTYPE html>
<html><body style="font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#f8fafc;color:#0f172a;padding:32px 16px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:36px 32px;border:1px solid #e2e8f0;line-height:1.6;font-size:15px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#0f172a;margin-bottom:12px;">BETTERCLOSE</div>
    <p>${greeting}</p>
    <h1 style="font-size:32px;font-weight:900;color:#0f172a;margin:8px 0 0;line-height:1.1;">You're closed. 🎉</h1>
    ${propertyLine}
    <p style="margin-top:18px;">
      Funds have been disbursed and the deed is recorded. If you bought, the
      keys are yours. If you refinanced, the new loan is in place. Either way,
      this part is done.
    </p>
    ${savingsBlock}
    <p style="margin-top:18px;">
      A few things to expect over the next few weeks:
    </p>
    <ul style="color:#334155;line-height:1.7;">
      <li>Your title insurance policy will arrive by mail from the underwriter — keep it with your closing documents.</li>
      <li>Your recorded deed will arrive from the county. This is the original, so file it somewhere safe.</li>
      <li>Your dashboard stays open — sign in any time to revisit the fee breakdown or download your closing documents.</li>
    </ul>
    <p style="margin:28px 0;">
      <a href="${d.dashboardUrl}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;">View your closing summary →</a>
    </p>
    <p style="color:#64748b;font-size:13px;">
      Thank you for choosing BetterClose. If we did right by you, telling a friend or family member is the best gift you can give us — and them.
    </p>
    <p style="margin-top:28px;">— The BetterClose Team</p>
  </div>
</body></html>`

  const text = `${greeting}

You're closed.${d.propertyAddress ? `\n${d.propertyAddress}` : ''}

Funds have been disbursed and the deed is recorded. If you bought, the keys are yours. If you refinanced, the new loan is in place. Either way, this part is done.
${
  totals
    ? `\n\nSave at closing: ${formatCurrency(closingSavingsAvg)}\nSave over the loan: ${formatCurrency(lifetimeSavingsAvg)} (assumes you borrow less or get better loan pricing because your closing costs are lower; based on 6.5% over 30 years).`
    : ''
}

A few things over the next few weeks:
- Title insurance policy will arrive by mail from the underwriter.
- Recorded deed will arrive from the county. File it safely.
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

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
