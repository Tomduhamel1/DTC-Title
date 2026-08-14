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

export const GENERATED_AT = '2026-08-14T22:23:15.971Z'

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
export const NATIONAL_ANCHOR: StateAnchor = { purchase: { save: 352, ourTotal: 4151 }, refinance: { save: 164, ourTotal: 2022 } }

export const STATE_ANCHORS: Record<string, StateAnchor> = {
  AK: { purchase: { save: 276, ourTotal: 3229 }, refinance: { save: 266, ourTotal: 2449 } },
  AL: { purchase: { save: 350, ourTotal: 4363 }, refinance: { save: 118, ourTotal: 1964 } },
  AR: { purchase: { save: 247, ourTotal: 3128 }, refinance: { save: 132, ourTotal: 1489 } },
  AZ: { purchase: { save: 376, ourTotal: 2910 }, refinance: { save: 106, ourTotal: 1232 } },
  CA: { purchase: { save: 1021, ourTotal: 1928 }, refinance: { save: 268, ourTotal: 1350 } },
  CO: { purchase: { save: 87, ourTotal: 1382 }, refinance: { save: 109, ourTotal: 1187 } },
  CT: { purchase: { save: 318, ourTotal: 3206 }, refinance: { save: 221, ourTotal: 2437 } },
  DC: { purchase: { save: 509, ourTotal: 11556 }, refinance: { save: 74, ourTotal: 1446 } },
  DE: { purchase: { save: 384, ourTotal: 13384 }, refinance: { save: 218, ourTotal: 2265 } },
  FL: { purchase: { save: 270, ourTotal: 5420 }, refinance: { save: 250, ourTotal: 4024 } },
  GA: { purchase: { save: 471, ourTotal: 5048 }, refinance: { save: 74, ourTotal: 2600 } },
  HI: { purchase: { save: 916, ourTotal: 2891 }, refinance: { save: 599, ourTotal: 2081 } },
  IA: { purchase: { save: 200, ourTotal: 2468 }, refinance: { save: 148, ourTotal: 2252 } },
  ID: { purchase: { save: 317, ourTotal: 2853 }, refinance: { save: 323, ourTotal: 2787 } },
  IL: { purchase: { save: 1440, ourTotal: 5245 }, refinance: { save: 60, ourTotal: 1154 } },
  IN: { purchase: { save: 105, ourTotal: 1408 }, refinance: { save: 93, ourTotal: 1165 } },
  KS: { purchase: { save: 0, ourTotal: 1241 }, refinance: { save: 88, ourTotal: 1486 } },
  KY: { purchase: { save: 397, ourTotal: 2961 }, refinance: { save: 180, ourTotal: 1584 } },
  LA: { purchase: { save: 444, ourTotal: 4094 }, refinance: { save: 153, ourTotal: 1895 } },
  MA: { purchase: { save: 433, ourTotal: 3552 }, refinance: { save: 128, ourTotal: 1632 } },
  MD: { purchase: { save: 529, ourTotal: 11053 }, refinance: { save: 104, ourTotal: 3211 } },
  ME: { purchase: { save: 336, ourTotal: 3709 }, refinance: { save: 104, ourTotal: 1151 } },
  MI: { purchase: { save: 206, ourTotal: 1956 }, refinance: { save: 88, ourTotal: 1082 } },
  MN: { purchase: { save: 262, ourTotal: 3268 }, refinance: { save: 68, ourTotal: 1964 } },
  MO: { purchase: { save: 69, ourTotal: 1270 }, refinance: { save: 27, ourTotal: 823 } },
  MS: { purchase: { save: 350, ourTotal: 2582 }, refinance: { save: 126, ourTotal: 1167 } },
  MT: { purchase: { save: 393, ourTotal: 2706 }, refinance: { save: 333, ourTotal: 2298 } },
  ND: { purchase: { save: 260, ourTotal: 2085 }, refinance: { save: 103, ourTotal: 1050 } },
  NE: { purchase: { save: 235, ourTotal: 2065 }, refinance: { save: 173, ourTotal: 1526 } },
  NH: { purchase: { save: 284, ourTotal: 6096 }, refinance: { save: 103, ourTotal: 1165 } },
  NJ: { purchase: { save: 334, ourTotal: 3091 }, refinance: { save: 154, ourTotal: 2041 } },
  NM: { purchase: { save: 359, ourTotal: 2620 }, refinance: { save: 157, ourTotal: 2620 } },
  NV: { purchase: { save: 359, ourTotal: 3593 }, refinance: { save: 81, ourTotal: 1068 } },
  NY: { purchase: { save: 229, ourTotal: 11815 }, refinance: { save: 229, ourTotal: 10804 } },
  OH: { purchase: { save: 220, ourTotal: 2020 }, refinance: { save: 78, ourTotal: 1261 } },
  OK: { purchase: { save: 296, ourTotal: 4539 }, refinance: { save: 139, ourTotal: 3448 } },
  OR: { purchase: { save: 224, ourTotal: 3103 }, refinance: { save: 254, ourTotal: 2408 } },
  PA: { purchase: { save: 544, ourTotal: 15882 }, refinance: { save: 448, ourTotal: 3706 } },
  RI: { purchase: { save: 500, ourTotal: 2225 }, refinance: { save: 260, ourTotal: 1227 } },
  SC: { purchase: { save: 245, ourTotal: 2229 }, refinance: { save: 116, ourTotal: 1353 } },
  SD: { purchase: { save: 353, ourTotal: 3829 }, refinance: { save: 190, ourTotal: 2761 } },
  TN: { purchase: { save: 53, ourTotal: 3534 }, refinance: { save: 117, ourTotal: 1894 } },
  TX: { purchase: { save: 117, ourTotal: 3534 }, refinance: { save: 117, ourTotal: 1797 } },
  UT: { purchase: { save: 210, ourTotal: 1996 }, refinance: { save: 126, ourTotal: 1320 } },
  VA: { purchase: { save: 448, ourTotal: 6283 }, refinance: { save: 98, ourTotal: 2114 } },
  VT: { purchase: { save: 338, ourTotal: 8585 }, refinance: { save: 138, ourTotal: 1850 } },
  WA: { purchase: { save: 372, ourTotal: 2073 }, refinance: { save: 304, ourTotal: 1819 } },
  WI: { purchase: { save: 312, ourTotal: 2356 }, refinance: { save: 103, ourTotal: 1025 } },
  WV: { purchase: { save: 369, ourTotal: 2869 }, refinance: { save: 148, ourTotal: 1458 } },
  WY: { purchase: { save: 240, ourTotal: 2320 }, refinance: { save: 88, ourTotal: 1218 } },
}
