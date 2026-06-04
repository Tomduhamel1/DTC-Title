// Professional-voice milestone email for teammates (lender, broker, real
// estate agent) on a BetterClose file. The borrower-voice copy lives in
// closing-update.ts; the fanout in closing-milestone.ts uses this helper for
// teammate recipients so they don't get "Your title order is in" framed as
// if it were their own purchase.

import { sendEmail } from '@/lib/aws/ses'
import { MILESTONE_LABELS, type MilestoneKind } from '@/lib/closing'
import { roleLabel, type TeammateRole } from '@/lib/professional/pronoun'

const dryRun = () => process.env.AUTH_EMAIL_DRY_RUN === 'true'

const KIND_HEADLINE: Record<MilestoneKind, string> = {
  loan_locked: 'Loan locked.',
  title_ordered: 'Title order opened.',
  title_search: 'Title search complete.',
  title_issued: 'Title insurance issued.',
  closed: 'File closed.',
}

const KIND_BODY: Record<MilestoneKind, string> = {
  loan_locked:
    'The lender finalized the borrower\'s interest rate. The title order should follow shortly.',
  title_ordered:
    'BetterClose has the order and the title search is underway. Most searches finish within a few business days.',
  title_search:
    'We confirmed clean title — no liens, no surprises. Up next is policy issuance.',
  title_issued:
    'The title insurance policy has been issued by an A-rated underwriter. Closing day is the last step.',
  closed:
    'Funds have been disbursed and the deed is recorded. This file is complete.',
}

export interface TeammateMilestoneEmailData {
  to: string
  recipientFirstName?: string | null
  role: TeammateRole
  milestoneKind: MilestoneKind
  propertyAddress?: string | null
  borrowerName?: string | null
  teammateDashboardUrl: string
}

export async function sendClosingUpdateTeammateEmail(
  d: TeammateMilestoneEmailData,
): Promise<string | null> {
  const greeting = d.recipientFirstName ? `Hi ${d.recipientFirstName},` : 'Hi,'
  const headline = KIND_HEADLINE[d.milestoneKind]
  const body = KIND_BODY[d.milestoneKind]
  const label = roleLabel(d.role)
  const fileLabel = d.propertyAddress || d.borrowerName || 'BetterClose file'
  const subject = `${MILESTONE_LABELS[d.milestoneKind]} · ${fileLabel}`

  const subline = [
    d.borrowerName ? escapeHtml(d.borrowerName) : null,
    d.propertyAddress ? escapeHtml(d.propertyAddress) : null,
  ]
    .filter(Boolean)
    .join(' · ')

  const sublineHtml = subline
    ? `<p style="color:#64748b;font-size:13px;margin-top:4px;">${subline}</p>`
    : ''

  const html = `<!DOCTYPE html>
<html><body style="font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#f8fafc;color:#0f172a;padding:32px 16px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:36px 32px;border:1px solid #e2e8f0;line-height:1.6;font-size:15px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.2em;color:#0f172a;margin-bottom:12px;">BETTERCLOSE · ${label.toUpperCase()}</div>
    <p>${greeting}</p>
    <h1 style="font-size:24px;font-weight:900;color:#0f172a;margin:8px 0 4px;">${headline}</h1>
    ${sublineHtml}
    <p style="margin-top:18px;">${body}</p>
    <p style="margin:28px 0;">
      <a href="${d.teammateDashboardUrl}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;">Open file →</a>
    </p>
    <p style="color:#64748b;font-size:13px;">Questions? Reply to this email — a real person will get back to you.</p>
    <p style="margin-top:28px;">— The BetterClose Team</p>
  </div>
</body></html>`

  const sublineText = [d.borrowerName, d.propertyAddress].filter(Boolean).join(' · ')

  const text = `${greeting}

${headline}${sublineText ? `\n${sublineText}` : ''}

${body}

Open file: ${d.teammateDashboardUrl}

Questions? Reply to this email — a real person will get back to you.

— The BetterClose Team`

  if (dryRun()) {
    console.log('\n[email] closing-update-teammate (dry run)')
    console.log('  to:', d.to)
    console.log('  subject:', subject)
    console.log('  role:', d.role)
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
