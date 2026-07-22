// Client for the public fee calculator API (internal; "elend" is legacy
// naming). Used server-side and mapped into our FeeReport shape.
//
// The endpoint is overridable via FEE_CALC_API_URL. The default still points
// at the AWS API Gateway "test" stage — what the upstream app uses today.
// Set FEE_CALC_API_URL to the production stage once the API owner confirms
// it; do not hardcode a new stage here.

import type { FeeCategory, FeeLineItem, FeeReport, FeeSource } from './feeReport'
import {
  PREMIUM_RANGE_FILED,
  premiumsAreUniform,
  serviceBandFor,
} from './marketBaseline'

const ENDPOINT =
  process.env.FEE_CALC_API_URL ||
  'https://40c5js0bsd.execute-api.us-east-1.amazonaws.com/test/fee-calculator/elend-public-calc'

// The upstream calculator is slow — real calls observed at 11–18s. Without a
// bound, a hung upstream holds the request open until the hosting platform's
// gateway kills it (a 504 with an empty body), which then surfaces to the
// client as an opaque "Unexpected end of JSON input". Aborting here instead
// lets us throw a clean, typed error the route can wrap as JSON. Set above the
// observed worst case so healthy-but-slow ZIPs still succeed.
const UPSTREAM_TIMEOUT_MS = 25_000

export type ElendLoanPurpose = 'Purchase' | 'Refinance' | 'Cash'

export interface ElendRequest {
  transactionType: 'purchase' | 'refinance'
  zip: string
  homeValue: number
  loanAmount: number
}

interface ElendApiBody {
  action: 'start'
  PostalCode: string
  SalesContractAmount: number
  NoteAmount: number
  LoanPurposeType: ElendLoanPurpose
  pageNumbers: {
    deedPages: number
    mortgagePages: number
    deedConsideration: number
    mortgageConsideration: number
  }
}

interface ElendFeeRow {
  FeeDescription?: string
  DisclosureItemName?: string
  BuyerFee?: string | number
  SellerFee?: string | number
}

interface ElendResponse {
  stateCode?: string
  county?: string
  city?: string
  rateCalcGuideResponse?: ElendFeeRow[]
  message?: string
  error?: string
}

function buildBody(req: ElendRequest): ElendApiBody {
  const isRefi = req.transactionType === 'refinance'
  const purpose: ElendLoanPurpose = isRefi ? 'Refinance' : 'Purchase'
  const sales = isRefi ? 0 : req.homeValue
  return {
    action: 'start',
    PostalCode: req.zip,
    SalesContractAmount: sales,
    NoteAmount: req.loanAmount,
    LoanPurposeType: purpose,
    pageNumbers: {
      deedPages: isRefi ? 1 : 4,
      mortgagePages: 25,
      deedConsideration: sales,
      mortgageConsideration: req.loanAmount,
    },
  }
}

// Normalize upstream fee labels. Deliberately does NOT name an underwriter:
// the upstream response doesn't tell us which underwriter will issue the
// policy, and asserting one ("First American") on a quote we can't guarantee
// is a correctness/compliance problem. Underwriter branding belongs on the
// issued policy, not the estimate.
function cleanDescription(raw: string): string {
  let d = raw.replace(/^Title - /i, '')
  if (/lender's title insurance/i.test(d)) {
    d = "Lender's Title Insurance"
  } else if (/owner's title insurance/i.test(d)) {
    d = "Owner's Title Insurance"
  } else if (/closing protection letter/i.test(d)) {
    d = 'Closing Protection Letter'
  }
  return d
}

function categorize(feeDescription: string): FeeCategory {
  const d = feeDescription.toLowerCase()
  if (d.includes('recording')) return 'recording'
  if (d.includes('transfer') || d.includes('tax')) return 'taxes'
  if (d.includes('endorsement')) return 'endorsements'
  if (d.includes('title') || d.includes('settlement')) return 'title-settlement'
  return 'other'
}

function inferFeeSource(rawDescription: string, category: FeeCategory): FeeSource | undefined {
  const d = rawDescription.toLowerCase()
  if (category === 'taxes') {
    return d.includes('state') ? 'state' : 'county'
  }
  if (category === 'recording') {
    if (d.includes('state')) return 'state'
    if (d.includes('service')) return 'service'
    return 'county'
  }
  if (category === 'title-settlement') {
    if (d.includes('title insurance')) return 'underwriter'
    return 'service'
  }
  return undefined
}

// Comparison column ("typical [state]" range) for a fee line, based on the
// state's premium-rate regime (src/lib/marketBaseline.ts):
//  - recording/taxes: always isFixed (set by government, same everywhere).
//  - title premiums & CPL in promulgated/bureau-uniform states: isFixed —
//    every provider charges the identical state/bureau rate, so claiming
//    savings on them would be false. Marked feeSource 'state' by the caller
//    so the UI says "Set by <state>".
//  - everything else: conservative interim multipliers (see marketBaseline
//    for sourcing status); the LOW end drives every savings claim.
function withTypicalRange(
  label: string,
  ourCost: number,
  category: FeeCategory,
  stateCode: string | undefined,
): Pick<FeeLineItem, 'isFixed' | 'typicalRange'> {
  if (category === 'recording' || category === 'taxes') {
    return { isFixed: true }
  }
  const isPremiumLine =
    /title insurance/i.test(label) || /closing protection letter/i.test(label)
  if (isPremiumLine && premiumsAreUniform(stateCode)) {
    return { isFixed: true }
  }
  // Service lines all use the state's evidence-derived band (published or
  // inferred — see marketBaseline). Applying the same band to every service
  // line keeps the package-level sums equal to band × our service total.
  const range = isPremiumLine ? PREMIUM_RANGE_FILED : serviceBandFor(stateCode)
  return {
    isFixed: false,
    typicalRange: {
      low: Math.round(ourCost * range.low),
      high: Math.round(ourCost * range.high),
    },
  }
}

export async function fetchElendFeeEstimate(req: ElendRequest): Promise<FeeReport> {
  const body = buildBody(req)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)
  let res: Response
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('fee calculator timed out')
    }
    throw err
  } finally {
    clearTimeout(timeout)
  }

  if (!res.ok) {
    // The upstream returns a 404 with a body like {"error":"Zip code X not
    // found"} for ZIPs it doesn't have (e.g. PO-box-only ZIPs). Surface that
    // specific reason when present so the borrower knows to try another ZIP,
    // rather than a bare status code.
    let detail = ''
    try {
      const errBody = (await res.json()) as ElendResponse
      detail = errBody?.error || errBody?.message || ''
    } catch {
      // non-JSON / empty error body — fall back to status code below
    }
    if (res.status === 404 && /zip/i.test(detail)) {
      throw new Error(detail)
    }
    throw new Error(`fee calculator returned ${res.status}`)
  }

  const data = (await res.json()) as ElendResponse

  if (data.error) {
    throw new Error(`fee calculator error: ${data.error}`)
  }
  if (!Array.isArray(data.rateCalcGuideResponse)) {
    throw new Error('fee calculator returned no fee data')
  }

  const lineItems: FeeLineItem[] = []
  data.rateCalcGuideResponse.forEach((row, i) => {
    const buyer = parseFloat(String(row.BuyerFee || '0')) || 0
    if (buyer === 0) return // we only show buyer-side fees; skip $0 rows

    const rawName = row.DisclosureItemName || row.FeeDescription || `Fee ${i + 1}`
    const rawForCategorize = row.FeeDescription || rawName
    const label = cleanDescription(rawName)
    const category = categorize(rawForCategorize)
    const variability = withTypicalRange(label, buyer, category, data.stateCode)
    // Uniform-premium states (promulgated/bureau rates): surface the premium
    // as state-set so the UI explains why there's no comparison on that line.
    const uniformPremium =
      variability.isFixed &&
      category === 'title-settlement' &&
      premiumsAreUniform(data.stateCode)
    const feeSource = uniformPremium ? 'state' : inferFeeSource(rawForCategorize, category)

    lineItems.push({
      id: `elend-${i}`,
      label,
      category,
      ourCost: buyer,
      ...variability,
      ...(feeSource ? { feeSource } : {}),
    })
  })

  return {
    state: data.stateCode || '',
    zip: req.zip,
    county: data.county,
    homeValue: req.homeValue,
    loanAmount: req.loanAmount,
    transactionType: req.transactionType,
    generatedAt: new Date().toISOString(),
    lineItems,
  }
}
