# Arkansas — Market Fee Evidence

## Status: complete (scarce market) — 3 verified premium sources, 0 published settlement/service-fee schedules, 2026-07-22

Arkansas is explicitly confirmed by two independent sources (WFG's rate manual and multiple
secondary web snippets) to be an **unregulated title-insurance-rate state** — title premiums are
not filed with any regulator, and each underwriter/agent sets its own customary rate. This session
verified **3 directly-fetched title insurance premium rate cards**: Stewart Title Guaranty (effective
2026-03-16, the most current-vintage rate manual found across this entire survey to date), WFG
National Title (2017), and Southwest Title Insurance Company / a First National Title Insurance
Company affiliate (2020, published as a marketing rate-chart flyer). All three explicitly separate
premium from settlement/closing/escrow charges, and none of the three — nor any independent
title/escrow company or attorney checked directly — publishes a settlement-fee dollar figure.
**8 distinct query strategies plus 5 direct provider-site checks** (Stewart, WFG, Southwest
Title/FNTI, First Title & Escrow [blocked], Eastern Title, Old Republic AR) found zero published
settlement-fee schedules. Marked **complete (scarce)** — at the 8-strategy threshold with only 3
verified sources, below the 6-source saturation floor.

## All-in service-stack range observed

**None available.** Zero of the 3 verified Arkansas sources contain a settlement, escrow, or closing
service fee dollar figure. The only quasi-settlement charge found is Stewart's Closing Protection
Letter fee: **$25.00 per party** receiving the CPL benefit (plus another $25 for a second mortgage/
HELOC involving a different lender). Secondary, non-verified web-search snippets repeatedly cited
a $300-$600 "closing/settlement fee" range and roughly 1% of sale price for escrow fees, and noted
that Arkansas title companies handle escrow while attorneys conduct closings/prepare legal
documents — but no title company, abstract company, or attorney firm published a static, dated
fee schedule confirming any figure in that range this session.

## Itemization / bundling patterns

- **Stewart's** manual (Definitions section) states explicitly: "A charge does not include the
  abstracting, searching and examination fee... [nor] any settlement fee, trustee fee, attorney fee,
  surveying fee, inspection fee, document fee, closing fee, escrow fee or any other fee associated
  with escrow."
- **WFG's** manual opens with an unusually direct disclosure, unique among all states surveyed so
  far: "Search and examination fees, as well as closing and escrow fees, are separate from title
  insurance premiums in the state of Arkansas. The state of Arkansas is an unregulated state, and
  the title insurance premiums herein are not filed rates."
- **Southwest Title's** rate chart is a marketing flyer format (city-skyline branded, not a formal
  legal filing document) but shows the identical pattern — premium-only figures, no settlement fees.
- Arkansas's unregulated-premium status did not translate into greater settlement-fee transparency;
  if anything, the complete absence of any filing requirement (unlike Alaska's AS 21.66.460, or even
  most filed-rate states' informal disclosure norms) appears to correlate with less public settlement-
  fee documentation, not more.

## Premium rate card (unregulated/unfiled state)

Representative Owner's Policy premium at $100,000 liability: Stewart (2026) = $75 fixed to
$20,000 + tiered add-ons ≈ $299; WFG (2017) = $3.50/thousand to $50,000 then $3.00/thousand =
$325; Southwest Title/FNTI (2020) Basic Rate = $365, Homeowner (expanded) = $457. All three
converge in the same general range ($299-$365) despite being unfiled/uncoordinated rates from
three different underwriters across a 9-year span of effective dates — a useful informal
cross-underwriter corroboration even in an unregulated market. Full liability-tiered schedules for
all three are recorded verbatim in AR.json.

## Not used / found-but-blocked

- **firsttitleservices.com/arkansas-title-closing/** (First Title & Escrow) — returned HTTP 403
  Forbidden on fetch, unusable.
- **easterntitle.com/arkansas** (Eastern Title) — fetched; describes services, no published fee
  figures, quote-only via "Start Your Order."
- **oldrepublictitle.com/arkansas/** — confirmed Old Republic operates in AR but no linked rate
  schedule or PDF found via search or direct navigation (search results for "Old Republic Arkansas
  rate schedule" returned only Washington, Montana, and Arizona documents).
- No Chicago Title or First American Arkansas-specific rate/escrow-fee PDF was found via search
  (search results for these underwriters + Arkansas returned only Arizona documents).
- Multiple named independent AR title/abstract companies (searched broadly by metro — Little
  Rock, Fayetteville, Jonesboro, Fort Smith, Rogers) returned no company-specific fee-schedule
  documents, only third-party blog/calculator estimate pages (Houzeo, ListWithClever,
  ConsumerAffairs, Rocket Mortgage, NewHomeSource, etc.), which are excluded as non-primary
  sources per the evidence rules.

## Search log (8 distinct query strategies + direct provider-site checks)

1. "Arkansas title insurance rate manual settlement fee schedule PDF"
2. "Arkansas title company closing fee escrow schedule Little Rock pdf"
3. "Arkansas independent title company \"closing fee\" OR \"settlement fee\" schedule Fayetteville OR \"Little Rock\" pdf"
4. "Arkansas title company \"our fees\" OR \"fee schedule\" closing settlement $ site:.com"
5. "Arkansas title agency rate calculator \"closing fee\" attorney escrow abstract company"
6. "Chicago Title OR \"First American Title\" Arkansas rate manual escrow closing fee pdf"
7. "\"abstract company\" Arkansas title insurance closing fee schedule Jonesboro OR Fort Smith OR Rogers"
8. "Old Republic Title Arkansas rate schedule escrow fee pdf"

Plus direct provider-site fetches: Stewart, WFG, and Southwest Title/FNTI rate PDFs (via WebFetch
+ Read-tool binary-PDF recovery, since WebFetch cannot parse FlateDecode-compressed PDF
streams directly — same recovery technique used in prior sessions for CA/GA/NC/WA/MI/AL/AK),
First Title & Escrow (blocked), Eastern Title, and Old Republic Arkansas.

## Calculator harvest (2026-07-31 session)

**1 of 3 calculator-basis providers found** (below the 3-provider threshold) — see AR.json's
`basis: "calculator"` entry for the full itemized figures.

- **TitleTech of Arkansas, LLC** (Rogers, AR/Benton County) — WORKING. Embeds a NetSheetCalc/
  TitleTap white-label instance, `app_id=393`, driven via the platform's plain unauthenticated
  `non-auth-ajax.php?action=getAppData` + `api/index.php/rate/<amount>/<rate-key>` JSON GETs (no
  browser, no personal data). Genuinely Arkansas-specific (confirmed by the company's own name/
  domain), unlike 3 other appids found in AR-flavored search results this session that turned out
  to be misattributed (see dead ends below). Statewide flat fees, no county tiering: Closing Fee
  $400, Search Fee $250, CPL $25, eFiling Fee $10, Recording Fees $125, Technology Fee $250,
  optional Mobile Notary $350, plus formula-driven Revenue Stamps/transfer tax and Owner's/Lender's
  title insurance premium.
- **Search-result misattribution dead ends** (same pattern documented in the 2026-07-30 SC
  session): 3 other `app.netsheetcalc.com` appids (523, 462, 444) surfaced in searches for
  "Arkansas...netsheetcalc" but their own `getAppData` JSON configs showed default states of
  TX, no-state (Cook/DuPage/IL county dropdown), and FL respectively — none are Arkansas
  instances, ruled out before use. A 4th (appid=438, "Elite Title Company") matches an
  already-logged Massachusetts tenant from the 2026-07-26 session, also not Arkansas — **note
  2026-08-02**: this specific appid was itself later corrected to Missouri, not Massachusetts (see
  MO.json) — either way, not Arkansas, no change to this entry's conclusion.

## Calculator harvest (2026-08-02 update) — 2nd provider found via the Title Midwest platform
Harvested **Hot Springs Title** (Garland County) via `forms.titlemidwest.com` ("Title Midwest"), a
newly-discovered multi-state shared calculator platform found the same session via Minnesota Secured
Title's own site (see MN.json/CALCULATORS.md for the platform's full discovery writeup) — located
directly in the platform's own open directory listing (tenant slug `HstCalc`). Plain unauthenticated
JSON GET: `ajax.asp?loantype=p&purchamt=500000&loanamt=400000` (single-county deployment, no
state/county parameter needed). Result: Net Lender's Title Policy Charge $100.00, Net Owner's Title
Policy Charge $1,655.00, Seller closing fee $325.00, Buyer closing fee $325.00 (Total of All Title
Charges $2,405.00 per the page's own total). Genuinely AR-specific (the page's own text references
Arkansas mechanic-lien-coverage rules). Both AR providers on file are single-county-office, statewide-
flat-fee operations — a $325 vs. $400 closing-fee spread between them is a useful cross-provider data
point. AR now has 2 of the 3 providers needed to cross the calculator-quoted threshold.
- **Capital Abstract & Title** (Van Buren, AR) — its own site links to a TitleClose.com tenant,
  `capitalabstract.titleclose.com`. Drove the full 3-step Consumer/Welcome -> Consumer/Search flow
  (StateID=4/Arkansas, CountyID=2790/Pulaski, CityID=5970/Little Rock, including the
  `__RequestVerificationToken` anti-forgery hidden field the VA-documented recipe didn't need to
  use explicitly) but every submission redirected back to `/Consumer/Welcome` with no order token
  — this tenant's `Access-Control-Allow-Origin` header is scoped to `aclearchoicetitle.com`, a
  different company name than Capital Abstract, suggesting this specific tenant may not actually
  be configured to price Arkansas/Pulaski County. Logged as a dead end, not gated or jsOnly —
  a future session could retry with a different AR county or investigate the aclearchoicetitle.com
  branding mismatch.
- **Elko** (`useelko.com`) — a nationwide white-label title-quote SaaS (575+ agencies per its own
  marketing) with an Arkansas-specific landing page, but every agency instance found
  (`legacytitle.useelko.com`, `gcstitle.useelko.com`, `executivetitle.useelko.com`) is a login-only
  portal with no public consumer-facing calculator — **gated**, no instance found with a guest/
  no-signin mode.
- **Closeline Settlements** (`closeline.com/gfe-calculator/`) — nationwide title company; its GFE
  calculator embeds an iframe to `lodestarss.com/Live/Closeline/Login/index.php?guest=1`
  (LodeStar Software Solutions), which requires an email address plus Google reCAPTCHA even in
  guest mode — **gated**, same platform/pattern already logged for Mattingly Ford Title Services
  (KY) in the 2026-07-29 session, no personal data entered.
- **MVT** (`mvt.com`, Mississippi Valley Title Services Company, an Old Republic agent operating in
  AL/MS — checked here after its GFE calculator surfaced in an MS search) — WORKING/no personal
  data, but premium-only (Owner's/Loan/Homeowner's/simultaneous-issue premiums, no settlement fee
  line items) — out of scope for the calculator-harvest mission.
- No working instance found for MyTitleRates.com, TRACcalculator/comparetitlecompanies.com
  (confirmed Colorado-only for its own consumer-facing tools, no AR `title_co_id` found via
  search), TitleCapture, or Qualia Connect for Arkansas this session.
- **Recommendation for a future session**: search for more independent AR title/abstract
  companies' own sites (Huntsville Abstract, Fort Dearborn Land Title, and The Title Firm all
  surfaced in searches but their `app.netsheetcalc.com` appids resolved to other states per above
  — worth checking each company's own domain directly for a *different*, correctly-configured
  appid rather than trusting the generic netsheetcalc.com marketing-page search result); revisit
  Capital Abstract's TitleClose.com tenant with a different county or a fresh investigation of the
  aclearchoicetitle.com branding mismatch.
