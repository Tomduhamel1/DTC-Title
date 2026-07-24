// GENERATED FILE — do not edit by hand.
// Rebuild with: npx tsx scripts/build-state-savings.ts
//
// Per-state "save at closing" anchors, computed by running the production
// quote engine (fetchElendFeeEstimate → computeTotals) at the anchor scenario
// below against each state's representative ZIP. See src/lib/stateSavings.ts
// for how these are consumed.
//
// States omitted after upstream failures (runtime falls back to the
// national anchor): IN, LA, NC

export const GENERATED_AT = '2026-07-24T05:29:33.001Z'

// Anchor scenario: $500,000 purchase, $400,000 loan (80% LTV);
// refinance of a $400,000 note.
export const ANCHOR_HOME_VALUE = 500000

export interface ModeAnchor {
  /** Engine-computed "save at closing" for the anchor scenario. */
  save: number
  /** Engine-computed all-in buyer-side total (title, settlement, recording). */
  ourTotal: number
}

export interface StateAnchor {
  purchase: ModeAnchor
  refinance: ModeAnchor
}

// Mean across generated states.
export const NATIONAL_ANCHOR: StateAnchor = { purchase: { save: 442, ourTotal: 4515 }, refinance: { save: 217, ourTotal: 2043 } }

export const STATE_ANCHORS: Record<string, StateAnchor> = {
  AK: { purchase: { save: 459, ourTotal: 3505 }, refinance: { save: 444, ourTotal: 2535 } },
  AL: { purchase: { save: 531, ourTotal: 4633 }, refinance: { save: 156, ourTotal: 1747 } },
  AR: { purchase: { save: 380, ourTotal: 3325 }, refinance: { save: 179, ourTotal: 1286 } },
  AZ: { purchase: { save: 596, ourTotal: 3238 }, refinance: { save: 139, ourTotal: 1050 } },
  CA: { purchase: { save: 874, ourTotal: 2116 }, refinance: { save: 538, ourTotal: 1433 } },
  CO: { purchase: { save: 145, ourTotal: 1469 }, refinance: { save: 181, ourTotal: 1296 } },
  CT: { purchase: { save: 530, ourTotal: 3524 }, refinance: { save: 368, ourTotal: 2308 } },
  DC: { purchase: { save: 848, ourTotal: 12065 }, refinance: { save: 124, ourTotal: 1270 } },
  DE: { purchase: { save: 44, ourTotal: 13725 }, refinance: { save: 26, ourTotal: 2300 } },
  FL: { purchase: { save: 0, ourTotal: 5775 }, refinance: { save: 0, ourTotal: 4179 } },
  GA: { purchase: { save: 895, ourTotal: 5519 }, refinance: { save: 183, ourTotal: 2324 } },
  HI: { purchase: { save: 1174, ourTotal: 3277 }, refinance: { save: 790, ourTotal: 2368 } },
  IA: { purchase: { save: 334, ourTotal: 2668 }, refinance: { save: 246, ourTotal: 2050 } },
  ID: { purchase: { save: 528, ourTotal: 3170 }, refinance: { save: 538, ourTotal: 2735 } },
  IL: { purchase: { save: 1471, ourTotal: 5334 }, refinance: { save: 1055, ourTotal: 1214 } },
  KS: { purchase: { save: 0, ourTotal: 1241 }, refinance: { save: 146, ourTotal: 1574 } },
  KY: { purchase: { save: 624, ourTotal: 3323 }, refinance: { save: 298, ourTotal: 1739 } },
  MA: { purchase: { save: 689, ourTotal: 3935 }, refinance: { save: 172, ourTotal: 1420 } },
  MD: { purchase: { save: 870, ourTotal: 11543 }, refinance: { save: 164, ourTotal: 3185 } },
  ME: { purchase: { save: 541, ourTotal: 4005 }, refinance: { save: 156, ourTotal: 1125 } },
  MI: { purchase: { save: 343, ourTotal: 2162 }, refinance: { save: 146, ourTotal: 1170 } },
  MN: { purchase: { save: 438, ourTotal: 3530 }, refinance: { save: 113, ourTotal: 2032 } },
  MO: { purchase: { save: 115, ourTotal: 1339 }, refinance: { save: 45, ourTotal: 850 } },
  MS: { purchase: { save: 561, ourTotal: 2897 }, refinance: { save: 194, ourTotal: 1268 } },
  MT: { purchase: { save: 590, ourTotal: 3001 }, refinance: { save: 509, ourTotal: 2561 } },
  ND: { purchase: { save: 412, ourTotal: 2310 }, refinance: { save: 156, ourTotal: 1128 } },
  NE: { purchase: { save: 376, ourTotal: 2265 }, refinance: { save: 272, ourTotal: 1674 } },
  NH: { purchase: { save: 458, ourTotal: 6345 }, refinance: { save: 162, ourTotal: 1243 } },
  NJ: { purchase: { save: 0, ourTotal: 3425 }, refinance: { save: 0, ourTotal: 1945 } },
  NM: { purchase: { save: 0, ourTotal: 4025 }, refinance: { save: 0, ourTotal: 2645 } },
  NV: { purchase: { save: 598, ourTotal: 3952 }, refinance: { save: 135, ourTotal: 1149 } },
  NY: { purchase: { save: 0, ourTotal: 12170 }, refinance: { save: 0, ourTotal: 10609 } },
  OH: { purchase: { save: 0, ourTotal: 2240 }, refinance: { save: 0, ourTotal: 1339 } },
  OK: { purchase: { save: 493, ourTotal: 4835 }, refinance: { save: 232, ourTotal: 2862 } },
  OR: { purchase: { save: 374, ourTotal: 3327 }, refinance: { save: 424, ourTotal: 2512 } },
  PA: { purchase: { save: 49, ourTotal: 16378 }, refinance: { save: 36, ourTotal: 4066 } },
  RI: { purchase: { save: 503, ourTotal: 2885 }, refinance: { save: 188, ourTotal: 1347 } },
  SC: { purchase: { save: 374, ourTotal: 2420 }, refinance: { save: 148, ourTotal: 1075 } },
  SD: { purchase: { save: 509, ourTotal: 4060 }, refinance: { save: 243, ourTotal: 2821 } },
  TN: { purchase: { save: 54, ourTotal: 3534 }, refinance: { save: 150, ourTotal: 1606 } },
  TX: { purchase: { save: 0, ourTotal: 3889 }, refinance: { save: 0, ourTotal: 1802 } },
  UT: { purchase: { save: 350, ourTotal: 2206 }, refinance: { save: 210, ourTotal: 1446 } },
  VA: { purchase: { save: 730, ourTotal: 6691 }, refinance: { save: 148, ourTotal: 2082 } },
  VT: { purchase: { save: 542, ourTotal: 8870 }, refinance: { save: 215, ourTotal: 1945 } },
  WA: { purchase: { save: 333, ourTotal: 2193 }, refinance: { save: 273, ourTotal: 1863 } },
  WI: { purchase: { save: 498, ourTotal: 2633 }, refinance: { save: 156, ourTotal: 1103 } },
  WV: { purchase: { save: 600, ourTotal: 3195 }, refinance: { save: 235, ourTotal: 1473 } },
  WY: { purchase: { save: 400, ourTotal: 2560 }, refinance: { save: 146, ourTotal: 1306 } },
}
