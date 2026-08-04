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
**Not every tenant is open**: the general netsheetcalc.com/titleagentmarketing.com flow requires
real-estate-agent account login/signup for its main calculator UI — **gated**, no personal data
entered, logged and skipped. (`appid=438`, "Elite Title Company," was originally logged here as a
MA-area instance and gated — **corrected 2026-08-02**: its own config JSON gives a Des Peres, MO
address, and it is not gated at all once queried via the platform's newer `getNetSheetConfig` backend;
see MO.json/MO.md for the harvested entry. Not a MA source.)
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

## 2026-07-28 session — comparetitlecompanies.com's multi-company comparison tool (CO); Stewart Rate Calculator POST mechanism identified

### comparetitlecompanies.com/get_quote/get_quote.php?id=1 — WORKING, plain HTTP POST, multi-company
Distinct from the already-documented per-agency `getquote.php?title_co_id=<id>` embed (used for
AZ's First Integrity Title Agency, see the 2026-07-27 TRACcalculator entry above): `get_quote.php?
id=1` is comparetitlecompanies.com's own Colorado-branded multi-company **shopping/comparison**
tool, reachable directly (no iframe/agency site needed) since the whole domain markets to Colorado
consumers. One standard-scenario submission returns every title company licensed in the chosen
county at once.
- **Flow**: Step 1 (GET the page for a fresh `SID`/`quote_id`, then POST `counties_id`/
  `city_town_id` — both discoverable via `GET ajax_get_cities.php?state=CO&counties_id=<id>`, no
  auth — plus `transaction_types_id=1` for Sale and a required `address` field filled with a
  non-identifying place-name, e.g. "Denver, CO"; `contact_email` is present but has no
  required-asterisk and can be left blank, confirmed safe). Step 2 (POST `property_types_id=1`,
  `q2_amt`/`q4_amt` for purchase price/loan amount, `q10_int=0` mortgages-to-pay-off, and 5
  Colorado-specific `addlq_*` payer-allocation dropdowns that default sensibly (Seller pays
  Owner's Policy/OEC, Closing Fee Split 50/50, include both CPLs) — **gotcha**: 4 additional
  hidden fields (`q7_amt=1`, `q8_y_n=0`, `q9_amt=1`, `q11_y_n=0`) are embedded inside Step 2's own
  form but NOT in the top hidden-field block; omitting them causes an opaque "Please correct the
  following 1 errors" response with no per-field error text rendered, since the failing field
  isn't part of the visible Step 2 form at all — must be copied verbatim from the Step 2 GET/POST
  response). Two placeholder scenario dates (current owner's purchase date; most recent mortgage
  date) are required by the form even though the standard scenario brief doesn't specify them —
  used a generic `01-15-2015` (property-scenario metadata, not personal information).
- **Result**: redirects (302) to `summary_quote.php?quote=<id>`, listing every company found.
  Only **TRAC-subscribing** companies show a "View Details" link to
  `quote_detail.php?id=<company_id>&buyer`/`&seller` with a full itemized line-item breakdown
  (Title Insurance, endorsements, CPLs, closing fees, ancillary fees, government recording/transfer
  tax, each in its own table row). The majority — **non-subscribing** companies — show only a
  single aggregate total per the tool's own footnote ("reflected costs are publicly on file...with
  the Division of Insurance...View Details feature is not available for a Non-Subscribing
  Company"), i.e. a DOI-filed-rate estimate, not live calculator output — out of scope for
  calculator-basis evidence.
- **Confirmed working for**: First Integrity Title Company, CO (Denver/Jefferson/Arapahoe/Douglas
  Counties all show it as the sole subscriber; El Paso [CO's nominally most populous], Boulder,
  Larimer, Pueblo, Weld, and Mesa Counties returned zero subscribing companies) — see CO.json.
- **Recommendation**: worth checking whether comparetitlecompanies.com's sister/TI-Services-LLC
  brands (`firsttitlesource.com/tquote.php`, flagged 2026-07-27) have an equivalent `id=1`-style
  multi-company entry point for other states, rather than only searching for individual
  `title_co_id` values one at a time.

### Stewart Rate Calculator — `/api/SRC/quote` mechanism identified (POST is plain form-urlencoded, NOT JSON)
Correcting the 2026-07-26 session's note (which flagged the `quote` endpoint as needing "a large
serialized client-side state object... not fully reverse-engineered"): found a live branded
instance via Advanced Title Company's site (`advancedtitleco.com/rate-calculator/` embeds
`stewartratecalculator.com/?branded=false&officeid=2f33fe38-a50a-431a-9d84-cad7dd329fcf`, a CO
agency instance) and traced the site's `nrc.js` bundle's `sendAjaxRequest` call sites. Findings:
- The lookup endpoints are confirmed plain, no-auth GETs: `/api/SRC/transactiontypes?stateCode=CO&
  propertyType=Residential` (returns REFI/CASH/SALE transaction codes) and `/api/SRC/
  propertysearch?stateCode=CO&propertyType=Residential&value=<city or county name>` (returns
  City/County/CountyFIPS/ZipCode/StateAbbrv matches — fuzzy-matches nationwide, not scoped to the
  officeid's own state, so filter results by `StateAbbrv`).
  Other same-shape lookups exist for `statesettings`, `endorsements`, `providers`,
  `providerdetails`, `ernstlookup`, `netsheetlookup`, and `policyinsuredtypes` (all
  `?statecode=<ST>&...`).
- The final quote submission is `sendAjaxRequest(POST, API_PREFIX + "quote",
  $('#frmCalculateRates').serialize(), ...)` — i.e. a **plain form-urlencoded POST of the
  actual HTML `<form id="frmCalculateRates">`'s serialized fields**, not a hand-built JSON
  `quoteRequestRoot` payload as previously assumed. `API_PREFIX` = `/api/SRC/`, so the full URL is
  `https://www.stewartratecalculator.com/api/SRC/quote`.
- **Still unsolved**: the form itself renders with only one static hidden field
  (`__RequestVerificationToken`, a per-session CSRF token tied to the response cookie) — every
  other field (property location, transaction type, purchase price, loan amount, payer-allocation
  choices) is added to the DOM client-side via Knockout.js data-binding from a template, not
  present in the static page HTML and not reconstructable by grepping the minified `nrc.js`/
  `results.js`/`document.js`/`document.js` bundles for literal `name="..."` strings (none found —
  names are almost certainly set via `data-bind="attr: {name: ...}"` bindings resolved at
  render time). Solving this needs a real browser/devtools network capture of one live submission
  to see the actual POST field names, not further static source reading.
- **Recommendation**: high priority for the browser-driven follow-up session (already flagged as
  item 5 in that section below) — now that the endpoint mechanism (plain form POST, not JSON) and
  a live `officeid` (Advanced Title Company, CO: `2f33fe38-a50a-431a-9d84-cad7dd329fcf`) are both
  confirmed, a single devtools capture of one manual quote submission should be enough to fully
  script this platform, which is likely a many-state/many-agency unlock similar in scope to
  MyTitleRates.com/TRACcalculator.

### TN dead ends / gated / jsOnly logged this session
- **Tennessee Title Services, LLC** and **Signature Title Services** — both WORKING, see PROGRESS.md
  and TN.json/TN.md for full recipes (first-party PHP form-POST and first-party ASP.NET WebForms
  respectively — neither is a shared SaaS platform).
- **Express Title & Closing** (`expresstc.com/estimator/`) — embeds a TitleClose.com tenant
  (`expresstc.titleclose.com`) that redirects to a required `/Consumer/Account/Login` — **gated**,
  confirming (as already noted for MD's Guaranteed Trust Title) that TitleClose.com tenants vary in
  their login-gating configuration per agency; the VA tenants already on file remain the only
  confirmed-open ones.
- **Magnolia Title** (`magnoliatitle.com/rate-calculator/`) — embeds TitleCapture
  (`magnoliatitle.titlecapture.com/title-quote`, backed by `api.titlecapture.com`/`api-node.
  titlecapture.com`/`api-wb.titlecapture.com`) — **jsOnly**, consistent with the platform-level
  block already documented (browser-session priority item 1 below).
- **Title Company TN** (`titlecompanytn.com/calculator/`) — embeds a branded Stewart Rate Calculator
  instance (`stewartratecalculator.com`) — see the Stewart entry above; POST mechanism identified
  but not fully solved this session.
- **Title Group of Tennessee** (`titlegroupoftn.com/interactive-fee-calculator/`) — embeds
  `prismpowered.com/titlegroupoftn/guest-home`, confirmed this session to be First American's
  "AgentNet®" product, an Angular SPA (`runtime.*.js`/`polyfills.*.js`/`scripts.*.js`/`main.*.js`
  bundle, same family as the already-logged `marketing.agentnetsolutions.com` instance found for
  NH/MA/ME's Accurate Title) — **jsOnly**. Note: a *different* `prismpowered.com` tenant path was
  logged 2026-07-26 as dead (502)/gated for MD's Landmark Abstract; this TN tenant path returned a
  live 200 SPA shell instead — the platform's availability/gating varies per agency tenant, same
  pattern as TitleClose.com.

## 2026-07-29 session — Indiana/Kentucky harvest; NetSheetCalc's non-auth `getAppData` endpoint confirmed reusable across states; Old Republic's alpha `Location` codes found but NoBot-blocked; Knight Barry confirmed NOT to cover IN/SC

### Agency Title, Inc. (IN + KY) — WORKING, NetSheetCalc/TitleTap "Quick Quote" JSON API, no browser needed
Found via the agency's own site, `agencytitle.com/calculator/`, which links to two per-state
NetSheetCalc instances (`app.netsheetcalc.com/company/quickquote.php?appid=581` for Indiana,
`appid=582` for Kentucky). The `quickquote.php` UI page itself is a JS-rendered shell with no
static form fields, but its underlying data endpoint is a plain, unauthenticated JSON GET —
`GET app.netsheetcalc.com/company/non-auth-ajax.php?action=getAppData&app_id=<id>` — confirmed
working for both IDs with **no personal data, cookies, or session required at all** (simpler than
the VA-documented NetSheetCalc recipe, which needed a tenant-specific `app_id` discovered via
page-source grep; here the `appid` query param IS the `app_id`). The response is the tenant's full
fee-form JSON schema (`estimate_type.finance.sections.*.elements[]`), with hardcoded flat-dollar
constants directly readable from each element's `initial_val` field — no computation, POST, or
JS execution needed to read them. IN's config: Settlement Fee $495.00, Borrower's/Lender's CPL
$25.00 each, Incoming Wire Fee $35.00, TIEFF $10.00, E-Recording Fee $10.00, Recording Fees
$118.50, Sales Disclosure Fee $30.00. KY's config (same operator, distinct instance): Lender's
Title Insurance Premium $200.00, CPL $50.00, Deed Recording $54.25, Mortgage Recording $130.25,
E-Recording Fee $10.00, POA Prep Fee $125.00 (no hardcoded Settlement Fee default in this
instance). Each state's `city_drp` municipality dropdown (416 entries for both IN and KY,
suspiciously identical in structure/count — possibly a shared vendor demo dataset reused across
this operator's state instances rather than curated per-state, so do not treat county/city
selection here as verified-accurate local geography) supplies only a per-mille local-tax
multiplier for a tax-proration field, not the flat fee constants above, so no county/city
selection step was needed to harvest them. KY's list was confirmed to include Louisville/Jefferson
County ("Louisville Urban Services", "Dist Louisville-Jefferson"). **Recommendation**: this
confirms NetSheetCalc's `non-auth-ajax.php?action=getAppData&app_id=<id>` is a general, reusable,
zero-browser recipe — worth searching `"app.netsheetcalc.com" quickquote` or `"netsheetcalc.com"`
combined with other still-below-threshold state names (SC, AL, LA, MS, NE, ND, SD, etc.) in a
future session, rather than relying on iframe-detection on agency sites (this instance's own
landing page, `agencytitle.com/calculator/`, does not embed an iframe at all — WebFetch's markdown
summarization stripped the raw `appid=` links, only a raw `curl`/grep pass surfaced them).

### Knight Barry Title Group — confirmed does NOT cover Indiana or South Carolina
Tested `dashboard.knightbarry.com/Rates/indiana-rate-calculator.aspx` and
`.../south-carolina-rate-calculator.aspx` (plus an `alabama-`/`louisiana-`/`kentucky-`/`mississippi-
`/etc. sweep). All returned HTTP 200, but every one of these silently 302-redirects to
`www.knightbarry.com/default.aspx?aspxerrorpath=/Rates/<slug>-rate-calculator.aspx` — the site's
generic error fallback — confirmed by diffing byte size/content against a known-good state
(`minnesota-rate-calculator.aspx`, which returns distinct, larger content with no `aspxerrorpath`
in the final URL). **Lesson for future harvests using this tool**: always check
`%{url_effective}` / the final redirect target, not just the HTTP status code, before assuming a
guessed state slug is real — a 200 status alone is not sufficient evidence of a working page on
this platform.

### Old Republic's second tool (`ortratecalculator.oldrepublictitle.com`) — alpha `Location` codes found, but blocked by NoBot check for IN/SC
`oldrepublictitle.com/rate-calculator/?location=<state>` landing pages (e.g. `?location=indiana`,
`/south-carolina`) embed `ortratecalculator.oldrepublictitle.com/EmbedRateCalc.aspx?Location=<ST>`
using plain 2-letter state abbreviations (`Location=IN`, `Location=SC`) — a broader coverage
pattern than the numeric `Location=06` code previously found and used for CT, suggesting this
tool's real footprint is much larger than just CT. However, both IN and SC requests (with a fresh
session, and separately with the parent page's Referer header + shared cookie jar replayed) were
rejected outright by the page's `NoBot` AJAX Toolkit control, rendering "You are not authorized to
access the site. Code: 2." directly in the response body rather than the expected form — a harder
failure than the CT harvest saw previously (which worked without incident). Root cause not
isolated; possibly IP/session-reputation-based rather than purely Referer-based. Logged as
**blocked** for IN/SC specifically — not re-attempted further this session. **Recommendation**: a
future session should retry with a longer warm-up (visit 2-3 pages on oldrepublictitle.com first
to build session history) or enumerate other `Location=<ST>` codes to see if the block is state-
specific or session/IP-specific across the board.

### Mattingly Ford Title Services (Louisville, KY) — LodeStar Software Solutions, GATED
`mattinglyford.com/fee-calculator/` embeds `lodestarss.com/Live/Mattingly_Ford/Login/index.php?
guest=1` — a new calculator platform ("LodeStar") not previously catalogued. Despite the
`guest=1` parameter's implication of a no-login mode, the actual guest form still requires
entering an email address (`required` field, "Invalid Email Address!" validation) plus solving a
Google reCAPTCHA before any quote is returned — **gated**, no personal data entered per the hard
rule, not pursued further (the reCAPTCHA alone would also make this jsOnly/browser-only even if
the email requirement were waived).

## 2026-07-30 session — Alabama (AL) harvest crosses threshold; new "ydwebpro" white-label platform found; South Carolina (SC) searched extensively, zero new providers

SC (highest-volume zero-provider "complete (scarce)" state, ~5.3M) was tried first but yielded
nothing usable (see PROGRESS.md's session note for the full list of dead ends: mislabeled
NetSheetCalc search results, TitleClose/Knight Barry/Old Republic all already-confirmed non-covering
or blocked for SC, and only lead-gen forms or out-of-scope real-estate-team estimators found).
Session redirected to Alabama, where three providers were found and harvested in one pass:

### Signature Title Services — Alabama-specific portal, distinct from the TN instance already on file
`secure.signaturetitleservices.net/Default.aspx?tabid=517` — **WORKING**. Same company/brand as the
already-catalogued TN instance (`app.signaturetitleservices.net/PurchaseCalculator`) but a
structurally different DotNetNuke-portal page (field prefix `ctl00$mainContent$ctl00$...` vs. TN's
`ctl00$MainContent$...`, and a different field set — no `Reissue`/`txtPgs2` fields present in the AL
version), confirming it's a separately-configured, AL-specific instance rather than the same live
app reused across states. Classic ASP.NET WebForms postback, single GET (capture `__VIEWSTATE`/
`__VIEWSTATEGENERATOR`) then one POST — no cascading dropdowns needed since the county select
(`DD_Property_County`, all 67 AL counties, fixed-width-padded option values e.g. `"Jefferson           "`
with trailing spaces that must be preserved verbatim in the POST body) is present on the initial
page load. POST fields: `rb_PurRefi=Purchase`, `TxtOwnerPolicyAmt`/`txtLoanPolicyAmt` (price/loan),
`DD_Property_County`, `DD_LP_Type=Basic Rate`, `txtDeedPgs`/`txtPgs1` (left at their own page
defaults, 4/25), `txt_PolicySplit`/`txt_ClosingSplit=100.00` (100% buyer-paid, the defaults),
`btnCalc=Calculate`. No personal data fields anywhere. Confirmed working for Jefferson County
(Birmingham) — see AL.json. **Recommendation**: this operator may run more per-state DotNetNuke
portals beyond TN/AL — worth a `secure.signaturetitleservices.net` / `app.signaturetitleservices.net`
sweep of other state names in a future session.

### Land Title Company of Alabama — WORKING, first-party JS calculator, hardcoded rate brackets
`land-title.net/rate-calculator/` — a hand-rolled client-side JS calculator (jQuery + noUiSlider
purchase-price slider, purchase/refinance and residential/commercial toggles) with the entire fee
schedule (Owner's/Loan Policy premium bracket-rate tables, CPL Fee $25, Simultaneous [loan-policy]
Issue Fee $125, Residential Title Services Fee $350 / Commercial $500) hardcoded directly in the
page's own unminified inline `<script>` block. Read via plain `curl`/view-source, no JS execution
needed — the same "grep hardcoded fee constants" technique first used for Modern Title Group (MI)
and the OH netsheet-calculator agencies. The bracket-rate `rate()` function itself was hand-replayed
against the $500,000 standard scenario to get the actual premium figure (a cumulative marginal-
bracket formula, more complex than a flat constant but still fully static/readable). Jefferson/Shelby
Counties (Birmingham metro) is the tool's own stated service area — no separate county selector.

### Alabama Land Title — WORKING, new "ydwebpro" white-label platform discovered
`alabamalandtitle.com/Closing-Cost-Calculator` — previously logged 2026-07-22 as "HTTP 503,
unusable"; **resolved this session**: the `https://` host 503s but plain `http://` returns 200. The
page loads its calculator via a jQuery shortcode loader (`if (typeof ydclosingcostcalcshortcode ==
'undefined') $.getScript(ydwebpro.path + '/Content/plugins/ydshortcodes/closingcostcalculator/
code.js', ...)`) — **"ydwebpro"** is a previously-uncatalogued white-label CMS/calculator platform
(distinct from every other platform already documented in this file: MyTitleRates, TRACcalculator,
TitleClose, NetSheetCalc, TitleCapture, Qualia, CATICulator, PalmAgent). The entire fee schedule and
premium-rate bracket formulas (`getOwnersPolicyRate()`, `getMortgagePolicyRate()`, `getSearchFee()`,
plus flat constants: Settlement Fee $450 financed/$250 cash, Admin Fee $50/$50, Attorney Fee $85,
Doc Stamps $21/$66, CPL Fee $25, Simultaneous Issue Fee $125) are hardcoded in the linked `code.js`
file itself, fetched directly via plain GET (not the page HTML, since the calculator is injected
dynamically) — no browser execution needed, same static-JS-reading technique as Land Title Company
of Alabama above. Statewide (no county selector at all, unlike the Jefferson/Shelby-scoped Land
Title Company of Alabama entry). **Recommendation**: search `"ydclosingcostcalcshortcode"` or
`"ydshortcodes/closingcostcalculator"` combined with other scarce-state title-agency names — since
this is a shared CMS product (`ydwebpro.path`-relative asset loading suggests a licensed platform,
not a one-off custom build), it likely serves other agencies/states not yet found.

## 2026-07-30 session, continued — Louisiana (LA) searched, 0 new providers; new TRACcalculator entry-point variant found but not usable

### comparetitlecompanies.com/get_quote/netsheet.php?pid=<n> — a third TRACcalculator entry-point pattern, state-pinned per pid
Distinct from the already-documented `getquote.php?title_co_id=<id>` (per-agency embed) and
`get_quote.php?id=1` (CO's own multi-company comparison tool) entry points: `netsheet.php?pid=29`
is a single-agency netsheet request form (found via Ascendant Title, a multi-state national title
company with a confirmed LA branch) using a `pid` parameter instead of `title_co_id`. Two cascading
AJAX endpoints populate its dropdowns: `GET /get_quote/ajax_get_closing_offices_netsheet.php?
pid=<n>&nstype=<Buyer|Seller>&var_name=<field>` and `GET /get_quote/ajax_get_counties_netsheet.php?
state=<ST>&title_co=<office_id>&var_name=<field>` (both plain, no auth). **Gotcha**: unlike the
other two entry points, this form's target state is **hardcoded in the page's own inline JS**
(`var state_val = "CO";`) rather than derived from the property address — confirmed for `pid=29`
specifically (Ascendant's Colorado branch/listing), so this pid does not serve LA despite Ascendant
having an LA office elsewhere. Not pursued further to a working quote this session (no LA-scoped
pid found). **Recommendation**: search `"comparetitlecompanies.com/get_quote/netsheet.php?pid="`
combined with target state names, or check whether Ascendant/other multi-state agencies have a
separate pid per branch/state (the CO-hardcoding suggests each pid is state-specific, so an LA pid
may exist under a different number) — a future session's next step for LA specifically.

### Southern Title (LA) — jsOnly, Next.js SPA, no discoverable computation endpoint
`southerntitleonline.com/calculators/closing-costs` — a genuine first-party, all-64-Louisiana-parish
closing cost calculator (the single richest-looking LA lead found), but built as a Next.js/React
SPA. The only backend endpoints discoverable in the page's webpack chunks are
`/api/calculator-usage` and `/api/saved-calculations` (both analytics/logging POSTs, confirmed by
their request bodies which echo already-computed results rather than requesting a computation) and
`/api/geocode` (address lookup only) — the actual fee/millage computation logic and data appear to
be fully client-side but were not located in any of the ~10 webpack chunk files fetched this
session (likely lazy-loaded on interaction, not present in the initial page-load bundle set).
**jsOnly**, logged for the browser-driven follow-up queue — likely a high-value target given the
calculator's own marketing claims of ward-level millage precision across all 64 parishes.

## 2026-07-31 session — Mississippi searched (0 new), Arkansas gets its first provider (TitleTech of Arkansas); appid misattribution guard technique generalized; 3 new platforms logged (Elko, LodeStar/Closeline, MVT)

### TitleTech of Arkansas, LLC — WORKING, NetSheetCalc/TitleTap, statewide flat fees, no county tiering
`titletech-arkansas.io/calculator/` embeds NetSheetCalc's `widget.v2.js` with a static
`__widget_app_data` script tag exposing `app_id=393` directly in the page HTML (no iframe-hunting
needed, unlike the VA/IN/KY instances which required either page-source grep or an iframe splash
page). Same recipe as prior NetSheetCalc harvests: `GET non-auth-ajax.php?action=getAppData&
app_id=393` (no auth) for the fee-form schema, `GET api/index.php/rate/<amount>/<rate-key>` (no
auth) for the dynamically-rated title insurance premium (`finance393`/`cash393`) and transfer-tax
"Revenue Stamps" figure (`Revenue393`). Confirmed working for the standard $500,000 scenario —
see AR.json for full itemized figures (Closing Fee $400, Search Fee $250, CPL $25, eFiling Fee $10,
Recording Fees $125, Technology Fee $250, optional Mobile Notary $350). **Structural note**: this
tool has no county/city dropdown at all — flat statewide ancillary fees, unlike every other
NetSheetCalc tenant on file (VA/IN/KY all have county- or city-level branching) — so the standard
scenario's Pulaski County/Little Rock target wasn't a substitutable input for this specific tenant.

### Misattribution guard — generalizing the 2026-07-30 SC lesson into a standard verification step
Following the 2026-07-30 SC session's discovery that NetSheetCalc/TitleTap appids surfacing in
state-flavored web searches are often misattributed (Google's snippet-matching surfaces a generic
"netsheetcalc.com net-sheet-calculator-by-state" marketing page's internal links regardless of
which state a company's own account is actually configured for), this session made this an explicit
verification step rather than an occasional check: **before harvesting any appid found via search,
fetch its own `getAppData` JSON and inspect the `property_address_section`'s `state` field
`initial_val` (or, absent that, any county/city dropdown's option list) to confirm it actually
matches the target state.** This session found 4 more false-positive appids this way while
searching for Arkansas instances: appid 523 defaults to `state: "TX"`, appid 462 has a
Cook/DuPage/Kane/Lake/... county dropdown (Illinois/Chicago-area, no state field at all), appid
444 defaults to `state: "FL"`, and appid 438 ("Elite Title Company") matches the already-logged
Massachusetts tenant from the 2026-07-26 VA/MD/CT/MA session (no state field, but the same company
name/config). **Recommendation**: apply this same appid-config-verification step to every future
NetSheetCalc/TitleTap search result before harvesting, not just when a session is already
suspicious of a specific state's results — the false-positive rate this session (4 of 5 candidates
found for AR) suggests it's the norm rather than the exception for search-surfaced appids.

**2026-08-02 correction**: the "same company name/config" match for appid 438 above was itself a
misattribution — matching company *name* isn't sufficient when the tenant has "no state field" in
the schema actually used for verification (`property_address_section`). Re-checked appid 438's full
config (via the newer `getNetSheetConfig` endpoint) and found a `company` section with a literal
street address: "12231 Manchester Road, Des Peres, MO 63131" — this tenant is Missouri, not
Massachusetts, and was re-logged under MO.json/MO.md instead. **Refinement to the verification
step**: when `property_address_section` has no `state` default, also check the config's top-level
`company`/contact block (address/city/state/zip/phone), not just the property-address defaults —
the company's own registered address is a more reliable state signal than a property form field that
may be left generic across all tenants on a shared template.

### Capital Abstract & Title (AR) — TitleClose.com tenant, flow completed technically but redirects with no order token
`capitalabstract.titleclose.com`, linked from Capital Abstract & Title's (Van Buren, AR) own site.
Drove the full recipe already documented above (GET `/Consumer/Welcome` for a session cookie +
`SearchID`, resolve county via `GET /Search/GetAllCountiesByStateId?stateId=4` [Arkansas] ->
Pulaski County = `CountyID=2790`, resolve city via `GET /Consumer/Welcome/GetCities?stateID=4` ->
Little Rock = `CityID=5970`, POST to `/Consumer/Search`). **New requirement found this session, not
needed by the VA tenants already on file**: the welcome page's form embeds a hidden
`__RequestVerificationToken` ASP.NET MVC anti-forgery input distinct from the same-named cookie —
omitting it from the POST body (relying on the cookie alone, as the VA recipe write-up implied
was sufficient) still returns a 302 redirect to `/Consumer/Welcome` rather than an error; including
the correct token value (freshly captured from the same GET that supplied `SearchID`) did not
change this outcome either. Every submission attempted (with and without the token, across 2 fresh
sessions) redirected back to Welcome with no order token in the response — never an explicit error
message. This tenant's response headers carry `Access-Control-Allow-Origin: aclearchoicetitle.com`,
a different company name than Capital Abstract & Title, suggesting this specific tenant instance
may be branded/configured for a different company's coverage area (or simply doesn't have Pulaski
County priced) rather than being gated or broken. **Not classified as working, gated, or jsOnly** —
a genuine dead end pending a future session's retry with a different AR county or a direct inquiry
into the `aclearchoicetitle.com` branding mismatch.

### Elko (useelko.com) — new nationwide platform found, confirmed login-gated, no public quote mode found
A previously-uncatalogued nationwide white-label title-quote SaaS ("Elko," per its own marketing,
575+ agencies) with per-agency subdomains (`<agency>.useelko.com`). Every instance found this
session (`legacytitle.useelko.com`, `gcstitle.useelko.com`, `executivetitle.useelko.com`) is a
login-only portal (`/auth/signup/`, `/auth/forgot-password/`) with no public consumer-facing
calculator page found at any path checked — **gated**, no personal data entered. Elko's own
marketing pages (`useelko.com/title-quote-calculator/`, `/calculators/arkansas-title-insurance-
calculator/`) are lead-generation forms ("submit your information to quickly receive a quote"),
also out of scope per the hard rule. **Recommendation**: if a future session finds an Elko agency
instance advertising a "no sign-in" or "guest" quote mode (not seen at any of the 3 instances
checked this session), it would be worth investigating for a discoverable JSON API in the same vein
as NetSheetCalc's `non-auth-ajax.php`.

### LodeStar Software Solutions (lodestarss.com) — confirmed gated at a 2nd tenant (Closeline Settlements)
Following up the 2026-07-29 finding for Mattingly Ford Title Services (KY): Closeline Settlements'
(`closeline.com`, a 40+-state nationwide title company) own GFE calculator page
(`closeline.com/gfe-calculator/`) also embeds a LodeStar instance
(`lodestarss.com/Live/Closeline/Login/index.php?guest=1`) with the identical gating pattern — the
"guest" mode still requires a valid email address plus Google reCAPTCHA before quoting. **Gated**,
confirmed at a 2nd independent tenant, reinforcing that this platform's guest mode is uniformly
gated rather than tenant-configurable. Note: `closeline.com` itself needs a realistic browser
`User-Agent` header to avoid a Sucuri/Cloudproxy WAF challenge on plain `curl` — a lighter block
than a full Cloudflare interstitial, resolved simply by setting a standard Chrome UA string.

### MVT / Mississippi Valley Title Services Company — WORKING, no personal data, but premium-only (out of scope)
`mvt.com/Calculator/GFECalculator`, an Old Republic agent operating in Alabama and Mississippi
(found while searching for MS calculators, and cross-checked for AR since it separately surfaced
there). Plain page, no auth/personal data required, State (AL/MS) and County (Shelby/Other)
dropdowns plus Loan/Owner's Policy Amount fields — but outputs only title insurance premium tiers
(Standard/Expanded Loan, Standard/Homeowner's Owner's, simultaneous-issue combinations), no
settlement/closing/escrow fee line items anywhere. **Out of scope** for the calculator-harvest
mission, logged so it isn't re-investigated as a lead in a future MS or AL session.

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

## 2026-08-01 session — SC and LA searched extensively again, 0 new working providers; major new "Modiphy/Flux" multi-state platform discovered (jsOnly); Old Republic's `Location=` parameter confirmed NoBot-blocked for LA too

South Carolina and Louisiana (per the 2026-07-31 session's own recommendation, tied as the
highest-priority zero-provider "complete (scarce)" states) were both retried with the "search
independent agencies' own domains directly" technique. Neither crossed even 1 calculator-basis
provider this session, but one significant new platform was found and several new dead ends/false
leads were logged to save future sessions the same rediscovery cost.

### Pulsar Title Insurance Company / "Modiphy Flux" — NEW PLATFORM, jsOnly, but high-value multi-state (LA, MS, AL, FL, TX; GA "coming soon")
`pulsartitleinsurance.com/rate-calculator` (found searching for LA rate calculators; the site's own
footer states it services "the Mississippi Gulf Coast & Louisiana") embeds a first-party-branded but
platform-built calculator hosted on Azure Static Web Apps
(`pulsartitlecalc.z21.web.core.windows.net/calculator.js`, a 600KB+ Aurelia/webpack SPA bundle) that
loads its stylesheet from **`flux.modiphy.com/api/418?css=calculator`** — a previously-uncatalogued
title-industry calculator SaaS ("Modiphy"/"Flux") distinct from every other platform already
documented in this file. The bundle's inline SVG US-map component has clickable/styled state paths
for **Louisiana, Mississippi, Alabama, Florida, Texas** and a disabled "GA Coming soon..." tooltip —
strong evidence this is a genuine multi-state product, not a single-state custom build, comparable in
potential scope to TRACcalculator/MyTitleRates.com. However, the actual quote-computation network
call could not be located via static analysis: the only literal `flux.modiphy.com` reference in the
bundle is the CSS request; the real submission endpoint/URL is assembled at runtime from mangled
variable names (Aurelia router config only exposed two client-side route names, `calculation-results`
and `tcc-disclosure`, no visible `HttpClient`/`fetch` base-URL string). **jsOnly** — logged for the
browser-driven follow-up queue (devtools network capture would very likely reveal a `flux.modiphy.com`
JSON API reusable for LA and MS in one shot, both currently at 0 calculator-basis providers).
**Recommendation**: search `"modiphy.com"` combined with other scarce-state title agency names (AL,
FL, TX are also on the map and may already have their own state's calculator-quoted status improved
by this platform too) once a browser-driven session solves the request shape.

### Southern Law Group (SC) — TitleClose.com tenant, technically driven end-to-end but no itemized fees returned (inconclusive, not classified working/gated)
`southernlawgroup.titleclose.com` is a genuine live SC tenant of the already-catalogued TitleClose.com
platform (confirmed via its own `StateID` dropdown listing South Carolina=41). Drove the full
documented recipe: GET `/Consumer/Welcome` for `SearchID`/cookies, resolved Greenville County
(SC's most populous, CountyID=4061) via `GET /Search/GetAllCountiesByStateId?stateId=41`, resolved
Greenville city (CityID=10038) via `GET /Consumer/Welcome/GetCities?stateID=41`, POSTed the full
scenario to `/Consumer/Search` with the anti-forgery token. Response was HTTP 200 with title "Search
Results" (not redirected back to Welcome, unlike AR's Capital Abstract dead end) but the returned page
contains no `SettlementTitleFees[n]` fields, no order token, and no visible company/results listing —
just the tenant's normal site chrome plus an unrelated zeroed-out "submit a help request" form. Same
`Access-Control-Allow-Origin: aclearchoicetitle.com` branding-mismatch header already flagged for
Capital Abstract & Title (AR), reinforcing the theory that this specific header may indicate a
misconfigured/inactive tenant rather than a genuine block. Not classified working, gated, or jsOnly —
a dead end pending a future session's retry with a different SC county or direct inquiry into the
branding mismatch (same open question as AR's entry).

### Verus Title Inc. (SC) — PalmAgent-powered, jsOnly (platform-level, already known)
`verustitle.com/south-carolina/` links to `verustitleapp.com/?id=widget` ("Verus Title ONE — Get a
Quote... without having to login or signup" per the marketing site), which embeds
`widgets.palmagent.com/widget_transfer_tax_calculator.js` plus its own Angular SPA bundle — the same
PalmAgent platform already confirmed jsOnly (Michigan Title Insurance Agency, Vanguard Title,
2026-07-27 MI retry session). No new endpoint found; logged for the browser-driven PalmAgent queue
entry already on file rather than as a separate lead.

### Tryon Title Agency (SC) — TitleCapture, jsOnly (platform-level, already known)
`tryontitle.com/rate-calculator/` embeds `tryontitle.titlecapture.com/title-quote-uw` in an iframe.
Fetched the iframe page and its `main.*.js` chunk directly looking for a static
`api-30`/`api-node`/`api-wb.titlecapture.com` endpoint per the standing browser-driven-queue
recommendation — the chunk (73KB) contains only bare references to those three hostnames with no
concrete path/payload shape, confirming (as already suspected) that TitleCapture's real API call is
assembled by application code not present in the initially-loaded bundle. No progress beyond the
existing jsOnly classification; still queued for a real browser network-capture session.

### Alpha Advanced (`alphaadv.net/sctitle/scratecalc.html`) — out of scope, not a provider
A hobbyist multi-state (CT/DE/FL/MD/NJ/NY/PA/SC/TX/VA) title-rate calculator page copyrighted to an
individual ("John Granger," 2010-2012), premium-only (no settlement/service fees), served from a
personal site unaffiliated with any title company/underwriter. Same "third-party aggregator, not a
provider's own calculator" exclusion already applied to AnytimeEstimate.com — logged so it isn't
re-investigated for SC or any other state.

### NetSheetCalc/TitleTap appids checked for SC/LA this session, all misattributed (apply the standard verification step before harvesting any of these)
Per the misattribution-guard technique standardized 2026-07-31: appid 356 (Turner Title) → `state`
initial_val `FL`; appid 1056 (Momentum Title Agency) → `IN`; appid 599 (Title Insights LLC) → `FL`;
appid 94 (AWS Title Services) → `FL`; appid 467 (Capital Title and Escrow) → `FL`; appid 283 (Green
Label Title) → `NJ`; appid 612 (Infinity Title Insurance Agency) → `FL`. None are SC or LA instances
despite surfacing in state-flavored search snippets for both.

### Trident Land Transfer Company (MyTitleRates.com `a=15`) — confirmed NJ/PA only, does not extend to LA/SC
Checked whether the already-harvested PA/NJ MyTitleRates.com instance's own `state_picked` dropdown
covers additional states (a cheap way to extend existing harvests) — it lists exactly two options,
New Jersey and Pennsylvania. No extension to LA or SC.

### Old Republic's second tool — `Location=LA` also NoBot-blocked (extends the IN/SC finding)
`oldrepublictitle.com/rate-calculator/louisiana` links to
`ortratecalculator.oldrepublictitle.com/EmbedRateCalc.aspx?CallingApp=PUBLIC&Location=LA`, which
returns the same "You are not authorized to access the site. Code: 2" NoBot rejection already
documented for `Location=IN`/`Location=SC` (2026-07-29 session), even with a realistic Referer/
User-Agent. Confirms the anti-bot block applies broadly across this tool's state codes, not just
IN/SC specifically — deprioritize retrying this tool for any remaining scarce state without a
browser session.

### Louisiana/SC sites checked with no calculator found at all (generic company sites, no lead)
Bayou Title Inc., TitlePlus of LA (has a "request-a-quote" lead-gen page, no calculator), La
Louisiane Title Company, United Title of Louisiana, Cypress Title, Legacy Title (all LA) — all
Wix/Squarespace-hosted marketing sites with no calculator subpage in their own sitemaps and no
calculator-platform script tags found on their resources/useful-links pages. Mainstay Title, Inc.,
DHI Title SC page (both SC) — same result. Louisiana Title Services' `premium-rate-calculator` is
now fully unreachable (`HTTP 000`/connection failure on both http and https), a regression from the
already-logged 503 (2026-07-22/2026-07-30), confirming this source is dead rather than intermittently
broken.

**Blocked-source retries** (per the standing one-retry-per-session instruction): AZ DIFI —
`difi.az.gov` still HTTP 403 (Cloudflare); CATIC CT — `catic.com/state-resources/connecticut` HTTP
403 this session (was HTTP 200 on 2026-07-27/2026-07-31, so this varies run-to-run — the underlying
FlippingBook-viewer content-extraction problem is unchanged regardless); Jackson & Scott AL — still
unreachable (proxy CONNECT tunnel does not complete). No status change for any of the three.

## 2026-08-02 session — TitleTap/NetSheetCalc's newer backend discovered (`getNetSheetConfig` +
`api/index.php/rate`), AZ crosses the 3-provider threshold

### Arizona Premier Title (Scottsdale, AZ) — WORKING, TitleTap platform's newer 2026 backend, plain HTTP GET
Found via Arizona Premier Title's own site (`azpremiertitle.com/net-sheet-calculator/`), which embeds
`app.netsheetcalc.com/c/API` (a company-code-style tenant slug rather than the numeric `app_id` used
in the platform's URLs elsewhere — the numeric id, 546, is recoverable from the page's own OpenGraph
image URLs `.../company/img/546-icon.png`). This tenant's **`non-auth-ajax.php?action=getAppData`
already-catalogued endpoint 404s** (matching the 2026-07-27 MI-session note that the platform "appears
to have migrated to a different, TitleTap-branded backend") — the platform has evidently rolled out a
newer config format since. Reverse-engineered from the tenant's own loaded JS
(`company/js/app-v2.js`, `company/js/services/api.js`) rather than assuming the old recipe still
applies:
- **Config endpoint**: `GET https://app.netsheetcalc.com/company/non-auth-ajax.php?
  action=getNetSheetConfig&app_id=<id>` (note: different **host path** than the old recipe too — under
  `/company/`, not the bare root) returns the full fee-form schema as JSON, broken out per scenario
  type (`seller`, `cash`, `finance`, `refinance`) — each with its own `sections`/`elements` tree.
  Flat-dollar fields carry a literal `initial_val` (e.g. Closing Protection Letter `"25.00"`,
  endorsements `"100.00"` each); price-tiered fields instead carry `"is_formula":"1"` plus a
  `formula` object referencing a named rate-table key (e.g. `ClosingFee546`, `MPPCOwner546`,
  `MPPCLoan546` — the numeric suffix is this tenant's `app_id`, confirming these keys are
  tenant-specific, not shared across tenants).
- **Rate-resolution endpoint**: `GET https://app.netsheetcalc.com/api/index.php/rate/<amount>/
  <rate-key>` (root host, NOT under `/company/` — a gotcha, since the config endpoint above IS under
  `/company/`) returns `[{"rate":"<dollar-amount-no-decimals>"}]` for a given dollar amount and
  rate-table key. Confirmed for AZ: `rate/500000/ClosingFee546` → `1777` (total combined escrow/
  closing fee at $500k purchase price — the config's own formula divides this by 2 for each side's
  itemized "Escrow Fee" line, confirming a 50/50 buyer/seller split, not two independently-tiered
  fees); `rate/500000/MPPCOwner546` → `2310` (Owner's Title Insurance Premium, "Maricopa, Pima or
  Pinal County" tier — this tenant's own dropdown label, confirming it covers AZ's most populous
  county); `rate/400000/MPPCLoan546` → `1185` (Lender's simultaneous-issue Title Insurance Premium).
- **No personal data anywhere**: the entire `getNetSheetConfig` schema for all 4 scenario types was
  inspected field-by-field — no name/email/phone field exists in any of them (only address/city/zip,
  left blank per the standing rule since they're not required for the rate lookups used here).
- **Recommendation**: this is a generalizable fix, not a one-off — **any previously-logged TitleTap/
  NetSheetCalc tenant that 404s on the old `getAppData` action should be retried with
  `getNetSheetConfig` under the `/company/` path before being written off**, since the 404 reflects a
  platform-side backend migration (observed in progress as of the 2026-07-27 MI session), not that the
  tenant itself is dead/gated. This session already cleared the two most obvious candidates flagged
  above — Prestige Title (MI, see below) and appid 438 (which turned out to be Missouri, not MA, once
  actually re-checked — see the misattribution correction below and MO.json). Any other tenant logged
  gated/dead on the old `getAppData` action anywhere in this file is worth the same recheck in a
  future session.
- Crosses **AZ** to 3 calculator-basis providers (Old Republic, First Integrity Title Agency, Arizona
  Premier Title) — see AZ.json/AZ.md.

### Other AZ leads checked this session, ruled out
- **Equity Title Agency** (`eta-az.com/instant-rate-quote-result`) — a plain GET form, no personal
  data required, but the result page throws a PHP fatal error (`Uncaught Error: Undefined constant
  "yes"`) on every submission tried (`quote-type=yes` and `quote-type=no` both fail identically) —
  a genuine server-side bug in their WordPress theme unrelated to request shape, not a gating/jsOnly
  case. Logged as dead/broken, not worth retrying without a site-side fix on their end.
- **Landmark Title** (`ltaag.com/quote/arizona/`) — Cloudflare-blocked (HTTP 403, "Attention
  Required!" interstitial), same class of block as AZ DIFI.
- **comparetitlecompanies.com/get_quote/get_quote.php?id=1** (the CO-branded multi-company
  comparison tool documented 2026-07-28) — confirmed **not** reusable for AZ: its `state` hidden
  field can be overridden to `AZ` in the POST and AZ counties/cities do resolve via the shared
  `ajax_get_counties.php`/`ajax_get_cities.php` endpoints, but the tool's own `title_co_id=1`
  identifier is CO-specific — submitting with `state=AZ` redirects to `contact_us.php?
  1title_co_id=invalid`, confirming this specific comparison-tool instance is hardcoded to Colorado's
  own subscriber list regardless of the state parameter, not a general nationwide multi-company
  entry point (the per-agency `getquote.php?title_co_id=<id>` embed remains the correct pattern for
  other states).
- Pioneer Title Agency's own `pioneertitleagency.com/calculator/` was not pursued — Pioneer is
  already an AZ provider on file (published-schedule survey), so a calculator instance from the same
  company would not add a new distinct provider toward the 3-provider count.

## 2026-08-02 session, continued — same-day recheck sweep crosses MI's threshold and corrects a MO/MA misattribution

### Prestige Title Insurance Agency (MI) — no longer gated, same `getNetSheetConfig` backend fix as AZ
Retried immediately after the AZ discovery above: this tenant (`app_id=385`, Adrian/Tecumseh/Lenawee
County) was logged 2026-07-27 as gated because `non-auth-ajax.php?action=getAppData` 404s for it —
confirmed this session that it was never actually gated, just affected by the same platform backend
migration. `getNetSheetConfig&app_id=385` returns its full config cleanly. Result at $500k/$400k:
Closing Fee $425.00 (flat), Owner's Title Insurance Premium $2,436.00 (`rate/500000/Owners385`),
Lender's Title Insurance Premium $1,372.00 (`rate/400000/Lenders385`), Deed Recording Fee $30.00,
Deed Certification Fee $5.00, Recording Service Fees $10.00, Mortgage Recording Fee $30.00. No CPL/
notary/doc-prep/search/exam fields exist in this tenant's schema — a leaner config than Arizona
Premier Title's. Crosses **MI** to 3 calculator-basis providers (Modern Title Group, Knight Barry,
Prestige Title) — see MI.json/MI.md.

### Misattribution correction: TitleTap `appid=438` ("Elite Title Company") is Missouri, not Massachusetts
The other tenant flagged for the same recheck, `appid=438`, was logged 2026-07-26 as a gated
Massachusetts-area instance based on matching company name against a search snippet (documented in
the 2026-07-31 "misattribution guard" entry above, which itself only checked
`property_address_section`'s `state` default — empty for this tenant, so the guard's original form
didn't catch it). This session fetched the tenant's full `getNetSheetConfig` response and found a
`company` block with a literal street address: `"address1": "12231 Manchester Road", "city": "Des
Peres", "state": "MO", "zip": "63131"`. **Refinement to the misattribution guard**: when a tenant's
`property_address_section` has no default `state`, also check the config's top-level `company`
contact block — the company's own registered address is more reliable than a property-form default
that may be blank across an entire shared template. Re-logged under MO instead: Closing Fee $395.00,
Title Service Fee $1,302.49 (`rate/500000/PurchaseTitle437`), Owner's Title Insurance Premium $450.00
(`rate/500000/Owner437`), Lender's Title Insurance Premium $300.00 (`rate/400000/Lender437`), Closing
Protection Letter $25.00, E-Recording Fee $10.00, Delivery & Handling $35.00, Recording Fee Estimate
$100.00. This tenant was never a genuine MA source — MA's calculator-basis count is unaffected (still
2 of 3) — but gives **MO** its 2nd provider (Old Republic, Elite Title Company) toward the threshold;
see MO.json/MO.md.

## 2026-08-02 session, continued — Title Midwest, a new multi-state platform found via an open directory listing, crosses MN's and MO's thresholds

### Title Midwest (`forms.titlemidwest.com`) — NEW MULTI-STATE PLATFORM, WORKING, plain HTTP GET, open directory listing
Found via Minnesota Secured Title's own site (`mnsecuredtitle.com/Tools-Resources/Rate-Calculator`),
which embeds `forms.titlemidwest.com/RateCalculator/mnsecured/calculator.asp`. A significant new find:
the platform's own directory browsing is left open at
`forms.titlemidwest.com/titlemidwestForms/RateCalculator/` (an IIS default directory listing, no
index page configured), exposing every tenant slug directly rather than requiring one-at-a-time
search discovery — a first for this survey. Confirmed slugs as of this session: `mnSecured` (MN),
`MissouriSecuredTitleBethanyCalc` and `SecuredTitleKC` (MO), `kstButler`/`kstDouglas`/`kstGeary`/
`kstGreenwood`/`kstitleratecalculator`/`kstJefferson`/`kstLeavenworth`/`kstMcPherson`/`kstRiley`/
`kstSedgwick`/`kstShawnee`/`kstWalnutValley` (KS, 11 county-named instances — "kst" = Kansas Secured
Title, evidently the same operator family as Minnesota/Missouri Secured Title), `nebtitlecoratecalc`
(NE), `NSTTexas`/`securedtitletexasratecalculator` (TX), plus `BeachCalc`, `Coffeyville`, `HstCalc`,
`mainstreettitleco`, `MstCalc`, `NtcCalc`, `RteCalc`, `TcrCalc`, `TitleProfessionals` (states not yet
identified for these).
- **Mechanics**: each tenant is a classic-ASP (`.asp`) server-rendered calculator page (not a JS SPA)
  whose own `calculator.js` (or a per-tenant-named variant, e.g. `mstcalculator.051619.js` for
  SecuredTitleKC) makes a plain jQuery/Prototype `$.ajax`/`Ajax.Request` **GET** to a sibling
  `ajax.asp` with purchase price/loan amount/county (and for multi-state tenants, `state`) as query
  parameters, returning a small JSON object of price-tiered dollar figures (title insurance premium,
  search/title-service fee, CPL, filed premium). **No personal data fields exist in any tenant's
  calculator form** — only price/county/state/loan-type inputs.
  - Some flat-dollar fee constants (closing fee, wire fee, courier fee) are NOT part of the JSON
    response — they're hardcoded in the page's own inline `<script>` (e.g. `var feeOtherPurchase =
    970;`) or plain static HTML list items, readable directly via view-source, no execution needed.
  - County/state option values are plain `<option value="...">` lists in the static HTML (numeric IDs
    for MN, e.g. `27`=Hennepin; 2-letter county codes for the KC-area MO/KS shared tenant, e.g.
    `JA`=Jackson).
- **Confirmed working for**: Minnesota Secured Title (MN, county=27/Hennepin) — see MN.json; Secured
  Title of Kansas City (MO, state=MO&county=JA/Jackson) — see MO.json.
- **Recommendation**: this is a high-priority target for every remaining below-threshold or
  zero-provider state, comparable in potential impact to MyTitleRates.com/TRACcalculator/TitleTap —
  systematically work through the remaining un-investigated tenant slugs listed above in a future
  session (the KS instances alone are 11 potential county-specific harvests for a state not yet
  tracked in the calculator-harvest tracker at all; `nebtitlecoratecalc` would be NE's first
  calculator-basis provider; the TX and unidentified-state slugs are also worth checking). Always
  verify state/county attribution directly from each tenant's own dropdown options or ajax response
  fields before harvesting (per the standing misattribution-guard technique), since this operator
  clearly serves multiple states from shared infrastructure with per-tenant slugs.
- Crosses **MN** to 3 calculator-basis providers (DCA Title, Knight Barry, Minnesota Secured Title)
  and **MO** to 3 calculator-basis providers (Old Republic, Elite Title Company, Secured Title of
  Kansas City) — see MN.json/MN.md and MO.json/MO.md.

### Nebraska Title Company (NE) — new find via Title Midwest, but a different tenant tech (Vue.js client-side, no server API)
Also found via the Title Midwest directory listing (`nebtitlecoratecalc` slug), but architecturally
distinct from the classic-ASP/`ajax.asp` tenants above: this one is a Vue.js SPA with zero server-side
rate API at all — every figure (Old Republic-branded bracket-rate premium formulas, plus flat
endorsement/CPL/recording constants) is embedded directly, unminified, in the page's own inline
`<script>`. Read and replicated by hand rather than executed: `getOldRepublicExpanded(amount)` = `175
+ min(max(⌈amount/1000⌉-10,0),40)×4.25 + min(max(⌈amount/1000⌉-50,0),50)×3.75 +
min(max(⌈amount/1000⌉-100,0),900)×2.75`; at $500,000 this yields $1,632.50. Lender's premium uses a
flat `simultaneousIssue` constant ($75) when the loan doesn't exceed the purchase price. Notably, this
tool's "Escrow Settlement Fee" field defaults to $0.00 as a blank user-fillable input, not a
company-preset constant — the only Title Midwest tenant found this session that does NOT disclose its
own settlement/closing fee. NE's 1st calculator-basis provider — see NE.json/NE.md.

## 2026-08-02 session, continued — TN crosses the 3-provider threshold via a 3rd TitleTap tenant

### Cornerstone Title of Tennessee, LLC — WORKING, TitleTap platform, plain HTTP GET, richer formula schema than AZ/MI
Found via web search for TN-area TitleTap tenants (`app_id=227`); confirmed genuinely TN-based
(`approved_states:["TN"]`) and Quick-Quote-enabled (`is_qq_enabled:1`) directly from its own fetched
`getNetSheetConfig` response before harvesting — a sibling search result for the same platform,
`appid=420` ("Members Title Agency"), turned out to be Florida-based (`approved_states:["FL"]`)
despite a TN-flavored search snippet, and was correctly excluded per the standing misattribution-guard
technique (not logged anywhere for TN).
- This tenant's config introduced a formula shape not seen in the AZ/MI tenants harvested earlier this
  session: `{"first_value": <rounded purchase price>, "second_value": "county_drp", "second_id": "1",
  "is_api_call": "1"}` — here `second_value` is not a literal rate-table-key string but a **reference
  to another form field's own value** (the county dropdown, whose options carry state-prefixed
  string keys like `"TN1040Davidson"`, not the AZ/MI-style `<Label><app_id>` pattern). Confirmed via
  the platform's own `formula.js` (`case ""` branch, `data.second_id == "1"` check) that this simply
  means "use the currently-selected value of the referenced field" — practically, still just a second
  path segment for the same `GET api/index.php/rate/<amount>/<key>` endpoint, e.g.
  `rate/500000/TN1040Davidson` → `3104.69` (Owner's Policy Premium, Davidson County — read the target
  county's rate-key directly from the config's own `county_drp` select options rather than assuming a
  single fixed key per tenant, since this tenant serves 8 named TN counties from one config).
- Also introduces a conditional toggle (`is_seller_paying_owners_title_insurance`, confusingly-labeled
  "Buyer"/"Seller" radio options with values `yes`/`no`) that changes which fields compute at all —
  under the default ("Buyer" pays, value `yes`), Owner's Premium computes via the rate API and
  Lender's Premium is a flat $225 simultaneous-issue constant; under the alternate setting, Search
  Fees/both premiums are hidden entirely and Lender's Premium instead uses a separate rate-API call
  keyed off `loan_amount`. Only the default setting was evaluated this session.
- Result at $500k/$400k, Davidson County: Closing Fee $300.00, Search Fees $250.00, Document Prep Fee
  $75.00, CPL Fee $50.00, Owner's Policy Premium $3,104.69, Lender's Policy Premium $225.00, Deed
  Recording Fee $18.00, Mortgage Recording Fees $108.00, plus the tenant's own Conveyance Tax
  (`purchase_price×0.0037+3`) and Mortgage Tax (`(loan_amount-2000)×0.00115`) government-charge
  formulas.
- Crosses **TN** to 3 calculator-basis providers (Tennessee Title Services, Signature Title Services,
  Cornerstone Title of Tennessee) — see TN.json/TN.md.

**Recommendation for a future session**: MA is now the only state needing just 1 more provider to
cross threshold (2 of 3) — this session's two new techniques (TitleTap backend migration, Title
Midwest) were both checked against MA leads without success; a browser-driven session for the
zero-provider states (MS, SC, LA) via the Modiphy/Flux platform remains the standing highest-priority
recommendation from 2026-08-01.

## 2026-08-03 session — `mytitlerate.com` (a related but distinct MyTitleRates.com tenant-site
network) crosses NJ's threshold; MD and IN each gain a 2nd provider; a false-signal lesson on
NetSheetCalc's `state` field default

### mytitlerate.com (singular) — WORKING, a per-agency WordPress tenant-site network distinct
from the `calculator.mytitlerates.com` iframe subdomain already on file
Found by web-searching `"mytitlerates.com" title agency <state>` and noticing a hit on
`mytitlerate.com` (no trailing "s") — a separate-but-related WordPress multisite network
(`mytitlerate.com/<tenant-slug>/`) apparently run by the same platform operator, where each
tenant gets a full marketing site (About/Services/Contact/**Estimator**) rather than just a bare
iframe URL. The `/<tenant-slug>/estimator/` page is what actually embeds the already-documented
`calculator.mytitlerates.com/rateCalculator.php?a=<id>` iframe — so this is a **new discovery
channel** (search this WordPress network for tenant sites) for finding more `a=<id>` values, not
a new backend. **UA sensitivity**: both the tenant homepage and its `/estimator/` page 406'd on a
bare-curl request (default UA, no `Accept`/`Accept-Language` headers) but returned clean HTTP 200
with a full browser header set — the same recurring pattern documented for CATIC/Stewart/GA
elsewhere in this catalog; always retry a 406/403 with full browser headers before concluding a
block.
- **Allstates Title Service, Inc.** (`mytitlerate.com/allstates1/`, Hamilton Township, NJ) —
  `/estimator/` embeds `a=78`. This single agency id's `state_picked` dropdown covers **Maryland,
  New Jersey, and Pennsylvania** (PA already at threshold, not re-harvested here). Harvested both
  MD (Montgomery County, StatesKey=4, county=16) and NJ (statewide, no county field, StatesKey=1)
  with the standard documented plain-POST recipe (see the "MyTitleRates.com" entry earlier in
  this file for the full field list) — crosses NJ's providers to 3, MD's to 2. See NJ.json/MD.json
  for the full itemized results.
- **Recommendation**: search `mytitlerate.com` (singular) combined with other still-below-
  threshold state names (CT, MA, WI, CO, KY) the same way this session found Allstates —
  likely more tenant sites exist on this network beyond the ones found so far.
- **Tri-State Signature Settlements, LLC** (`mytitlerate.com/tristatesettlements/`, Hagerstown,
  MD) — a 2nd tenant found on this network, embedding a distinct agency id `a=40` (serves MD +
  PA). Harvested MD/Montgomery County — **crosses MD to calculator-quoted (3 providers)**
  together with the Allstates harvest above. Confirms each agency's numeric `state_picked`/
  `test_calckey` value for the same state (MD=229 for Allstates, MD=103 for Tri-State) is
  agency-specific, not a shared/global state code — always re-derive it from that agency's own
  rendered form, never reuse a value seen on a different `a=<id>`.

### NetSheetCalc/TitleTap — netsheetcalc.com's own public directory is searchable by company name;
2 more providers found (NJ, IN); a false-signal lesson on the `state` field default
Extending the 2026-07-29 finding that `non-auth-ajax.php?action=getAppData&app_id=<id>` is a
general reusable recipe: netsheetcalc.com itself maintains a public, search-engine-indexed
directory of every hosted company's `quickquote.php?appid=<id>` page (page title format
"`<Company Name> - Quick Quote Net Sheet Calculator by TitleTap`"), so a plain WebSearch for
`netsheetcalc.com quickquote <state name>` or generic terms surfaces a batch of appids with
company names at once — no need to find them via each agency's own site first (though that
remains a useful corroboration step). This session pulled 8 candidate appids from one such
search and ran each through a verification step before harvesting:
- **The Closing Partner, LLC** (Chester, NJ) — `appid=638` — confirmed via BBB/Alignable listings
  and the company's own `closingpartner.net/calculators` page (which advertises a net-sheet
  calculator, though the live embed on that specific page could not be located in raw HTML —
  attribution rests on the quickquote.php page's own `<title>`/`company_name` fields plus the
  external address match). Crosses **NJ to calculator-quoted (3 providers)**.
- **Momentum Title Agency** (Indianapolis, IN, formerly "Hocker Title") — `appid=1056` — the
  company's own live site (`hockertitle.com/net-sheet/`) now embeds a *different*, dead
  vanity-slug widget (`app.netsheetcalc.com/c/momentumta`, returns the platform's generic 404
  page) reflecting a 2025 rebrand/acquisition (per ALTA news: "Futura Title & Escrow Acquires
  Hocker Title") — but the originally-indexed `appid=1056` is still live and was independently
  confirmed correctly attributed: its own quickquote.php page's `<title>`/`company_name` read
  "Momentum Title Agency", and its demo-profile address field (usually unreliable, see below)
  happens to read Indianapolis/46250/(317) area code, an exact match to the company's real HQ.
  IN now at 2 of 3 providers.
- **False-signal lesson — do NOT use the JSON schema's `state` field `initial_val` for state
  attribution.** While investigating these appids, noticed each tenant's fee-form JSON schema
  includes a "Property Address" section with a `state` select whose `initial_val` looked like it
  might encode the company's home state (e.g. `"initial_val":"IN"` for the confirmed-Indiana
  Momentum Title Agency). Checked across all 8 candidate appids and found this is **not**
  reliable: `appid=638` (Closing Partner, independently confirmed as a genuine Chester, NJ
  company) still shows `"initial_val":"FL"` — evidently just an uncustomized platform-demo
  default (FL, presumably the platform vendor's own home state) that many tenants never bother
  to change. **Do not use this field for attribution in future sessions** — rely instead on the
  quickquote.php page's own `<title>`/`company_name` (which IS tenant-specific) cross-checked
  against an independent external search for that company's real address, per this survey's
  standing misattribution-guard practice.
- **Dead ends ruled out this session** (all found via the same directory search, all ruled out
  by the same title/company_name + external-search verification step): `appid=444` ("The Title
  Firm") — its quickquote.php page's demo address is Orlando, FL (407 area code), confirming it's
  a same-named **Florida** company distinct from the superficially-plausible `titlefirmllc.net`
  Louisiana company a naive search turned up (a near-miss false LA win avoided by this check —
  Louisiana remains 0 calculator-basis providers). `appid=468` ("MVP Title Agency") — the page
  gives no distinguishing address; the name collides with both a Naples, FL company and an
  unrelated "MVP National Title" in Greenwood, IN, and could not be confidently attributed to
  either — skipped rather than guessed. `appid=599` (Title Insights LLC, confirmed Tampa, FL) and
  `appid=627` (Overstreet Law LLC, most likely Kissimmee, FL) — both clearly non-target states,
  not pursued further. `appid=507` and `appid=513` — both show only the platform's generic
  unconfigured "TitleTap Web Calculator" placeholder company name, i.e. no real tenant behind
  them; not usable.

**Recommendation for a future session**: IN needs 1 more provider to cross threshold -- this
session checked several more netsheetcalc.com directory candidates (Fortis Title & Escrow
appid=452 confirmed Virginia Beach VA, AWS Title Services appid=94 confirmed Lutz FL, Capital
Title and Escrow appid=467 an unconfigured generic placeholder, Patriot Title Agency appid=653
confirmed Canton OH) without finding a 3rd IN match; Columbia Title Group (columbiatitlegroup.com,
a genuine Indiana company, Muncie/Lafayette-area) confirmed to run the TitleTap platform
(`TitleTap Framework` JS visible on its site) but its specific quickquote/netsheetcalc appid was
not located this session -- worth a follow-up search or a direct look at the site's own
navigation/JS bundle for the embed URL. CT, MA, WI, CO, KY remain the next-highest-value
scarce-state targets by population; the Old-Republic-footprint 1-provider states (NV, NM, UT,
HI, OR) are lower priority (smaller populations) but still open.

## 2026-08-04 session — Indiana (IN) crosses the 3-provider threshold via Rounsavall Title Group's dedicated IN tenant

### Rounsavall Title Group, LLC — WORKING, NetSheetCalc/TitleTap newer backend, formula-driven premium via dedicated rate-table key
Found via a broader netsheetcalc.com quickquote directory search that surfaced `appid=479`
("Rounsavall Title Group, LLC", Louisville, KY) — its `currentAppLocations` payload (returned by
both the old `getAppData` and newer `getNetSheetConfig` non-auth-ajax actions) lists a 2nd,
child tenant: `app_id=480`, `tenant_name: "rounsavall-title-IN"`, `approved_states: ["IN"]`,
`location_name: "Indiana"` — same company/office/phone as the KY parent, but an explicitly
IN-scoped instance (the same one-company-multiple-state-tenant pattern already seen for Agency
Title Inc./IN+KY). The old `getAppData` endpoint for app_id=480 returns HTTP 200 but with nearly
all fields empty (`initial_val: ""` throughout) — this looked like a dead/unconfigured tenant at
first glance, but the newer `getNetSheetConfig` endpoint (`GET app.netsheetcalc.com/company/
non-auth-ajax.php?action=getNetSheetConfig&app_id=480`, per the 2026-08-02 AZ/MI-session
discovery) revealed the real underlying config: Owner's Title Insurance Premium is
**formula-driven**, not a flat constant, referencing a dedicated rate-table key `"Indiana480"`
resolved via `GET app.netsheetcalc.com/api/index.php/rate/500000/Indiana480` → `{"rate":"1100"}`
(confirming the tenant-specific-rate-table-key pattern documented for AZ generalizes to any
formula field, not just AZ's own keys). Lender's Title Insurance Premium is a flat non-formula
constant, `$100.00`. No county/city selector exists in this tenant's schema at all (unlike Agency
Title's 416-entry municipality dropdown) — statewide only. No personal data anywhere in the
schema. **This crosses IN to calculator-quoted (3 providers)**, alongside Agency Title Inc.
(New Albany) and Momentum Title Agency (Indianapolis).

**Generalizable lesson**: an app_id that returns HTTP 200 with an all-empty `getAppData` schema
should not be written off as dead/unconfigured without also trying `getNetSheetConfig` — the two
endpoints can disagree on how populated a given tenant's config looks, matching (but distinct
from) the already-documented "old endpoint 404s, new endpoint works" migration pattern.

### Dead ends checked for IN's 3rd-provider search this session
- **DRG Title Agency** (`appid=313`) — despite the company having a stated Indianapolis office
  (per its own marketing copy, "Northwest Indiana" and "Indianapolis" phone numbers listed), its
  `getAppData` config's `county_drp` dropdown is exclusively Illinois counties (Cook, DuPage,
  Kane, Lake, McHenry, Will, Boone, Dekalb, Grundy, Kankakee, Kendall, Peoria, Winnebago) — this
  specific tenant instance is Illinois-configured only, not usable as IN evidence. Not re-flagged
  gated/jsOnly since it did return real (if wrong-state) data; simply not IN.
- **Meridian Title** (`meridiantitle.com`, a genuine multi-state IN-headquartered title company)
  — its `/seller-net-sheet` page links to a first-party ASP.NET calculator at
  `bypass.meridiantitle.com/CostCalculator.aspx?a=1&OfficeID=1`, but the entire `bypass.` subdomain
  is Cloudflare-protected (HTTP 403, "Just a moment..." interstitial) on plain HTTP fetch —
  **gated (Cloudflare)**, would need a browser-driven session.
- **Empora Title** (`emporatitle.com/closing-costs-calculator`) — page loads (HTTP 200 with full
  browser headers; 406 without an `Accept` header, a UA-sensitivity quirk seen elsewhere in this
  survey) but no iframe, embedded widget div, or discoverable calculator API endpoint found
  anywhere in the page HTML or linked JS — the "calculator" appears to be either non-functional
  marketing copy or a dynamically-injected widget not present in the initial page load —
  **jsOnly** (logged for the browser-driven follow-up queue; state coverage not yet confirmed to
  include IN specifically).
- **Columbia Title Group** (`columbiatitlegroup.com/calculators/`) — the specific TitleTap
  netsheetcalc appid flagged as unlocated in the 2026-08-03 session turns out not to exist as a
  separate NetSheetCalc tenant; the page instead embeds a **Qualia Connect quote widget**
  (`connect.qualia.com/quote-widget/scripts/init`), a fully iframe/JS-driven tool matching the
  already-catalogued Qualia Connect jsOnly pattern elsewhere in this survey — **jsOnly**, not a
  NetSheetCalc/TitleTap instance after all (superseding the 2026-08-03 "worth a follow-up search"
  note).

**Recommendation for a future session**: CT, MA, WI, CO, KY remain the next-highest-value
scarce-state targets by population; the Old-Republic-footprint 1-provider states (NV, NM, UT, HI,
OR) are lower priority (smaller populations) but still open. The "child tenant via
`currentAppLocations`" pattern found for Rounsavall this session (one company, multiple app_ids,
one per approved state) is worth actively searching for on any other multi-state independent
agency already on file (e.g. Agency Title Inc. itself only shows 2 locations currently, but the
platform clearly supports more per company).

## 2026-08-04 session — Wisconsin (WI) gains a 2nd calculator provider (Homestead Title, formula read from page JS); DCA Title's WI county blocker confirmed structural, not a payload guess

### Homestead Title Company LLC (Dane County/Madison, WI) — WORKING, client-side JS formula, no server round-trip needed
`homesteadtitle.net/title-quote.asp` computes its quote entirely in the browser via an inline
`showpay()` function — no AJAX/POST call at all, just DOM manipulation. Read directly via plain
GET/view-source (same "grep hardcoded/formula constants from inline script" technique already
used for Land Title Company of Alabama and Modern Title Group MI). Rate brackets and flat-fee
constants are visibly dated/commented in the source itself (`// BT 8-6-25 new formula from
Peter`), a stronger real-pricing signal than an unremarked template default. Formula for Owner's
Title Policy Premium: `575 + (H-15000)*0.0035 [$15k-$350k band] + (H-350000)*0.0025 [$350k-$500k
band] + (H-500000)*0.001 [$500k-$2M band] + ...` where H = purchase price; WI Real Estate
Transfer Fee approximated as `floor(H/333 - 0.5)` (≈ WI's statutory $3.00/$1,000 rate); flat
Deed Drafting $150, Gap Endorsement $175, Special Assessment Certificate $75; a parallel
loan-amount-driven formula produces the TRID Lender's/Owner's Title Insurance CD-disclosure
figures. At $500k/$400k: Owner's Policy $2,123, Transfer Fee $1,501, grand total $4,024;
TRID Lender's $1,723 / Owner's (net) $750. See WI.json for the full harvested entry.

### DCA Title (WI branch) — retried, confirmed still blocked; root cause is now structural, not a payload-guessing problem
Per the 2026-07-26 session's recommendation, retried `dcatitle.com`'s WordPress `admin-ajax.php`
endpoint (`action=dcatitle_calculator_results`) with real Wisconsin county names substituted
directly for the `county` parameter (`Milwaukee`, `Dane`, `Waukesha`) instead of the placeholder
values already ruled out (empty string, `N/A`, `Statewide`, etc.) — all three still rejected with
the identical `{"alert":{"type":"error","msg":"Please select a valid County value."}}` error.
Fetched the calculator page's own live HTML (not just the plugin JS file) to inspect the actual
`<select id="county">` DOM directly: it contains **only Minnesota county `<option>` values**
(Aitkin through Yellow Medicine, no Wisconsin county anywhere) — confirming there genuinely is no
valid WI county value obtainable via this form at all, a platform-side gap (the WI state option
exists and the UI hides the county field for it, implying WI purchases are meant to skip county
selection, but the server-side handler still hard-requires a county match against the
Minnesota-only list it validates against). This is now confirmed **structural**, not a payload
formatting issue — deprioritize further plain-HTTP attempts on this specific integration; a
browser-driven session capturing the real network request (if the UI behaves differently than the
static DOM suggests) remains the only path forward, per the original 2026-07-26 recommendation.

### Land Title Services (Wauwatosa, WI) — GATED, requires email address
`landtitleservices.net/calculators/seller-net-sheet/` runs a first-party WordPress plugin
(`ltscalculator`) whose form POSTs to itself, but requires a `required` `ans_email_address` field
before computing — **gated**, no personal data entered per the hard rule, not pursued further.

### Burnet Title Wisconsin — jsOnly, another TRGC "PowerSnap" tenant (already-catalogued platform)
`burnettitlewi.com/calculators/` embeds the same Title Resources Guaranty "PowerSnap" Angular SPA
(confirmed via the page's own `aisCalcData = {"api_url":"https://mobile.trgc.com/powersnap/",...}`
config) already logged jsOnly elsewhere in this survey under a different tenant — not a new
platform, just another instance of an already-known dead end for plain-HTTP harvesting.

**Recommendation for a future session**: WI needs 1 more provider to cross threshold. CO, CT, KY
remain the next-highest-value scarce-state targets by population; the Old-Republic-footprint
1-provider states (NV, NM, UT, HI, OR) are lower priority (smaller populations) but still open.

## 2026-08-04 session, continued — Colorado (CO): new "Settlor" platform found (jsOnly); PowerSnap's multi-state breadth confirmed further

### Land Title Guarantee Company (LTGC, Colorado's largest independent title company) — jsOnly, new "Settlor" platform
`ltgc.com/resources/seller-net-sheets/` links to `portal.settlor.com/ltgc/rate-quote/create` — a
previously-uncatalogued platform (distinct from every other one documented in this file: MyTitleRates,
TRACcalculator, TitleClose, NetSheetCalc/TitleTap, TitleCapture, Qualia Connect, CATICulator,
PalmAgent, ydwebpro, Title Midwest, PowerSnap/TRGC). The portal page is a bare Vite/JS SPA shell
(`assets/index-<hash>.js`) referencing an `api.settlor.com` backend, but no request path/endpoint
string is present anywhere in the bundle (likely constructed dynamically at runtime or behind an
auth/session flow) — a blind guess at `api.settlor.com/graphql` 404'd. **jsOnly**, logged for the
browser-driven follow-up queue. High priority given LTGC's market position in CO (a state with
only 1 calculator-basis provider on file).

### PowerSnap (`mobile.trgc.com/powersnap`) confirmed to also cover CO, AR, KY, IN via Upward Title & Closing tenants
Upward Title & Closing embeds this already-catalogued jsOnly platform (see the same-session WI
entry above for Burnet Title's tenant) for **both** its CO/UT calculator page
(`UPWARDCO_nss`/`_refi`/`_tcc`/`_tridactual`/`_rnss` company slugs) and a separate AR/KY/IN-serving
page at `ar-ky.upwardtitle.com/calculators/` (`UPWARDARKYIN_*` slugs) — confirming this platform's
real footprint spans at least CO, WI, AR, KY, and IN. Checked the Angular bundle's own
`Configs/appConfig.json` and `main.js` again for a discoverable backend API base URL (in case a
different tenant's build exposed what Burnet Title's didn't) — still nothing statically
discoverable. Not a new platform, but strengthens the case that PowerSnap is one of the highest-
value remaining browser-driven targets, potentially unlocking several below-threshold states in
one session (alongside the previously-flagged Modiphy/Flux platform for LA/MS/AL/FL/TX).

**Recommendation for a future session**: CT, KY remain the next-highest-value scarce-state
targets by population reachable via plain HTTP; PowerSnap and Settlor are now the two clearest
browser-driven-session targets, each with confirmed multi-state reach into several still-open
scarce states (CO, WI[partially resolved], AR, KY, IN for PowerSnap; CO for Settlor, though
Settlor's install base beyond LTGC is unconfirmed).
