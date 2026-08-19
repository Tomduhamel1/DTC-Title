# Missouri — Market Fee Evidence

## Status: complete (scarce market) — 2 verified premium sources, 0 published settlement/service-fee schedules + 4 calculator-basis providers (**calculator-quoted (4 providers)**, threshold crossed 2026-08-02; 4th provider added 2026-08-19)

## Richness pass (2026-08-19) — FNF national rate calculator, Jackson County
`ratecalculator.fnf.com` (already-solved recipe, reused nationwide), Jackson County/Kansas City.
Premium-only, no Disclosure/Adjustment split for MO: Owner's Policy Premium $450.00, Loan Policy
Premium $4.00, Closing Protection Letter (Lender/Buyer) $25.00, Closing Protection Letter (Seller)
$25.00, Grand Total $504.00. See MO.json's 4th `"basis": "calculator"` entry for full detail.

## Calculator harvest (2026-08-02 update, continued) — 3rd provider found via a new multi-state platform
**Secured Title of Kansas City** (Jackson County, same metro as the existing Old Republic entry) was
found via `forms.titlemidwest.com` ("Title Midwest"), a newly-discovered shared calculator platform
(open directory listing exposes 25+ tenant slugs across MN/MO/KS/NE/TX — see CALCULATORS.md and
MN.json's Minnesota Secured Title entry, found the same session via the same platform). Plain
unauthenticated JSON GET: `ajax.asp?loantype=p&purchamt=500000&loanamt=400000&state=MO&county=JA`.
Result: Net Owner's Title Policy Charge $1,010.00 (CPL $50 + Missouri Title Service Fee $665.50 +
Filed Premium $294.50), Net Lender's Title Policy Charge $425.00 (CPL $50 + Title Service Fee $372 +
Filed Premium $3), plus flat "Other Title Charges" read directly from the page's own HTML: Seller
closing fee $500.00, Buyer/borrower closing fee $400.00, Wire/Banking service fee $25.00, Overnight/
Delivery Service fee $45.00 (total $970.00). This crosses MO to 3 calculator-basis providers (Old
Republic, Elite Title Company, Secured Title of Kansas City) — **calculator-quoted (3 providers)**.

## Calculator harvest (2026-08-02 update) — 2nd provider found, via a misattribution correction
**Elite Title Company** (Des Peres, MO, St. Louis County) was harvested via the TitleTap/NetSheetCalc
platform's newer `getNetSheetConfig` backend (app_id 438) — the same platform-migration fix discovered
this session for AZ/MI. This tenant was previously logged (2026-07-26 session) as a gated
*Massachusetts* instance based on an unverified search-snippet association; this session fetched the
tenant's own config JSON directly and found its embedded company address is "12231 Manchester Road,
Des Peres, MO 63131" — a genuine Missouri company, corrected here per the standing misattribution-guard
technique (and NOT logged for MA, where it does not belong). Result at $500k purchase/$400k loan, St.
Louis County: Closing Fee $395.00, Title Service Fee $1,302.49 (price-tiered, distinct rate table from
the title insurance premium), Owner's Title Insurance Premium $450.00, Lender's Title Insurance
Premium $300.00, Closing Protection Letter $25.00, E-Recording Fee $10.00, Delivery & Handling $35.00,
Recording Fee Estimate $100.00. MO now has 2 of the 3 providers needed to cross the calculator-quoted
threshold (Old Republic — Kansas City/Jackson County; Elite Title Company — St. Louis County), giving
useful geographic diversity between MO's two largest metros.

## Calculator harvest (2026-07-22)
Old Republic Title's public **Estimated Rate/Fee Calculator**
(https://www.ortconline.com/Web2/productsservices/informationservices/ratefeecalc/default.aspx) was
driven directly via HTTP GET/POST (ASP.NET WebForms postback replication, no browser/JS execution)
for the standard $500,000 purchase/$400,000 loan scenario, **Kansas City, MO 64106 (Jackson County)**
— the city-only dropdown required resolving to a specific zip to disambiguate Jackson County from
the multi-county KC metro; other "Kansas City" zips were not tested. Result: Lender's Title Policy
$3.00 (of $3.00 total — a striking near-zero premium figure for this scenario), Settlement Agent Fee
$547 (of $1,094 total, buyer half), Owner's Title Policy $294.50 (fully buyer-charged). Section
totals: C (shop-for) $550.00, H (other) $294.50. This is the first Old Republic-specific MO premium
figure obtained in this survey (the two rate manuals already on file are First National Title
Insurance and WFG National) and is consistent with this state's file noting MO settlement/premium
pricing is filed privately rather than published. Full entry recorded in MO.json with `"basis":
"calculator"`. No personal information was entered (Name/Company fields are optional and were left
blank). This is 1 calculator provider; the task's 3-provider threshold was not reached this session
(see CALCULATORS.md).

Missouri is a filed-rate (insurer-filed) state for title insurance premiums (381.181 RSMo; 20 CSR
500-7.100 requires a "Uniform Premium (Risk Rate) Report" filed with the department). This
session verified **2 directly-fetched title insurance premium rate manuals** — First National Title
Insurance Company (FNTI, effective 2021-09-01) and WFG National Title Insurance Company
(effective 2025-07-01) — both of which qualify as good sources under the filed-rate clause of the
completion contract. Despite 16 distinct query strategies and direct checks of Stewart Title's and
First American's Missouri agent pages, Virtual Underwriter's Missouri portal, and four independent
Missouri title/escrow companies (Monarch Title, Continental Title, Preferred Title of Missouri,
Equity Title — the last turning out to be a California-only company despite the name), **no
Stewart or First American Missouri-specific rate manual PDF could be located publicly**, and
**zero settlement/escrow/closing service-fee dollar figures were found anywhere**. This is the
scarcest evidence base of any state surveyed so far (2 verified sources, vs. 3 for TN and 4 for CO),
and is marked **complete (scarce)**.

## All-in service-stack range observed

**None available.** Neither verified MO source prices a settlement, escrow, or closing service fee.
The one genuine settlement-adjacent dollar figure found is the **Closing Protection Letter (CPL)
fee, mandated by RSMo 381.022.5/.6**: both FNTI and WFG price it identically at **$25.00 per real
estate transaction, per party** (buyer/lender and seller each pay $25, i.e. up to $50 total per
transaction) — a clean cross-underwriter corroboration, but a statutory fee rather than a market-set
settlement fee, and far short of a full service-stack figure.

## Itemization / bundling patterns

Both verified underwriters state explicitly and in nearly identical language that title search, title
examination, closing, and escrow/settlement services are priced separately from the filed premium
and are not disclosed in the rate manual:
- **FNTI (General Rule F):** "The rates set forth herein do not include any charge made for title
  search, title examination, closing, or escrow services performed by the Insurer, or any of its
  approved attorneys or agents. Charges made for such services are in addition to the rates and
  charges set forth herein."
- **WFG (Section 1, Introduction):** "The rates shown do not include charges for title search,
  surveys, escrow, closing services, settlement services, recording fees, other charges, or other
  monies advanced on behalf of an applicant."

WFG's 2025 manual also shows the minimum premium rising from **$4.00 to $10.00** relative to
FNTI's still-current $4.00 minimum from 2021 — likely reflecting a later, unrelated general filing
update (WFG's own 2022 bulletin for this same manual format change confirms the $4->$10
minimum shift was a standalone adjustment, not tied to settlement-fee unbundling as seen in MI).

## Premium rate card (filed-rate state)

Missouri premiums are unusually low relative to most states surveyed (rates expressed as small
per-thousand multipliers rather than large minimum-plus-per-thousand schedules): FNTI's Owner's/
Leasehold rate is **$1.40/thousand up to $50,000** (minimum premium **$4.00**), while WFG's 2025
schedule uses the same $1.40/thousand structure but a raised **$10.00** minimum. Loan policy rates
run lower still ($1.00/thousand and $0.60/thousand respectively for FNTI/WFG at the base tier).
Both underwriters also publish centralized/lender's-special refinance-only rate tiers and Master
Home Equity / HE2 certificate fees ($45-$300 per transaction) that explicitly exclude search,
exam, and closing charges. Full liability-tiered schedules are recorded verbatim in MO.json.

## Not used / found-but-blocked

- **Stewart Title Guaranty Company** — Missouri clearly has active Stewart agents (per
  stewart.com's Missouri agent-facing pages), but no public Missouri rate manual PDF could be
  located via direct search, via Stewart's go.stewart.com distribution path (which readily surfaced
  Arkansas, Georgia, South Dakota, and Wisconsin manuals on the same URL pattern), or via
  Virtual Underwriter's Missouri portal page (which lists MO forms/bulletins but no rate manual
  link). Missouri appears to be one of the states where Stewart's rate manual is not indexed/
  discoverable outside StewartPoint's internal-agent-only access.
- **First American Title** — Same pattern: agency.firstam.com/mo and commercial.firstam.com/mo
  list contacts and general resources but no linked Missouri rate-sheet PDF; the only "First
  American Rate Sheet" documents found via search were for Hawaii (oahure.com) and Illinois
  (wasserlaw.net) — both fetched, confirmed wrong-state, and discarded.
- **Equity Title** (equitytitle.com) — despite a search result surfacing a "Stewart-Rates.pdf" hosted
  on this domain, the company itself is confirmed California-only (Glendale, San Diego, Irvine,
  Ontario/San Bernardino, Palm Desert offices) — discarded as wrong-state/irrelevant to MO.
- **Monarch Title Company** (monarchtitle.com) — DNS resolution failure on direct fetch; search
  results confirm it is a real Missouri title agency with an online Owner's Policy calculator, but no
  static fee schedule PDF was located.
- **Continental Title** (ctitle.com, Kansas City & St. Louis) — direct fetches of the homepage,
  /services/, /resources/, and /kansas-city-title/ paths all returned empty/inaccessible content;
  no fee schedule located.
- **Preferred Title of Missouri** (ptofmo.com) — has an interactive JavaScript rate calculator and a
  linked "Homeowners Title Insurance Policy" brochure (policy-type comparison, not a fee
  schedule); no static settlement-fee schedule found.

## Search log (16 distinct query strategies + direct provider-site checks)

1. "Missouri title insurance rate manual filed settlement fee schedule PDF"
2. "First American Title Missouri closing fee schedule PDF"
3. "Stewart Title Missouri rate manual closing escrow fee"
4. "Missouri independent title company closing fee schedule St. Louis Kansas City PDF"
5. "Monarch Title Missouri closing fee schedule PDF"
6. "\"Old Republic\" Missouri escrow closing fee schedule PDF"
7. "Stewart Title Missouri \"rate manual\" filetype:pdf"
8. "virtualunderwriter.com Missouri Stewart rate manual pdf"
9. "\"Stewart Title\" Missouri residential rate manual virtualunderwriter"
10. "go.stewart.com Missouri residential rate manual pdf"
11. "\"go.stewart.com\" Missouri pdf rate manual eff"
12. "First American Title Missouri \"Basic Rate Sheet\" OR \"rate sheet\" pdf agency"
13. "Preferred Title of Missouri closing fee schedule pdf"
14. "virtualunderwriter.com/-/media/files/virtualunderwriter/imported/pdfs/missouri"
15. "Community Title / Absolute Title / Continental Title" (carried over search pattern from MI,
    re-applied against MO independents; no hits)
16. Generic "Missouri title company fee schedule closing costs" variants

Plus direct provider-site fetches: wfgunderwriting.com/missouri (successful — led to the 2025
manual), stewart.com/en/state-pages/missouri-agents/tools-and-resources, agency.firstam.com/mo,
virtualunderwriter.com/select-location/missouri, ctitle.com (4 paths attempted), monarchtitle.com,
ptofmo.com/rate-calculator, equitytitle.com. Binary PDF content unreadable by WebFetch directly
was recovered via the Read-tool PDF-recovery technique for both verified sources plus 4 discarded
wrong-state PDFs (2 First American: Hawaii, Illinois; the FNTI and WFG bulletin cover pages
themselves parsed fine as short documents).
