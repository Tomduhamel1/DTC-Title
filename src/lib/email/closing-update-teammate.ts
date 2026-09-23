// Professional-voice milestone email for teammates (lender, broker, real
// estate agent) on a BetterClose file. The borrower-voice copy lives in
// closing-update.ts; the fanout in closing-milestone.ts uses this helper for
// teammate recipients so they don't get "Your title order is in" framed as
// if it were their own purchase.

import { sendEmail } from '@/lib/aws/ses'
import { MILESTONE_LABELS, type MilestoneKind } from '@/lib/closing'
import { roleLabel, type TeammateRole } from '@/lib/professional/pronoun'
import { emailButton, emailMeta, escapeEmailHtml as escapeHtml, renderEmail } from './layout'

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
    d.borrowerName || null,
    d.propertyAddress || null,
  ]
    .filter(Boolean)
    .join(' · ')

  const sublineHtml = subline
    ? emailMeta(subline)
    : ''

  const html = renderEmail({
    title: headline,
    context: label,
    contentHtml: `<p>${escapeHtml(greeting)}</p>
    ${sublineHtml}
    <p style="margin-top:18px;">${body}</p>
    ${emailButton(d.teammateDashboardUrl, 'Open file →')}
    <p style="margin-top:28px;">— The BetterClose Team</p>`,
    footerHtml: 'Questions? Reply to this email — a real person will get back to you.',
  })

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
