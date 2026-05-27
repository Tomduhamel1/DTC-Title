import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireBrokerMember } from '@/lib/auth/session'
import { createClosingFromOrder } from '@/lib/closing/createFromOrder'
import { sendBrokerConversionOpsEmail } from '@/lib/email/broker-conversion-ops'
import { logNotification } from '@/lib/notificationLog'

// POST /api/broker/quotes/[id]/convert
//
// Convert a saved FeeQuote into a real Closing. Reuses createClosingFromOrder
// (PR 1) so the resulting Closing is shaped identically to one TPS would
// create — same 5-milestone seeding, same identity-resolution rules, same
// welcome-email-on-orphan-branch, same TeammateClosing-upsert behavior.
//
// Eligibility (in order — each failure short-circuits before any write):
//   1. caller has BrokerMembership                     → 401 if not
//   2. quote.brokerCompanyId ∈ caller's memberships    → 404 if not (no leak)
//   3. quote already converted (idempotent replay)     → 200 with closingId
//   4. quote's BrokerCompany.verifiedAt is non-null    → 403 if not
//   5. quote not expired (status='expired' or          → 400 if expired
//      expiresAt < now)
//   6. quote.borrowerEmail is present                  → 400 if missing
//
// Race protection (no schema change, no new status):
//   The conversion runs inside a transaction that takes a per-quote Postgres
//   advisory lock (pg_advisory_xact_lock). Two simultaneous convert calls on
//   the same quote serialize: the second sees status='converted' after
//   acquiring the lock and short-circuits to the idempotent-replay branch.
//   This prevents duplicate Closings being created in the race window.
//
// Residual: createClosingFromOrder uses the outer prisma client (not the
// transaction's tx client), so its writes are in a separate transaction. If
// the helper succeeds but the subsequent FeeQuote update/event creation
// fails inside our transaction, the Closing it created is orphaned (no
// FeeQuote points to it). The advisory lock still guarantees only ONE such
// orphan in the worst case — the parallel writer waits and then sees the
// state. Admin tooling can spot orphans by querying
// Closings whose source='inbound_order' with no linked FeeQuote.

interface ConvertSuccess {
  ok: true
  closingId: string
  status: 'converted'
  alreadyConverted: boolean
  matchedBy: string | null
  welcomeEmailedTo: string | null
  // Populated ONLY on a genuine first conversion (alreadyConverted=false) so
  // the post-transaction block can send the best-effort ops handoff email
  // exactly once. Replays/race-losers leave this undefined → no email.
  opsEmail?: {
    closingId: string
    brokerName: string | null
    brokerEmail: string | null
    brokerCompanyName: string | null
    borrowerName: string | null
    borrowerEmail: string | null
    borrowerPhone: string | null
    propertyAddress: string | null
    propertyCity: string | null
    propertyState: string | null
    propertyZip: string | null
    transactionType: 'purchase' | 'refinance' | null
    homeValue: number | null
    loanAmount: number | null
    quoteShareToken: string | null
    convertedAt: Date
    matched: boolean
  }
}

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const ctx = await requireBrokerMember()
  if (!ctx) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const companyIds = ctx.memberships.map((m) => m.companyId)

  // Initial read OUTSIDE the lock — cheap, covers the common idempotent case
  // (broker clicks Convert on a quote that's already converted). The
  // authoritative check happens again inside the lock.
  const preview = await prisma.feeQuote.findFirst({
    where: { id: params.id, brokerCompanyId: { in: companyIds } },
    select: { id: true, status: true, convertedClosingId: true },
  })
  if (!preview) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  if (preview.status === 'converted' && preview.convertedClosingId) {
    return NextResponse.json({
      ok: true,
      closingId: preview.convertedClosingId,
      status: 'converted',
      alreadyConverted: true,
      matchedBy: null,
      welcomeEmailedTo: null,
    })
  }

  // ── Authoritative conversion under a per-quote advisory lock ──────────
  // pg_advisory_xact_lock(hashtext(...)) is automatically released when the
  // transaction commits or rolls back. Postgres-only — works in dev,
  // staging, prod (we don't use any other DB).
  let outcome: ConvertSuccess | { error: string; status: number }
  try {
    outcome = await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `SELECT pg_advisory_xact_lock(hashtext($1))`,
        `convert-feequote:${params.id}`,
      )

      // Re-read inside the lock — race losers see the just-written state.
      const quote = await tx.feeQuote.findFirst({
        where: { id: params.id, brokerCompanyId: { in: companyIds } },
        select: {
          id: true,
          status: true,
          convertedClosingId: true,
          expiresAt: true,
          inputJson: true,
          borrowerName: true,
          borrowerEmail: true,
          borrowerPhone: true,
          propertyAddress: true,
          propertyCity: true,
          propertyState: true,
          propertyZip: true,
          shareToken: true,
          brokerCompany: { select: { verifiedAt: true, name: true } },
          brokerUser: { select: { name: true } },
        },
      })
      if (!quote) {
        return { error: 'not found', status: 404 } as const
      }

      // Idempotent replay (definitive check under the lock).
      if (quote.status === 'converted' && quote.convertedClosingId) {
        return {
          ok: true,
          closingId: quote.convertedClosingId,
          status: 'converted',
          alreadyConverted: true,
          matchedBy: null,
          welcomeEmailedTo: null,
        } as const
      }

      // Verified-company gate.
      if (!quote.brokerCompany?.verifiedAt) {
        return {
          error: 'broker company is not verified for conversion',
          status: 403,
        } as const
      }

      // Expiry gate.
      if (quote.status === 'expired' || new Date(quote.expiresAt) < new Date()) {
        return { error: 'cannot convert an expired quote', status: 400 } as const
      }

      // Pull transaction inputs from inputJson (FeeQuote denormalizes
      // borrower/property to columns but keeps transactionType/homeValue/
      // loanAmount on the JSON payload only). These are inherited from the
      // quote and not editable in the convert flow.
      const input = quote.inputJson as {
        transactionType?: 'purchase' | 'refinance'
        homeValue?: number | null
        loanAmount?: number | null
      } | null

      // ── Minimum-order-fields gate (revised v1) ───────────────────────────
      // A converted quote becomes a real title order; ops/Garden cannot begin
      // work without the borrower and a full property address. Require the
      // operational minimum and return a STRUCTURED list of what's missing so
      // the UI can prompt for exactly those fields (then PATCH + retry).
      // Borrower phone stays optional. transactionType + amount come from the
      // quote and are validated here too (a healthy quote always has them).
      const trimmed = (v: string | null | undefined) =>
        typeof v === 'string' && v.trim().length > 0
      const hasAmount =
        (typeof input?.homeValue === 'number' && input.homeValue > 0) ||
        (typeof input?.loanAmount === 'number' && input.loanAmount > 0)
      const missing: string[] = []
      if (!trimmed(quote.borrowerName)) missing.push('borrowerName')
      if (!trimmed(quote.borrowerEmail)) missing.push('borrowerEmail')
      if (!trimmed(quote.propertyAddress)) missing.push('propertyAddress')
      if (!trimmed(quote.propertyCity)) missing.push('propertyCity')
      if (!trimmed(quote.propertyState)) missing.push('propertyState')
      if (!trimmed(quote.propertyZip)) missing.push('propertyZip')
      if (!input?.transactionType) missing.push('transactionType')
      if (!hasAmount) missing.push('amount')
      if (missing.length > 0) {
        return {
          error: 'missing required order details to convert',
          status: 400,
          missingFields: missing,
        } as const
      }

      // Create the Closing via the shared helper. NOTE: this call uses the
      // outer prisma client, not `tx` — see the residual comment in the
      // header for why. The advisory lock still serializes parallel
      // conversions of the same quote.
      //
      // propertyType is deliberately OMITTED — FeeQuote has no
      // propertyType field and we don't want to write transactionType
      // (purchase/refinance) into Closing.propertyType, which expects
      // single_family/condo/etc.
      const result = await createClosingFromOrder({
        borrowerEmail: quote.borrowerEmail,
        borrowerName: quote.borrowerName,
        borrowerPhone: quote.borrowerPhone,
        propertyAddress: quote.propertyAddress,
        propertyCity: quote.propertyCity,
        propertyState: quote.propertyState,
        propertyZip: quote.propertyZip,
        salePrice: input?.homeValue ?? null,
        loanAmount: input?.loanAmount ?? null,
        // Broker-attribution → TeammateClosing(role='broker') is upserted
        // by the helper using the broker user's email.
        teammateEmail: ctx.email,
        teammateRole: 'broker',
      })

      // Compare-and-set FeeQuote: use updateMany so the predicate
      // `convertedClosingId: null` can be expressed. count=0 means a
      // parallel writer beat us (shouldn't happen given the advisory
      // lock, but cheap belt-and-suspenders).
      //
      // P2002 on convertedClosingId means a DIFFERENT FeeQuote already
      // linked to the same Closing. This can happen on the matched
      // branch when the same borrower has a prior FeeQuote that was
      // converted into their existing Closing: the schema's @unique on
      // convertedClosingId forbids two FeeQuotes pointing at the same
      // Closing. Surface that as 409 so the broker sees a clean message.
      let updated: { count: number }
      try {
        updated = await tx.feeQuote.updateMany({
          where: { id: quote.id, convertedClosingId: null },
          data: {
            convertedClosingId: result.closingId,
            status: 'converted',
          },
        })
      } catch (err) {
        const code = (err as { code?: string })?.code
        const target = (err as { meta?: { target?: string[] } })?.meta?.target
        if (code === 'P2002' && target?.includes('convertedClosingId')) {
          return {
            error:
              'a previous quote for this borrower was already converted into the same closing',
            status: 409,
          } as const
        }
        throw err
      }
      if (updated.count === 0) {
        // Race-loser path. Re-read and return whatever landed.
        const after = await tx.feeQuote.findUnique({
          where: { id: quote.id },
          select: { convertedClosingId: true },
        })
        if (after?.convertedClosingId) {
          return {
            ok: true,
            closingId: after.convertedClosingId,
            status: 'converted',
            alreadyConverted: true,
            matchedBy: null,
            welcomeEmailedTo: null,
          } as const
        }
        throw new Error(
          'compare-and-set failed but no convertedClosingId was set — DB inconsistency',
        )
      }

      const convertedEvent = await tx.feeQuoteEvent.create({
        data: {
          feeQuoteId: quote.id,
          kind: 'converted',
          metadata: {
            closingId: result.closingId,
            brokerUserId: ctx.userId,
            matchedBy: result.matched ? result.matchedBy : null,
            welcomeEmailedTo: result.matched ? null : result.welcomeEmailedTo,
          },
        },
        select: { createdAt: true },
      })

      return {
        ok: true,
        closingId: result.closingId,
        status: 'converted',
        alreadyConverted: false,
        matchedBy: result.matched ? result.matchedBy : null,
        welcomeEmailedTo: result.matched ? null : result.welcomeEmailedTo,
        // Carried out of the transaction so the post-commit block can send the
        // ops handoff email exactly once (only this genuine-conversion branch
        // sets it). Conversion-time uses the FeeQuoteEvent timestamp.
        opsEmail: {
          closingId: result.closingId,
          brokerName: quote.brokerUser?.name ?? null,
          brokerEmail: ctx.email,
          brokerCompanyName: quote.brokerCompany?.name ?? null,
          borrowerName: quote.borrowerName,
          borrowerEmail: quote.borrowerEmail,
          borrowerPhone: quote.borrowerPhone,
          propertyAddress: quote.propertyAddress,
          propertyCity: quote.propertyCity,
          propertyState: quote.propertyState,
          propertyZip: quote.propertyZip,
          transactionType: input?.transactionType ?? null,
          homeValue: input?.homeValue ?? null,
          loanAmount: input?.loanAmount ?? null,
          quoteShareToken: quote.shareToken,
          convertedAt: convertedEvent.createdAt,
          matched: result.matched,
        },
      } as const
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[broker/quotes/convert] conversion failed:', err)
    const message = err instanceof Error ? err.message : 'unknown error'
    return NextResponse.json(
      { error: `closing creation failed: ${message}` },
      { status: 502 },
    )
  }

  if ('error' in outcome) {
    const missingFields = (outcome as { missingFields?: string[] }).missingFields
    const body: { error: string; missingFields?: string[] } = { error: outcome.error }
    if (missingFields && missingFields.length > 0) body.missingFields = missingFields
    return NextResponse.json(body, { status: outcome.status })
  }

  // Best-effort internal ops handoff email — fires EXACTLY ONCE per genuine
  // conversion. outcome.opsEmail is populated only on the alreadyConverted=false
  // branch, so replays / double-clicks / advisory-lock race-losers (all
  // alreadyConverted=true) never reach this. A send failure must NOT affect the
  // conversion, which already committed; we log it and move on.
  //
  // TEMPORARY: this email is the manual handoff to ops until Garden push exists.
  if (outcome.opsEmail) {
    const o = outcome.opsEmail
    try {
      const { recipient, subject, messageId } = await sendBrokerConversionOpsEmail(o)
      await logNotification({
        closingId: o.closingId,
        kind: 'broker_conversion:ops_handoff',
        recipient,
        subject,
        status: process.env.AUTH_EMAIL_DRY_RUN === 'true' ? 'skipped' : 'sent',
        providerMessageId: messageId,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[broker/quotes/convert] ops handoff email failed:', err)
      await logNotification({
        closingId: o.closingId,
        kind: 'broker_conversion:ops_handoff',
        recipient: process.env.BROKER_OPS_EMAIL || 'orders@betterclose.co',
        subject: 'New broker-converted order (send failed)',
        status: 'failed',
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  // Strip the internal opsEmail payload from the API response.
  const { opsEmail: _opsEmail, ...publicOutcome } = outcome
  return NextResponse.json(publicOutcome)
}
