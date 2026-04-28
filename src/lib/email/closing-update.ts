// Milestone-transition emails. Sent when an admin marks a milestone as
// `done` (and only on that transition — see notifiedAt for idempotency).
//
// Respects AUTH_EMAIL_DRY_RUN so local dev logs to console instead of sending.

import { sendEmail } from '@/lib/aws/ses'
import { MILESTONE_LABELS, MILESTONE_DESCRIPTIONS, type MilestoneKind } from '@/lib/closing'

const dryRun = () => process.env.AUTH_EMAIL_DRY_RUN === 'true'

// Tailored opening line per milestone — gives the email a reason to exist
// beyond "we updated a status field somewhere."
const KIND_HEADLINE: Record<MilestoneKind, string> = {
  loan_locked: 'Your loan is locked.',
  title_ordered: 'Your title order is in.',
  title_search: 'Title search is complete.',
  title_issued: 'Your title insurance is issued.',
  closed: "You're closed!",
}

const KIND_BODY: Record<MilestoneKind, string> = {
  loan_locked:
    "Your lender finalized your interest rate. From here, we'll wait for the title order to come through and then start your search.",
  title_ordered:
    "Your lender (or you) placed the title order with BetterClose. We're starting on it now — most searches finish within a few business days.",
  title_search:
    "We've completed the title search and confirmed clean title — no liens, no surprises. Next up: issuing the policy.",
  title_issued:
    'Your title insurance policy has been issued by an A-rated underwriter. You are protected. The last step is closing day itself.',
  closed:
    "Funds have been disbursed and the deed is recorded. Welcome home — or, if you're refinancing, congrats on the new loan.",
}

export interface ClosingUpdateEmailData {
  to: string
  borrowerFirstName?: string | null
  milestoneKind: MilestoneKind
  propertyAddress?: string | null
  dashboardUrl: string
}

export async function sendClosingUpdateEmail(d: ClosingUpdateEmailData): Promise<string | null> {
  const greeting = d.borrowerFirstName ? `Hi ${d.borrowerFirstName},` : 'Hi,'
  const headline = KIND_HEADLINE[d.milestoneKind]
  const body = KIND_BODY[d.milestoneKind]
  const subject = `${MILESTONE_LABELS[d.milestoneKind]} · BetterClose`
  const propertyLine = d.propertyAddress
    ? `<p style="color:#64748b;font-size:13px;margin-top:4px;">${escapeHtml(d.propertyAddress)}</p>`
    : ''

  const html = `<!DOCTYPE html>
<html><body style="font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#f8fafc;color:#0f172a;padding:32px 16px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:36px 32px;border:1px solid #e2e8f0;line-height:1.6;font-size:15px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#0f172a;margin-bottom:12px;">BETTERCLOSE</div>
    <p>${greeting}</p>
    <h1 style="font-size:26px;font-weight:900;color:#0f172a;margin:8px 0 4px;">${headline}</h1>
    ${propertyLine}
    <p style="margin-top:18px;">${body}</p>
    <p style="margin-top:14px;color:#64748b;font-size:13px;">${escapeHtml(MILESTONE_DESCRIPTIONS[d.milestoneKind])}</p>
    <p style="margin:28px 0;">
      <a href="${d.dashboardUrl}" style="display:inline-block;background:#10b981;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;">View your closing →</a>
    </p>
    <p style="color:#64748b;font-size:13px;">Questions? Reply to this email — a real person will get back to you.</p>
    <p style="margin-top:28px;">— The BetterClose Team</p>
  </div>
</body></html>`

  const text = `${greeting}

${headline}${d.propertyAddress ? `\n${d.propertyAddress}` : ''}

${body}

${MILESTONE_DESCRIPTIONS[d.milestoneKind]}

View your closing: ${d.dashboardUrl}

Questions? Reply to this email — a real person will get back to you.

— The BetterClose Team`

  if (dryRun()) {
    console.log('\n[email] closing-update (dry run)')
    console.log('  to:', d.to)
    console.log('  subject:', subject)
    console.log('  kind:', d.milestoneKind)
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
