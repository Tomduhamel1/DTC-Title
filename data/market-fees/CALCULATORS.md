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
    the published-schedule survey; the other 6 (AZ, MO, NM, NV, OH, UT) are all "complete
    (scarce)" states and were harvested this session (1 provider each — see PROGRESS.md tracker
    and each state's .json/.md for full itemized results).
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

## Agency-level widgets (TitleCapture / Qualia)
Not yet investigated this session — deferred to a future harvest pass. Given the difficulty
already encountered driving even the "big four" brand calculators without a browser, agency-level
widgets (typically embedded iframes) should be checked for either (a) a directly-loadable iframe
`src=` URL with query-string parameters, or (b) a discoverable JSON endpoint in the embed's own
JS bundle, using the same technique documented above for Stewart. If neither exists, log as
jsOnly and queue for the browser-driven session.

## For the browser-driven follow-up session
Priority queue (highest-value first): (1) First American FACC — map the `Questions` page flow
after `Calculator/Next` to find where the itemized quote actually renders; (2) FNF's
ratecalculator.fnf.com — drive the state/county cascading dropdowns and Submit via real browser
automation, one state at a time, prioritizing PA/MI/NJ/VA (highest-population scarce states not
covered by Old Republic's tool); (3) Stewart's `quote` POST — either reverse-engineer
`quoteRequestRoot`'s JSON schema from `/js/nrc.js`, or drive it via browser and capture the
network request Stewart's own JS sends, which is likely faster than static reverse-engineering.
