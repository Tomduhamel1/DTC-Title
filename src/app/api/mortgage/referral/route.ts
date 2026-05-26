import { NextResponse } from 'next/server'

// DISABLED FOR LAUNCH (launch-safety PR 1).
//
// This endpoint created a mortgage referral and emailed the matched partner via
// sendPartnerReferralEmail() in src/lib/email/partner-referral.ts, which still
// carries legacy "TrueFee Closing" branding and a noreply@truefeeclosing.com
// from-address. Its UI trigger (/pricing/results) is gated behind coming-soon,
// but /api bypasses that middleware, so a direct POST could send a
// TrueFee-branded partner email in production.
//
// We return 410 Gone to neutralize that launch risk. The orphaned referral +
// partner-selection + email code is left in place but unreachable; a follow-up
// cleanup PR should rebrand or delete it before any referral feature is
// rebuilt.
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'This endpoint has been retired.',
    },
    { status: 410 },
  )
}
