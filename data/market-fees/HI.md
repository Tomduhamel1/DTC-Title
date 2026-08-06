# Hawaii — Market Fee Evidence

## Status: complete (scarce market) — 4 verified sources (3 genuine escrow-fee schedules + 1 timeshare-specific) + 1 calculator-basis provider (not yet at the 3-provider calculator threshold), 2026-07-23

## Calculator harvest (2026-07-23)
Old Republic Title's public **Estimated Rate/Fee Calculator**
(https://www.ortconline.com/Web2/productsservices/informationservices/ratefeecalc/default.aspx) was
driven directly via HTTP GET/POST (ASP.NET WebForms postback replication, no browser/JS execution)
for the standard $500,000 purchase/$400,000 loan scenario, **Honolulu, HI (Honolulu County/Oahu, HI's
most populous county)** — selecting City=Honolulu auto-populated the EscrowCountyComboList to
"Honolulu", no zip disambiguation needed (unlike MO's multi-county Kansas City). Result: Lender's
Title Policy $1,735.00, Settlement Agent Fee $1,126.18 (of $2,252.36 total, buyer half), Lien Check
Fee $52.36, Financing Statement Fee $52.36, Recording Fees $82.00, Owner's Title Policy $380.00
(buyer share of $836.00 total). Section totals: C (shop-for) $2,965.90, E (gov't fees) $82.00, H
(other) $380.00. This is the first Old Republic-specific HI calculator figure in this survey (the 3
genuine escrow schedules already on file are Title Guaranty and First American published rate
cards plus Old Republic's own separately-filed manual) and serves as an independent cross-check
against those published schedules. Full entry recorded in HI.json with `"basis": "calculator"`. No
personal information was entered (Name/Company fields are optional and were left blank). This is 1
calculator provider; the task's 3-provider threshold was not reached this session (see
CALCULATORS.md).

Hawaii is unusual among "scarce" states in this survey: this session found **genuine, dollar-
denominated escrow/settlement fee schedules** (not just title-premium-only manuals) from **3
providers**, plus a 4th narrower timeshare-resale-specific document. Verified: Title Guaranty of
Hawaii (escrow fee schedule effective January 2026, tiered by sales price, richly itemized with
refinance/FIRPTA/exchange special fees; plus a companion title premium schedule effective February
2022 with an explicit 60% seller / 40% buyer split); First American Title Hawaii (2013, the only
source found to publish premium AND escrow fee side-by-side across a full 50+-row price-tier table);
and Old Republic Title & Escrow of Hawaii (2020, timeshare-interval resale only, narrower transaction
type). **8 distinct query strategies plus 6 direct provider-site checks** found these 4 usable
documents from 3 distinct provider companies — below the 6-source saturation floor. Marked
**complete (scarce)**, though the evidence quality here is notably higher than most other scarce
states in this survey.

## All-in service-stack range observed

Two directly comparable, price-tiered escrow-fee schedules exist:
- **Title Guaranty (2026)**: $1,166 (at $100,000 sales price) to $6,790 (at $3,000,000, the top of
  its published table).
- **First American (2013)**: $610 (at $100,000 insurance amount) to $6,655 (at $5,000,000, the top
  of its published table).

At matching tiers, Title Guaranty's current (2026) escrow fee is markedly higher than First
American's 2013 figure — roughly **90% higher at the $100,000 tier** ($1,166 vs. $610) narrowing to
about **22% higher at the $1,000,000 tier** ($3,031 vs. $2,485). Some of this gap reflects 13 years of
inflation between the two documents' effective dates, but the gap is large enough at the low end that
it likely also reflects a genuine market difference between providers (Title Guaranty, as Hawaii's
largest and longest-established escrow company, appears to price at a premium versus First American's
branch-network model). Combining both gives an **observed all-in escrow-fee range of roughly
$610-$6,790** across the full price spectrum both schedules cover — with only 2 comparable schedules,
this is too thin to test for saturation, but the two independently corroborate that Hawaii escrow fees
scale steeply and continuously with transaction price rather than using a small number of flat tiers,
unlike the flat-fee models seen in some other states (e.g. CT's Connecticut Title & Escrow, DC's
Federal Title & Escrow).

## Itemization / bundling patterns

- **Hawaii's title-premium 60%/40% seller/buyer split** is published directly on both Title Guaranty's
  and First American's rate cards as a standard convention — the most explicit statutory-adjacent
  customary-split disclosure found in any state surveyed to date (most other states leave this to
  contract negotiation with no rate-card guidance). Escrow fees, by contrast, split 50/50 in both
  companies' schedules — title premium and escrow fee use *different* customary splits at the same
  companies, a notable structural detail.
  the same
- **Title Guaranty's** escrow fee schedule is explicitly NOT a premium-only exclusion-language
  document like most other states' underwriter manuals — it is a true, itemized settlement/escrow fee
  schedule, the primary reason HI's evidence quality exceeds most other "scarce" states despite having
  only 3-4 total sources.
- **First American's** 2013 sheet is the only source in this entire survey found to publish title
  premium and escrow fee as parallel, synchronized columns in the same price-tier table — allowing a
  direct same-company premium-to-escrow-fee ratio calculation impossible with any other state's
  evidence (e.g. at $1,000,000: premium $3,308 vs. escrow $2,485, roughly a 57%/43% split of the
  combined title+escrow cost).
- **Old Republic's** document, while genuine and dollar-denominated, covers a narrow timeshare-resale
  transaction type (not standard fee-simple purchase/sale) and is therefore not directly comparable to
  the other two providers' figures — included as evidence per the evidence rules but excluded from the
  range calculation above.
- Both Title Guaranty and First American independently confirm Hawaii's title insurance premium
  credits (discounts of 25-50% for a property re-insured within a recent window) and military-service
  discounts, though the specific percentages differ slightly (TG: flat 30% military credit; First
  American: 25% U.S. Armed Forces rate as one of five stackable-adjacent special rates).

## Not used / found-but-blocked

- **hawaii.fntic.com/customers/service-detail-pages/closing-escrow** (Fidelity National Title Hawaii)
  — fetched successfully; describes the escrow process and lists fee *categories* ("title insurance
  policy premium, escrow settlement fee, transfer taxes, recordation fees") but publishes no dollar
  amounts; only a holiday-schedule PDF was linked in Resources, not a fee schedule.
- **www.tghawaii.com/wp-content/uploads/Fee-Schedule-Online-2024.pdf** — URL returned an HTML page
  rather than the PDF content (likely superseded/redirected by the 2026 schedule already verified
  above); not independently usable as a distinct second Title Guaranty vintage.
- Searches for other named independent HI title/escrow companies (Community Title, Title Security,
  Origin Title) returned no company-specific fee-schedule pages.
- General market-commentary sources (Houzeo, ListWithClever, AnytimeEstimate, ConsumerAffairs, Rocket
  Mortgage, iBuyer, Hawaii Life, KE Team Compass, Kauai Dreams) were excluded as non-primary sources
  per the evidence rules.

## Search log (8 distinct query strategies + direct provider-site checks)

1. "Hawaii title insurance rate manual settlement fee schedule pdf"
2. "Hawaii title insurance premium Stewart OR \"First American\" OR \"Old Republic\" OR \"Title Guaranty\" manual rates pdf"
3. "Hawaii independent title escrow company fee schedule pdf Old Republic OR \"Title Security\" OR \"Community Title\" OR \"Origin Title\""
4. "Hawaii escrow fee schedule title company Maui OR \"Big Island\" OR Kauai pdf"
5. "First American Title Hawaii escrow fee schedule pdf agency"
6. "Hawaii closing cost real estate attorney flat fee OR escrow \"settlement fee\" pricing page 2025 OR 2026"
7. "Hawaii title escrow company \"Community Title\" OR \"Title Security\" OR \"Fidelity National\" fee schedule pdf"
8. "Hawaii independent escrow company rate sheet pdf oahure.com OR mauihillsales.com"

Plus direct provider-site fetches: Title Guaranty escrow-fee and title-premium PDFs (via WebFetch +
Read-tool binary-PDF recovery, same technique used throughout this survey), Old Republic timeshare
resale PDF, First American Hawaii rate sheet PDF, hawaii.fntic.com closing/escrow page (no dollar
figures found), tghawaii.com alternate fee-schedule URL (returned HTML, not the PDF).

## Calculator harvest addendum (2026-08-06) — FNF national rate calculator

**2 of 3 calculator-basis providers** (prior: 1 (Old Republic — ortconline.com, Honolulu/Honolulu County-Oahu)). See HI.json's newest
`basis: "calculator"` entry for full itemized figures and methodology.

- **national FNF-family shared rate calculator** (`ratecalculator.fnf.com`) —
  WORKING. Honolulu County (state param confirmed supported in the tool's own county dropdown).
  Driven via plain HTTP POST (Python `requests.Session()`, not WebFetch) replaying the classic
  `__doPostBack`/`__VIEWSTATE` ASP.NET WebForms flow already documented in this project's
  CALCULATORS.md and previously used for CT/CO/AR: select county + underwriter + Next → select
  "Property Purchase" transaction type (own postback) → enter Purchase Amount $500,000 and Loan
  Amount $400,000 together (own postback on the loan field, reveals any further conditional
  questions) → auto-answer any newly-revealed required Yes/No question with its first listed
  option → click Finish for the Rate Summary. Result at $500,000/Honolulu County: **Grand Total
  $2,384.80 (Premium $2,168.00 + Additional Coverage Surcharge $216.80)**. No Loan Policy premium appeared anywhere in the flow despite the $400,000 loan
  amount entered (same behavior already documented for this tool's NV/AR entries) — recorded as-is.
  Premium-only output is valid calculator-harvest evidence per the 2026-08-05 CT-session scoping
  correction. Same Honolulu County used as Old Republic's existing entry.
