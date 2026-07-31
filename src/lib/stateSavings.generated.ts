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

export const GENERATED_AT = '2026-07-31T00:17:47.502Z'

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
export const NATIONAL_ANCHOR: StateAnchor = { purchase: { save: 728, ourTotal: 4232 }, refinance: { save: 329, ourTotal: 1908 } }

export const STATE_ANCHORS: Record<string, StateAnchor> = {
  AK: { purchase: { save: 735, ourTotal: 3229 }, refinance: { save: 710, ourTotal: 2269 } },
  AL: { purchase: { save: 801, ourTotal: 4363 }, refinance: { save: 234, ourTotal: 1669 } },
  AR: { purchase: { save: 577, ourTotal: 3128 }, refinance: { save: 271, ourTotal: 1194 } },
  AZ: { purchase: { save: 924, ourTotal: 2910 }, refinance: { save: 207, ourTotal: 982 } },
  CA: { purchase: { save: 1336, ourTotal: 1928 }, refinance: { save: 407, ourTotal: 1350 } },
  CO: { purchase: { save: 232, ourTotal: 1382 }, refinance: { save: 290, ourTotal: 1187 } },
  CT: { purchase: { save: 848, ourTotal: 3206 }, refinance: { save: 589, ourTotal: 2087 } },
  DC: { purchase: { save: 1357, ourTotal: 11556 }, refinance: { save: 198, ourTotal: 1196 } },
  DE: { purchase: { save: 385, ourTotal: 13384 }, refinance: { save: 211, ourTotal: 2115 } },
  FL: { purchase: { save: 390, ourTotal: 5385 }, refinance: { save: 185, ourTotal: 3994 } },
  GA: { purchase: { save: 1270, ourTotal: 5048 }, refinance: { save: 211, ourTotal: 2250 } },
  HI: { purchase: { save: 1560, ourTotal: 2891 }, refinance: { save: 1077, ourTotal: 2081 } },
  IA: { purchase: { save: 534, ourTotal: 2468 }, refinance: { save: 394, ourTotal: 1902 } },
  ID: { purchase: { save: 845, ourTotal: 2853 }, refinance: { save: 861, ourTotal: 2412 } },
  IL: { purchase: { save: 1602, ourTotal: 5245 }, refinance: { save: 160, ourTotal: 1154 } },
  KS: { purchase: { save: 0, ourTotal: 1241 }, refinance: { save: 234, ourTotal: 1486 } },
  KY: { purchase: { save: 986, ourTotal: 2961 }, refinance: { save: 453, ourTotal: 1584 } },
  MA: { purchase: { save: 1072, ourTotal: 3552 }, refinance: { save: 260, ourTotal: 1332 } },
  MD: { purchase: { save: 1360, ourTotal: 11053 }, refinance: { save: 238, ourTotal: 3111 } },
  ME: { purchase: { save: 837, ourTotal: 3709 }, refinance: { save: 230, ourTotal: 1051 } },
  MI: { purchase: { save: 549, ourTotal: 1956 }, refinance: { save: 234, ourTotal: 1082 } },
  MN: { purchase: { save: 700, ourTotal: 3268 }, refinance: { save: 181, ourTotal: 1964 } },
  MO: { purchase: { save: 184, ourTotal: 1270 }, refinance: { save: 72, ourTotal: 823 } },
  MS: { purchase: { save: 876, ourTotal: 2582 }, refinance: { save: 295, ourTotal: 1167 } },
  MT: { purchase: { save: 885, ourTotal: 2706 }, refinance: { save: 772, ourTotal: 2298 } },
  ND: { purchase: { save: 637, ourTotal: 2085 }, refinance: { save: 234, ourTotal: 1050 } },
  NE: { purchase: { save: 576, ourTotal: 2065 }, refinance: { save: 420, ourTotal: 1526 } },
  NH: { purchase: { save: 707, ourTotal: 6096 }, refinance: { save: 240, ourTotal: 1165 } },
  NJ: { purchase: { save: 334, ourTotal: 3091 }, refinance: { save: 154, ourTotal: 1791 } },
  NM: { purchase: { save: 266, ourTotal: 3759 }, refinance: { save: 266, ourTotal: 2379 } },
  NV: { purchase: { save: 957, ourTotal: 3593 }, refinance: { save: 216, ourTotal: 1068 } },
  NY: { purchase: { save: 380, ourTotal: 11790 }, refinance: { save: 249, ourTotal: 10360 } },
  OH: { purchase: { save: 220, ourTotal: 2020 }, refinance: { save: 78, ourTotal: 1261 } },
  OK: { purchase: { save: 789, ourTotal: 4539 }, refinance: { save: 371, ourTotal: 2723 } },
  OR: { purchase: { save: 598, ourTotal: 3103 }, refinance: { save: 678, ourTotal: 2258 } },
  PA: { purchase: { save: 545, ourTotal: 15882 }, refinance: { save: 446, ourTotal: 3656 } },
  RI: { purchase: { save: 868, ourTotal: 2315 }, refinance: { save: 390, ourTotal: 1157 } },
  SC: { purchase: { save: 565, ourTotal: 2229 }, refinance: { save: 220, ourTotal: 1003 } },
  SD: { purchase: { save: 740, ourTotal: 3829 }, refinance: { save: 321, ourTotal: 2743 } },
  TN: { purchase: { save: 54, ourTotal: 3534 }, refinance: { save: 224, ourTotal: 1532 } },
  TX: { purchase: { save: 428, ourTotal: 3461 }, refinance: { save: 170, ourTotal: 1632 } },
  UT: { purchase: { save: 560, ourTotal: 1996 }, refinance: { save: 336, ourTotal: 1320 } },
  VA: { purchase: { save: 1138, ourTotal: 6283 }, refinance: { save: 216, ourTotal: 2014 } },
  VT: { purchase: { save: 827, ourTotal: 8585 }, refinance: { save: 310, ourTotal: 1850 } },
  WA: { purchase: { save: 554, ourTotal: 2073 }, refinance: { save: 461, ourTotal: 1769 } },
  WI: { purchase: { save: 775, ourTotal: 2356 }, refinance: { save: 234, ourTotal: 1025 } },
  WV: { purchase: { save: 926, ourTotal: 2869 }, refinance: { save: 350, ourTotal: 1358 } },
  WY: { purchase: { save: 640, ourTotal: 2320 }, refinance: { save: 234, ourTotal: 1218 } },
}
