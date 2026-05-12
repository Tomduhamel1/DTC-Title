import { prisma } from '@/lib/db'
import {
  MILESTONE_KINDS,
  normalizePhoneKey,
  normalizePropertyKey,
  resolveClosingForOrder,
} from '@/lib/closing'
import { sendWelcomeEmail } from '@/lib/email/welcome'
import { upsertTeammateClosing } from '@/lib/teammate/match'

// Shared write path for inbound orders. Used by:
//   - POST /api/orders/ingest (TPS / title-software integration)
//
// Extracted verbatim from the route handler so future callers (e.g. a
// broker-originated quote-to-order conversion) can produce identical
// Closing+Milestone seeding, identity resolution, welcome-email behavior,
// and TeammateClosing attribution without re-implementing the logic.

export interface CreateClosingFromOrderInput {
  borrowerEmail?: string | number | null
  borrowerName?: string | number | null
  borrowerPhone?: string | number | null
  propertyAddress?: string | number | null
  propertyCity?: string | number | null
  propertyState?: string | number | null
  propertyZip?: string | number | null
  propertyType?: string | number | null
  closingDate?: string | number | null
  salePrice?: string | number | null
  loanAmount?: string | number | null
  lenderName?: string | number | null
  lenderCompany?: string | number | null
  lenderEmail?: string | number | null
  lenderPhone?: string | number | null
  lenderNmls?: string | number | null
  // Teammate attribution aliases — same set the ingest route accepts.
  teammateEmail?: string | number | null
  teammateRole?: string | number | null
  placedByEmail?: string | number | null
  lenderContactEmail?: string | number | null
  orderingPartyEmail?: string | number | null
}

export type CreateClosingFromOrderResult =
  | {
      matched: true
      closingId: string
      matchedBy: 'email' | 'user_email' | 'phone' | 'property'
      teammateLinked: boolean
    }
  | {
      matched: false
      closingId: string
      welcomeEmailedTo: string | null
      teammateLinked: boolean
    }

export async function createClosingFromOrder(
  input: CreateClosingFromOrderInput,
): Promise<CreateClosingFromOrderResult> {
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
    teammateEmail,
    teammateRole,
    placedByEmail,
    lenderContactEmail,
    orderingPartyEmail,
  } = input

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

  // Resolve the teammate email TPS told us placed this order, normalising
  // across aliases. Falls back to lenderEmail when nothing more specific is
  // available — the lender field is the most-likely "placing party" for a
  // typical title-software integration.
  const teammateEmailResolved =
    (typeof teammateEmail === 'string' && teammateEmail) ||
    (typeof placedByEmail === 'string' && placedByEmail) ||
    (typeof lenderContactEmail === 'string' && lenderContactEmail) ||
    (typeof orderingPartyEmail === 'string' && orderingPartyEmail) ||
    (typeof lenderEmail === 'string' && lenderEmail) ||
    null
  const teammateRoleResolved =
    typeof teammateRole === 'string' &&
    (teammateRole === 'lender' || teammateRole === 'broker' || teammateRole === 'realtor')
      ? teammateRole
      : teammateEmailResolved && teammateEmailResolved === lenderEmail
      ? 'lender'
      : 'unknown'

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

    if (teammateEmailResolved) {
      try {
        await upsertTeammateClosing({
          closingId: updated.id,
          email: teammateEmailResolved,
          role: teammateRoleResolved,
        })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[orders/ingest] teammate upsert failed (matched branch)', err)
      }
    }

    return {
      matched: true,
      closingId: updated.id,
      matchedBy: match.matchedBy,
      teammateLinked: Boolean(teammateEmailResolved),
    }
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

  if (teammateEmailResolved) {
    try {
      await upsertTeammateClosing({
        closingId: created.id,
        email: teammateEmailResolved,
        role: teammateRoleResolved,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[orders/ingest] teammate upsert failed (orphan branch)', err)
    }
  }

  return {
    matched: false,
    closingId: created.id,
    welcomeEmailedTo: baseData.borrowerEmail,
    teammateLinked: Boolean(teammateEmailResolved),
  }
}
