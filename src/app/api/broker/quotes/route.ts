import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireBrokerMember } from '@/lib/auth/session'
import { fetchElendFeeEstimate } from '@/lib/elendCalc'
import { computeTotals } from '@/lib/feeReport'
import {
  computeInputHash,
  defaultExpiresAt,
  generateShareToken,
  normalizeFeeQuoteInput,
  resolveAmounts,
} from '@/lib/feeQuote'

// POST /api/broker/quotes  — create a draft FeeQuote
// GET  /api/broker/quotes  — list current broker's FeeQuotes (most recent first)
//
// Both require BrokerMembership. Membership is the gate; User.accountType
// is not consulted (PR 4 set that convention).

const CreateBody = z.object({
  transactionType: z.enum(['purchase', 'refinance']),
  zip: z.string().regex(/^\d{5}$/, 'ZIP must be 5 digits'),
  homeValue: z.number().positive().optional(),
  loanAmount: z.number().positive().optional(),

  borrowerName: z.string().trim().max(160).optional().nullable(),
  borrowerEmail: z.string().trim().email().max(254).optional().nullable(),
  borrowerPhone: z.string().trim().max(40).optional().nullable(),

  propertyAddress: z.string().trim().max(255).optional().nullable(),
  propertyCity: z.string().trim().max(120).optional().nullable(),
  propertyState: z.string().trim().max(2).optional().nullable(),
  propertyZip: z.string().trim().regex(/^\d{5}$/).optional().nullable(),

  // Required only when the caller has multiple BrokerMemberships.
  companyId: z.string().min(1).optional(),
})

export async function POST(req: Request) {
  const ctx = await requireBrokerMember()
  if (!ctx) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const json = await req.json().catch(() => null)
  const parsed = CreateBody.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid body', details: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const data = parsed.data

  // ── Resolve company ──────────────────────────────────────────────────────
  let companyId: string
  if (data.companyId) {
    const owned = ctx.memberships.find((m) => m.companyId === data.companyId)
    if (!owned) {
      return NextResponse.json(
        { error: 'companyId does not match any of your memberships' },
        { status: 403 },
      )
    }
    companyId = owned.companyId
  } else if (ctx.memberships.length === 1) {
    companyId = ctx.memberships[0].companyId
  } else {
    return NextResponse.json(
      {
        error: 'companyId required',
        companies: ctx.memberships.map((m) => ({
          id: m.companyId,
          name: m.companyName,
        })),
      },
      { status: 400 },
    )
  }

  // ── Resolve transaction amounts (mirrors /api/fee-estimate exactly) ──────
  const resolved = resolveAmounts({
    transactionType: data.transactionType,
    homeValue: data.homeValue ?? null,
    loanAmount: data.loanAmount ?? null,
  })
  if (!resolved.ok) {
    return NextResponse.json({ error: resolved.error }, { status: 400 })
  }

  // ── Live fee estimate (same upstream as the public quote flow) ───────────
  let report
  try {
    report = await fetchElendFeeEstimate({
      transactionType: data.transactionType,
      zip: data.zip,
      homeValue: resolved.homeValue,
      loanAmount: resolved.loanAmount,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[broker/quotes] fee estimate failed:', err)
    const message = err instanceof Error ? err.message : 'unknown error'
    return NextResponse.json({ error: `fee estimate failed: ${message}` }, { status: 502 })
  }

  // Freeze savings totals at issuance — the quote keeps displaying the
  // numbers it was created with even if formulas/constants change later.
  report.frozenTotals = computeTotals(report)

  // ── Persist ──────────────────────────────────────────────────────────────
  const normalized = normalizeFeeQuoteInput({
    transactionType: data.transactionType,
    zip: data.zip,
    homeValue: resolved.homeValue,
    loanAmount: resolved.loanAmount,
    borrowerName: data.borrowerName ?? null,
    borrowerEmail: data.borrowerEmail ?? null,
    borrowerPhone: data.borrowerPhone ?? null,
    propertyAddress: data.propertyAddress ?? null,
    propertyCity: data.propertyCity ?? null,
    propertyState: data.propertyState ?? null,
    propertyZip: data.propertyZip ?? data.zip,
  })

  const created = await prisma.feeQuote.create({
    data: {
      brokerUserId: ctx.userId,
      brokerCompanyId: companyId,
      shareToken: generateShareToken(),
      inputHash: computeInputHash(normalized),
      status: 'draft',
      inputJson: normalized as object,
      outputJson: report as unknown as object,
      borrowerName: normalized.borrowerName,
      borrowerEmail: normalized.borrowerEmail,
      borrowerPhone: normalized.borrowerPhone,
      propertyAddress: normalized.propertyAddress,
      propertyCity: normalized.propertyCity,
      propertyState: normalized.propertyState,
      propertyZip: normalized.propertyZip,
      expiresAt: defaultExpiresAt(),
    },
    select: { id: true, status: true },
  })

  return NextResponse.json({ ok: true, quoteId: created.id, status: created.status })
}

export async function GET() {
  const ctx = await requireBrokerMember()
  if (!ctx) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Company-scoped: a broker sees every quote attached to any BrokerCompany
  // they belong to, regardless of which co-member created it. Multi-company
  // brokers see quotes across all of their companies interleaved.
  //
  // Quotes whose brokerCompanyId is null (orphaned after the company was
  // deleted) won't match `in: [...]` filters — they remain invisible to all
  // brokers until admin tooling reattaches them.
  const companyIds = ctx.memberships.map((m) => m.companyId)
  const quotes = await prisma.feeQuote.findMany({
    where: { brokerCompanyId: { in: companyIds } },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      borrowerName: true,
      borrowerEmail: true,
      propertyAddress: true,
      propertyCity: true,
      propertyState: true,
      createdAt: true,
      expiresAt: true,
      outputJson: true,
      brokerCompany: { select: { id: true, name: true } },
      brokerUser: { select: { id: true, name: true, email: true } },
    },
  })

  return NextResponse.json({ ok: true, quotes })
}
