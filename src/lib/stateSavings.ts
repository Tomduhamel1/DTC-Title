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
// Estimates for other home values scale linearly from the anchor scenario.
// That's an approximation (title premiums are tiered, not linear), acceptable
// for a "typically save" teaser; the /quote flow is the precise answer.

import { loanInterestAvoided } from './feeReport'
import {
  ANCHOR_HOME_VALUE,
  NATIONAL_ANCHOR,
  STATE_ANCHORS,
  type StateAnchor,
} from './stateSavings.generated'

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

function resolveCode(state: string | null | undefined): string | undefined {
  if (!state) return undefined
  const trimmed = state.trim()
  if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase()
  return NAME_TO_CODE[trimmed.toLowerCase()]
}

function anchorFor(state: string | null | undefined): StateAnchor {
  const code = resolveCode(state)
  if (!code) return NATIONAL_ANCHOR
  return STATE_ANCHORS[code] ?? NATIONAL_ANCHOR
}

const round10 = (n: number) => Math.round(n / 10) * 10

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
  const anchor = anchorFor(state)
  const base = mode === 'refinance' ? anchor.refinance.save : anchor.purchase.save
  const saveAtClosing = Math.max(0, round10(base * (homeValue / ANCHOR_HOME_VALUE)))
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
  const anchor = anchorFor(state)
  const m = mode === 'refinance' ? anchor.refinance : anchor.purchase
  const scale = homeValue / ANCHOR_HOME_VALUE
  const saveAtClosing = Math.max(0, round10(m.save * scale))
  const ourTotal = Math.max(0, round10(m.ourTotal * scale))
  return { saveAtClosing, ourTotal, typicalTotal: ourTotal + saveAtClosing }
}
