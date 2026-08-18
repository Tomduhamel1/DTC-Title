# South Dakota — Market Fee Evidence

## Calculator harvest (2026-08-15 through 2026-08-18)

Separate from the published-schedule survey below, 2 calculator-basis quotes have been harvested for
the standard scenario ($500,000 purchase / $400,000 loan / Minnehaha County-Sioux Falls /
residential resale) — still below the 3-provider calculator-quoted threshold. See SD.json's
`"basis": "calculator"` entries for full itemized figures and CALCULATORS.md for the technical
recipes.

1. **Stewart Title Guaranty Company** — Stewart Rate Calculator (stewartratecalculator.com), matched
   to Stewart Title Company's own Sioux Falls office. The richest single-office Stewart harvest of
   this session's multi-state batch: Title Closing Fee $400.00, Title Examination Fee $300.00, Title
   Certif I D $15.00, Owner's Premium $1,325.00, Lender's Premium $837.50 (simultaneous), recording
   fees, and a $500.00 deed/transfer tax (100% seller-paid). **New structural finding**: South Dakota
   applies its 6.2% state sales tax to itemized title-service fees ($24.80 on the Closing Fee, $18.60
   on the Examination Fee) — the first instance of sales tax on title-service fees found anywhere in
   this survey.
2. **WFG National Title Insurance Company** — Seller Net Sheet Rate Calculator
   (rates.wfgnationaltitle.com), via the publicly-reachable no-auth JSON API solved and documented
   in CALCULATORS.md's 2026-08-08 entry. Confirmed SD `isCalculationEnabled: true` via
   `GetCalculationEnabledStates` and harvested directly (Minnehaha County/Sioux Falls). Premium-only
   result: Owner's Title Insurance Premium **$2,000.00** (SD is not one of the 7 states with
   configured HUD-fee itemization in this tool). SD now needs 1 more provider to cross threshold.

**2nd/3rd-provider search (dead ends this session)**: Old Republic's 2nd tool (`Location=SD`) NoBot-
blocked, consistent with ME/RI/DE this session. Black Hills Title, Inc. (an existing SD provider in
the published-schedule survey) has a `/calculator/` page but no discoverable embedded
form/iframe/API in the static HTML — likely jsOnly or currently broken; flagged for a browser-driven
session. Its site does link a freshly-dated `SD-RATE-CHART-effective-2026.pdf` (uploaded 2026-08) —
noted here for a future published-schedule freshness pass, not pursued as calculator evidence this
session. Pennington Title and Titles of Dakota not checked for calculators this session (time
budget).

## Status: complete (scarce market) — 5 verified sources, 2026-07-22

South Dakota is a filed-rate (insurer-filed, not state-promulgated) title insurance
market: SDCL Title 58 Chapter 25 requires title insurers to file premium rate schedules
with the Division of Insurance, but escrow/settlement/closing charges are not
statutorily filing-mandated the way premiums are (South Dakota has no equivalent to
Alaska's AS 21.66.460 or Idaho's IDAPA 18.05.01.022 splitting out a mandatory escrow-fee
filing). This session found **5 verified sources**: two national-brand premium-only
manuals (Stewart Title Guaranty, WFG National), and — more valuably — **three
independent title companies that publish genuine dollar-denominated fee schedules**
covering different parts of the state: Pennington Title (Rapid City/Black Hills, a
detailed itemized settlement-fee schedule), Titles of Dakota (Aberdeen and a wide swath
of rural north-central/south-central counties, uniquely publishing closing fees +
search/exam fees + its own filed title premium table together), and Black Hills Title
(the four northern Black Hills counties, premium-only). Despite well over 25 distinct
query strategies and roughly 30 direct provider-site checks — far exceeding the
contract's 8-strategy/major-provider threshold — only 5 sources with actual, verifiable
dollar figures were found. South Dakota's independent, county-based abstract/title
company structure (many companies serve only 1-4 counties as the licensed countersigning
title-plant holder under SDCL 58-6-64) produces dozens of small local providers, the
overwhelming majority of which have no published pricing at all (quote-only or
rate-calculator-only websites). Marked **complete (scarce)** — below the 6-source
saturation floor despite an exhaustive search.

## All-in service-stack range observed

South Dakota's evidence splits cleanly into two categories that generally don't overlap
in the same document (only Titles of Dakota published both):

**Genuine settlement/closing-service fees (excluding title premium):**
- **Pennington Title (Rapid City):** $639.00 for a financed 1-4 family residential
  purchase (CDF required), $532.50 for a residential cash purchase, $426.00 for a
  lot-only cash purchase — these appear to be all-in package prices inclusive of sales
  tax. Add-on items: doc prep $80.00, wire (in/out) $35.00, overnight delivery $35.00,
  recording $30.00/document, residential title search $159.75 (billed relationship to
  the main package fee is not fully clear from the source), endorsements $25-$50.
  A fully-loaded financed purchase with one wire and one recorded document totals
  roughly **$704** before the title search line and before title insurance premium.
- **Titles of Dakota (Aberdeen/rural counties):** closing fee alone is $450 + tax
  (financed purchase) or $350 + tax (cash sale/refinance/permanent financing), explicitly
  described as "all inclusive — no additional fees ... for downloading documents or wire
  service." Adding the mandatory search/exam fee (tiered $350-$1,000+ tax by price range)
  brings a typical $100,000-$500,000 financed purchase to roughly **$800-$1,350 + tax**
  before title insurance premium.

Combined, the observed settlement/closing-service-fee range across the two verified
metro/regional markets is approximately **$700-$1,350** (plus sales tax) for a standard
residential purchase-with-financing transaction, excluding the title insurance premium
itself. Refinance transactions run modestly lower ($350-$639 range depending on
provider/scope).

**Title insurance premium (filed-rate, three independently-filed schedules found):**
at $200,000 of coverage, Stewart/WFG's statewide owner's-policy premium is **$620-$625**,
Titles of Dakota's own filed owner's rate is **$640** (metro-adjacent structure), and
Black Hills Title's owner's rate for the four northern Black Hills counties is **$920** —
a striking ~35-48% spread between the national-brand underwriters' filed rates and two
different independent county title companies' own filed rates at the identical coverage
amount, confirming that "filed rate" in South Dakota does not mean uniform rate.

## Itemization / bundling patterns

- **National-brand underwriters (Stewart, WFG) publish premium-only manuals** that
  explicitly and affirmatively exclude settlement/escrow/closing charges — WFG's SD
  manual states this in its very first paragraph ("does not include charges for title
  search, surveys, escrow, closing services, settlement services, recording fees...").
  Neither manual itemizes a CPL (Closing Protection Letter) fee, which is unusual — most
  other states' Stewart/WFG manuals reviewed in this survey do list a standalone CPL
  charge (commonly $25-$50).
- **Stewart's manual is uniquely two-tier by county group** — Minnehaha, Lincoln & Yankton
  counties (the Sioux Falls/Yankton metro corridor) get one rate table, and all other SD
  counties get a second, generally cheaper-at-the-margin table (e.g., simultaneous-issue
  surcharge is $75 in the metro tier vs. $50 elsewhere). WFG's SD manual, by contrast, has
  no metro/county split at all — a single statewide table matching Stewart's non-metro
  numbers almost exactly.
- **Independent title/abstract companies are the only source of genuine settlement-fee
  data**, and even among them coverage is sparse: of roughly 15+ SD independent title
  companies identified via the South Dakota Land Title Association directory and direct
  search, only 3 (Pennington Title, Titles of Dakota, Black Hills Title) had any
  fetchable dollar figures; the rest (Brown County Title, Codington County Title,
  SoDak Title, Grant County Title, Brule County Abstract, Heartland Title, Southern Hills
  Title, Eastern Title, Yankton Title/First Dakota Title) all route to quote-only pages
  or interactive rate calculators with no static published numbers.
- **Titles of Dakota's structure is the most transparent found this session**: a
  genuinely three-part fee stack (closing fee + search/exam fee + title premium), each
  separately dated and tabulated, plus a distinct "countersignature" fee schedule for
  when it acts as the licensed county title-plant holder on behalf of another company's
  policy (SDCL 58-6-64's countersignature-requirement structure, mirrored in ND/other
  plant-monopoly states) versus its own direct-issue business.
- **Sales tax is explicitly layered onto every independent-company fee found** (both
  Pennington Title's and Titles of Dakota's schedules state fees are "+ tax" or
  "include applicable sales tax") — confirming South Dakota's statutory treatment of
  escrow/settlement charges as taxable services (SDCL, per the SD DOR's "Real Estate"
  guidance located during this session), distinct from title insurance premium itself
  which is not separately taxed the same way.

## Metro / regional differences

Coverage spans 3 distinct SD regions with published pricing:
- **Sioux Falls/Yankton metro (Minnehaha, Lincoln, Yankton counties):** covered only by
  Stewart's metro-tier premium table; no independent-company settlement-fee schedule was
  found for this specific corridor despite extensive search (Eastern Title, Yankton
  Title/Stewart-hybrid, and First Dakota Title of Yankton all lack published pricing).
- **Rapid City/Pennington County (southern Black Hills):** Pennington Title's detailed
  settlement-fee schedule is the richest single source found this session.
- **Northern Black Hills (Lawrence/Meade/Butte/Harding counties):** Black Hills Title's
  premium-only rate table.
- **Aberdeen and rural north-central/south-central SD (16 counties):** Titles of Dakota's
  three-part fee stack, the broadest single-provider geographic footprint found.

No published pricing was found for the Rapid City area's own title premium (SoDak Title,
also Rapid City/Spearfish, links only to an interactive rate calculator), so the $920
Black Hills Title premium figure above is from the *northern* Black Hills counties, not
Rapid City/Pennington County itself.

## Premium rate card (filed-rate state)

South Dakota is confirmed insurer-filed for title premiums under SDCL Title 58, Chapter
25, with a Division of Insurance SERFF public filing-search portal
(filingaccess.serff.com/sfa/home/sd, also linked as serff-sfa.naic.org/serff/sfa/home/sd)
— but this session's fetch attempts against both URLs returned HTTP 403 Forbidden,
matching the same interactive-search-interface-not-a-static-document-listing pattern
found in prior sessions for other states (e.g., Rhode Island's SERFF portal). No
premium-search shortcut was available; all three verified premium schedules (Stewart,
WFG, Black Hills Title) plus Titles of Dakota's own filed table were located and fetched
directly from each provider's own website. See SD.json for the full per-provider tables;
key reference points at $100,000 of owner's-policy liability: Stewart/WFG (statewide,
non-metro tier) ≈ $400, Titles of Dakota (Aberdeen area) = $400, Black Hills Title
(northern Black Hills) = $604 — nearly a 51% spread at identical coverage between the
cheapest and most expensive filed rate found.

## Not used / found-but-blocked

- **South Dakota Division of Insurance SERFF Filing Access** (filingaccess.serff.com/sfa/home/sd
  and serff-sfa.naic.org/serff/sfa/home/sd) — both URLs returned HTTP 403 Forbidden on
  direct fetch; an interactive search interface, not a static/crawlable document
  repository (matches the RI SERFF-portal precedent from a prior session).
- **SoDak Title** (sodaktitle.com, Rapid City & Spearfish; First American/Old Republic
  agent) — fetched; only an interactive rate-calculator link, no static PDF or dollar
  figures.
- **Brown County Title Company** (browncotitle.com, Aberdeen) — fetched; rate-calculator
  link only (browncotitle.titlecapture.com), no published figures.
- **Codington County Title** (cctitles.com, Watertown) — fetched (home + services pages);
  no published figures, quote-only.
- **Eastern Title** (easterntitle.com, Sioux Falls) — fetched; no published figures.
- **Stewart's Sioux Falls, Yankton Title, and South Dakota agent tools-and-resources
  pages** — all fetched; each links only to the interactive Stewart Rate Calculator
  (stewartratecalculator.com), no static SD-specific PDF beyond the main manual already
  captured.
- **First American Title South Dakota** (agency.firstam.com/sd, local.firstam.com/sd/documents,
  firstam.com/title/agency/sd) — all fetched; no linked rate schedule, only interactive
  calculators (First American Comprehensive Calculator, Title Fee Calculator).
- **Old Republic Title South Dakota** (oldrepublictitle.com/south-dakota) — fetched; no
  linked rate schedule, calculator-only reference.
- **Chicago Title / Fidelity National Title South Dakota** — no SD-specific rate manual
  located via direct search of fntic.com, cltic.com, fnf.com, or the CTIC National
  Commercial Services "Real Estate Laws & Customs" South Dakota page (media.ctic.com,
  fetched — confirms SD coverage but contains zero dollar figures, only "who pays what"
  customs).
- **Grant County Title Co.** (gctitlesd.com, Milbank) — fetched (services page); no
  published figures.
- **Brule County Abstract** (brulecountyabstract.com, Chamberlain) — fetched; no
  published figures.
- **Southern Hills Title** (southernhillstitle.com, Custer/Hot Springs — sole licensed
  title plant for Custer, Fall River & Oglala Lakota Counties) — fetched (home, about,
  downloadable-forms pages); downloadable-forms page contains only non-pricing
  affidavit/certificate templates, no rate schedule.
- **Heartland Title Companies of South Dakota** (heartlandtitlesd.com; serves Hand,
  Faulk, Edmunds & McCook Counties) — fetched (title-policies 503'd on first attempt,
  succeeded on retry; closing-and-escrow-services page fetched); no published figures on
  either page.
- **Land Title Guaranty** (landtitleweb.com) — domain has been repurposed/redirects
  (301) to an unrelated site (nepsecure.co.uk); dead lead.
- **Centric Title & Escrow** — a "South Dakota"-adjacent-sounding escrow-fee PDF surfaced
  in search but the company is confirmed New Mexico-based (Albuquerque/Rio Rancho), not
  South Dakota; excluded as out-of-scope.

## Search log (27+ distinct query strategies + ~30 direct provider-site checks)

1. "South Dakota title insurance rate manual settlement fee schedule PDF"
2. "South Dakota title company closing fee escrow fee schedule Sioux Falls"
3. "Stewart Title South Dakota rate manual pdf stewart.com"
4. "WFG National South Dakota rate manual pdf wfgunderwriting.com"
5. "South Dakota Division of Insurance title insurance filed rates escrow settlement charges"
6. "\"Pennington Title\" Rapid City closing fees document preparation charges pdf"
7. "South Dakota independent title company escrow closing fee schedule Aberdeen OR Watertown OR \"Rapid City\""
8. "First American Title South Dakota rate schedule pdf"
9. "Old Republic Title South Dakota rate manual pdf"
10. "\"Codington County Title\" Watertown SD rates fees pdf"
11. "South Dakota title company Sioux Falls closing fee schedule pdf \"Minnehaha\""
12. "Yankton OR Brookings OR Vermillion South Dakota title company escrow fees rates"
13. "South Dakota Land Title Association member directory title companies"
14. "\"title company\" South Dakota \"closing fee\" OR \"settlement fee\" schedule pdf -Rapid -Aberdeen"
15. "\"Black Hills Title\" OR \"Southern Hills Title\" South Dakota rates fees schedule pdf"
16. "\"Heartland Title\" South Dakota rates fees pdf"
17. "South Dakota \"countersignature\" filed rate title insurance"
18. "\"Hughes County Abstract\" OR \"McPherson County Abstract\" OR \"Grant County Title\" South Dakota rates pdf"
19. "South Dakota title company \"rate sheet\" OR \"fee schedule\" filetype:pdf"
20. "\"Eastern Title\" Sioux Falls South Dakota rates fees pdf"
21. "\"First Dakota Title\" Yankton South Dakota rates fees pdf"
22. "Chicago Title South Dakota rate manual pdf"
23. "\"Chicago Title\" OR \"Fidelity National Title\" South Dakota rate manual site:fntic.com OR site:cltic.com OR site:fnf.com"
24. "\"Grant County Title\" Milbank South Dakota website rates"
25. "\"Hand County Title Company\" South Dakota website"
26. "South Dakota title insurance company escrow fee \"per document\" OR \"flat fee\" pdf 2024 OR 2025"
27. "South Dakota Division of Insurance SERFF title insurance filed rates search company"
28. "First American Title \"South Dakota\" rate calculator document center"
29. "Centric Title company location state" (verification query, confirmed out-of-state/out-of-scope)

Plus direct provider-site fetches (~30 total): Stewart Title (SD manual PDF via
go.stewart.com, Sioux Falls market page, SD agent tools-and-resources page), WFG (SD
landing page, SD rate manual PDF), Pennington Title (FAQs, title-rates page,
escrow-closings page, Service Fees PDF via Read-tool binary-PDF recovery), Titles of
Dakota (locations page, rates page, 3 PDFs: Closing Fees, Search/Exam Fees, Title Policy
Rates 2026, all via Read-tool binary-PDF recovery), Black Hills Title (rates PDF via
Read-tool recovery), Southern Hills Title (home, about, downloadable-forms), Brown
County Title, Codington County Title (home, services), SoDak Title, Eastern Title, First
American (agency SD page, local.firstam.com/sd/documents), Old Republic (SD page),
Yankton Title (Stewart hybrid site), Grant County Title, Brule County Abstract,
Heartland Title (title-policies, closing-and-escrow-services), Land Title Guaranty
(404/redirect), SD DOI SERFF portal (403, both URL forms), SD DOR Title and Abstract
Companies directory PDF, CTIC NCS Laws & Customs SD flipbook page. Binary-PDF recovery
via the Read tool on WebFetch-saved files was used throughout (same technique as prior
CA/GA/NC/WA/MI/AL/AK sessions) — WebFetch itself cannot parse compressed FlateDecode PDF
streams, but the Read tool successfully extracted full text/tables from every PDF this
technique was applied to in this session.
