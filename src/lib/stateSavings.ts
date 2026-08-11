// Runtime accessor for the per-state savings anchors in
// stateSavings.generated.ts. This is the ONE savings model for every
// marketing surface (homepage hero, chat calculators, shared SavingsContext);
// the /quote flow computes its own totals from live fee data via the same
// engine that generated these anchors.
//
// Anchors are real outputs of the production fee engine (fetchElendFeeEstimate
// → computeTotals) run at a fixed scenario per state — see
// scripts/build-state-savings.ts. Regenerate with:
//
//   npx tsx scripts/build-state-savings.ts
//
// Estimates for other home values interpolate across the engine-generated
// curve (stateSavingsCurve.generated.ts: real quotes at $500k/$1MM/$2MM) —
// savings are not linear in price (flat package gap + premium-scaled Bucks),
// so linear anchor scaling would overstate. The /quote flow stays the
// precise answer.

import { loanInterestAvoided } from './feeReport'
import { stateOffered } from './stateMaster'
import {
  CURVE_HOME_VALUES,
  CurvePoint,
  NATIONAL_CURVE,
  STATE_CURVES,
  StateCurve,
} from './stateSavingsCurve.generated'


export interface RegionSavings {
  /** Direct title + settlement savings paid at the closing table. */
  saveAtClosing: number
  /** At-closing savings plus interest avoided over the loan (see feeReport). */
  saveOverLoan: number
}

// The chat calculators pass full state names; the hero passes 2-letter codes.
const NAME_TO_CODE: Record<string, string> = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA',
  hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA',
  kansas: 'KS', kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD',
  massachusetts: 'MA', michigan: 'MI', minnesota: 'MN', mississippi: 'MS', missouri: 'MO',
  montana: 'MT', nebraska: 'NE', nevada: 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH',
  oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT', vermont: 'VT',
  virginia: 'VA', washington: 'WA', 'west virginia': 'WV', wisconsin: 'WI', wyoming: 'WY',
  'district of columbia': 'DC',
}

export function resolveStateCode(state: string | null | undefined): string | undefined {
  if (!state) return undefined
  const trimmed = state.trim()
  if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase()
  return NAME_TO_CODE[trimmed.toLowerCase()]
}

const resolveCode = resolveStateCode

const round10 = (n: number) => Math.round(n / 10) * 10

// ── Curve interpolation ─────────────────────────────────────────────────────
// Savings are NOT linear in home value: the service-package gap is flat while
// BetterClose Bucks scales with premiums. Linear scaling from the $500k
// anchor OVERSTATES savings at higher prices (RI: linear $1,227 @ $1.5M vs
// engine ~$935). Where the engine-generated curve exists
// (stateSavingsCurve.generated.ts: real quotes at $500k/$1MM/$2MM) we
// piecewise-linearly interpolate between its points; below the first point we
// scale it down linearly (conservative — Bucks shrinks roughly with value,
// the flat package gap makes true savings higher); above the last point we
// extend the final segment's slope (tracks Bucks growth).
function interpolate(points: CurvePoint[], homeValue: number, key: 'save' | 'pay'): number {
  const xs = CURVE_HOME_VALUES
  if (homeValue <= xs[0]) return (points[0][key] * homeValue) / xs[0]
  const last = xs.length - 1
  for (let i = 1; i <= last; i++) {
    if (homeValue <= xs[i]) {
      const t = (homeValue - xs[i - 1]) / (xs[i] - xs[i - 1])
      return points[i - 1][key] + t * (points[i][key] - points[i - 1][key])
    }
  }
  const slope = (points[last][key] - points[last - 1][key]) / (xs[last] - xs[last - 1])
  return points[last][key] + slope * (homeValue - xs[last])
}

function curveFor(state: string | null | undefined): StateCurve {
  const code = resolveCode(state)
  if (!code) return NATIONAL_CURVE
  if (!stateOffered(code, 'purchase') && !stateOffered(code, 'refinance')) return NATIONAL_CURVE
  return STATE_CURVES[code] ?? NATIONAL_CURVE
}

/**
 * Two-bucket savings estimate for marketing surfaces.
 *  - saveAtClosing: the anchor state's engine-computed savings, scaled
 *    linearly from the anchor home value.
 *  - saveOverLoan : saveAtClosing + interest avoided over the loan term
 *    (shared assumptions in feeReport: 6.5% over 30 years).
 */
export function estimateSavings(
  homeValue: number,
  mode: 'purchase' | 'refinance',
  state: string | null | undefined,
): RegionSavings {
  const curve = curveFor(state)
  const points = mode === 'refinance' ? curve.refinance : curve.purchase
  const saveAtClosing = Math.max(0, round10(interpolate(points, homeValue, 'save')))
  return {
    saveAtClosing,
    saveOverLoan: saveAtClosing + loanInterestAvoided(saveAtClosing),
  }
}

export interface RegionCostBasis {
  /** Engine-derived savings vs the typical low end, scaled to homeValue. */
  saveAtClosing: number
  /** Engine-derived BetterClose buyer-side total, scaled to homeValue. */
  ourTotal: number
  /** ourTotal + saveAtClosing — the typical low-end market total. */
  typicalTotal: number
}

/**
 * Cost-basis estimate for surfaces that show "typical vs BetterClose" context
 * (chat calculators). Same anchors, same scaling as estimateSavings.
 */
export function estimateCostBasis(
  homeValue: number,
  mode: 'purchase' | 'refinance',
  state: string | null | undefined,
): RegionCostBasis {
  const curve = curveFor(state)
  const points = mode === 'refinance' ? curve.refinance : curve.purchase
  const saveAtClosing = Math.max(0, round10(interpolate(points, homeValue, 'save')))
  const ourTotal = Math.max(0, round10(interpolate(points, homeValue, 'pay')))
  return { saveAtClosing, ourTotal, typicalTotal: ourTotal + saveAtClosing }
}
