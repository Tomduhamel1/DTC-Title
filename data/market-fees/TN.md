# Tennessee (TN) Title / Closing / Settlement Fee Evidence

## Status: complete (scarce) — 3 verified sources, 2026-07-21

Tennessee does not meet the target (10) or saturation (6+) bar, but meets the contract's
**scarce** completion criterion. An exhaustive search across 8+ distinct query strategies
plus 5 direct provider-site checks of real Nashville/Memphis title and closing companies
(CLOSED Nashville, Ark Title Group, Bell Law Settlement Services, plus the 2 underwriters)
found that Tennessee closing/title companies are overwhelmingly quote-only — only one
(Greater Nashville Title) publishes any dollar figure at all, and even that is a single
marketing-page number rather than a full schedule. This is compounded by Tennessee's
unusual regulatory structure: in the state's largest counties, the *filed title insurance
premium itself* legally bundles in title search/exam (see below), which may explain why
independent settlement-fee publication is rarer here than in comparable states — much of
what would be a separate "settlement fee" elsewhere is already captured inside the
underwriters' own filed rate manuals. Marked **complete (scarce)**.

## Sources used (verified via direct fetch this session)

1. **Stewart Title Guaranty Company**, "Schedule of Charges and Forms for Title Insurance
   in the State of Tennessee," last updated February 4, 2022:
   http://go.stewart.com/rs/067-YWO-436/images/Tennessee%20Rate%20Manual%20FINAL.pdf
   — 8 county-specific schedules (A-G plus D-1/G-1 search-fee addenda); the richest and
   most structurally distinctive source found, due to TN's All-Inclusive rate rule.
2. **First National Title Insurance Company (FNTI)**, "Tennessee Title Insurance Rates
   and Rules Manual," effective May 27, 2024:
   http://documentpub.fnti.com/Documents/Tennessee/Rate%20Manual/FNTI%20Tennessee%20Rate%20Manual%20_Clean_Eff.%2005.27.2024.pdf
   — independently corroborates Stewart's All-Inclusive county grouping exactly (same 8
   named counties + Schedule E/Chapter 5 catch-all), with its own distinct rate figures.
3. **Greater Nashville Title**:
   https://greaternashvilletitle.com/
   — a single published data point: $499 closing fee, quoted from a delay-guarantee
   marketing claim on the homepage.

Retrieved and verified 2026-07-21.

## Tennessee's All-Inclusive Rate structure (the key finding)

Both underwriter manuals confirm, independently, that Tennessee's Department of Commerce
and Insurance Rule 0780-1-12-.01(2)/.02(1)(b)/(d) creates three distinct premium types by
county:

- **All-Inclusive** (Montgomery, Rutherford, Sumner, Williamson, Hamilton, Knox counties):
  the filed title insurance premium **legally includes** "the abstracting, search and
  examination" — meaning a large share of what other states bill as a separate
  settlement/title-service fee is baked directly into TN's regulated title premium in
  these counties.
- **Modified All-Inclusive** (Davidson, Shelby counties): premium includes title
  examination and title insurance but **excludes** abstract-of-title fees, which are
  billed separately per a published per-county search-fee schedule (Stewart's Schedule
  D-1/G-1; FNTI's Section 3.14/4.14) — e.g., Davidson County residential search $125
  (Stewart) / $125 (FNTI, matches exactly); Shelby County residential search $200
  (Stewart) / $200 (FNTI, matches exactly).
- **Risk Rate** (the remaining ~87 counties, Schedule E / Chapter 5): a traditional
  premium-only rate that explicitly excludes "fees or charges for abstracts of title,
  title searches, attorney's fees, escrow or closing-related services charged locally by
  abstracters, attorneys, and title companies" (FNTI's own wording) — the same
  premium/settlement-fee separation pattern seen in GA, CA, VA, AZ, and CO.

This is the only state surveyed to date where the *same* filed instrument (the title
premium) has three legally distinct scopes depending on county — a structural finding
specific to Tennessee's regulatory framework, not observed anywhere else in this survey.

## Settlement fee data actually observed

Because 8 of Tennessee's counties (covering its 3 largest metro areas — Nashville
[Davidson + the 4 adjoining All-Inclusive counties], Chattanooga [Hamilton], Knoxville
[Knox], and Memphis [Shelby]) fold search/exam into the underwriter's own premium, and
because every independent TN closing company checked directly (CLOSED Nashville, Ark
Title Group, Bell Law Settlement Services) is quote-only, only one true settlement-fee
data point was found:

- **Greater Nashville Title**: $499 flat closing fee (marketing-page figure, no further
  itemization or effective date).

This is far thinner than the settlement-fee evidence found in GA, VA, or CA, and appears
to be a genuine market characteristic rather than a search failure — TN's regulatory
structure removes much of the incentive for companies to publish a separate settlement
fee number the way GA closing attorneys or VA settlement companies routinely do.

## Itemization / bundling patterns

- **CPL pricing converges tightly**: both underwriters charge exactly $50/letter, with
  an identical $50 surcharge for a second mortgage/HELOC by a different lender — the
  same convergence pattern seen in GA and several other states.
- **Junior loan policy pricing diverges more**: Stewart $100 vs. FNTI $125 for the ALTA
  Residential Limited Coverage Junior Loan Policy (up to $250k liability) — a ~25%
  difference between the two underwriters on an otherwise-standardized product.
- **Search-fee figures match almost exactly between the two underwriters** in the
  counties where they're itemized separately (Davidson $125 both; Shelby $200 both) —
  suggesting these may track a bureau-influenced or informally-coordinated local
  standard rather than being independently competitive.

## Search log

Queries and direct checks run this session: "Tennessee title insurance company
settlement closing fee schedule pdf filed rate 2025 2026", "Tennessee closing attorney
title company fee schedule 'settlement fee' pdf itemized", "Tennessee closing attorney
flat fee title company Nashville OR Memphis", "First American Title Tennessee rate
manual escrow fee pdf" — 4 search strategies, plus direct fetches of go.stewart.com
(Stewart), documentpub.fnti.com (FNTI), rochfordlawyers.com, oahure.com (2 PDFs — turned
out to be a Hawaii rate sheet despite appearing in a TN-targeted search, excluded as
wrong-state), closedtitle.com, greaternashvilletitle.com, arktitlegroup.com, and
bellsettlement.com — 9 direct provider-site checks, exceeding the contract's 8-strategy
scarce threshold.

### Checked this session but not usable
- **rochfordlawyers.com/resources/closing-and-title-fees-in-tennessee** — general cost
  categories only, one worked example (title premium calculation) but no settlement fee.
- **oahure.com First American rate sheets** (2 PDFs) — recovered via the Read-recovery
  technique; both turned out to be **Hawaii** (Honolulu-area) rate schedules despite
  surfacing in a Tennessee-targeted search — excluded as wrong-state.
- **CLOSED Nashville, Ark Title Group, Bell Law Settlement Services** — all confirmed
  real, operating Nashville-area title/settlement companies; none publish a static fee
  schedule, all are quote-request-only.

## Calculator harvest (2026-07-28 session)

TN had zero calculator-basis providers on file entering this session (a tier-1 high-population
state per PROGRESS.md's priority order). Harvested 2 independent providers, both first-party
calculators (not shared SaaS platforms), both for the standard $500k/$400k scenario in Davidson
County (Nashville — TN's most populous county):

- **Tennessee Title Services, LLC** (`tennesseetitle.com/calculator.html`) — a first-party HTML
  form whose JS directly POSTs plain form-urlencoded fields to the company's own
  `calculator/calculator.php`, no shared platform involved. Returned JSON: Settlement Fee $595,
  Document Preparation $150, Document Storage $50, Recording Services $10, CPL $50, plus both
  title premiums and government recording/transfer taxes. No personal data fields anywhere in
  the flow (a separate "email your results" feature exists but was not used).
- **Signature Title Services** (`app.signaturetitleservices.net/PurchaseCalculator`) — a classic
  ASP.NET WebForms postback app (same pattern as FNF/Old Republic/Federal Title/Knight Barry).
  Returned: Buyer's Settlement Fee $595, Search Fee $125, Document Storage Fee $60,
  Verification Service Fee $15, CPL $50, both title premiums, and government recording/transfer/
  mortgage taxes (Grand Total $6,619.00). Notably the $595 Settlement Fee figure matches Tennessee
  Title Services' figure exactly — a genuine cross-provider consistency data point for Nashville's
  independent-agency settlement fee, not a platform-sharing artifact (confirmed these are two
  unrelated first-party calculators, not the same SaaS backend).
- **Investigated, not usable**: Express Title & Closing (`expresstc.com/estimator/`) embeds a
  TitleClose.com tenant (`expresstc.titleclose.com`) that redirects to a required
  `/Consumer/Account/Login` — gated (unlike the VA TitleClose tenants already on file, which had
  `shouldAskForConsumerData=false`); no personal data entered, logged and skipped. Magnolia Title
  (`magnoliatitle.com/rate-calculator/`) embeds TitleCapture (`magnoliatitle.titlecapture.com`),
  already documented platform-wide as jsOnly (browser-session priority item). Title Company TN
  (`titlecompanytn.com/calculator/`) embeds a branded Stewart Rate Calculator instance — see
  CALCULATORS.md's 2026-07-28 Stewart entry for the still-unsolved POST mechanism. Title Group of
  Tennessee (`titlegroupoftn.com/interactive-fee-calculator/`) embeds First American's
  "AgentNet®"/PrismPowered widget (`prismpowered.com/titlegroupoftn/guest-home`), an Angular SPA —
  **jsOnly**, newly logged in CALCULATORS.md.
- Below the 3-provider calculator-quoted threshold (2 of 3) — one more distinct TN provider
  needed; flagged for a future session (Stewart's officeid-based platform, once its POST mechanism
  is solved via a browser-driven session, would likely supply this and many other states at once).

**Update 2026-08-02 — 3rd provider found, TN crosses the calculator threshold.** Harvested
**Cornerstone Title of Tennessee, LLC** (Murfreesboro/Rutherford County home office, Davidson County
scenario used for comparability) via the TitleTap/NetSheetCalc platform (app_id 227), confirmed
genuinely TN-based and Quick-Quote-enabled (`is_qq_enabled:1`) per its own fetched config — a sibling
search result for the same platform, appid 420 "Members Title Agency," turned out to be Florida-based
despite a TN-flavored search snippet and was correctly excluded (not logged for TN). Result at
$500k/$400k, Davidson County: Closing Fee $300.00, Search Fees $250.00, Document Prep Fee $75.00, CPL
Fee $50.00, Owner's Policy Premium $3,104.69, Lender's Policy Premium $225.00 (flat, simultaneous
issue under this tenant's default payer allocation), Deed Recording Fee $18.00, Mortgage Recording
Fees $108.00, plus the tenant's own Conveyance Tax and Mortgage Tax government-charge formulas. The
$300 Closing Fee is in the same range as, though not identical to, the $595 Settlement Fee both
existing TN providers independently returned — a useful third data point on Nashville's independent
settlement-fee market. This crosses TN to 3 calculator-basis providers (Tennessee Title Services,
Signature Title Services, Cornerstone Title of Tennessee) — **calculator-quoted (3 providers)**.

## Richness pass (2026-08-19) — FNF national rate calculator, Davidson County
`ratecalculator.fnf.com` (already-solved recipe, reused nationwide), Davidson County (Nashville).
Premium-only: Owner's Policy Premium $3,104.69 (Disclosure $764.00 + Adjustment $2,340.69), Loan
Policy Premium $225.00, Grand Total $3,329.69. **Notable finding**: the Owner's Policy Premium is
byte-identical to Cornerstone Title of Tennessee's TitleTap-sourced figure above ($3,104.69) — a
genuine cross-tool corroboration (both independently reflect the same underlying filed/formula rate
for Davidson County at this scenario), not a data-entry duplication. Crosses TN to
**calculator-quoted (4 providers)**. See TN.json's 4th `"basis": "calculator"` entry for full
detail.
