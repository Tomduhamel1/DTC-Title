import { sendEmail } from '@/lib/aws/ses'

export interface WelcomeEmailData {
  borrowerEmail: string
  borrowerName?: string
  propertyAddress?: string
  lenderCompany?: string
  baseUrl: string
}

export async function sendWelcomeEmail(d: WelcomeEmailData): Promise<string> {
  const greeting = d.borrowerName ? `Hi ${d.borrowerName.split(' ')[0]},` : 'Hi,'
  const claimUrl = `${d.baseUrl}/welcome?email=${encodeURIComponent(d.borrowerEmail)}`
  const lender = d.lenderCompany ? ` from ${d.lenderCompany}` : ''
  const property = d.propertyAddress ? ` for <strong>${escapeHtml(d.propertyAddress)}</strong>` : ''
  const propertyText = d.propertyAddress ? ` for ${d.propertyAddress}` : ''

  const subject = 'Your BetterClose dashboard is ready'
  const htmlBody = `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#f8fafc;color:#0f172a;padding:32px 16px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:36px 32px;border:1px solid #e2e8f0;line-height:1.6;font-size:15px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#0f172a;margin-bottom:24px;">BETTERCLOSE</div>
    <h1 style="font-size:24px;font-weight:800;margin:0 0 16px 0;">Your closing is with BetterClose</h1>
    <p>${greeting}</p>
    <p>Your lender${lender} just placed your title order with BetterClose${property}. We've created a dashboard so you can track every step — loan locked, title ordered, title issued, and closed.</p>
    <p style="margin:28px 0;">
      <a href="${claimUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;">Open my dashboard →</a>
    </p>
    <p>One-tap sign-in. No password to remember.</p>
    <p style="margin-top:28px;">
      Welcome,<br>
      The BetterClose Team
    </p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;">
    <p style="font-size:12px;color:#94a3b8;">
      Questions? Reply to this email or call (855) 555-SAVE.
    </p>
  </div>
</body>
</html>`

  const textBody = `${greeting}

Your lender${lender} just placed your title order with BetterClose${propertyText}. We've created a dashboard so you can track every step — loan locked, title ordered, title issued, and closed.

Open your dashboard: ${claimUrl}

One-tap sign-in. No password to remember.

Welcome,
The BetterClose Team

Questions? Reply to this email or call (855) 555-SAVE.`

  return sendEmail({
    to: d.borrowerEmail,
    replyTo: process.env.HELLO_EMAIL || 'hello@betterclose.co',
    subject,
    htmlBody,
    textBody,
  })
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
