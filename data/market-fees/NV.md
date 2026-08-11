# Nevada (NV) — Market Fee Evidence

## Status: COMPLETE (scarce market) — 2 published providers verified (3 documents) + **calculator-quoted (4 providers)**, 2026-08-11

## Calculator harvest (2026-07-22)
Old Republic Title's public **Estimated Rate/Fee Calculator**
(https://www.ortconline.com/Web2/productsservices/informationservices/ratefeecalc/default.aspx) was
driven directly via HTTP GET/POST (ASP.NET WebForms postback replication, no browser/JS execution)
for the standard $500,000 purchase/$400,000 loan scenario, **Las Vegas (Clark County)**. Result:
Closing Protection Letter Fee $25, Concurrent Loan Charge $275, E-Recording Service Fee $50, Lender's
Title Policy $1,694, Settlement Agent Fee $720 (of $1,440 total, buyer half), Recording Fees $110.
Owner's Title Policy shown "(seller paid)", Total $1,377 (full Homeowner's Policy rate $2,139 + $932
concurrent-issue charge − $1,694 lender's premium). Section totals: C (shop-for) $2,764.00, E (gov't
fees) $110.00. This is Old Republic's own restatement of the same Clark/Lincoln/Nye "Area A" filed-rate
zone already verified via First American's regulator-published Escrow Rate Manual — a genuine
cross-underwriter corroboration for the Las Vegas market. Full entry recorded in NV.json with
`"basis": "calculator"`. No personal information was entered (Name/Company fields are optional and
were left blank). This is 1 calculator provider; the task's 3-provider threshold was not reached this
session (see CALCULATORS.md).

2 providers verified across 3 documents: First American Title Insurance Company
(both a genuine, dollar-denominated **escrow fee schedule** and a companion
title premium schedule, both filed with and published by the Nevada Division
of Insurance) and Stewart Title Guaranty Company (premium-only). Despite 19
combined query strategies and direct provider-site checks, no additional
provider's static rate manual could be located (WFG's actual current Nevada
rate manual PDF is not indexed -- only a superseded 2013 bulletin notice was
found; Old Republic, Chicago Title, and Fidelity National all route Nevada
pricing through interactive calculators only). Marked **complete (scarce)**
under the contract's provider-count criterion, though the evidence quality
here is unusually high: First American's escrow schedule is a genuine,
regulator-published, dollar-denominated settlement-fee source -- a rarer and
richer find than the premium-only manuals typical of most "scarce" states in
this survey (comparable in quality to the AK/HI/IA finds).

## Key market structure finding

Nevada title insurance premiums are filed with and approved by the Division
of Insurance (a genuine filed-rate state). Uniquely among states surveyed so
far, Nevada's DOI also publicly hosts a **separate, dollar-denominated
Schedule of Escrow Fees** at the same `docs.nv.gov/doi/title_rates/documents/`
location as the premium schedule -- both filed by First American and both
carrying the same document number (000251), suggesting Nevada requires (or at
minimum permits public filing of) escrow/settlement rates the way Kansas
(K.S.A. 40-1111) and Idaho (IDAPA 18.05.01.022) do, rather than leaving them
unregulated/unpublished as in most other states. The escrow schedule
explicitly states it applies "for the use of First American Title Insurance
Company, its owned operations, and title agencies that elect to adopt and use
these Fees" -- implying other Nevada title agencies may adopt this exact fee
structure, though none doing so was independently verified this session.

## Verified sources

1. **First American Title Insurance Company — Escrow Rate Manual**, effective
   2025-09-20. Genuine escrow fee schedule with a 2-tier county area system:
   Area A (Clark, Lincoln, Nye Counties) $760 up to $100,000, scaling to
   $1,510 + $6.25/$10,000 above $600,000; Area B (all other counties) $880 up
   to $100,000, scaling to $1,928 + $8/$10,000 above $1,000,000. Also prices
   refinance/loan-only escrow ($375 residential / $500 commercial),
   resale/refinance one-time fee ($400), short-sale/REO/manufactured-home
   add-ons, and military/senior/first-time-buyer/investor discounts.
2. **First American Title Insurance Company — Title Rate Manual**, effective
   2026-05-10. Companion premium-only schedule (Base Rate A/B), the standard
   Owner's/Loan/refinance/reissue structure plus Major Projects, Trustee's
   Sale Guarantee, and UCC EAGLE 9 insurance rates.
3. **Stewart Title Guaranty Company**, effective 2025-04-28. Premium-only,
   with a distinctive 3-zone county rate structure (Zone 1: Elko/White
   Pine/Eureka/Lander; Zone 2: Clark/Lincoln/Nye; Zone 3: Washoe/Humboldt/
   Pershing/Churchill/Mineral/Esmeralda/Douglas/Carson City/Lyon/Storey).

## Observed service-stack range

First American's escrow fee is the only settlement-fee data point found:
$760-$1,928 (Area A: Clark/Lincoln/Nye, i.e. the Las Vegas metro) versus
$880-$1,928+ (Area B: all other counties, including Reno/Washoe), scaling
with transaction value. Notably Area B's entry-tier fee ($880) is *higher*
than Area A's ($760) despite Area A containing Nevada's largest metro
(Las Vegas/Clark County) -- the inverse of the usual urban-premium pattern,
though the two areas converge at higher transaction values. With only one
provider's escrow schedule found, this range cannot be cross-checked against
a second independent source.

## Itemization / bundling patterns

- First American's Basic Escrow Services bundles document prep for 1 deed,
  e-doc download/printing, up to 2 wire transfers, up to 2 overnight
  deliveries, preliminary report/commitment ordering, closing statement/
  escrow instructions prep, and in-office notary/signing -- all at no
  additional charge within the Basic Escrow Fee. Services outside this bundle
  (additional documents at $50/document, sub-escrow, interest-bearing account
  setup at $50, third-party services, recording/transfer-tax charges at
  actual cost) are itemized in a separate Miscellaneous Services table.
- Both First American documents and Stewart's manual price the Closing
  Protection Letter identically at $25 per party -- a clean cross-provider
  corroboration despite one being an escrow schedule and the other a premium
  manual.
- Stewart's 3-zone structure and First American's 2-area structure do not
  align on county groupings (Stewart separates Washoe into its own Zone 3
  with Humboldt/Pershing/Churchill/etc.; First American's Area A/B split
  differs), making a direct cross-provider county-level comparison
  imprecise.
- First American's discount stack (military, senior citizen, first-time
  homebuyer, investor, non-profit organizations under Stewart's manual) is
  the most extensive discount taxonomy found for any state in this survey to
  date -- 4 distinct escrow discounts plus Stewart's 3 premium discounts
  (governmental contracts, disaster loans, non-profit organizations).

## Premium rate cards

See Verified sources above for First American (Base Rate A/B, full tables to
$5,000,000+ via Major Projects section) and Stewart (3-zone tables to
$2,000,000 each). Both are richly detailed, filed-rate premium schedules.

## Metro differences

First American's escrow schedule differentiates Area A (Clark/Lincoln/Nye,
i.e. Las Vegas metro) from Area B (all other counties, including Reno/Washoe)
with Area B pricing modestly *higher* at lower transaction tiers -- the
reverse of the usual urban-premium pattern. Stewart's premium schedule uses a
finer 3-zone county structure with Zone 3 (Washoe/Reno-area plus rural
counties) pricing ~9-19% higher than Zones 1/2 at the entry tier.

## Search log (19 combined query strategies + direct provider-site checks)

1. "Nevada title insurance premium rate regulated filed Nevada Division of
   Insurance Schedule of Title Insurance Rates" search -- confirmed NV is a
   filed-rate state and surfaced the First American Title Rate Manual PDF.
2. "Nevada title company closing fee OR escrow fee schedule PDF Las Vegas OR
   Reno settlement fee '$'" search -- surfaced the First American Escrow
   Rate Manual PDF hosted at docs.nv.gov.
3. Direct fetch + PDF-recovery of the First American Escrow Rate Manual --
   **verified** (source #1), genuine dollar-denominated escrow fees.
4. Direct fetch + PDF-recovery of the First American Title Rate Manual --
   **verified** (source #2), companion premium schedule.
5. "Stewart Title Guaranty Nevada rate manual PDF virtualunderwriter
   effective" search -- surfaced the current (2025-04-28) Stewart NV manual.
6. "WFG National Title Nevada rate manual PDF wfgunderwriting.com" search --
   surfaced only a superseded 2013 underwriting bulletin notice, no current
   rate manual PDF link found.
7. "Old Republic Title Nevada escrow fee schedule OR rate manual PDF Las
   Vegas" search -- confirmed Old Republic routes NV pricing through an
   interactive rate calculator only, no static PDF found.
8. Direct fetch + PDF-recovery of the Stewart NV Schedule of Charges --
   **verified** (source #3).
9. "docs.nv.gov doi title_rates documents Stewart OR WFG OR Old Republic rate
   manual" search -- confirmed only First American's documents are indexed
   under this DOI directory path; no other insurer's filing found there.
10. "Nevada Division of Insurance title insurance rate filings list all
    companies" search -- surfaced the DOI's SERFF Filing Access portal and a
    rate-comparison-tool reference (titlerates.doi.nv.gov), but no bulk list
    of filed rate manuals by company.
11. Direct fetch of vgrti.com/rates-fees.html (Vanguard Research & Title
    Services, independent NV agency) -- HTTP 403 Forbidden, unreachable.
12. Direct fetch of titlerates.doi.nv.gov -- HTTP 503 Service Unavailable,
    unreachable.
13. "Las Vegas Nevada independent title company escrow fee schedule PDF '$'
    closing fee published" search -- surfaced Equity Title Company of Nevada
    and generic aggregator content, no additional static schedules found.
14. Direct fetch + PDF-recovery of the WFG NV 2013 underwriting bulletin --
    confirmed it is a superseded notice announcing a rate manual revision,
    containing no actual rate figures -- not usable as evidence.
15. "WFG Nevada rate manual OR rate and rule title insurance premiums
    filetype:pdf site:wfgunderwriting.com nevada" search -- no current NV
    rate manual PDF link surfaced (only other states' manuals and the same
    2013 NV bulletin).
16. "wfgunderwriting.com filebase nevada rate-manuals OR rates PDF" search --
    confirmed no Nevada-specific rate-manuals/rates directory path is
    publicly indexed for WFG, unlike most other states surveyed.
17. Direct fetch of equitynv.com/rates.asp (Equity Title Company of Nevada)
    -- no static dollar figures; page hosts only an interactive rate
    calculator.
18. "site:docs.nv.gov doi title_rates documents" search -- confirmed only
    the First American Title Rate Manual and Escrow Rate Manual (both
    document #000251) are indexed at this DOI path; no other insurer's
    filing found.
19. "Nevada Division of Insurance title rates Old Republic OR Chicago Title
    OR Fidelity National rate manual PDF filed" search -- confirmed all
    three route to interactive rate calculators, no static NV-specific rate
    manual PDF found for any of them.

With only 2 providers verified despite this exhaustive search, NV meets the
contract's scarce criterion on provider count, notwithstanding the unusually
high evidentiary quality of the First American escrow schedule.

## Calculator harvest addendum (2026-08-06) — FNF national rate calculator

**2 of 3 calculator-basis providers** (prior: 1 (Old Republic — ortconline.com, Las Vegas/Clark County)). See NV.json's newest
`basis: "calculator"` entry for full itemized figures and methodology.

- **national FNF-family shared rate calculator** (`ratecalculator.fnf.com`) —
  WORKING. Clark County (state param confirmed supported in the tool's own county dropdown).
  Driven via plain HTTP POST (Python `requests.Session()`, not WebFetch) replaying the classic
  `__doPostBack`/`__VIEWSTATE` ASP.NET WebForms flow already documented in this project's
  CALCULATORS.md and previously used for CT/CO/AR: select county + underwriter + Next → select
  "Property Purchase" transaction type (own postback) → enter Purchase Amount $500,000 and Loan
  Amount $400,000 together (own postback on the loan field, reveals any further conditional
  questions) → auto-answer any newly-revealed required Yes/No question with its first listed
  option → click Finish for the Rate Summary. Result at $500,000/Clark County: **Grand Total
  $2,211.00**. No Loan Policy premium appeared anywhere in the flow despite the $400,000 loan
  amount entered (same behavior already documented for this tool's NV/AR entries) — recorded as-is.
  Premium-only output is valid calculator-harvest evidence per the 2026-08-05 CT-session scoping
  correction. Same Clark County used as Old Republic's existing entry.

## Calculator harvest addendum 2 (2026-08-06) — Western Nevada Title Company crosses NV to threshold

**3 of 3 calculator-basis providers — crosses the 3-provider calculator-quoted threshold.** See
NV.json's newest `basis: "calculator"` entry for full itemized figures.

- **Western Nevada Title Company** (Reno-area independent title agency) — WORKING, a genuinely
  first-party independent NV provider (not a shared big-four brand). Found via web search for
  NetSheetCalc/TitleTap Nevada tenants (`app.netsheetcalc.com`, `app_id=435`). Driven via the
  platform's plain unauthenticated JSON GETs, no browser, no personal data: `getAppData`/
  `getNetSheetConfig` for the tenant's fee-form schema (hardcoded flat ancillary fees plus
  formula-driven fields referencing rate-lookup keys), then `api/index.php/rate/<amount>/<rate-key>`
  (root host, not `/company/`-prefixed) for each live-rated field. Result at $500,000 price/
  $400,000 loan: Settlement Agent Fee $1,570.00 total ($785.00/side), Owner's Title Insurance
  Premium $2,144.00, Lender's Title Insurance Premium $940.00, Transfer Tax $2,050.00 total
  ($1,025.00/side), plus 7 flat ancillary fees (loan-tie-in, wire, courier, doc prep, lender
  endorsements, deed recording, deed-of-trust recording, e-filing) — the richest single-source
  itemized breakdown found for NV to date. Statewide pricing, no county tiering in this tenant's
  config.

This makes NV the 2nd state (after MA) to cross the calculator-quoted threshold in this session's
2026-08-06 pass.

## Calculator harvest addendum 3 (2026-08-11) — WFG National Title adds a 4th provider, richest itemization on file

**4th calculator-basis provider (richness pass; already past the 3-provider threshold).** Applied
the 2026-08-08 session's fully-solved WFG `rates.wfgnationaltitle.com` recipe (see CALCULATORS.md)
to Nevada — one of only 7 states (WA, CA, TX, OR, AZ, NV, CO) this tool has configured HUD-fee
itemization for, but which had no WFG entry on file yet (not part of the original 8-state batch).
Plain unauthenticated `POST /api/rates/fees/estimatefeesforsellernet`, no personal data, standard
$500,000/$400,000 scenario, Clark County (Las Vegas). Result: Owner's Title Insurance Premium
$2,059.00, County of Nevada Estimated Recording Fees (Transfer Tax) $2,550.00 (seller-paid),
Settlement or Closing Fee $1,580.00 (split $790.00/$790.00 buyer/seller). Lender's premium returned
$0 despite the $400,000 loan entered, consistent with this being a seller-net-sheet-only tool (same
behavior already documented for WFG's OR entry). See NV.json's newest `basis: "calculator"` entry
for the full record.
