# Market Fee Calculators — Catalog

Tracks every provider quote calculator investigated for the calculator-harvest mission (see
PROGRESS.md's "Calculator harvest tracker" section for per-state harvest counts). Each entry is
marked **working** (harvested this session or confirmed harvestable via plain HTTP/discoverable
JSON, no browser needed), **gated** (requires personal contact info before quoting — never
entered per the hard rule against fabricated personal data), or **jsOnly** (JS-driven SPA with no
discoverable stateless endpoint that returns a final quote — queued for a browser-driven session).

## Big-four brand calculators (national, cross-state)

### FNF family (First American? no — Fidelity National Financial brands: Chicago Title, Fidelity
National Title, Commonwealth, Ticor, etc.)
- **ratecalculator.fnf.com** (`?ID=<brand>&state=<ST>`, e.g. `?ID=FNF&state=PA`,
  `?ID=nationalgranite&state=ny`, `?id=weichert`) — **2026-07-25 update: NOT actually jsOnly,
  WORKING via plain HTTP, but premium-only, out of scope for the calculator-harvest mission.**
  This is a classic ASP.NET WebForms `__doPostBack`/`__VIEWSTATE`/`__EVENTVALIDATION` app (same
  pattern as Old Republic's ortconline.com tool below) -- fully drivable with a plain
  `requests.Session()`, no JS execution needed at all, contrary to the prior session's assessment.
  Recipe: (1) GET `?ID=<brand>&state=<ST>` to capture hidden fields; (2) POST with
  `ddlCounty=<lowercase county name>` and `__EVENTTARGET=...ddlCounty` to select the county; (3)
  POST with `btnGeneralNext=Next` (a real submit button, `__EVENTTARGET` empty) to advance to the
  Amounts step; (4) POST with `pnlAmountsTransactionQuestions$0$TranType$ddl=PropertyPurchase` +
  matching `__EVENTTARGET` to select transaction type, which reveals amount fields; (5) POST
  `AmountPurchase$txt=<sale price>` (own `__EVENTTARGET`) then `AmountLoan1$txt=<loan amount>`
  (own `__EVENTTARGET`) -- `PropertyType` defaults to `residential`, `PolicyForm` defaults to the
  standard ALTA forms, all fine for the standard scenario; (6) POST `btnFinish=Finish` for the
  final quote. Verified end-to-end for PA/Philadelphia County: returned a full premium quote
  (Owner's $570 disclosure/$2,735 adjustment/$3,305 total; Loan policy $0 under the Concurrent
  Owner's & Loan rate). **However the tool's own disclaimer states explicitly: "the totals...may
  not include any other amounts, such as charges/fees related to title search, examination,
  additional work charges, certification, or closing"** -- i.e. it is a title-insurance-premium
  calculator only, structurally incapable of producing the itemized settlement/service fees this
  mission targets. Not pursued further for that reason (would only ever duplicate premium data
  already on file from rate manuals). A CPL toggle exists (`IsClosingService$rc_IsClosingService`,
  confusingly named) but setting it to "Yes" produces no separate CPL dollar line in the output --
  the disclaimer text just becomes conditionally present, no dollar figure attached. Useful as a
  premium corroboration source for a future session if a state's premium-side evidence ever needs
  it, but not calculator-harvest evidence.
- **rates.fntg.com** — **jsOnly** (not re-tested 2026-07-25; may share the same WebForms
  architecture as ratecalculator.fnf.com above and be crackable with the same technique --
  untested this session, worth a quick check before assuming it needs a browser).
- Status: ratecalculator.fnf.com's WebForms flow is solved (see above) but out of scope by design
  (premium-only). rates.fntg.com still needs verification.

### First American
- **firstam.com/title-fee-calculator/index.html** — landing page only, links to facc.firstam.com;
  no technical details in itself.
- **agency.facc.firstam.com** (First American Comprehensive Calculator, "FACC") — **jsOnly**
  (with a partial API). Confirmed ASP.NET MVC app; `/scripts/Calculator_Mobile.js` reveals a real
  jQuery-AJAX JSON API at `Calculator/{PurposeOfTransactions, PropertyTypes, PropertyTypes1,
  Cities, ClosingCities, CitiesWithDefault, IsClosingStateAvailable, PolicyEndos,
  EndorsementOnly, ShowAddLoansDialog, Next, ...}`. However `Calculator/Next` (the final
  quote-request submission) responds by redirecting the browser to a further `Questions` page
  rather than returning the itemized quote in its JSON response — meaning the actual dollar
  figures live behind at least one more stateful step this session didn't map. Not usable as a
  stateless GET/POST harvest without deeper reverse engineering or a real browser session.
- Status: queued for browser-driven session; the `Calculator/*` endpoint list above is a useful
  starting map for whoever picks this up next.

### Old Republic Title
- **ortconline.com/Web2/productsservices/informationservices/ratefeecalc/default.aspx** —
  **WORKING** (harvested this session, no browser needed). Classic ASP.NET WebForms postback form
  (`__VIEWSTATE`/`__EVENTVALIDATION`/`__EVENTTARGET`) driven via direct HTTP GET/POST with a
  `requests.Session()` cookie jar. Flow: (1) GET page, capture hidden fields; (2) POST with
  `__EVENTTARGET=...PropertyStateList` and the state code to trigger county/city dropdown
  population; (3) POST with `__EVENTTARGET=...PropertyCountyList` (or `...PropertyCityList` for
  city-tiered states) and the chosen county/city; (4) for city-tiered states where the city maps
  to multiple counties (e.g. Kansas City, MO spans Jackson/Clay/Platte/Cass), an intermediate POST
  selecting a specific zip via `...PropertyZipList` is required to disambiguate — the server
  returns `"We could not determine the property county..."` otherwise; (5) final POST with
  `SalesPrice`, `LoanAmount` set and `...Submit=Submit` clicked (as a real `<input type=submit>`,
  not a doPostBack target) returns the itemized quote inline in the same page's `ResultsPanel`.
  **Gotcha**: the form's `ReoList` radio (REO Yes/No) is absent from the DOM for most
  state/county combinations; including a `ReoList` value in the POST body when the control isn't
  actually rendered causes a hard **HTTP 500** from the server (confirmed reproducible across
  every county tested) — omit it entirely. The `Your Name` / `Your Company` / `This estimate is
  being prepared for` fields are optional (no required-symbol asterisk) and were left blank
  throughout — no personal data entered, satisfying the hard rule.
  - **State coverage in this tool**: AZ, CA, HI, MO, NM, NV, OH, OK, OR, TX, UT, WA (county- or
    city-tiered dropdowns; not a nationwide tool). CA/WA/OK/TX are already saturated/complete in
    the published-schedule survey; the other 8 (AZ, HI, MO, NM, NV, OH, OR, UT) are all "complete
    (scarce)" states and have now been harvested (1 provider each — see PROGRESS.md tracker and
    each state's .json/.md for full itemized results). This exhausts every state in this tool's
    footprint that wasn't already saturated/complete — no further *new states* are reachable via
    Old Republic's calculator alone. Pushing any of these 8 states to the 3-provider threshold
    requires a second working calculator for that state (Stewart/WFG/FNF/FACC or an agency
    widget); as of 2026-07-23 all of those remain jsOnly, gated, or unreverse-engineered — see the
    2026-07-23 findings below for the specific blockers hit this session on Stewart and WFG.
  - **OR-specific gotcha (new 2026-07-23)**: OR's `PropertyCountyList` control renders
    empty-by-default and must be explicitly selected via its own postback (unlike HI/MO where the
    county combo auto-populates from the city choice). Also, OR's form does not render a
    `LienPayoffTextbox` control; posting a value for it anyway (reusing the HI/MO recipe verbatim)
    produced a hard HTTP 500 — the same "posting a field for a control that isn't in the DOM
    breaks the postback" failure mode as the already-documented `ReoList` gotcha below. General
    lesson for future harvests with this tool: always re-derive the field list fresh from each
    state's actual rendered form rather than reusing a fixed field set across states.
  - **OH-specific note**: this tool's OH footprint is only 15 northern-Ohio counties (Ashland,
    Cuyahoga, Erie, Geauga, Huron, Lake, Lorain, Lucas, Medina, Ottawa, Portage, Stark, Summit,
    Wayne, Wood) — Franklin County (Columbus, OH's actual most-populous county) is not served.
    Cuyahoga (Cleveland) was used as the highest-volume available proxy.

### Stewart Title
- **stewartratecalculator.com** — **partially working / API discovered, quote endpoint
  unreverse-engineered**. `/js/nrc.js` defines `const API_PREFIX = "/api/SRC/"` and calls a real
  JSON REST API. Confirmed working via plain GET this session:
  - `GET /api/SRC/transactiontypes?statecode=<ST>&networkid=&propertytype=residential` → returns
    `{"TransactionTypeList":{"TransactionType":[...]}}` with Refinance/Cash/Sale-with-Mortgage
    options.
  - `GET /api/SRC/propertysearch?value=<city, ST>` → returns an array of
    `{City, County, CountyFIPS, StateAbbrv, StateName, StateFIPS, ZipCode, ...}` matches — useful
    for resolving county FIPS codes needed by other endpoints (`providers`, `netsheetlookup`,
    `ernstlookup`, etc.).
  - Other discovered endpoints (not yet tested): `statesettings`, `policycoveragetypes`,
    `endorsements`, `providers`, `providerdetails`, `ernstlookup`, `netsheetlookup`,
    `policyinsuredtypes`.
  - The final **`POST /api/SRC/quote`** endpoint (where the actual itemized dollar figures would
    come from) submits `$('#frmCalculateRates').serialize()` — the *entire* form, including a
    large client-side-built JSON blob (`rateCalc.quoteRequestRoot`, assembled by
    `rateCalc.UpdateQuoteRequest()` across the whole wizard flow) stuffed into a hidden
    `hidQuoteRequestRoot` field, plus `hidStateSetting`, `hidNetworkID`, `hidCountyName`,
    `hidIsCalculatePremium`, `hidIsCalculateTitleServiceFee`, `hidErnstRequestData`, etc. This
    was **not** reverse-engineered this session (would require mapping the full
    `quoteRequestRoot` schema) — flagged as the most promising non-Old-Republic target for a
    follow-up session, since the individual GET endpoints prove the API itself has no
    authentication/session barrier.

### Stewart Title — 2026-07-23 update: `quote` endpoint schema mapped further, still failing (500)
This session made material progress reverse-engineering the `/api/SRC/quote` POST but did **not**
get a working final quote — recording the exact state reached so a future session (ideally
browser-driven) doesn't repeat the same dead ends:
- Confirmed 3 more stateless, no-auth GET endpoints beyond last session's `transactiontypes` /
  `propertysearch`: `policyinsuredtypes?statecode=<ST>&transactiontype=<full description string,
  e.g. "Sale/Purchase with Mortgage">` (returns `MP`/`OP` fee-type codes), `policycoveragetypes
  ?statecode=<ST>&transactionType=<description>&policyInsuredTypeCode=<MP|OP>&networkid=
  &propertytype=Residential` (returns coverage codes like `BASIC`/`HOP`; `propertytype` is
  required even though the site's own JS only conditionally sends it), and `providers?statecode=
  <ST>&countycode=<FIPS>&zipcode=<ZIP>&transactiontype=<SALE|REFI|CASH short code>&networkid=`
  (returns real provider IDs/names/addresses — `networkid=` empty works fine, and the plain `http`
  host 301-redirects to `www.` which itself sometimes further redirects, so use `curl -L`).
- Built a full `quoteRequestRoot.QuoteRequest` JSON object (TransactionInformation/PropertyAddress/
  PolicyInfo.PolicyList.Policy[LenderPremium,OwnerPremium]/Recording/Internal, per the field
  references in `/js/nrc.js`'s `UpdateQuoteRequest()`) and POSTed it form-urlencoded as
  `hidQuoteRequestRoot` alongside guessed values for `hidNetworkID`, `hidStateSetting` (the raw
  `statesettings` JSON), `hidQuoteType=3` (Loan Estimate), `hidCountyName`,
  `hidIsCalculatePremium`/`hidIsCalculateTitleServiceFee=true`, `TransactionType=SALE`,
  `LoanAmount`/`SalesPrice` — to `POST /api/SRC/quote`. Result: **HTTP 500, empty body**, no
  validation-error JSON (unlike every GET endpoint above, which return clean, informative 400s).
- Root cause not isolated. Most likely explanation: the real form's `hidQuoteRequestRoot` (and
  possibly other hidden fields) only exist in the DOM after the full JS wizard flow runs client-
  side (state select -> transaction type -> policy setup -> provider selection all trigger partial
  object construction) — this session's page-load HTML confirmed `hidQuoteRequestRoot` is **not
  present as a static form field at all** (it's created/populated by JS at runtime), so the exact
  field `name` attribute used at POST time (assumed to equal its `id`, a common but unverified
  ASP.NET MVC convention) could not be confirmed from static HTML alone.
- **Recommendation for next session**: this is now a browser-automation task, not a reverse-
  engineering one — the fastest path is driving the real wizard in a headless browser and
  capturing the actual network request Stewart's own JS sends (exact field names, full
  `quoteRequestRoot` shape actually used), rather than reconstructing it from `nrc.js` alone.

### WFG National Title — 2026-07-23 update: own rate calculator found, partially working but GATED
`dashboard.wfgnationaltitle.com/rates/` redirects to **`rates.wfgnationaltitle.com`**, an Angular
SPA ("WFG Rate Calculator: Escrow Calculator") with a real backend at
`rates.wfgnationaltitle.com/api/rates/`:
- `GET /api/rates/GeoInformation/FromState/<ST>` — **WORKING, no auth, no personal data.** Returns
  the state's full county list (with FIPS) and city list (with per-county city-ID arrays).
  Confirmed working for PA (67 counties, e.g. Philadelphia `countyID=470`/`fips=42101`). This
  alone is a nationally-useful lookup endpoint (not itself a fee source) for whoever picks up the
  `quote`/`sellernet` work next.
- `POST /api/rates/fees/estimatefeesforsellernet` — **WORKING but GATED-BY-DESIGN, not a usable
  evidence source.** No auth required and returns clean HTTP 200 JSON (`closingFeeEstimate.
  premiums.{lendersPremium, fullLendersPremium, ownersPremium}` plus an always-empty `hudFees`
  array). Tested the standard $500k/$400k PA/Philadelphia scenario across 24 combinations of
  `TransactionProductType.{ProductTypeId, TransactionTypeId}` (1-6 x 1-4): **the response was
  byte-for-byte identical every time** (`ownersPremium: 3635.50`, `lendersPremium: 0`,
  `fullLendersPremium: 0`, `hudFees: []`), regardless of the loan amount or product/transaction
  type submitted. This strongly indicates the endpoint is an intentionally-limited marketing
  "teaser" (a bare owner's-premium preview to drive signups for the full net-sheet product) rather
  than the real itemized-fee calculator — it does not compute a lender's premium or itemize any
  settlement/closing/recording fees no matter what is sent. **Do not use this endpoint as a
  calculator-basis source**; the single owners-premium number it returns is not verifiably
  parameter-driven and duplicates WFG's own already-verified filed-rate manuals at best.
  `POST /api/rates/sellernet/calculate` (full settlement statement, richer request shape partially
  mapped from `main.*.js`: `IsReissue`, `SettlementStatementVersion`, `SalesPrice`, `Loans[]`,
  `TransactionProductType`, `Endorsements[]`, `Properties[]`, `PriorLenderPolicy`,
  `PriorOwnerPolicy`, `calculateTaxRequest`) was identified but **not tested** this session (out of
  time budget) — flagged as the more promising WFG target for a future session, since it's the
  endpoint the real net-sheet UI actually uses, unlike the teaser endpoint above.

## Agency-level widgets (TitleCapture / Qualia / Palm Agent / Prism Powered)
Partially investigated 2026-07-23. **PalmAgent** (`palmagent.com`, an Angular SPA similar to WFG's)
was checked but its JS bundle returned an HTTP 305 on direct fetch (likely an SPA base-href/asset-
path quirk needing a real browser to resolve) — not yet resolved. **Prism Powered**
(`go.prismpowered.com`) is dead (502 Bad Gateway). **Commonwealth Land Title's** classic ASP
calculator menu (`commonwealthct.com/calculators_menu.asp`, an FNF brand, structurally similar to
Old Republic's postback-driven tool) is DNS-dead (host no longer resolves) — a promising lead that
no longer exists. A third-party site (`alphaadv.net`, John Granger's "Title Insurance Rate
Calculator" family covering CT/DE/FL/MD/NJ/NY/PA/SC/TX/VA) was found and ruled **out of scope**:
it's pure client-side JS math against an embedded premium-only rate table (not a provider's own
system, and not itemized settlement/closing fees) — does not meet the "providers' own public quote
calculators" mandate.

### TitleCapture — 2026-07-24 update: investigated directly, confirmed jsOnly, API hosts mapped
Named directly in the task brief. `titlecapture.com`/`www.titlecapture.com` is only the platform's
own WordPress marketing site (no calculator there). The real product is per-agency-subdomain:
`calculator.titlecapture.com` (bare, no agency) returns a plain HTML "Oops. Your company was not
found." page — confirming every real instance lives at `<agencyslug>.titlecapture.com`. Found and
fetched a live instance, `moderntitlegroup.titlecapture.com/title-quote` (linked from Modern Title
Group's own site, see below) — **jsOnly**: an Angular SPA (`main.<hash>.js` + `polyfills`/
`runtime`/`scripts` chunks, same build pattern as WFG's rate calculator). Its JS bundle references
3 distinct API hosts — `api.titlecapture.com/api-30/`, `api-node.titlecapture.com/`, and
`api-wb.titlecapture.com/apis/` — but no concatenated path segments were findable via static grep
(`"/api/..."` string literals), meaning endpoint paths are built from variables at runtime rather
than being static string literals in this bundle. `api.titlecapture.com` itself 403s on a bare
fetch (likely requires an Origin/Referer or auth header the SPA sets at runtime). **Recommendation
for a browser-driven session**: drive `<agency>.titlecapture.com/title-quote` for any of the target
scarce states and capture the real XHR/fetch calls to these 3 hosts — this would likely unlock many
states at once since TitleCapture is used by numerous independent agencies nationwide (not just
Modern Title Group).

### Qualia Connect — 2026-07-24 update: investigated directly, confirmed jsOnly (iframe/postMessage)
Named directly in the task brief. `qualia.com`/`www.qualia.com` is the platform's own corporate
site (no calculator there). The actual embeddable consumer product is **Qualia Connect's quote
widget**, found live on 2 agency sites this session: Endeavor Title (Maryland,
`endeavortitle.com/closing-cost-calculator`) and Modern Title Group's own MI site (both via a
`<script src="https://connect.qualia.com/quote-widget/scripts/init" data-token="...">` snippet with
an agency-specific token, e.g. `bAQ2Tvo7Bsxa39R5j` for Endeavor Title). Fetched the loader script
directly: it does **not** call a REST API itself — it injects two hidden `<iframe>` elements
(`activator` at `/quote-widget/ui/activator`, `stage` at `/quote-widget/ui/stage`) and communicates
with them via a `WindowMessenger` postMessage protocol (`registrationAcknowledged` / `settings`
events), passing the page's token into the stage iframe. Fetched the stage iframe's HTML shell
directly (`connect.qualia.com/quote-widget/ui/stage`) — it's a static shell (jQuery + Qualia's own
`semantic.min.js` UI framework) with no visible REST endpoint calls; the actual quoting logic loads
dynamically inside that iframe context after receiving the `settings` postMessage, which a plain
HTTP fetch cannot trigger. **jsOnly** — logged for a browser-driven session. Because this widget
recurs across many independent agencies' sites (found twice already, unprompted, in this session's
unrelated MI/MD searches), cracking its real backend API once would likely be a high-leverage,
multi-state unlock, same rationale as TitleCapture above.

### Modern Title Group (Ann Arbor, MI) — 2026-07-24: WORKING, a genuine in-house JS calculator
Found via general web search for MI title calculators, not one of the big-four/agency-platform
searches above. `moderntitlegroup.com/Calculator/Rate` embeds both a Qualia Connect widget AND a
TitleCapture-hosted quote page (both jsOnly, see above) **and its own separate, fully client-side
Vue 3 calculator** at `/js/views/rateCalculator.js`, fetched via plain HTTP GET — the complete
computation logic (a tiered per-thousand title-premium formula plus 6 flat ancillary fees: closing,
recording, courier, wire transfer, deed escrow, title search — separately priced for buyer/seller/
refi sides) is hardcoded as literal constants in the fetched JS source, fully readable and
computable without executing any JS. **Harvested this session** — see MI.json's `basis:
"calculator"` entry for full itemized figures at the standard $500,000 scenario. This is a
different pattern from every big-four/platform SPA investigated so far: a small independent
company's own hand-rolled calculator rather than a locked-down enterprise Angular/ASP.NET system,
and it happens to be genuinely itemized (unlike Independent Title Services' MI calculator, checked
the same session, which is premium-only client-side math and out of scope for this mission).
**Recommendation for future sessions**: search specifically for small/independent title agencies'
own custom calculators (view-source + grep for hardcoded fee constants in first-party JS, as done
here) rather than only chasing the big-four/platform SPAs — likely a higher-yield, lower-effort
target across the many scarce states still uncovered.

### Dead ends checked 2026-07-24 (logged so they aren't re-tried)
- **myticor.com/title-escrow-rates/** (Ticor Title, an FNF brand) — HTTP 404, page no longer
  exists.
- **velocity-title.com/rate-calculator** (Richmond, VA) — merely embeds WFG's own rate calculator
  (`rates.wfgnationaltitle.com/step1`), already documented above as gated/teaser; not a distinct
  source.
- **Independent Title Services** (`independenttitle.services/michigan-rates-calculator`, MI) — a
  genuine first-party client-side JS calculator (same discovery technique as Modern Title Group
  above) but premium-only (Basic Rate / Ext. Coverage Policy / Loan Premium, no settlement/closing/
  escrow fee line items) — out of scope for the calculator-harvest mission, though it would be a
  valid published-schedule-survey source if MI's premium-only tier needed another corroboration
  (it doesn't; MI already has 6 premium manuals on file).

## Independent-agency first-party APIs — WORKING, discovered 2026-07-25

### ALT Title / Associates Land Transfer Company LLC (PA) — WORKING, genuine itemized REST API
`alttitle.com/pa-title-insurance-quote-title-calculator/` embeds a first-party React app (a
WordPress plugin literally named "tiq") that calls a genuine, unauthenticated (nonce-only) JSON
REST API on ALT's own domain — no JS execution needed to reproduce, no personal data required.
- `GET alttitle.com/wp-json/tiq/v1/settings` — no auth. Returns the full PA county (and, for some
  counties, municipality/school-district) list plus `min_sale_price`/`max_sale_price`/
  `min_loan_amount`/`max_loan_amount`. Philadelphia County has no municipality/school-district
  sub-tiers (`{"name": "PHILADELPHIA"}`), simplifying the standard-scenario request.
- `POST alttitle.com/wp-json/tiq/v1/quote` — requires header `X-WP-Nonce: <nonce>` where the nonce
  is read from the page's embedded `window.TIQ_SETTINGS.nonce` (present in the raw page HTML on
  every fresh GET, no login needed). Body (JSON): `{policy_type, owners_policy, transaction_type,
  quote_type, county, municipality, school_district, sale_price, loan_amount,
  adjustable_rate_mortgage, hoa, condo, pa_1030}`. **Gotcha**: all enum values are lowercase
  (`"standard"`/`"enhanced"`, `"included"`/`"excluded"`, `"purchase"`/`"refinance"`,
  `"quick"`/`"custom"`) — sending them uppercase (a natural first guess) is silently accepted by
  the API but produces a degraded/wrong response (e.g. `owners_policy` defaults to excluded) with
  no validation error, so always verify enum casing against the plugin's own minified JS
  (`tiq/frontend/build/static/js/main.*.chunk.js`, search for the literal enum object definitions
  like `{INCLUDED:"included",EXCLUDED:"excluded"}`) rather than guessing from field names.
  `quote_type: "quick"` avoids the `"custom"` mode's `insured_name`/`property_address` fields
  (personal data, never send). Response is a fully itemized quote (title premium by coverage tier,
  endorsements, CPL, ALT's own $0 ancillary-fee lineup vs. a competitor-range comparison, and
  government recording/transfer-tax figures) — see PA.json's `basis: "calculator"` ALT Title entry
  for the full harvested result.
- **Generalization note**: the "tiq" plugin is WordPress-installable (`/wp-content/plugins/tiq/`)
  — if it turns out to be a licensed product used by other agencies (not confirmed this session),
  the identical `tiq/v1/settings` + `tiq/v1/quote` recipe would apply verbatim to any other site
  running it. Worth a quick `"wp-content/plugins/tiq"` web search in a future session.

### MyTitleRates.com — WORKING, major shared-platform find, plain HTML POST, no JS/auth needed
A white-label calculator SaaS product (`mytitlerates.com`, "MyTitleRates.com LLC") licensed to many
independent title agencies nationwide, each embedding an iframe at
`calculator.mytitlerates.com/rateCalculator.php?a=<agency-id>&results=<n>`. Despite being shared
infrastructure, **each agency ID reflects that agency's own real, distinct fee schedule** — not a
generic template — confirmed by harvesting two different PA agency IDs (`a=24` TitleWorks, `a=15`
Trident Land Transfer) at the identical standard scenario and getting materially different dollar
figures for every ancillary line item (Document Prep $295 vs. E-Doc Fee $125, Wire $0 vs. $7.80,
etc.). This satisfies the "providers' own public quote calculators" mandate per-agency, exactly
like TitleCapture/Qualia are treated per-agency elsewhere in this catalog — except this platform
turned out to be a **plain server-rendered PHP form**, not a JS SPA, so it needed no browser at all.
- Recipe: GET `rateCalculator.php?a=<id>&results=<n>` (form loads with a `state_picked` dropdown
  listing only that agency's served states, and county/city dropdowns once a state is picked via
  `?a=<id>&state=<state-option-value>`). POST to the same URL (`rateCalculator.php`, no query
  string needed on the POST) with all visible form fields: `state_picked`, `StatesKey` (a hidden
  field whose value is state-specific — re-fetch per state, don't reuse across states),
  `financeType=purchase`, `purchasePrice`, `loanAmount`, `enhancedCoverage=0` (standard coverage),
  `county` (option value from the state-specific dropdown; some agency/state combos have no county
  select at all — statewide pricing, e.g. Trident's NJ configuration), `city=0` (all
  municipalities) where a city select exists, the default-checked endorsement checkboxes (vary by
  state — inspect the actual rendered form, e.g. PA uses `end100`/`end300`/`end900`, NJ uses
  `alta81`/`alta9`/`surveyEndorsement`), `CustomerInfoOption=0`, `sent=2`, `page=2`,
  `test_calckey=<StatesKey's numeric state code>`, `a=<agency id>`. No cookies/session/nonce
  needed — a single stateless POST returns the full itemized HUD-1/Closing-Disclosure-style result
  page directly. No personal data fields are required (the `saveQuoteEmailAddress`/
  `saveQuoteCustomName` fields are for an optional "save/email this quote" feature, never used).
- Known agency instances (found and harvested this session): `a=24` = TitleWorks (PA/NJ/FL),
  `a=15` = Trident Land Transfer (NJ/PA). See PA.json and NJ.json for the harvested results.
- **Recommendation for next session**: search `"calculator.mytitlerates.com"` combined with target
  state names (VA, MD, CT, MA, WI, CO, etc. — the highest-population still-unharvested scarce
  states) to find more agency IDs; also try web-searching agency names already known to use the
  platform combined with other state names, since some agencies (like Trident) serve multiple
  states from one `a=<id>`. Do not attempt to enumerate `a=<id>` values sequentially/blindly —
  find agency names organically via search first, consistent with the mission's calculator-
  discovery approach elsewhere in this catalog.

### DCA Title (MN/WI) — WORKING for MN, blocked for WI, plain WordPress admin-ajax POST
`dcatitle.com/calculator/` runs a first-party custom WordPress plugin
(`wp-content/plugins/dcatitle-calculator/js/dcatitle-calculator.js`) whose source directly reveals
a plain, unauthenticated AJAX call — no browser needed, no personal data required.
- `POST dcatitle.com/wp-admin/admin-ajax.php` with `action=dcatitle_calculator_results` plus
  `transactionType` (`Purchase`/`Refinance`/`Second Mortgage`/`Construction`/`Contract for Deed
  Payoff`), `userType` (`Buyer`/`Seller`), `state` (`Minnesota`/`Wisconsin`), `county` (a plain
  MN county name for Minnesota, e.g. `Hennepin`), `saleAmount`, `loanAmount` (both capped at
  $1,000,000 by the tool's own client-side validation — informational only, not enforced by this
  recipe since we stay under the cap anyway), `lenderPolicyEndorsement` (`Yes`/`No`),
  `manufacturedHousing` (`Yes`/`No`). Response is `{"html": "<table>...itemized quote...</table>"}`
  — strip tags to read it. Confirmed working end-to-end for Minnesota/Hennepin County (Minneapolis)
  — see MN.json's DCA Title entry.
- **Wisconsin is configured in the same tool but not resolved this session**: the page's own JS
  (`toggleFields()`) hides the county-selection UI entirely when `state == 'Wisconsin'` (implying
  WI needs no county), but the server-side `admin-ajax.php` handler still rejects every request
  with `{"alert":{"type":"error","msg":"Please select a valid County value."}}` regardless of what
  `county` value is sent — tried empty string, `N/A`, `None`, `All`, `Any`, `Statewide`, and a real
  Minnesota county name (`Aitkin`, which instead produced a *different* error, "Please select a
  valid State value" — suggesting the server cross-validates county-belongs-to-state and reports
  the mismatch confusingly as a state error). The real WI county list is not present anywhere in
  the static page HTML or the calculator JS file — it likely loads via a separate AJAX call
  triggered by the state dropdown's `change` event that this session did not capture (the static
  fetch only shows Minnesota's initial DOM state). **Recommendation for next session**: either
  drive the page in a real/headless browser and change the state dropdown to Wisconsin to capture
  the resulting network request (should reveal the real WI county list or the correct payload
  shape), or grep the plugin's PHP source if it's ever exposed, or try common WI county names
  directly (Milwaukee, Dane, Waukesha) in case the earlier failures were simply due to trying
  Minnesota-specific or nonsense placeholder values rather than a structural block.

### Knight Barry Title Group (MN/WI/MI, likely more) — WORKING, ASP.NET WebForms, plain HTTP
`knightbarry.com/rate-calculators` links to per-state ASP.NET calculators at
`dashboard.knightbarry.com/Rates/<state>-rate-calculator.aspx` (confirmed working: `minnesota-`,
`wisconsin-`, `michigan-rate-calculator.aspx`; the same host likely also serves TX and FL per this
company's own marketing, both already saturated/complete in the published-schedule survey so not
checked). Classic ASP.NET WebForms (`__doPostBack`/`__VIEWSTATE`/`__EVENTVALIDATION`, Telerik
RadAjax controls present but a plain full postback works fine when async-specific headers are
omitted) — cracked with the exact same recipe as FNF's ratecalculator.fnf.com above, no browser
needed.
- Recipe: (1) GET `<state>-rate-calculator.aspx`; (2) if the state has a county dropdown
  (`ddCounties` — MN and WI have one, MI does not — statewide formula), POST with
  `ddCounties=<county's numeric option value>` and matching `__EVENTTARGET` to select it; (3) POST
  with `txtAmount=<sale price / owner's policy liability>`, `txtTridLoanAmount=<loan amount /
  loan policy liability>`, and `btnCalculate` clicked (`__EVENTTARGET` empty) for the final quote
  — leave the radio-button defaults (`rbFileType=Purchase`, `rbPolicyType=OPLP` i.e. both Owner's
  and Loan Policy, `rbPropertyType=R` residential, `rbUnderwriterPref` default) as rendered, they
  already match the standard scenario. No personal data fields exist on this form at all.
- **WI-specific structural note**: Wisconsin's calculator separately shows a federal Loan
  Estimate/Closing Disclosure-mandated rate (higher, per a WI regulatory rule) alongside the lower
  "Actual Charges to All Parties" actually collected, further split into 3 sub-scenarios (A/B/C)
  by who contractually pays the owner's policy — the richest single-tool disclosure structure found
  in this survey; capture both the LE figure and at least one Actual-Charges option when harvesting
  WI.
- Harvested this session: MN/Hennepin County (2nd MN provider), WI/Milwaukee County (1st WI
  provider — resolves the DCA Title WI blocker documented above via an independent source), MI
  statewide (2nd MI provider, alongside Modern Title Group).
- **Recommendation for next session**: try `dashboard.knightbarry.com/Rates/<state>-rate-
  calculator.aspx` for other state name slugs (e.g. `texas-`, `florida-` per the company's own
  claimed footprint, or other states Knight Barry may serve) — this is a working multi-state
  platform on the proven WebForms-postback technique, likely underexploited beyond the 3 states
  checked this session.

### CATICulator (caticulator.com) — 30-state platform, auth pattern cracked, Calculate not completed
Discovered 2026-07-25 during the CT blocked-retry pass (CATIC's own domain calculator, an
alternative to its static rate manual, which remains locked behind a FlippingBook JS image viewer
— see CT.md). `caticulator.com` is a Knockout.js SPA covering a surprising **30 states** per its
own `pc.model.js` `toServerModel()` state-code enum: CT, ME, MA, NH, RI, VT, NY, FL, NJ, PA, GA,
OH, SC, AL, TN, IL, NC, KY, IN, TX, MD, VA, DC, WI, MI, DE, WV, OK, MO, KS.
- **Auth pattern (the key unlock)**: a bare POST to any API endpoint 404s/redirects even with
  correct JSON body. The fix: (1) GET `caticulator.com/PremiumCalculator/Form?stateCode=<ST>` first
  with a `requests.Session()` (cookies enabled) to receive an `ASP.NET_SessionId` cookie; (2) reuse
  that session's cookies on subsequent POSTs; (3) include `X-Requested-With: XMLHttpRequest` and a
  matching `Referer` header — without both the cookie AND this header, every endpoint 404s.
- `POST caticulator.com/PremiumCalculator/GetSupportData` with JSON body
  `{"propertyState":"<ST>","isPolPropUser":false}` — **WORKING**, no personal data. Returns
  `ConveyancePropertyTypes`, `MortgagePropertyTypes`, `TransactionTypes` (Purchase=1/Refinance=2 for
  CT), `CoverageTypes` (None=0/Standard=1/Expanded=2), `PropertyTypes`
  (OneToFourFamilyResidential=1/NonResidential=2).
- `POST caticulator.com/PremiumCalculator/GetPolicyData` with JSON body
  `{"policyId":"","stateAbbr":"<ST>"}` — **WORKING**, no personal data. Returns a `SelectionSet`
  object with `Endorsements` (22 for CT) and, critically, `Fees` — the closest thing to a
  settlement/service-fee catalog this tool exposes. **For CT this list contains exactly one
  entry: `CplFee`** — meaning this tool's fee-itemization ceiling is a CPL fee at most, not a full
  settlement/service-fee breakdown like the mytitlerates.com or ALT Title finds above. Worth
  checking other states' `Fees` arrays in a future session (may differ by state — CT's attorney-
  closing structure may explain why it's especially thin here).
- `POST caticulator.com/PremiumCalculator/Calculate` — **NOT completed this session**. The request
  body (`model.toServerModel()` in `pc.model.js`) requires ~40 fields including the full
  `SelectionSet` from GetPolicyData (with per-endorsement `IsMPSelected`/`IsOPSelected` flags) plus
  several nested sub-objects not yet mapped: `RecFeeModel` (recording-fee calculator sub-model),
  `AdditionalCharges`, `AdditionalEndorsementFees`, `AdditionalTitleFees` (all `ko.toJS()`-serialized
  Knockout observables of unknown shape). Not pursued further given the modest payoff ceiling noted
  above (premium + CPL fee only, once working) relative to the effort remaining.
- **Recommendation for a future session**: if pursued, (1) drive the real form in a headless
  browser and capture the actual `Calculate` network request body once, to get an exact working
  template to replay statelessly afterward (much faster than static reverse-engineering from
  `pc.model.js`/`pc.viewmodel.js` alone); (2) check whether other states' `GetPolicyData.Fees`
  arrays are richer than CT's CPL-only list before investing further effort — a state with a fuller
  `Fees` list would justify completing the Calculate flow, a CPL-only state would not.

## 2026-07-26 session — VA/MD/CT/MA parallel harvest: 2 new shared platforms, 1 new Old Republic tool

Four states (VA, MD, CT, MA — all "complete (scarce)" in the published-schedule survey, chosen as
the highest-population still-unharvested scarce states per this catalog's own 2026-07-25
recommendation) were harvested in parallel this session. Results: VA crossed the 3-provider
calculator-quoted threshold; MD (1), CT (1), and MA (2) did not, but two significant new reusable
platforms were found and several near-miss/high-priority leads were mapped for a future session.

### TitleClose.com — WORKING, national ASP.NET MVC "shopping mall" platform, plain HTTP
A shared multi-tenant SaaS (`<agency>.titleclose.com`) discovered via Bon Air Title Agency's (VA)
own site. Classic ASP.NET MVC, driven with a plain `requests.Session()`, no browser needed:
(1) GET `/Consumer/Welcome` to capture a session cookie + `SearchID`; (2) POST search criteria
(state/county/city IDs resolved via `GET /Search/GetAllCountiesByStateId?stateId=<ID>&zip=<zip>` and
`GET /Consumer/Welcome/GetCities?stateID=<ID>`) to `/Consumer/Search`; (3) GET the returned order
token's detail page (`/Consumer/Order/<token>`), which contains the full itemized fee breakdown as
readonly hidden form inputs (`SettlementTitleFees[n].Description/Amount/BuyerAmount/SellerAmount`)
in the raw HTML even though the visual UI shows an iframe-security "Launch Calculator" overlay. No
personal data required when a tenant has `shouldAskForConsumerData = false` (confirmed true for both
VA tenants found). Two distinct VA agency tenants harvested — Bon Air Title Agency
(`bonairtitleagency.titleclose.com`, $0 settlement fee, defers to an outside closing attorney per VA
custom) and Appomattox (`apptitle.titleclose.com`, $450 settlement fee + 5 more line items Bon Air's
schedule lacks entirely) — confirming each tenant reflects its own real, independently-configured
fee schedule, the same pattern as MyTitleRates.com/TitleCapture. A third tenant, Old Republic's own
`ortris.titleclose.com`, returned zero results for Fairfax County (likely a Richmond-area-only
footprint for that specific tenant) — not retried with a different county this session.
**Recommendation**: search `"titleclose.com/Consumer/Welcome"` combined with target state names to
find more tenants — likely underexploited across other scarce states given the proven recipe.

### NetSheetCalc / TitleTap — WORKING (per-tenant), plain JSON GET, no auth
A white-label net-sheet calculator SaaS (`app.netsheetcalc.com/c/<tenant-slug>`), found via
Independent Title & Escrow LLC's (VA) own site. Unlike MyTitleRates.com's PHP form POST, this
platform exposes plain unauthenticated JSON GETs once a tenant's "Quick Quote (No sign in needed)"
mode is available: `GET non-auth-ajax.php?action=getAppData&app_id=<id>` returns the tenant's full
fee-form schema as JSON, including hardcoded flat-dollar ancillary fee constants (closing/settlement
fee, abstract, binder, exam, doc prep, CPL, e-record, deed/mortgage recording) embedded directly in
the config — the same "grep first-party config for hardcoded fee constants" technique as Modern
Title Group, but here the constants arrive as clean JSON rather than requiring JS-source grepping.
`GET api/index.php/rate/<sale price>/<rate-key>` (e.g. `Owner533`, tenant-specific) returns a live,
dynamically-computed title insurance premium for that tenant. Harvested successfully for Independent
Title & Escrow LLC (VA, app_id 533/534) — the richest single-agency ancillary-fee breakdown found in
this session (10 distinct itemized line items plus VA-specific state/local grantee-tax formulas).
**Not every tenant is open**: the MA-area instance found (Elite Title Company, `appid=438`) and the
general netsheetcalc.com/titleagentmarketing.com flow both require real-estate-agent account
login/signup for their main calculator UI — **gated**, no personal data entered, logged and skipped.
**Recommendation**: search `"app.netsheetcalc.com/c/"` combined with target state names for more
"Quick Quote / No sign in needed" tenants specifically (the gated, login-required tenants are a dead
end, but the no-signin mode is a real, repeatable win where it exists).

### Federal Title & Escrow — WORKING, first-party ASP.NET WebForms, plain HTTP (MD)
`tools.federaltitle.com/titleagents/QuickQuote/Default.aspx` is Federal Title's own first-party
calculator (distinct from its jsOnly Vite/React "guaranteed-quote" tool at `ftec.federaltitle.com`
already logged above) — a classic ASP.NET WebForms postback app, same technique as FNF/Old
Republic/Knight Barry. Montgomery County (MD's most populous) is the tool's own default, no
substitution needed. **New gotcha for the ReoList/OR-county-list pattern already documented
elsewhere in this file**: a `rblRepeatClient` RadioButtonList renders on the initial GET but is
*not* re-rendered after the state-selection postback; submitting a value for it on the final POST
throws HTTP 500 (`RadioButtonList.LoadPostData` invalid postback argument) — omit the field entirely
once the state has been selected. Returned a fully itemized buyer/seller settlement statement
(Settlement Fee $975 buyer/$550 seller, CPL $30, Search/Abstract $275, recording, transfer/
recordation taxes, both title insurance premiums). The page's own text states "No login or personal
information required," confirmed accurate.

### Old Republic's second calculator — `ortratecalculator.oldrepublictitle.com` (CT)
A previously-uncatalogued Old Republic tool, **distinct from `ortconline.com/Web2`** (which does not
serve CT and was re-confirmed unchanged: AZ, CA, HI, MO, NM, NV, OH, OK, OR, TX, UT, WA only). Found
via Quiet Title LLC's (CT) own calculators resource page linking to
`ortratecalculator.oldrepublictitle.com/RateCalc.aspx?CallingApp=PUBLIC&Location=06` (Location=06 =
Connecticut). Same ASP.NET WebForms postback pattern; auto-establishes a temporary session via a
redirect through `/Login.aspx` with no credentials needed. Statewide for CT (no county dropdown).
Premium-only structure plus one itemized CPL line ($50.00, tool's own editable default — not
independently confirmed against CT's C.G.S.A. §38a-404 statutory CPL rate). **Recommendation**: this
tool's `Location=<code>` parameter likely covers other states beyond CT/ortconline.com's footprint —
worth enumerating `Location=01` through `Location=50`-ish in a future session to map full coverage.

### Absolute Title, LLC / Law Office of David R. Rocheford Jr. — WORKING, first-party (MA)
Two independent first-party finds in Massachusetts, an attorney-closing state. **Absolute Title**
(`absolutetitle.com/ratecalculator_ma.asp`) is a first-party JS calculator (`rc-ma.js`), no browser
needed, statewide (no MA county tiering). **The Law Office of David R. Rocheford Jr.**
(`thebestclosings.com/title-calc/`) combines static HTML fee constants with a small JS formula file
— the richest MA find, a full buyer/seller settlement breakdown (Settlement Fee $565, Title Exam
$300, Survey $160, MLC, recording, homestead, transfer tax) directly confirming MA's
attorney-as-settlement-agent market structure already noted in MA.md's published-schedule findings.

### High-priority near-miss: Title Resources Guaranty (ratecalculator.trguw.com) — GraphQL, live 500
Found independently in both the CT and MA sessions. A Next.js/Apollo GraphQL backend at
`POST /api/proxy/graphql`, no auth. The `getQuote` query schema was **fully mapped** (`stateFees`,
`premiumTax`, `closingProtectionLetters` fields — a potentially rich itemized source) and confirmed
to serve ~40 states including CT and TX. However `getQuote` returns a bare HTTP 500 for *any* request
containing a policy input, reproduced identically across states — and the live production page
itself hangs on loading skeletons, indicating a genuine current backend outage on Title Resources'
own side, not a request-shape problem on this survey's end. **Recommendation**: retry in a future
session (the schema is fully mapped and ready to replay the moment the backend recovers) rather than
investing more reverse-engineering effort now.

### CATICulator — `Calculate` endpoint body structure now solved, still 500s (new finding)
Following up the 2026-07-25 entry above: this session fully reverse-engineered the `Calculate` POST
body shape — it's `{"data": "<JSON.stringify(serverModel)>"}` (the entire payload **double JSON
string-encoded** inside a `data` field, not a raw object as the prior session assumed), with
`serverModel` = `toServerModel()` output plus a lowercased `selectionSet` reused verbatim from
`GetPolicyData`, plus `endorsementsSelected`/`policyId`/`IsPolPropUser`. Posting a complete, correctly
-shaped body still returns a generic ASP.NET 500 "Runtime Error" with remote error details disabled
server-side, so the remaining defect could not be isolated further this session. Also confirmed MA's
`GetPolicyData.Fees` array is CPL-only, identical to CT's — the state-by-state richness check
recommended in the 2026-07-25 entry found no state (of the 2 checked) where completing this flow
would yield more than a CPL fee, further lowering the priority of finishing this reverse-engineering.

### New dead ends / gated / jsOnly logged this session (don't re-try without a new angle)
- **choicefinance.net** (MD/VA/DC calculator) — DNS-dead, unreachable (ENOTFOUND / 502 via proxy).
- **safeharbortc.com/calculator/** (VA) — blocked by a captcha wall (`sgcaptcha` redirect).
- **calculator3.mytitlerates.com** — a *separate*, Laravel-based "MyTitleRates Demo" instance (not
  the PHP `calculator.mytitlerates.com` platform documented above), covering PA/NJ/NY/FL/GA/NC/SC/
  IN/AR/DC/MD/KY only — no VA or CT agency found on it; `/calculator/98` is its admin/login backend,
  not a public quote page.
- **Pinnacle Title & Escrow, Charter Title Company, Allied Title & Escrow, Lakeside Title Company**
  (all MD) — all embed TitleCapture, jsOnly (platform-level block already documented).
- **GPN Title** (MD) — embeds Qualia Connect (token `YenRKppiKqAQP9m4a`), jsOnly.
- **Mid-Atlantic Settlement Services** (MD) — first-party WordPress plugin loads an Angular SPA from
  a new platform, **TRGC PowerSnap** (`mobile.trgc.com/powersnap/`), confirmed to require
  `Authorization: Bearer` JWT auth in its bundle — jsOnly + gated, no discoverable stateless endpoint.
- **Guaranteed Trust Title, LLC** (MD) — routes to a TitleClose.com tenant's
  `/Consumer/Account/Login` — this specific tenant requires consumer account login (gated), unlike
  the two open VA tenants above; confirms TitleClose.com tenants vary in their
  `shouldAskForConsumerData`/login-gating configuration per agency.
- **Landmark Abstract** (MD, formerly logged for PA) — MD section links to `prismpowered.com`,
  already-logged-dead (502) AND separately gated (requires account creation) — double dead end.
- **AnytimeEstimate.com** — genuinely itemized client-side calculator but confirmed (via its own
  About page) to be a third-party financial-comparison site, not a title provider itself — out of
  scope per the "providers' own calculators" mandate, same reasoning as the already-logged
  alphaadv.net aggregator. Do not harvest this site for any state.
- **statecalc.com, netsheetcalc.com's own marketing/demo page** — generic aggregator / vendor
  marketing page, not a specific agency's live instance — out of scope.
- **Accurate Title** (NH/MA/ME) — embeds First American's "AgentNet"/Prism Angular SPA
  (`marketing.agentnetsolutions.com`), jsOnly.
- **massrealtylaw.com** — Wix/React SPA, jsOnly.
- **firsttitleservices.com** (CT) — still HTTP 403 even retried with a browser User-Agent (the
  technique that unblocked catic.com did NOT work here — a genuinely different/stronger block).
- **Stewart's CT agents page** — 301-redirects to the already-logged, unresolved
  `stewartratecalculator.com/Quote/LoanEstimate` Angular SPA; confirms CT is in Stewart's footprint
  but adds no new information.
- **Knight Barry Title Group** — confirmed NOT serving MD, CT, or MA (all 302-redirect to the
  platform's error page; MD's `ddlState` dropdown lists only WI/FL/MI/MN, matching the
  MN/WI/MI-only footprint already on file).
- **TitleVest** (`titlevest.com`) — New York-focused, no MD coverage found.
- **titlefeescalculator.com** — unreachable/connection timeout across repeated attempts (MA session).

## 2026-07-27 session — TRACcalculator (comparetitlecompanies.com) — MAJOR NEW PLATFORM, WORKING, plain HTTP POST

A significant new find, discovered via First Integrity Title Agency's (Phoenix, AZ) own website. **TI
Services, LLC** (`tiservicesllc.com`) operates a nationwide title-industry SaaS suite —
**TRACcalculator**, **TRACcompare**, **TRACSELECT**, and a public consumer-facing instance,
**CompareTitleCompanies.com** (itself branded for Colorado consumers) — licensed to individual title
agencies nationwide, each identified by a numeric `title_co_id` parameter. This is comparable in
scope/significance to MyTitleRates.com and worth prioritizing for every remaining "complete (scarce)"
state.

- **Platform mechanics**: the entire quote wizard is **plain server-rendered PHP**, NOT a JS SPA — a
  3-step form flow driven by session cookies (`SID` embedded in each step's `<form action="?...">`),
  crackable with a plain `requests.Session()`, no browser/JS execution at all.
- **Entry point**: `https://comparetitlecompanies.com/get_quote/getquote.php?title_co_id=<id>` (Step
  1 — GET). The page embeds itself via `<iframe>` on individual agencies' own sites (search for
  `comparetitlecompanies.com/get_quote/getquote.php?` combined with agency/state names to find more
  `title_co_id` values).
- **Step 1 (property location)**: county/city dropdowns populate via plain, no-auth GET AJAX
  endpoints: `GET /get_quote/ajax_get_counties.php?state=<ST>` and
  `GET /get_quote/ajax_get_cities.php?state=<ST>&counties_id=<countyId>` (both confirmed working,
  return raw `<option>` HTML fragments, not JSON). POST all of Step 1's hidden fields (copy verbatim
  from the GET response) plus `transaction_types_id` (1=Sale, 2=Refinance), `address` (a required
  field — use a non-identifying place-name like "Phoenix, AZ" rather than a fabricated street
  address, consistent with the no-personal-data rule), `counties_id`, `city_town_id`, and
  `submit_1=Go to STEP 2`, back to the same `getquote.php?title_co_id=<id>` URL (not a different path
  — a gotcha: the form's own relative `action="?title_co_id=...&SID=..."` must be resolved against
  `getquote.php`, not treated as a bare query string against the directory root).
- **Step 2 (transaction details)**: POST the new hidden fields from Step 2's response plus
  `property_types_id` (1=Single Family/1-4 units, 2=Condo, 3=Townhome), `q2_amt` (purchase price),
  `q4_amt` (1st mortgage/loan amount), `addlq_48` (Lien Payoff Involved: 1=Yes/2=No — use 2 for a
  standard purchase), and the optional free-text `addlq_54` ("Prepared By" — leave blank), submitted
  as `submit_2=Calculate Costs`. **No personal data fields exist anywhere in the flow** — no name,
  email, or phone number requested at any step (confirmed by inspecting all hidden/visible fields
  across all 3 steps).
- **Step 3 (final quote)**: returned inline in the same POST response — a full itemized "Detailed
  Title Quote" (buyer/seller-split settlement statement: escrow/closing fee, CPL, notary, transaction
  fee, loan tie-in fee, endorsements, both title insurance premiums, recording fees) **plus** a
  TRID-formatted Loan Estimate (Sections C/E breakdown). This is a genuinely rich, fully-itemized
  source — one of the richest single-source formats found in this survey to date, on par with
  MyTitleRates.com/ALT Title's own React-based quote APIs.
- **Confirmed working for**: First Integrity Title Agency, AZ (`title_co_id=567`) — see AZ.json.
- **Recommendation for next session**: this is a high-priority target for every remaining
  below-3-provider or scarce state. Search `"comparetitlecompanies.com/get_quote/getquote.php"` or
  `"tiservicesllc.com" TRACcalculator` combined with target state/agency names to find more
  `title_co_id` values (do NOT blindly enumerate IDs sequentially — find them organically via search
  or by checking individual agencies' own "rate calculator"/"instant quote" pages for an embedded
  iframe, the same technique that surfaced this one). `comparetitlecompanies.com`'s own root domain
  markets directly to Colorado consumers and may itself list multiple subscribing CO agencies —
  worth checking for a quick multi-provider win in CO, which currently has zero calculator-basis
  providers on file. `firsttitlesource.com/tquote.php` (found via search, state/agency not yet
  identified) is another live TRAC-powered instance worth checking in a future session.

## 2026-07-27 session — Michigan (MI) retry: still 2 providers, PalmAgent reconfirmed jsOnly
Searched for a 3rd MI provider to push past the 2-provider mark (Modern Title Group, Knight Barry
already on file). No new usable source found this session:
- **Michigan Title Insurance Agency** (michigantitle.com/rate-calculator/, Taylor/Brownstown/Trenton —
  Wayne County/Metro Detroit, would have been a strong find) embeds a **PalmAgent** "Quick Quote"
  widget (`widgets.palmagent.com/quick_quote_widget.js`, agency code `CAV###T4flDC6EW4` base64-
  decoded from `qq_w_code`). Traced further than the 2026-07-23 attempt: the widget injects an iframe
  at `widgets.palmagent.com/widget_frame_v2.php?id=<code>&...` (fetched successfully, HTTP 200, 400KB+
  of HTML) which itself loads `cdn.palmagent.com/calcs_js/calcs_js.js` (1.8MB minified) — but the
  frame's own static HTML ships every data field empty (`widget_county_id`, `GPSCounty`, etc. all
  `value=''`), confirming the actual quote computation is fully client-side/AJAX-driven after a user
  selects an address via Google Places autocomplete, with no discoverable static API path found in the
  1.8MB bundle (no literal `"api/..."` string constants, unlike Stewart's cleaner `/api/SRC/` split).
  **jsOnly, reconfirmed** — would need a real/headless browser to capture the actual XHR the address
  selection triggers.
- **Vanguard Title Company** (vgtitle.com/resources/rate-calculator/, Livonia/Oakland-Macomb Counties)
  embeds the same PalmAgent widget plus a **ConvertCalculator.com** (`convertcalculator.com`)
  third-party embed — not investigated further given the PalmAgent dead end above and
  ConvertCalculator being a generic form-builder SaaS (client config not yet located statically).
- **Prestige Title Insurance Agency** (prtitle.com/net-sheet-calculator/, Adrian/Tecumseh/Manitou
  Beach — Lenawee County) embeds a **netsheetcalc.com/TitleTap** widget, `app_id=385` — but this
  specific tenant instance requires agent login/registration at its `quickquote.php` entry page
  (**gated**), unlike the VA netsheetcalc tenants already on file; the platform's newer
  `non-auth-ajax.php?action=getAppData` recipe documented in the 2026-07-26 entry above 404s on this
  tenant (platform appears to have migrated to a different, TitleTap-branded backend since that
  recipe was written).
- **Reputation First Title Agency** (rftitle.com, Livonia — Wayne County) and **Rock Title Agency**
  (rockclosings.com, MI+IN) are both Wix-hosted marketing sites with no calculator link found in
  either site's navigation.
- **Recommendation for next session**: try more independent MI agencies specifically for the
  Modern-Title-Group-style hand-rolled JS calculator pattern (view-source + grep hardcoded fee
  constants) rather than the big-four/PalmAgent/netsheetcalc platforms, which have proven
  consistently jsOnly or gated for MI so far.

## 2026-07-27 session — Ohio (OH) shared-template discovery: "OH netsheet calculator" engine

### Columbus Title Agency of Westerville / Owl Creek Title Agency — WORKING, shared JS engine, plain HTTP GET
Discovered while searching for a Franklin-County (Columbus)-serving OH calculator, since Old
Republic's ortconline.com tool (already catalogued above) does not reach OH's most populous county.
Found two independent Ohio title agencies running what is clearly a shared, licensed first-party JS
"netsheet calculator" template — byte-for-byte identical `TitleCalc()` (bracket-rate premium formula
with a final `Math.ceil(x*115)/100` retail markup), `computeForm()`, and `computeSellerTotals()`
functions, plus an identical 88-Ohio-county `CountyMultiplier` dropdown — but each agency's own flat
service-fee dollar constants differ meaningfully, confirming genuine independent configuration rather
than a generic demo:
- **Columbus Title Agency of Westerville** — `columbustitle.com/netsheets/` (page) +
  `columbustitle.com/netsheets/scripts/netsheet.js` (logic, served as a linked file at a path
  relative to `/netsheets/`, NOT resolvable from the site root — a gotcha: the site's current
  WordPress/Elementor theme 404s a bare `/scripts/netsheet.js` request, the legacy static page's own
  subdirectory must be used). Fee constants: Title Search Fee $275.00, Seller Closing Fee $210.00,
  Title Binder Fee $50.00, Doc Prep $85.00 — all confirmed flat/unconditional across every county
  branch in the JS source (no execution needed, just reading the `if/else` chain).
- **Owl Creek Title Agency** — `owlcreektitle.com/netsheet` (Squarespace-hosted page with the same
  engine inlined directly in the page's `<script>` rather than linked externally). Fee constants:
  Title Search Fee $225.00, Seller Closing Fee $125.00, Title Binder Fee $50.00, Doc Prep $75.00.
- **Structural limitation for both**: seller-side net sheet only, no buyer/loan-amount field at all —
  the standard scenario's $400,000 loan amount does not apply; only the $500,000 purchase price feeds
  the premium/fee calculation.
- **Recipe**: plain `curl`/GET of the page (and, for Columbus Title, the separately-linked JS file);
  grep the HTML for `readonly` `<input name="s_...">` fields for the flat fee defaults, and the JS
  source for the `TitleCalc()`/`computeForm()` functions to confirm which fields are truly flat vs.
  county-/price-dependent (only the government conveyance/transfer-fee field varies by county in both
  tools — the actual title-company fees are flat statewide). No personal data required (`preparedby`/
  `preparedforseller`/property address are free-text, left blank).
- **Recommendation for a future session**: search for more Ohio independent agencies running this same
  engine (try `"netsheet" Ohio title "seller closing costs"` combined with other city names — Toledo,
  Akron, Youngstown, Canton — not yet tried) to push OH past the 3-provider floor toward the 3-6
  target range. Two near-misses found but not pursued further: **First Ohio Title**'s
  `newnetsheet.firstohiotitle.com` "NEW Net Sheet System" requires agent username/password login
  (gated); **Talon Title Agency**'s `netsellers.talontitle.net/calculator` returned HTTP 406 on every
  user-agent string tried (both a default `curl` UA and a full Chrome UA string) — worth a browser-
  driven retry. **Mutual Title Agency** (OH+MI) has a HubSpot-hosted "seller-net-sheet" marketing page
  with no embedded calculator form found in the static HTML — likely gated behind a HubSpot form/CTA
  not captured by a plain GET.

## For the browser-driven follow-up session
Priority queue (highest-value first): (1) TitleCapture — drive `<agency>.titlecapture.com/
title-quote` for a real agency instance (e.g. moderntitlegroup.titlecapture.com) and capture the
actual network calls to `api.titlecapture.com/api-30/`, `api-node.titlecapture.com/`, or
`api-wb.titlecapture.com/apis/` — likely unlocks many agencies/states at once since it's a shared
platform, not single-provider; (2) Qualia Connect — drive the `quote-widget/ui/stage` iframe (found
on Endeavor Title MD and Modern Title Group MI so far, likely present on many more agency sites)
and capture what the `settings` postMessage triggers it to fetch — same multi-state-unlock
rationale as TitleCapture; (3) First American FACC — map the `Questions` page flow after
`Calculator/Next` to find where the itemized quote actually renders; (4) FNF's
ratecalculator.fnf.com — drive the state/county cascading dropdowns and Submit via real browser
automation, one state at a time, prioritizing VA/TN/PA/NJ (highest-population scarce states still
not covered by any working calculator as of 2026-07-24, MI now partially covered — see PROGRESS.md
tracker); (5) Stewart's `quote` POST — capture the real network request Stewart's own JS sends
(browser automation, not further static reverse-engineering — see the 2026-07-23 note above for
why); (6) WFG's `sellernet/calculate` — tested 2026-07-24 and ruled out as not staticly reachable
(returns `titleInsurance: 0` regardless of 24 tested product/transaction-type combinations, same
teaser pattern as `estimatefeesforsellernet`) — a browser session capturing the real UI's network
request might still reveal a missing required field (likely a product-catalog ID not available via
any static endpoint found so far); (7) PalmAgent — resolve the 305 on its JS bundle (probably
trivial with a real browser) and repeat the Stewart/WFG-style JS-bundle-mining technique. Also
worth trying without a browser at all: repeat the Modern-Title-Group technique (view-source + grep
first-party JS for hardcoded fee constants) against more small independent agencies in VA/TN/PA/
NJ/MD/WI/MN — it found a genuine itemized source in MI this session with no JS execution needed and
may generalize.
