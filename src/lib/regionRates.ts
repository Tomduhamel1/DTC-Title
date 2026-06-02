// Approximate AT-CLOSING savings as a fraction of home value, by state.
//
// Conservative model for a comparison-shopping borrower: ~10% off the LOW end
// of the typical title-insurance range plus ~20% off settlement fees. We do NOT
// compare against inflated high-end estimates. Multipliers below are tuned so a
// $500k purchase returns a believable title+settlement at-closing number.
//
// These are rough averages used only to power the hero "what you'd save"
// number — the actual /quote flow returns precise per-fee math from the API.
//
// Higher values = states where typical title companies charge more, so the
// conservative 10%/20% cut yields a larger dollar saving.

import { loanInterestAvoided } from './feeReport'

export type RegionRates = {
  purchase: number // multiplier on home value
  refinance: number // multiplier on home value (assumes ~80% LTV refi)
}

const RATES: Record<string, RegionRates> = {
  // High-cost / heavy-overcharge states
  CA: { purchase: 0.0218, refinance: 0.0064 },
  NY: { purchase: 0.0245, refinance: 0.0072 },
  FL: { purchase: 0.0205, refinance: 0.0060 },
  WA: { purchase: 0.0210, refinance: 0.0061 },
  IL: { purchase: 0.0192, refinance: 0.0056 },
  CO: { purchase: 0.0198, refinance: 0.0058 },

  // Mid
  GA: { purchase: 0.01852, refinance: 0.00541 },
  TX: { purchase: 0.0187, refinance: 0.0055 },
  AZ: { purchase: 0.0178, refinance: 0.0052 },
  NC: { purchase: 0.0175, refinance: 0.0051 },
  VA: { purchase: 0.0182, refinance: 0.0053 },
  PA: { purchase: 0.0180, refinance: 0.0053 },
  OH: { purchase: 0.0165, refinance: 0.0048 },
  TN: { purchase: 0.0170, refinance: 0.0050 },
  MI: { purchase: 0.0162, refinance: 0.0047 },
  NJ: { purchase: 0.0220, refinance: 0.0064 },
  MD: { purchase: 0.0210, refinance: 0.0061 },
  MA: { purchase: 0.0225, refinance: 0.0066 },
  OR: { purchase: 0.0192, refinance: 0.0056 },
  NV: { purchase: 0.0185, refinance: 0.0054 },

  // Lower
  IN: { purchase: 0.0155, refinance: 0.0045 },
  MO: { purchase: 0.0158, refinance: 0.0046 },
  AL: { purchase: 0.0152, refinance: 0.0044 },
  SC: { purchase: 0.0162, refinance: 0.0047 },
  KY: { purchase: 0.0150, refinance: 0.0044 },
  OK: { purchase: 0.0148, refinance: 0.0043 },
  AR: { purchase: 0.0145, refinance: 0.0042 },
  MS: { purchase: 0.0148, refinance: 0.0043 },
  LA: { purchase: 0.0155, refinance: 0.0045 },
  WI: { purchase: 0.0160, refinance: 0.0047 },
  MN: { purchase: 0.0170, refinance: 0.0050 },
  IA: { purchase: 0.0150, refinance: 0.0044 },
  KS: { purchase: 0.0148, refinance: 0.0043 },
  NE: { purchase: 0.0145, refinance: 0.0042 },
  UT: { purchase: 0.0175, refinance: 0.0051 },
  ID: { purchase: 0.0162, refinance: 0.0047 },
  NM: { purchase: 0.0158, refinance: 0.0046 },
  CT: { purchase: 0.0205, refinance: 0.0060 },
  NH: { purchase: 0.0185, refinance: 0.0054 },
  ME: { purchase: 0.0178, refinance: 0.0052 },
  RI: { purchase: 0.0205, refinance: 0.0060 },
  VT: { purchase: 0.0180, refinance: 0.0053 },
  DE: { purchase: 0.0195, refinance: 0.0057 },
  WV: { purchase: 0.0145, refinance: 0.0042 },
  MT: { purchase: 0.0155, refinance: 0.0045 },
  WY: { purchase: 0.0152, refinance: 0.0044 },
  ND: { purchase: 0.0145, refinance: 0.0042 },
  SD: { purchase: 0.0145, refinance: 0.0042 },
  AK: { purchase: 0.0175, refinance: 0.0051 },
  HI: { purchase: 0.0235, refinance: 0.0069 },
  DC: { purchase: 0.0225, refinance: 0.0066 },
}

export const NATIONAL_AVERAGE: RegionRates = { purchase: 0.0182, refinance: 0.0053 }

export function getRatesForState(stateCode?: string | null): RegionRates {
  if (!stateCode) return NATIONAL_AVERAGE
  return RATES[stateCode.toUpperCase()] || NATIONAL_AVERAGE
}

// The RATES multipliers above were originally tuned to a 30-year-financed
// lifetime number. We now lead with the conservative AT-CLOSING figure, which
// is a fraction of that. This factor converts the legacy lifetime multiplier
// back to a believable title+settlement-only at-closing saving.
const AT_CLOSING_FACTOR = 0.3

export interface RegionSavings {
  /** Direct title + settlement savings paid at the closing table. */
  saveAtClosing: number
  /** At-closing savings plus interest avoided over the loan (see feeReport). */
  saveOverLoan: number
}

/**
 * Conservative two-bucket savings estimate used by the homepage hero.
 *  - saveAtClosing: ~10% off low-end title + ~20% off settlement, by state.
 *  - saveOverLoan : saveAtClosing + interest avoided over 30 years at 6.5%,
 *                   i.e. what borrowing that much less (or better pricing)
 *                   saves over the life of the loan.
 */
export function estimateSavings(
  homeValue: number,
  mode: 'purchase' | 'refinance',
  stateCode?: string | null,
): RegionSavings {
  const rates = getRatesForState(stateCode)
  const rate = mode === 'refinance' ? rates.refinance : rates.purchase
  const saveAtClosing = Math.round((homeValue * rate * AT_CLOSING_FACTOR) / 10) * 10
  const saveOverLoan = saveAtClosing + loanInterestAvoided(saveAtClosing)
  return { saveAtClosing, saveOverLoan: Math.round(saveOverLoan / 10) * 10 }
}
