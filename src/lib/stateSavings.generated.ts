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

export const GENERATED_AT = '2026-07-15T00:17:10.033Z'

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
export const NATIONAL_ANCHOR: StateAnchor = { purchase: { save: 1146, ourTotal: 4509 }, refinance: { save: 753, ourTotal: 2043 } }

export const STATE_ANCHORS: Record<string, StateAnchor> = {
  AK: { purchase: { save: 1368, ourTotal: 3505 }, refinance: { save: 1285, ourTotal: 2535 } },
  AL: { purchase: { save: 1359, ourTotal: 4633 }, refinance: { save: 516, ourTotal: 1747 } },
  AR: { purchase: { save: 900, ourTotal: 3325 }, refinance: { save: 572, ourTotal: 1286 } },
  AZ: { purchase: { save: 1285, ourTotal: 3238 }, refinance: { save: 475, ourTotal: 1050 } },
  CA: { purchase: { save: 815, ourTotal: 2116 }, refinance: { save: 535, ourTotal: 1433 } },
  CO: { purchase: { save: 515, ourTotal: 1469 }, refinance: { save: 595, ourTotal: 1296 } },
  CT: { purchase: { save: 1285, ourTotal: 3524 }, refinance: { save: 1099, ourTotal: 2308 } },
  DC: { purchase: { save: 1916, ourTotal: 12065 }, refinance: { save: 512, ourTotal: 1270 } },
  DE: { purchase: { save: 1329, ourTotal: 13725 }, refinance: { save: 971, ourTotal: 2300 } },
  FL: { purchase: { save: 1420, ourTotal: 5775 }, refinance: { save: 943, ourTotal: 4179 } },
  GA: { purchase: { save: 1744, ourTotal: 5519 }, refinance: { save: 512, ourTotal: 2324 } },
  HI: { purchase: { save: 1397, ourTotal: 3277 }, refinance: { save: 1322, ourTotal: 2368 } },
  IA: { purchase: { save: 880, ourTotal: 2668 }, refinance: { save: 876, ourTotal: 2050 } },
  ID: { purchase: { save: 1235, ourTotal: 3170 }, refinance: { save: 1495, ourTotal: 2735 } },
  IL: { purchase: { save: 528, ourTotal: 5334 }, refinance: { save: 460, ourTotal: 1214 } },
  KS: { purchase: { save: 250, ourTotal: 1241 }, refinance: { save: 556, ourTotal: 1574 } },
  KY: { purchase: { save: 1295, ourTotal: 3323 }, refinance: { save: 836, ourTotal: 1739 } },
  MA: { purchase: { save: 1458, ourTotal: 3935 }, refinance: { save: 556, ourTotal: 1420 } },
  MD: { purchase: { save: 1740, ourTotal: 11543 }, refinance: { save: 513, ourTotal: 3185 } },
  ME: { purchase: { save: 1164, ourTotal: 4005 }, refinance: { save: 507, ourTotal: 1125 } },
  MI: { purchase: { save: 867, ourTotal: 2162 }, refinance: { save: 556, ourTotal: 1170 } },
  MN: { purchase: { save: 1037, ourTotal: 3530 }, refinance: { save: 475, ourTotal: 2032 } },
  MO: { purchase: { save: 336, ourTotal: 1059 }, refinance: { save: 318, ourTotal: 850 } },
  MS: { purchase: { save: 1195, ourTotal: 2897 }, refinance: { save: 607, ourTotal: 1268 } },
  MT: { purchase: { save: 1135, ourTotal: 3001 }, refinance: { save: 1259, ourTotal: 2561 } },
  ND: { purchase: { save: 926, ourTotal: 2310 }, refinance: { save: 516, ourTotal: 1128 } },
  NE: { purchase: { save: 855, ourTotal: 2265 }, refinance: { save: 796, ourTotal: 1674 } },
  NH: { purchase: { save: 1003, ourTotal: 6345 }, refinance: { save: 521, ourTotal: 1243 } },
  NJ: { purchase: { save: 1236, ourTotal: 3425 }, refinance: { save: 835, ourTotal: 1945 } },
  NM: { purchase: { save: 1513, ourTotal: 4025 }, refinance: { save: 1267, ourTotal: 2645 } },
  NV: { purchase: { save: 1627, ourTotal: 3952 }, refinance: { save: 529, ourTotal: 1149 } },
  NY: { purchase: { save: 1469, ourTotal: 12170 }, refinance: { save: 1211, ourTotal: 10609 } },
  OH: { purchase: { save: 813, ourTotal: 2240 }, refinance: { save: 524, ourTotal: 1339 } },
  OK: { purchase: { save: 1465, ourTotal: 4835 }, refinance: { save: 945, ourTotal: 2862 } },
  OR: { purchase: { save: 1213, ourTotal: 3327 }, refinance: { save: 1222, ourTotal: 2512 } },
  PA: { purchase: { save: 1813, ourTotal: 16378 }, refinance: { save: 1911, ourTotal: 4066 } },
  RI: { purchase: { save: 1097, ourTotal: 2885 }, refinance: { save: 582, ourTotal: 1347 } },
  SC: { purchase: { save: 899, ourTotal: 2420 }, refinance: { save: 500, ourTotal: 1075 } },
  SD: { purchase: { save: 1290, ourTotal: 4060 }, refinance: { save: 860, ourTotal: 2821 } },
  TN: { purchase: { save: 320, ourTotal: 3534 }, refinance: { save: 502, ourTotal: 1606 } },
  TX: { purchase: { save: 1565, ourTotal: 3889 }, refinance: { save: 884, ourTotal: 1802 } },
  UT: { purchase: { save: 880, ourTotal: 2206 }, refinance: { save: 710, ourTotal: 1446 } },
  VA: { purchase: { save: 1500, ourTotal: 6691 }, refinance: { save: 482, ourTotal: 2082 } },
  VT: { purchase: { save: 1185, ourTotal: 8870 }, refinance: { save: 663, ourTotal: 1945 } },
  WA: { purchase: { save: 547, ourTotal: 2193 }, refinance: { save: 581, ourTotal: 1863 } },
  WI: { purchase: { save: 1082, ourTotal: 2633 }, refinance: { save: 516, ourTotal: 1103 } },
  WV: { purchase: { save: 1257, ourTotal: 3195 }, refinance: { save: 669, ourTotal: 1473 } },
  WY: { purchase: { save: 1002, ourTotal: 2560 }, refinance: { save: 576, ourTotal: 1306 } },
}
