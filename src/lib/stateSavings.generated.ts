// GENERATED FILE — do not edit by hand.
// Rebuild with: npx tsx scripts/build-state-savings.ts
//
// Per-state "save at closing" anchors, computed by running the production
// quote engine (fetchElendFeeEstimate → computeTotals) at the anchor scenario
// below against each state's representative ZIP. See src/lib/stateSavings.ts
// for how these are consumed.
//
// States omitted after upstream failures (runtime falls back to the
// national anchor): NC

export const GENERATED_AT = '2026-10-21T23:49:14.398Z'

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
export const NATIONAL_ANCHOR: StateAnchor = { purchase: { save: 373, ourTotal: 4141 }, refinance: { save: 184, ourTotal: 1991 } }

export const STATE_ANCHORS: Record<string, StateAnchor> = {
  AK: { purchase: { save: 276, ourTotal: 3196 }, refinance: { save: 266, ourTotal: 2416 } },
  AL: { purchase: { save: 395, ourTotal: 4319 }, refinance: { save: 163, ourTotal: 1920 } },
  AR: { purchase: { save: 292, ourTotal: 3084 }, refinance: { save: 177, ourTotal: 1445 } },
  AZ: { purchase: { save: 416, ourTotal: 2870 }, refinance: { save: 146, ourTotal: 1192 } },
  CA: { purchase: { save: 1036, ourTotal: 1913 }, refinance: { save: 283, ourTotal: 1335 } },
  CO: { purchase: { save: 91, ourTotal: 1390 }, refinance: { save: 109, ourTotal: 1172 } },
  CT: { purchase: { save: 318, ourTotal: 3156 }, refinance: { save: 221, ourTotal: 2387 } },
  DC: { purchase: { save: 509, ourTotal: 11516 }, refinance: { save: 74, ourTotal: 1406 } },
  DE: { purchase: { save: 414, ourTotal: 13416 }, refinance: { save: 248, ourTotal: 2289 } },
  FL: { purchase: { save: 285, ourTotal: 5405 }, refinance: { save: 265, ourTotal: 4009 } },
  GA: { purchase: { save: 521, ourTotal: 5023 }, refinance: { save: 124, ourTotal: 2575 } },
  HI: { purchase: { save: 916, ourTotal: 2891 }, refinance: { save: 599, ourTotal: 2081 } },
  IA: { purchase: { save: 200, ourTotal: 2373 }, refinance: { save: 148, ourTotal: 2157 } },
  ID: { purchase: { save: 317, ourTotal: 2801 }, refinance: { save: 323, ourTotal: 2735 } },
  IL: { purchase: { save: 1455, ourTotal: 5230 }, refinance: { save: 60, ourTotal: 1139 } },
  IN: { purchase: { save: 135, ourTotal: 1378 }, refinance: { save: 123, ourTotal: 1135 } },
  KS: { purchase: { save: 0, ourTotal: 1226 }, refinance: { save: 88, ourTotal: 1471 } },
  KY: { purchase: { save: 412, ourTotal: 2946 }, refinance: { save: 195, ourTotal: 1569 } },
  LA: { purchase: { save: 459, ourTotal: 4079 }, refinance: { save: 168, ourTotal: 1880 } },
  MA: { purchase: { save: 478, ourTotal: 3507 }, refinance: { save: 173, ourTotal: 1587 } },
  MD: { purchase: { save: 554, ourTotal: 12028 }, refinance: { save: 129, ourTotal: 3186 } },
  ME: { purchase: { save: 361, ourTotal: 3684 }, refinance: { save: 129, ourTotal: 1126 } },
  MI: { purchase: { save: 206, ourTotal: 1941 }, refinance: { save: 88, ourTotal: 1067 } },
  MN: { purchase: { save: 262, ourTotal: 3253 }, refinance: { save: 68, ourTotal: 1949 } },
  MO: { purchase: { save: 0, ourTotal: 843 }, refinance: { save: 27, ourTotal: 812 } },
  MS: { purchase: { save: 425, ourTotal: 2907 }, refinance: { save: 141, ourTotal: 1152 } },
  MT: { purchase: { save: 408, ourTotal: 2691 }, refinance: { save: 348, ourTotal: 2283 } },
  ND: { purchase: { save: 275, ourTotal: 2070 }, refinance: { save: 118, ourTotal: 1035 } },
  NE: { purchase: { save: 250, ourTotal: 2050 }, refinance: { save: 188, ourTotal: 1511 } },
  NH: { purchase: { save: 299, ourTotal: 6081 }, refinance: { save: 118, ourTotal: 1150 } },
  NJ: { purchase: { save: 334, ourTotal: 3051 }, refinance: { save: 154, ourTotal: 2001 } },
  NM: { purchase: { save: 377, ourTotal: 2602 }, refinance: { save: 175, ourTotal: 2602 } },
  NV: { purchase: { save: 359, ourTotal: 3578 }, refinance: { save: 81, ourTotal: 1053 } },
  NY: { purchase: { save: 244, ourTotal: 11765 }, refinance: { save: 244, ourTotal: 10754 } },
  OH: { purchase: { save: 220, ourTotal: 2005 }, refinance: { save: 78, ourTotal: 1246 } },
  OK: { purchase: { save: 296, ourTotal: 4452 }, refinance: { save: 139, ourTotal: 3361 } },
  OR: { purchase: { save: 224, ourTotal: 3073 }, refinance: { save: 254, ourTotal: 2378 } },
  PA: { purchase: { save: 564, ourTotal: 15862 }, refinance: { save: 468, ourTotal: 3686 } },
  RI: { purchase: { save: 535, ourTotal: 2190 }, refinance: { save: 295, ourTotal: 1192 } },
  SC: { purchase: { save: 295, ourTotal: 2179 }, refinance: { save: 166, ourTotal: 1303 } },
  SD: { purchase: { save: 540, ourTotal: 3642 }, refinance: { save: 377, ourTotal: 2574 } },
  TN: { purchase: { save: 103, ourTotal: 3484 }, refinance: { save: 167, ourTotal: 1844 } },
  TX: { purchase: { save: 132, ourTotal: 3504 }, refinance: { save: 132, ourTotal: 1767 } },
  UT: { purchase: { save: 210, ourTotal: 1981 }, refinance: { save: 126, ourTotal: 1305 } },
  VA: { purchase: { save: 473, ourTotal: 6258 }, refinance: { save: 123, ourTotal: 2089 } },
  VT: { purchase: { save: 423, ourTotal: 8500 }, refinance: { save: 223, ourTotal: 1765 } },
  WA: { purchase: { save: 387, ourTotal: 2053 }, refinance: { save: 319, ourTotal: 1799 } },
  WI: { purchase: { save: 327, ourTotal: 2341 }, refinance: { save: 118, ourTotal: 1010 } },
  WV: { purchase: { save: 405, ourTotal: 2933 }, refinance: { save: 173, ourTotal: 1458 } },
  WY: { purchase: { save: 240, ourTotal: 2305 }, refinance: { save: 88, ourTotal: 1203 } },
}
