// Milestone-transition emails. Sent when an admin marks a milestone as
// `done` (and only on that transition — see notifiedAt for idempotency).
//
// Respects AUTH_EMAIL_DRY_RUN so local dev logs to console instead of sending.

import { sendEmail } from '@/lib/aws/ses'
import { MILESTONE_LABELS, MILESTONE_DESCRIPTIONS, type MilestoneKind } from '@/lib/closing'
import { emailButton, emailMeta, escapeEmailHtml as escapeHtml, renderEmail } from './layout'

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
    "Your closing team opened your title order with BetterClose. We're starting on it now — most searches finish within a few business days.",
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
    ? emailMeta(d.propertyAddress)
    : ''

  const html = renderEmail({
    title: headline,
    contentHtml: `<p>${escapeHtml(greeting)}</p>
    ${propertyLine}
    <p style="margin-top:18px;">${body}</p>
    ${emailMeta(MILESTONE_DESCRIPTIONS[d.milestoneKind])}
    ${emailButton(d.dashboardUrl, 'View your closing →')}
    <p style="margin-top:28px;">— The BetterClose Team</p>`,
    footerHtml: 'Questions? Reply to this email — a real person will get back to you.',
  })

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
