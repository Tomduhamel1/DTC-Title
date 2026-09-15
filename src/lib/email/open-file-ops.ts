import { sendEmail } from '@/lib/aws/ses'
import { brokerOpsRecipient } from '@/lib/email/broker-conversion-ops'

// Ops notification for a file opened through the public /open form. Mirrors
// the broker-conversion ops email: everything ops needs to open the order in
// Garden, plus the BetterClose closing id Garden should store for the TPS
// callbacks (details PATCH / milestone POST).

export interface OpenFileOpsEmailData {
  closingId: string
  matched: boolean
  role: 'borrower' | 'broker' | 'realtor' | 'lender'
  submitterName?: string | null
  submitterEmail?: string | null
  submitterCompany?: string | null
  submitterPhone?: string | null
  borrowerName?: string | null
  borrowerEmail?: string | null
  borrowerPhone?: string | null
  propertyAddress?: string | null
  propertyCity?: string | null
  propertyState?: string | null
  propertyZip?: string | null
  transactionType?: string | null
  salePrice?: number | null
  loanAmount?: number | null
  closingDate?: string | null
  notes?: string | null
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function sendOpenFileOpsEmail(
  d: OpenFileOpsEmailData,
): Promise<{ recipient: string; messageId: string | null }> {
  const recipient = brokerOpsRecipient()
  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.betterclose.co'

  const fileLabel =
    d.propertyAddress || d.borrowerName || d.borrowerEmail || 'new order'
  const subject = `New web order · ${fileLabel} · via ${d.role}`
  const adminUrl = `${baseUrl}/admin/closings/${d.closingId}`

  const rows: [string, string | null | undefined][] = [
    ['Placed by', `${d.submitterName || '—'} (${d.role})`],
    ['Submitter email', d.submitterEmail],
    ['Submitter company', d.submitterCompany],
    ['Submitter phone', d.submitterPhone],
    ['Borrower', d.borrowerName],
    ['Borrower email', d.borrowerEmail],
    ['Borrower phone', d.borrowerPhone],
    [
      'Property',
      [d.propertyAddress, d.propertyCity, d.propertyState, d.propertyZip]
        .filter(Boolean)
        .join(', '),
    ],
    ['Transaction', d.transactionType],
    ['Sale price', d.salePrice ? `$${Math.round(d.salePrice).toLocaleString()}` : null],
    ['Loan amount', d.loanAmount ? `$${Math.round(d.loanAmount).toLocaleString()}` : null],
    ['Target closing date', d.closingDate],
    ['Notes', d.notes],
    ['BetterClose closing id', d.closingId],
    ['Matched existing file', d.matched ? 'yes — merged into existing closing' : 'no — new file'],
  ]

  const textBody = [
    `A new order was placed on betterclose.co/open.`,
    '',
    ...rows
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`),
    '',
    `Admin: ${adminUrl}`,
    '',
    `Open the file in Garden, then push the escrow officer via`,
    `PATCH /api/tps/closings/${d.closingId}/details (see docs/tps-integration.md).`,
  ].join('\n')

  const htmlBody = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;color:#0f172a">
      <p>A new order was placed on <b>betterclose.co/open</b>.</p>
      <table style="border-collapse:collapse">
        ${rows
          .filter(([, v]) => v)
          .map(
            ([k, v]) =>
              `<tr><td style="padding:2px 14px 2px 0;color:#64748b">${esc(k)}</td><td style="padding:2px 0"><b>${esc(String(v))}</b></td></tr>`,
          )
          .join('')}
      </table>
      <p><a href="${adminUrl}">Open in admin</a></p>
      <p style="color:#64748b">Open the file in Garden, then push the escrow officer via
      <code>PATCH /api/tps/closings/${d.closingId}/details</code> (docs/tps-integration.md).</p>
    </div>`

  try {
    const messageId = await sendEmail({ to: recipient, subject, htmlBody, textBody })
    return { recipient, messageId }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[orders/open] ops email failed', err)
    return { recipient, messageId: null }
  }
}
