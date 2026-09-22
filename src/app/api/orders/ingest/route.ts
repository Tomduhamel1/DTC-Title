import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClosingFromOrder } from '@/lib/closing/createFromOrder'
import { applyEscrowOfficer } from '@/lib/closing/officer'

/**
 * Accepts an inbound order from Garden/TPS (or manual ops tooling).
 * Auth: shared secret in `Authorization: Bearer <ORDER_INGEST_SECRET>`.
 *
 * Flow:
 *   1. Try to resolve to an existing closing (gardenFileNumber, then
 *      email/phone/property).
 *   2. Matched: attach + fill in any blanks (never clobbers existing values).
 *   3. Unmatched: create a new orphan Closing AND send a welcome email so the
 *      borrower can sign in and claim it. The placing teammate gets a
 *      dashboard-invite email keyed to their work address.
 *   4. If `escrowOfficer` is present, the officer is set in the same call —
 *      so Garden can open a file with the officer already assigned in one
 *      request instead of ingest + details PATCH.
 *
 * Validation is deliberately tolerant (unknown keys are ACCEPTED but reported
 * back in `ignoredKeys` and logged) — a typo'd field from Garden should be
 * loudly visible, not a silent no-op, but it should never fail the order.
 */

const Officer = z.object({
  name: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  nmls: z.string().nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
})

const str = z.union([z.string(), z.number()]).nullable().optional()
const Body = z.object({
  borrowerEmail: str,
  borrowerName: str,
  borrowerPhone: str,
  propertyAddress: str,
  propertyCity: str,
  propertyState: str,
  propertyZip: str,
  propertyType: str,
  closingDate: str,
  salePrice: z.number().nullable().optional(),
  loanAmount: z.number().nullable().optional(),
  lenderName: str,
  lenderCompany: str,
  lenderEmail: str,
  lenderPhone: str,
  lenderNmls: str,
  teammateEmail: str,
  teammateRole: str,
  placedByEmail: str,
  lenderContactEmail: str,
  orderingPartyEmail: str,
  gardenFileNumber: str,
  source: z.string().optional(),
  escrowOfficer: Officer.optional(),
})

const KNOWN_KEYS = new Set(Object.keys(Body.shape))

export async function POST(req: Request) {
  // Auth gate
  const auth = req.headers.get('authorization') || ''
  const expected = `Bearer ${process.env.ORDER_INGEST_SECRET || ''}`
  if (!process.env.ORDER_INGEST_SECRET || auth !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const raw = await req.json().catch(() => null)
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  // Surface unknown keys instead of silently dropping them.
  const ignoredKeys = Object.keys(raw).filter((k) => !KNOWN_KEYS.has(k))
  if (ignoredKeys.length > 0) {
    // eslint-disable-next-line no-console
    console.warn('[orders/ingest] unknown keys ignored:', ignoredKeys.join(', '))
  }

  const parsed = Body.safeParse(
    Object.fromEntries(Object.entries(raw).filter(([k]) => KNOWN_KEYS.has(k))),
  )
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid body', details: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const { escrowOfficer, ...order } = parsed.data

  const result = await createClosingFromOrder(order)

  let officerFieldsSet = 0
  if (escrowOfficer) {
    try {
      officerFieldsSet = await applyEscrowOfficer(result.closingId, escrowOfficer)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[orders/ingest] escrow officer apply failed', err)
    }
  }

  if (result.matched) {
    return NextResponse.json({
      ok: true,
      matchedBy: result.matchedBy,
      closingId: result.closingId,
      teammateLinked: result.teammateLinked,
      officerFieldsSet,
      ...(ignoredKeys.length ? { ignoredKeys } : {}),
    })
  }

  return NextResponse.json({
    ok: true,
    matchedBy: null,
    closingId: result.closingId,
    welcomeEmailedTo: result.welcomeEmailedTo,
    teammateLinked: result.teammateLinked,
    officerFieldsSet,
    ...(ignoredKeys.length ? { ignoredKeys } : {}),
  })
}
