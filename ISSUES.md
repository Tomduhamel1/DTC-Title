# Issues to resolve

Running list of open problems so nothing gets lost. New issues go at the top
of **Open** with the date found; when something is fixed, move it to
**Resolved** with the date closed.

## Open

### FNTE calculator: IN & LA refinance quotes always fail — CONSTANT (found 2026-08-12)
Every refinance quote for Indiana and Louisiana returns 500. This is
constant, not transient: reproduced continuously over ~2 hours with retries,
while purchase quotes for the same ZIPs succeed every time. Likely the
FirstAm L2 path (neither state is in the calculator's centralized-rates
list). Both are ON states, so customers hit this today.
- Fix belongs to the FNTE team (details: `docs/FEE_CALCULATOR_REFI_SEARCH_GAP.md`).
- Interim option: turn IN/LA refinance OFF in `src/lib/stateMaster.ts` so
  visitors get the `/quote/unavailable` coming-soon page instead of an error.
- After the fix, backfill generated data:
  `npx tsx scripts/build-state-savings.ts IN,LA` and
  `npx tsx scripts/build-state-matrix.ts IN,LA`.

### FNTE calculator: NC fails intermittently — TRANSIENT (found 2026-08-12)
North Carolina quotes fail randomly in BOTH purchase and refinance — the
same request succeeds one minute and 500s the next. NC's fee-schedule row is
well-formed, so it looks like infrastructure, not data. ON state →
unpredictable customer errors. Backfill NC data after the fix (same subset
commands as above, with `NC`).

### Upstream omits the refi title-search line in every state (found 2026-08-12)
`AbstractorTitleSearchREFI` is unpopulated for all 51 rows in
`eLEND_public_calc`, and the Lambda suppresses the purchase column on
refis — so upstream refi quotes silently drop the search fee. BetterClose
compensates downstream via `ENSURE_LINES` in `src/lib/betterCloseFees.ts`;
FNTE should still fix the source (populate the REFI column or add a
fallback). Details: `docs/FEE_CALCULATOR_REFI_SEARCH_GAP.md`.

### Which fee-calculator Lambda is canonical? (found 2026-08-12)
The live `/test` API-Gateway stage routes to `fnte-fee-calculator-l2-test`.
A newer `fnte-fee-calculator-prod` (2026-08-03) exists but is not on this
path. Confirm with FNTE which is canonical and point `FEE_CALC_API_URL`
accordingly.

### Fee-schedule quirks worth confirming (found 2026-08-12)
IA settlement: purchase $250 < refi $350. OH: purchase $291 < refi $350.
Confirm with FNTE that these inversions are intentional.

### Product decisions parked (as of 2026-08-12)
- Workshare states + DC: decide whether/when to turn on the 16 OFF states.
- BetterClose Bucks: counsel review of the credit structure.
- Liberty Title quote documents: archive to `data/market-fees/` so comp
  provenance survives.

## Resolved

### Site footer carried unverified trust claims (found 2026-08-11, resolved by 2026-08-13)
SOC 2 / ALTA membership / bonded claims appeared on the site without basis.
Verified scrubbed from the live homepage, /security, /about, and
/for-brokers on 2026-08-13. Rule stands: never state SOC 2, ALTA membership,
or bonding anywhere.
