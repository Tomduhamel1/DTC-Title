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

export const GENERATED_AT = '2026-07-16T20:33:58.669Z'

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
export const NATIONAL_ANCHOR: StateAnchor = { purchase: { save: 602, ourTotal: 4515 }, refinance: { save: 304, ourTotal: 2043 } }

export const STATE_ANCHORS: Record<string, StateAnchor> = {
  AK: { purchase: { save: 865, ourTotal: 3505 }, refinance: { save: 583, ourTotal: 2535 } },
  AL: { purchase: { save: 862, ourTotal: 4633 }, refinance: { save: 258, ourTotal: 1747 } },
  AR: { purchase: { save: 561, ourTotal: 3325 }, refinance: { save: 281, ourTotal: 1286 } },
  AZ: { purchase: { save: 773, ourTotal: 3238 }, refinance: { save: 241, ourTotal: 1050 } },
  CA: { purchase: { save: 502, ourTotal: 2116 }, refinance: { save: 266, ourTotal: 1433 } },
  CO: { purchase: { save: 339, ourTotal: 1469 }, refinance: { save: 285, ourTotal: 1296 } },
  CT: { purchase: { save: 783, ourTotal: 3524 }, refinance: { save: 509, ourTotal: 2308 } },
  DC: { purchase: { save: 1147, ourTotal: 12065 }, refinance: { save: 265, ourTotal: 1270 } },
  DE: { purchase: { save: 211, ourTotal: 13725 }, refinance: { save: 128, ourTotal: 2300 } },
  FL: { purchase: { save: 188, ourTotal: 5775 }, refinance: { save: 128, ourTotal: 4179 } },
  GA: { purchase: { save: 1039, ourTotal: 5519 }, refinance: { save: 265, ourTotal: 2324 } },
  HI: { purchase: { save: 823, ourTotal: 3277 }, refinance: { save: 583, ourTotal: 2368 } },
  IA: { purchase: { save: 544, ourTotal: 2668 }, refinance: { save: 434, ourTotal: 2050 } },
  ID: { purchase: { save: 742, ourTotal: 3170 }, refinance: { save: 666, ourTotal: 2735 } },
  IL: { purchase: { save: 349, ourTotal: 5334 }, refinance: { save: 247, ourTotal: 1214 } },
  KS: { purchase: { save: 188, ourTotal: 1241 }, refinance: { save: 274, ourTotal: 1574 } },
  KY: { purchase: { save: 776, ourTotal: 3323 }, refinance: { save: 400, ourTotal: 1739 } },
  MA: { purchase: { save: 871, ourTotal: 3935 }, refinance: { save: 274, ourTotal: 1420 } },
  MD: { purchase: { save: 1025, ourTotal: 11543 }, refinance: { save: 266, ourTotal: 3185 } },
  ME: { purchase: { save: 703, ourTotal: 4005 }, refinance: { save: 258, ourTotal: 1125 } },
  MI: { purchase: { save: 531, ourTotal: 2162 }, refinance: { save: 274, ourTotal: 1170 } },
  MN: { purchase: { save: 626, ourTotal: 3530 }, refinance: { save: 241, ourTotal: 2032 } },
  MO: { purchase: { save: 309, ourTotal: 1339 }, refinance: { save: 179, ourTotal: 850 } },
  MS: { purchase: { save: 713, ourTotal: 2897 }, refinance: { save: 296, ourTotal: 1268 } },
  MT: { purchase: { save: 680, ourTotal: 3001 }, refinance: { save: 567, ourTotal: 2561 } },
  ND: { purchase: { save: 564, ourTotal: 2310 }, refinance: { save: 258, ourTotal: 1128 } },
  NE: { purchase: { save: 528, ourTotal: 2265 }, refinance: { save: 374, ourTotal: 1674 } },
  NH: { purchase: { save: 610, ourTotal: 6345 }, refinance: { save: 264, ourTotal: 1243 } },
  NJ: { purchase: { save: 166, ourTotal: 3425 }, refinance: { save: 128, ourTotal: 1945 } },
  NM: { purchase: { save: 538, ourTotal: 4025 }, refinance: { save: 128, ourTotal: 2645 } },
  NV: { purchase: { save: 1011, ourTotal: 3952 }, refinance: { save: 263, ourTotal: 1149 } },
  NY: { purchase: { save: 247, ourTotal: 12170 }, refinance: { save: 135, ourTotal: 10609 } },
  OH: { purchase: { save: 110, ourTotal: 2240 }, refinance: { save: 128, ourTotal: 1339 } },
  OK: { purchase: { save: 929, ourTotal: 4835 }, refinance: { save: 499, ourTotal: 2862 } },
  OR: { purchase: { save: 780, ourTotal: 3327 }, refinance: { save: 552, ourTotal: 2512 } },
  PA: { purchase: { save: 225, ourTotal: 16378 }, refinance: { save: 158, ourTotal: 4066 } },
  RI: { purchase: { save: 669, ourTotal: 2885 }, refinance: { save: 294, ourTotal: 1347 } },
  SC: { purchase: { save: 563, ourTotal: 2420 }, refinance: { save: 253, ourTotal: 1075 } },
  SD: { purchase: { save: 833, ourTotal: 4060 }, refinance: { save: 515, ourTotal: 2821 } },
  TN: { purchase: { save: 240, ourTotal: 3534 }, refinance: { save: 252, ourTotal: 1606 } },
  TX: { purchase: { save: 211, ourTotal: 3889 }, refinance: { save: 128, ourTotal: 1802 } },
  UT: { purchase: { save: 538, ourTotal: 2206 }, refinance: { save: 338, ourTotal: 1446 } },
  VA: { purchase: { save: 892, ourTotal: 6691 }, refinance: { save: 250, ourTotal: 2082 } },
  VT: { purchase: { save: 728, ourTotal: 8870 }, refinance: { save: 351, ourTotal: 1945 } },
  WA: { purchase: { save: 347, ourTotal: 2193 }, refinance: { save: 285, ourTotal: 1863 } },
  WI: { purchase: { save: 650, ourTotal: 2633 }, refinance: { save: 258, ourTotal: 1103 } },
  WV: { purchase: { save: 769, ourTotal: 3195 }, refinance: { save: 344, ourTotal: 1473 } },
  WY: { purchase: { save: 612, ourTotal: 2560 }, refinance: { save: 289, ourTotal: 1306 } },
}
