import NavigationCredible from '@/components/NavigationCredible'
import FooterComprehensive from '@/components/FooterComprehensive'
import ProfessionalQuoteFlow from '@/components/professional/ProfessionalQuoteFlow'
import {
  buildOrderMailto,
  getLenderRequestContext,
} from '@/lib/teammate/lender-request-context'

// /for-my-team/quote is the dedicated professional-facing quote route. A
// borrower-invited professional (broker, loan officer, lender, real estate
// agent, or other closing team member) generates a real BetterClose fee
// estimate here. Reuses the public /api/fee-estimate engine but renders
// professional-specific result CTAs (not the borrower-funnel CTAs that
// /quote/results renders).
//
// Architecture: server-rendered shell + a single 'use client' component
// (ProfessionalQuoteFlow) that holds the form, loading, result, and error
// states. The result state renders FeeReportTable plus professional-specific
// next-step CTAs (email an order, continue with email, request portal
// access). No persisted FeeQuote — this is an ephemeral preview that gives
// the professional a real number to decide whether to send the order.
//
// When ?ref=<refId> resolves to a LenderRequest:
//   - Form fields prefill from the linked Closing's transaction data.
//   - Email-order mailto uses buildOrderMailto(ctx) — personalized when the
//     LenderRequest has a linked Closing, generic with ref-tagged subject
//     otherwise.
//   - Dashboard CTA threads ?claim=<refId> so PR 16's role self-identify
//     flow fires on first sign-in.
//
// Middleware: /for-my-team is in FUNCTIONAL_PREFIXES; /for-my-team/quote is
// allowed automatically (pathname.startsWith match).

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'BetterClose · Show your client what they save',
  description:
    "Generate a real BetterClose fee estimate for your client. Line-item pricing, A-rated underwriters, no login required.",
}

interface PageProps {
  searchParams?: { ref?: string }
}

const REQUEST_PORTAL_ACCESS_BODY = `Hi BetterClose team,

We'd like to request access to the broker/LO portal.

Company name:
NPN:
State licenses:
Approximate monthly closings:
How you found us:

Thanks,`

export default async function ProfessionalQuotePage({ searchParams }: PageProps) {
  const refId = searchParams?.ref
  const ctx = await getLenderRequestContext(refId)
  const { subject, body } = buildOrderMailto(ctx)
  const isPersonalized = Boolean(ctx?.closing)

  const emailOrderHref = `mailto:orders@betterclose.co?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`

  const dashboardClaimHref = refId
    ? `/login?callbackUrl=${encodeURIComponent(`/teammate/dashboard?claim=${refId}`)}`
    : `/login?callbackUrl=${encodeURIComponent('/teammate/dashboard')}`

  const brokerPortalAccessHref = `mailto:partners@betterclose.co?subject=${encodeURIComponent(
    'Broker portal access request',
  )}&body=${encodeURIComponent(REQUEST_PORTAL_ACCESS_BODY)}`

  // Form prefill defaults from the linked Closing when available. Mapping
  // mirrors src/lib/closing-milestone.ts:36-50: propertyType → transactionType,
  // with 80% LTV defaulting for purchase when loanAmount missing handled by
  // /api/fee-estimate itself (so we don't reimplement it here).
  const c = ctx?.closing ?? null
  const initialInputs = {
    transactionType:
      c?.propertyType === 'refinance' ? ('refinance' as const) : ('purchase' as const),
    zip: c?.propertyZip ?? '',
    homeValue:
      c?.salePrice != null && c.salePrice > 0 ? String(Math.round(c.salePrice)) : '',
    loanAmount:
      c?.loanAmount != null && c.loanAmount > 0 ? String(Math.round(c.loanAmount)) : '',
  }

  const clientName = ctx?.clientName || ctx?.borrower?.name || null
  const propertyAddress = c
    ? [c.propertyAddress, c.propertyCity, c.propertyState, c.propertyZip]
        .filter(Boolean)
        .join(', ') || null
    : null

  return (
    <>
      <NavigationCredible />
      <div className="h-20" />
      <ProfessionalQuoteFlow
        initialInputs={initialInputs}
        isPersonalized={isPersonalized}
        clientName={clientName}
        propertyAddress={propertyAddress}
        emailOrderHref={emailOrderHref}
        dashboardClaimHref={dashboardClaimHref}
        brokerPortalAccessHref={brokerPortalAccessHref}
      />
      <FooterComprehensive />
    </>
  )
}
