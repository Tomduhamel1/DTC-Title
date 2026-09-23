import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ingestGardenOrder, IngestConflict, IngestPending } from '@/lib/closing/gardenIngest'

/**
 * Accepts an inbound order from Garden/TPS (or manual ops tooling).
 * Auth: shared secret in `Authorization: Bearer <ORDER_INGEST_SECRET>`.
 *
 * Flow:
 *   1. Resolve ONLY the exact Garden file number; contacts are not file IDs.
 *   2. Fill blanks; reject conflicting nonblank fields without overwriting.
 *   3. Atomically commit the closing, officer, teammate and email intents.
 *   4. Send pending notifications; return 503 until those intents complete.
 * Contract v2 acknowledges applied state. Unknown keys fail before writes.
 */

const Officer = z.object({
  name: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  nmls: z.string().nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
})

const str = z.string().trim().nullable().optional()
const email = z.string().trim().email().nullable().optional()
const Body = z.object({
  borrowerEmail: email,
  borrowerName: str,
  borrowerPhone: z.string().trim().refine(v => !v || v.replace(/[^0-9]/g, '').length >= 10,
    'Expected at least ten phone digits').nullable().optional(),
  propertyAddress: str,
  propertyCity: str,
  propertyState: str,
  propertyZip: str,
  propertyType: str,
  closingDate: z.string().refine(v => /^\d{4}-\d{2}-\d{2}$/.test(v) && Number(v.slice(0, 4)) > 0 && Number.isFinite(Date.parse(v)) &&
    new Date(v).toISOString().slice(0, 10) === v, 'Expected a real YYYY-MM-DD date').nullable().optional(),
  salePrice: z.number().finite().nullable().optional(),
  loanAmount: z.number().finite().nullable().optional(),
  lenderName: str,
  lenderCompany: str,
  lenderEmail: email,
  lenderPhone: str,
  lenderNmls: str,
  teammateEmail: email,
  teammateRole: str,
  placedByEmail: email,
  lenderContactEmail: email,
  orderingPartyEmail: email,
  gardenFileNumber: z.union([z.string().trim().min(1), z.number().finite()]).transform(String),
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
    console.warn('[orders/ingest] unknown keys rejected:', ignoredKeys.join(', '))
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
  if (ignoredKeys.length) return NextResponse.json({ error: 'unknown_fields', fields: ignoredKeys }, { status: 400 })
  try {
    return NextResponse.json(await ingestGardenOrder(parsed.data))
  } catch (err) {
    if (err instanceof IngestConflict) return NextResponse.json({
      ok: false, error: 'field_conflict', fields: err.fields,
    }, { status: 409 })
    // Includes serialization / unique-key races: retry the SAME file, never
    // fall back to a different closing. Do not leak DB errors or contact data.
    return NextResponse.json({ ok: false, error: err instanceof IngestPending
      ? 'notification_pending' : 'ingest_incomplete' }, { status: 503 })
  }
}
