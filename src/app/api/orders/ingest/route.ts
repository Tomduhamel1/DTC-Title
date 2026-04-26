import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import {
  MILESTONE_KINDS,
  normalizePhoneKey,
  normalizePropertyKey,
  resolveClosingForOrder,
} from '@/lib/closing'

/**
 * Stub endpoint that simulates a title-software integration pushing an inbound
 * order. Callable from a future webhook or, for now, from internal demos.
 *
 * Flow:
 *   1. Try to resolve to an existing closing (by email/phone/property).
 *   2. If matched: attach + update.
 *   3. If unmatched: create a new orphan Closing and (in real prod) email a
 *      welcome link. For prototype we just return the welcome URL.
 *
 * The auth gate is intentionally loose for prototype. Production should verify
 * a webhook signature or shared secret.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  const {
    borrowerEmail,
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
      // Don't clobber a user's existing entries; only fill blanks.
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
      welcomeUrl: null,
    })
  }

  // No match — create orphan closing
  const created = await prisma.closing.create({
    data: {
      ...baseData,
      milestones: { create: MILESTONE_KINDS.map((kind) => ({ kind })) },
    },
  })

  // Welcome URL signs the user in by email after they click — they can claim
  // the orphan closing on first sign-in. For prototype, the welcome page just
  // surfaces the email field pre-filled.
  const welcomeUrl = baseData.borrowerEmail
    ? `/welcome?email=${encodeURIComponent(baseData.borrowerEmail)}&closing=${created.id}`
    : `/welcome?closing=${created.id}`

  return NextResponse.json({
    ok: true,
    matchedBy: null,
    closingId: created.id,
    welcomeUrl,
  })
}
