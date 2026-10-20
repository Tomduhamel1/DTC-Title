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

export const GENERATED_AT = '2026-10-20T21:30:16.728Z'

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
export const NATIONAL_ANCHOR: StateAnchor = { purchase: { save: 370, ourTotal: 4145 }, refinance: { save: 181, ourTotal: 1996 } }

export const STATE_ANCHORS: Record<string, StateAnchor> = {
  AK: { purchase: { save: 276, ourTotal: 3201 }, refinance: { save: 266, ourTotal: 2421 } },
  AL: { purchase: { save: 390, ourTotal: 4324 }, refinance: { save: 158, ourTotal: 1925 } },
  AR: { purchase: { save: 287, ourTotal: 3089 }, refinance: { save: 172, ourTotal: 1450 } },
  AZ: { purchase: { save: 411, ourTotal: 2875 }, refinance: { save: 141, ourTotal: 1197 } },
  CA: { purchase: { save: 1031, ourTotal: 1918 }, refinance: { save: 278, ourTotal: 1340 } },
  CO: { purchase: { save: 91, ourTotal: 1395 }, refinance: { save: 109, ourTotal: 1177 } },
  CT: { purchase: { save: 318, ourTotal: 3161 }, refinance: { save: 221, ourTotal: 2392 } },
  DC: { purchase: { save: 509, ourTotal: 11521 }, refinance: { save: 74, ourTotal: 1411 } },
  DE: { purchase: { save: 409, ourTotal: 13421 }, refinance: { save: 243, ourTotal: 2294 } },
  FL: { purchase: { save: 280, ourTotal: 5410 }, refinance: { save: 260, ourTotal: 4014 } },
  GA: { purchase: { save: 516, ourTotal: 5028 }, refinance: { save: 119, ourTotal: 2580 } },
  HI: { purchase: { save: 916, ourTotal: 2891 }, refinance: { save: 599, ourTotal: 2081 } },
  IA: { purchase: { save: 200, ourTotal: 2378 }, refinance: { save: 148, ourTotal: 2162 } },
  ID: { purchase: { save: 317, ourTotal: 2806 }, refinance: { save: 323, ourTotal: 2740 } },
  IL: { purchase: { save: 1450, ourTotal: 5235 }, refinance: { save: 60, ourTotal: 1144 } },
  IN: { purchase: { save: 130, ourTotal: 1383 }, refinance: { save: 118, ourTotal: 1140 } },
  KS: { purchase: { save: 0, ourTotal: 1231 }, refinance: { save: 88, ourTotal: 1476 } },
  KY: { purchase: { save: 407, ourTotal: 2951 }, refinance: { save: 190, ourTotal: 1574 } },
  LA: { purchase: { save: 454, ourTotal: 4084 }, refinance: { save: 163, ourTotal: 1885 } },
  MA: { purchase: { save: 473, ourTotal: 3512 }, refinance: { save: 168, ourTotal: 1592 } },
  MD: { purchase: { save: 549, ourTotal: 12033 }, refinance: { save: 124, ourTotal: 3191 } },
  ME: { purchase: { save: 356, ourTotal: 3689 }, refinance: { save: 124, ourTotal: 1131 } },
  MI: { purchase: { save: 206, ourTotal: 1946 }, refinance: { save: 88, ourTotal: 1072 } },
  MN: { purchase: { save: 262, ourTotal: 3258 }, refinance: { save: 68, ourTotal: 1954 } },
  MO: { purchase: { save: 0, ourTotal: 848 }, refinance: { save: 27, ourTotal: 817 } },
  MS: { purchase: { save: 420, ourTotal: 2912 }, refinance: { save: 136, ourTotal: 1157 } },
  MT: { purchase: { save: 403, ourTotal: 2696 }, refinance: { save: 343, ourTotal: 2288 } },
  ND: { purchase: { save: 270, ourTotal: 2075 }, refinance: { save: 113, ourTotal: 1040 } },
  NE: { purchase: { save: 245, ourTotal: 2055 }, refinance: { save: 183, ourTotal: 1516 } },
  NH: { purchase: { save: 294, ourTotal: 6086 }, refinance: { save: 113, ourTotal: 1155 } },
  NJ: { purchase: { save: 334, ourTotal: 3056 }, refinance: { save: 154, ourTotal: 2006 } },
  NM: { purchase: { save: 372, ourTotal: 2607 }, refinance: { save: 170, ourTotal: 2607 } },
  NV: { purchase: { save: 359, ourTotal: 3583 }, refinance: { save: 81, ourTotal: 1058 } },
  NY: { purchase: { save: 239, ourTotal: 11770 }, refinance: { save: 239, ourTotal: 10759 } },
  OH: { purchase: { save: 220, ourTotal: 2010 }, refinance: { save: 78, ourTotal: 1251 } },
  OK: { purchase: { save: 296, ourTotal: 4457 }, refinance: { save: 139, ourTotal: 3366 } },
  OR: { purchase: { save: 224, ourTotal: 3078 }, refinance: { save: 254, ourTotal: 2383 } },
  PA: { purchase: { save: 559, ourTotal: 15867 }, refinance: { save: 463, ourTotal: 3691 } },
  RI: { purchase: { save: 530, ourTotal: 2195 }, refinance: { save: 290, ourTotal: 1197 } },
  SC: { purchase: { save: 290, ourTotal: 2184 }, refinance: { save: 161, ourTotal: 1308 } },
  SD: { purchase: { save: 535, ourTotal: 3647 }, refinance: { save: 372, ourTotal: 2579 } },
  TN: { purchase: { save: 98, ourTotal: 3489 }, refinance: { save: 162, ourTotal: 1849 } },
  TX: { purchase: { save: 127, ourTotal: 3509 }, refinance: { save: 127, ourTotal: 1772 } },
  UT: { purchase: { save: 210, ourTotal: 1986 }, refinance: { save: 126, ourTotal: 1310 } },
  VA: { purchase: { save: 468, ourTotal: 6263 }, refinance: { save: 118, ourTotal: 2094 } },
  VT: { purchase: { save: 418, ourTotal: 8505 }, refinance: { save: 218, ourTotal: 1770 } },
  WA: { purchase: { save: 382, ourTotal: 2058 }, refinance: { save: 314, ourTotal: 1804 } },
  WI: { purchase: { save: 322, ourTotal: 2346 }, refinance: { save: 113, ourTotal: 1015 } },
  WV: { purchase: { save: 400, ourTotal: 2938 }, refinance: { save: 168, ourTotal: 1463 } },
  WY: { purchase: { save: 240, ourTotal: 2310 }, refinance: { save: 88, ourTotal: 1208 } },
}
