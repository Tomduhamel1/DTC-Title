import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import {
  MILESTONE_KINDS,
  normalizePhoneKey,
  normalizePropertyKey,
  resolveClosingForOrder,
} from '@/lib/closing'
import { sendWelcomeEmail } from '@/lib/email/welcome'

/**
 * Accepts an inbound order from the title-software integration (or manual ops).
 * Auth: shared secret in `Authorization: Bearer <ORDER_INGEST_SECRET>`.
 *
 * Flow:
 *   1. Try to resolve to an existing closing (by email/phone/property).
 *   2. Matched: attach + fill in any blanks.
 *   3. Unmatched: create a new orphan Closing AND send a welcome email so the
 *      borrower can sign in and claim it.
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

  const {
    borrowerEmail,
    borrowerName,
    borrowerPhone,
    propertyAddress,
    propertyCity,
    propertyState,
    propertyZip,
    propertyType,
    closingDate,
    salePrice,
    loanAmount,
    lenderName,
    lenderCompany,
    lenderEmail,
    lenderPhone,
    lenderNmls,
  } = body as Record<string, string | number | null | undefined>

  const match = await resolveClosingForOrder({
    borrowerEmail: typeof borrowerEmail === 'string' ? borrowerEmail.toLowerCase() : null,
    borrowerPhone: typeof borrowerPhone === 'string' ? borrowerPhone : null,
    propertyAddress: typeof propertyAddress === 'string' ? propertyAddress : null,
  })

  const baseData = {
    propertyAddress: typeof propertyAddress === 'string' ? propertyAddress : null,
    propertyCity: typeof propertyCity === 'string' ? propertyCity : null,
    propertyState: typeof propertyState === 'string' ? propertyState : null,
    propertyZip: typeof propertyZip === 'string' ? propertyZip : null,
    propertyAddressKey: normalizePropertyKey(typeof propertyAddress === 'string' ? propertyAddress : null),
    propertyType: typeof propertyType === 'string' ? propertyType : null,
    closingDate: typeof closingDate === 'string' ? new Date(closingDate) : null,
    salePrice: typeof salePrice === 'number' ? salePrice : null,
    loanAmount: typeof loanAmount === 'number' ? loanAmount : null,
    borrowerEmail: typeof borrowerEmail === 'string' ? borrowerEmail.toLowerCase() : null,
    borrowerPhone: normalizePhoneKey(typeof borrowerPhone === 'string' ? borrowerPhone : null),
    lenderName: typeof lenderName === 'string' ? lenderName : null,
    lenderCompany: typeof lenderCompany === 'string' ? lenderCompany : null,
    lenderEmail: typeof lenderEmail === 'string' ? lenderEmail : null,
    lenderPhone: typeof lenderPhone === 'string' ? lenderPhone : null,
    lenderNmls: typeof lenderNmls === 'string' ? lenderNmls : null,
    status: 'active',
    source: 'inbound_order',
  }

  if (match.closing) {
    const updated = await prisma.closing.update({
      where: { id: match.closing.id },
      // Don't clobber existing user-entered values; only fill blanks.
      data: Object.fromEntries(
        Object.entries(baseData).filter(([k, v]) => {
          const existing = (match.closing as Record<string, unknown>)[k]
          return v != null && (existing == null || existing === '')
        }),
      ),
    })
    return NextResponse.json({
      ok: true,
      matchedBy: match.matchedBy,
      closingId: updated.id,
    })
  }

  // No match — create orphan closing + send welcome email
  const created = await prisma.closing.create({
    data: {
      ...baseData,
      milestones: { create: MILESTONE_KINDS.map((kind) => ({ kind })) },
    },
  })

  if (baseData.borrowerEmail) {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://betterclose.co'
    try {
      await sendWelcomeEmail({
        borrowerEmail: baseData.borrowerEmail,
        borrowerName: typeof borrowerName === 'string' ? borrowerName : undefined,
        propertyAddress: baseData.propertyAddress || undefined,
        lenderCompany: baseData.lenderCompany || undefined,
        baseUrl,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[orders/ingest] welcome email failed', err)
      // Closing still created; we just couldn't notify. Ops can manually resend.
    }
  }

  return NextResponse.json({
    ok: true,
    matchedBy: null,
    closingId: created.id,
    welcomeEmailedTo: baseData.borrowerEmail,
  })
}
