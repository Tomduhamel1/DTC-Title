import { NextResponse } from 'next/server'
import { z } from 'zod'
import { fetchElendFeeEstimate } from '@/lib/elendCalc'

const Body = z.object({
  transactionType: z.enum(['purchase', 'refinance']),
  zip: z.string().regex(/^\d{5}$/, 'ZIP must be 5 digits'),
  homeValue: z.number().nonnegative().optional(),
  loanAmount: z.number().positive().optional(),
})

export async function POST(req: Request) {
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

  try {
    const report = await fetchElendFeeEstimate({
      transactionType: data.transactionType,
      zip: data.zip,
      homeValue,
      loanAmount,
    })
    return NextResponse.json({ ok: true, report })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    console.error('[fee-estimate] failed:', message)
    return NextResponse.json({ ok: false, error: message }, { status: 502 })
  }
}
