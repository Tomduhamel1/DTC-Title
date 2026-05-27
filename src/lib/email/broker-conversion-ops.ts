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
  // FeeQuote.shareToken — builds the public /quote/view link.
  quoteShareToken?: string | null
  // Conversion timestamp (FeeQuoteEvent(kind='converted').createdAt).
  convertedAt: Date
  // From createClosingFromOrder: whether the borrower matched an existing
  // account or a new orphan Closing/account was created.
  matched: boolean
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

  const row = (label: string, value: string | null | undefined) =>
    value ? `<tr><td style="padding:2px 12px 2px 0;color:#64748b;">${escapeHtml(label)}</td><td style="padding:2px 0;color:#0f172a;font-weight:600;">${escapeHtml(value)}</td></tr>` : ''

  const htmlBody = `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#f8fafc;color:#0f172a;padding:32px 16px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #e2e8f0;line-height:1.6;font-size:15px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#0f172a;margin-bottom:16px;">BETTERCLOSE · BROKER ORDER HANDOFF</div>
    <h1 style="font-size:22px;font-weight:800;margin:0 0 8px 0;">A verified broker converted a quote into a closing</h1>
    <p style="margin:0 0 20px 0;color:#b45309;font-weight:700;">Open and handle this order — Garden linkage is not yet automated, so this is a manual handoff.</p>

    <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#64748b;margin:18px 0 6px;">ORDER</div>
    <table style="font-size:14px;border-collapse:collapse;">
      ${row('Borrower', d.borrowerName)}
      ${row('Email', d.borrowerEmail)}
      ${row('Phone', d.borrowerPhone)}
      ${row('Property', d.propertyAddress)}
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
    <p style="margin:10px 0 0;color:#64748b;font-size:13px;">${escapeHtml(matchedLine)}</p>
    <p style="margin:4px 0 0;color:#64748b;font-size:13px;">Converted at ${escapeHtml(d.convertedAt.toISOString())}.</p>

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
    <p style="font-size:12px;color:#94a3b8;">
      This is a temporary ops handoff until Garden push exists. Manual handling is still required. Reply to this email if anything looks wrong.
    </p>
  </div>
</body>
</html>`

  const textLines = [
    'A verified broker converted a quote into a BetterClose closing.',
    'OPEN AND HANDLE THIS ORDER — Garden linkage is not yet automated, so this is a manual handoff.',
    '',
    'ORDER',
    d.borrowerName ? `  Borrower: ${d.borrowerName}` : null,
    d.borrowerEmail ? `  Email: ${d.borrowerEmail}` : null,
    d.borrowerPhone ? `  Phone: ${d.borrowerPhone}` : null,
    d.propertyAddress ? `  Property: ${d.propertyAddress}` : null,
    '',
    'BROKER',
    d.brokerName ? `  Name: ${d.brokerName}` : null,
    d.brokerEmail ? `  Email: ${d.brokerEmail}` : null,
    d.brokerCompanyName ? `  Company: ${d.brokerCompanyName}` : null,
    '',
    `Open the closing in admin: ${adminUrl}`,
    quoteUrl ? `View the source quote: ${quoteUrl}` : null,
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
