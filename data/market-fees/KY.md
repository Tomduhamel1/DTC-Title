# Kentucky — Market Fee Evidence

## Status: complete (scarce market) — 2 verified premium sources, 0 published settlement/service-fee schedules, 2026-07-22

Kentucky is a filed-rate (insurer-filed, not promulgated or rating-bureau-uniform) state for title
insurance premiums; premium schedules count as "good sources" under the completion contract for
filed-rate states. Kentucky is also an "attorney-for-title/docs" state (Kentucky Bar Association
Opinion U-58 requires an attorney to prepare deeds and mortgages, though a lay closer may conduct
the closing itself) -- the same structural pattern seen in AL/GA/VA that tends to route settlement
pricing through private attorney arrangements rather than published rate cards. This session
verified **2 directly-fetched title insurance premium rate manuals** -- Stewart Title Guaranty
(effective 2024-12-02) and WFG National Title (effective 2023-08-01). Both explicitly disclaim
settlement/closing/escrow fees as separate from the priced premium and unpublished. **16 distinct
query strategies plus 13 direct provider-site checks** (Stewart, WFG, First American [blocked
twice], Old Republic, Chicago Title/Fidelity, Guardian Title of Kentucky, Kentucky Land Title
Agency, Legacy Title, BesTitle, First Title & Escrow, Key Title & Closing [confirmed wrong
jurisdiction], Ivy Pointe Title, and a Kentucky closing-attorney-firm "customary fees" guide) found
**zero published settlement-fee dollar figures** anywhere. This matches the market-opacity pattern
already documented in AZ, CO, MI, MO, VA, AL, AR, WI, and IN. Marked **complete (scarce)** -- well
past the 8-strategy threshold with only 2 verified sources, both premium-only.

## All-in service-stack range observed

**None available.** Neither verified Kentucky source contains a settlement, escrow, or closing
service-fee dollar figure. The only quasi-settlement charges found are Closing Protection Letter
(CPL) fees, which the two underwriters price differently: Stewart charges **$50 lender / $25
buyer-borrower / $25 seller** (plus $50 for an additional second-mortgage/HELOC CPL from a
different lender), while WFG charges a **flat $50 to any party** (lender, lessee, seller, or
buyer/borrower) regardless of role -- a genuine, verified cross-underwriter difference in this
ancillary charge, even though neither underwriter prices settlement/escrow fees. Secondary,
non-verified web-search/blog snippets repeatedly cited Kentucky "total title-related closing
costs" of $2,000-$6,000 and closing-attorney flat fees of $500-$1,250, and one search-tool
synthesis fabricated a nonexistent "KRS 381.990(1)" statutory fee cap that did not survive direct
verification against the actual statute (the real KRS 381.990 is a penalties section unrelated to
fee caps) -- both excluded from the evidence base per the "fetched and verified this session" rule.

## Itemization / bundling patterns

- **Stewart's** manual (Definitions + General Provisions) states the charge "does not include the
  abstracting or searching fee, examination fee, settlement fees, closing fees, or escrow fees" and
  further excludes "attorneys' fees, escrow or closing services, inspections or other services
  charged by local attorneys, title agents, surveyors, abstractors, or abstract companies."
- **WFG's** manual (Section 1, Introduction) states the premium is "all-inclusive" for title
  insurance risk and service/work, but explicitly excludes "title search, surveys, escrow, closing
  services, settlement services, recording fees, other charges."
- A companion WFG informational bulletin (KY 2020-01) independently confirms Kentucky imposes a
  **municipal premium tax** that varies by county/municipality (per the KY Dept. of Revenue's
  annually-updated tax schedule) and applies not just to the base premium but also to
  endorsements and to Closing Protection Letters -- a real, dated regulatory data point, though not
  itself a settlement-fee figure.
- Neither underwriter publishes any metro/county-level pricing breakout; both manuals apply one
  statewide rate table (aside from the municipal premium tax, which is county-specific but sourced
  from a separate KY Dept. of Revenue schedule, not the rate manuals themselves).
- Kentucky's attorney-involvement requirement for deed/mortgage preparation (KBA Opinion U-58),
  found via secondary search snippets and not independently verified as primary-source evidence,
  plausibly explains why static settlement-fee schedules are difficult to find publicly --
  consistent with the same pattern documented in AL, GA, and VA.

## Premium rate card (filed-rate state)

Both manuals use a per-$1,000-of-liability tiered structure with a $200.00 minimum premium (higher
than Alabama's $125 minimum). Representative Owner's Policy premium at $100,000 liability: Stewart
(eff. 2024-12-02) = $5.00/thousand flat up to $100,000 = $500.00; WFG (eff. 2023-08-01) =
$4.50/thousand flat up to $100,000 = $450.00 (Standard coverage) or $5.25/thousand = $525.00
(Expanded/Homeowner's coverage). Full liability-tiered schedules for Owner's, Loan, refinance
credits, simultaneous-issue rates, specialty products, and CPL charges are recorded verbatim in
KY.json.

## Not used / found-but-blocked

- **momentumclosings.com/wp-content/uploads/2024/11/First-American-Kentucky-5-5-2024.pdf** --
  First American's Kentucky rate schedule (effective 2024-05-05) was located via search but the
  hosting site returned an anti-bot CAPTCHA challenge (HTTP 202 with `sg-captcha: challenge`
  header) on direct fetch; no alternate mirror of this document was found despite searching
  virtualunderwriter.com (which hosts only Stewart's Kentucky manuals) and First American's own
  agency.firstam.com/ky and firstam.com/title/ky pages (neither links to a downloadable rate
  manual). Excluded per the "fetched and verified this session" rule.
- **oldrepublictitle.com/kentucky/agency/** and **oldrepublictitle.com/rate-calculator/?location=kentucky**
  -- fetched; contact-directory page and interactive calculator only, no static fee figures.
- **guardiantitleky.com** (Guardian Title of Kentucky, Louisville) -- site explicitly states
  "please call our office for a quote based on your specific transaction"; no published schedule.
- **kentuckylandtitle.com** (Kentucky Land Title Agency, Northern Kentucky/Cincinnati) -- no
  published fee schedule found on the site.
- **bestitle.com/title-insurance-faqs-for-ohio-west-virginia-and-kentucky/** -- fetched; states
  rates "vary by state but are regulated, and we're happy to provide a quote anytime," no figures.
- **firsttitleservices.com/kentucky-title-closing/** -- returned HTTP 403 Forbidden on fetch.
- **keytitleclosing.com/rate-calculator.html** -- fetched; confirmed to be a Minnesota-based
  company publishing only Minnesota fee figures ($495 underwriting fee, $375 closing/settlement
  fee, $80 courier/e-recording/wire fee) despite surfacing in a Kentucky-targeted search; excluded
  as wrong jurisdiction (same cross-state-domain-collision pattern as ID's pioneertitlecompany.com
  false match).
- **ivypointetitle.com/fee-calculator/** (serves OH and KY) -- fetched; interactive calculator
  referral only, no static base figures displayed.
- **sbwhlaw.com/library/guide-to-kentucky-real-estate-transactions-and-customary-fees.cfm** --
  fetched; confirmed to be a customary-payer-allocation guide (who typically pays what), not a
  priced fee schedule -- same exclusion pattern as Old Republic's "Guide to Closing Costs" in CA/CO.
- No Chicago Title, Fidelity National, or First National Title Insurance Kentucky-specific static
  rate-manual PDF was found via search; Fidelity's own "Laws & Customs" guide for Kentucky
  describes customary payer allocation only, no dollar figures.
- The 2013-vintage Stewart Kentucky manual (stewart.com/content/dam/stewart/kemp-title/pdfs/...)
  is superseded by the verified 2024-12-02 manual and was not separately logged as a source.

## Search log (16 distinct query strategies + direct provider-site checks)

1. "Kentucky title insurance premium rate filed regulated Department of Insurance"
2. "Kentucky title insurance settlement fee schedule closing costs"
3. "\"Kentucky\" title insurance rate manual filetype:pdf Stewart OR \"First American\" OR \"Old Republic\" OR WFG OR Fidelity"
4. "Kentucky independent title company closing fee schedule \"settlement fee\" Louisville OR Lexington"
5. "site:go.stewart.com Kentucky rate manual"
6. "\"Kentucky\" title insurance rate schedule site:oldrepublictitle.com OR site:wfgnationaltitle.com OR site:firstam.com"
7. "WFG National Title Kentucky rate manual filetype:pdf"
8. "\"First National Title Insurance\" Kentucky rate manual filetype:pdf"
9. "Kentucky Department of Insurance title insurance rate filing search"
10. "wfgunderwriting.com kentucky rate manual filebase"
11. "ratecalculator.fnf.com Kentucky title insurance rate manual"
12. "Kentucky independent title company \"closing fee\" OR \"settlement fee\" schedule pdf Louisville Lexington"
13. "\"Guardian Title of Kentucky\" OR \"Kentucky Land Title Agency\" OR \"Legacy Title Company\" closing fee schedule"
14. "Kentucky attorney closing state title insurance who conducts closings"
15. "Kentucky title closing attorney \"flat fee\" OR \"closing fee\" $ Louisville OR Lexington OR \"Northern Kentucky\""
16. "\"Kentucky\" title company \"closing fee\" OR \"settlement fee\" \"$\" -blog -calculator site:.com pdf"
17. "Kentucky title agency price list PDF \"title search\" \"closing fee\" 2025 OR 2026"
18. "Kentucky Revised Statutes title insurance agent escrow settlement fee filing requirement KRS 304"
19. "Chicago Title Kentucky closing fee schedule OR Fidelity National Title Kentucky settlement fee"
20. "\"806 KAR\" title insurance Kentucky escrow closing fee filed rate chapter 15"
21. "\"Key Title\" Kentucky closing settlement fee schedule Louisville"
22. "\"first american\" Kentucky title insurance rate manual pdf agency.firstam.com/ky OR firstam.com/title/ky"
23. "virtualunderwriter.com Kentucky First American rate manual pdf"

Plus direct provider-site fetches: Stewart and WFG rate-manual PDFs and WFG's KY 2020-01
informational bulletin (via WebFetch + Read-tool binary-PDF recovery, since WebFetch cannot parse
FlateDecode-compressed PDF streams directly -- same recovery technique used in prior sessions for
CA/GA/NC/WA/MI/AL), momentumclosings.com (CAPTCHA-blocked), agency.firstam.com/ky,
oldrepublictitle.com (agency page + rate calculator), Guardian Title of Kentucky, Kentucky Land
Title Agency, BesTitle FAQ page, First Title & Escrow (403), Key Title & Closing (confirmed
wrong-state), Ivy Pointe Title, sbwhlaw.com's customary-fees guide, and virtualunderwriter.com's
Kentucky location page.

## Calculator harvest addendum (2026-07-29)

Separate from the published-schedule survey above (which remains **complete (scarce)**),
this session harvested Kentucky's first provider quote calculator for the standard
$500,000/$400,000 purchase scenario — see KY.json's entry marked `"basis": "calculator"`
and CALCULATORS.md for full technical detail.

**Agency Title, Inc.** (Louisville/Jefferson County market; the same operator's Indiana
office is documented in IN.md/IN.json) embeds a second, Kentucky-specific instance of
the NetSheetCalc/TitleTap white-label platform (`appid=582`), found via the same
`non-auth-ajax.php?action=getAppData&app_id=582` unauthenticated JSON endpoint used for
the Indiana instance. The municipality dropdown (416 KY municipalities) confirmed
"Louisville Urban Services"/"Dist Louisville-Jefferson" entries — i.e. Jefferson County,
KY's most-populous county, is within this instance's service footprint. Hardcoded
flat-dollar constants returned: Lender's Title Insurance Premium $200.00, Closing
Protection Letter $50.00, Deed Recording Fee $54.25, Mortgage Recording Fee $130.25,
E-Recording Fee $10.00, POA Prep Fee $125.00. Unlike the Indiana instance, this
config's "Settlement Fee" field itself ships with no hardcoded default (blank), so no
flat settlement-fee dollar figure could be recorded for this provider.

This is 1 of the 3 calculator-basis providers needed for KY to reach calculator-quoted
status (still below threshold).

Also checked and logged as **gated** this session: Mattingly Ford Title Services
(Louisville, KY) embeds LodeStar Software Solutions' fee calculator
(`lodestarss.com/Live/Mattingly_Ford/Login/index.php?guest=1`) — even the "guest" mode
requires entering an email address plus passing a Google reCAPTCHA before any quote is
shown; no personal data was entered per the hard rule, and the reCAPTCHA is JS-only
regardless. See CALCULATORS.md.

## Calculator harvest addendum (2026-08-05)

This session harvested **2 more Kentucky calculator-basis providers**, crossing KY to
**3 total calculator-basis providers** — the calculator-quoted threshold — alongside
Agency Title, Inc. already on file. Full itemized figures for both new entries are in
KY.json (`"basis": "calculator"`); technical recipes are in CALCULATORS.md.

**Rounsavall Title Group, LLC** (4360 Brownsboro Road, Suite 102, Louisville, KY 40207;
phone 502-893-3336; independently verified against the company's own site,
`rtitlegroup.com`) runs a separate, independent NetSheetCalc/TitleTap tenant (`app_id=479`)
on the same platform as Agency Title Inc.'s already-catalogued instance — a distinct
company, not a shared account. This tenant's Owner's Title Insurance Premium and Local
Government Premium Tax fields are formula-driven (referencing a tenant-specific rate-table
key, `Kentucky479`) rather than flat constants; both were resolved via the platform's own
public `api/index.php/rate/<amount>/<key>` GET endpoint. For Jefferson County/Louisville at
the standard $500,000/$400,000 scenario: Lender's Title Insurance Premium **$200.00** (flat),
Owner's Title Insurance Premium **$1,940.00** (formula-driven; shown only if the tool's
"buyer pays owner's policy" toggle is set to Yes — the tool's own default is No/seller-pays,
so this figure was captured by directly replicating the formula/API call), and Local
Government Premium Tax **$97.00** (Jefferson County's 0.05 mill-multiplier applied to the
$1,940 owner's-premium base) — the first calculator-sourced dollar figure on file anywhere
in KY's evidence base for the municipal premium tax that Stewart's and WFG's rate manuals
reference but do not price. No settlement/closing/doc-prep/search/escrow/CPL fee fields
exist anywhere in this tenant's schema.

**Old Republic Title Insurance Company** (`ortratecalculator.oldrepublictitle.com`,
`Location=KY`/internal numeric code 16) is a classic ASP.NET WebForms + UpdatePanel postback
app, previously logged in this file's "Not used / found-but-blocked" section as
"interactive calculator only, no static fee figures" — that was based only on visiting the
landing page; this session drove the actual 3-step postback flow (select policy category ->
select policy types/enter amounts/address -> Calculate) with a plain cookie-jar session, no
browser/JS needed, and captured a fully itemized result. A placeholder, non-identifying
address ("Main Street", Louisville, KY 40202 — no real address or personal data) let the
tool's own address-verification lookup auto-resolve the correct local tax jurisdiction,
"LOUISVILLE URBAN SERVICES DIST" (Jefferson County). At $500,000 purchase / $400,000 loan,
Simultaneous Loan & Owner's policy category, Basic coverage: Owner's Basic Policy Premium
**$2,075.00**, Lender's Simultaneous Basic Policy Premium **$225.00** (Lender's-only
stand-alone would be $1,405.00), Grand Total Policy & Endorsement Premium **$2,300.00**
combined, plus a county-specific "Fees / Taxes: LOUISVILLE URBAN SERVICES DIST" line of
**$115.00** combined ($70.25 lender-only) — a second, independent calculator-sourced dollar
figure for Kentucky's municipal premium tax at Jefferson County, corroborating (with a
different dollar figure, reflecting a different underlying rate schedule) the Rounsavall
Title Group figure above. Total Premium & Endorsement & Fees/Taxes: **$2,415.00** combined
/ $1,475.25 lender-only. The tool's own Closing-Disclosure-formula line gives the
TRID-disclosed incremental cost of the Owner's policy as **$895.00**
(`$2,300.00 combined total - $1,405.00 lender's-only total`). Selecting the CPL-Lender and
CPL-Purchaser endorsement checkboxes produced no separate dollar line (totals were
byte-identical with or without them) — logged so a future session doesn't re-try expecting
a distinct CPL figure from this specific tool/jurisdiction/policy-type combination.
Title insurance premium and the one county tax line only — like Stewart's and WFG's manuals
already on file, this tool prices no settlement/closing/escrow service fees.

**Also checked this session, not usable**:
- **Kentucky Title Center** (`kentuckytitlecenter.com`) and **Title Center of Greater
  Kentucky** (`titlecentergreaterky.com`) both link to the same underwriter-level calculator,
  `invtitle.com/calculator` (Investors Title Insurance Company), which itself embeds
  `invtitle.titlecapture.com/title-quote-uw` — the already-catalogued **jsOnly** TitleCapture
  platform. Not a distinct first-party agency calculator; not pursued further.
- **Metro Title** (`metrotitleky.com/calculators/`, Louisville) embeds the already-catalogued
  **jsOnly** TRGC "PowerSnap" Angular SPA (`mobile.trgc.com/powersnap/`) — confirms PowerSnap's
  Kentucky footprint extends beyond the previously-logged Upward Title & Closing tenant to at
  least one more KY agency, but adds no new usable data (same platform-level jsOnly block).
- **calculator3.mytitlerates.com/calculator/98** — a Kentucky option (`calculator_id=328`)
  exists in this tool's state dropdown, but the page's own branding explicitly identifies it
  as "MyTitleRates Demo" (an AdminLTE admin/demo shell, not a real agency's branded public
  quote page) — not attributable to any genuine Kentucky provider per the misattribution-guard
  standard used throughout this catalog; not harvested. Confirms the prior session's
  characterization of this specific instance as a demo/admin backend, not a public tool.
- No `calculator.mytitlerates.com/rateCalculator.php?a=<id>` (the main MyTitleRates.com
  platform, distinct from the demo instance above) or `<agency>.titleclose.com` Kentucky
  tenant was found via web search this session.
- Third-party aggregator estimators (StateCalc, AnytimeEstimate, LoanElk, MintRates,
  RealEstateWitch, ListWithClever, Rocket Mortgage, Houzeo) surfaced repeatedly for Lexington/
  Kentucky searches — all out of scope per the "providers' own calculators" mandate already
  established elsewhere in this catalog (StateCalc and AnytimeEstimate specifically already
  logged as out-of-scope aggregators; the same reasoning applies to the others).

KY is now **calculator-quoted (3 providers)**: Agency Title, Inc.; Rounsavall Title Group,
LLC; and Old Republic Title Insurance Company.

## Richness pass (2026-08-19) — FNF national rate calculator, Jefferson County
`ratecalculator.fnf.com` (already-solved recipe, reused nationwide), Jefferson County (Louisville).
Premium-only: Owner's Policy Premium $2,075.00 (Disclosure $895.00 + Adjustment $1,180.00), Loan
Policy Premium $225.00, Closing Protection Letter Coverage $0.00 (a genuine zero figure, recorded
as-is). Grand Total $2,300.00. Crosses KY to **calculator-quoted (4 providers)**. See KY.json's 4th
`"basis": "calculator"` entry for full detail.

## Calculator harvest addendum (2026-08-20) — richness pass: WFG National Title + Stewart Rate Calculator

Richness pass per the 2026-08-19 session's own recommendation (check tracker coverage for already-solved nationwide recipes — Stewart's `/api/SRC/quote`, WFG's Seller Net Sheet API — before hunting a new platform). Prior: 4 calculator-basis providers. This session adds 2 corroborating provider(s), bringing KY to **6 calculator-basis providers**. See KY.json's newest `basis: "calculator"` entries for full itemized figures and methodology.

- **Stewart Title Guaranty Company** (Stewart Rate Calculator, `stewartratecalculator.com`) — matched settlement office **Emerald Title Group, LLC**. Owner's Policy Premium **$2,075.00**, Lender's Policy Premium **$1,405.00**, 3 itemized settlement/closing-fee line item(s).
- **WFG National Title Insurance Company** (Seller Net Sheet Rate Calculator, `rates.wfgnationaltitle.com`) — Owner's Title Insurance Premium **$2,025.00**, premium-only (no itemized settlement fee configured for this state in this tool).
