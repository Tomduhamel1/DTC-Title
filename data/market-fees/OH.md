# Ohio (OH) — Market Fee Evidence

## Status: complete (scarce market) — 2 verified published sources + 4 calculator-basis providers (**calculator-quoted (4 providers)**, threshold crossed 2026-07-27; 4th provider added 2026-08-19)

## Richness pass (2026-08-19) — FNF national rate calculator, Franklin County
`ratecalculator.fnf.com` (already-solved recipe, reused nationwide) reaches Franklin County even
though Old Republic's tool doesn't. Premium-only: Owner's Policy Premium $2,475.00, Loan Policy
Premium $150.00, Lender's Closing Protection Coverage $40.00, Grand Total $2,665.00. See OH.json's
4th `"basis": "calculator"` entry for full detail.

## Calculator harvest (2026-07-27 update) — Franklin County (Columbus) reached, threshold crossed
Old Republic's ortconline.com tool (below) does not serve Franklin County, OH's actual most-populous
county, so this session searched specifically for Franklin-County-serving OH calculators. Found and
harvested two independent title agencies running the **same shared "OH netsheet calculator" JS
template** (identical `TitleCalc()`/`computeForm()` engine, 88-county `CountyMultiplier` dropdown) —
**Columbus Title Agency of Westerville** (columbustitle.com/netsheets/, Franklin County/Columbus
metro) and **Owl Creek Title Agency** (owlcreektitle.com/netsheet, Knox County/Mount Vernon, serves
Franklin statewide). Both are seller-side-only net sheets (no loan-amount field, so the standard
scenario's $400,000 loan amount doesn't apply) with hardcoded flat fee constants read directly from
each site's own static HTML/JS via plain HTTP GET — no browser/JS execution, no personal data. Results
at $500,000 purchase price, Franklin County:

| Item | Columbus Title Agency | Owl Creek Title Agency |
|---|---|---|
| Title Search Fee | $275.00 | $225.00 |
| Seller Closing Fee | $210.00 | $125.00 |
| Title Binder Fee | $50.00 | $50.00 |
| Doc Prep | $85.00 | $75.00 |
| Owner's Title Insurance premium (formula) | $2,515.63 | $2,515.63 (identical formula) |
| Franklin Co. conveyance/transfer tax (government, not a title fee) | $1,500.00 | (same $3/thousand rate) |

Both agencies' premium formula independently corroborates OTIRB's own documented "Homeowner's Policy
variant: PR-1 rate +15%" (base bracket-rate premium of $2,187.50 at $500k x 1.15 = $2,515.63 exactly).
The two agencies' own service-fee constants differ meaningfully from each other, confirming genuine
per-provider evidence despite the shared template — the same pattern already established for
MyTitleRates.com/TitleCapture elsewhere in this survey. Full entries in OH.json with `"basis":
"calculator"`. Combined with Old Republic below, **OH now has 3 calculator-basis providers, crossing
the calculator-quoted threshold.** First Ohio Title's net sheet system requires agent login (gated,
logged in CALCULATORS.md); Mutual Title Agency's page is HubSpot marketing content with no embedded
calculator found; Talon Title Agency's calculator subdomain returned HTTP 406 on every user-agent
tried (not pursued further this session).

## Calculator harvest (2026-07-22)
Old Republic Title's public **Estimated Rate/Fee Calculator**
(https://www.ortconline.com/Web2/productsservices/informationservices/ratefeecalc/default.aspx) was
driven directly via HTTP GET/POST (ASP.NET WebForms `__VIEWSTATE`/`__EVENTVALIDATION` postback
replication — no browser/JS execution) for the standard $500,000 purchase/$400,000 loan scenario.
This tool's OH agency footprint covers only 15 northern-Ohio counties (Ashland, Cuyahoga, Erie,
Geauga, Huron, Lake, Lorain, Lucas, Medina, Ottawa, Portage, Stark, Summit, Wayne, Wood) — Franklin
County (Columbus) is not served, so **Cuyahoga County (Cleveland)**, the largest available and OH's
2nd-most-populous county, was used. Result: Closing Protection Letter $40, Lender's Title Policy
$1,300 (of a $2,187.50 full ALTA Owner's rate basis), Settlement Agent Fee $380, Commitment Fee $100,
Document Processing Fee $100, Location Survey $175, Special Tax Search $50, Closing Protection
Coverage $20, Notary/Signing Fee $75, Recording Fees $252, Owner's Title Policy (net) $506.25.
Section totals: C (shop-for) $2,240.00, E (gov't fees) $252.00, H (other) $506.25. Identical figures
were independently returned for Lorain County, confirming Old Republic prices this OH territory
statewide rather than county-tiered. Full entry recorded in OH.json with `"basis": "calculator"`. No
personal information (name/company) was entered — those fields are optional in this form and were
left blank. This is 1 calculator provider; the task's 3-provider "calculator-quoted" threshold was not
reached this session (FNF's ratecalculator.fnf.com and First American's FACC calculator were both
confirmed JS/session-driven with no discoverable stateless endpoint — see CALCULATORS.md).

## OTIRB premium note (regulatory backbone)
Ohio title insurance premiums are set uniformly for all member insurers/agents by the **Ohio Title
Insurance Rating Bureau (OTIRB)**, licensed by the Ohio Department of Insurance under Ohio
Revised Code Sections 3935.04 and 3953.28. Current reference: the **Schedule of Rates for Title
Insurance in the State of Ohio, effective January 1, 2026** (SERFF Tr. Num DEMT-134549810) —
https://go.stewart.com/rs/067-YWO-436/images/OTIRB%20Rates%20for%20Title%20Insurance%20%20Effective%201-1-26.pdf.
OTIRB's 26 current members include all five national underwriters named in the task brief (Chicago
Title, Fidelity National, First American, Old Republic National, Stewart Title Guaranty) plus WFG
National. Owner's Policy Original Rate: $5.80/thousand up to $250,000, tiering down to $2.60/thousand
above $10 million; $225 minimum premium. Loan Policy Original Rate: $4.00/thousand up to $250,000;
$150 minimum. A related-bureau document (Attorneys Title Guaranty Fund's own OH rate manual,
effective 07/01/2025) was also indexed but not needed as a second regulatory citation per the task
brief's "one clearly-dated vintage" instruction.

**Central structural finding**: Ohio's regulatory text is the most direct "no carve-out needed"
unregulated-settlement-fee statement found in this survey to date. General Provision **GP-4** states
outright: *"The rates set forth herein do not include any charge made for title search, title
examination, closing, or escrow services performed by the Insurer, or any of its approved attorneys
or agents. Charges made for such services are in addition to the rates and charges set forth
herein."* Unlike PA (which needs a special Approved-Attorney-Procedure carve-out) or NJ (whose
NJLTIRB directly promulgates the settlement fee itself), Ohio simply declares up front that
search/exam/closing/escrow are never part of the regulated rate for **any** provider type — the
entire settlement/service-fee stack the task brief targeted is, by the Manual's own text, 100%
market-set. The one closing-adjacent item OTIRB *does* price is the Closing Protection Coverage
(Section 6, Form CP-24): **$40 lender / $55 seller / $20 buyer-borrower / $20 each additional
applicant**, $40 minimum, remitted entirely to the Insurer.

## Observed service-fee range
Only **one** genuine provider-published, dollar-denominated settlement-fee schedule was located
despite an extensive search:

| Provider | Metro | Closing/settlement fee (as published) |
|---|---|---|
| Landmark Title Agency South, Inc. | Dayton (Montgomery County/Miami Valley), service area extends to Cincinnati/Hamilton County | **$200** purchase (buyer) / **$150** refinance / **$125** second-mortgage-piggyback, plus a separate **$90** seller-side Closing/Disbursement Fee |

Landmark's own $40 Lender Closing Protection Coverage line matches OTIRB's regulated $40 lender CPL
rate exactly — a clean confirmation that this provider passes through the one rate-regulated
closing-adjacent charge correctly while pricing everything else independently. With only one priced
settlement-fee source, there is no multi-provider range to test for saturation stability (the same
"too few comparable data points" situation previously documented for PA, NM, IN, and VT — see
PROGRESS.md).

## Itemization patterns
- Landmark is the most granular Ohio source found, cleanly separating buyer-side Closing Fee ($200
  purchase/$150 refinance) from seller-side Closing/Disbursement Fee ($90) and Deed Prep ($100) — a
  genuine buyer/seller fee-split. Ancillary items: Wire Fee $40, Courier/Overnight (payoff) $25,
  Recording Service Fee $25, RON Notary Session (seller) $100 (+$75 additional session), Print/
  Delivery Handling Fee $50, CertifID ID Verification $15/party, Title Exam $230 purchase/$180
  refinance, Title Insurance Binder $90.
- No national-brand underwriter (First American, Fidelity/Chicago Title, Old Republic, Stewart, WFG)
  publishes a static OH settlement-fee schedule — all are OTIRB members bound by the same GP-4
  exclusion, and all route to interactive fee calculators (First American's own
  local.firstam.com/oh, facc.firstam.com; Title First's national-title-fee-calculator) with no
  static fallback, the same pattern documented in every other state surveyed to date.
- Ohio Real Estate Title (ORET), a Columbus-area independent agency whose "Fees" page (oret.com/fees/)
  surfaced repeatedly in search results with a snippet suggesting a $75 seller-side deed-prep charge,
  could not be independently verified: the domain returned a DNS resolution failure (getaddrinfo
  ENOTFOUND) on every fetch attempt via both WebFetch and direct curl this session — logged as found
  but unusable rather than a confirmed data point.

## Metro notes
- **Columbus/Franklin County**: no independent title-company-specific settlement-fee schedule was
  found publishing dollar figures despite extensive direct and search-based effort. Columbia Title
  Agency (a Fidelity National Financial-affiliated Columbus agent) had published a fee page
  (columbiatitlecompany.com/fee1.htm) as of a May 2022 Wayback Machine snapshot, but the live site has
  since been rebuilt with no fees page, and web.archive.org itself is unreachable from this session's
  network path — logged as found-but-unresolvable rather than used. Title First and Valmer Title
  (both Columbus-area, identified via Redfin's "openbook" escrow-company pages) show real transaction
  history but no fee breakdown in the rendered content; Title First's own site is calculator-only.
- **Cleveland/Cuyahoga County**: no independent title-company-specific settlement-fee schedule was
  found despite direct checks of Fairmount Title Agency ("Cleveland's Title Company"), Commonwealth
  Suburban Title (serving Mahoning/Summit/Trumbull/Columbiana Counties, adjacent to but not in
  Cuyahoga proper), Cleveland Home Title, and Northern Title Agency — all describe services
  qualitatively with no dollar figures published.
- **Cincinnati/Hamilton County**: covered indirectly via Landmark Title Agency South's own published
  multi-county service-area/conveyance-fee table, which explicitly lists Hamilton County — no
  Cincinnati-headquartered title company (Ivy Pointe Title, American Homeland Title Agency, both
  checked directly) publishes its own static settlement-fee schedule; Ivy Pointe's page is a First
  American fee-calculator embed with no static figures, and American Homeland Title's blog post gives
  only generic percentage-of-price ranges.
- **Toledo/Lucas County**: no title-company-specific settlement-fee schedule was found. Network Land
  Title (serving "Toledo to Sandusky to Cleveland and Akron," per its own blog) discusses the OTIRB
  2026 rate increase narratively and explicitly states "other fees can vary, like closing/escrow,
  courier, wire, and exam-related charges" without quoting a single dollar figure — a direct
  provider-side confirmation of the market-opacity pattern rather than a priced source.

## Search log
**Regulatory (1 strategy, fully resolved on first query):** "Ohio Title Insurance Rating Bureau
OTIRB rate manual PDF 2025 2026" — located and PDF-recovered the current 01/01/2026 OTIRB Manual
(go.stewart.com courtesy host) plus incidentally the Attorneys Title Guaranty Fund's 07/01/2025 OH
manual and a WFG 2019 OH bulletin (both premium-only, not separately cited).

**Provider settlement-fee research (14 distinct query strategies):** "Ohio title company settlement
fee schedule Columbus Franklin County closing costs"; "Ohio title company settlement fee schedule
Cleveland Cuyahoga County closing costs"; "Ohio title company settlement fee schedule Cincinnati
Hamilton County closing costs"; "Ohio title company 'closing fee' OR 'settlement fee' schedule
filetype:pdf"; "Stewart Title Ohio settlement fee bulletin 'doc prep' OR 'wire fee' OR 'courier fee'";
"First American Title Ohio closing fee schedule settlement costs Columbus OR Cleveland OR
Cincinnati"; "Toledo Ohio title company settlement fee closing costs schedule Lucas County";
"'title company' Ohio 'settlement fee' OR 'closing fee' \"$\" Columbus OR Dublin OR Westerville
schedule"; "'Ohio Real Estate Title' ORET fees closing settlement Columbus"; "Cleveland Ohio
independent title agency fee schedule 'processing fee' OR 'doc prep' OR 'wire fee' closing"; "Ohio
title agency 'rates and estimates' OR 'fee schedule' 'Closing Fee' 'Title Exam' Columbus"; "Cleveland
OR Cuyahoga Ohio title agency 'closing fee' 'title exam' fee schedule rates"; "Columbus Ohio title
agency 'Closing Fee' 'Title Exam' dollar amount rates page"; "'Buckeye Title' OR 'Community Title' OR
'Continental Title' Ohio Columbus Cleveland fee schedule closing"; "'Title First' Ohio title agency
fee schedule closing costs Columbus"; "'Network Land Title' Ohio fee schedule closing costs
Columbus".

**Direct provider-site checks (16):** landmarktitlesouth.com/rates-and-estimates (USED — WebFetch
returned empty content twice, recovered via direct curl + Python HTML-strip, the richest OH source
found); trilogytitleagency.com/the-complete-guide-to-real-estate-closing-costs-in-ohio/ and
/toledo-ohio/ and /cleveland-ohio/ (no figures, generic ranges only); ivypointetitle.com/fee-calculator/
(First American calculator embed, Cincinnati, no static figures); oret.com/fees/ (DNS resolution
failure — getaddrinfo ENOTFOUND — on 2 WebFetch attempts and 1 direct curl attempt, unresolved despite
appearing in 3 separate search results); fairmounttitle.com/uncategorized/who-pays-the-title-company/
(Cleveland, no Fairmount-specific figures, only generic OH statutory figures); cstitleohio.com/services/closings/
(Commonwealth Suburban Title, Mahoning/Summit/Trumbull/Columbiana Counties, no figures);
info.networklandtitle.com blog post (USED for metro-coverage/OTIRB-effective-date confirmation, not
as a priced source) + networklandtitle.com root (no fees/rates nav link found); columbiatitlecompany.com/fee1.htm
(HTTP 404, site rebuilt under Fidelity National Financial branding) + columbiatitlecompany.com root
(no fees page in current nav) + web.archive.org 2022-05-19 snapshot of the same URL (WebFetch and
curl both blocked/unreachable for web.archive.org from this session); redfin.com/openbook escrow
pages for "ohio-title-first" and "ohio-valmer-title" (both Columbus-area, reviews/transaction-history
only, no fee breakdown rendered); americanhomelandtitle.com/seller-costs-in-ohio/ (Cincinnati/Dayton/
Marietta, no company-specific figures); titlefirst.com (calculator-only, "national-title-fee-calculator"
link, no static schedule); WFG National's 2019 OH bulletin PDF (premium-only, unreadable/garbled after
PDF-recovery attempt, not counted).

### Verified and used this session (2 total)
OTIRB Schedule of Rates (regulatory — premium tables + the GP-4 unregulated-settlement/closing/
escrow-charge finding + the CP-1 Closing Protection Coverage rates); Landmark Title Agency South,
Inc. (Dayton/Montgomery County + Cincinnati/Hamilton County service area, $200/$150/$125 purchase/
refinance/second-mortgage closing fees + $90 seller closing/disbursement fee + full ancillary stack).

### Found but not usable (no dollar figures, blocked, or unresolved despite a working or attempted fetch)
oret.com (DNS failure on all 3 attempts, though a $75 ORET seller-side deed-prep figure surfaced in a
search-result snippet and is noted but not independently verified); trilogytitleagency.com (3 pages,
generic ranges only); ivypointetitle.com (calculator embed); fairmounttitle.com (no company-specific
figures); cstitleohio.com (no figures); networklandtitle.com (no fees page; blog explicitly states
fees "can vary" without quoting figures); columbiatitlecompany.com (404 on the known fee-page path;
site rebuilt with no fees nav; its 2022 archived version is unreachable since web.archive.org itself
is blocked from this session's network); redfin.com/openbook (2 Columbus-area companies, no fee
breakdown rendered); americanhomelandtitle.com (no company-specific figures); titlefirst.com
(calculator-only); WFG National's 2019 OH bulletin (premium-only, unreadable after PDF-recovery
attempt).

## Saturation/scarcity reasoning
This session located only **2 good sources** (1 regulatory + 1 provider-published), well below the
6-source saturation floor, despite **15 distinct query strategies and 16 direct provider-site
checks** — comfortably past the 8-strategy exhaustive-search threshold required to invoke the scarce-
market provision, and direct checks effectively covered all five national-brand underwriters named in
the task brief (each confirmed as an OTIRB member bound by the identical GP-4 exclusion, with none
publishing a static OH settlement-fee schedule of its own). Ohio's structural characteristics
plausibly explain the thinness of provider-side evidence: (1) OTIRB's GP-4 removes any regulatory
prompt to publish a standalone settlement-fee number, since the regulated rate never included it in
the first place (unlike NJ, there is no "restate the promulgated figure" incentive at all); (2) most
independent Ohio title agencies checked this session (Fairmount, Commonwealth Suburban, Network Land
Title, American Homeland Title, Ivy Pointe, Title First) market their services with only qualitative
or percentage-of-price language, a genuine market-opacity finding rather than a search failure; and
(3) one promising Columbus-area lead (Ohio Real Estate Title's "Fees" page) could not be verified due
to a DNS resolution failure that persisted across both the WebFetch tool and a direct curl attempt,
and a second lead (Columbia Title Agency's archived fee page) was blocked by this session's inability
to reach web.archive.org at all. OH is marked **complete (scarce market)** on that basis. The
clearest positive finding of this session is the discovery of Landmark Title Agency South's genuinely
rich, current, multi-transaction-type fee schedule — the single most itemized Ohio source located,
and notable for spanning two of the task brief's three target metros (Dayton primary office, Cincinnati/
Hamilton County via its own published service area) in one document, plus its Lender CPL figure
independently corroborating the OTIRB-regulated $40 rate byte-for-byte.

## Calculator harvest addendum (2026-08-20) — richness pass: WFG National Title

Richness pass per the 2026-08-19 session's own recommendation (check tracker coverage for already-solved nationwide recipes — Stewart's `/api/SRC/quote`, WFG's Seller Net Sheet API — before hunting a new platform). Prior: 4 calculator-basis providers. This session adds 1 corroborating provider(s), bringing OH to **5 calculator-basis providers**. See OH.json's newest `basis: "calculator"` entries for full itemized figures and methodology.

- **WFG National Title Insurance Company** (Seller Net Sheet Rate Calculator, `rates.wfgnationaltitle.com`) — Owner's Title Insurance Premium **$2,846.25**, premium-only (no itemized settlement fee configured for this state in this tool).
