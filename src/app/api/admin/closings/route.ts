import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth/session'
import { isAdminEmail } from '@/lib/auth/admin'
import { createClosingFromOrder } from '@/lib/closing/createFromOrder'

// POST /api/admin/closings — ops opens a file from an emailed/phoned-in
// order. Same write path as Garden ingest and /open, so the borrower welcome
// email, teammate dashboard invite, milestone seeding, and dedupe matching
// all fire identically. Admin session required (JSON 401, not a redirect).

const Body = z.object({
  borrowerName: z.string().trim().max(160).optional(),
  borrowerEmail: z.string().trim().email().max(254).optional(),
  borrowerPhone: z.string().trim().max(40).optional(),
  propertyAddress: z.string().trim().max(240).optional(),
  propertyCity: z.string().trim().max(120).optional(),
  propertyState: z.string().trim().toUpperCase().length(2).optional(),
  propertyZip: z
    .string()
    .trim()
    .regex(/^\d{5}$/)
    .optional(),
  propertyType: z.enum(['purchase', 'refinance']).optional(),
  salePrice: z.number().positive().optional(),
  loanAmount: z.number().positive().optional(),
  closingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  // Who placed the order (from the email signature) — becomes the teammate.
  placedByEmail: z.string().trim().email().max(254).optional(),
  placedByRole: z.enum(['lender', 'broker', 'realtor']).optional(),
  placedByName: z.string().trim().max(160).optional(),
  placedByCompany: z.string().trim().max(160).optional(),
  gardenFileNumber: z.string().trim().max(64).optional(),
})

export async function POST(req: Request) {
  const session = await getSession()
  const email = (session?.user as { email?: string } | undefined)?.email
  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const json = await req.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid body', details: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const d = parsed.data

  if (!d.borrowerEmail && !d.propertyAddress) {
    return NextResponse.json(
      { error: 'need at least a borrower email or a property address' },
      { status: 400 },
    )
  }

  const result = await createClosingFromOrder({
    borrowerEmail: d.borrowerEmail ?? null,
    borrowerName: d.borrowerName ?? null,
    borrowerPhone: d.borrowerPhone ?? null,
    propertyAddress: d.propertyAddress ?? null,
    propertyCity: d.propertyCity ?? null,
    propertyState: d.propertyState ?? null,
    propertyZip: d.propertyZip ?? null,
    propertyType: d.propertyType ?? null,
    transactionType: d.propertyType ?? null,
    closingDate: d.closingDate ?? null,
    salePrice: d.salePrice ?? null,
    loanAmount: d.loanAmount ?? null,
    lenderName: d.placedByRole !== 'realtor' ? d.placedByName ?? null : null,
    lenderCompany: d.placedByRole !== 'realtor' ? d.placedByCompany ?? null : null,
    lenderEmail: d.placedByRole !== 'realtor' ? d.placedByEmail ?? null : null,
    teammateEmail: d.placedByEmail ?? null,
    teammateRole: d.placedByRole ?? null,
    gardenFileNumber: d.gardenFileNumber ?? null,
    source: 'ops_email',
  })

  return NextResponse.json({
    ok: true,
    closingId: result.closingId,
    matched: result.matched,
    matchedBy: result.matched ? result.matchedBy : null,
  })
}
