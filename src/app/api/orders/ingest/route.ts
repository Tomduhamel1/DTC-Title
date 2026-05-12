import { NextResponse } from 'next/server'
import { createClosingFromOrder } from '@/lib/closing/createFromOrder'

/**
 * Accepts an inbound order from the title-software integration (or manual ops).
 * Auth: shared secret in `Authorization: Bearer <ORDER_INGEST_SECRET>`.
 *
 * Flow:
 *   1. Try to resolve to an existing closing (by email/phone/property).
 *   2. Matched: attach + fill in any blanks.
 *   3. Unmatched: create a new orphan Closing AND send a welcome email so the
 *      borrower can sign in and claim it.
 *
 * Domain logic lives in src/lib/closing/createFromOrder.ts so other callers
 * (e.g. a broker-originated quote-to-order conversion) can reuse the same
 * matching, milestone seeding, welcome-email, and teammate-attribution
 * behavior without re-implementing it.
 */
export async function POST(req: Request) {
  // Auth gate
  const auth = req.headers.get('authorization') || ''
  const expected = `Bearer ${process.env.ORDER_INGEST_SECRET || ''}`
  if (!process.env.ORDER_INGEST_SECRET || auth !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  const result = await createClosingFromOrder(
    body as Record<string, string | number | null | undefined>,
  )

  if (result.matched) {
    return NextResponse.json({
      ok: true,
      matchedBy: result.matchedBy,
      closingId: result.closingId,
      teammateLinked: result.teammateLinked,
    })
  }

  return NextResponse.json({
    ok: true,
    matchedBy: null,
    closingId: result.closingId,
    welcomeEmailedTo: result.welcomeEmailedTo,
    teammateLinked: result.teammateLinked,
  })
}
