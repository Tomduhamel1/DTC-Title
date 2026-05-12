import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireBrokerMember } from '@/lib/auth/session'
import { sendBrokerQuoteEmail } from '@/lib/email/broker-quote'
import type { FeeReport } from '@/lib/feeReport'

// POST /api/broker/quotes/[id]/send
//
// Send the saved FeeQuote to its borrower by email and record the event.
//
// Company-scoped access: matches PR 5 — quote.brokerCompanyId must be in
// the caller's BrokerMembership company IDs. Cross-company access returns
// 404 (not 403) so quote-id existence is not leaked.
//
// State-machine:
//   status='draft'             → send,   record 'sent',   transition → 'sent'
//   status='sent' | 'viewed'   → resend, record 'resent', no status change
//   status='converted'         → 400  (already a Closing)
//   status='expired'           → 400  (broker should create a new quote)
//
// The SES call is made BEFORE the transaction so a slow/failing send does
// not hold a row lock or record a misleading "sent" event for a delivery
// that never happened. If SES fails the response is 502 and the caller can
// retry.

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const ctx = await requireBrokerMember()
  if (!ctx) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const companyIds = ctx.memberships.map((m) => m.companyId)
  const quote = await prisma.feeQuote.findFirst({
    where: { id: params.id, brokerCompanyId: { in: companyIds } },
    select: {
      id: true,
      status: true,
      shareToken: true,
      borrowerName: true,
      borrowerEmail: true,
      propertyAddress: true,
      propertyCity: true,
      propertyState: true,
      propertyZip: true,
      outputJson: true,
      brokerCompany: { select: { name: true } },
      brokerUser: { select: { name: true, email: true } },
    },
  })
  if (!quote) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  if (!quote.borrowerEmail) {
    return NextResponse.json(
      { error: 'borrower email required to send this quote' },
      { status: 400 },
    )
  }

  let nextStatus: string = quote.status
  let eventKind: 'sent' | 'resent'
  if (quote.status === 'draft') {
    nextStatus = 'sent'
    eventKind = 'sent'
  } else if (quote.status === 'sent' || quote.status === 'viewed') {
    eventKind = 'resent'
  } else if (quote.status === 'converted') {
    return NextResponse.json(
      { error: 'cannot send a quote that has been converted to a closing' },
      { status: 400 },
    )
  } else if (quote.status === 'expired') {
    return NextResponse.json(
      { error: 'cannot send an expired quote — create a new one' },
      { status: 400 },
    )
  } else {
    // Unknown status (forward-compat). Be conservative: refuse.
    return NextResponse.json(
      { error: `cannot send a quote with status='${quote.status}'` },
      { status: 400 },
    )
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.betterclose.co'
  const publicViewUrl = `${baseUrl}/quote/view?token=${quote.shareToken}`
  const propertyAddress =
    [quote.propertyAddress, quote.propertyCity, quote.propertyState, quote.propertyZip]
      .filter(Boolean)
      .join(', ') || null
  const borrowerFirstName = quote.borrowerName?.split(' ')[0] || null
  const brokerDisplayName = quote.brokerUser?.name || quote.brokerUser?.email || null

  let providerMessageId: string | null = null
  try {
    providerMessageId = await sendBrokerQuoteEmail({
      to: quote.borrowerEmail,
      borrowerFirstName,
      brokerCompanyName: quote.brokerCompany?.name ?? null,
      brokerDisplayName,
      propertyAddress,
      feeReport: (quote.outputJson as unknown as FeeReport) ?? null,
      publicViewUrl,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[broker/quotes/send] email send failed:', err)
    const message = err instanceof Error ? err.message : 'unknown error'
    return NextResponse.json({ error: `email send failed: ${message}` }, { status: 502 })
  }

  // Email succeeded (or was dry-run): record the event + status transition
  // atomically. If this DB write fails, the email already went out — we'd
  // rather over-record on retry than miss the event entirely.
  await prisma.$transaction(async (tx) => {
    await tx.feeQuoteEvent.create({
      data: {
        feeQuoteId: quote.id,
        kind: eventKind,
        metadata: {
          to: quote.borrowerEmail,
          providerMessageId: providerMessageId ?? null,
          dryRun: providerMessageId === null,
        },
      },
    })
    if (nextStatus !== quote.status) {
      await tx.feeQuote.update({
        where: { id: quote.id },
        data: { status: nextStatus },
      })
    }
  })

  return NextResponse.json({ ok: true, kind: eventKind, status: nextStatus })
}
