import { NextResponse } from 'next/server'
import { z } from 'zod'
import { fetchElendFeeEstimate } from '@/lib/elendCalc'
import { rateLimit } from '@/lib/rate-limit'
import { ServiceNotOfferedError, stateOffered } from '@/lib/stateMaster'
import { stateForZip } from '@/lib/zipToState'

const Body = z.object({
  transactionType: z.enum(['purchase', 'refinance']),
  zip: z.string().regex(/^\d{5}$/, 'ZIP must be 5 digits'),
  homeValue: z.number().nonnegative().optional(),
  loanAmount: z.number().positive().optional(),
  // Sent by the broker estimate form. precision 'state'/'county' means `zip`
  // is a representative substitution for `stateCode`, not the property ZIP —
  // the report is stamped so the results page can disclose that and render
  // the summary view instead of a line-item table.
  precision: z.enum(['state', 'county', 'detailed']).optional(),
  stateCode: z.string().length(2).optional(),
})

export async function POST(req: Request) {
  // Rate limit before parsing the body or calling the upstream fee calculator.
  // This route is public + unauthenticated and fans every successful request
  // out to a third-party fee API (src/lib/elendCalc.ts), so an unbounded loop
  // would hammer that upstream. Per-IP, in-memory sliding window — same
  // limiter pattern as auth (src/lib/auth/options.ts) and the public quote
  // view (src/app/quote/view/page.tsx). Inline IP idiom matches those sites.
  const ipHeader = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || ''
  const ip = ipHeader.split(',')[0].trim() || 'unknown'
  const limit = rateLimit(`fee-estimate:${ip}`, 20, 60_000)
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Too many requests. Please wait a minute and try again.',
        retryAfterSeconds: 60,
      },
      { status: 429, headers: { 'Retry-After': '60' } },
    )
  }

  const json = await req.json().catch(() => null)
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid body', details: parsed.error.flatten() }, { status: 400 })
  }
  const data = parsed.data

  // Resolve required amounts based on transaction type.
  let homeValue = data.homeValue ?? 0
  let loanAmount = data.loanAmount ?? 0

  if (data.transactionType === 'refinance') {
    if (!loanAmount) {
      return NextResponse.json({ error: 'loanAmount required for refinance' }, { status: 400 })
    }
    homeValue = 0
  } else {
    // Purchase: homeValue (purchase amount) is required; loanAmount defaults to 80% LTV.
    if (!homeValue) {
      return NextResponse.json({ error: 'homeValue required for purchase' }, { status: 400 })
    }
    if (!loanAmount) loanAmount = Math.round(homeValue * 0.8)
  }

  // Pre-flight availability gate (stateMaster): refuse known-OFF states
  // before the slow upstream call. The explicit stateCode (broker form) wins;
  // otherwise the ZIP-prefix map is advisory — unknown ZIP prefixes proceed
  // and the elendCalc backstop re-checks against the upstream's own state.
  const preflightState = data.stateCode?.toUpperCase() || stateForZip(data.zip)
  if (preflightState && !stateOffered(preflightState, data.transactionType)) {
    const err = new ServiceNotOfferedError(preflightState, data.transactionType)
    return NextResponse.json(
      { ok: false, notOffered: true, state: preflightState, error: err.message },
      { status: 422 },
    )
  }

  try {
    const report = await fetchElendFeeEstimate({
      transactionType: data.transactionType,
      zip: data.zip,
      homeValue,
      loanAmount,
    })
    if (data.precision === 'state' || data.precision === 'county') {
      report.precision = data.precision
      report.representativeZipUsed = true
      report.representativeZip = data.zip
      // The upstream echoes the state for the representative ZIP; prefer the
      // broker's explicit state code if the upstream left it blank.
      if (!report.state && data.stateCode) report.state = data.stateCode
    } else {
      report.precision = 'detailed'
    }
    return NextResponse.json({ ok: true, report })
  } catch (err) {
    if (err instanceof ServiceNotOfferedError) {
      return NextResponse.json(
        { ok: false, notOffered: true, state: err.stateCode, error: err.message },
        { status: 422 },
      )
    }
    const message = err instanceof Error ? err.message : 'unknown error'
    console.error('[fee-estimate] failed:', message)
    return NextResponse.json({ ok: false, error: message }, { status: 502 })
  }
}
