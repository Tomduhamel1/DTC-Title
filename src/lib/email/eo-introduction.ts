import { sendEmail } from '@/lib/aws/ses'
import { renderEmail, emailButton, emailMeta, escapeEmailHtml as esc } from './layout'
import type { OfficerIntroduction } from '@/lib/closing/notificationPolicy'

export async function sendEOIntroductionEmail(d: {
  to: string; propertyAddress: string; gardenFileNumber: string;
  dashboardUrl: string; officer: OfficerIntroduction
}): Promise<string | null> {
  if (process.env.AUTH_EMAIL_DRY_RUN === 'true') return null
  const eo = d.officer
  const subject = `Your file is open · ${d.propertyAddress || d.gardenFileNumber}`
  return sendEmail({ to: d.to, replyTo: eo.replyEmail, subject,
    htmlBody: renderEmail({ title: 'Your file is open',
      contentHtml: `${emailMeta(`${d.propertyAddress} · File ${d.gardenFileNumber}`)}
      <p>Meet your assigned Escrow Officer:</p>
      <img src="${esc(eo.photoUrl)}" alt="${esc(eo.name)}" width="112" height="112" style="border-radius:56px;object-fit:cover;object-position:center 30%;display:block;max-width:100%;">
      <p><strong>${esc(eo.name)}</strong><br>${esc(eo.title)}${eo.phone ? `<br>${esc(eo.phone)}` : ''}<br>${esc(eo.replyEmail)}</p>
      <p>${esc(eo.name)} will be reaching out to coordinate next steps. You can reply directly to this email to reach them.</p>
      ${emailButton(d.dashboardUrl, 'View file →')}
      <p>You can reply without creating an account. Verified sign-in is required only to view the private dashboard.</p>`,
      footerHtml: `Replies go to ${esc(eo.name)} at ${esc(eo.replyEmail)}.`,
    }),
    textBody: `Your file is open\n\n${d.propertyAddress}\nFile ${d.gardenFileNumber}\n\nYour assigned Escrow Officer:\n${eo.name}\n${eo.title}\n${eo.phone || ''}\n${eo.replyEmail}\n\n${eo.name} will be reaching out to coordinate next steps. Reply directly to this email to reach them.\n\nView file: ${d.dashboardUrl}\n\nYou can reply without creating an account. Verified sign-in is required only to view the private dashboard.`,
  })
}
