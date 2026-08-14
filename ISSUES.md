# Issues to resolve

Running list of open problems so nothing gets lost. New issues go at the top
of **Open** with the date found; when something is fixed, move it to
**Resolved** with the date closed.

## Program summary for company discussion (2026-08-13)

**What's done:** the site's pricing is now one engine with an evidence-backed
market comparison. Five conflicting fee engines were consolidated; fabricated
comparison multipliers were replaced by a 51-state survey of published
competitor fee schedules (241 verified sources + First American direct-API
recon, maintained nightly by an automated agent); premiums are never compared
or discounted anywhere (promulgated/bureau states labeled "Set by state");
every issued quote freezes its numbers; every marketing figure derives from
the engine at render. Master reference: `docs/STATE_MASTER_VS_FNTE.csv`
(51 states × purchase/refi — our fees, market evidence with provenance,
verdicts, and the assumptions each comparison rests on). Florida was
restructured on 2026-08-13: $195 published settlement fee, promotional
credit (Bucks) excluded there, savings claims rest on our own service fee
only.

**Decisions/actions needed, by owner:**
- **FNTE API team:** canonical Lambda + prod URL; IN/LA refi constant 500s;
  NC intermittent 500s; refi search column unpopulated; IA/OH fee inversions.
- **Counsel:** FL $195 fee vs below-cost-inducement doctrine (our defensible
  basis: fee ≈1.4–2.3× blended direct vendor costs); Bucks credit structure
  state-by-state — priority on the other promulgated states (TX, NM).
- **Pricing/leadership:** multi-source evidence says our service fees exceed
  the known market in OK, NV, NM, UT, MO (and TX escrow) — review against
  `docs/STATE_MASTER_VS_FNTE.csv`; FL seller-side card proposal ($329
  all-in; scenario modeling pending); workshare-state activation.
- **Ops:** align charged CDs to the quoted card (FL first — actuals show
  three charging regimes and wire/courier lines never quoted; proposal: the
  read-only CD-classification harness becomes a weekly quoted-vs-charged
  auditor).
- **Tom:** ID buyer/seller escrow-split question (one call to a Boise title
  office; ~2× Idaho's claimable savings if filed fees are split); confirm or
  remove "BBB Accredited" in the footer.

## Open

### FL: counsel gate on $195 fee + Bucks state-by-state review (found 2026-08-13)
$195 FL settlement fee shipped (PR #81) with Bucks excluded in FL as the
compliance posture — but counsel has not yet confirmed $195 clears the
below-cost-inducement doctrine, and the Bucks premium-derived structure is
unreviewed in every other state (most exposed: TX and NM, the other
promulgated states). FL advertising claims stay gated until confirmed.

### FL: quoted-vs-charged ops alignment (found 2026-08-13)
Prod actuals (189 files/12mo, `support-incidents/fl-charging-actuals-2026-08-13/`)
show practice does not match any card: settlement modes $650/$350/$250,
wire $50 on 93% and courier $70 on 58% of files never quoted, sellers pay
$250 on 77% of purchases while the engine quotes $0 seller-side. The new
$195 card is only true if ops charges it. Proposal: weekly read-only CD
auditor from the recon harness + deviations-only-downward rule.

### FL: seller-side card and seller-side quoting (found 2026-08-13)
Seller pays us on ~4 of 5 FL purchases but the engine discards all
SellerFee lines — sellers (who choose the agent outside Miami-Dade/Broward)
can't be quoted at all. Proposed $329 all-in seller fee is
claim-ready vs published competitor typical ($425–520); needs scenario
modeling net of credits and a product decision on seller-facing quotes.

### Pricing review: states priced above the known market (found 2026-07-24)
Multi-source evidence (3+ independent providers) puts our service fees above
every known competitor in OK ($2,340/$1,415 vs markets ~$400) and above the
known market in NV, NM, UT, MO, plus TX escrow. Site honestly shows ~$0
savings there. Evidence: `docs/STATE_MASTER_VS_FNTE.csv` + data/market-fees.

### ID: escrow buyer/seller split resolution (found 2026-07-24)
Nine DOI-filed Idaho escrow schedules at $1,650–1,750 vs First American's
$700 buyer-side imply the filed fees are whole-transaction and split by
custom. Band deliberately held conservative; resolving the split (~one call)
roughly doubles Idaho's claimable savings.

### Evidence coverage: browser-only calculators + thin states (found 2026-07-23)
FNF's National Rate Calculator and First American's FACC (the two highest-
coverage fee sources) are JS-only and need a browser session to harvest;
~20 states still ride the inferred/capped band. Also open: refi-side
boundary audit (refi overrides predate the symmetric-stack convention),
price-tiered bands for the eight scaling-escrow states (flat bands
understate jumbo savings), and SD/IA anomalies (our SD stack $2,436 with no
market evidence; IA $1,150 vs partial published market).

### Footer still claims "BBB Accredited" (found 2026-07-22)
The only remaining unverified trust badge — confirm accreditation is real or
remove it.

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

### FL restructure: $195 fee, Bucks excluded, bands re-based (resolved 2026-08-13)
PRs #81/#82. Verified live: settlement $195, no credit line, exact
$270/$250 quoted savings vs unchanged six-provider market evidence.
Counsel gate on the number remains open (see Open).

### Five pricing engines consolidated to one; quotes frozen at issuance (resolved 2026-07)
Placeholder engines (`/pricing`, TrueFee print, title-calculator,
quote-calculator, orphaned quote-engine) deleted with redirects; per-line
savings badges sum exactly to headline; issued FeeQuotes freeze totals;
fabricated "$2,400 average"/"up to 50% less" claims replaced with
engine-derived figures.

### Market comparison rebuilt on evidence (resolved 2026-07-25, maintained nightly)
51-state survey of published competitor fee schedules (241 verified sources,
per-state search logs) + First American direct-API recon + calculator
harvests; symmetric stack-boundary audit across all 20 evidence states;
per-state bands with provenance and basis disclosed on every quote; premiums
never compared or counted toward savings in any state (NC's rating bureau
caught and corrected). Nightly cloud agent maintains freshness.

### Site footer carried unverified trust claims (found 2026-08-11, resolved by 2026-08-13)
SOC 2 / ALTA membership / bonded claims appeared on the site without basis.
Verified scrubbed from the live homepage, /security, /about, and
/for-brokers on 2026-08-13. Rule stands: never state SOC 2, ALTA membership,
or bonding anywhere.
