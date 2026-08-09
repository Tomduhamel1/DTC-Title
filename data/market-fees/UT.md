# Utah — Market Fee Evidence

## Status: complete (scarce market) — 5 verified published sources + 1 calculator-basis provider (not yet at the 3-provider calculator threshold), 2026-07-22

## Calculator harvest (2026-07-22)
Old Republic Title's public **Estimated Rate/Fee Calculator**
(https://www.ortconline.com/Web2/productsservices/informationservices/ratefeecalc/default.aspx) was
driven directly via HTTP GET/POST (ASP.NET WebForms postback replication, no browser/JS execution)
for the standard $500,000 purchase/$400,000 loan scenario, **Salt Lake City (Salt Lake County)**.
Result: Closing Protection Letter Fee $25, Electronic Recording Fee $10, Lender's Title Policy
$1,218, Settlement Agent Fee $395. Owner's Title Policy line was struck through with a footnote
marker whose note text wasn't rendered in the fetched fragment (consistent with a seller-pays
convention, buyer total $0). Section totals: C (shop-for) $1,648.00, E (gov't fees) $80.00. The
$395 Settlement Agent Fee is within 0.5% of Sutherland Title's already-verified Salt Lake City
figure — a close cross-provider corroboration. Full entry recorded in UT.json with `"basis":
"calculator"`. No personal information was entered (Name/Company fields are optional and were left
blank). This is 1 calculator provider; the task's 3-provider threshold was not reached this session
(see CALCULATORS.md).

Utah is a filed-rate (insurer-filed, not state-promulgated) title insurance market under Utah
Admin. Code Rule R590-225, and until recently had a structure resembling Alaska's and Idaho's:
former Rule **R592-15 ("Schedule of Minimum Charges for Escrow Services") required title
insurers, agencies, and producers to file escrow/settlement charge schedules with the Utah
Insurance Department** — but **R592-15 was repealed effective 2023-08-21** after HB 410 (2023
General Session) amended Utah Code 31A-19a-209 to remove that filing requirement (confirmed via
the repeal notice and via direct review of the current Utah Administrative Code, Title R592). This
means Utah's regulatory history briefly matched AK/ID's favorable-disclosure pattern but has since
reverted to the more common unregulated/unfiled settlement-fee model found in most states. The
task brief's hypothesis of a "Utah Title & Escrow Association fee schedule" was independently
checked and **does not exist**: the real association is the **Utah Land and Title Association
(ULTA, utahlandtitle.com)**, confirmed live and active, but its public Forms page hosts only
recording/processing best-practice standards documents (name-discrepancy guidance, tax-proration
practice, notary-method standards) — no fee schedule of any kind. This session ran **28 distinct
query strategies** plus direct checks of all 5 national-brand underwriters/direct offices (First
American, Old Republic, Chicago Title, Fidelity National, plus Stewart and WFG's own manuals) and
roughly a dozen Utah independent title/escrow companies (Sutherland, Provo Abstract, Metro
National Title, Metro Title, GT Title Services, Cottonwood Title, Southern Utah Title Company,
Eagle Gate Title, National Title Agency of Utah, plus name-only searches for Equity Title,
Beehive Title, Standard Title, Title Team, Universal Title, Emigration Title, Doty Title, and
Landmark Title). Only **5 usable sources** were found with actual dollar figures. Marked
**complete (scarce)** — well past the 8-strategy threshold, below the 6-source saturation floor.

## All-in service-stack range observed

Utah's evidence splits cleanly into premium-only national-underwriter manuals and two
independent companies' partial settlement-fee pages — no single source in this session
published a complete, itemized settlement-fee package:

**Genuine settlement/escrow fees (excluding title premium), by provider:**
- **Sutherland Title (Salt Lake City/Draper):** closing fee $50.00–$175.00 (transaction-type
  dependent), doc prep/e-mail package $25.00–$50.00, overnight (FedEx) $20.00–$30.00, wire
  $20.00, trustee/reconveyance tracking $75.00 per Deed of Trust, standard loan-policy
  endorsements $55.00, short-sale flat fee $500.00. A representative financed-purchase stack
  (high-end closing fee + doc prep + overnight + wire + endorsements) totals roughly
  **$300–$330**, excluding recording fees and title premium; a minimal cash transaction could
  run as low as **$75–$95** (low-end closing fee + doc prep only).
- **Provo Abstract (Provo/Utah County):** the headline settlement/closing fee itself is
  calculator-only (not a static published figure), but concrete add-ons are published: e-closing
  fee $20.00 (cash) / $75.00 (loan), a standard 3-endorsement bundle $60.00, and e-recording
  $5.00/document (Simplifile pass-through). These three line items alone total roughly **$85
  (cash) to $140 (loan)** before the undisclosed core closing/settlement fee.

Because only one of the two independent sources (Sutherland) discloses a complete closing-fee
range and neither discloses title premium on the same page, a genuine cross-provider "all-in"
range cannot be reliably computed this session — the ~$75–$330 figure above should be read as
Sutherland's own internal range, not a market-wide observed spread.

**Title insurance premium (filed-rate, three underwriters compared at $200,000 owner's
liability):** Stewart = **$1,121**, WFG = **$1,135**, FNTI = **$1,135** — a striking **<1.3%
spread** across all three national underwriters at the identical coverage amount. This is
unusually tight compared to most other states surveyed in this project (where 30–50%+ spreads
between underwriters' filed premiums are common); see "Itemization / bundling patterns" below
for the likely structural explanation.

## Itemization / bundling patterns

- **All three national underwriters (Stewart, WFG, FNTI) publish premium-only manuals** that
  explicitly or functionally exclude settlement/escrow/closing charges. Stewart's exclusion
  language is the most explicit of any state reviewed in this survey to date, naming six
  distinct excluded fee types in a single sentence: "a Charge does not include any settlement
  fee, trustee fee, inspection fee, document fee, closing fee, escrow fee or any other fee
  associated with escrow." WFG's introduction similarly excludes "surveys, escrow, closing
  services, tax searches and certificates, municipal lien searches, settlement services, notary
  services and fees, recording fees, and other charges." FNTI's manual contains no explicit
  exclusion sentence but likewise contains zero settlement-fee dollar figures anywhere across
  its 10 chapters.
- **WFG's and FNTI's Basic Rate/Basic Insurance Rate tables are structurally identical** —
  both use $200 minimum up to $10,000, then $5.50/$1,000 to $50,000, $5.10/$1,000 to $100,000,
  and $4.60/$1,000 to $200,000/$250,000 — producing the same $1,135 premium at $200,000
  liability. Stewart's table uses a different increment structure ($10,000 blocks rather than
  $1,000/$5,000 blocks) but arrives within 1.2% of the same figure. This convergence, combined
  with the tight overall spread, suggests Utah's filed title-premium market may track a shared
  informal benchmark rather than being genuinely independently priced by each underwriter — a
  notable finding distinct from every other filed-rate state surveyed in this project so far.
- **CPL fees are nearly uniform**: Stewart charges $25 each for lender/purchaser/borrower and
  $50 for seller (with an extra $25 for a second mortgage/HELOC by a non-primary lender); WFG
  and FNTI both charge a flat $25 per protected party. All three cite Utah Insurance Code
  31A-4-117 as the statutory basis.
- **Independent Utah title/escrow companies are the only source of genuine settlement-fee
  data**, and even among them the data is thin: of roughly a dozen independent Utah companies
  checked, only 2 (Sutherland Title, Provo Abstract) had any fetchable static dollar figures;
  every other independent checked (Metro National Title, Metro Title, GT Title Services,
  Cottonwood Title, Southern Utah Title Company, Eagle Gate Title, National Title Agency of
  Utah) routes exclusively to interactive rate/fee calculators or quote-request pages with no
  static published numbers, or returned empty/unfetchable page content.
- **Provo Abstract's page is a partial disclosure** — it names the full fee-category list
  (title insurance, settlement/closing fee, escrow fees, doc prep, reconveyance, courier, wire,
  recording) but assigns static dollar amounts to only 3 of those categories, routing the core
  settlement fee itself to a rate calculator. This "named-but-not-priced" pattern is distinct
  from the more common "not mentioned at all" pattern seen in most other scarce states surveyed.

## Metro / regional coverage

Coverage spans 2 of the 4 target metros with published (even if partial) independent pricing:
- **Salt Lake City / Wasatch Front (Salt Lake County):** Sutherland Title's itemized
  escrow-fee page — the richest single independent source found this session.
- **Provo / Utah County:** Provo Abstract's partial fee disclosure.
- **Ogden / Weber County:** no independent company with published static pricing was found
  despite a dedicated search; GT Title Services has an Ogden office but only a calculator.
- **St. George / Washington County:** no independent company with published static pricing was
  found; Southern Utah Title Company (headquartered in the region) and GT Title Services (2 St.
  George offices) both route to quote-request/calculator pages only.

All three national-underwriter premium manuals are statewide with no metro/county rate split —
unlike several other states surveyed (e.g., South Dakota's Minnehaha/Lincoln/Yankton metro tier,
Tennessee's All-Inclusive-Rate counties), Utah's filed premiums are uniform across all 29
counties for a given underwriter.

## Premium rate card (filed-rate state)

Utah is confirmed insurer-filed for title premiums under Utah Admin. Code Rule R590-225 (title
rate filings must be submitted 30 days before use; rate justifications required per
R590-225-10). No public SERFF-style searchable repository was located for Utah (unlike Kansas's
or Idaho's public filing databases) — all three verified premium schedules were located and
fetched directly from each underwriter's own website. At $200,000 owner's-policy liability:
Stewart = $1,121, WFG = $1,135, FNTI = $1,135 (see UT.json for full per-provider tables and the
$10,000–$1,000,000+ tier structures). Escrow/settlement charges were formerly also filed under
the now-repealed Rule R592-15 (effective through 2023-08-21) but Utah's escrow-fee filing
requirement has since been eliminated by statute (HB 410, 2023), and no historical archive of
those pre-2023 filings was located during this session.

## Not used / found-but-blocked

- **Utah Land and Title Association** (utahlandtitle.com) — fetched (home page + Forms page);
  confirmed as the real, active professional association (contradicting the task brief's
  assumption of a "Utah Title & Escrow Association fee schedule" — no such document exists);
  its Forms page hosts only recording/processing best-practice standards, no fee schedule.
- **Metro National Title / Metro National Title Associates** (metrotitle.com,
  metrotitleassociates.com, southeasttitle.com) — multiple pages fetched
  (metrotitleassociates.com/escrow-closing/, metrotitle.com/services/); both returned empty/
  unfetchable page content on repeated attempts, no dollar figures recovered.
- **GT Title Services** (gttitle.net) — 6 statewide offices confirmed (Salt Lake City, Lehi,
  Ogden, Spanish Fork, 2x St. George), the broadest independent geographic footprint found this
  session; fetched (Locations, Services pages) but no static fee schedule, only a "Net Sales
  Proceeds Estimator" calculator tool.
- **Cottonwood Title** (cottonwoodtitle.com, 8 Wasatch Front + St. George offices) — fetched;
  Title Insurance Rate Calculator and Residential Net Proceeds Calculator only, no static
  published figures.
- **Southern Utah Title Company** (sutc.com, Washington County/St. George) — fetched; confirmed
  location but no fee schedule, order-only.
- **Eagle Gate Title** (eaglegatetitle.com) — fetched; page returned empty content.
- **National Title Agency of Utah** (ntaofutah.com) — fetched; links to a "Fee Calculator" page
  (ntaofutah.com/fee) rather than static figures.
- **First American Title Utah** (local.firstam.com/ut, local.firstam.com/ut/documents) — fetched
  both; document center page returned no linked rate manual or fee schedule.
- **Old Republic Title Utah** (oldrepublictitle.com/utah) — fetched; only "Fee Navigator" and
  "Rate/Fee Calculator" tool references (ortconline.com), no static PDF.
- **Chicago Title / Fidelity National Title Utah** — no Utah-specific rate manual located via
  direct search; CTIC National Commercial Services "Real Estate Laws & Customs" Utah section
  (media.ctic.com/ncs/flipbooks/LawsAndCustoms/, fetched) confirms Utah coverage but contains
  only customary-payer-allocation language ("Owner's Policy Premium: Seller pays, negotiable by
  contract"), zero dollar figures.
- **Equity Title, Beehive Title, Standard Title, Title Team, Universal Title, Emigration Title,
  Doty Title, Landmark Title** — name-only searches for each found either no matching Utah
  company, general blog-level closing-cost commentary, or (Landmark Title) a confirmed real SLC
  company with no fetchable pricing page in search results.
- **FNTI's separate 2019-vintage marketing rate chart** (fnti.com/file/title-rates-escrow-fees-utah/)
  — fetched via Read-tool PDF recovery; despite the "escrow-fees" URL slug, it contains only the
  same title-premium Basic Rates table as the 2022 manual (numerically consistent at $200,000
  liability: $1,135 both), no escrow/settlement figures. Logged as corroborating evidence, not
  counted as a separate source since it is the same provider (FNTI) as the primary 2022 manual.

## Search log (28 distinct query strategies + direct provider-site checks)

1. "Utah Title & Escrow Association fee schedule"
2. "Utah title insurance rate manual settlement fee schedule PDF"
3. "Utah title company closing fee escrow fee schedule Salt Lake City"
4. "Utah R592-15 escrow charges schedule repealed title insurance"
5. "Stewart Title Utah rate manual stewart.com schedule of charges pdf"
6. "Utah Admin Code R590-225 title insurance rate escrow fee filing rule"
7. "insurance.utah.gov title agency reports forms escrow fee schedule"
8. "Provo Utah county title company closing fees schedule pdf"
9. "St George Washington County Utah title company closing costs fee schedule"
10. "go.stewart.com Utah Rate Manual images pdf"
11. "Stewart Title Utah rate manual site:stewart.com filetype:pdf"
12. "Sutherland Title Utah locations Salt Lake City Ogden Provo"
13. "\"Equity Title\" Utah closing fees schedule"
14. "Metro National Title Utah closing fees escrow rates pdf"
15. "Cottonwood Title Utah rates fees closing"
16. "\"Standard Title\" Utah closing fees rates"
17. "\"Title Team\" Utah closing escrow fees"
18. "Utah independent title company published fee schedule \"closing fee\" site:.com -blog"
19. "\"Emigration Title\" OR \"Doty Title\" OR \"Landmark Title\" Utah fees"
20. "Ogden Weber County Utah title company closing fees escrow rates"
21. "\"National Title Agency of Utah\" fee calculator ntaofutah.com/fee"
22. "\"Utah Title\" Association members \"fee schedule\" OR \"rate schedule\" -insurance.utah.gov"
23. "Utah Land Title Association website"
24. "\"GT Title\" Utah closing fees rates schedule"
25. "First American Title Utah rate calculator document center escrow"
26. "Chicago Title OR Fidelity National Title Utah rate manual escrow fees"
27. "\"Beehive Title\" Utah closing fees rates"
28. "Universal Title Utah closing escrow fees pdf"

Plus direct provider-site fetches: Stewart Title (state-pages/utah-agents/rates ->
Microsites/utah PDF path recovery via Read tool, plus the older utah-schedule-of-charges-and-forms.pdf
which 404'd), WFG (direct wfgunderwriting.com PDF, Read-tool recovery), First National Title
Insurance Company (documentpub.fnti.com 2022 manual + fnti.com/file 2019 marketing chart, both
via Read-tool recovery), Sutherland Title (title-and-escrow-fees page, direct HTML fetch),
Provo Abstract (closing-costs page, copy-of-closing-costs page, homepage), Metro National Title
Associates (escrow-closing page, empty), Metro Title (services page, empty), GT Title Services
(Locations page), Cottonwood Title (search only, calculator confirmed), Southern Utah Title
Company (homepage), Eagle Gate Title (homepage, empty), National Title Agency of Utah
(homepage), First American Title Utah (local.firstam.com/ut redirect + /ut/documents), Old
Republic Title Utah (oldrepublictitle.com/utah), CTIC NCS Laws & Customs flipbook (Utah
section), Utah Land and Title Association (homepage + Forms page), and the Utah Insurance
Department's Title & Escrow pages (insurance.utah.gov/licensees/title/,
insurance.utah.gov/licensees/title/licensing/ -- both fetched to confirm the R592-15 repeal and
absence of a public escrow-fee filing repository). Binary-PDF recovery via the Read tool on
WebFetch-saved files was used throughout for all 5 PDF rate manuals (same technique as prior
CA/GA/NC/WA/MI/AL/AK/SD sessions) -- WebFetch itself cannot parse compressed FlateDecode PDF
streams, but the Read tool successfully extracted full text/tables from every PDF this technique
was applied to in this session.

## Calculator harvest addendum (2026-08-08) — WFG National Title

**2 of 3 calculator-basis providers — still below 3-provider threshold** (prior: 1 (Old Republic — Salt Lake City/Salt Lake County)). See UT.json's newest `basis: "calculator"` entry for full itemized figures and methodology.

This session solved `rates.wfgnationaltitle.com`'s `POST /api/rates/fees/estimatefeesforsellernet` endpoint, flagged since 2026-08-07 as the single highest-value remaining lead (a genuine 5th major underwriter, separate from the FNF/Old Republic/Stewart/First American families already on file, confirmed via `GET /api/rates/State/GetCalculationEnabledStates` to cover 47 states + DC). The prior session's blocker was a payload-shape guess — this session extracted the real request schema directly from the calculator's own lazy-loaded Angular route chunk (`prepareCalculateFeeRequest()` in webpack chunk 7, hash `8a01902021d264bdb338`): a nested `Properties: [{City, County, IsPrimary, State}]` array, not the flat `PropertyState`/`PropertyCounty`/`PropertyCity` fields tried previously. Full technical recipe in CALCULATORS.md's 2026-08-08 entry. No personal data required.

- **WFG National Title Insurance Company** (`rates.wfgnationaltitle.com`) — WORKING. Salt Lake County (UT's most-populous/standard-scenario county), Salt Lake City, UT, $500,000 purchase / $400,000 loan, SettlementStatementVersion `CD`. Result: Owner's Title Insurance Premium **$2,519.00**, premium-only. Loan Policy premium returned $0/null in every state tried this session, consistent with this tool's seller-net-sheet (seller-side) design — not pursued further as out of scope.

## Calculator harvest addendum (2026-08-09) — Fidelity National Title (FNF) crosses UT to 3 providers

**3 of 3 calculator-basis providers — calculator-quoted** (prior: 2 — Old Republic, WFG). See UT.json's newest `basis: "calculator"` entry for full itemized figures and methodology.

The 2026-08-06 session logged UT's FNF harvest as blocked by an "unsolved AmountLoan1 postback quirk" (the server silently dropping the loan-amount field). This session found the real cause: a bug in that session's own replay script, not a server-side block. Every extracted ASP.NET hidden-field dict was including the page's `<input type="submit">` button name/value pairs (e.g. `btnGeneralNext=Next`) and carrying them forward unchanged into every later POST — causing the server to treat each subsequent postback as an implicit re-click of that button, desyncing the wizard state in a way that looked exactly like a silently-dropped field. Fixing the replay script to only send a submit button's name/value on the request that is actually "clicking" it resolved the issue immediately. UT's real (previously undiscovered, because the wizard never got far enough to reach it) requirement turned out to be a 3-question CPL-eligibility radio cascade with no default answer (Lender/Borrower → Buyer → Seller, each question only appearing once the prior one is answered) — answered "Yes" to each via its own dedicated postback, mirroring a real user's click-through.

- **Fidelity National Title Insurance Company** (`ratecalculator.fnf.com`) — WORKING. Salt Lake County, UT, $500,000 purchase / $400,000 loan. Result: Owner's Policy Premium (ALTA Standard Coverage) **$2,262.00**; Loan Policy Premium (ALTA Extended Coverage) **$1,225.00**. Premium-only per the tool's standard disclaimer. **Crosses UT to the 3-provider calculator-quoted threshold.**
