// Internal ops handoff email. Sent (best-effort) when a verified broker
// converts a FeeQuote into a real Closing, so a human opens and handles the
// order. This is a TEMPORARY manual handoff: broker conversions do not yet
// push to Garden, so until that integration exists, an operator must pick the
// order up from /admin/closings and run it.
//
// Recipient defaults to orders@betterclose.co; override with BROKER_OPS_EMAIL
// (whitelisted in amplify.yml so it reaches the runtime SSR Lambdas).
//
// Respects AUTH_EMAIL_DRY_RUN — local dev logs to console instead of hitting
// SES, matching broker-portal-welcome.ts / closing-update-teammate.ts.

import { sendEmail } from '@/lib/aws/ses'

const dryRun = () => process.env.AUTH_EMAIL_DRY_RUN === 'true'

export function brokerOpsRecipient(): string {
  return process.env.BROKER_OPS_EMAIL || 'orders@betterclose.co'
}

export interface BrokerConversionOpsEmailData {
  closingId: string
  brokerName?: string | null
  brokerEmail?: string | null
  brokerCompanyName?: string | null
  borrowerName?: string | null
  borrowerEmail?: string | null
  borrowerPhone?: string | null
  propertyAddress?: string | null
  propertyCity?: string | null
  propertyState?: string | null
  propertyZip?: string | null
  // From FeeQuote.inputJson — inherited from the quote, not editable at convert.
  transactionType?: 'purchase' | 'refinance' | null
  homeValue?: number | null
  loanAmount?: number | null
  // FeeQuote.shareToken — builds the public /quote/view link.
  quoteShareToken?: string | null
  // Conversion timestamp (FeeQuoteEvent(kind='converted').createdAt).
  convertedAt: Date
  // From createClosingFromOrder: whether the borrower matched an existing
  // account or a new orphan Closing/account was created.
  matched: boolean
}

function formatUsd(n: number | null | undefined): string | null {
  if (typeof n !== 'number' || !(n > 0)) return null
  return '$' + Math.round(n).toLocaleString('en-US')
}

// Returns { recipient, subject, messageId } so the caller can log a precise
// NotificationLog row. messageId is null on dry-run.
export async function sendBrokerConversionOpsEmail(
  d: BrokerConversionOpsEmailData,
): Promise<{ recipient: string; subject: string; messageId: string | null }> {
  const recipient = brokerOpsRecipient()
  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.betterclose.co'

  const fileLabel = d.propertyAddress || d.borrowerName || d.borrowerEmail || 'new order'
  const companyLabel = d.brokerCompanyName?.trim() || 'broker'
  const subject = `New broker-converted order · ${fileLabel} · ${companyLabel}`

  const adminUrl = `${baseUrl}/admin/closings/${d.closingId}`
  const quoteUrl = d.quoteShareToken
    ? `${baseUrl}/quote/view?token=${d.quoteShareToken}`
    : null
  const matchedLine = d.matched
    ? 'Borrower matched an existing BetterClose account/closing.'
    : 'A new borrower record was created (orphan branch); borrower was sent a welcome email.'

  // Derived order summary fields.
  const txnLabel = d.transactionType
    ? d.transactionType === 'refinance'
      ? 'Refinance'
      : 'Purchase'
    : null
  const amountUsd =
    d.transactionType === 'refinance' ? formatUsd(d.loanAmount) : formatUsd(d.homeValue)
  const amountLabel =
    d.transactionType === 'refinance' ? 'Loan amount' : 'Purchase price'
  const fullProperty =
    [
      d.propertyAddress,
      [d.propertyCity, d.propertyState].filter(Boolean).join(', '),
      d.propertyZip,
    ]
      .filter((s) => s && s.trim())
      .join(' · ') || null

  // Next-action / missing-info copy. Convert now enforces the order minimum,
  // so this section is a safety net + the standard "what ops still needs"
  // checklist — NOT a justification for incomplete conversions. Only OPTIONAL
  // gaps (e.g. phone) are listed as follow-ups; required fields are guaranteed
  // present by the convert gate.
  const optionalMissing: string[] = []
  if (!d.borrowerPhone || !d.borrowerPhone.trim()) optionalMissing.push('borrower phone')
  const nextActionLead =
    'Minimum order details are present. Still collect the purchase contract, ' +
    'target closing date, lender/title instructions, and any additional ' +
    'documents needed to open the file.'
  const optionalLine =
    optionalMissing.length > 0
      ? `Optional follow-up (not blockers): ${optionalMissing.join(', ')}.`
      : null

  const row = (label: string, value: string | null | undefined) =>
    value ? `<tr><td style="padding:2px 12px 2px 0;color:#64748b;">${escapeHtml(label)}</td><td style="padding:2px 0;color:#0f172a;font-weight:600;">${escapeHtml(value)}</td></tr>` : ''

  const htmlBody = `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#f8fafc;color:#0f172a;padding:32px 16px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #e2e8f0;line-height:1.6;font-size:15px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#0f172a;margin-bottom:16px;">BETTERCLOSE · BROKER ORDER HANDOFF</div>
    <h1 style="font-size:22px;font-weight:800;margin:0 0 8px 0;">New title order from a broker conversion</h1>
    <p style="margin:0 0 20px 0;color:#b45309;font-weight:700;">Garden linkage is not automated — ops must open and handle this file manually.</p>

    <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#64748b;margin:18px 0 6px;">TRANSACTION</div>
    <table style="font-size:14px;border-collapse:collapse;">
      ${row('Type', txnLabel)}
      ${row(amountLabel, amountUsd)}
    </table>

    <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#64748b;margin:18px 0 6px;">PROPERTY</div>
    <table style="font-size:14px;border-collapse:collapse;">
      ${row('Address', d.propertyAddress)}
      ${row('City', d.propertyCity)}
      ${row('State', d.propertyState)}
      ${row('ZIP', d.propertyZip)}
    </table>

    <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#64748b;margin:18px 0 6px;">BORROWER</div>
    <table style="font-size:14px;border-collapse:collapse;">
      ${row('Name', d.borrowerName)}
      ${row('Email', d.borrowerEmail)}
      ${row('Phone', d.borrowerPhone)}
    </table>

    <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#64748b;margin:18px 0 6px;">BROKER</div>
    <table style="font-size:14px;border-collapse:collapse;">
      ${row('Name', d.brokerName)}
      ${row('Email', d.brokerEmail)}
      ${row('Company', d.brokerCompanyName)}
    </table>

    <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#64748b;margin:18px 0 6px;">LINKS</div>
    <p style="margin:4px 0;"><a href="${adminUrl}" style="color:#0693e3;font-weight:600;">Open the closing in admin →</a></p>
    ${quoteUrl ? `<p style="margin:4px 0;"><a href="${quoteUrl}" style="color:#0693e3;font-weight:600;">View the source quote →</a></p>` : ''}

    <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#64748b;margin:18px 0 6px;">MISSING INFORMATION / NEXT ACTION</div>
    <p style="margin:4px 0;color:#0f172a;font-size:14px;">${escapeHtml(nextActionLead)}</p>
    ${optionalLine ? `<p style="margin:4px 0;color:#64748b;font-size:13px;">${escapeHtml(optionalLine)}</p>` : ''}

    <p style="margin:14px 0 0;color:#64748b;font-size:13px;">${escapeHtml(matchedLine)}</p>
    <p style="margin:4px 0 0;color:#64748b;font-size:13px;">Converted at ${escapeHtml(d.convertedAt.toISOString())}.</p>

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
    <p style="font-size:12px;color:#94a3b8;">
      This is a temporary ops handoff until Garden push exists. Manual handling is still required. Reply to this email if anything looks wrong.
    </p>
  </div>
</body>
</html>`

  const textLines = [
    'New title order from a broker conversion.',
    'GARDEN LINKAGE IS NOT AUTOMATED — ops must open and handle this file manually.',
    '',
    'TRANSACTION',
    txnLabel ? `  Type: ${txnLabel}` : null,
    amountUsd ? `  ${amountLabel}: ${amountUsd}` : null,
    '',
    'PROPERTY',
    d.propertyAddress ? `  Address: ${d.propertyAddress}` : null,
    d.propertyCity ? `  City: ${d.propertyCity}` : null,
    d.propertyState ? `  State: ${d.propertyState}` : null,
    d.propertyZip ? `  ZIP: ${d.propertyZip}` : null,
    fullProperty ? `  (${fullProperty})` : null,
    '',
    'BORROWER',
    d.borrowerName ? `  Name: ${d.borrowerName}` : null,
    d.borrowerEmail ? `  Email: ${d.borrowerEmail}` : null,
    d.borrowerPhone ? `  Phone: ${d.borrowerPhone}` : null,
    '',
    'BROKER',
    d.brokerName ? `  Name: ${d.brokerName}` : null,
    d.brokerEmail ? `  Email: ${d.brokerEmail}` : null,
    d.brokerCompanyName ? `  Company: ${d.brokerCompanyName}` : null,
    '',
    `Open the closing in admin: ${adminUrl}`,
    quoteUrl ? `View the source quote: ${quoteUrl}` : null,
    '',
    'MISSING INFORMATION / NEXT ACTION',
    `  ${nextActionLead}`,
    optionalLine ? `  ${optionalLine}` : null,
    '',
    matchedLine,
    `Converted at ${d.convertedAt.toISOString()}.`,
    '',
    'This is a temporary ops handoff until Garden push exists. Manual handling is still required.',
  ].filter((l) => l !== null)
  const textBody = textLines.join('\n')

  if (dryRun()) {
    // eslint-disable-next-line no-console
    console.log('\n[email] broker-conversion-ops (dry run)')
    // eslint-disable-next-line no-console
    console.log('  to:', recipient)
    // eslint-disable-next-line no-console
    console.log('  subject:', subject)
    // eslint-disable-next-line no-console
    console.log('  closingId:', d.closingId)
    return { recipient, subject, messageId: null }
  }

  const messageId = await sendEmail({
    to: recipient,
    replyTo: process.env.HELLO_EMAIL || 'hello@betterclose.co',
    subject,
    htmlBody,
    textBody,
  })
  return { recipient, subject, messageId }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
