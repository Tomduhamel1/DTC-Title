# Fee-calculator refi search gap — findings & upstream fix (2026-08-12)

## Summary

The FNTE fee-calculator API omits the title-search line on **every
refinance quote in every state**, even though the fee is billed at closing
(confirmed by Tom; surfaced by a Liberty Title side-by-side in RI).
BetterClose compensates downstream via `ENSURE_LINES` in
`src/lib/betterCloseFees.ts`; this doc records the root cause so the FNTE
team can fix it at the source.

## Root cause (from the Lambda source, `fnte-fee-calculator-l2-test`)

The master fee schedule lives in DynamoDB table **`eLEND_public_calc`**
(one item per StateCode). It has purpose-aware columns for exactly two
lines: `SettlementFee`/`SettlementFeeRefi` and
`AbstractorTitleSearch`/`AbstractorTitleSearchREFI`.

In `quick-quote/handler.js` (~lines 864–883):

- fees that are null/0 are skipped;
- on refinance, `AbstractorTitleSearch` (the purchase column) is
  **unconditionally suppressed**;
- `AbstractorTitleSearchREFI` is emitted instead — but that column is
  **unpopulated for all 51 states** (verified by a read-only scan
  2026-08-12), so nothing is emitted. There is no fallback.

The same logic is duplicated in `shared/fnte-fees.js` and
`enhanced-quote/handler.js` — all three quote paths share the defect.

## Upstream fix (for the FNTE team — no BetterClose action required)

Either:
1. **Populate `AbstractorTitleSearchREFI`** for each state in
   `eLEND_public_calc` (business decision per state; BetterClose currently
   assumes refi = purchase amount, validated for RI at $100), and/or
2. **Add a fallback** in the three handlers: when
   `AbstractorTitleSearchREFI` is null/0 on a refinance, fall back to
   `AbstractorTitleSearch` instead of emitting nothing.

Once the REFI column is populated upstream, BetterClose's `ENSURE_LINES`
entries become harmless no-ops (the dedupe in `src/lib/elendCalc.ts` skips
lines the upstream already returns).

## Also observed (worth the FNTE team's attention)

- The live `/test` API-Gateway stage routes to the Lambda named
  `fnte-fee-calculator-l2-test`; an `fnte-fee-calculator-prod` function
  exists (newer, 2026-08-03) but is not on this path. Which is canonical?
- `quick-quote/handler.js` emits unmapped DynamoDB keys with the raw
  attribute name as the fee description (line ~886), while
  `shared/fnte-fees.js` drops them — inconsistent behavior between paths.
- Schedule quirks: IA settlement purchase $250 < refi $350; OH purchase
  $291 < refi $350 — worth confirming these are intentional.

## Schedule snapshot (search-type fees + settlement, scanned 2026-08-12)

The authoritative data is the DynamoDB table; this snapshot is for
reference only. 29 states define `AbstractorTitleSearch` (AK 180, AL 295,
AR 295, AZ 250, CT 350, DC 250, DE 150, GA 350, IA 350, ID 375, IN 150,
MA 300, MD 100, ME 100, NC 50, NJ 250, NM 30, NY 350, OK 725, OR 150,
PA 50, RI 100, SC 350, SD 18, TN 350, TX 150, VA 100, WA 50, WV 100);
22 states define no search-type fees at all (CA, CO, FL, HI, IL, KS, KY,
MI, MN, MO, MS, MT, ND, NE, NH, NV, OH, UT, VT, WI, WY, LA*).
*LA/WY carry only TitleCertOpinion, which the API already returns in both
modes. Non-purpose-aware columns (ExamFee, AbstractStorageFee,
TitleCertFee, TitleCertOpinion, JudgementSearch) emit correctly on both
modes wherever populated — only `AbstractorTitleSearch` is refi-suppressed.
