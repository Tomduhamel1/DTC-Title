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
import { emailButton, escapeEmailHtml as escapeHtml, renderEmail } from './layout'

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

  const htmlBody = renderEmail({
    title: "You're set up on the broker portal",
    context: 'Broker portal',
    contentHtml: `<p>${escapeHtml(greeting)}</p>
    <p>${introSentence}</p>
    ${emailButton(signInUrl, 'Sign in to broker dashboard →')}
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
    <p style="margin-top:28px;">— The BetterClose Team</p>`,
    footerHtml: "You're receiving this because an admin added your email to a BetterClose broker company. If this is a surprise, reply to this email and we'll sort it out.",
  })

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
