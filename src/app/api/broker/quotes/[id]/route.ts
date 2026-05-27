import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireBrokerMember } from '@/lib/auth/session'

// GET /api/broker/quotes/[id]
//
// Company-scoped read. A broker can view any quote attached to a
// BrokerCompany they belong to, regardless of which co-member created it.
// Quotes at companies the caller does NOT belong to return 404 (not 403)
// so quote-id existence is not leaked.

export async function GET(_req: Request, { params }: { params: { id: string } }) {
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
      borrowerPhone: true,
      propertyAddress: true,
      propertyCity: true,
      propertyState: true,
      propertyZip: true,
      inputJson: true,
      outputJson: true,
      pdfS3Url: true,
      convertedClosingId: true,
      createdAt: true,
      updatedAt: true,
      expiresAt: true,
      brokerCompany: {
        select: { id: true, name: true, slug: true, verifiedAt: true },
      },
      brokerUser: { select: { id: true, name: true, email: true } },
    },
  })

  if (!quote) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, quote })
}

// PATCH /api/broker/quotes/[id]
//
// Narrow update of borrower/contact + property-display fields on an EXISTING
// quote, so a broker can run a fast quote (ZIP + amount only) and add borrower
// details later before sending/converting. Deliberately CANNOT touch the
// financial inputs or the frozen fee report — changing the numbers still
// requires creating a new quote. The allow-list below is the entire set of
// editable fields; .strict() rejects anything else (e.g. homeValue, zip,
// inputJson, outputJson, shareToken, status). Same company-ownership rule as
// GET/send/convert: a quote at a company the caller doesn't belong to is 404.
const PatchBody = z
  .object({
    borrowerName: z.string().trim().max(160).optional().nullable(),
    borrowerEmail: z.string().trim().email().max(254).optional().nullable(),
    borrowerPhone: z.string().trim().max(40).optional().nullable(),
    propertyAddress: z.string().trim().max(255).optional().nullable(),
    propertyCity: z.string().trim().max(120).optional().nullable(),
    propertyState: z.string().trim().max(2).optional().nullable(),
    propertyZip: z.string().trim().regex(/^\d{5}$/).optional().nullable(),
  })
  .strict()

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const ctx = await requireBrokerMember()
  if (!ctx) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const json = await req.json().catch(() => null)
  const parsed = PatchBody.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid body', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const companyIds = ctx.memberships.map((m) => m.companyId)
  const existing = await prisma.feeQuote.findFirst({
    where: { id: params.id, brokerCompanyId: { in: companyIds } },
    select: { id: true, status: true },
  })
  if (!existing) {
    // 404 (not 403) — don't leak existence of other companies' quotes.
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  // Don't allow editing a quote that's already a closing or expired — the
  // Closing (if any) already captured the borrower details, and an expired
  // quote should be re-created rather than edited.
  if (existing.status === 'converted') {
    return NextResponse.json(
      { error: 'cannot edit a quote that has been converted to a closing' },
      { status: 400 },
    )
  }
  if (existing.status === 'expired') {
    return NextResponse.json(
      { error: 'cannot edit an expired quote — create a new one' },
      { status: 400 },
    )
  }

  // Build the update from only the fields actually present in the body, so a
  // PATCH with just { borrowerEmail } doesn't clobber an existing name. Trim
  // empty strings to null. Email is lower-cased to match create-path
  // normalization.
  const d = parsed.data
  const data: Record<string, string | null> = {}
  const setIf = (key: keyof typeof d, transform?: (v: string) => string) => {
    if (d[key] === undefined) return
    const v = d[key]
    data[key] = v == null || v === '' ? null : transform ? transform(v) : v
  }
  setIf('borrowerName')
  setIf('borrowerEmail', (v) => v.toLowerCase())
  setIf('borrowerPhone')
  setIf('propertyAddress')
  setIf('propertyCity')
  setIf('propertyState', (v) => v.toUpperCase())
  setIf('propertyZip')

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ ok: true, updated: 0 })
  }

  const updated = await prisma.feeQuote.update({
    where: { id: existing.id },
    data,
    select: {
      id: true,
      status: true,
      borrowerName: true,
      borrowerEmail: true,
      borrowerPhone: true,
    },
  })

  return NextResponse.json({ ok: true, quote: updated })
}
