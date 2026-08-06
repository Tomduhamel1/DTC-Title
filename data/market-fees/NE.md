# Nebraska (NE) — Market Fee Evidence

## Status: COMPLETE (scarce market) — 4 verified sources + 1 calculator-basis provider (not yet at the 3-provider calculator threshold), 2026-08-02

## Calculator harvest (2026-08-02) — NE's first calculator-basis provider
Harvested **Nebraska Title Company** (statewide, Omaha/Douglas County scenario) — the same company
whose site (`nebtitleco.com`) the published-schedule survey found and noted "routes to its own 'Rate
Calculator' tool" (item 22 in the search log above) without pursuing it, since that survey is scoped
to static schedules. This session found the actual tool via the newly-discovered Title Midwest
platform (`forms.titlemidwest.com`, tenant slug `nebtitlecoratecalc`) — see CALCULATORS.md and
MN.json's Minnesota Secured Title entry for the platform's full discovery writeup. Unlike the other
Title Midwest tenants (classic-ASP with a server-side `ajax.asp` JSON endpoint), this tenant is a
Vue.js single-page app with all rate-table logic embedded directly, unminified, in the page's own
inline `<script>` — no execution needed, just reading the literal bracket-rate formulas. At $500,000
purchase/$400,000 loan (Expanded coverage, buyer pays both policies, Omaha/Douglas County — NE's most
populous): Owner's Title Insurance Premium $1,632.50, Lender's Title Insurance Premium (simultaneous
issue) $75.00, Endorsements $75.00 (flat), Closing Protection Letter $25.00 (flat), Recording Fees
$150.00 (flat, loan transactions). Notably, the tool's own "Escrow Settlement Fee" field defaults to
$0.00 as a blank user-fillable input rather than a company-preset constant — unlike every other flat
fee in this entry, it is NOT disclosed by the tool itself, so it is not reported as evidence here
(consistent with this state's already-established zero-settlement-fee-disclosure pattern from the
published-schedule survey above). NE now has 1 of the 3 providers needed to cross the calculator-quoted
threshold.

4 premium-only rate manuals/rate sheets verified (FNTI, Stewart, WFG, First
American via an independent Omaha agent), all explicitly excluding
settlement/closing/escrow charges from their filed title insurance rates.
Despite 24 combined query strategies and direct provider-site checks, zero
settlement-fee dollar figures were found from any provider type. This matches
the AZ/CO/MI/MO/VA/AL/AR/WI/IN/KY/ME/MS market-opacity pattern seen in many
other states. Marked **complete (scarce market)**.

## Key market structure finding

Nebraska title insurance premiums are filed with and approved by the
Department of Insurance under Neb. Rev. Stat. §44-1997 (a genuine filed-rate
state, unlike MS/AR which are unregulated). However, escrow/settlement/
closing charges are explicitly carved out of the premium under every
underwriter's General Rules (e.g., FNTI's "Risk Rate" rule: "The rates set
forth herein do not include any charge made for title search, title
examination, closing, or escrow services performed by the Insurer, or any of
its approved attorneys or agents.") and are not separately filed or publicly
disclosed the way Kansas (K.S.A. 40-1111) or Idaho (IDAPA 18.05.01.022)
require. Nebraska does not require attorney closings; title companies
(national-brand agents and independents) handle the large majority of
closings, but none of the independent title/escrow companies checked publish
a static settlement-fee schedule -- all route to phone quotes or interactive
rate/net-sheet calculators.

## Verified sources

1. **First National Title Insurance Company (FNTI)** — Nebraska Title
   Insurance Rates and Rules Manual, effective 2023-07-31. Premium-only;
   General Rule F explicitly excludes search/examination/closing/escrow
   charges. $25 CPL fee, 60% refinance rate, extensive Bulk Centralized
   Refinance and subdivision-rate programs.
2. **Stewart Title Guaranty Company** — Manual of Charges and Forms,
   effective 2023-11-29. Premium is defined as "all-inclusive" (risk premium
   + searching + examination charges) but the manual clarifies that closing/
   abstract-extension charges "are not shown as a part of the charge for the
   policy." $25 CPL fee, 70% refinance charge, richest non-endorsement policy
   variety found (Article 9 Comprehensive Plus for UCC/personal-property
   collateral, Secondary Market Short Form, Master Residential equity-loan
   schedules).
3. **WFG National Title Insurance Company** — Manual of Title Insurance
   Premiums, effective 2023-05-01. Premium explicitly "does not include
   charges for surveys, escrow, closing services, settlement services,
   recording fees, other charges." $25 CPL fee, volume-based Lender's Special
   Rates program (100/200/300/500-order minimum tiers).
4. **First American Title Insurance Company** (2-page rate sheet distributed
   via Builders Title, an independent Omaha title/escrow agency), effective
   2019-03-01. Premium-only; footer confirms pricing excludes recording fees,
   mortgage registration tax, and consenting fees. Builders Title itself
   (the distributing independent agency) does not publish its own separate
   escrow/closing fee schedule.

## Observed service-stack range

Not calculable — no settlement/service-fee dollar figures were found from any
source. All 4 verified sources price only the title insurance premium.

## Itemization / bundling patterns

- All 4 underwriters use a near-identical Basic Rate Table structure ($150
  minimum up to $5,000, then per-thousand tiers of $3.50/$3.00/$2.00/$1.50/
  $1.10 (or $1.00 for WFG)/$0.90) — a strong cross-underwriter corroboration
  of Nebraska's filed-rate baseline, though FNTI and Stewart both use a
  county-tiered structure (Cass/Douglas/Sarpy/Washington/Dodge/Lancaster get
  a higher $20,000/$5,000 threshold split) that WFG and First American do
  not replicate.
- All 4 sources price the Closing Protection Letter at an identical $25.00 —
  the cleanest 4-way cross-underwriter corroboration of a non-premium fee
  found in this state.
- Refinance discounting varies: FNTI 60% / Stewart 70% / WFG 60% (Standard)
  or 75% (Expanded) of the original issue rate — a genuine, verified
  cross-underwriter pricing difference despite the shared basic-rate
  structure.
- Stewart is the only underwriter offering an Article 9 Comprehensive Plus
  policy (personal-property/UCC collateral) and a Secondary Market Short
  Form Residential Loan Policy at flat liability-tier pricing; WFG is the
  only underwriter with a formal volume-based Lender's Special Rate program.
- No source in this state itemizes doc prep, courier, wire, e-recording, or
  notary/signing fees — every non-premium ancillary-fee category in the data
  model is unpopulated for Nebraska.

## Premium rate cards

See Verified sources above — all 4 are premium-only. No settlement/service-fee
rate card exists from any provider found this session.

## Metro differences

Not independently assessable for settlement fees (none published). On the
premium side, FNTI and Stewart both use a two-tier county structure (higher
minimum-coverage threshold for Cass, Douglas, Sarpy, Washington, Dodge, and
Lancaster Counties — the Omaha and Lincoln metro counties — versus all other
counties), though the per-thousand marginal rates above the threshold are
identical statewide. WFG and First American do not replicate this county
tiering in their published materials.

## Search log (24 combined query strategies + direct provider-site checks)

1. "Nebraska title insurance premium rate regulated filed OR promulgated
   Nebraska Department of Insurance" — confirmed NE is a genuine filed-rate
   state (Neb. Rev. Stat. §44-1997) and surfaced the FNTI rate manual PDF.
2. "Nebraska title company closing fee OR escrow fee schedule PDF Omaha OR
   Lincoln settlement fee '$'" — aggregator estimates only ($275-$350 escrow
   fee range, no named provider), no static schedule found.
3. Direct fetch + PDF-recovery of the FNTI NE manual — **verified**
   (source #1).
4. "Stewart Title Guaranty Nebraska rate manual PDF effective" — surfaced
   the Stewart NE manual PDF (virtualunderwriter.com).
5. "WFG National Title Nebraska rate manual PDF premium wfgunderwriting.com"
   — surfaced the WFG NE manual PDF directly.
6. Direct fetch + PDF-recovery of the Stewart NE manual — **verified**
   (source #2).
7. Direct fetch + PDF-recovery of the WFG NE manual — **verified**
   (source #3).
8. "'title company' Omaha Nebraska closing fee schedule PDF '$' settlement
   fee independent" — surfaced Eastern Title, First Title & Escrow, Builders
   Title, but no static fee figures in search snippets.
9. "First American Title Nebraska rate manual PDF premium schedule" —
   surfaced First American's NE agency page and confirmed no public rate
   manual PDF on firstam.com directly (Underwriting Library is
   credential-gated).
10. "Old Republic Title Nebraska rate manual PDF premium" — confirmed Old
    Republic routes NE rates through an interactive rate calculator only
    (oldrepublictitle.com/rate-calculator/?location=nebraska), no static PDF
    found — matches the pattern seen in most other states.
11. Direct fetch of easterntitle.com/nebraska/omaha/title-company — no
    dollar figures published; routes to "Start Your Order" / phone contact.
12. Direct fetch of firsttitleservices.com/nebraska-title-closing/ — HTTP 403
    Forbidden, unreachable.
13. Direct fetch of builderstitle.net — no dollar figures on the homepage,
    but surfaced a "RATE SHEET" navigation link.
14. "builderstitle.net rate sheet PDF Nebraska" search — confirmed Builders
    Title hosts a First American rate sheet (front and back pages) as
    downloadable PDFs.
15. Direct fetch of builderstitle.net/rate-sheet — surfaced the exact PDF
    URLs for the First American rate sheet.
16. Direct fetch + PDF-recovery of the First American rate sheet (front
    page) — **verified** (source #4, front page).
17. Direct fetch + PDF-recovery of the First American rate sheet (back
    page) — same source, confirmed footer disclaimer excluding recording/
    mortgage-registration/consenting fees.
18. "Nebraska title company 'closing fee is' OR 'settlement fee of $' OR
    'our fee is $' real estate escrow" — aggregator/blog content only, no
    named-provider figures.
19. "Lincoln Nebraska title company escrow closing fee schedule PDF
    Lancaster County" — surfaced Consumer Title & Escrow, Union Title,
    Nebraska Title Company (Auburn) — no static fee figures in snippets.
20. Direct fetch of consumertitlelincoln.com/netsheet/ — no dollar figures
    published (net-sheet tool is interactive/quote-based, not statically
    priced).
21. Direct fetch of uniontitle.com — no dollar figures; routes to Old
    Republic's rate calculator and a "Premium Calculator" tool.
22. Direct fetch of nebtitleco.com — no dollar figures; routes to its own
    "Rate Calculator" tool.
23. "Nebraska Department of Insurance title agent escrow fee filing
    requirement statute" — confirmed Neb. Rev. Stat. §44-19,116 governs
    escrow fund handling/fiduciary accounts but does NOT require public
    filing of escrow/settlement/closing rate schedules (unlike Kansas'
    K.S.A. 40-1111 or Idaho's IDAPA 18.05.01.022) — a genuine, confirmed
    regulatory-gap finding, not a search failure.
24. "Omaha real estate closing attorney fee flat rate published title
    company" — only generic aggregator ranges found ($750-$1,250 flat fee
    range cited by non-primary sources), no attributable firm-published
    figures; also reconfirmed Nebraska does not require attorney closings.

With only 4 verified sources despite this exhaustive search, NE meets the
contract's scarce criterion.

## Calculator harvest addendum (2026-08-06) — FNF national rate calculator

**2 of 3 calculator-basis providers** (prior: 1 (Nebraska Title Company — Title Midwest platform, Omaha/Douglas County)). See NE.json's newest
`basis: "calculator"` entry for full itemized figures and methodology.

- **national FNF-family shared rate calculator** (`ratecalculator.fnf.com`) —
  WORKING. Douglas County (state param confirmed supported in the tool's own county dropdown).
  Driven via plain HTTP POST (Python `requests.Session()`, not WebFetch) replaying the classic
  `__doPostBack`/`__VIEWSTATE` ASP.NET WebForms flow already documented in this project's
  CALCULATORS.md and previously used for CT/CO/AR: select county + underwriter + Next → select
  "Property Purchase" transaction type (own postback) → enter Purchase Amount $500,000 and Loan
  Amount $400,000 together (own postback on the loan field, reveals any further conditional
  questions) → auto-answer any newly-revealed required Yes/No question with its first listed
  option → click Finish for the Rate Summary. Result at $500,000/Douglas County: **Grand Total
  $1,282.50 (Premium $1,257.50 + Closing Protection Letter $25.00)**. No Loan Policy premium appeared anywhere in the flow despite the $400,000 loan
  amount entered (same behavior already documented for this tool's NV/AR entries) — recorded as-is.
  Premium-only output is valid calculator-harvest evidence per the 2026-08-05 CT-session scoping
  correction. Same Douglas County used as the existing Title Midwest/Nebraska Title Company entry.
