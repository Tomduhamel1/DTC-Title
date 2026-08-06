# Oregon (OR) — Market Fee Evidence

## Status: COMPLETE (scarce market) — 3 documents / 2 providers verified + 1 calculator-basis provider (not yet at the 3-provider calculator threshold), 2026-07-23

## Calculator harvest (2026-07-23)
Old Republic Title's public **Estimated Rate/Fee Calculator**
(https://www.ortconline.com/Web2/productsservices/informationservices/ratefeecalc/default.aspx) was
driven directly via HTTP GET/POST (ASP.NET WebForms postback replication, no browser/JS execution)
for the standard $500,000 purchase/$400,000 loan scenario, **Portland, OR 97201 (Multnomah County,
OR's most populous county)**. Unlike HI/MO, OR's flow required an explicit `PropertyCountyList`
postback (selecting "Multnomah") after the zip selection — this control renders empty-by-default
here rather than auto-populating from the city choice. Also: OR's form does not render a
`LienPayoffTextbox` control at this stage; posting a value for it anyway (copying the HI/MO recipe
verbatim) produced a hard HTTP 500, the same "posting a field for a control not in the DOM breaks
the postback" gotcha CALCULATORS.md already documented for the `ReoList` radio — omitting it fixed
submission. Result: Lender's Title Policy $1,495.00, Settlement Agent Fee $1,150.00 (of $2,300.00
total, buyer half), Recording Service Fee $10.00, Recording Fees $400.00, Owner's Title Policy
$1,350.00 (shown fully seller-paid by this tool's default OR buyer/seller split). Section totals: C
(shop-for) $2,655.00, E (gov't fees) $400.00. Notably, the tool's own Settlement Agent Fee footnote
quotes Old Republic's actual OR-filed escrow-rate formula verbatim ("$1800.00 plus $1.00 per
$1,000... minimum charge $2,000.00 [if negotiated above $2,000]") — this directly corroborates and
extends this file's existing finding that OAR 836-080-0365 requires escrow rates to be filed with
DFR but confirmed non-public in directory form; the calculator output is itself a legitimate, dated
disclosure of that private filing's content, a higher-quality find than the other Old-Republic-tool
harvests to date. Full entry recorded in OR.json with `"basis": "calculator"`. No personal
information was entered. This is 1 calculator provider; the task's 3-provider threshold was not
reached this session (see CALCULATORS.md).

3 documents verified across 2 providers: the Oregon Title Insurance Rating
Organization (OTIRO) bureau manual at 2 vintages (2025-09-01 and 2017-06-15,
showing an unchanged premium schedule across 8 years) and Cascade Title's
Contract Collections fee schedule (Lane County, a genuine dollar-denominated
publication but for a different product -- land-contract loan servicing,
not standard purchase/refinance closing). Despite 15+ query
strategies/direct provider-site checks, no independent title/escrow company,
closing-attorney firm, or national-brand direct office was found to publish
a static, standard purchase/refinance settlement-fee schedule. Marked
**complete (scarce)**.

## Key market structure finding

Oregon is a rating-bureau-uniform state for title insurance premiums: the
Oregon Title Insurance Rating Organization (OTIRO), operating under ORS
Chapter 737, files a single rating manual with the Oregon Division of
Financial Regulation, and licensed insurers must declare via SERFF filing
(DFR form 440-3605) whether they use OTIRO rates as-is, OTIRO with filed
deviations, or an independent manual with its own actuarial support. In
practice, every underwriter checked (Stewart, WFG) issues its own bulletin
simply adopting each new OTIRO manual revision rather than filing distinct
rates -- the same bureau-uniform pattern found in NC (NCTIRB), OH (OTIRB),
and LA (LATISSO), making Oregon a fourth rating-bureau state uncovered by
this survey, on top of the three tier-3 promulgated/rating-bureau states
originally scoped (PA/NY/NJ/OH/DE grouping did not include OR, NC, or LA,
all three of which were separately discovered mid-session to be
bureau-uniform).

Separately and importantly, Oregon Administrative Rule 836-080-0365
("Filing Escrow Rates Required") mandates that "a title company shall file
with the Director in writing each rate to be charged for escrow services
and the effective date of such rate before the date the title company uses
such rate" -- a private-filing regime for settlement/escrow fees analogous
to Idaho (IDAPA 18.05.01.022) and Kansas (K.S.A. 40-1111). However, unlike
ID/KS (which publish a compiled public directory of filed rates) or Alaska
(AS 21.66.460, similar filing but discoverable via individual company
disclosure), Oregon's DFR "Escrow rate filings" page
(dfr.oregon.gov/rates-forms/misc/pages/escrow-rate-filing.aspx) confirms
filings are submitted by email to two named DFR staff with **no public
directory, searchable database, or bulk listing** of filed escrow rate
schedules -- matching Colorado's "filed privately, not published" pattern
rather than Idaho/Kansas's public-repository pattern. This appears to be
the structural reason so few Oregon providers publish static settlement-fee
schedules: the fee is filed as a regulatory formality but not made public,
removing any competitive-transparency incentive to post it.

## Verified sources

1. **Oregon Title Insurance Rating Organization (OTIRO)** — Oregon Rating
   Manual, effective September 1, 2025 (via oregonlandtitle.com, the Oregon
   Land Title Association's hosted copy; recovered via PDF binary-read
   technique, 396 pages). Schedule One Basic Insurance Rate: $200 up to
   $25,000 insured, scaling to $49,350 + $0.75/$1,000 above $40,000,000.
2. **Oregon Title Insurance Rating Organization (OTIRO)** — Oregon Rating
   Manual, effective June 15, 2017 (via virtualunderwriter.com's archived
   copy; recovered via PDF binary-read technique, 323 pages). Schedule One
   figures are byte-for-byte identical to the 2025 vintage -- Oregon's
   bureau-set title premium has not moved in at least 8 years.
3. **Cascade Title / Cascade Escrow** (Lane County) — Contract Collections
   Fee Schedule (direct HTML fetch). Genuine dollar-denominated schedule
   ($35 + $2/thousand setup fee, $150 assignment/modification fees, tiered
   disbursement fees) but prices land-sale-contract loan servicing, not a
   standard purchase/refinance settlement fee -- recorded as evidence,
   excluded from range calculation.

## Observed service-stack range

**No comparable range can be established.** Only one genuine
dollar-denominated Oregon-specific service-fee document was found (Cascade
Title's Contract Collections schedule), and it prices an unrelated product
(land-contract servicing, not closing/settlement). No standard
purchase-transaction settlement/escrow fee dollar figure was independently
verified for any Oregon provider in this survey, despite market
commentary (aggregator blogs, excluded per evidence rules) repeatedly
citing an informal "$1 per $1,000 + $1,200, split 50/50" rule of thumb that
could not be traced to any single provider's own published schedule.

## Itemization / bundling patterns

- OTIRO's manual explicitly and structurally separates title insurance
  premium (its entire scope) from closing/settlement/escrow services (Section
  7 of the Commitment conditions: "the issuing agent is not the Company's
  agent for closing, settlement, escrow, or any other purpose").
- No CPL (Closing Protection Letter) fee is mentioned anywhere in either
  OTIRO manual vintage checked -- a coverage gap for this data point in
  Oregon, unlike most other states surveyed where at least one underwriter
  prices a CPL.
- Cascade Title's contract-collection fee ladder (setup, assignment,
  modification, tiered disbursement-frequency fees) is the only genuinely
  itemized Oregon-specific service-fee structure found, though for a
  non-standard product.

## Premium rate cards

See Verified sources #1-2 above (OTIRO Schedule One, both vintages).
Schedule Two (Timeshare Rates) and Schedule Four (Endorsement charges, e.g.
ALTA 45-06 Pari Passu Mortgage $250, ALTA 32.2-06 $1.00/$1,000 of loan
amount minimum $250) were also captured from the current manual.

## Metro differences

None found. OTIRO's Basic Insurance Rate Schedule applies statewide with no
county or metro-area rate tiers (unlike CA/WA/NV's zone-based premium
structures). No independent provider's escrow-fee schedule was verified, so
no metro-level settlement-fee comparison is possible for Oregon.

## Search log (15 combined query strategies + direct provider-site checks)

1. "Oregon title insurance premium rate regulated filed Oregon Division of
   Financial Regulation" search — confirmed OTIRO's role as Oregon's title
   rating bureau under ORS Chapter 737 and surfaced the DFR filing-checklist
   PDF (form 3605) and oregonlandtitle.com's OTIRO overview page.
2. Direct fetch of oregonlandtitle.com/oregontitleinsurance.php — confirmed
   OTIRO's rate-making role but no dollar figures on the overview page
   itself.
3. "OTIRO Oregon Title Insurance Rating Organization manual PDF rates"
   search — surfaced the current (2025-09-01) OTIRO manual PDF directly at
   oregonlandtitle.com/files/otiroratemanual.pdf, plus 2 AmeriTitle-hosted
   rate cards and a Virtual Underwriter bulletin reference.
4. Direct fetch + PDF-recovery of the 2025-09-01 OTIRO manual (396 pages,
   via pypdf after WebFetch's native PDF parsing failed on the raw binary)
   — **verified** (source #1), including Schedule One's full rate table.
5. Direct fetch of amerititle.com's two OTIRO rate-card PDFs — both
   blocked by a Cloudflare/anti-bot challenge page (sgcaptcha redirect) on
   both direct curl and WebFetch attempts; logged as unusable (matching
   AmeriTitle's earlier CA/WA appearances where it published successfully —
   apparently PDF-specific bot protection on this domain, confirmed by a
   later successful fetch of amerititle.com's HTML toolbox page).
6. Direct fetch of oregon.ltic.com's "Title & Escrow Overview" PDF (Fidelity
   National/Lawyers Title Oregon) via PDF-recovery — genuine document but
   contains only customary buyer/seller payer-allocation language ("Escrow
   fee 50%"), zero dollar figures; excluded per the same precedent as CA's
   Old Republic "Guide to Closing Costs."
7. Direct fetch of ortconline.com's (Old Republic) "Rate/Fee Calculator"
   PDF via PDF-recovery — confirmed to be a promotional flyer for an
   interactive online calculator tool, not a static rate schedule; no
   dollar figures.
8. "Oregon title company escrow fee schedule PDF closing fee Portland OR
   Eugene OR Bend" search — surfaced the LTIC and Old Republic documents
   above, plus general aggregator-blog commentary on customary Oregon
   escrow-fee ranges (excluded per evidence rules — not attributable to a
   specific provider's own publication).
9. "Land Title OR Ticor Title OR Fidelity National Title Oregon rate card
   escrow fee schedule pdf" search plus direct fetch of
   fidelityeugene.com/Title-Escrow-Insurance-Rates (404) and
   fidelityeugene.com homepage (routes to rates.fntg.com interactive
   national calculator only, no static Oregon figures).
10. Direct fetch of dfr.oregon.gov's title-filing-standards checklist PDF
    (form 440-3605) via PDF-recovery — confirmed Oregon's 3-option SERFF
    filing structure (OTIRO as-is / OTIRO with deviations / independent
    manual) but is a filer's compliance checklist, not a rate schedule.
11. "OAR 836-080-0365 Oregon escrow rate filing title insurance" search —
    discovered and confirmed Oregon's mandatory private escrow-rate-filing
    rule, then direct fetch of dfr.oregon.gov's "Escrow rate filings" page
    confirming no public directory of filed rates exists (private email
    submission only) — a key structural finding explaining the market's
    opacity.
12. "Oregon independent title company escrow closing fee schedule
    filetype:pdf" search — surfaced only the same LTIC/Old Republic/
    AmeriTitle documents already found, plus Ticor Title guide PDFs (buyer/
    seller process guides, no fee figures) and a houseloan.com servicing-fee
    document (unrelated loan-servicing fees, not title/escrow).
13. "Direct Title OR Prestige Escrow OR Pacific Cascade Title Oregon escrow
    fee" search — surfaced Cascade Title's dedicated Fee Schedule page
    (**verified** as source #3, though for a non-standard product) and
    Pacific Title Company's Escrow Rates page (dollar figures found, but the
    page explicitly states "Performed by PACIFIC TITLE COMPANY within GRAYS
    HARBOR County" -- Grays Harbor County is in WASHINGTON, not Oregon;
    excluded as wrong-jurisdiction, matching the recurring
    pioneertitlecompany.com-style domain-name-coincidence pattern seen in
    MN/MD/ID/MT sessions).
14. Direct fetch of prestigetande.com's Fee Calculator page — a Virginia/
    Texas-licensed company (703 area code, "Prestige Title of Texas" in its
    own nav menu), not Oregon; page itself says "Coming soon!" with no
    figures regardless. ideal.prestigeescrow.com's calculator tab returned
    an empty JS-rendered shell, no static figures. Both excluded.
15. "WFG National Title Oregon rate manual PDF wfgunderwriting.com OTIRO"
    and a companion "First American Title Oregon rate manual OTIRO
    virtualunderwriter.com pdf" search — both surfaced only bulletins
    announcing adoption of each new OTIRO manual revision (no independent
    dollar figures of their own) and, notably, an archived 2017-06-15 OTIRO
    manual vintage at virtualunderwriter.com.
16. Direct fetch + PDF-recovery of the 2017-06-15 OTIRO manual (323 pages)
    — **verified** (source #2); Schedule One figures found identical to
    the 2025 vintage, an 8-year rate-stability finding.
17. "Ticor Title OR Chicago Title OR First American Title Oregon closing
    cost estimate fee schedule -calculator" search — every national-brand
    direct office confirmed to route exclusively to interactive calculators
    (rates.fntg.com, chicagotitleconnection.com/calculators.htm,
    ortconline.com), no static Oregon-specific fee schedule found from any
    of the four largest underwriters' direct offices.
18. "Umpqua Title OR Guardian Northwest Title OR First Choice Title Oregon
    escrow closing fee" search — Guardian Northwest Title & Escrow confirmed
    to be a Washington company (Bellingham/Anacortes/Mt. Vernon/Oak Harbor),
    not Oregon; excluded as wrong-jurisdiction. Direct fetch of
    firsttitleservices.com's "Oregon Title Closing" page returned HTTP 403
    (matching this same firm's block encountered in an earlier Kentucky
    session).

With only 2 providers (3 documents) verified despite 15+ query strategies
and extensive direct provider-site checks -- and with Oregon's own
escrow-rate-filing regulation (OAR 836-080-0365) confirmed to route filings
to a private, non-public DFR submission process rather than a searchable
directory -- OR meets the contract's scarce criterion. Marked
**complete (scarce)**.

## Calculator harvest addendum (2026-08-06) — FNF national rate calculator

**2 of 3 calculator-basis providers** (prior: 1 (Old Republic — ortconline.com, Portland 97201/Multnomah County)). See OR.json's newest
`basis: "calculator"` entry for full itemized figures and methodology.

- **national FNF-family shared rate calculator** (`ratecalculator.fnf.com`) —
  WORKING. Multnomah County (state param confirmed supported in the tool's own county dropdown).
  Driven via plain HTTP POST (Python `requests.Session()`, not WebFetch) replaying the classic
  `__doPostBack`/`__VIEWSTATE` ASP.NET WebForms flow already documented in this project's
  CALCULATORS.md and previously used for CT/CO/AR: select county + underwriter + Next → select
  "Property Purchase" transaction type (own postback) → enter Purchase Amount $500,000 and Loan
  Amount $400,000 together (own postback on the loan field, reveals any further conditional
  questions) → auto-answer any newly-revealed required Yes/No question with its first listed
  option → click Finish for the Rate Summary. Result at $500,000/Multnomah County: **Grand Total
  $1,350.00**. No Loan Policy premium appeared anywhere in the flow despite the $400,000 loan
  amount entered (same behavior already documented for this tool's NV/AR entries) — recorded as-is.
  Premium-only output is valid calculator-harvest evidence per the 2026-08-05 CT-session scoping
  correction. Same Multnomah County used as Old Republic's existing entry.
