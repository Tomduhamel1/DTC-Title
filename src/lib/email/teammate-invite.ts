import { sendEmail } from '@/lib/aws/ses'
import { roleLabel, type TeammateRole } from '@/lib/professional/pronoun'

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

  const html = `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#f8fafc;color:#0f172a;padding:32px 16px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:36px 32px;border:1px solid #e2e8f0;line-height:1.6;font-size:15px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#0f172a;margin-bottom:24px;">BETTERCLOSE</div>
    <h1 style="font-size:24px;font-weight:800;margin:0 0 16px 0;">You're named on a closing</h1>
    <p>Hi,</p>
    <p>You've been listed as the ${labelLower} on a BetterClose closing file${borrowerHtml ? ` for${borrowerHtml}` : ''}${propertyHtml}.</p>
    <p>Sign in with this email to see milestones in real time, share documents, and stay in sync with the rest of the team.</p>
    <p style="margin:28px 0;">
      <a href="${inviteUrl}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;">Open the file →</a>
    </p>
    <p style="color:#64748b;font-size:13px;">One-tap sign-in. No password to remember.</p>
    <p style="margin-top:28px;">— The BetterClose Team</p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;">
    <p style="font-size:12px;color:#94a3b8;">
      Got this by mistake? You can ignore it — no account will be created unless you sign in.
    </p>
  </div>
</body>
</html>`

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

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
