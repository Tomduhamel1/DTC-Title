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

### Stewart Title — 2026-08-14 update: `/api/SRC/quote` SOLVED — full working recipe (MAJOR cross-state unlock)
The WV calculator-harvest session finally solved the `quote` endpoint that the 2026-07-23 session
correctly diagnosed as JS-runtime-populated (see above) — no browser automation was needed after
all; the trick was building the `QuoteRequestRoot` JSON by hand from the same field references
already mapped in `nrc.js`, then submitting it as a **plain form-urlencoded POST field named
`QuoteRequestRoot`** (not `hidQuoteRequestRoot` as the prior session guessed) alongside
`StateSetting` (the raw `statesettings` JSON, re-serialized verbatim) and a valid antiforgery
token/cookie pair scraped from the initial page GET. **This works nationwide wherever Stewart
writes title insurance** — not a WV-specific fix — making it one of the highest-leverage findings
in this catalog; every remaining below-3-provider or premium-only-only scarce state should try this
before anything else next session.

**Two separate `POST /api/SRC/quote` calls are required for a complete itemized quote** — this is
the single most important gotcha:
- **`QuoteType=3` (Fee-Estimate / LoanEstimate flow, `pageBuyerSeller=buyer`)** — set
  `IsCalculatePremium=True` and `IsCalculateTitleServiceFee=True` (two extra hidden fields that
  only exist on this page variant) and `QuoteRequestRoot.QuoteRequest.TransactionInformation.
  ProviderID=<a real provider ID from the `providers` GET>` (leaving `ProviderID` empty returns a
  null `TitleServiceFee` section). Returns the response's `Pricing.TitleServiceFee.
  ItemizedTitleServiceFeeList` — the actual settlement/closing fee line items, each carrying
  `BuyerAmount`/`SellerAmount` splits — plus `Pricing.RateManual`/`Pricing.TRID` premium sections.
  `Recording` comes back `null` on this flow.
- **`QuoteType=2` (Netsheet flow, `pageBuyerSeller=seller`)** — no `ProviderID` needed. Returns
  `Recording.Mortgage/Deed/Release` (recording fees + transfer/deed tax, with a `CFPB2015.CFPBTax`
  breakdown) plus the same premium sections. `Pricing.TitleServiceFee` is present but its
  `ItemizedTitleServiceFeeList` is `null` on this flow.
- **A future session harvesting a new state via this recipe should run BOTH calls** to get the full
  itemized picture (settlement fee + recording/transfer tax + premiums) — running only one produces
  an incomplete evidence entry.

**Recipe, step by step** (all plain HTTP, `requests.Session()`-style cookie jar, no browser):
1. `GET /Quote/LoanEstimate?urlParams=&quotetype=3&branded=true` (or `/Quote/Netsheet?urlParams=
   &quotetype=2&branded=true` for the Netsheet flow) — scrape the antiforgery cookie
   (`.AspNetCore.Antiforgery.*`) and the matching `__RequestVerificationToken` hidden input. Each
   flow/page load needs its own fresh token+cookie pair — don't reuse one from a different page.
2. `GET /api/SRC/transactiontypes?statecode=<ST>&networkid=&propertytype=residential` → confirms
   `SALE` = "Sale/Purchase with Mortgage" (matches the standard scenario) for that state.
3. `GET /api/SRC/propertysearch?value=<City>,%20<ST>` → resolves `CountyFIPS` + a default zip for
   the target county/city — use the state's most-populous-county seat as the search city.
4. `GET /api/SRC/policycoveragetypes?statecode=<ST>&transactionType=Sale%2FPurchase%20with%20
   Mortgage&policyInsuredTypeCode=OP&networkid=&propertytype=Residential` (and again with
   `policyInsuredTypeCode=MP`) → confirms the coverage-type code to use for each policy leg
   (default/most common is `BASIC` for both; some states also offer `HOP`/`EXPLP` alternates).
5. `GET /api/SRC/providers?statecode=<ST>&countycode=<FIPS>&zipcode=<ZIP>&transactiontype=SALE` →
   list of real settlement offices serving that county, each with an `ID` — **the settlement/
   closing fee itemization varies per provider, not just per state**, so harvesting 2 different
   providers in the same county (if the tool returns more than one) yields 2 independently
   comparable fee schedules from the same underwriter, a useful richness bonus.
6. `GET /api/SRC/statesettings?statecode=<ST>&networkid=` → a large JSON blob of state-level
   defaults; re-serialize it verbatim into the POST body's `StateSetting` field.
7. `GET /api/SRC/ernstlookup?statecode=<ST>&countycode=<FIPS>` (only needed for the `QuoteType=3`
   flow) → returns `Recording.IndexT.PageRec`/`ShowTorrens`, which must be copied into
   `QuoteRequestRoot.QuoteRequest.Recording.PageRec`/`IsTorren`.
8. Build `QuoteRequestRoot` (exact JSON shape, field names case-sensitive):
   ```
   {"QuoteRequest":{"@version":"3.0",
     "TransactionInformation":{"TransactionDateTime":"0001-01-01T00:00:00","ClientReferenceNumber":"",
       "StewartReferenceNumber":"<any client-generated GUID>","ProviderID":"<from step 5, QuoteType=3 only>",
       "CustomerName":"","ClosingDate":"0001-01-01T00:00:00","TransactionTypeCode":"SALE",
       "TransactionTypeDescription":"Sale/Purchase with Mortgage","FeeItemTypeList":{"FeeItemType":[]},
       "SA_AgentID":null,"ProvideRemittance":false},
     "PropertyAddress":{"CityName":"<city>","CountyCode":"<FIPS>","StateCode":"<ST>","ZipCode":"<zip>"},
     "PolicyInfo":{"IsSimultaneous":"False","PolicyList":{"Policy":[
       {"FeeType":"OwnerPremium","PolicyCoverageTypeCode":"BASIC","IsCollateral":false,"Amount":"500000.00",
        "NumberOfYearsSinceLastIssue":null,"BuyerSplitPercentage":"100",
        "Reissue":{"PriorPolicyAmount":null,"PriorPolicyCoverageTypeCode":null,"PriorPolicyNumberOfYears":null},
        "EndorsementList":{"Endorsement":[]},"AdditionalPolicyList":{"Policy":[]}},
       {"FeeType":"LenderPremium","PolicyCoverageTypeCode":"BASIC","IsCollateral":false,"Amount":"400000.00",
        "NumberOfYearsSinceLastIssue":null,"BuyerSplitPercentage":"100",
        "Reissue":{"PriorPolicyAmount":null,"PriorPolicyCoverageTypeCode":null,"PriorPolicyNumberOfYears":null},
        "EndorsementList":{"Endorsement":[]},"AdditionalPolicyList":{"Policy":[]}}]}},
     "Recording":{"QuestionList":{"Question":[]},"MortgageNumPages":"25","DeedNumPages":"6",
       "ReleaseNumPages":"3","CountyName":"<county>","PageRec":"<from ernstlookup, QuoteType=3 only>",
       "OriginalDebt":"","UnpaidBalance":"","IsTorren":"<from ernstlookup>","Subjurisdiction":"",
       "LandSystem":"","FairMarketValue":""},
     "Internal":{"UnderwriterName":"","FeeItemName":"","Commercial":"false","Reverse":false,
       "UserRole":0,"UserEmail":"","HostNetworkGUID":""}}}
   ```
   Note: `IsSimultaneous` was sent `"False"` in both flows tested (WV, NH) yet the response's
   `RateManual.LenderPolicy` premium still reflected a simultaneous-issue rate on the `QuoteType=2`
   call and a stand-alone rate on `QuoteType=3` — the two flows appear to apply different default
   rate logic server-side regardless of this field. Unresolved; doesn't block harvesting (both
   figures are genuine, just label them by which flow produced them), but flagged for whoever wants
   precise control over simultaneous-vs-stand-alone pricing.
9. `POST /api/SRC/quote` (form-urlencoded body): `pageBuyerSeller` (`seller` for QuoteType=2,
   `buyer` for QuoteType=3), `TransactionTypeCode=SALE`, `PolicyCoverageTypeCode=BASIC` (sent twice,
   once per coverage-type select on the page), `QuoteType` (`2` or `3`), `NetsheetQuoteTrigger=1`
   (QuoteType=2 only), `ErnstRequestData=` (empty), `CountyName=<county>`, `StateSetting=<step 6
   JSON>`, `NetworkID=` (empty), `QuoteRequestRoot=<step 8 JSON>`, `IsRecordingSectionHidden=False`,
   `IsCalculatePremium=True`/`IsCalculateTitleServiceFee=True` (QuoteType=3 only),
   `__RequestVerificationToken=<step 1 token>`. Send the step-1 antiforgery cookie alongside.
10. Parse the response's `Pricing.RateManual`/`Pricing.TRID` (premiums), `Pricing.TitleServiceFee.
    ItemizedTitleServiceFeeList` (QuoteType=3 only — the actual settlement fee line items, with
    `BuyerAmount`/`SellerAmount` splits), and `Recording.Mortgage/Deed/Release`/`CFPB2015.CFPBTax`
    (QuoteType=2 only — recording fees + transfer/deed tax).

Full verbatim example request/response pairs (both flows, WV/Kanawha County scenario) are preserved
in the 2026-08-14 session transcript for reference if a future session needs to double-check field
serialization exactly. See WV.json and NH.json's Stewart entries for the harvested dollar figures
this recipe produced for those two states.

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

## 2026-08-05 session — Kentucky (KY) crosses the 3-provider threshold

### Rounsavall Title Group, LLC (Louisville, KY) — WORKING, a 2nd independent NetSheetCalc/TitleTap tenant, `app_id=479`
Distinct from the already-catalogued Agency Title Inc. KY tenant (`app_id=582`) — a genuinely
different company (verified against rtitlegroup.com's own address, 4360 Brownsboro Road, Suite
102, Louisville KY 40207), same platform. Standard `getNetSheetConfig` + `api/index.php/rate/
<amount>/<rate-key>` recipe (see the AZ/MI 2026-08-02 entries above for the base recipe).
**New chaining technique found this session**: this tenant's "Local Government Premium Tax"
field is itself formula-driven off a *second* rate-table call, keyed by combining the first
call's resolved premium with a raw value string pulled from the county dropdown (format
`pt_ml@<multiplier>#<id>`, e.g. `pt_ml@0.05#12`) — the trailing `#<id>` is a URL-fragment-style
suffix that must be stripped before use, or the second GET 404s: `GET api/index.php/rate/1940/
pt_ml@0.05` (using the first call's resolved Owner's Premium, 1940, as the path segment). Any
other TitleTap tenant with a chained/derived fee field (percentage-of-another-fee style) should
be checked for this same `pt_ml@<x>#<id>` pattern before being written off as unresolvable.
Result at $500k/$400k, Jefferson County: Owner's Title Insurance Premium $1,940.00
(formula-driven), Lender's Title Insurance Premium $200.00 (flat), Local Government Premium Tax
$97.00 (via the chained call above).

### Old Republic's second tool (`ortratecalculator.oldrepublictitle.com`) confirmed to cover KY (Location code 16), previously only logged as calculator-only/unusable
KY.md previously logged this tool as "interactive calculator only, no static figures found" —
this session actually drove the full ASP.NET WebForms postback flow (same technique as the
already-solved CT instance: category-select postback -> full form postback with policy types +
sale/loan amounts + a non-identifying placeholder property address, required only for the
county-lookup/effective-date resolution, not personal data -> results render inline in the same
page). No async/ScriptManager partial-postback headers needed, same as CT. Result at $500k/
$400k, Jefferson County (Louisville): Owner's Basic Policy Premium $2,075.00, Lender's
Simultaneous Basic Policy Premium $225.00, combined Grand Total Policy & Endorsement Premium
$2,300.00, plus a "Fees/Taxes: LOUISVILLE URBAN SERVICES DIST" line of $115.00 — a second,
independently-sourced corroborating figure for the same municipal premium tax Rounsavall's
tenant priced at $97.00 (real market variance between two independent sources' pricing of the
same statutory local tax, not a data error). **Recommendation**: this tool's `Location=<code>`
parameter is now confirmed for both CT (06) and KY (16); worth systematically enumerating
remaining codes for other below-threshold states (WI, CO, AR, NV, NM, UT, HI, OR, MS, SC, LA) in
a future session before assuming no coverage.

### KY dead ends / gated / jsOnly ruled out this session
- **Kentucky Title Center / Title Center of Greater Kentucky** — both route to an
  Investors-Title-underwritten calculator embedding TitleCapture — jsOnly, already-catalogued
  platform.
- **Metro Title (Louisville)** — embeds TRGC PowerSnap — jsOnly, already-catalogued platform;
  confirms PowerSnap's KY footprint includes a 2nd tenant beyond Upward Title & Closing (see the
  2026-08-04 CO/WI entry above).
- **`calculator3.mytitlerates.com/calculator/98`** — has a Kentucky option in its state dropdown
  but is explicitly branded "MyTitleRates Demo" (the platform's own admin/demo shell, same
  pattern already excluded for SC in the 2026-07-30 session) — not attributable to any real KY
  agency, not harvested.
- No `calculator.mytitlerates.com/rateCalculator.php` or `<agency>.titleclose.com` KY tenant
  found via search this session.

## 2026-08-05 session, continued — Wisconsin (WI) also crosses the 3-provider threshold

### Avenue Title (Wausau, WI) — WORKING, a 3rd independent NetSheetCalc/TitleTap tenant, `app_id=235`
Found via the Wisconsin Land Title Association's own company directory (`wlta.org/
wi-title-companies/`) rather than generic search — a higher-signal discovery channel than
appid-guessing/keyword search, worth trying for other states' state title-association member
directories before falling back to search. Confirmed genuinely WI (not a misattribution) via the
tenant's own `getAppData` config JSON `currentAppInfo.state: "WI"` field plus its street address.
**New routing gotcha**: this tenant's live-rate endpoint (`api/index.php/rate/<price>/
NewOwner235`, `NewLender235`) resolves at the platform's root `app.netsheetcalc.com` host — NOT
under the same `/company/<slug>/` path its `getAppData`/`getNetSheetConfig` config endpoints use.
Also notable: the same rate-key naming convention (`NewLender235`) differs in live-rated value
between this tenant's Purchase calculator ($450 flat default) and its separate Refinance
calculator ($500 live-rated at the same $400,000 loan amount) — a genuine per-tenant/per-form
configuration inconsistency, not a bug in the harvesting technique. Single-location Wausau/
Marathon County pricing, no county selector — no Milwaukee County reach.

### Title Resources Guaranty (`ratecalculator.trguw.com`) — WI's GraphQL `getQuote` confirmed configured but still 500s
Reverse-engineered the `GetCalculatorByStateSlug` + `getQuote` GraphQL query/variable shape
specifically for WI (via `POST ratecalculator.trguw.com/api/proxy/graphql`) and confirmed a
genuinely-configured WI calculator (nanoId, full policy/endorsement list) exists on this
platform — but every `getQuote` call, including a minimal owner-policy-only request, returns a
bare HTTP 500 with no validation-error detail, matching the same live backend outage already
logged for CT/MA elsewhere in this file. Not a request-shape problem on this survey's end — flag
for a retry-only follow-up once the backend recovers, no further reverse-engineering needed for
WI specifically.

### WI dead ends / gated / jsOnly ruled out this session
- **Lakefront Title** (Wauwatosa) — embeds a 3rd, previously-uncatalogued First American
  calculator domain, `agentcostcalc.firstam.com` (distinct from FACC and `ratecalculator.fnf.com`)
  — but the domain is now DNS-dead (`ENOTFOUND`), confirmed via two independent fetch methods.
- **EnTrust Title Group** — its `seller-net-proceeds.cfm` ColdFusion form accepts POST/GET
  submissions with a cookie-preserving session but always returns the byte-identical blank
  template regardless of submitted values — effectively jsOnly (client-side-only computation)
  despite superficially looking like a plain server-rendered form.
- 4 more misattributed NetSheetCalc/TitleTap appids (468=FL, 653=OH, 461=IN, 612=FL) and 2 more
  MyTitleRates.com agency IDs (`a=49`, `a=25`, both FL/MD/NJ/PA-only) surfaced by WI-flavored
  search — none genuinely WI, reinforcing the standing misattribution guard.
- Confirmed 2 more WI tenant footprints on already-catalogued jsOnly platforms: **PowerSnap**
  (via Burnet Title, already logged 2026-08-04) and **Elko** (a new tenant, Polk County Abstract &
  Title Services) — both remain browser-driven-session targets, not new discoveries.
- Several WI independents checked with no calculator at all (static PDF rate cards only, or no
  tool found): Wisconsin Title Group, Executive Title, River Valley Title Group, Frontier Title &
  Closing Services, Quality Title Group, Rusk County Abstract, Guaranty Closing & Title Services.
  Full detail in WI.md.

## 2026-08-05 session, continued — Connecticut (CT) gains a 2nd provider; FNF calculator scope corrected; FACC pushed further

### FNF family (`ratecalculator.fnf.com`) — scope correction: premium-only output IS valid calculator-harvest evidence after all
The 2026-07-25 entry above marked this tool "out of scope by design (premium-only)" for the
calculator-harvest mission. This session's CT harvest used it anyway, on the reasoning that CT's
own existing Old Republic entry (`ortratecalculator.oldrepublictitle.com`) is *also*
premium-only, and the mission's evidence bar for calculator-basis entries has never required
itemized settlement fees specifically — a premium quote, dated and sourced from the provider's
own calculator, is still valid evidence, same as it is for the published-schedule survey. Use
`?ID=<brand>&state=<ST>` (e.g. `?ID=FNF&state=CT`); the WebForms postback recipe is unchanged
from the 2026-07-25 entry. Harvested **Fidelity National Title Insurance Company** for CT: Owner's
Policy Total Premium $2,080.00, CPL $50.00. **Important finding**: the tool's underwriter dropdown
offers multiple FNF-family brands per state (for CT: Fidelity National, Chicago Title,
Commonwealth Land Title, National Title Insurance of NY) but they share one calculation engine —
re-running the identical scenario with a different brand selected produced byte-identical output.
**Do not credit more than one brand per state as a distinct provider** — record only one FNF-brand
entry per state regardless of how many brand names the dropdown lists. This tool is now a
recommended fallback for any below-threshold state where it's confirmed to have a live state
option in its dropdown — worth checking before ruling a state out as unreachable.

### First American FACC (`facc.firstam.com`) — pushed further, CORS/WAF header gate found, still not fully solved
Prior sessions logged this as jsOnly with a "partial API" (the `Calculator/*` AJAX endpoints).
This session discovered the endpoints silently return **empty HTTP 200 responses** unless
`Origin`/`Referer` headers matching the tool's own origin (`https://facc.firstam.com`) are sent —
a CORS/WAF-style gate that a bare `requests`-style client trips silently (no error, just empty
body) rather than with an explicit block. With the headers fixed, a malformed request body now
returns a proper `{"success":false,"serverError":"500"}` JSON error instead of a silent empty
200 — progress, but a schema-matching request to `Calculator/PropertyTypes` etc. still returns
empty rather than real data. Confirmed CT is a supported state and the flow is guest-accessible
via an SSID token with no login required. **Recommendation**: this is now the single
closest-to-solved unsolved lead in the whole catalog — a browser-driven session capturing the
real request body via devtools (the same approach already flagged for Stewart's Knockout.js form)
should prioritize this over hunting for entirely new platforms.

### CT dead ends / gated / jsOnly / misattributed ruled out this session
alphaadv.net (a personal/buggy tool, not a real provider); commonwealthct.com (DNS-dead);
`txtitlerates.ctic.com` (a false signal — "ctic.com" belongs to Chicago Title, not CATIC, despite
the CATIC-suggestive subdomain name); Stewart Rate Calculator (no CT agency embed found to supply
an `officeid`); MyTitleRates.com `a=24`/`a=15` (already-catalogued PA/NJ tenants, confirmed not to
serve CT); NetSheetCalc's CT landing pages (HTTP 500); 4 more misattributed netsheetcalc appids
(resolved to MO/MI/FL/MI, not CT); independencetitleagent.com (TX, not CT, name-collision);
Allied Title & Escrow, Blueprint Title, Progressive Title (none serve CT); Elko (gated,
demo-quote-only, matching the already-logged platform-level dead end); AMT Title Services, Fusion
Title Search (no calculator found); Eastern Title (page 404s); CT Titles LLC (a DMV
vehicle-title service, unrelated name collision with real-estate title). TitleClose.com's Old
Republic tenant (`ortris.titleclose.com`, StateID=7) drove the full `/Consumer/Search` flow but
returned "No companies" — inconclusive, matching the same zero-result pattern logged for a VA
tenant previously, not classified working/gated.

## 2026-08-05 session, continued — Colorado (CO) crosses the 3-provider threshold

### FNF National Rate Calculator (`ratecalculator.fnf.com`) — harvested for CO; radio-button postback gotcha found
Same tool as the CT entry above, now also confirmed to support CO. Denver County result: Owner's
Policy $1,998.00, Loan Policy $575.00, 3x CPL $25.00 each, Grand Total $2,573.00. **New WebForms
gotcha**: for radio-button-group fields (e.g. the transaction-type selector), the
`__EVENTTARGET` value must be `<fullFieldName>$<optionIndex>` (e.g.
`...pnlAmountsTransactionQuestions$0$TranType$rc_TranType$0`), not the bare field name as used
for other control types in this recipe — a future harvest that hits a radio group and gets a
postback validation error should check this first. Same brand-dropdown dedup rule applies
(Chicago Title/Fidelity National/Commonwealth Land Title share one engine here too).

### Principal Title, LLC (Arvada, CO) — WORKING, PII-gated form's own JS reveals an open GET endpoint underneath
A new, generalizable technique: this ALTA-member independent agency's net-sheet form gates on a
required Seller Name field (would normally be logged **gated** per the hard rule) — but its
WordPress plugin script (`rrq-script.js`, "Residential Rate Quote") itself calls a same-origin,
completely stateless, unauthenticated GET endpoint to live-populate the premium fields *before*
the gated form is ever submitted: `principaltitle.com/?getsptia=yes&zone=<n>&cp=<price>` (Denver
= Zone 1). Confirmed genuinely dynamic (not a static/cached response) across 4 different
zone/price combinations. Owner's Title Policy premium (Denver, $500k) $1,790.00, OEC endorsement
default $75.00. **Recommendation**: any title-agency site running this same "Residential Rate
Quote" WordPress plugin (search for `rrq-script.js` in page source, or the plugin's own likely
marketplace name) is a candidate for this same PII-gate-bypass technique — check before logging
a gated net-sheet form as a dead end.

### TitleCapture — new tenant confirms broader footprint (Allied Title & Escrow, CO)
Allied Title & Escrow (CO) embeds `<agency>.titlecapture.com`, an AngularJS SPA — jsOnly, no
discoverable stateless endpoint found, consistent with this platform's existing jsOnly
classification elsewhere in this catalog. Not a new platform, just a new confirmed CO tenant —
flagged alongside PowerSnap/Settlor as a browser-driven-session target with CO reach.

### CO dead ends / gated / jsOnly ruled out this session
National 1 Source (gated, required Seller Name field); Denver Title Co (`denvertitleco.com`,
DNS-dead); First Alliance Title (static PDF rate cards only, plus a separate account-gated
external app); Stewart Rate Calculator's CO agents page (HTTP 403 bot protection this session,
worth a retry later); MyTitleRates.com (only concrete hit found was Trident Land Transfer,
already-catalogued as PA/NJ/DE-only, excluded to avoid misattribution); several NetSheetCalc/
TitleTap CO-named tenant candidates were ambiguous/unconfirmed as genuine distinct CO agencies
and not pursued further; `comparetitlecompanies.com/get_quote.php?id=1` re-checked, First
Integrity Title Company remains the platform's only CO subscriber.

## 2026-08-05 session, continued — Arkansas (AR) crosses the 3-provider threshold (4 total)

### `ratecalculator.fnf.com` — must be driven via raw HTTP/curl, not WebFetch
**Important tooling note for future FNF harvests**: WebFetch's HTML-to-markdown conversion
strips the raw `__VIEWSTATE`/`__EVENTVALIDATION` hidden ASP.NET fields needed to replay this
tool's postback flow — use a plain HTTP client (curl / Python `requests`) instead. Confirmed AR
is a supported state (all 75 counties enumerated). Harvested **Chicago Title Insurance Company**:
Owner's Policy Premium $1,265.00, CPL $25.00, Grand Total $1,290.00 (Pulaski County) — no Loan
Policy line appeared despite a $400k loan amount entered, recorded as-is. Confirmed a
simplification to the postback recipe: a state's dropdowns (county, underwriter) can be set via
one combined form resubmission rather than individual `__EVENTTARGET` postbacks per dropdown —
only fields that don't exist in the DOM until a prior field is submitted (TranType,
AmountPurchase, AmountLoan1) strictly require their own dedicated `__EVENTTARGET` postback.
Byte-identical output confirmed again for the Fidelity National Title brand on the same platform
— one entry per state per the standing dedup rule.

### All American Title & Abstract, LLC (Little Rock, AR) — WORKING, first-party static-page calculator, JS-formula extraction technique
A genuinely first-party, non-SaaS tool (no netsheetcalc/titletap/mytitlerates platform involved
at all) — a static WordPress page whose client-side JS (`homeScripts.js`) contains the full
formula set. Read the JS directly, extracted a `NETSHEET_VALUES` object plus 2 price-linked
formulas (`INSURANCE_POLICY_PRICE = (price-100000)*0.005+575`, `DOC_STAMPS_PRICE = price*0.007`),
and validated the extraction was correct by reproducing the page's own $900,000 default scenario
exactly before applying the formulas at the standard $500,000 scenario. Result: Settlement/Title
Exam Fee $850 (flat), Search Fee $300 (flat), Title Insurance Policy $2,575 (formula), Doc
Stamps $3,500 (formula — notably 2x AR's statutory 0.33% transfer-tax rate documented elsewhere
in this survey, flagged as a possible stale/incorrect JS constant but recorded as-is per the
exact-figures rule, not corrected).

### Old Republic's `Location=<code>` tool — confirmed gated for AR (and likely most states); Location=01 (Alabama) is the outlier public pilot
This session found `Location=AR` (and other numeric codes tried) return "Access to Rate
Calculator is denied. This application can only be accessed when logged in through..." — gated.
Only `Location=01` (Alabama) loads publicly with no login. **Correction to the standing
recommendation to enumerate this tool's Location codes for other states**: Alabama appears to be
a public pilot/demo state, not representative of general access — do not assume other
not-yet-tried Location codes (beyond the already-confirmed CT=06, KY=16) will be open; check for
a login wall before investing further postback-flow effort.

### AR dead ends / gated / jsOnly ruled out this session
**Apex Title Northwest Arkansas** (NetSheetCalc/TitleTap `app_id=412`) — a genuine AR fee schema
exists via `getAppData` (Closing Fee $350, Search Fee $250, Lender's Title Insurance $100, CPL
$25, etc.) but the tenant's own `active` flag is `"0"` and its public page displays "This
application is currently inactive" — not counted as a working live provider despite the backend
JSON still returning data; worth rechecking if the agency reactivates it. **Pro Land Title**
(Elko/`useelko.com`) — login-required portal, no guest mode — gated. **Allegiance Title of
Arkansas** ("ALLQUOTE™" at `allegianceagentapp.com`) — renders no static content/discoverable
endpoint — jsOnly. **Ozark Abstract and Title** — HTTP 403 on both WebFetch and curl — blocked.
**First National Title Company** (`firstnationaltitle.net/QuoteRequest`) — Base44/Supabase SPA,
no discoverable endpoint — jsOnly. **Fort Dearborn Land Title** (appid=462) — reconfirmed
non-AR-configured, no change from the 2026-07-31 finding. No working calculator found for
MyTitleRates.com (no AR agency instance located), Western Arkansas Title Services, Commerce
Title & Closing, Lenders Title Co., or Advantage Title & Escrow.

## 2026-08-06 session — FNF national rate calculator harvested across 8 states via a reusable script; UT/SC quirk found

Built a reusable Python `requests.Session()` script (`fnf_harvest.py`, not committed to the repo —
scratch tooling only) implementing the FNF national rate calculator's `__doPostBack`/`__VIEWSTATE`
flow already documented above, generalized across any state/county pair rather than hand-crafted
per state. Ran it against every "complete (scarce)" state still below the 3-provider
calculator-quoted threshold whose own county dropdown confirmed the state is served by this tool:
**NV (Clark), NM (Bernalillo), HI (Honolulu), OR (Multnomah), MS (Hinds), NE (Douglas), LA (East
Baton Rouge), MA (Middlesex)** — all 8 succeeded, each returning an Owner's Policy premium/Grand
Total with no Loan Policy line (see each state's own `.json`/`.md` for the exact figures). This
confirms the tool's county-dropdown coverage extends well beyond the previously-tried CT/CO/AR/PA —
worth checking for any other state via its `?ID=FNF&state=<ST>` URL before assuming it's
unsupported.

**Working recipe refinement** (corrects/extends the original FNF recipe documented above): the
Amounts-step field names are nested one level deeper than the original recipe assumed —
`AmountPurchase`/`AmountLoan1` live under
`pnlAmountsTransactionQuestions$0$AmountPurchase$txt` /
`pnlAmountsTransactionQuestions$0$AmountLoan1$txt`, not directly under the `UcRateCalc1$` prefix as
the original PA-derived recipe's field-name shorthand implied. Also: submitting the Purchase Amount
and Loan Amount fields together in one POST (own `__EVENTTARGET` on the loan field) both reveals
any further conditional questions AND advances the flow in one round-trip, faster than the
original recipe's fully sequential price-then-loan-then-finish approach.

### UT and SC — unsolved AmountLoan1 postback quirk, flagged for next session
Both states surface an *extra* required Amounts-panel question beyond the ones every other
harvested state asked (UT: a Yes/No radio labeled "Lender/Borrower",
`CPLLenderBorrowerEligible$rc_CPLLenderBorrowerEligible`; SC: "Does this transaction qualify under
CFPB's TILA-RESPA Integrated Disclosure rule?", `CFPB_IsQualified$rc_CFPB_IsQualified`) — these
were successfully auto-answered (posting the radio's first/"Yes" `value` attribute directly, no
`__EVENTTARGET` needed since a plain hidden hidden hidden hidden hidden hidden checked-value works
for radios per HTML forms semantics — unlike textboxes). However **both states' `AmountLoan1$txt`
value is silently dropped by the server**: the exact same POST technique that reliably worked for
all 8 successful states above (and matches the original CT/CO/AR recipe) results in the response
echoing the field with no `value` attribute at all, unlike `AmountPurchase$txt` (which is always
correctly echoed back formatted, e.g. `value="$500,000.00"`) — confirmed reproducible across
several variants tried this session: (a) loan amount as its own solo `__EVENTTARGET` postback
immediately after price entry, (b) price+loan combined in one POST with loan as `__EVENTTARGET`,
(c) retrying with the loan field omitted entirely once revealed (still doesn't unlock Finish — SC's
`AmountLoan1` renders with `RequiredFieldValidator`, i.e. it cannot simply be skipped, unlike NV/AR
where the field is present but apparently not actually required). The response is a full HTML page
(not an AJAX delta), status 200, no server error text — just a silent value-drop, different from
every validation-error case seen elsewhere in this project. **Working theory, untested this
session**: `AmountLoan1` may be wired to the page's `ScriptManager`/`UpdatePanel` for genuine
partial (`Content-Type: application/x-www-form-urlencoded` + `X-MicrosoftAjax: Delta=true` +
`X-Requested-With: XMLHttpRequest` headers, plus a `__ASYNCPOST=true` field) rather than a
classic synchronous postback, unlike `AmountPurchase`/`TranType`/`ddlCounty` which all worked fine
as synchronous postbacks in this and every prior FNF harvest — worth trying the full async-postback
header/field set specifically for this one control before falling back to a browser session. Until
solved: **UT and SC are not counted as having a new provider from this tool this session** (UT
stays at 1 of 3 via Old Republic only; SC stays at 0 of 3).

**2026-08-09 update — solved. The "silent value-drop" was a replay-script bug, not a server
behavior.** The root cause was much simpler than the async-postback theory above: the replay
script's hidden-field extraction was pulling *every* `<input>` tag's name/value, including
`<input type="submit">` buttons like `btnGeneralNext="Next"`, and carrying that pair forward
unchanged into every subsequent POST via `dict(hidden)`. A real browser only ever sends the
name/value of the *specific* submit button that was actually clicked — sending a stale button
value on every request causes the ASP.NET server to treat each later postback as an implicit
re-click of that button, which silently fast-forwards/desyncs the wizard state (the page
advances further than the posted fields alone would justify, so a field entered "too early"
relative to where the server thinks the flow is gets dropped on the floor — indistinguishable
from a genuine silent value-drop by symptom alone). Fix: exclude `type="submit"`/`"button"`/
`"image"`/`"reset"` inputs from the base hidden-field dict entirely, and only add a given
button's name/value on the one POST that is deliberately "clicking" it. Once fixed, `AmountLoan1`
echoes back correctly (`value="$400,000.00"`) exactly like `AmountPurchase` always did, with no
async/UpdatePanel machinery needed at all — a plain synchronous postback, same as every other
control in this recipe.

With the script fixed, UT and SC's real (previously-unreachable, because the wizard desync never
let the flow get far enough to expose them) requirements turned out to be ordinary required-field
questions, not protocol quirks:
- **SC**: only the already-known `CFPB_IsQualified` question, defaults to "Yes" with no cascade.
  Result: Owner's Policy Premium (ALTA Homeowner's Policy) **$1,404.00** — byte-identical to the
  existing WFG entry for the same county/scenario; Loan Policy (concurrent) **$100.00**.
- **UT**: a genuinely new 3-question CPL-eligibility radio cascade with *no default answer*
  (`CPLLenderBorrowerEligible` → `CPLBuyerEligible` → `CPLSellerEligible`, each question only
  appearing in the response once the prior one is answered — a real sequential reveal, not a
  batch of fields present all at once). Answered each "Yes" (value=1) via its own dedicated
  postback, mirroring a real user's click-through. Result: Owner's Policy Premium (ALTA Standard
  Coverage) **$2,262.00**, Loan Policy Premium (ALTA Extended Coverage) **$1,225.00**, Salt Lake
  County. **Crosses UT to the 3-provider calculator-quoted threshold.**

**Generalizable lesson for any future ASP.NET WebForms replay recipe in this project** (FNF,
Old Republic's both tools, Knight Barry, Federal Title, Old Republic's second calculator, etc.):
never blindly carry forward a full `dict(hidden)` extraction that includes submit-type buttons
across multiple POSTs in a sequence — always strip button/submit/image/reset inputs from the
"ambient" field set and add a button's name/value explicitly only on the request meant to invoke
it. This bug likely explains some of this project's other "the server silently ignores/drops
field X" write-ups elsewhere in this catalog and may be worth a quick audit if any of those are
revisited.

## 2026-08-06 session, continued — Western Nevada Title Company (NV) crosses NV's threshold; 3 leads ruled out

Follow-up web-search pass after the FNF breadth harvest above, targeting the 5 states now closest
to threshold (NV, NM, HI, OR, NE, each needing exactly 1 more provider).

### Western Nevada Title Company — WORKING, NetSheetCalc/TitleTap, app_id 435
Found via `wntco.com/calculator` (Western Nevada Title Company's own site links to the platform
embed). A genuinely independent, first-party Nevada agency — not a shared big-four brand, so it
counts as a distinct provider unlike this session's FNF entries. Confirmed via the newer
`getNetSheetConfig`/`getAppData` config (both work for this tenant) plus the platform's
formula-driven rate-lookup pattern already documented above for other NetSheetCalc tenants:
`GET app.netsheetcalc.com/api/index.php/rate/<amount>/<rate-key>` (root host, NOT `/company/`-
prefixed — same routing gotcha already noted for the WI/KY sessions) for each of 4 rate keys found
in the tenant's config (`Settlement435`, `Owner435`, `Tranfer435`, `Lender435`). Result at
$500,000 price/$400,000 loan: Settlement Agent Fee $1,570.00 total (split $785.00/side per the
tenant's own formula), Owner's Title Insurance Premium $2,144.00, Lender's Title Insurance Premium
$940.00, Transfer Tax $2,050.00 total ($1,025.00/side), plus 7 flat ancillary fees (loan-tie-in
$150, wire $25, courier $50, doc prep $100, lender endorsements $100, deed recording $43,
deed-of-trust recording $43, e-filing $10/$5). The richest single-source itemized NV breakdown on
file — 10 distinct line items. Statewide pricing, no county-tiered dropdown in this tenant's
config.

### 3 leads ruled out (found via the same web-search pass, not counted)
- **New Mexico Land & Title Company** (`nmltco.com/rate-calc.html`) — the page's own "New Mexico
  Title Insurance Rate Calculator" is an `<iframe>` embed of
  `ortratecalculator.oldrepublictitle.com/EmbedRateCalc.aspx?Agent=A30088&Location=NM` — Old
  Republic's *other* calculator tool (distinct from `ortconline.com/Web2`, already documented
  above). Confirmed genuinely live and **not** NoBot-blocked for NM (a session-cookie 302 redirect
  through `/(S(...))/EmbedRateCalc.aspx` then a clean HTTP 200 with a populated `ddlCounty`
  dropdown) — unlike the IN/SC/LA/AR hits on this same tool that were hard-blocked in prior
  sessions. This is a real, harvestable NM data point, but **not counted as a distinct
  calculator-basis provider** since it's the same underlying company (Old Republic) as NM's
  existing `ortconline.com`-sourced entry — consistent with this project's brand/engine dedup rule
  applied elsewhere (FNF-family, CATICulator). Flagged for a future session as available
  supplementary/corroborating evidence, not a threshold-crossing find, and as a data point that
  `Location=<state>` NoBot-blocking is agent-specific or has loosened, not a blanket policy.
- **Principal Title, LLC net-sheet page** (`principaltitle.com/net-sheet-calculator/`) — surfaced
  in an Oregon-targeted search, but this is the *same* Principal Title, LLC (Arvada, CO) already
  harvested as a CO provider in the 2026-08-05 session, not a distinct Oregon-licensed entity — its
  page happens to also reference Colorado/Denver content. Not counted for OR.
- **Aksarben Title** (`aksarbentitle.com/rate-calculator.html`, Omaha, NE) — the page's
  "rate-calculator" embeds a generic third-party mortgage-interest-rate widget
  (`mortgagecalculator.org/rates-widgets/`), not a title-fee/closing-cost calculator at all — out
  of scope, ruled out.

**Recommendation for next session**: NM, HI, OR, NE each still need exactly 1 more genuine
provider distinct from Old Republic/FNF/CO's Principal Title. Apply the same "web search for the
platform name + state" technique that found Western Nevada Title Company (which succeeded where
generic `comparetitlecompanies.com`/`calculator.mytitlerates.com` state-list checks alone had not)
to each of these 4 states specifically.

## 2026-08-07 session — HI crosses the 3-provider threshold via a new white-labeled NetSheetCalc/TitleTap domain; OR/NM extensively searched with no new provider; WFG National Title's own rate calculator found but appears agent-login-gated

Per the 2026-08-06 recommendation, worked NM/HI/OR/NE (each 1 provider short of threshold),
highest-volume first (OR ~4.2M, NM ~2.1M, NE ~2.0M, HI ~1.4M).

### Premier Title & Escrow (HI) — WORKING, new white-labeled platform domain: `app.titlepremiumcalculator.com`
Found via a direct web search for independent Honolulu-area title agencies (after First Hawaii
Title's own embed confirmed jsOnly/TitleCapture, the same platform already logged jsOnly
elsewhere). Premier Title & Escrow's site (`premiertitlehawaii.com`) links to
`app.titlepremiumcalculator.com/company/index.php?appid=198` — **a previously-uncatalogued
front-end domain for the same NetSheetCalc/TitleTap platform already on file under its
`app.netsheetcalc.com` brand elsewhere in this survey** (confirmed identical JSON schema shape via
`getAppData`). **New host-split gotcha, generalizable to any future white-labeled-domain tenant
found on this platform**: the config endpoint (`getAppData`) and the human-facing quote page both
live on the white-labeled domain (`app.titlepremiumcalculator.com`), but the formula-driven
rate-resolution endpoint (`api/index.php/rate/<amount>/<rate-key>`) only exists on the platform's
canonical root host, `app.netsheetcalc.com` — the white-labeled domain 404s on that path. State
attribution confirmed two ways (per the standing misattribution-guard rule): the config's own
`property_address_section` → `state` field's `initial_val` is `HI` directly (a rare case where
this normally-unreliable field is actually correctly configured — cross-checked anyway), and the
`closing_fee` field's own label, "Escrow Fee + GET" (GET = Hawaii's General Excise Tax, a
state-specific statutory term), independently corroborates. Result at $500,000 purchase/$400,000
loan, 'Finance' estimate type, standard (non-extended) coverage: Owner's Title Insurance Premium
$858.00 (`rate/500000/Owner_St40`), Escrow Fee + GET $1,071.73 (`rate/500000/Escrow50`),
Simultaneous Issue Fee (Lender's Title Insurance) $250.00 (flat compare-formula, loan ≤ $1M),
Search Fees $100.00 (flat), Lien Search $26.18 (flat, "$26.18/name"), Deed Recording Fee $41.00
(flat), Mortgage Recording Fee $41.00 (flat) — 7 line items, the richest HI calculator breakdown on
file. **Crosses HI to calculator-quoted (3 providers)** — Old Republic, FNF, Premier Title &
Escrow. No personal data required (buyer name/address fields present but optional/unused for the
rate lookups). **Recommendation**: search specifically for `"app.titlepremiumcalculator.com"` (and
watch for other possible white-labeled front-end domains on this same platform family — it has
now been seen under at least 3 brand names: netsheetcalc.com, titleagentmarketing.com,
titlepremiumcalculator.com) as an additional discovery vector for OR/NM/NE and any other
below-threshold state, since these domains don't surface under a `netsheetcalc.com`-scoped search.

### WFG National Title's own rate calculator (`rates.wfgnationaltitle.com`) — partially solved, public API confirmed, full fee breakdown NOT yet obtained
WFG is a genuine 5th major underwriter (distinct from the FNF/Old Republic/Stewart families already
on file), so its own calculator would be a high-value multi-state find if public — its Angular SPA
config confirms `sellerNetStateList` includes both **Oregon and New Mexico** (this session's two
remaining target states), so solving this tool would very likely resolve both at once. The bundle's
`AuthService` (`/api/rates/auth/authenticate`, `/auth/validate`, `/auth/refresh`) initially read as
an agent-portal login gate, but **this turned out to be a red herring**: `GET /api/rates/State/
GetCalculationEnabledStates` works with no auth header at all and returns the full state list
(confirmed `isCalculationEnabled:true` for both OR and NM), and `POST /api/rates/sellernet/
calculate` also works fully unauthenticated — its ASP.NET model-binder even returns plain-text
"X is not provided!" validation errors that let the required top-level fields be discovered by
trial and error with no browser needed: `SalesPrice` (number), `PropertyState` (2-letter code),
`PropertyCounty` (plain name, e.g. "Multnomah"), `PropertyCity` (plain name, e.g. "Portland") are
all required; once supplied, the call returns HTTP 200 with a real (well-formed) JSON response
shape — `{listingAgentCommission, sellingAgentCommission, titleInsurance, taxProration,
sumOfCostsToClose, taxes, taxCredit, estimatedSellerNet, sumOfHudFees, hudFees}` — but every run
this session returned `titleInsurance:0` and `hudFees:null` regardless of what additional fields
were guessed and added (`Loans:[{LoanAmount:...}]` — found by reading the sibling `getFees()`
method's own null-coalescing defaults in the bundle, `TransactionType`, `ClosingDate`,
`OwnersPolicyAmount`, `IncludeTitleInsurance`, `Underwriter`, `PropertyType`, `RateType` — all
silently accepted/ignored by the model binder, no effect on output). A second, richer-sounding
endpoint, `POST /api/rates/fees/estimatefeesforsellernet` (whose Angular service method,
`getFees()`, is confirmed in the bundle to expect a `Loans` array with a `LoanAmount` field) 500s
with only a generic unhelpful ASP.NET ProblemDetails error (no field-name hints, unlike
`sellernet/calculate`) for every payload shape tried. **Root cause, confirmed via static analysis**:
the actual Angular *component* code that builds these two endpoints' full request payload (the
real field list — almost certainly including a fee-type/coverage-selection structure that
`sellernet/calculate` needs to populate `hudFees` instead of returning `null`) is **not present in
the single `main.js` bundle fetched this session** — a lazy-loaded route chunk that a static
`curl`/WebFetch of the `/rate-calculator/step1` shell page does not trigger. **This is a strong,
concrete browser-driven-session target**: open devtools' Network tab, click through the real
calculator UI once for any WFG-covered state, and capture the actual JSON body sent to
`/sellernet/calculate` (or `/fees/estimatefeesforsellernet`) — the endpoint itself is proven public
and working, only the exact request shape for a non-zero title insurance figure remains unknown.
Separately, `wfg.titletap.com/calculators/title-premium/` (a TitleTap-platform marketing template
branded for WFG) embeds `titleagentmarketing.com/company/title.php?appid=0` — `appid=0` is this
platform's generic unconfigured demo placeholder (same signature already seen for other platforms'
unclaimed template pages), not a real WFG agency instance — ruled out.

### OR and NM: extensively searched, no new provider found
Oregon (~4.2M, highest-volume remaining target): Next Door Title Agency's `nextdoortitle.com/
rate-calculator/` page (surfaced in an Oregon-flavored search) confirmed via direct address lookup
to be a Caledonia, Michigan company — a misattribution, not a genuine OR source (MI is already
past threshold regardless). Stewart's own Oregon agent-rates page (`stewart.com/en/state-pages/
oregon-agents/rates`) and its Portland STC office's "Seller's Net Sheet" calculator page both link
only to the generic `stewartratecalculator.com` homepage with no pre-configured `officeid` — the
underlying Knockout.js-templated quote endpoint remains unsolved from the 2026-07-26/2026-07-28
sessions, not retried further this session. `deschutestitle.com` (Bend, OR) is DNS-dead. New
Mexico: `nmltco.com`, `centrictitle.com`, and the WFG Albuquerque office page were all checked;
WFG's page 403s at the network/WAF level directly (`wfgtitle.com` domain-wide Cloudflare block,
consistent with the OR `wfgtitle.com/oregon/` page also 403ing this session) even though its
Angular rate-calculator subdomain (`rates.wfgnationaltitle.com`, above) is reachable. No 3rd
provider found for either state this session — both remain at 2 of 3. NE and its Title Midwest
platform tenants (`Rochester`, `WalnutValley`, `TitleProfessionals`, etc.) were spot-checked for a
possible 2nd NE-specific tenant beyond `nebtitlecoratecalc` but all resolve to other Midwest
states (KS/MO), confirming the platform's footprint doesn't extend further into NE — NE remains at
2 of 3 also.

**Recommendation for next session**: (1) confirm or rule out `rates.wfgnationaltitle.com` via a
browser-driven session — if it has any no-login quote path, it likely resolves OR and NM
simultaneously, the single highest-value remaining lead for this cluster; (2) apply the
`app.titlepremiumcalculator.com`-style "search for alternate white-labeled domain names on the
NetSheetCalc/TitleTap platform" technique to OR/NM/NE specifically, the same technique that just
worked for HI; (3) OR/NM/NE remain the next-highest-value scarce-state targets by population, each
needing exactly 1 more provider.

## 2026-08-08 session — WFG National Title's `rates.wfgnationaltitle.com` fully solved (no browser needed); 8-state breadth harvest, 4 states cross the 3-provider threshold

Per the 2026-08-07 recommendation, this was the top-priority target. **Fully solved without a
browser session** by fetching the calculator's own lazy-loaded Angular route chunk directly
rather than waiting for a real click-through to trigger it: the shell page's `runtime.js` exposes
webpack's own chunk-hash map (`{1:"common"}[e]||e)+"."+{1:"abf1092dc40e1f27e319",
6:"87e153fcb416054250fb",7:"8a01902021d264bdb338"}[e]`), so every lazy chunk (`common.<hash>.js`,
`6.<hash>.js`, `7.<hash>.js`) can be fetched by plain `curl`/`requests` with no JS execution —
**a generalizable technique for any other Angular/webpack SPA calculator blocked the same way**
(flagged for LA's Pulsar Title "Modiphy Flux" Aurelia bundle and any future SPA target).

### The real request schema (from `n.prototype.prepareCalculateFeeRequest` in chunk 7)
The 2026-08-07 session's blocker — `POST /api/rates/fees/estimatefeesforsellernet` 500ing with
generic ProblemDetails errors — was a payload-shape mismatch, not a gate. That session had
borrowed field names (`SalesPrice`/`PropertyState`/`PropertyCounty`/`PropertyCity`, all flat) from
the *sibling* `sellernet/calculate` endpoint's own validation-error text, but `estimatefeesforsellernet`
expects a differently-shaped body entirely. The real shape, read directly from the seller-net-sheet
component's own request-builder method:
```json
{
  "SalesPrice": 500000,
  "Loans": [{"LienPosition": 0, "LoanAmount": 400000}],
  "TransactionProductType": {"ProductTypeId": 0, "TransactionTypeId": 0},
  "Properties": [{"City": "Portland", "County": "Multnomah", "IsPrimary": true, "State": "OR"}],
  "premiumDiscounts": [],
  "transactionProductTypeId": 0,
  "calculateTaxRequest": {},
  "IsReissue": false,
  "SettlementStatementVersion": "CD",
  "Endorsements": [],
  "PriorLenderPolicy": {},
  "PriorOwnerPolicy": {}
}
```
Notes: `Properties` is a nested array (not flat top-level fields) — this alone was the fix.
`ProductTypeId`/`TransactionTypeId` of `0`/`0` are confirmed correct for this flow (verified
against the component's own hardcoded literal, not a guess). `calculateTaxRequest` is an
instance of an empty class (`Vn = function(){return function(){}}()`), so `{}` suffices.
`SettlementStatementVersion` must be the literal string `"CD"` (from the bundle's own enum,
`+DyJ` module: `{Hud:"HUD2010", Cd:"CD"}`) — `"HUD2010"` is the alternate value for a HUD-1-style
output, untested this session. Plain `Content-Type: application/json` POST, no cookies/auth
headers/personal-data fields required or present anywhere in this shape. Response shape:
`{closingFeeEstimate: {hudFees: [...], premiums: {lendersPremium, fullLendersPremium,
ownersPremium}}}`.

### Confirmed 47-state + DC coverage
`GET /api/rates/State/GetCalculationEnabledStates` (public, no auth, already known working since
2026-08-07) returns `isCalculationEnabled: true` for every state this session's target list needed:
OR, NM, CT, NE, MS, LA, UT, SC (plus dozens of already-past-threshold states, not re-queried).
This makes WFG a genuine 5th major-underwriter calculator source — distinct corporate family from
FNF/Old Republic/Stewart/First American, all already represented elsewhere in this survey.

### HUD-fee itemization is state-limited; most states are premium-only
Static inspection of the same chunk's hardcoded `feesConfiguration` array (`kn` in the minified
bundle — a flat list of `{state, description, sortWeight}` records used only for *display sort
order*, not gating) shows configured entries for only 7 states: **WA (6), CA (5), TX (5), OR (5),
AZ (3), NV (2), CO (1)**. For every other state, `hudFees` returns an empty array and the response
carries only the seller's-side `ownersPremium` figure — a premium-only result, exactly analogous
to the FNF national rate calculator's own scoping (accepted as valid calculator-harvest evidence
per the 2026-08-05 CT-session correction). `lendersPremium`/`fullLendersPremium` returned `0` in
every state tried this session despite the standard $400,000 loan amount — consistent with this
being a **seller**-net-sheet tool (buyer/lender-side fields exist in the broader app but aren't
part of this specific request/response pair) — not pursued further, out of scope for this flow.

### Results harvested this session (standard scenario, most-populous/standard county per state)
| State | County | Owner's Premium | Itemized fees | Threshold effect |
|---|---|---|---|---|
| OR | Multnomah (Portland) | $1,350.00 | Government Service Fee $30.00 (seller), Reconveyance Fee $200.00 (seller), Settlement or Closing Fee $2,300.00 ($1,150/$1,150 buyer/seller) | **crosses to 3** |
| NM | Bernalillo (Albuquerque) | $2,387.00 | none (premium-only) | **crosses to 3** |
| CT | Fairfield (Bridgeport) | $2,122.00 | none (premium-only) | **crosses to 3** |
| NE | Douglas (Omaha) | $1,573.00 | none (premium-only) | **crosses to 3** |
| MS | Hinds (Jackson) | $2,200.00 | none (premium-only) | 2 of 3 |
| LA | East Baton Rouge (Baton Rouge) | $2,579.72 | none (premium-only) | 2 of 3 |
| UT | Salt Lake (Salt Lake City) | $2,519.00 | none (premium-only) | 2 of 3 |
| SC | Greenville (Greenville) | $1,404.00 | none (premium-only) | 1 of 3 (SC's first calculator-basis provider of any kind) |

OR's Owner's Premium ($1,350.00) is byte-identical to the existing FNF entry's Grand Total *and*
to OTIRO's own bureau-set Basic Insurance Rate Schedule tier for $500,000 liability ($950 +
$2.00/$1,000 above $300,000 = $1,350) — strong independent corroboration that WFG, like FNF,
adopts Oregon's OTIRO bureau rate unchanged (see OR.json's own OTIRO entry for the underlying
schedule).

### `SettlementStatementVersion: "HUD2010"` — not tried this session
The alternate enum value would presumably surface a GFE/HUD-1-style `gfe` object (currently
`null`) instead of/in addition to `hudFees` — flagged as a quick, low-effort follow-up for a
future session (same endpoint, same auth-free access, just swap one string field) in case it
reveals itemized fees for the 41 states where `hudFees` is currently empty.

**Recommendation for next session**: SC (1 of 3), LA/UT/MS (2 of 3 each) are the remaining
below-threshold scarce states, in that priority order by population. Apply the existing
NetSheetCalc/TitleTap, MyTitleRates.com, and Title Midwest independent-agency search techniques
to find each state's next provider; also worth a quick try of
`SettlementStatementVersion: "HUD2010"` against these same 4 states in case it surfaces
itemized/additional fee data beyond the premium-only figures already on file.

### Same session, continued — bounded follow-up search for SC/LA/UT/MS's next provider, no new working source found
7 NetSheetCalc/TitleTap appid candidates surfaced via web search for this state cluster (One Key
Title `495`, Capital Title and Escrow `467`, The Title Firm `444`, Elite Title Company `438`,
TitleTech Title & Closing `393`, Attorneys' Title Services `568`, Title America `146`) — verified
each via its own `getAppData` config's `company_name`/`address`/`approved_states` fields (the
standing misattribution-guard technique) and all resolved to FL, MO, or AR; `393` is confirmed the
*same* TitleTech of Arkansas tenant already on file for AR (`approved_states: ["AR"]`), not a
distinct Louisiana instance despite surfacing in an LA-flavored search. Integrity Title Solutions'
short-code UT-flavored tenant (`app.netsheetcalc.com/c/ITS` → `appid=441`) resolved to Missouri.
**Investors Title** (`invtitle.com/calculator`, a genuine multi-state NC/SC underwriter — a real
lead worth re-trying if TitleCapture is ever solved) embeds the already-known-jsOnly TitleCapture
platform. **Pioneer Title Agency** (`tools.pioneertitleco.com`, a genuine Idaho/Utah title company)
— NEW jsOnly lead: a Nuxt SPA at `/netsheet/buyer` and `/netsheet/seller`; its main entry bundle
(`_nuxt/tpYJNdbc.js`) exposes only `/api/auth/*`/`/api/user/*` routes, no netsheet-computation
endpoint — the real API almost certainly lives in a route-specific lazy chunk not fetched this
session (same class of blocker WFG had, above, but not pursued further this session — flagged for
a future session to apply the identical "fetch the chunk-hash map, pull the lazy chunk directly"
technique). First American's own marketing page (`firstam.com/title-fee-calculator/`) confirmed to
link only to the already-known-jsOnly `facc.firstam.com` agent portal.

**Recommendation for next session**: (1) try `SettlementStatementVersion: "HUD2010"` against WFG's
already-solved endpoint for SC/LA/UT/MS — untried variant, same auth-free access, could surface
itemized/GFE-style fees beyond the premium-only figures on file; (2) apply WFG's lazy-chunk-fetch
technique to Pioneer Title Agency's Nuxt bundle for UT; (3) Investors Title (SC) is worth
revisiting the moment TitleCapture's own API is ever cracked, since it's a genuine multi-state
underwriter, not a shared-platform reseller.

## 2026-08-09 session — all 4 remaining below-threshold states (SC, LA, UT, MS) cross the 3-provider threshold; FNF postback-quirk bug fixed; Old Republic's second tool's NoBot block found to have lifted for SC/LA/MS

### `SettlementStatementVersion: "HUD2010"` — tried, dead end (as flagged above)
Tested against WFG's `estimatefeesforsellernet` endpoint for SC and LA. Both returned `hudFees: []`
and all 4 `gfe` boxes at `$0` (`GFE Box 4/5/7/8`), with `premiums.ownersPremium` unchanged from the
existing `"CD"`-mode figures already on file. No richer data than what's already recorded — this
variant is a dead end, not worth trying for UT/MS or any other state.

### FNF postback-quirk bug — root cause and fix (see PROGRESS.md's parallel writeup for the summary)
The "UT and SC — unsolved AmountLoan1 postback quirk" section above (originally logged
2026-08-06) is now solved — full technical detail moved into that section directly rather than
duplicated here. One-line summary: it was a replay-script bug (submit buttons leaking into every
POST as if re-clicked), not a real server-side block. Fixing it unlocked **UT's 3rd FNF-sourced
provider** (crosses UT to threshold) and **SC's 2nd** (still below threshold at that point, until
the Old Republic find below crossed it too).

### Old Republic's second tool (`ortratecalculator.oldrepublictitle.com`) — the IN/SC/LA NoBot block has (at least partially) lifted
The 2026-07-29/2026-08-01 sessions logged `Location=IN`/`Location=SC`/`Location=LA` as hard-blocked
by this tool's NoBot anti-bot control ("You are not authorized to access the site. Code: 2"), and
the 2026-08-08 NM session separately found `Location=NM` was **not** blocked, flagging this as
possibly agent/session-reputation-based rather than a blanket per-state policy. This session
retried SC and LA (per the standing blocked-source-retry protocol, extended here to cover this
calculator-specific block) and found **both now work cleanly** — a plain GET with a realistic
`User-Agent` and `Referer` header, no special cookie priming needed, 302-redirects through a
session-establishing URL straight to a real, working form. Also tried MS for the first time (not
previously attempted on this tool) and it worked immediately too. **IN itself was not retried this
session** (UT crossed its threshold via FNF instead, making an IN retry lower-priority than it
would otherwise be) — flagged as the next thing to try given this same loosened-block finding.

#### SC/LA: statewide, has a combined "simultaneous" category — richest output
Unlike `ortconline.com/Web2`'s county-list-driven UI, this tool's per-state form varies
structurally by state — SC uses a `ddlPolicyCategory` `<select>` (values: `1`=OWNERS, `4`=LOAN,
`5`=SIMULTANEOUS LOAN & OWNERS) that, once set to `5`, reveals `ddlPolicyType1`/`ddlPolicyType2`
policy-form dropdowns (`11528`=OWNERS-BASIC, `11535`=SIMUL LOAN for SC) plus `txtLiabilityAmt`
(Purchase Price) and `txtCrLiabilityAmt` (Loan Amount) fields. LA instead uses a `RadPolicyCategory`
radio group (`49`=PURCHASE/SALE, already checked by default) whose selected category *already*
exposes both liability fields directly with no separate category-then-dropdown two-step needed —
each state's own form must be inspected fresh rather than assuming one fixed field set, the same
lesson already learned for `ortconline.com`'s per-state OR/HI/MO county-list quirks. Recipe (SC):
GET `EmbedRateCalc.aspx?Location=SC&cms=<referer>` → POST `ddlPolicyCategory=5` (own
`__EVENTTARGET`) → POST `ddlPolicyType1=11528` (own `__EVENTTARGET`) → POST `ddlPolicyType2=11535`
(own `__EVENTTARGET`) → POST `txtLiabilityAmt=500000` (own `__EVENTTARGET`) → POST
`txtCrLiabilityAmt=400000` (own `__EVENTTARGET`) → POST `btnCalculate=Calculate`. Recipe (LA):
GET → POST `txtLiabilityAmt=500000` (own `__EVENTTARGET`) → POST `txtCrLiabilityAmt=400000` (own
`__EVENTTARGET`) → POST `btnCalculate=Calculate` — no category-selection step needed at all. Both
states' result table (`gvwResults`) returns a 3-column breakdown (Insurance Amount / Lenders Only
Policy / Owners + Lenders Policies) plus a `lblAdditionOwners`-labeled "Closing Disclosure
Formulated Cost Of Owners" figure — a genuinely new kind of data point not seen from any other
calculator source in this survey: the TRID-convention marginal Owner's-Policy-line charge when a
Lender's Policy is issued simultaneously (computed by the tool itself as Grand-Total-minus-
standalone-Lender's-premium). Results: **SC** — Owner's standalone $1,170.00, Lender's standalone
$960.00, simultaneous surcharge $100.00, Grand Total $1,270.00, CD-line Owner's figure $310.00.
**LA** — Owner's standalone $2,345.20 (byte-identical to the existing FNF entry — the strongest
cross-underwriter convergence found anywhere in this survey), Lender's standalone $1,429.60,
simultaneous surcharge $100.00, Grand Total $2,445.20, CD-line Owner's figure $1,015.60.

#### MS: no simultaneous category — two standalone quotes instead of one combined
MS's `RadPolicyCategory` only offers OWNERS/LOAN/HOME EQUITY/MISCELLANEOUS — no combined
simultaneous-issue option exists for this state on this tool. Harvested as two independent
single-category calculations: OWNERS (default-checked) with `txtLiabilityAmt=500000` →
`btnCalculate` gives a 2-column result table (Insurance Amount / Owners Only Policy) → Owner's
Grand Total **$2,000.00**; separately, POST `RadPolicyCategory=2` (LOAN, own `__EVENTTARGET`) to
swap the visible field from `txtLiabilityAmt` to `txtCrLiabilityAmt`, then `txtCrLiabilityAmt=
400000` → `btnCalculate` gives Lender's Grand Total **$1,200.00**. **New gotcha**: posting
`txtCrLiabilityAmt` while still on the OWNERS category (i.e. without first switching to LOAN)
throws a hard, uninformative HTTP 500 (`ErrorPage500.aspx`) — the field genuinely isn't present in
that category's rendered DOM, the identical "posting a field not in the DOM breaks the postback"
failure mode already catalogued for `ortconline.com`'s `ReoList`/OR's `LienPayoffTextbox` controls
elsewhere in this project. Always re-derive which fields actually exist in the current response
before posting to them, per that same standing lesson — don't assume a fixed field set carries
across categories any more than it carries across states.

### Independent-agency search for SC's 3rd provider — dead ends, moot once Old Republic worked
Before finding the Old Republic loosened-block fix above, this session also tried the standard
web-search technique for an independent SC agency provider: TitleTap appids `448` ("Signature
Title & Escrow Services") and `599` ("Title Insights LLC") both surfaced in SC-flavored search
results but resolved to Florida via their own `getNetSheetConfig` config (`"state":"FL"`) — the
same misattribution pattern logged for this state cluster in 3 prior sessions. Trident Land
Transfer's own `tridentland.com/title-rate-calculator/` (previously an `a=15` MyTitleRates.com
tenant known to serve NJ/PA) now returns a bare HTTP 403 on direct fetch — Cloudflare-blocked,
worth a browser-driven retry if this agency's SC coverage is ever worth confirming. "The Title
Resource Network" (`thetitleresourcenetwork.com`) and "Key Title LLC" (`keytitlellc.com/
calculator`) both surfaced as SC-search leads but are respectively a Squarespace marketing page
(no calculator, just a generic country-code `<select>` that happened to false-positive-match "SC"
as the ISO code for Seychelles) and a Wix SPA with no static calculator markup — neither pursued
further. None of this was ultimately needed once the Old Republic retry succeeded, but logged here
so a future session doesn't repeat the same search.

### Pioneer Title Agency's Nuxt netsheet tool (UT) — reclassified from promising-jsOnly to confirmed-gated
The 2026-08-08 session logged this as a jsOnly lead worth a future lazy-chunk-fetch attempt (its
main bundle exposed only `/api/auth/*` routes, implying the real netsheet-computation endpoint
might live in an unfetched route-specific chunk). This session fetched all 38 of the site's
`_nuxt/*.js` chunks directly and found the real answer: the route table (in `tpYJNdbc.js`)
explicitly marks both `/netsheet/buyer` and `/netsheet/seller` (and their `/:id()` detail variants)
with `middleware:"auth"`, and a plain fetch of either path now server-side-redirects straight to
`/login` (HTTP 302) rather than serving the SPA shell at all — a hard auth gate, not merely an
unfetched lazy chunk. Reclassified from jsOnly to **gated**; no further pursuit recommended for
this specific tool. Moot for this session's purposes since UT crossed its threshold via the fixed
FNF calculator instead.

### Recommendation for next session
The calculator-harvest tracker's original "complete (scarce)" target list has no below-threshold
states left as of this session. Priorities going forward: (1) retry Old Republic's second tool for
**Indiana** (`Location=IN`), the one remaining state from the original 2026-07-29 NoBot-block
finding not yet retried under the new loosened-block discovery; (2) a browser-driven session to
finally crack TitleCapture and/or Qualia Connect, both confirmed to recur across many independent
agencies nationwide (would likely unlock several states at once, more than any single-agency find);
(3) revisit Stewart's `/api/SRC/quote` and First American's FACC `Calculator/Next` endpoint with a
real browser network-tab capture, both individually-mapped-but-unsolved since 2026-07-23/2026-07-24;
(4) for states already past threshold, consider a "richness" pass — many entries (especially WFG's)
are premium-only, and a state with a full itemized settlement/closing/doc-prep breakdown from a
4th+ provider would meaningfully improve evidence quality even without moving the threshold needle.

## 2026-08-10 session — Location=IN durably confirmed blocked; Title Midwest's `RteCalc` tenant found (MN richness)

Retried recommendation (1) above first: `ortratecalculator.oldrepublictitle.com/EmbedRateCalc.aspx
?CallingApp=PUBLIC&Location=IN`, with a realistic `User-Agent` and a `Referer` of
`https://oldrepublictitle.com/rate-calculator/?location=in`, still returns the exact NoBot block
message ("You are not authorized to access the site. Code: 2") first logged 2026-07-29 — unchanged
even though the same block loosened for SC/LA/MS the prior session. Since IN is already
calculator-quoted (3 providers, all via the unrelated NetSheetCalc/TitleTap platform), this tool
should now be considered a durable dead end for IN specifically rather than a standing retry
candidate — drop it from the routine blocked-source-retry rotation unless a browser-driven session
wants to try establishing a longer cookie/session history first.

No browser access this session, so recommendations (2) and (3) (TitleCapture/Qualia Connect,
Stewart's `/api/SRC/quote`, First American FACC) were not attempted — still queued for a
browser-driven session. Instead pursued (4), the richness pass, applied to `forms.titlemidwest.com`
("Title Midwest"), the multi-tenant classic-ASP platform first catalogued 2026-08-02. Re-listed its
open root directory and diffed against the tenant slugs already harvested (`mnsecured` for MN,
`SecuredTitleKC`/`MstCalc` for MO, several `KST*`/Kansas slugs not relevant here since KS isn't a
"complete (scarce)" state) — found one previously-unharvested slug, **`RteCalc`**, whose page
`<title>` reads "Rochester Title Rate Calculator" and whose print-only footer gives the address
"2870 Superior Drive NW, Rochester MN 55901" (Rochester Title & Escrow, Olmsted County MN). Same
recipe as the existing `mnsecured` entry — read `calculator.js`'s `ajaxUpdate()` function to find its
plain jQuery `$.ajax` GET target (`ajax.asp?loantype=p&purchamt=<amt>&loanamt=<amt>&payoff=n&county=
<id>`, `county` id resolved from the page's own `<select id="loc_county">` dropdown) — no form
submission, cookies, or JS execution needed to reproduce.

**Key finding — this tenant's priced footprint does not include the Twin Cities metro.** Querying
`county=27` (Hennepin, MN's most populous, and the code that returns a full quote for the
`mnsecured` tenant) against `RteCalc` returns `{"TitleEvidence":-1,...,"Tier":4}` — the tool's own
"Call For Rates" fallback state (confirmed by the front-end JS: `mTitleEvidence <= 0` triggers a
red "Call For Rates" label instead of a dollar figure). The same fallback occurs for Dakota (`county=
19`) and Ramsey (`county=62`), MN's 2nd/3rd most populous counties. Olmsted (`county=55`, this
agency's own home county) returns a fully-priced Tier-1 quote instead — substituted per the standard
scenario's "largest county/city available in a given calculator's own service footprint" allowance.
Result at $500k/$400k, Olmsted County: `pTotal: $1,712.50` (`pLender: $1,125.00` + `pOwner: $587.50`),
`TitleEvidence: $220.00`, `ClosingFee: $175.00`, `TitleExam: $175.00`, `PlatServices: $80.00`,
`RecordingServicesFee: $25.00`, `CourierFee: $40.00`, `DeliveryServiceFee: $40.00`,
`NameAssessSearch: $50.00`. This confirms the Title Midwest platform's per-tenant independence
extends even to identical county codes returning materially different responses (a fully-priced
quote for one tenant, a fallback non-answer for another) — the strongest version yet of the
per-tenant-independence pattern already established for MyTitleRates.com/TitleCapture elsewhere in
this catalog. See MN.json/MN.md for the full harvested entry — MN's 4th calculator-basis provider
(richness addition; MN crossed the 3-provider threshold back on 2026-08-02).

**Resolved as a duplicate, not a new provider**: a second, previously-unlisted slug on the same
platform, `RateCalculator/titleprofessionals/Rate-Calculator.htm`, was also found in the directory
listing. Its static HTML carries no county dropdown, state name, or company name (page `<title>` is
the generic "RESPA-Rate-Calculator"), but its companion JS bundle
(`RESPA-Rate-Calculator_files/resparc.js`) contains the literal string `"Title Professionals' RESPA
Calculator"` and directs users to `www.TitleProfessionals.com`. That domain 200-redirects straight to
`mnsecuredtitle.com` — i.e. **Title Professionals is a former/alternate brand name for Minnesota
Secured Title**, already on file as MN's 3rd calculator-basis provider (and itself the `mnsecured`
Title Midwest tenant). This tool is also a legacy 2008-era pre-2010-RESPA-reform GFE-line-item
calculator (`g_offln_msg` references "GFE #4", not the modern Loan Estimate/Closing Disclosure
format used elsewhere in this catalog) — likely dead/superseded by the same company's newer
`mnsecured` tenant already harvested. Not a distinct provider; not re-harvested. No further pursuit
needed.

### Recommendation for next session
Unchanged in substance from the 2026-08-09 session's own recommendation: (1) a browser-driven session
to crack TitleCapture and/or Qualia Connect remains the single highest-expected-yield remaining
target; (2) continue the richness pass on already-quoted-but-thin/premium-only states (WFG/FNF-heavy:
NM, NV, HI, OR, NE, SC, LA, MS, UT) using the same "re-scan already-catalogued shared platforms'
directory listings for uncatalogued tenant slugs" technique that found `RteCalc` this session — Title
Midwest, MyTitleRates.com, and NetSheetCalc/TitleTap have all shown this pattern (new tenants appear
over time on platforms already fully catalogued in a prior pass), though always cross-check a "new"
slug's actual company/domain before harvesting (`titleprofessionals` above looked new but turned out
to be a legacy rebrand of an already-on-file provider). Drop Old Republic's `Location=IN` from the
standing blocked-source-retry rotation (see above — now a confirmed durable block, not a
loosening-over-time candidate like SC/LA/MS turned out to be).

## 2026-08-11 session — WFG's HUD-fee-itemization coverage list (AZ, NV, CO) fully harvested

The 2026-08-08 session solved WFG's `POST https://rates.wfgnationaltitle.com/api/rates/fees/
estimatefeesforsellernet` endpoint and found (via static inspection of the bundle's hardcoded
`feesConfiguration` sort-weight table) that only 7 states have configured HUD-fee line-item
itemization: **WA, CA, TX, OR, AZ, NV, CO**. That session harvested OR (part of its 8-state
below-threshold batch) but did not check the other 6. This session checked the remaining 3 that
are in-scope for this tracker (WA/CA/TX are non-scarce, published-schedule-rich states, out of
the calculator-harvest tracker's core scope — not checked this session, flagged below as a fast
optional follow-up) and confirmed **none of AZ, NV, or CO had a WFG entry on file yet**.

Queried the endpoint directly via plain `curl -X POST` (no browser, no session cookie, no personal
data — same exact request shape as the 2026-08-08 session's OR entry, just swapping `Properties`):
```json
{
  "SalesPrice": 500000,
  "Loans": [{"LienPosition": 0, "LoanAmount": 400000}],
  "TransactionProductType": {"ProductTypeId": 0, "TransactionTypeId": 0},
  "Properties": [{"City": "<city>", "County": "<county>", "IsPrimary": true, "State": "<ST>"}],
  "premiumDiscounts": [],
  "transactionProductTypeId": 0,
  "calculateTaxRequest": {},
  "IsReissue": false,
  "SettlementStatementVersion": "CD",
  "Endorsements": [],
  "PriorLenderPolicy": {},
  "PriorOwnerPolicy": {}
}
```
All 3 returned clean HTTP 200 with a live server `timestamp` field (2026-08-11, confirming these
are fresh dated quotes, not cached):

| State | County | Owner's Premium | Itemized HUD fees | Threshold effect |
|---|---|---|---|---|
| AZ | Maricopa (Phoenix) | $2,154.00 | Settlement or Closing Fee $1,410.00 (split $705/$705 buyer/seller) | 3→**4 providers** |
| NV | Clark (Las Vegas) | $2,059.00 | County of Nevada Estimated Recording Fees (Transfer Tax) $2,550.00 (seller-paid); Settlement or Closing Fee $1,580.00 (split $790/$790) | 3→**4 providers** |
| CO | Denver | $1,990.00 | Mobile Notary Fee $150.00 (seller-paid); Settlement or Closing Fee $400.00 (split $200/$200); Tax Certificate Fee $30.00 (seller-paid, mismoType TitleExaminationFee) | 3→**4 providers** |

`lendersPremium`/`fullLendersPremium` returned $0 in all 3, same seller-net-sheet-only limitation
already documented for OR. Full entries recorded in AZ.json/NV.json/CO.json; narrative addenda in
AZ.md/NV.md/CO.md; PROGRESS.md's calculator-harvest tracker table updated to 4 providers for all 3.

**Not yet checked**: WA, CA, TX (the remaining 3 states on WFG's itemization list) — out of scope
for this tracker since they're non-scarce published-schedule states, but the same 3-line curl
request (just swap `Properties`) would be a near-zero-effort richness add if a future session has
spare time and wants completeness on this one platform's full itemization footprint.

## 2026-08-12 session — richness pass: NM gains a corroborating Old Republic 2nd-tool entry; HI/Title Midwest re-scans confirm no new provider; `SettlementStatementVersion: "HUD2010"` lead retired (already dead-lettered 2026-08-09)

**Correction to the incoming task brief**: the brief's priority #1 (try WFG's
`SettlementStatementVersion: "HUD2010"` against NM/HI/NE/SC/LA/MS/UT) was already tried and logged
as a dead end in the **2026-08-09** session's own CALCULATORS.md entry ("Tested against WFG's
`estimatefeesforsellernet` endpoint for SC and LA. Both returned `hudFees: []` and all 4 `gfe`
boxes at $0... this variant is a dead end, not worth trying for UT/MS or any other state"). Not
re-tried this session — re-confirmed by re-reading that entry rather than re-querying the API, to
avoid burning session time on an already-closed lead. Flagging clearly here since the task brief
presented it as untried; future sessions should treat this as permanently closed unless WFG's own
`feesConfiguration` table is later observed to have changed.

### New Mexico: Old Republic's 2nd tool (`ortratecalculator.oldrepublictitle.com`) harvested — corroborating richness, not a new provider count
The 2026-08-06 NV session found (but did not harvest) that New Mexico Land & Title Company's own
site (`nmltco.com/rate-calc.html`) iframes this exact tool via `EmbedRateCalc.aspx?Agent=A30088&
Location=NM`, confirmed live/not-NoBot-blocked at the time. This session drove it to a full quote:
same statewide PURCHASE/SALE form pattern already on file for LA (radio value 49 pre-checked,
`txtLiabilityAmt`/`txtCrLiabilityAmt` exposed directly, no county selector). Result: Owner's Basic
premium **$2,387.00**, standalone Lender's Policy premium **$1,770.00**, $100.00 simultaneous
surcharge, Grand Total (Owner's + Lender's + 2 endorsements) **$2,562.00**. Not counted as a 4th
distinct NM provider (same Old Republic corporate entity as the existing `ortconline.com` entry,
per the standing brand/engine dedup rule) but recorded as richness: this figure is byte-identical
to the existing `ortconline.com` Old Republic entry, the existing WFG seller-net-sheet entry, AND
the OSI promulgated-rate table already on file — a 4-way convergence, the strongest found anywhere
in this survey, confirming NM's title premium is genuinely fixed/promulgated regardless of tool or
agent. Full entry in NM.json/NM.md.

**Retried the same `Location=<state>` pattern (no Agent param) for NE/UT/HI** — all three returned
the identical "not authorized... Code: 2" NoBot block, both with and without `CallingApp=PUBLIC`.
Confirms the NM/LA/SC/MS unlocks are agent-code- or referer-specific, not a general per-state
loosening — a plain `Location=<ST>` hit with no matching `Agent=` parameter and no matching
third-party embed page as Referer should not be expected to work going forward without first
finding another company's site that iframes a working `Agent=` code for that state (the same
technique that worked here for NM via nmltco.com).

### Hawaii: 2 web-search leads ("Island Title & Escrow Agency", "SUPREME Title Company, LLC") ruled out via the standing misattribution-guard technique
A search for HI-flavored NetSheetCalc/TitleTap tenants surfaced `app.netsheetcalc.com/company/
index.php?appid=396` ("Island Title & Escrow Agency") and `appid=399` ("SUPREME Title Company,
LLC"). Both looked promising by name but resolved, via their own `getAppData` config's
`address1`/`city`/`state`/`approved_states` fields, to **Merritt Island, FL** and **Katy, TX**
respectively — neither is a genuine Hawaii tenant. Classic name-based misattribution ("Island" ≠
Hawaii), consistent with this project's standing lesson to always verify company/address before
counting a "new" tenant slug. Also checked First Hawaii Title's own "Net Sheet Tools" page
(`firsthawaii.com/net-sheet-tools/`) — all 4 of its calculator links resolve to
`firsthawaiititle.titlecapture.com/login`, the same already-catalogued jsOnly TitleCapture
platform flagged repeatedly as the top browser-driven-session target. Checked Title Guaranty of
Hawaii's own "TG Estimator" (`express.tghawaii.com/estimator`, `tghawaii.com/tg-estimator/`) —
its published fee-schedule PDF backing this tool (`Escrow-Fees-Online-2025-8.5x11-current.pdf`,
"Effective January 2026") turned out to already be on file verbatim as HI.json's 1st entry
(byte-identical dollar figures at every tier, e.g. $2,250.00 escrow fee / $2,168.00 title premium
at $500,000) — not a new find, just independent confirmation the existing published-schedule entry
is still current. No new HI provider found this session; HI remains at 3 calculator-basis
providers.

### Title Midwest (`forms.titlemidwest.com`) re-scan: all previously-unidentified tenant slugs now resolved, none serve NM/HI/NE/SC/LA/MS/UT
Re-listed the platform's open directory and resolved every remaining previously-uncatalogued slug
via its own `Calculator.asp`/config: **BeachCalc** = Beach Abstract (unidentified state, East
Coast-flavored branding, GFE-style calculator), **Coffeyville** = Kansas Secured Title Southeast
(KS), **HstCalc** = Hot Springs Title (AR), **mainstreettitleco** = a static HTML page (no live
ajax backend), **MstCalc** = Missouri Secured Title (MO, duplicate of the already-catalogued
family), **NtcCalc** = **Nebraska Title Company** — confirmed the *same* company already on file
as NE's 1st calculator-basis provider (`nebtitlecoratecalc`, a Vue.js SPA), not a distinct 4th
entity: this classic-ASP/`ajax.asp` twin's live `GET ajax.asp?loantype=p&policytype=e&
purchamt=500000&loanamt=400000&underwriter=old_republic` returned `{"pOwner":1632.5,...}`,
byte-identical to the $1,632.50 already recorded from the Vue SPA's hand-extracted formula — a
clean independent HTTP-confirmed corroboration of the existing figure, but not a new provider (and
the page's own `feeOtherPurchase`/`feeOtherRefinance` JS constants, which looked like they might
finally disclose NE's missing settlement fee, are dead/unwired code — never referenced by the
current `calculator.js`, confirmed by full read of both files). **TcrCalc** = Title Company of the
Rockies (CO, already past threshold). No slug on this platform serves NM/HI/SC/LA/MS/UT — this
platform's footprint is confirmed Midwest/mountain-region only (MN/MO/KS/NE/TX/CO), a dead end for
those 6 states specifically; no further re-scans of this platform needed for that state cluster.

### Freshness spot-check (5 oldest-retrieved published sources, all from states never previously included in any prior freshness-pass rotation — UT/Sutherland Title fees page, SC/Mogill Law real-estate page, MS/Stewart's virtualunderwriter.com rate manual PDF, NE/FNTI Nebraska rate manual PDF, HI/oahure.com First American rate sheet PDF)
4 of 5 returned a clean HTTP 200. The oahure.com PDF 403'd with response headers showing
`cf-mitigated: challenge` (a Cloudflare bot-mitigation challenge page, not a 404/removed-file
signal) — same category as the existing CATIC CT/AZ Pioneer Title/Lighthouse Title WAF-block
precedent, so **not** marked `{stale: true}`, flagged for monitoring only.

### Blocked-source retries (one quick check each): no status change
AZ DIFI (`difi.az.gov/title-insurance-rate-filings`) still HTTP 403; CATIC CT
(`catic.com/state-resources/connecticut`) HTTP 200 this run with genuine readable content (still
fluctuating 200/403 across sessions, underlying FlippingBook-viewer situation unchanged either
way); Jackson & Scott AL (`realestatelclosings.com/closing-costs-calculator/`) HTTP 403, consistent
with recent sessions' WAF-block finding.

**Recommendation for next session**: (1) a browser-driven session to finally crack TitleCapture
and/or Qualia Connect remains the single highest-value remaining lead (recurs across dozens of
independent agencies nationwide, including First Hawaii Title found again this session); (2) the
`Location=<ST>` NoBot block on Old Republic's 2nd tool is now confirmed agent/referer-specific, not
a loosening-over-time phenomenon — the productive technique going forward is searching for
*other companies' sites* that iframe this tool with their own working `Agent=` code for a given
state (the technique that worked for NM this session), not retrying bare `Location=<ST>` URLs;
(3) WA/CA/TX remain the only unchecked states on WFG's HUD-fee-itemization list, still a
near-zero-effort richness add if ever prioritized; (4) NM/HI's remaining richness headroom is now
thin after this session and the 2026-08-08/11 sessions — SC/LA/MS/UT are comparatively less
explored for a genuine 4th (non-dedup) provider and worth a fresh look with a new technique next
time.

## 2026-08-13 session — UT richness pass finds 2 new leads, both dead ends (Inwest Title gated, Novation Title's First American AgentNet/PrismPowered platform partially re-mapped); freshness spot-check surfaces a domain-wide TLS break on documentpub.fnti.com; standard blocked-source retries, no change

Per the 2026-08-12 recommendation, targeted UT for a genuine 4th (non-dedup) calculator provider
using a fresh web-search angle (searching by platform-name keywords — "netsheetcalc"/"titletap"/
"quick quote" — combined with "Salt Lake County" rather than generic state-name searches, which had
previously surfaced only already-ruled-out misattributed appids). Two new, genuinely UT-named leads
surfaced that had not appeared in any prior session's search results.

### Inwest Title Utah (`inwesttitle.com/NetSheetCalculator`) — confirmed login-gated, not pursued
A genuine Utah company (West Haven, 29-county coverage) running its own first-party Angular
"Inwest-Online" agent portal at `www.inwesttitle.com/Inwest-Online/api/1.1/`. Static analysis of the
site's `main.*.js` bundle found the calculator's route (`/CalculateSellerProceeds`) posts to
`ratecalc.php` via a form-model class (`Ah`) whose fields include not just `SALESPRICE`/`COUNTY`/
`LOANAMOUNT` but also `Buyer1SSN`/`Seller1SSN` and other personal-data fields — flagging this as
likely an internal order-entry tool, not a public calculator, despite being linked from the public
marketing site. Confirmed via a plain unauthenticated POST containing only numeric/non-personal
fields (`ordertype=BS&SALESPRICE=500000&COUNTY=Salt+Lake&LOANAMOUNT=400000&LENDERS=true&
OWNERS=true&CLOSING=true`, no name/SSN/contact fields sent) — the endpoint returned clean JSON
`{"error":true,"err_text":["You need to login before accessing that page."],"login":false}`,
i.e. the whole `Inwest-Online` API family is session/cookie-gated regardless of the requested
sub-resource. Logged **gated** (agent login required) per the hard rule against entering personal
data — no SSN/contact fields were ever sent. Not a new UT provider.

### Novation Title (`novationtitle.com/calculators`) — embeds First American's AgentNet/PrismPowered platform (same one already jsOnly-logged for TN's Title Group of Tennessee); same-origin API host now confirmed, still no public quote path found
The page iframes `prismpowered.com/NovationTitle/guest-home`, which redirects to
`marketing.agentnetsolutions.com/NovationTitle/guest-home` — First American's white-label
"AgentNet Marketing" Angular SPA, the identical platform the 2026-08-07 TN session already logged
jsOnly via a different tenant. Pushed the static-analysis technique that solved WFG (fetch the
lazy/main bundle directly, read the Angular service classes for the real endpoint) further than the
prior session did: the bundle's `main.*.js` (7.6MB, fetched from the site root — note the app's
`<base href="/">` means bundle URLs are root-relative, *not* under the `/NovationTitle/` tenant
path, a gotcha that 404s a naive fetch) contains real API route strings — `/api/Bundle/quote`,
`/api/Quote/calculate/customfees`, `/api/Quote/settings/update`, `/api/Quote/email`,
`/api/Quote/track`, `/api/CustomFees/user/create` — served through an Angular service whose
`baseUrl` is a same-origin path built from a minified local variable, not a hardcoded external host.
Confirmed the API is genuinely same-origin (not a separate `api.*` subdomain) by probing
`marketing.agentnetsolutions.com/api/Quote/settings/update` directly with a plain GET: **HTTP 405**
(Method Not Allowed) rather than a generic 404, confirming the route exists and is reachable, just
not via GET. No `/api/*Guest*` or `/api/*NetSheet*` route name was found anywhere in the bundle —
the "guest-home" page name appears to be marketing terminology, not a signal that a no-login quote
flow exists. Did not attempt a blind POST against `/api/Quote/calculate/customfees` (its request
body shape is unknown and, per the WFG lesson, guessing field names risks hours of dead-end
iteration better spent elsewhere this session) — logged **jsOnly**, with these concrete new
findings (root-relative bundle path, same-origin API host, exact route list) left for a future
session with more time or browser devtools to finish. Not a new UT provider; **UT remains at 3
calculator-basis providers**, both new leads this session ruled out.

### Freshness spot-check (5 oldest-retrieved published sources from states never previously included in any prior freshness-pass rotation — FL/Florida OIR Rule 69O-186.003, KS/First American Kansas escrow-fee schedule PDF, MO/First National Title Insurance Co. rate manual PDF, OK/American Eagle Title Group fee sheet PDF, RI/WFG Rhode Island rate manual PDF)
4 of 5 (FL's primary `flrules.elaws.us` source, KS, OK, RI) returned a clean HTTP 200. **New
finding**: MO's secondary/cross-verification source, hosted on `documentpub.fnti.com` (First
National Title Insurance Company's document-hosting domain), now fails with a TLS handshake error
(`SSL certificate problem: unable to get local issuer certificate`) via both `curl` and WebFetch
(which separately reported HTTP 503) — confirmed this is domain-wide, not a single dead link, by
also testing FL's own `documentpub.fnti.com` cross-verification PDF (already on file, different
state, different path), which fails identically. This is a different failure mode from this
project's existing WAF/bot-gate precedent (CATIC CT, AZ DIFI, Lighthouse Title, oahure.com) — a
broken certificate chain rather than a challenge page — so it's ambiguous whether the underlying
documents are still being served at all. **Not** marked `{stale: true}` in either FL.json or
MO.json this session (FL's primary source, `flrules.elaws.us`, is unaffected and still the
controlling evidence; MO has 4 other independent sources on file besides this one), but flagged
here for a future session to retry and, if the TLS break persists or the domain goes fully dark,
promote to a `{stale: true}` flag on the affected `documentpub.fnti.com` citations specifically.

### Blocked-source retries (one quick check each): no status change
AZ DIFI (`difi.az.gov/title-insurance-rate-filings`) still HTTP 403; CATIC CT
(`catic.com/state-resources/connecticut`) HTTP 200 this run (still fluctuating 200/403 across
sessions, underlying FlippingBook-viewer content-extraction blocker unchanged either way); Jackson &
Scott AL (`realestatelclosings.com/closing-costs-calculator/`) HTTP 403, consistent with recent
sessions' WAF-block finding. No status change on any of the three.

**Recommendation for next session**: (1) unchanged — a browser-driven session to finally crack
TitleCapture and/or Qualia Connect remains the single highest-value remaining lead; (2) a
browser-driven or devtools-network-capture pass on First American's AgentNet/PrismPowered platform
(`marketing.agentnetsolutions.com`) is now a concrete, well-scoped 2nd target — the same-origin API
host and exact route names are confirmed (`/api/Quote/calculate/customfees`), only the POST body
shape is missing, the same class of problem the 2026-08-08 WFG session solved without a browser;
solving it could unlock both TN and UT tenants (and possibly more, unsurveyed) at once; (3) retry
`documentpub.fnti.com` next session — if the TLS certificate break persists across 2+ sessions,
promote FL's/MO's citations of it to `{stale: true}`; (4) SC/LA/MS remain the least-explored
below-4-provider states for a genuine 4th provider — worth applying the same platform-keyword +
county-name search angle that surfaced this session's two (dead-end) UT leads.

### Same session, continued — South Carolina (SC) also retried with the same search technique, 0 new providers, platform-search well now confirmed dry
Applied the same platform-keyword + county-name search angle to SC (the next-priority
below-4-provider state by population). All results were appids already ruled out in prior sessions,
plus two not previously individually confirmed: **appid=351** ("1845 Title") and **appid=47**
("Community First Title Agency") — verified via each's own `getAppData` config
(`address1`/`city`/`state`/`approved_states`) to be **Austin, TX** and **Sandusky, MI**
respectively, neither South Carolina. Every NetSheetCalc/TitleTap appid surfaced by search for SC
across this and all prior sessions (444, 438, 467, 495, 1056, 351, 507, 399, 47, plus the ~7 more
logged 2026-08-08) has now been individually verified and resolved to FL, MO, TX, MI, or an
unconfigured placeholder — none genuine SC. The generic-search well for this platform is confirmed
fully dry for SC; a 4th SC provider will require either a genuinely new platform (not
NetSheetCalc/TitleTap) or a browser-driven TitleCapture/Qualia Connect breakthrough, not further
appid searching on this one.

## 2026-08-14 session — resuming the calculator harvest against the 11 lower-population "complete (scarce)" states never yet worked (AK/DC/ME/ND/NH/RI/SD/VT/WV/WY/DE); WV and NH tackled first (highest population); Stewart's `/api/SRC/quote` endpoint fully solved (see the dedicated entry above, under "Stewart Title"); NH crosses the 3-provider threshold, WV still short

The calculator-harvest tracker's original 27-state working set (see the 2026-08-09 session note)
never actually covered every "complete (scarce)" state from the published-schedule survey — 11
lower-population states (AK, DC, ME, ND, NH, RI, SD, VT, WV, WY, DE) were left untouched. This
session began working through that remaining list, highest-population first: **WV** (~1.77M) and
**NH** (~1.4M).

### New Hampshire (NH) — crosses threshold, 3 providers, first pass
1. **Stewart Title Guaranty Company** (stewartratecalculator.com) — the newly-solved `/api/SRC/
   quote` recipe (see above), Hillsborough County/Manchester. Genuinely itemized: Title Closing Fee
   $725.00 buyer-side (Great East Title and Closing, Bedford NH) + Deed Prep $150/Discharge
   Management $50/Overnight $35/Wire $35/Recording Service $25 (seller/buyer split as shown), plus
   Owner's $1,320.00/Lender's $100.00 (simultaneous) RateManual premiums. A 2nd settlement office in
   the same county (Stewart Title-Northern New England Division, Portsmouth NH) returned a
   different, less-itemized fee ($695 Title Closing Fee only) — confirms this endpoint's
   settlement-fee itemization is per-settlement-office, not just per-state.
2. **Old Republic's 2nd tool** (`ortratecalculator.oldrepublictitle.com`, `Location=NH`) — **new
   technical finding: the tool's NoBot anti-bot check is Referer-gated**, not purely state-gated as
   this catalog's prior fluctuating-block sessions assumed. Hitting it via the public landing page
   `oldrepublictitle.com/rate-calculator/?location=<state-slug>` (e.g. `?location=new-hampshire`)
   and preserving that exact `Referer` header across the entire session (every GET and POST, not
   just the first request) resolved the block reliably across two independent fresh sessions this
   run — a bare direct hit to the embed URL without it intermittently returned "Your agent number
   has been cancelled." **Recommendation**: retry this fix against every state previously logged as
   NoBot-blocked on this tool, especially `Location=IN` (durably blocked since 2026-07-29/
   2026-08-10 using the old bare-URL technique) — the fix may resolve it. Premium-only output for
   NH: Owner's $1,200.00/Lender's $100.00 simultaneous, $800.00 lender standalone.
3. **Absolute Title, LLC** ("New England's Premier Title Company") — own first-party calculator,
   `absolutetitle.com/ratecalculator.asp`, all math client-side in a same-origin `rc_ct.js` file
   with hardcoded rate-table constants — same "grep first-party JS for hardcoded fee constants"
   technique already established for Modern Title Group (MI)/Columbus Title Agency (OH)/Land Title
   Company of Alabama (AL). Settlement Fee $595.00 flat, a rare genuine non-premium NH figure (both
   published-schedule sources on file for NH explicitly exclude settlement/closing fees).

NH's other findings this session (gated/jsOnly, logged so future sessions don't repeat the search):
- **First American AgentNet/PrismPowered** (`marketing.agentnetsolutions.com`) — tested 2 NH
  agency slugs (Accurate Title NH id 455, Red Door Title id 304) against the real
  `POST /api/Bundle/*` API (not personal-info-gated at the API layer, confirming the 2026-08-13 UT
  session's route-mapping) — both return an empty county/office list for every `calculatorType`
  (BuyerEstimate/SellerNetSheet/SellerToNet/MultipleOffers/Refinance), meaning these two specific
  agencies never configured office/coverage data on the platform; the flow dead-ends to a contact
  form regardless. Also newly found: `POST /api/Agent/prismRouteName/{slug}` returns agent
  metadata for any known slug, and `POST /api/AppSettings` reveals the backing
  `calculatorApiUrl` is an internal-only `*.corp.firstam.com` host that doesn't resolve publicly —
  the working consumer-facing path is the same-origin `marketing.agentnetsolutions.com/api/Bundle/*`
  confirmed above. Worth trying a larger/more established NH agency's slug in a future session.
- `agency.facc.firstam.com` — true login/SSO gate, not attempted further.
- Capital Title & Escrow LLC (NH) TitleTap/NetSheetCalc tenant — confirmed **disabled** by the
  platform itself (`app.titlepremiumcalculator.com/company/errors/disabled.php?appid=232`).
- **CATICulator** (`caticulator.com`) — one retry per this catalog's standing protocol:
  `POST /PremiumCalculator/Calculate` returned an HTTP 302 this run (not the previously-reported
  500) redirecting away from the quote; no session-establishment path found quickly (Knockout.js
  SPA, no plain-text form fallback). Still blocked, logged, not pursued further.
- Lighthouse Title/Lighthouse Closings (`lighthouseclosings.com/calculator`) and Cohen Closing and
  Title (`cohenclosing.com/quotecalculator`) — both **jsOnly**, Wix-rendered with no vendor/API URL
  in static HTML.
- MyTitleRates.com, TitleClose.com, TRACcalculator/comparetitlecompanies.com — no NH agency
  instance found via search for any of the three.
- **Compass Title & Closings, Inc.** (`compasstitlenh.com/rate-calculator.html`) — promising lead
  (explicitly advertises an "online rate calculator") but the domain returned HTTP 429 during
  investigation — worth retrying with pacing/backoff in a future session.
- Untested candidates for the Absolute-Title-style "grep for a same-origin `.js` file referenced by
  an onclick handler" technique, flagged for a follow-up: Barristers Title (`nhbarristers.com`),
  Summit Title (`stscorp.com`), Liberty Title (`libtitle.com`).

### West Virginia (WV) — 2 confirmed providers (Stewart, Old Republic), closed out below the 3-provider threshold for this session
1. **Stewart Title Guaranty Company** (stewartratecalculator.com) — same newly-solved `/api/SRC/
   quote` recipe, Kanawha County/Charleston, provider "Omnia Title Corp." (ID 3030, the only
   settlement office this tool lists for the county). Title Closing Fee $750.00 total ($550.00
   buyer/$200.00 seller split), plus Owner's $1,920.00/Lender's $200.00 (simultaneous-flow)
   RateManual premiums, Mortgage/Deed/Release recording fees ($53/$53/$12), and Kanawha County
   Deed/Transfer Tax $2,750.00 (100% seller-paid per the tool's own split).
2. **Old Republic Title Insurance Company's 2nd tool** (`Location=WV`, internal numeric code 47) —
   **root cause of the previously-fluctuating block identified this session: it is backend session
   affinity, not (only) a NoBot/Referer check.** This tool's ASP.NET session lives on one specific
   web-farm node, addressed only via the URL's `(S(...)F(...))` segment (not a cookie) — a fresh
   `curl`-per-request approach (or any client that opens a new TCP connection per call) risks the
   load balancer routing a later request to a *different* node than the one that minted the
   session, which reads indistinguishably from "unauthorized." Routing the full GET → login-redirect
   → POST → POST sequence through one persistent HTTP session/connection (reusing the exact
   `(S(...)F(...))` path from the login redirect, plus a consistent Referer) resolved it reliably
   across two independent fresh sessions, no blocking at all. **A second real gotcha**: the POST
   must include every AJAX-extender `*_ClientState` hidden field
   (`PdateReqE_ClientState`/`DFormatValEx_ClientState`/`DateRangValEx_ClientState`/
   `PCatValEx_ClientState`/`txtPriorPremiumTypesExist`) as empty strings — omitting them causes an
   HTTP 500 "Rate Calculator Error" page, a distinct failure mode from the session-affinity block.
   **Recommendation**: apply the "one persistent session, reuse the exact post-login-redirect URL"
   fix (not just the Referer header) to every other state previously logged as blocked on this
   tool, especially `Location=IN` (durably blocked since 2026-07-29/2026-08-10 using the old
   bare-URL-per-request technique — very plausibly the same root cause, not a real IN-specific
   block). WV result: statewide flat rate, no county field in this tool's form — Owner's Policy
   premium $1,700.00, Loan Policy premium $100.00 simultaneous ($980.00 stand-alone), Grand Total
   $1,800.00 combined. Premium-only, no settlement-fee itemization (same structural limitation as
   this tool's other state entries).

A focused follow-up pass for a 3rd WV provider (county-name-targeted NetSheetCalc/TitleTap search,
Old Republic's *other*/first tool, and Eastern-Panhandle/Berkeley-County independent search) came
back empty — see below — so WV is being closed out at 2 of 3 for this session rather than pursued
further.

WV's dead ends this session (logged so future sessions don't repeat the search):
- **anytimeestimate.com** ("West Virginia Title Insurance & Transfer Tax Calculator") — found and
  initially investigated, but ruled **out of scope** and excluded from the harvest: it's a
  third-party informational site (not a title company/agency/underwriter's own system) computing
  off a hardcoded client-side rate table, the same category as the already-excluded `alphaadv.net`
  entry earlier in this catalog. Logging it here explicitly so a future session doesn't re-harvest
  it under the mistaken impression it qualifies.
- **Madison Title Agency** (madisontitle.com) — genuinely promising: a real title agency with its
  own no-login, no-antiforgery-token JSON endpoint (`POST /resources/title-calc`, fed by
  `GET /resources/title-init?state=<ST>`), confirmed fully working for NY (a complete 12-line
  itemized breakdown). But **WV is confirmed unsupported, not blocked**: `title-init`'s own
  `states` field only ever returns `[NY, NJ]` regardless of the `state=` param requested, and any
  WV quote attempt 500s — Madison's backend genuinely has no WV rate tables wired up despite its
  marketing page listing WV among licensed states generally. Log as "checked, confirmed
  unsupported," not gated/jsOnly — don't re-attempt without evidence their backend has changed.
- Old Republic's **other/first** tool (`ortconline.com/Web2/.../ratefeecalc/default.aspx`) — checked
  its `PropertyStateList` dropdown directly: **AZ, CA, HI, IN, MO, NM, NV, OH, OK, OR, TX, UT, WA**
  — no WV. (Minor incidental finding: this list has grown to include `IN` since the last time it was
  fully enumerated in this catalog — worth a periodic re-check of other states not currently listed,
  though not urgent since IN is already calculator-quoted via other providers.)
- NetSheetCalc/TitleTap searched with WV's actual populous county/city names (Kanawha/Charleston,
  Berkeley/Martinsburg, Cabell/Huntington, Monongalia/Morgantown, Wood/Parkersburg) as well as the
  generic state name — no WV-serving tenant found either way; every result resolved to other states'
  known tenants (Title Partners Agency, Members Title Agency, Abstract Title Agency, Pinnacle Title
  Agency, Venture Title Agency, Home Partners Title Services).
- Berkeley County/Martinsburg (Eastern Panhandle, WV's fastest-growing DC-commuter area) independent
  search — no agency calculator found; results were entirely consumer-facing estimate-guide content
  and directory listings, not provider tools.
- **Structural finding**: West Virginia is a mandatory-attorney-closing state (a licensed WV real
  estate attorney conducts the exam/closing) — plausibly explains why independent WV title-company
  calculators are so scarce relative to other states surveyed: the natural customer base for these
  SaaS calculator platforms (agencies running their own closings) is structurally smaller in WV,
  with attorneys and the underwriters' own tools (Stewart, Old Republic) filling the gap instead.
  **Next-session angle**: search for WV *real estate attorney* closing-cost tools/calculators rather
  than more title-agency names, per this finding.
- TitleCapture tenants RGS Title (`rgstitle.titlecapture.com`) and Investors Title
  (`invtitle.titlecapture.com`) — both **jsOnly**, same platform-level limitation logged elsewhere
  in this catalog (Angular SPA, API hosts identified but no static endpoint path).
- WV Bankers Title (`titlesinsured.com/calculator/`) — embeds a `titlehoundonline.com/login.aspx`
  iframe with a pre-published, non-personal business login (`WVBTwebsite`/`4quotes`) visible in the
  page's own HTML; a raw ASP.NET postback replay of that exact login returned "Invalid user name/
  password" — the real login apparently depends on the page's own JS auto-fill/submit flow, not a
  literal field-value replay. Logged as jsOnly/gated rather than working.
- Title Resources Guaranty (`ratecalculator.trguw.com`) — Next.js/React app, no `/api/*` or
  GraphQL endpoint surfaced in static JS bundles this session; WV coverage unconfirmed.
- First American `ratecalculator.firstam.com` / `prism-calculator-api-prod...corp.firstam.com` —
  both return 502/policy-denial at the network level, consistent with the NH session's finding that
  the real First American backend is an internal-only `*.corp.firstam.com` host not publicly
  reachable directly (only the `marketing.agentnetsolutions.com` consumer-facing proxy is public).
- MyTitleRates.com — swept `a=1` through `a=220`; none list West Virginia in their state dropdown.
- TitleClose.com, TRACcalculator/comparetitlecompanies.com — no WV-serving tenant/agency found via
  search for either.
- Westcor/eWestcor (`ewestcor.com/ratecalculator2.aspx`) — classic ASP.NET postback calculator, but
  its state dropdown only offers `FL` — confirmed not to cover WV.
- `closingcostcalc.com` (First Title Services) — unreachable (TLS certificate error/503).
- No calculator found at all (static marketing sites only) on: wvtitleco.com, BesTitle, Go Title
  PLLC (Charleston/Huntington/Hurricane WV — uses TitleTap only for website hosting, not a quote
  widget), Eastern Title, RGS Title's own homepage (as opposed to its gated TitleCapture instance
  above), Allied Title & Escrow (no WV in its state list), First Title & Escrow, Bailey & Slotnick,
  Ratified Title Group (all VA/MD/DC-only, not WV), Prosperus Title (site unreachable — connection
  reset/503 on every attempt).

**Next-session priority for WV**: needs 1 more calculator-basis provider to cross threshold. No
WV-specific state/land-title-association member directory exists to systematically enumerate more
independent-agency candidates. Best next angles, in order: (a) retry Old Republic's other tool's
footprint (it grew to include IN since last checked — worth periodically re-checking for WV too);
(b) search for WV real estate *attorney* closing-cost calculators per the structural finding above,
rather than more title-agency names; (c) apply the Stewart recipe's multi-provider-per-county trick
to any other WV county with more than one settlement office listed, as a richness add even if it
doesn't add a new distinct company.

### Freshness spot-check (5 oldest-retrieved published sources never previously included in any
prior freshness rotation — GA/Stewart Georgia rate manual PDF via virtualunderwriter.com, NC/Chicago
Title NC rates PDF via northcarolina.ctic.com, CA/Corinthian Title residential rate schedule PDF,
WA/Old Republic Washington escrow-and-service-fees PDF, IL/Old Republic Illinois rate card PDF): 4 of
5 returned a clean HTTP 200 and readable PDF content. The GA/virtualunderwriter.com PDF returned HTTP
403 — consistent with this project's existing recurring WAF/bot-gate precedent on that specific host
(CATIC CT, AZ Pioneer Title Agency), not a dead-link signal. Not marked `{stale: true}`.

### Blocked-source retries (one quick check each): no status change
AZ DIFI (`difi.az.gov/title-insurance-rate-filings`) still HTTP 403; CATIC CT
(`catic.com/state-resources/connecticut`) HTTP 403 this run (still fluctuating across sessions);
Jackson & Scott AL (`realestatelclosings.com/closing-costs-calculator/`) still HTTP 403, consistent
with the recurring WAF-block finding. No status change on any of the three.

**Recommendation for next session**: (1) finish WV (needs 2 more providers, see above); (2) apply
the newly-solved Stewart `/api/SRC/quote` recipe to every remaining below-threshold or premium-only
scarce state before anything else — it is now the fastest, most reliable calculator-harvest source
available (a genuine stateless JSON API, no anti-bot friction observed so far, and likely covers
most/all states where Stewart underwrites); (3) apply the Referer-header fix to Old Republic's 2nd
tool against `Location=IN` and any other previously NoBot-blocked state/location code; (4) continue
down the remaining untouched "complete (scarce)" list by population after WV: ME (~1.4M), RI
(~1.1M), DE (~1.05M), SD (~925k), ND (~797k), AK (~733k), DC (~702k), VT (~647k), WY (~588k).

## 2026-08-15 session — ME and RI harvested via the Stewart recipe (both below threshold); Absolute Title's calculator footprint fully mapped; Old Republic 2nd-tool Referer-fix confirmed unreliable

Continued down the untouched-scarce-by-population list from the 2026-08-14 session's recommendation:
ME (~1.4M) and RI (~1.1M), the next two states after WV. Both harvested cleanly via the Stewart
`/api/SRC/quote` recipe with zero modification needed — the recipe continues to work exactly as
documented against a 4th and 5th new state (after WV/NH), reinforcing it as the highest-leverage,
lowest-friction technique in this catalog.

### Absolute Title, LLC — calculator footprint fully mapped: NH/ME/MA only, with a new false-positive gotcha
Following the NH/ME pattern (own first-party JS calculator, hardcoded constants in a same-origin
`rc_<st>.js` file), this session found Absolute Title also maintains a genuine Maine calculator at
`ratecalculator_me.asp`/`rc_me.js` — harvested (see ME.json). Probing every other New England state
suffix (`ratecalculator_ri.asp`, `_ct.asp`, `_de.asp`, `_vt.asp`) all returned **HTTP 200**, which
looked promising at first, but each resolves to the site's generic contact-page fallback (same
generic `<title>Absolute Title, LLC - New England's Premier Title Company</title>`, no `rc_<st>.js`
script tag, no `txtSalePrice` form field) rather than a real calculator — the company's own nav menu
confirms it only lists Rate Calculator links for NH/MA/ME. **New gotcha for future sessions on any
platform with per-state URL suffixes**: an HTTP 200 alone does not confirm a real per-state page on
a server with catch-all routing — verify a state-specific asset reference (script tag, distinct
`<title>`) or actual form-field content in the body before treating a 200 as a hit.

### Old Republic's 2nd tool — the Referer-header fix is NOT universally reliable (2 more failures)
The 2026-08-14 NH session found that sending `Referer: oldrepublictitle.com/rate-calculator/
?location=<state-slug>` consistently across the session resolved this tool's NoBot block. This
session retried the identical fix (same code, same header-persistence approach — `Referer` set on
the `requests.Session()` object, not per-request) against `Location=ME` and `Location=RI` and got
the same "You are not authorized to access the site. Code: 2." NoBot rejection both times, on the
very first GET. This confirms the WV session's separate finding (backend session affinity, not just
a Referer check) is the more fundamental fix needed — the Referer-only fix that worked for NH was
likely coincidental (e.g. that specific session happened to land on a healthy web-farm node) rather
than a real solution. **Recommendation**: any future session targeting this tool should implement
the full WV recipe (persistent single HTTP connection, reuse the exact post-redirect `(S(...))` URL
segment throughout, plus the AJAX-extender `*_ClientState` empty-string fields) rather than the
lighter Referer-only fix, which should now be considered unreliable/deprecated.

### Dead ends checked this session (logged so they aren't re-tried)
- **Gateway Title of Maine** (`gatewaytitleme.com/rate-calculator/`) — the page is a Gravity Forms
  contact form gated by Google reCAPTCHA, not a calculator; jsOnly/gated.
- **Cumberland Title Services + Central Maine Title** (`cumberlandtitle.com/fee-calculator`) — routes
  directly to First American's FACC tool (`facc.firstam.com`), the already-catalogued true login/SSO
  gate; two outbound links confirmed (`facc.firstam.com/?SSID=...`).
- **Priority Title Company** (`prioritytitlecompany.com/purchase-cash`, RI) — a Wix-rendered SPA
  (`static.parastorage.com` bundle references) with no discoverable static form/API in the page
  source; jsOnly, flagged for a browser-driven session.
- **"Island Title & Escrow Agency"** (NetSheetCalc/TitleTap `appid=396`) — surfaced by a web search
  for RI-flavored TitleTap instances, but its own `APP_INFO` JSON (`GET .../quickquote.php?appid=396`)
  confirms it's Merritt Island, **Florida**-based (`"state":"FL"`, `"approved_states":[{"label":
  "Florida","value":"FL"}]`) — a false-positive search result, not an RI provider. Logged so a future
  session doesn't re-surface and re-check the same lead.
- Old Republic's other/first tool (`ortconline.com/Web2/.../ratefeecalc/default.aspx`) — confirmed
  (per its already-documented fixed footprint: AZ/CA/HI/MO/NM/NV/OH/OK/OR/TX/UT/WA) it does not reach
  New England at all; not applicable to ME/RI, not tested this session (no need).

### WV's 3rd-provider search — not retried this session
Time budget went to ME/RI (the next states by population per the standing priority order) rather than
finishing WV's search for a 3rd provider. WV remains at 2 of 3 confirmed providers — see the
2026-08-14 entry above for the mandatory-attorney-closing-state finding and the recommended next
angle (WV real estate attorney closing-cost tools).

**Recommendation for next session**: (1) DE is next by population (~1.05M) on the untouched-scarce
list, followed by SD/ND/AK/DC/VT/WY — keep applying the Stewart recipe first against each, since it
has now succeeded cleanly on 5 consecutive new states (WV, NH, ME, RI implied via Stewart's own
underwriting footprint) with zero modification; (2) WV still needs a 3rd provider; (3) do not spend
further time on the Old Republic 2nd-tool Referer-only fix for newly-blocked states — implement the
full session-affinity recipe from the WV entry instead, or skip the tool entirely for a state if time
is short, since two states in a row (ME, RI) failed the lighter fix; (4) a browser-driven session
remains the highest-value unlock for TitleCapture/Qualia Connect (recurring across many independent
agencies nationwide) and would likely be the fastest path to a 3rd provider for both ME and RI.

### DE added same session — Stewart recipe's 3rd clean harvest in a row, null settlement fee is a genuine (not missing) result
Applied the Stewart recipe to DE (New Castle County/Wilmington) after ME/RI, again with zero
modification. The matched settlement office (Stewart's own Wilmington office, provider ID 2531)
returns `"ItemizedTitleServiceFeeList": null` — a real, correctly-parsed empty result, not a fetch
failure. This is consistent with, and further corroborates, DE.md's pre-existing structural finding
(DTIRB's Rating Manual Sections 1.5/2.1 explicitly exclude attorney/settlement/closing charges from
the regulated rate, and Delaware requires a licensed attorney to conduct every closing) — Stewart's
own Wilmington office apparently has nothing configured to itemize through this tool because the
attorney handles that step outside Stewart's own pricing. **Lesson for future sessions**: a null
`ItemizedTitleServiceFeeList` from this recipe is not necessarily a bug or a sign to retry a
different provider in the same county — check whether the state's own market structure (attorney-
closing, rating-bureau exclusion) already predicts a null result before assuming something went
wrong. The premium and recording/transfer-tax sections (`Pricing.RateManual`, `Recording`) still
returned complete, genuine data regardless — DE's combined Realty Transfer Tax came out to
**$20,000.00 on a $500,000 sale (4.0%)**, the highest transfer-tax figure found anywhere in this
survey. Old Republic's 2nd tool NoBot-blocked for `Location=DE` too — the 3rd state in a row this
session (after ME, RI) where the Referer-only fix failed, further reinforcing the recommendation
above to switch to the full session-affinity recipe or skip the tool when time is short. A web search
for a genuine DE-provider-owned calculator (attorney or title-agency) came up empty — only third-
party aggregator estimate tools found (AnytimeEstimate, ListWithClever, StateCalc), all out of scope
per the standing `alphaadv.net` exclusion precedent.

**Session total: 3 new states touched (ME, RI, DE), all below the 3-provider threshold, all via the
Stewart recipe with zero modification across 3 different state/county combinations — the strongest
evidence yet that this recipe is genuinely state-agnostic.** Next session should continue down the
population-ordered list (SD ~925k, ND ~797k, AK ~733k, DC ~702k, VT ~647k, WY ~588k) with Stewart
first, and separately revisit WV's 3rd-provider gap and a browser-driven pass at TitleCapture/Qualia
Connect to push ME/RI/DE past threshold.

### SD added same session — 6th consecutive clean Stewart harvest; South Dakota applies sales tax to title-service fees (new finding)
Applied the Stewart recipe to SD (Minnehaha County/Sioux Falls) after ME/RI/DE, again with zero
modification — 6 consecutive states (WV, NH, ME, RI, DE, SD across 2 sessions) with an unchanged
recipe. Stewart Title Company's Sioux Falls office returned the richest itemization of this session's
batch: Title Closing Fee $400.00, Title Examination Fee $300.00, Title Certif I D $15.00, plus
Owner's $1,325.00/Lender's $837.50 premiums and a $500.00 deed/transfer tax. **New finding**: two of
the three itemized fees carry an explicit `SalesTax` line in the response (`$24.80` on the $400.00
Closing Fee, `$18.60` on the $300.00 Examination Fee — both exactly 6.2%, South Dakota's state sales
tax rate) — the first state in this recipe's usage where the tool itself computes and returns sales
tax on a title-service fee, rather than just on the deed/transfer-tax line as seen elsewhere. Future
sessions harvesting via this recipe should check every `ItemizedTitleServiceFee` entry's `SalesTax`/
`SalesTaxBuyerAmount`/`SalesTaxSellerAmount` fields (present in the schema for every state, usually
`"0"`) rather than assuming they're always zero.

Black Hills Title, Inc. (`blackhillstitle.com/calculator/`) — an existing SD published-schedule
provider — advertises a rate calculator but the static HTML has no discoverable iframe/form-action/
API endpoint; likely a JS widget (Elementor-built site) that couldn't be mapped without a browser.
Flagged for a future browser-driven session. Its "South Dakota Rates" nav link also surfaced a
freshly-dated `SD-RATE-CHART-effective-2026.pdf` (uploaded August 2026) — a lead for a future
published-schedule freshness pass, out of scope for tonight's calculator-only mission. Old Republic's
2nd tool NoBot-blocked for `Location=SD` too — the 4th state in a row this session (ME, RI, DE, SD)
where the Referer-only fix failed; the full session-affinity recipe (or skipping the tool) is now the
clear standing recommendation rather than a one-off caveat.

**Session grand total (2026-08-15): 4 states harvested (ME, RI, DE, SD), all below the 3-provider
threshold but each with a genuinely new, richly-itemized Stewart data point; 3 commits pushed to
`research/market-fees`.** Next session: continue the population-ordered untouched-scarce list (ND
~797k, AK ~733k, DC ~702k, VT ~647k, WY ~588k) with Stewart first; revisit WV's 3rd-provider gap; a
browser-driven session remains the highest-leverage unresolved lead (TitleCapture/Qualia Connect
nationwide, plus Black Hills Title's SD calculator specifically) for pushing any of ME/RI/DE/SD past
threshold without waiting on more one-off provider discoveries.

## 2026-08-18 session — last 5 untouched-scarce states harvested via Stewart; WFG's Seller Net Sheet API confirmed to generalize to nearly every small/low-population state, retroactively crossing WV and ME to threshold

Continued the population-ordered "complete (scarce), never yet worked" list from the 2026-08-15
recommendation: applied the unchanged Stewart `/api/SRC/quote` recipe (both QuoteType=2 and
QuoteType=3 flows, exactly as documented in the 2026-08-14 entry above) to the final 5 states —
**ND (Cass/Fargo), DC (District of Columbia/Washington), VT (Chittenden/Burlington), WY
(Laramie/Cheyenne), AK (Anchorage)**. All 5 succeeded cleanly with no recipe changes — the 11th
through 14th consecutive clean Stewart harvest across 3 sessions (after WV, NH, ME, RI, DE, SD).

A local Python harvester script (`requests.Session()`-based, not committed to the repo — scratch
tooling, same convention as the 2026-08-06 FNF script and the 2026-08-08 WFG script) implements the
full 10-step recipe end to end: `propertysearch` → `statesettings` → `providers` → `ernstlookup` →
build `QuoteRequestRoot` → two `POST /api/SRC/quote` calls. One implementation detail worth flagging
for whoever reuses this: the `/api/SRC/providers` response is **not always a JSON array** — for a
single-provider county it returns `{"ProviderList": {"Provider": {...}}}` with `Provider` as a bare
object, not a one-element list; a naive `isinstance(providers, list)` check silently no-ops and
leaves `ProviderID` empty, which in turn makes `ItemizedTitleServiceFeeList` come back `null` (looks
exactly like a genuine null result, e.g. DE's, but is actually a client bug) — always normalize
`Provider` to a list before indexing it.

**Results**:
- **ND** (Cass/Fargo): Dickey and LaMoure County Abstract and Title Company (Ellendale, ND) — 7-line
  itemization (Certification $25/Closing $350/Courier $22.95/Examination $200/Plat Draw $175/Search
  $50/Wire $15, all buyer-side), Owner's/Lender's standalone premiums $1,400/$1,050. No transfer tax
  (ND has none).
- **DC**: Stewart Title and Escrow, Inc. (Washington, DC) — the richest single-office itemization of
  this session, 10 line items (Abstract $300/Closing $700 split/Commitment $269/Courier $35/Deed
  Prep $195/Doc Prep $650 split/Examination $450/Release Procurement $200/Remote Notary $300
  split/Simplefile-Recording-Zoccam $128/Tax Certificate $30.76), Owner's/Lender's premiums
  $2,700/$1,710. Combined Deed Tax + Deed Recordation Tax $14,500.00 (2.9% of $500,000) — 2nd-highest
  combined transfer-tax figure in this survey after DE's 4.0%.
- **VT** (Chittenden/Burlington): Omnia Title Corp. (Tampa, FL — the *only* settlement office
  Stewart's own providers lookup returns for this county, an out-of-state remote provider). Title
  Closing Fee $750.00 (split $550/$200), Owner's/Lender's premiums $1,723/$1,050. VT Property
  Transfer Tax $5,410.00 (1.082%, 100% buyer-paid).
- **WY** (Laramie/Cheyenne): Executive Title Services LLC (Jackson, WY — also not local to the
  target county, a statewide-serving office). Title Closing Fee $400 (split $200/$200), Mobile
  Notary $300 (split), Remote Notary $90 (split), Wire $25 (seller); Owner's/Lender's premiums
  $1,694/$712. No transfer tax (WY has none).
- **AK** (Anchorage): Stewart Title Company — Stewart Title of Alaska (a genuine in-state office,
  unlike VT/WY above). Title Closing Fee **$1,381.00** (split $690.50/$690.50) — the single largest
  settlement-fee line item recorded anywhere in this entire survey to date — plus Courier $20/Doc
  Prep $50 split/Wire $25; Owner's/Lender's premiums $1,990/$1,336. No transfer tax (AK has none).

### WFG's Seller Net Sheet API generalizes far beyond the original 8-state target list — a fast, free 2nd/3rd provider for nearly every remaining below-threshold scarce state

Rather than cold-searching for each new state's 2nd provider, queried WFG's already-solved
`GET /api/rates/State/GetCalculationEnabledStates` (no auth, documented in the 2026-08-08 entry
above) for all 5 new states plus every state still below threshold from the 4 prior sessions (WV,
ME, RI, DE, SD) — **9 of these 10 states came back `isCalculationEnabled: true`** (only AK is
absent from WFG's enabled-states list entirely — confirmed by direct lookup, not a fetch failure).
Ran the same `POST /api/rates/fees/estimatefeesforsellernet` request (nested `Properties`/`Loans`
body, `SettlementStatementVersion: "CD"`) against all 9 and got a clean premium-only Owner's Policy
figure back from every one, no personal-data fields required:

| State | County | Owner's Premium | Effect |
|---|---|---|---|
| WV | Kanawha (Charleston) | $2,280.00 | **crosses to 3** (Stewart + Old Republic 2nd tool + WFG) |
| ME | Cumberland (Portland) | $1,750.00 | **crosses to 3** (Stewart + Absolute Title + WFG) |
| ND | Cass (Fargo) | $1,238.00 | 2 of 3 |
| DC | District of Columbia | $3,263.00 | 2 of 3 |
| VT | Chittenden (Burlington) | $1,878.80 | 2 of 3 |
| WY | Laramie (Cheyenne) | $1,733.00 | 2 of 3 |
| RI | Providence | $1,925.00 | 2 of 3 |
| DE | New Castle (Wilmington) | $2,424.00 | 2 of 3 |
| SD | Minnehaha (Sioux Falls) | $2,000.00 | 2 of 3 |

This is a generalizable lesson worth stating plainly for future sessions: **whenever Stewart's recipe
gives a state its 1st (or 2nd) provider, immediately check WFG's `GetCalculationEnabledStates` before
searching for anything else** — it costs one GET + one POST per state and has now supplied a
provider for 9/10 states tried across two different sessions (2026-08-08's original 8-state batch and
this session's 10-state retry), the highest hit rate of any technique in this entire catalog.

**Next session priority**: (1) ND, DC, VT, WY, RI, DE, SD each need exactly 1 more provider —
try NetSheetCalc/TitleTap, MyTitleRates.com, or Old Republic's 2nd tool (full session-affinity fix,
not the lighter Referer-only fix that has now failed 5 times in a row: ME, RI, DE, SD, and implicitly
every state tried this session) against each; (2) AK needs 2 more providers and has no WFG fallback
— try Alyeska Title Guaranty Agency (AK's own existing published-schedule provider) or another
Alaska-specific independent agency; (3) the standing freshness and blocked-source-retry passes are
now overdue after 3 consecutive sessions skipping them in favor of the calculator-harvest breadth
push.

## 2026-08-18 session, continued — FNF national rate calculator generalizes to small states too; 6 more states cross threshold; submit-button selector bug found and fixed

After the WFG pass above still left ND/DC/VT/WY/RI/DE/SD one provider short of threshold (and AK
with no WFG fallback at all), tried `ratecalculator.fnf.com` against all 8 — already confirmed
working and in-scope (premium-only) evidence since the 2026-07-25/2026-08-06 sessions, but never
actually applied to any of this session's 10-state working set before now.

### Bug found: a hidden dummy submit button silently derails naive button-selection logic

Rebuilding the WebForms postback flow as a fresh local script surfaced a bug that plausibly affected
some fraction of the original 2026-08-06 8-state batch too (though that batch's target states may
not have hit it): the rendered page always includes **two** `type="submit"` inputs at the "Next"
step — the real `ctl00$BodyContent$UcRateCalc1$btnGeneralNext` **and** a hidden
`ctl00$btnDummy` (`class="HiddenButton"`, used only so pressing Enter in a text field submits the
form via *some* button). A naive "grab the first submit-button name found in the page" selector
picks `btnDummy` first (it appears earlier in the markup) and clicks it instead of `btnGeneralNext`
— the server accepts the POST (200 OK) but the flow doesn't advance at all, returning an
identical-looking page. This reads exactly like "the click didn't register" rather than a clear
error, and is easy to miss if only checking HTTP status/response length coarsely. **Fix: always
filter submit-button candidates for the real button's own name substring (`Next`/`Finish`), never
just take the first `type="submit"` match on the page.** Flagged as a generalizable lesson for any
future WebForms replay in this project (same family of bug as the earlier `dict(hidden)` ambient
submit-button-carryover bug documented in the 2026-08-09 UT/SC entry above, but a distinct
mechanism — that one was about *carrying forward* a stale button value across requests, this one is
about *choosing the wrong button* on a single request).

### Second gotcha: Transaction Type is a `<select>` dropdown for some states, a radio group for others

The original recipe's radio-group `__EVENTTARGET` handling (`<fieldname>$<optionindex>`) does not
apply universally — for ND/VT/WY/DC/RI/DE/SD/AK, `TranType` renders as a plain `<select>` with a
`chosen`-jQuery-plugin skin, not radio buttons. Selecting `PropertyPurchase` and firing
`__EVENTTARGET=<the select's own name>` (no `$index` suffix) works exactly like any other dropdown
postback (the same mechanism already used for `ddlCounty`). A future replay script should try the
`<select>` path first and fall back to the radio-group path only if no matching `<select>` is found,
since (per this session's 8-state sample) the dropdown form appears to be more common.

### Results (6 of 8 succeeded cleanly on the first pass with the bug fixed)

| State | County | Owner's Premium | Loan Premium (concurrent) | Grand Total | Threshold effect |
|---|---|---|---|---|---|
| ND | Cass (Fargo) | $1,300.00 | $150.00 | $1,450.00 | **crosses to 3** |
| VT | Chittenden (Burlington) | $1,570.00 | $50.00 | $1,620.00 | **crosses to 3** |
| WY | Laramie (Cheyenne) | $1,597.00 | $671.00 | $2,268.00 | **crosses to 3** |
| RI | Providence | $1,750.00 | $50.00 | $1,800.00 | **crosses to 3** |
| DE | New Castle (Wilmington) | $2,275.00 | $0.00 | $2,300.00 | **crosses to 3** (Owner's Premium byte-identical to this state's own Stewart entry) |
| SD | Minnehaha (Sioux Falls) | $1,562.50 | $100.00 | $1,662.50 | **crosses to 3** |
| AK | Anchorage | $1,910.25 | $75.00 | $1,985.25 | 2 of 3 (no WFG coverage for AK, so still 1 short) |
| DC | — (no county field) | — | — | — | **failed, see below** |

### DC failure — flow completes without error but never reaches a results page

Unlike every other state tried (all of which have a `ddlCounty` dropdown), DC's page has no county
selector at all — the script skips straight to the Amounts step. The full sequence (TranType select,
Purchase/Loan amounts, Concurrent-rate radio, Finish) all appear to execute without any visible
validation error, but the final response is anomalously large (~194KB vs. ~70-73KB for every
successful state) and contains no `Grand Total`/`Premium` quote content at all — not a clean failure
mode, and not yet root-caused. Worth a focused follow-up: possibly DC needs an explicit
jurisdiction-equivalent-to-county selection this recipe doesn't know to look for, or the underwriter
dropdown (`ddlUnderwriters`) needs an explicit non-default selection for DC specifically. Flagged for
next session rather than pursued further this session (AK's 3rd-provider gap and the DC gap are now
the only 2 remaining below-threshold states from the original working set, so either is a reasonable
next target).

**Session grand total (2026-08-18): 10 states worked (ND/DC/VT/WY/AK harvested fresh via Stewart,
plus WV/ME/RI/DE/SD's existing entries extended), 8 states crossed or already-crossed the
3-provider calculator-quoted threshold this session (WV, ME, ND, VT, WY, RI, DE, SD), leaving only
AK (2 of 3) and DC (2 of 3) below threshold from the entire original "complete (scarce), never yet
worked" list.** Two commits pushed to `research/market-fees`; this WFG+FNF generalization work will
be pushed as a follow-up commit.

### DC follow-up (same session) — four-radio structure mapped, quote still not produced; two more reusable script fixes

Spent a focused pass on the DC failure above. DC's Amounts step turns out to reveal **four**
sequential radio questions where every other state tried asks one or two, all four present in the
DOM at once (unlike UT's genuinely sequential reveal documented in the 2026-08-09 entry):
`IsPolicyIssuedToInsure_1_To_4_FamilyResidence`, `Concurrent_IsEligible`, `CFPB_IsQualified`, and
`Reissue_IsEligible`. Two script fixes were required just to answer them all, both worth reusing in
any future FNF replay:

1. **Track answered question *names***, not just "is there an unanswered radio on the page." A loop
   that re-scans and takes the first match each iteration re-answers the same question forever and
   never reaches the others — the page keeps rendering all four regardless, so there's no natural
   termination signal.
2. **Match radios on the `$rc_` infix**, not on a question-keyword list. The original loop looked for
   `Eligible|Qualified|LenderBorrower` in the field name, which silently misses
   `IsPolicyIssuedToInsure_1_To_4_FamilyResidence` entirely — one unanswered required question is
   enough to block the whole flow, and the symptom (Finish returns a non-results page) is identical
   to every other failure mode here.

**`Reissue_IsEligible` must be answered No** for this project's standard scenario: answering Yes
reveals a required `Reissue_FaceAmount` (prior policy amount), which a fresh $500,000 resale has no
basis to supply — filling it would mean inventing a figure, which the evidence rules forbid. Answered
No, which is also the substantively correct answer for the standard scenario.

**Still unsolved**: with all four answered and `btnFinish` clicked cleanly, the response carries no
`Grand Total`/`Premium` content, no `pnlErrors` marker, and the only registered page validator is
TranType's own `rfv` — so this is not a surfaced validation failure. **Best remaining hypothesis for
next session**: `ddlUnderwriters` is the one field this recipe has never explicitly set (it's always
been left at the tool's own pre-selected default, which works everywhere else); DC's underwriter list
differs from other states' (only Chicago Title / Fidelity National Title / National Title of NY, no
Commonwealth) and may have no valid default for the chosen transaction shape. Try an explicit
underwriter selection with its own postback before investigating anything else.

### AK 3rd-provider search (same session) — no lead found

Checked, all negative: **Alyeska Title Guaranty Agency**'s own site (`alyeskatitle.com`, AK's
existing published-schedule provider) has no calculator/net-sheet/rate-quote page of any kind in its
static HTML. **NetSheetCalc's own Alaska landing page**
(`netsheetcalc.com/net-sheet-calculator-by-state/alaska-net-sheet-calculator/`) is pure platform
marketing with no tenant `app_id` referenced anywhere — it does not evidence any actual Alaska
tenant. The **Alaska Land Title Association member directory** (`alaskalandtitle.net/member-directory/`)
is JS-rendered (a "smartcat team" WordPress plugin); the only member domain resolvable from the
static HTML is **Western Alaska Land Title** (`westernaktitle.com`), which has no calculator either.
Generic web search for AK title-company calculators returns only third-party aggregator estimate
tools (AnytimeEstimate, ListWithClever, RealEstateWitch, HomeLight), all out of scope per the
standing `alphaadv.net` exclusion precedent. AK stays at 2 of 3 — a genuinely thin market, consistent
with its published-schedule survey finding of only 2 sources statewide.

## 2026-08-19 session — DC's FNF quirk further characterized (still unsolved, root cause now narrowed); AK 3rd-provider re-search, still dry

### DC's FNF flow — explicit `ddlUnderwriters` selection tried per the 2026-08-18 hypothesis, does NOT fix it; `btnFinish` confirmed server-rendered `disabled` even with every question answered correctly

Picked up the 2026-08-18 session's specific next-step recommendation: explicitly select
`ddlUnderwriters` (tried `cti` = Chicago Title) via its own dedicated `__EVENTTARGET` postback,
inserted right after the county selection and before `btnGeneralNext`. Rebuilt the whole flow fresh
as a scratch Python script (not committed) to retest end-to-end rather than assume the rest of the
recipe still holds. Confirmed along the way: **DC's `ddlCounty` control is not actually absent** (the
2026-08-18 "no county field" observation was imprecise) — it renders with exactly one option,
`district of columbia`, pre-selectable via the standard recipe, same mechanism as every other state's
county dropdown. The explicit underwriter postback itself succeeds cleanly (no error, dropdown value
sticks across subsequent postbacks) but **does not change the outcome** — confirming the
`ddlUnderwriters` hypothesis was not the cause.

Re-confirmed the four-radio structure exactly as the 2026-08-18 session mapped it, and found two of
the four (`IsPolicyIssuedToInsure_1_To_4_FamilyResidence`, `CFPB_IsQualified`) already default to the
substantively-correct "Yes" with no postback needed; `Concurrent_IsEligible` also defaults to "Yes"
(correct — a purchase with simultaneous Owner's & Loan policy issuance); only `Reissue_IsEligible`
needs an explicit "No" postback (unchanged from the prior session's reasoning — answering "Yes"
would require fabricating a `Reissue_FaceAmount`, forbidden by the evidence rules). With all four
confirmed answered (verified by re-reading the `checked` attribute in the response HTML after each
postback, not just assuming the POST took effect), the page still does not reach a results panel.

**New, more precise root-cause signal**: inspected the rendered `btnFinish`/`btnFinishAndPrint`/
`btnEndorsements` submit controls directly in the HTML response *before* attempting to click them,
and found all three already carry `disabled="disabled" class="aspNetDisabled"` **even after every
question is answered and validated with no visible error** — this is true both before and after
submitting the Finish click, i.e. clicking a control the server itself is rendering as disabled
predictably has no effect (ASP.NET WebForms checks server-side `Enabled` state for postback event
dispatch, not just the client-side `disabled` HTML attribute, so a raw POST asserting
`btnFinish=Finish` in the body does not fool it). This had not been explicitly checked in either
prior DC session — both treated the symptom as "Finish produces no error but no results either,"
without confirming the button itself was server-disabled the whole time. **This localizes the bug to
whatever server-side condition controls this button's `Enabled` property**, rather than a missing
required field (every field this recipe knows about is answered, and no additional required-question
panel — `pnlPolicyQuestions`/`pnlAmountsPolicyQuestions` — renders any content for DC at any point in
the flow, confirmed empty at every step). The most likely remaining explanation, given the disabled
state persists through a plain synchronous postback with no error, is that this control's enable
logic depends on a **client-side JS event** (an `onchange`/`onblur` handler wiring, or an UpdatePanel
async-postback completion callback) that only fires in a real browser and never fires when the form
is replayed via raw HTTP — i.e. this is likely a genuine JS-execution requirement specific to DC's
question layout (four simultaneous radios vs. the 0-2 seen in every other state this tool has been
applied to), not a missing-field bug crackable by finding one more POST parameter. **Recommendation:
retire this as a stateless-HTTP target and move it to the browser-driven-session queue** (alongside
TitleCapture/Qualia Connect) rather than spend further plain-POST-recipe effort on it — the next
concrete step that could actually resolve it is a devtools network capture of a real browser session
clicking through DC's own flow to see what request the enabled Finish button actually sends that this
recipe isn't replicating. DC remains at 2 of 3 (Stewart + WFG).

### AK 3rd-provider search — one more pass, still no lead

Followed up on the 2026-08-18 dead-end list with a few more targeted searches this session:
**Old Republic's own `oldrepublictitle.com/rate-calculator/alaska`** page (distinct from both
already-catalogued Old Republic tools, `ortconline.com/Web2` and `ortratecalculator.oldrepublictitle.com`)
returns a static, formless page stating "Old Republic National Title Insurance Company has filed
rates in Alaska and issues title products only through its appointed Agents" with only a phone
number/email for a Portland, OR underwriting contact — no calculator, confirming Old Republic has no
direct-write AK presence to calculate against. **First American's marketing calculator page**
(`firstam.com/title/resources/calculators/title-fee-calculator.html`) only links out to the
already-catalogued jsOnly `facc.firstam.com` tool, no new state-specific path found. **Trident Land
Transfer Company**'s MyTitleRates.com instance (surfaced again in a fresh search) is the same
already-confirmed NJ/PA/DE-only tenant, not AK. A NetSheetCalc/TitleTap directory search
(`netsheetcalc.com quickquote Alaska`/`Anchorage`) surfaced zero AK-attributed appids, consistent
with the 2026-08-18 finding. AK stays at 2 of 3 — no new lead found across two consecutive sessions
now; likely genuinely exhausted for stateless-HTTP-reachable calculators given Alaska's small title
market (independent agencies, no major SaaS-platform or big-four-brand coverage found). Not
recommended as a further priority target barring a genuinely new technique.

### Richness pass, same session — FNF national rate calculator applied to 3 already-crossed-threshold states missing it (NH, WV, ME)

With AK and DC both dead ends for this session, pivoted to the standing recommendation to check
already-crossed-threshold states for a still-missing already-solved-recipe provider before assuming
saturation. Cross-referenced the Calculator harvest tracker in PROGRESS.md against
`ratecalculator.fnf.com`'s per-state county-dropdown coverage and found **NH, WV, and ME** (each
already at exactly 3 providers via some combination of Stewart/Old Republic's 2nd tool/WFG/Absolute
Title) had never had the FNF recipe applied, despite it already being solved and reused across a
dozen-plus other states. Confirmed all 3 states are in the tool's county-dropdown coverage, then ran
the standard recipe (unchanged from the 2026-08-18 write-up: GET county-selection page, POST county,
POST `btnGeneralNext`, POST `TranType$ddl=PropertyPurchase`, POST `AmountPurchase$txt`/
`AmountLoan1$txt` each with their own `__EVENTTARGET`, POST `btnFinish`) against each state's
existing standard-scenario county (Hillsborough/Manchester for NH, Kanawha/Charleston for WV,
Cumberland/Portland for ME, matching each state's own Stewart entry). **All 3 succeeded cleanly on
the first pass, no new recipe issues** — confirms the recipe is now fully general-purpose across
this tool's entire footprint, not just the specific batch of states it was originally solved
against. Results: **NH** Owner's Policy Premium $1,275.00 (Disclosure $575 + Adjustment $700), Loan
Policy Premium $100.00, Survey Coverage/Endorsement Package $125.00, CPL $25.00, Grand Total
$1,525.00. **WV** Owner's Policy Premium $1,750.00 (Disclosure $890 + Adjustment $860), Loan Policy
Premium $150.00, Lender's Closing Protection Letter $50.00, Grand Total $1,950.00. **ME** Owner's
Policy Premium $1,500.00 (Disclosure $850 + Adjustment $650), Loan Policy Premium $50.00, no separate
CPL line, Grand Total $1,550.00 (exactly Owner's + Loan Policy premiums summed). All 3 states now at
4 of 4 calculator-basis providers. **Recommendation for future sessions**: before searching for an
entirely new calculator platform for any already-crossed-threshold state, first check whether it's
missing an entry from one of the tools already solved and generalized nationwide in this catalog
(Stewart's `/api/SRC/quote`, Old Republic's 2 tools, WFG's Seller Net Sheet API, FNF's
`ratecalculator.fnf.com`) — these are near-zero-marginal-cost richness adds compared to hunting for a
new agency/platform, and this session found 3 in one pass just by checking tracker coverage.

### Richness pass, continued same session — FNF applied to 10 more already-crossed-threshold states (8 succeed, 2 hit a DC-like block)

Systematized the recommendation above: checked `ratecalculator.fnf.com`'s county-dropdown coverage
for every remaining state at exactly 3 providers, none yet showing an FNF entry — **OH, MO, MI, PA,
NJ, MD, TN, IN, KY, AL** — all 10 confirmed in the tool's footprint (each returned a populated
`ddlCounty` list for its most-populous county). Ran the standard recipe against each using that
state's own most-populous county (or, where an existing calculator entry already used a specific
county for comparability, that same county: Jackson/MO, Philadelphia/PA, Montgomery/MD, Davidson/TN,
Jefferson/KY, Jefferson/AL; Franklin/OH, Wayne/MI, Bergen/NJ, and Marion/IN were chosen as each
state's actual most-populous county since no existing entry constrained the choice).

**8 of 10 succeeded cleanly on the first pass, no new recipe issues**: OH (Franklin — Grand Total
$2,665.00), MO (Jackson — Grand Total $504.00, unusually low premiums recorded as-is per the exact-
figures rule), MI (Wayne — Grand Total $3,808.00), PA (Philadelphia — Grand Total $3,305.00, exactly
reproducing the figures from this recipe's original 2026-07-25 solve, a nice internal-consistency
check), NJ (Bergen — Grand Total $2,325.00), TN (Davidson — Grand Total $3,329.69, Owner's Premium
byte-identical to Cornerstone Title of Tennessee's existing TitleTap-sourced figure, a genuine cross-
tool corroboration), KY (Jefferson — Grand Total $2,300.00), AL (Jefferson — Grand Total $1,875.00).
All 8 now at 4 of 4 calculator-basis providers.

**MD and IN both initially failed with the exact same DC-shaped symptom**: an anomalously large
response (MD ~174KB, IN ~209KB, vs. ~70-85KB for every successful state in this batch) with no
`Grand Total` content reached after `btnFinish`. This is now the 3rd/4th state (after DC) to hit
this specific failure mode, worth naming as a recognized pattern: the **"large-response no-quote"
failure**. Unlike DC, both MD and IN got a dedicated debugging pass this session, and both turned
out to have a cheaper stateless-HTTP fix than DC's (which remains unsolved and server-disabled even
with every known question answered) — **the actual root cause in both cases was a radio-group
question rendering with *neither* option pre-checked**, unlike every other Yes/No question this
recipe has encountered elsewhere (which always default-check one option): MD's `OwnerOccupied` and
IN's `BuilderEligible`. Finding this required diffing each radio group's rendered `checked`
attributes against the ones this recipe was already answering, rather than assuming "some panel has
an extra question" the way the DC investigation approached it. **IN's `BuilderEligible` also lives
in a different panel** (`pnlAmountsPolicyQuestions`, not the `pnlAmountsTransactionQuestions` panel
every other question in this recipe has come from) — a generalizable lesson: when hunting for an
unanswered blocker, scan the *entire* response for any `rc_` radio-group name not yet in the
answered set, not just the one panel this recipe has looked at historically. With `OwnerOccupied=Yes`
(MD, the substantively correct default for a standard owner-occupied resale) and
`BuilderEligible=No` (IN, correct since the standard scenario is a resale, not new construction)
each explicitly posted via their own `__EVENTTARGET`, both completed cleanly: **MD** Owner's $2,507.50
(Disclosure $1,422.50 + Adjustment $1,085.00), Loan $275.00, CPL $55.00, Grand Total $2,837.50.
**IN** Owner's $1,337.00, Loan $120.00, plus a genuinely new line item this recipe hadn't surfaced
before — **TIEFF (Title Insurance Enforcement Fund Fee) $5.00**, a real Indiana-specific statutory
charge — plus triple CPL charges (Lenders $35/Buyer $25/Seller $25), Grand Total $1,552.00. Both now
at 4 of 4 calculator-basis providers. **Updated recommendation**: DC's `btnFinish` disabled-state
symptom is confirmed distinct from MD/IN's missing-radio-default symptom (DC's four questions *were*
all correctly answered per the 2026-08-19 DC entry above, yet Finish stayed disabled regardless) — so
DC genuinely does still need a browser-driven session, while any *future* state hitting this same
large-response/no-Grand-Total symptom should first be checked for an unanswered-by-default radio
group before being written off as DC-shaped.

**Session-wide total for this richness push**: 13 states gained a 4th calculator-basis provider
(NH, WV, ME, OH, MO, MI, PA, NJ, TN, KY, AL, MD, IN) in one session via the FNF recipe, including 2
(MD, IN) that required solving a new recipe gotcha (unanswered-by-default radio groups) along the way.

### Richness pass, final sweep same session — WI and VA close out the FNF backlog

Checked the last 2 remaining exactly-3-provider states without an existing FNF entry (every other
state at 3 either already had FNF or is in the AK/DC dead-end category): **WI** and **VA**. Both
confirmed in the tool's county-dropdown footprint and harvested cleanly against each state's
existing standard-scenario county (Milwaukee/WI, Fairfax/VA), no new recipe issues. **WI**: Owner's
Policy Premium $2,073.00 (Disclosure $775 + Adjustment $1,298), Loan Policy Premium $525.00, Grand
Total $2,598.00. **VA**: Owner's Policy Premium $2,097.50 (Disclosure $1,050.50 + Adjustment
$1,047.00), Loan Policy Premium $200.00, CPL $50.00, Grand Total $2,347.50 — the Owner's Premium is
byte-identical to VA's existing Independent Title & Escrow LLC NetSheetCalc entry, another genuine
cross-tool corroboration (the 3rd one surfaced this session, after DE/Stewart-FNF and TN/Cornerstone-
FNF). Both states now at 4 of 4 calculator-basis providers.

**This closes out the FNF-recipe richness backlog for the entire "already-crossed-threshold, missing
FNF" list identified at the start of this session's richness push.** 15 states total gained a 4th
calculator-basis provider in this session (NH, WV, ME, OH, MO, MI, PA, NJ, TN, KY, AL, MD, IN, WI,
VA) — every remaining exactly-3-provider state either already had an FNF entry from an earlier
session or is outside this tool's footprint entirely. Remaining priorities for future sessions: (1)
DC's browser-driven-session need (see the 2026-08-19 DC entry above) and AK's thin-market 3rd
provider (also above) are the only 2 states that could not be closed this session; (2) the same
"check tracker coverage before hunting for a new platform" technique should now be applied to the
*other* already-solved nationwide tools (Stewart's `/api/SRC/quote`, Old Republic's 2 tools, WFG's
Seller Net Sheet API) against states that have FNF but are missing one of those instead — a
systematic pass state-by-state would likely surface several more free 5th/6th-provider richness
adds toward the mission's 3-6-harvest stretch target; (3) TitleCapture/Qualia Connect remain the
highest-value jsOnly targets nationwide for a future browser-driven session.

## 2026-08-20 session — systematic richness pass: WFG's Seller Net Sheet API and Stewart's `/api/SRC/quote` applied to every already-crossed-threshold state missing either recipe; 2 new reusable bugs found and fixed in the Stewart harvester

Picked up the 2026-08-19 session's own final recommendation directly: with the FNF-recipe richness
backlog fully closed, applied the standing "check tracker coverage before hunting a new platform"
technique to the two other already-solved nationwide recipes — WFG's Seller Net Sheet API
(`rates.wfgnationaltitle.com`) and Stewart's `/api/SRC/quote` (`stewartratecalculator.com`) —
against every state in the Calculator harvest tracker missing either one. Built two small
`requests.Session()`-based Python harvesters (scratch tooling, not committed to the repo, same
convention as every prior session's FNF/WFG/Stewart scripts) and ran them as unattended batches
rather than one state at a time.

### WFG Seller Net Sheet — 15 states harvested (14 already missing it + a manually-added OH), zero recipe issues
Cross-referenced the tracker table against which states already carried a WFG entry and found **OH,
MO, MI, PA, NJ, MN, WI, VA, MD, MA, TN, IN, AL, AR, KY** had never had this recipe applied despite it
being solved since 2026-08-08. Confirmed all 15 via `GET /api/rates/State/GetCalculationEnabledStates`
(also reconfirmed **HI and AK have no WFG coverage at all** — absent from the enabled-states list
entirely, not just `isCalculationEnabled: false` — closing off WFG as a lead for either state
permanently). Ran the unchanged `POST /api/rates/fees/estimatefeesforsellernet` recipe (nested
`Properties`/`Loans` body, `SettlementStatementVersion: "CD"`) against each state's own most-populous
county (or an existing entry's county where one was already on file, for comparability). **All 15
succeeded cleanly on the first pass** — no payload or gating issues, confirming this recipe is as
durable and state-agnostic as the FNF one. Sample results: OH (Franklin) Owner's Premium $2,846.25;
PA (Philadelphia) $3,635.50; TN (Davidson) $3,484.00; MO (Jackson) $518.00 (an unusually low figure,
recorded as-is per the exact-figures rule, consistent with MO's own existing FNF entry's similarly
low $504.00 Grand Total — a genuine cross-tool corroboration of MO being an outlier-cheap market, not
a fetch error). IN returned WFG's rare itemized-HUD-fee case (a $25.00 seller-side CPL line, on top
of the Owner's Premium) — the 8th state nationwide (after WA/CA/TX/OR/AZ/NV/CO) actually observed
with a non-empty `hudFees` array from this endpoint, a small addition to the known-itemized-state list
first documented 2026-08-08.

### Stewart `/api/SRC/quote` — 26 states harvested (every remaining state in the tracker table missing it), 2 reusable environment/client bugs found and fixed
Cross-referenced the same table for Stewart coverage and found it missing from every state except the
9 New-England/thin-market states already worked in the 2026-08-14 through 2026-08-18 sessions (NH,
WV, ME, ND, VT, WY, RI, DE, SD) — a much larger backlog than WFG's. Targeted **NM, UT, HI, OR, CT,
MS, NE, LA, SC, MO, MI, PA, NJ, MN, WI, VA, MD, MA, TN, IN, AL, AR, KY, CO, AZ, NV** (26 states) using
each state's own existing standard-scenario county where one was already on file.

**Bug #1 — apex-domain POST hang, a sandbox/proxy artifact, not a live block.** The very first attempt
(NM) hung indefinitely (30s+ read timeout, 0 bytes received) on every `POST /api/SRC/quote` call.
Root-caused via a manual `curl -v`: `stewartratecalculator.com` (bare apex) returns a clean `301
Location: https://www.stewartratecalculator.com/api/SRC/quote` instantly, but reading that redirect
response's (empty) body hangs forever on this sandbox's proxied HTTP/2 connection — `requests`'s
automatic redirect-following tries to consume that body internally, so even a script that never
touches the apex host directly still hits this once a redirect fires mid-`POST`. **Fix: target
`https://www.stewartratecalculator.com` directly everywhere (page loads, all `/api/SRC/*` calls,
the final `quote` POST) so the apex redirect never fires at all.** This is almost certainly an
artifact of this sandbox's outbound proxy's handling of a 301 response to a POST with a Cloudflare
`cf-ray` header present, not a real change in Stewart's own infrastructure — flagged here so a future
session doesn't waste time treating it as a new block on Stewart's end.

**Bug #2 — a client-side normalization bug that had been silently zeroing out every itemized
settlement-fee result.** The first full batch run (24 states, before this fix) completed with clean
HTTP 200s on every request but returned `ItemizedTitleServiceFeeList: null` for **100% of states**,
including NM, where the 2026-08-12 session's existing figures should have made a `null` result
immediately suspicious. Root cause: this session's harvester script computed `ProviderID` for the
`QuoteType=3` POST by checking `isinstance(providers, list)` against the *entire* `/api/SRC/providers`
response object (`{"ProviderList": {"Provider": [...]}}`), which is never a bare list at the top
level — so the check always fell through to treating the whole wrapper dict as "the provider," whose
`.get("ID")` naturally returned `None` every time. This is the same class of bug the 2026-08-18
session already documented and fixed once (`Provider` sometimes being a bare object instead of a
one-element list for single-provider counties) — this session's script had the *containing* dict
mismatch, one level up, that the earlier fix hadn't been aimed at. **Fix: drill into
`providers.get("ProviderList", {}).get("Provider")` first, then normalize *that* value to a list
before indexing.** Re-ran the full 24-state batch (plus NM and NV, added after this fix) with the
corrected extraction and got itemized settlement-fee data back for the large majority of states —
see the per-state `.json`/`.md` entries for the full line-item detail. **Generalizable lesson for any
future session reusing this recipe: a clean HTTP 200 with an all-states-null itemized-fee result is a
much stronger signal of a client-side extraction bug than of a genuine market pattern — the earlier
sessions' occasional genuine nulls (DE, and now confirmed HI) were each a single state, not a sweep.**

**HI's genuine null, confirmed distinct from the bug above.** After the ProviderID fix, HI's
`/api/SRC/providers` call for Honolulu County returns `{"ProviderList": null}` — a real, correctly-
parsed empty result (Stewart has no local settlement office serving this county through this tool at
all, not just a missing single-object-vs-list normalization). Required a 3rd small fix (guard against
`providers.get("ProviderList")` itself being `None`, not just absent) to stop this from crashing the
harvester outright. HI's premium and recording-tax figures (Owner's $2,155.00/Lender's $1,835.00, no
transfer tax found) still came back fine — only the itemized settlement-fee line items are unavailable
for this state via this tool, a genuine market-coverage gap worth noting for any future HI session.

### Results summary (28 states total touched this session: 27 gained a genuine new calculator-basis
provider count via Stewart and/or WFG, 1 more — OH — via WFG only)
| Recipe | States |
|---|---|
| WFG only | OH |
| Stewart only | NM, UT, HI, OR, CT, MS, NE, LA, SC, CO, AZ, NV |
| Both WFG + Stewart | MO, MI, PA, NJ, MN, WI, VA, MD, MA, TN, IN, AL, AR, KY |

Every state above gained 1 or 2 additional calculator-basis providers (see PROGRESS.md's tracker
table for the exact new counts, now ranging 4-6 per state) plus a rich set of new premium/itemized-
fee/recording-tax dollar figures in each state's own `.json`/`.md`. Full per-state itemized figures
are in each state's `basis: "calculator"` JSON entries rather than repeated here.

**Not touched this session** (already had both WFG and Stewart, or are outside this session's scope
per the standing task brief): NH, WV, ME, ND, VT, WY, RI, DE, SD (the 9 already-saturated New England/
thin-market states), and AK/DC (explicitly out of scope for stateless-HTTP retries per the task
brief — both remain at their existing 2-of-3/no-WFG-coverage status).

**Recommendation for next session**: (1) the WFG+Stewart richness pass is now essentially complete —
the only two remaining nationwide recipes not yet cross-checked against every state are Old
Republic's two tools (`ortconline.com` and `ortratecalculator.oldrepublictitle.com`), which the
2026-08-09/2026-08-10 sessions found are geographically narrower and NoBot-gated for several states
(IN, and previously LA/SC/MS until that block partially lifted) — a focused pass checking exactly
which of the 26 states touched this session are missing an Old Republic entry, with the full
session-affinity fix (not just the lighter Referer-header fix) applied to any NoBot-blocked ones,
would likely be the next-highest-yield richness target; (2) TitleCapture/Qualia Connect remain the
highest-value jsOnly targets nationwide for a future browser-driven session, as does DC's server-
disabled `btnFinish` control; (3) the freshness and blocked-source-retry passes should resume their
normal rotation now that this session's richness push is wrapping up.

## 2026-08-21 session — Old Republic's 2nd-tool richness pass: MI/PA/NJ/VA/TN/MD/WI/MN/AL/MA/IN each gain a corroborating provider; IN's durable NoBot block finally resolved

Picked up the 2026-08-20 session's own top recommendation: apply Old Republic's second calculator
(`ortratecalculator.oldrepublictitle.com`) to every already-crossed-threshold state that lacked an
entry from it. Cross-referenced the Calculator harvest tracker table (PROGRESS.md) against every
state's provider list to find candidates, then worked them highest-population-first: MI, PA, NJ,
VA, TN, MD, WI, MN, AL, MA, IN (11 states this session).

**Recipe (unchanged from the NH/WV-era session-affinity fix, applied consistently)**: GET
`https://ortratecalculator.oldrepublictitle.com/RateCalc.aspx?CallingApp=PUBLIC&Location=<ST>` with
`Referer: https://oldrepublictitle.com/rate-calculator/?location=<state-slug>` set on every request
in one persistent `requests.Session()` (not a fresh connection per call); the response 302s to a
session-scoped `(S(...)F(...))/RateCalc.aspx?...Location=<numeric-code>...` URL that must be reused
for every subsequent POST. Each state's own form must be inspected fresh — this tool's field set
varies meaningfully by state:
- **County-list states** (MI, TN): `ddlCounty` appears first, own `__EVENTTARGET` postback, before
  the policy-category cascade.
- **Two-dropdown-cascade states** (PA, NJ, VA, MD, MA): `ddlPolicyCategory` (pick the SIMULTANEOUS
  variant) reveals `ddlPolicyType1`(Owner's)/`ddlPolicyType2`(Lender's) dropdowns, each its own
  postback, which finally reveal `txtLiabilityAmt`/`txtCrLiabilityAmt`.
- **Radio-driven "PURCHASE/SALE" states** (TN, WI, MN): a `ddlPolicyCategory` or
  `RadPolicyCategory` value of 49 reveals both liability fields directly with no separate
  policy-type dropdown step — the same structural pattern already catalogued for LA earlier in this
  project.
- **AL is a genuine outlier**: the only state where `Location=01` loads with no login/NoBot gate at
  all even without the Referer fix, but its `RadPolicyCategory` radio group **defaults to HOME
  EQUITY (value 52), not PURCHASE/SALE** — naively reading "the checked radio's value" from the
  first-loaded page and blindly re-POSTing every field back (this project's usual postback pattern)
  silently submits the wrong category, since a plain `<input>`-scraping loop that doesn't check the
  `checked` attribute picks up whichever radio button appears *last* in the HTML, not the one
  actually selected. Must explicitly POST `__EVENTTARGET=ctl00$ContentPlaceHolder1$RadPolicyCategory$0`
  with `RadPolicyCategory=49` to switch categories before the liability fields are usable — a new
  gotcha for this catalog, worth checking for on any other state using the `RadPolicyCategory`
  radio-group pattern (LA, MS) rather than assuming the visually-first option is what gets submitted.
- **CO is genuinely login-gated on this tool** (`RateCalc.aspx?...Location=CO` redirects straight to
  a `Login.aspx` page, not a NoBot rejection) — logged as `{gated: true}` in the tracker below and
  not pursued further; consistent with CO's absence from this tool's `ortconline.com` sibling
  product's `PropertyStateList` as well.
- **IN's durable NoBot block (logged 2026-07-29, reconfirmed 2026-08-10) is resolved by the full
  session-affinity fix.** Every session since 2026-08-19 flagged `Location=IN` as the top candidate
  to retry with the fix found on WV, but none had actually done so until this session — confirmed
  working cleanly on the first attempt. IN's form also returned a genuine non-premium **TIEFF Policy
  Fee** (Indiana Title Insurance Enforcement Fund Fee) line item, a state-specific regulatory-fee
  data point not seen on this tool's other state entries.

**Results** (all premium-only, no settlement-service-fee itemization on this tool, consistent with
its structural limitation elsewhere in this project) — Owner's/Lender's Grand Total premiums:
MI $3,590.85 combined/$1,359.80 lenders-only (bundles a mandatory Homeowners Extended endorsement,
a MI-specific quirk); PA $3,305.00/$2,735.00 (byte-identical 3-way convergence with FNF/Stewart,
consistent with PA's TIRBOP bureau-promulgated rates); NJ $2,250.00/$1,800.00 (matches Stewart
exactly); VA $2,297.50/$1,247.00 (matches Stewart exactly); TN $3,171.01/$2,455.01; MD
$2,775.00/$1,355.00; WI $2,623.00/$1,873.00; MN $1,712.50/$1,125.00; AL $1,900.00/$1,000.00
(Lenders-only figure matches Stewart exactly); MA $2,300.00/$1,000.00 (byte-identical to Stewart);
IN $1,460.00/$380.00 plus the TIEFF fee noted above. Each state's own `.json` `basis: "calculator"`
entry and `.md` addendum has the full itemization and per-state bundlingNotes. Every state gains a
7th calculator-basis provider (MA and IN reached 6/7 respectively, having started one provider
lower than the rest of this batch).

**Not yet checked this session** (deferred to a future richness pass, in roughly population order):
AR, NE, ME, ND, VT, WY, RI, DE, SD — all still lack an Old Republic 2nd-tool entry. CO is now
confirmed permanently out of reach on this specific tool (login-gated); AK and DC remain out of
scope per the standing task brief.

**Follow-up check performed this session**: re-read LA's and MS's already-on-file Old Republic 2nd-
tool entries to confirm the AL default-radio gotcha doesn't affect them. **Both are fine** — LA's
`RadPolicyCategory=49` (PURCHASE/SALE) was already the page's own default-checked option (no
mismatch), and MS's entry explicitly documents switching `RadPolicyCategory` from OWNERS to LOAN
(value 2) for its second query, so neither relied on an unverified default. No correction needed to
either state's existing data.

**Continued this same session — NE and the remaining New England/Dakota small states.** NE worked
cleanly (county-list + dropdown-cascade pattern, Douglas County code 055): Grand Total $1,332.50
combined/$1,057.50 lenders-only, the latter byte-identical to NE's existing Stewart entry, plus a
genuine $25.00 CPL fee. AR is confirmed still login-gated (`Login.aspx` redirect, same as CO) —
consistent with the 2026-08-08 session's "Location=01 is the outlier public pilot" finding, no
change. The remaining 7 states (ME, ND, VT, WY, RI, DE, SD) all worked without any login/NoBot
gate: ME/VT/RI/DE use the `ddlPolicyCategory`-then-`ddlPolicyType1`/`ddlPolicyType2` dropdown
cascade (same pattern as MI/PA/NJ/etc. earlier this session); ND/WY/SD use the `RadPolicyCategory`
radio-group pattern (same family as AL/LA/MS) and **all three reproduce the AL-style default-radio
gotcha**: `RadPolicyCategory` is genuinely checked to PURCHASE/SALE (value 49) in the page's own
HTML, but a naive "scrape every field's current value from the DOM" approach that doesn't check the
`checked` attribute silently picks up the *last* radio option in HTML source order (REFINANCE,
value 51) instead — confirmed by a first-pass run on all three that returned "REFINANCE LENDERS
POLICY" results before the value was explicitly re-asserted in the POST body. Any future harvester
touching this tool's `RadPolicyCategory`/`RadPolicyCategory`-style controls should always explicitly
set the intended value rather than trusting a scraped default, even when the page's own default
already happens to be correct.

Results (Grand Total Owners+Lenders combined / Lenders-only standalone, all premium-only): ME
$1,600.00/$700.00; ND $1,550.00/$1,025.00; VT $1,650.00/$987.50; WY $2,260.00/$737.00; RI
$1,800.00/$1,000.00 (byte-identical combined total to RI's existing FNF entry); DE $2,300.00/
$1,235.00 (byte-identical combined total to DE's existing FNF entry AND to DE's Stewart Owner's
Premium — a 3-way convergence); SD $1,350.00/$875.00 (this tool applies no SD sales tax to title
fees, unlike SD's existing Stewart entry). Each state gains a 4th or 5th calculator-basis provider
(NE went 4→5; the 7 small states each went 3→4). Full per-state itemization in each state's own
`.json`/`.md`.

**This closes out the Old Republic 2nd-tool richness pass for every state in the original
"complete (scarce), never yet worked" tracker list except AK/DC (out of scope) and CO/AR (both
genuinely login-gated on this specific tool, confirmed and not pursued further).**

**Recommendation for next session**: (1) the Old Republic 2nd-tool richness pass is now complete
across the tracker — no further states to check on this specific recipe; (2) the freshness and
blocked-source-retry passes are due again next session, having been skipped this session in favor
of the richness-pass breadth push; (3) TitleCapture/Qualia Connect remain the highest-value jsOnly
targets nationwide for a future browser-driven session, as does DC's server-disabled `btnFinish`
control.

## 2026-08-22 session — new-platform search dead end: Investors Title / National Investors Title
both route to TitleCapture

Confirmed via the PROGRESS.md tracker that all 36 in-scope scarce/scarce-market states already carry
`calculator-quoted` status (4-7 providers each) — no state has any open priority-1 work on the
recipes already in hand. Searched for a genuinely new calculator platform to check whether any
further stateless-HTTP growth is possible.

**Investors Title Insurance Company** (`invtitle.com/calculator`) and its affiliate **National
Investors Title Insurance Company** (`nititite.com` — correct domain `nititle.com/calculator`) both
advertise their own rate calculators (both companies are part of the same NC-headquartered
corporate family, primarily serving the southeast/mid-Atlantic). Fetched both calculator pages
directly via plain GET:
- `invtitle.com/calculator` is a static Drupal marketing page whose actual "Calculate" call to
  action links out to **`invtitle.titlecapture.com/title-quote-uw`** — i.e. this is just another
  TitleCapture tenant, not an independent recipe. TitleCapture is already this project's
  top-priority jsOnly target nationwide; this is one more entry point into that same queue, not a
  new platform.
- `nititle.com/calculator` is also Drupal-served but the calculator itself renders client-side with
  no server-rendered `<form>`, no `<iframe>`, and no API endpoint reference visible in the static
  HTML — consistent with (but not confirmed as) the same TitleCapture backend used by its sister
  company. Not stateless-drivable either way.

**Conclusion: no new independent stateless-HTTP recipe found this session.** Both leads terminate
in the already-catalogued TitleCapture jsOnly queue. Confirms the standing conclusion from every
recent session: further calculator-harvest growth beyond the current 36-state saturation requires a
browser-driven session for TitleCapture/Qualia Connect, not a new plain-HTTP technique. Do not
re-search for "new platforms" in a future stateless-HTTP session without a specific new lead in
hand — the obvious candidates (independent regional underwriters with their own branded
"calculator" page) have converged on the same handful of white-label SaaS backends already
documented here.

## 2026-08-23 session — new-platform search dead end: TitleThrive is a JS-widget website-platform
feature, not an independent recipe; Land Title Co of AL and Orange Coast Title AL/CA both resolve
to login-gated JS calculators

Bounded (~15 min) web search for a calculator platform not yet in this catalog, per the standing
task brief. `titlethrive.com/features/calculators/` markets a "calculator included with every
TitleThrive website" — this is a website-builder feature bundled into agency sites built on the
TitleThrive platform (comparable in kind to TitleCapture/Qualia's per-tenant embed model), not a
single API to catalog once. The vendor page itself gives no technical detail (iframe vs JS vs API)
and names no example tenants. Searched for a live example: `vgtitle.com/resources/rate-calculator/`
(Vanguard Title) surfaced as a TitleThrive tenant candidate but was not investigated further this
session (bounded time). Two other leads surfaced by the same search were checked directly and both
dead-ended: **Land Title Company of Alabama** (`land-title.net/rate-calculator/`) is a client-side
JS toggle widget (Purchase/Refinance, Residential/Commercial, Standard/ALTA, Sales Price input) with
no `<form>` action/method and no discoverable API endpoint in static HTML — confirmed jsOnly by a
quick grep of the page source for `fetch`/`axios`/`/api/` references (only a bare, unattached
`fetch` keyword found, no endpoint). **Orange Coast Title** (`octitle.com/rates.asp`, CA — not an
in-scope scarce state but checked since it surfaced in the same search) is likewise JS-rendered and
explicitly gates full net-sheet output behind a login ("for full Net Sheets with closing costs, log
in and try Net Advantage") — a hard no per the no-fabricated-credentials rule regardless of JS
status. **Conclusion: no new independent stateless-HTTP recipe found.** Nothing added to the
tracker. If a future session wants to chase TitleThrive specifically, the right next step is
finding several live TitleThrive-tenant title-agency sites and checking whether any expose a plain
form/endpoint distinct from the TitleCapture/Qualia jsOnly pattern — not yet done, still an open
(very low-confidence) lead.

## 2026-08-24 session — TitleThrive lead closed out: vgtitle.com resolves to ConvertCalculator, a
generic client-side widget platform, not a TitleThrive-specific recipe

Followed up on the 2026-08-23 session's open TitleThrive lead by fetching
`vgtitle.com/resources/rate-calculator/` (Vanguard Title, the candidate tenant site named but not
checked last session). The page's calculator is embedded via `convertcalculator.com/embed/<id>`
(ConvertCalculator, a generic third-party form/calculator SaaS unrelated to TitleThrive itself —
TitleThrive's "calculator" feature appears to just be a wrapper around this or a similar
white-label embed tool, not an in-house engine). Fetching the embed URL directly returns a
near-empty HTML shell (1 line, pure JS bootstrap) with no server-rendered form, no visible formula
data, and no discoverable `/api/` or `.json` endpoint in the static response — **confirmed jsOnly**,
consistent with every other TitleThrive-adjacent lead checked. **Conclusion: TitleThrive lead is now
fully closed** — it does not lead to a new stateless-HTTP recipe, and there is no reason to keep it
open for a future stateless session. Logged here (not the state's `.json`, since no scenario was
harvested) as `{jsOnly: true, url: "https://vgtitle.com/resources/rate-calculator/"}` for a future
browser-driven session's queue, alongside the platform note that the underlying widget is
ConvertCalculator (`convertcalculator.com`), not a bespoke TitleThrive backend.

## 2026-08-26 session — new-platform search: NATIC QuoteLink and Westcor both surfaced but neither
yields a new usable recipe this session; priority-1 calculator harvest confirmed still fully
saturated (36/36); freshness + blocked-retry passes clean

Confirmed at session start (cross-checking PROGRESS.md's calculator tracker table against the
36-state "complete (scarce)/complete (scarce market)" list) that saturation is unchanged since
2026-08-22: all 36 in-scope states still carry `calculator-quoted` status with 4-7 providers each.
No re-harvest attempted against already-saturated states, per the standing instruction.

**New-platform search (bounded).** Two leads surfaced via web search that were not previously in
this catalog:

- **North American Title Insurance Company (NATIC) — QuoteLink Calculator**
  (`natic.com/QuoteLink-Calculator.aspx`): both the calculator page and the bare domain root
  (`natic.com/`) failed with a TLS handshake error this session (curl exit 35, no HTTP response
  received at all) — a connection-layer failure, not a bot-block or a real 4xx/5xx. Logged as
  `{gated: false, jsOnly: unknown, connectionFailed: true}` — worth a plain retry next session in
  case this was transient (matches this project's established treatment of other transient
  connection failures, e.g. the 2026-08-20 session's Arizona DIFI 502 CONNECT-tunnel case). Not
  pursued further this session.
- **Westcor Land Title Insurance Company (WLTIC)**: two distinct entry points found —
  `ewestcor.com/ratecalculator2.aspx` fetched cleanly (HTTP 200) and is a genuine ASP.NET WebForms
  form (`__VIEWSTATE`/`__EVENTTARGET`/`__doPostBack`, same family as the already-solved FNF
  `ratecalculator.fnf.com` and Old Republic `ortconline.com` tools) with a two-stage
  postback (select `ddState` → county list populates → select `ddPolicyType` → policy-form list
  populates → fill `tbAmount` → submit `Button1`/"Print Quote"). **However, its `ddState` dropdown
  only offers one option (`FL`)** — this specific page instance is FL-scoped, and FL is not an
  in-scope "complete (scarce)" state (already `complete (saturated)` on the published-schedule
  track), so solving its postback protocol would not help calculator-harvest priority-1 even if
  pursued. Per Westcor's own site copy surfaced in the search ("This calculator has been replaced by
  the Westcor National..." on the old Texas-specific page), Westcor appears to have migrated from
  per-state `eWestcor.com/rate-estimators/<State>.aspx` pages to a newer unified tool at
  `ratequote.wltic.com/Quote?k=Westcor-All` — but that URL failed to connect at all (curl exit 0,
  HTTP 000) both directly and via WebFetch. Logged as `{jsOnly: unknown, connectionFailed: true,
  url: "https://ratequote.wltic.com/Quote?k=Westcor-All"}` — the more promising target for a future
  session than the FL-only legacy page, since it's advertised as covering "all 50 states."

**Conclusion: no new usable calculator-harvest recipe added this session** — both leads are
either connection-blocked (worth a plain retry) or scoped to a non-target state. If a future
stateless-HTTP session retries `ratequote.wltic.com/Quote?k=Westcor-All` and it resolves, the
ASP.NET WebForms postback pattern already reverse-engineered on `ratecalculator2.aspx` this session
(dropdown `ddState` → `__doPostBack` → populated `ddCounty`, same shape as the FNF/Old Republic
recipes already on file) should transfer directly, so a future session shouldn't need to re-derive
the form mechanics from scratch — only confirm the field names on the live page since the unified
tool may differ from the FL-only legacy instance inspected here.

**Freshness rotation** (5 sources re-checked this session, continuing the standing rotation with
the same batch used to open round 1/round 2 — AZ/Pioneer Title Agency PDF, DC/Federal Title fees
page, DC/Avenue Settlements [now branded Avenue Title Group] fees page, DE/Lem & Associates FAQ,
CT/Yona Law closings page): **4 of 5 confirmed live with a clean HTTP 200** (DC Federal Title, DC
Avenue Title Group, DE Lem & Associates, CT Yona Law). AZ/Pioneer Title Agency's PDF continues to
return **HTTP 202 with an `sgcaptcha` bot-challenge interstitial** (`text/html`, 231 bytes) —
unchanged from every prior check of this exact source; per this project's standing convention, not
marked `{stale: true}` since the underlying resource is confirmed to still exist behind a
fluctuating bot-gate, not actually gone.

**Blocked-source retries** (one retry each, per the standing rotation): **Arizona DIFI**
(`difi.az.gov/title-insurance-rate-filings`) still HTTP 403, unchanged across every session checked.
**CATIC CT** (`catic.com/state-resources/connecticut`) HTTP 403 this run, continuing its established
fluctuating 200/403 pattern (confirmed 200 as recently as 2026-08-24). **Jackson & Scott AL**
(`realestatelclosings.com/closing-costs-calculator/`) still HTTP 403, consistent WAF block. No
status changes on any of the three.

**Next session priority**: (1) priority-1 calculator harvest remains fully saturated at 36/36 — no
further re-harvest without a genuinely new, *reachable* lead; (2) retry NATIC
(`natic.com/QuoteLink-Calculator.aspx`) and Westcor's unified tool
(`ratequote.wltic.com/Quote?k=Westcor-All`) — both failed at the connection layer this session
(TLS handshake failure / HTTP 000), which may be transient rather than a genuine block, and Westcor
in particular already has a partially-reverse-engineered WebForms recipe ready to adapt if the
unified endpoint comes back reachable; (3) continue the freshness rotation from its established
round-3 starting point (this session's AZ/DC/DC/DE/CT batch matches the round-1/round-2 opening
batch, so the next batch chronologically is VA, per the 2026-08-22/23 sessions' own notes); (4)
TitleCapture/Qualia Connect remain the highest-value jsOnly targets nationwide for a future
browser-driven session, as does DC's server-disabled `btnFinish` control; AK and DC remain
genuinely exhausted for stateless-HTTP technique.

## 2026-08-27 session — Westcor's unified tool resolved and fully harvested: new nationwide
WebForms recipe cataloged, DC breaks its 3rd-provider gap (2 of 3 → calculator-quoted 3 of 3), AK
confirmed genuinely excluded from auto-quote (statewide, not county-specific); NATIC still
connection-blocked; VA freshness (4/5 live) + blocked-retry passes clean

**Westcor's unified "all 50 states" tool (`ratequote.wltic.com/Quote?k=Westcor-All`), connection-
blocked on 2026-08-26, resolved cleanly this session** (plain `curl`/`requests` GET, no proxy/UA
tricks needed — the prior HTTP 000 reads as transient, matching this project's precedent for other
one-off connection failures). Full technical recipe, reverse-engineered from scratch against the
live unified tool (the FL-only legacy `ewestcor.com/ratecalculator2.aspx` page inspected 2026-08-26
turned out to share the same general WebForms shape but *not* the same field names — confirming the
prior session's own caveat that the unified tool needed independent verification):

**Recipe (ASP.NET WebForms cascading postback, plain HTTP, no browser/JS, no personal data anywhere
in the flow):**
1. `GET` the base URL. Capture `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, `__EVENTVALIDATION` from the
   hidden inputs (present in every response, full page or partial).
2. `POST __EVENTTARGET=ctl00$MainContent$ddlState` with `ddlState=<2-letter state>` plus the rest of
   the form's current field values (blank/default) and the captured viewstate triad. Response's
   `ddlCounties` `<select>` populates with that state's counties (FIPS-style numeric `value`,
   county-name `label`).
3. `POST __EVENTTARGET=ctl00$MainContent$ddlCounties` with the chosen county value added. Response's
   `ddlCity` `<select>` populates.
4. `POST __EVENTTARGET=ctl00$MainContent$ddlCity` with the chosen city added (DC's only "city" option
   is `Washington`; states with no city-level breakout still require *some* value from the populated
   list).
5. `POST` with `ctl00$MainContent$btnGetQuestions=Continue` (no `__EVENTTARGET`) and
   `ddlTranType=Purchase`, `ddlPolicyType=Simultaneous`, `rblFeeType=All`, `rblQuoteDetail=Quick`,
   `tbxSalesPrice=500000`, `tbxLoanAmount=400000`. This reveals a **state-specific Yes/No question
   panel** (`ctl00$MainContent$Q<numeric ID>` radio groups, e.g. AK/WY's single non-compliance-fee
   question vs. DC's 9-question panel covering enhanced coverage, prior-policy credit, recordation-
   tax exemptions, and the DC first-time-homebuyer discount). **Every question was left at the tool's
   own pre-checked default** — consistent with this project's standing convention (never fabricate an
   answer; accept the tool's own default).
6. `POST` with `ctl00$MainContent$btnGetQuote=Get Quote`, echoing back every `Q<ID>` field at its
   default value plus the hidden `ctl00$MainContent$hdnTransactionID` value from step 5's response.
   The final response renders TITLE FEES / SETTLEMENT FEES / RECORDING FEES tables plus an
   ESTIMATED TOTALS row (Owner and Lender columns).

**Verification pass (WY, a state already at `calculator-quoted (4 providers)`, used purely to
confirm the recipe works before spending it on scarce states)**: Laramie County/Cheyenne returned a
clean, fully itemized quote (Simultaneous Owner Premium $1,590.00, Simultaneous Lender Premium
$100.00, Total Recording Fees $99.00, ESTIMATED TOTALS Owner $1,689.00/Lender $100.00) — confirms the
recipe is sound and general-purpose, not DC-specific.

**AK (Anchorage, then re-tried at Fairbanks with `ddlPolicyType=Owner`): both return the identical
message `"For this policy type and coverage amount, please call Westcor for a quote. Thank you."`**
across `Simultaneous`, `Owner`, and `Lender` policy types alike. This is a clean, unambiguous
tool-level refusal (not a bug, not a form-validation error, not gated behind personal data) —
confirmed state-level rather than county-level since it reproduces identically at both Anchorage
(the county tried in the DC-recipe walkthrough) and Fairbanks. Logged as
`{gated: true, reason: "tool declines to auto-quote AK at this coverage amount/policy type, statewide", url: "https://ratequote.wltic.com/Quote?k=Westcor-All"}`
— this is now the **3rd distinct platform** (after WFG's own `isCalculationEnabled: false` flag and
the absence of any AK-capable 3rd platform found across many prior sessions' searches) to exclude AK
from automated online quoting, reinforcing the "AK is a genuinely thin, manually-quoted market"
conclusion already on file rather than opening a new lead. AK stays at 2 of 3 providers (Stewart +
WFG), still below the calculator-quoted threshold, and this project's standing conclusion that AK
needs a fundamentally new (likely non-national-underwriter) lead to close its 3rd-provider gap is
unchanged.

**DC (District Of Columbia County/Washington, the tool's only DC county/city option): a full,
clean quote, no refusal message.** This is DC's first successful calculator quote from any platform
other than Stewart/WFG — FNF's DC flow has completed without producing a result across multiple
prior sessions (2026-08-18/2026-08-19 entries above) and remains unsolved, but Westcor sidesteps
that dead end entirely. Result: Simultaneous Owner Premium $2,800.00, Simultaneous Lender Premium
$150.00, Closing Protection Letter $50.00 (the tool's only settlement-fee line item — no separate
escrow/closing-agent fee is itemized), Title Insurance Premium Adjustment ($1,640.00), Total
Recording Fees $20,485.00 (of which $20,335.00 is DC's own deed/mortgage recordation tax at
2.9%/1.45% — flagged in DC.json as tax, not a service fee, consistent with how this project treats
transfer taxes elsewhere), ESTIMATED TOTALS Owner $23,335.00/Lender $150.00. **This is DC's 3rd
calculator-basis provider — DC flips from "2 calculator-basis providers, below 3-provider threshold"
to `calculator-quoted (3 providers)`.** Full entry appended to DC.json, DC.md, and the PROGRESS.md
tracker table.

**NATIC's QuoteLink Calculator** (`natic.com/QuoteLink-Calculator.aspx`), connection-blocked on
2026-08-26 with a plain TLS handshake failure, was retried this session and **still fails identically**
(HTTP 000, no response received) — unlike Westcor, this one has not resolved. Left logged as
`{gated: false, jsOnly: unknown, connectionFailed: true}` for a further plain retry next session;
no further diagnosis attempted (a persistent TLS-layer failure across 2 sessions a day apart starts
to look more like a real block than a one-off transient, but it's not yet confirmed either way).

**Freshness rotation, round 3, first batch: VA** (5 sources — Republic Title fees page, Stewart VA
rate manual PDF via virtualunderwriter.com, Federal Title fees page, Lighthouse Title Seller PDF via
federaltitle.com, WFG VA rate manual PDF): **4 of 5 confirmed live** (Republic Title, Stewart,
Federal Title [redirects 308→200, benign], WFG all clean). The Lighthouse Title PDF
(`federaltitle.com/wp-content/uploads/2011/02/Seller.Lighthouse-Title.VA_.pdf`) returned **HTTP 403
for the 3rd consecutive freshness check** (first flagged 2026-08-09, re-confirmed 2026-08-23, now
2026-08-27) — per the 2026-08-23 session's own note, this was the trigger point earmarked for
considering `{stale: true}`. Left unflagged this session pending an explicit decision: every other
WAF/bot-gate block on file in this project has fluctuated (200 sometimes, 403/202 other times) and
this project's standing convention is not to mark a live-but-gated source stale, but this specific
source has now shown *zero* successful fetches across 3 checks spanning 3+ weeks, which reads
differently from a fluctuating gate. Recommend a future session make the call explicitly (mark
`{stale: true}` if a 4th check also fails, or downgrade reliance to a Wayback Machine capture)
rather than defaulting either way without a deliberate decision.

**Blocked-source retries**: Arizona DIFI (`difi.az.gov/title-insurance-rate-filings`) still HTTP
403, unchanged across every session checked. CATIC CT (`catic.com/state-resources/connecticut`)
HTTP 200 this run, continuing its established fluctuating 200/403 pattern. Jackson & Scott AL
(`realestatelclosings.com/closing-costs-calculator/`) still HTTP 403, consistent WAF block. No
status changes on any of the three.

**Next session priority**: (1) DC is now `calculator-quoted (3 providers)` — no further calculator
work needed there; priority-1 otherwise remains fully saturated (37/37 in-scope states now, since DC
graduates) with AK the sole remaining scarce state below threshold, confirmed genuinely excluded from
Westcor's auto-quote (3rd platform to exclude it) — do not re-attempt AK via Westcor without a
materially different approach (e.g. a much lower coverage amount, if that's ever worth testing); (2)
retry NATIC (`natic.com/QuoteLink-Calculator.aspx`) again — 2 consecutive TLS failures a day apart,
worth one more check before treating it as a genuine block rather than transient; (3) decide on the
VA/Lighthouse Title PDF's `{stale: true}` status (3 consecutive 403s, zero successful fetches on
file) rather than deferring again; (4) continue the freshness rotation's round 3 from
ID/IA/ME/MT/ND next, per the established chronological ordering; (5) TitleCapture/Qualia Connect
remain the highest-value jsOnly targets nationwide for a future browser-driven session, as does DC's
server-disabled `btnFinish` control on the FNF flow (now less urgent given Westcor's DC success, but
still open); Westcor's new recipe is also worth running against a handful of already-saturated
states opportunistically if a future session has spare time, purely for richness, though it is not
required by the priority-1 contract.

### 2026-08-31 session — AK: myclosingcost.com checked, logged jsOnly, no lead

Searched for Alaska-specific quote tools not already catalogued above and found
**myclosingcost.com** (`myclosingcost.com/closing-costs/alaska`), not previously logged in this
file. Fetched the page's raw HTML directly (not just a rendered summary): it is a Next.js
server-rendered content/SEO page (`/_next/static/chunks/app/closing-costs/[state]/page-*.js`) with
no `<form>` element, no inline API call, and no `fetch`/`.json` reference discoverable in the static
markup — the figures shown ("~$2,100" owner's title insurance on a $450K home) read as rounded
illustrative copy, not a computed per-address quote, and the site's own copy implies the real
address-driven calculation happens client-side elsewhere with no plain-HTTP-reachable endpoint
found. **Logged here as `{jsOnly: true, url: "https://www.myclosingcost.com/closing-costs/alaska"}`**
for a future browser-driven session to evaluate (worth checking whether entering a real AK address
into the live client-side tool calls a discoverable JSON API, which a browser session could capture
via devtools network inspection even though this WebFetch-only session could not). Does not close
AK's 3rd-provider gap — AK remains at 2 of 3, now genuinely exhausted across 6 consecutive sessions
for stateless-HTTP-reachable calculators (2026-08-17 through 2026-08-31).

## 2026-09-01 session — freshness rotation flags 2 dead calculator links (NV, OH); both states stay well above threshold

**Western Nevada Title Company (NV)** — `wntco.com/calculator` now returns Wix's own
"ConnectYourDomain Error" page (HTTP 404) at both the bare domain and `/calculator`; the domain has
been disconnected from its Wix hosting since the 2026-08-06 harvest. Marked `{stale: true}` in
NV.json. The white-label NetSheetCalc/TitleTap backend actually used to pull the figures
(`app.netsheetcalc.com`, app_id 435) was not re-checked this session and may still be reachable
directly, but the agency's own published entry point is dead. NV still has 5 calculator providers on
file, so this does not threaten its `calculator-quoted` status.

**Columbus Title Agency of Westerville (OH)** — `columbustitle.com/netsheets/` now 404s on the live
site (root domain still 200; tried `/netsheets`, `/netsheets/index.htm`, `/netsheets/index.html`,
`/Netsheets/index.htm`, all 404). The tool appears taken down or relocated since the 2026-07-27
harvest. Marked `{stale: true}` in OH.json. OH still has 5 calculator providers on file.

Both are logged here (not just in their state JSON) so a future session doesn't re-attempt these
exact URLs expecting them to still work.
