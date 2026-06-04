// Broker portal welcome email. Sent when an admin creates a new
// BrokerMembership via addBrokerCompanyMember(). Tells the broker/LO that
// their portal access is now live and gives them a one-tap magic-link sign-in.
//
// Body branches on BrokerCompany.verifiedAt at the moment of member-add:
//   - verified   → conversion is unlocked, can take quotes all the way to closing
//   - unverified → quote create/share works now, conversion unlocks at verification
//
// Respects AUTH_EMAIL_DRY_RUN — local dev logs to console instead of hitting
// SES, matching teammate-invite.ts / broker-quote.ts / closing-update.ts.

import { sendEmail } from '@/lib/aws/ses'

const dryRun = () => process.env.AUTH_EMAIL_DRY_RUN === 'true'

export interface BrokerPortalWelcomeEmailData {
  email: string
  // Display name for greeting. Falls back to "Hi," when null/undefined.
  memberName?: string | null
  // Company name for the subject line and intro sentence. Falls back to
  // generic copy if missing.
  brokerCompanyName?: string | null
  // True when BrokerCompany.verifiedAt is non-null at the time the member is
  // added. Drives the verified/unverified copy branch.
  isVerifiedCompany: boolean
}

export async function sendBrokerPortalWelcomeEmail(
  d: BrokerPortalWelcomeEmailData,
): Promise<string | null> {
  const firstName = d.memberName?.trim().split(/\s+/)[0]
  const greeting = firstName ? `Hi ${firstName},` : 'Hi,'

  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.betterclose.co'
  const signInUrl = `${baseUrl}/login?callbackUrl=${encodeURIComponent('/teammate/dashboard')}`

  const companyName = d.brokerCompanyName?.trim() || null
  const subject = companyName
    ? `You're set up on BetterClose · ${companyName}`
    : `You're set up on BetterClose`

  const introSentence = companyName
    ? `You've been added to <strong>${escapeHtml(companyName)}</strong> on BetterClose, with broker/LO portal access.`
    : `You've been added to BetterClose with broker/LO portal access.`
  const introSentenceText = companyName
    ? `You've been added to ${companyName} on BetterClose, with broker/LO portal access.`
    : `You've been added to BetterClose with broker/LO portal access.`

  const verifiedBullet = d.isVerifiedCompany
    ? 'Your company is verified, so you can convert approved quotes into BetterClose closings.'
    : 'Create and send quotes now. Quote-to-closing conversion unlocks once BetterClose verifies your company.'

  const htmlBody = `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#f8fafc;color:#0f172a;padding:32px 16px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:36px 32px;border:1px solid #e2e8f0;line-height:1.6;font-size:15px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#0f172a;margin-bottom:24px;">BETTERCLOSE · BROKER PORTAL</div>
    <h1 style="font-size:24px;font-weight:800;margin:0 0 16px 0;">You're set up on the broker portal</h1>
    <p>${greeting}</p>
    <p>${introSentence}</p>
    <p style="margin:28px 0;">
      <a href="${signInUrl}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;">Sign in to broker dashboard →</a>
    </p>
    <p style="margin-top:24px;">Once you're in, you can:</p>
    <ul style="padding-left:20px;margin:8px 0 0 0;">
      <li style="margin:6px 0;">Create instant fee quotes for your borrowers.</li>
      <li style="margin:6px 0;">Share quotes with a public-view link and see when borrowers open them.</li>
      <li style="margin:6px 0;">${escapeHtml(verifiedBullet)}</li>
      <li style="margin:6px 0;">Track every active file in your pipeline.</li>
    </ul>
    <p style="margin-top:20px;color:#475569;font-size:14px;">
      To create your first quote, sign in and choose <strong>Quotes → New quote</strong>.
    </p>
    <p style="color:#64748b;font-size:13px;">One-tap sign-in. No password to remember.</p>
    <p style="margin-top:28px;">— The BetterClose Team</p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;">
    <p style="font-size:12px;color:#94a3b8;">
      You're receiving this because an admin added your email to a BetterClose broker company. If this is a surprise, reply to this email and we'll sort it out.
    </p>
  </div>
</body>
</html>`

  const textBody = `${greeting}

${introSentenceText}

Sign in: ${signInUrl}

Once you're in, you can:
  - Create instant fee quotes for your borrowers.
  - Share quotes with a public-view link and see when borrowers open them.
  - ${verifiedBullet}
  - Track every active file in your pipeline.

To create your first quote, sign in and choose Quotes -> New quote.

One-tap sign-in. No password to remember.

— The BetterClose Team

You're receiving this because an admin added your email to a BetterClose broker company. If this is a surprise, reply to this email and we'll sort it out.`

  if (dryRun()) {
    // eslint-disable-next-line no-console
    console.log('\n[email] broker-portal-welcome (dry run)')
    // eslint-disable-next-line no-console
    console.log('  to:', d.email)
    // eslint-disable-next-line no-console
    console.log('  subject:', subject)
    // eslint-disable-next-line no-console
    console.log('  company:', companyName ?? '(none)')
    // eslint-disable-next-line no-console
    console.log('  verified:', d.isVerifiedCompany)
    return null
  }

  return sendEmail({
    to: d.email,
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
