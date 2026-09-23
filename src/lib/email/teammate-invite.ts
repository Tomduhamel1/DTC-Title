import { sendEmail } from '@/lib/aws/ses'
import { roleLabel, type TeammateRole } from '@/lib/professional/pronoun'
import { emailButton, escapeEmailHtml as escapeHtml, renderEmail } from './layout'

const dryRun = () => process.env.AUTH_EMAIL_DRY_RUN === 'true'

export interface TeammateInviteEmailData {
  email: string
  role: TeammateRole
  closingId: string
  placingBorrowerName?: string | null
  propertyAddress?: string | null
}

export async function sendTeammateInviteEmail(
  d: TeammateInviteEmailData,
): Promise<string | null> {
  const label = roleLabel(d.role)
  const labelLower = label.toLowerCase()
  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.betterclose.co'
  const inviteUrl = `${baseUrl}/login?callbackUrl=${encodeURIComponent(`/teammate/dashboard/${d.closingId}`)}`

  const propertyHtml = d.propertyAddress
    ? ` for <strong>${escapeHtml(d.propertyAddress)}</strong>`
    : ''
  const propertyText = d.propertyAddress ? ` for ${d.propertyAddress}` : ''
  const borrowerHtml = d.placingBorrowerName
    ? ` ${escapeHtml(d.placingBorrowerName)}`
    : ''
  const borrowerText = d.placingBorrowerName ? ` ${d.placingBorrowerName}` : ''

  const subject = `You're on a BetterClose file${d.propertyAddress ? ` · ${d.propertyAddress}` : ''}`

  const html = renderEmail({
    title: "You're named on a closing",
    contentHtml: `<p>Hi,</p>
    <p>You've been listed as the ${labelLower} on a BetterClose closing file${borrowerHtml ? ` for${borrowerHtml}` : ''}${propertyHtml}.</p>
    <p>Sign in with this email to see milestones in real time, share documents, and stay in sync with the rest of the team.</p>
    ${emailButton(inviteUrl, 'Open the file →')}
    <p style="color:#64748b;font-size:13px;">One-tap sign-in. No password to remember.</p>
    <p style="margin-top:28px;">— The BetterClose Team</p>`,
    footerHtml: 'Got this by mistake? You can ignore it — no account will be created unless you sign in.',
  })

  const text = `Hi,

You've been listed as the ${labelLower} on a BetterClose closing file${borrowerText ? ` for${borrowerText}` : ''}${propertyText}.

Sign in with this email to see milestones in real time, share documents, and stay in sync with the rest of the team.

Open the file: ${inviteUrl}

One-tap sign-in. No password to remember.

— The BetterClose Team

Got this by mistake? You can ignore it — no account will be created unless you sign in.`

  if (dryRun()) {
    console.log('\n[email] teammate-invite (dry run)')
    console.log('  to:', d.email)
    console.log('  subject:', subject)
    console.log('  role:', d.role)
    console.log('  closingId:', d.closingId)
    return null
  }

  return sendEmail({
    to: d.email,
    replyTo: process.env.HELLO_EMAIL || 'hello@betterclose.co',
    subject,
    htmlBody: html,
    textBody: text,
  })
}
