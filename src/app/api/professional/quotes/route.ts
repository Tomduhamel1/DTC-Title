import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { fetchElendFeeEstimate } from '@/lib/elendCalc'
import {
  computeInputHash,
  defaultExpiresAt,
  generateShareToken,
  normalizeFeeQuoteInput,
  resolveAmounts,
} from '@/lib/feeQuote'
import { rateLimit } from '@/lib/rate-limit'

// POST /api/professional/quotes — create a durable, shareable FeeQuote for a
// professional using /for-my-team/quote.
//
// Public + unauthenticated by design: a borrower-invited professional (broker,
// LO, agent, or other) has no BrokerMembership and no login. The persisted
// FeeQuote is written with brokerUserId = null and brokerCompanyId = null, so
// it never appears in any broker's company-scoped pipeline and never implies
// membership. This is intentionally separate from POST /api/broker/quotes
// (which requires BrokerMembership) — same FeeQuote model, no shared auth.
//
// Returns the live fee report (so the client renders the result from one
// round-trip — one upstream call) plus { shareToken, viewUrl }. The viewUrl
// is the existing public /quote/view?token=... page, which already renders
// null-broker quotes and only ever exposes public-safe fields. We never return
// the internal FeeQuote id.
//
// Rate-limited per IP (same in-memory limiter + idiom as /api/fee-estimate),
// because each create triggers the same third-party fee-calculator call.

const Body = z.object({
  transactionType: z.enum(['purchase', 'refinance']),
  zip: z.string().regex(/^\d{5}$/, 'ZIP must be 5 digits'),
  homeValue: z.number().positive().optional(),
  loanAmount: z.number().positive().optional(),

  // Minimal borrower PII: only an optional display name and property location.
  // Deliberately no borrower email/phone on this public create route — the
  // public view only ever shows borrowerName anyway, so collecting more would
  // widen the PII stored behind a shareable link with no benefit.
  borrowerName: z.string().trim().max(160).optional().nullable(),
  propertyState: z.string().trim().max(2).optional().nullable(),

  // Borrower-invite attribution. Recorded server-side only (FeeQuoteEvent
  // metadata) — never persisted to a viewable column, never returned.
  refId: z.string().trim().max(128).optional().nullable(),
})

export async function POST(req: Request) {
  // Rate limit before parsing the body or calling the upstream fee calculator.
  // Public, unauthenticated route that fans out to a third-party fee API
  // (src/lib/elendCalc.ts). Inline IP idiom matches /api/fee-estimate and the
  // public quote view (src/app/quote/view/page.tsx).
  const ipHeader = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || ''
  const ip = ipHeader.split(',')[0].trim() || 'unknown'
  const limit = rateLimit(`professional-quote:${ip}`, 20, 60_000)
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Too many requests. Please wait a minute and try again.',
        retryAfterSeconds: 60,
      },
      { status: 429, headers: { 'Retry-After': '60' } },
    )
  }

  const json = await req.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid body', details: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const data = parsed.data

  // Resolve transaction amounts (mirrors /api/fee-estimate and the broker
  // route exactly via the shared helper).
  const resolved = resolveAmounts({
    transactionType: data.transactionType,
    homeValue: data.homeValue ?? null,
    loanAmount: data.loanAmount ?? null,
  })
  if (!resolved.ok) {
    return NextResponse.json({ error: resolved.error }, { status: 400 })
  }

  // Single upstream fee-estimate call.
  let report
  try {
    report = await fetchElendFeeEstimate({
      transactionType: data.transactionType,
      zip: data.zip,
      homeValue: resolved.homeValue,
      loanAmount: resolved.loanAmount,
    })
  } catch (err) {
    console.error('[professional/quotes] fee estimate failed:', err)
    const message = err instanceof Error ? err.message : 'unknown error'
    return NextResponse.json({ ok: false, error: `fee estimate failed: ${message}` }, { status: 502 })
  }

  const normalized = normalizeFeeQuoteInput({
    transactionType: data.transactionType,
    zip: data.zip,
    homeValue: resolved.homeValue,
    loanAmount: resolved.loanAmount,
    borrowerName: data.borrowerName ?? null,
    propertyState: data.propertyState ?? null,
    propertyZip: data.zip,
  })

  // Persist a null-broker FeeQuote. If this fails, the client falls back to an
  // ephemeral result (it still has the report below), so persistence is
  // additive and never blocks the professional from seeing their number.
  let shareToken: string | null = null
  try {
    const created = await prisma.feeQuote.create({
      data: {
        brokerUserId: null,
        brokerCompanyId: null,
        shareToken: generateShareToken(),
        inputHash: computeInputHash(normalized),
        status: 'draft',
        inputJson: normalized as object,
        outputJson: report as unknown as object,
        borrowerName: normalized.borrowerName,
        propertyState: normalized.propertyState,
        propertyZip: normalized.propertyZip,
        expiresAt: defaultExpiresAt(),
      },
      select: { id: true, shareToken: true },
    })
    shareToken = created.shareToken

    // Best-effort attribution: record refId server-side only, never on a
    // viewable column. A failure here must not affect the response.
    if (data.refId) {
      try {
        await prisma.feeQuoteEvent.create({
          data: {
            feeQuoteId: created.id,
            kind: 'professional:created',
            metadata: { refId: data.refId },
          },
        })
      } catch (eventErr) {
        console.error('[professional/quotes] refId event record failed:', eventErr)
      }
    }
  } catch (persistErr) {
    // Swallow: return the report without a shareToken so the client renders
    // the ephemeral result. Surface report regardless.
    console.error('[professional/quotes] persist failed:', persistErr)
  }

  return NextResponse.json({
    ok: true,
    report,
    shareToken,
    viewUrl: shareToken ? `/quote/view?token=${shareToken}` : null,
  })
}
