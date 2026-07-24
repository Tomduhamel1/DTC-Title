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
  `?ID=nationalgranite&state=ny`, `?id=weichert`) — **jsOnly**. Confirmed ASP.NET WebForms SPA
  using `WebForm_DoPostBackWithOptions()`; no traditional form action or discoverable AJAX/API
  endpoint found in page source. State/county dropdowns populate via postback, not URL params (the
  `state=` query param only pre-selects the initial dropdown value, it is not a full query
  interface). Tested against PA.
- **rates.fntg.com** — **jsOnly**. Same SPA pattern; brand + state + city dropdowns, "Busy
  Loading" JS indicator, no discoverable API endpoint in fetched source, explicitly a
  "Residential Transaction tool" with no query-string interface.
- Status: queued for browser-driven session. Both need full JS execution (dropdown-driven
  cascading postbacks) to reach a final quote.

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
