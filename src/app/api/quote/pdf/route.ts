import { NextResponse } from 'next/server'

// DISABLED FOR LAUNCH (launch-safety PR 1).
//
// This endpoint generated a refinance-quote PDF and emailed it via
// sendQuotePdfEmail() in src/lib/aws/ses.ts. That email — and the
// /quote/[quoteId]/print page it screenshots — still carry legacy "TrueFee
// Closing" branding and a placeholder (555) 123-4567 phone number. The route
// has no live UI trigger (its only caller, QuotePdfButton, is not rendered
// anywhere), but the POST endpoint was still publicly reachable, so a direct
// call could send a TrueFee-branded email in production.
//
// We return 410 Gone to neutralize that launch risk without touching the
// (now-unreachable) PDF generation, ses.ts email body, or print page. A
// follow-up cleanup PR should either rebrand or delete that orphaned code,
// after which this route can be rebuilt on BetterClose branding if the feature
// is still wanted.
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'This endpoint is disabled.',
    },
    { status: 410 },
  )
}
