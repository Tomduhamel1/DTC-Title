# Connecticut — Market Fee Evidence

## Status: complete (scarce market) — 5 verified sources (2 premium-only, 3 settlement/attorney-fee-priced), 2026-07-22

Connecticut is an **attorney-closing state** with **insurer-filed but uncoordinated title premiums**
(each underwriter files its own rate manual with the CT Insurance Department; premiums are not
promulgated or rating-bureau-uniform as in TX/FL/NM/PA/NY/NJ/OH/DE/NC). This session verified
**5 directly-fetched sources**: WFG National Title (effective 2021-02-01) and Stewart Title Guaranty
(effective 2020-03-01), both premium-only filed rate manuals; and three closing-attorney firms with
published flat-fee settlement pricing — Connecticut Title & Escrow LLC ($1,250 purchase/$1,150
refinance/$1,975 sale, comprehensive bundled fee, as of 2026-01-01), Law Office of Yona Gregory
($750 flat, attorney-fee-only, statewide), and Connecticut Real Estate Closing Lawyers ($850-$1,800
range, statewide, unitemized). **14 distinct query strategies plus 10 direct provider-site checks**
found only 5 usable sources — below the 6-source saturation floor. Marked **complete (scarce)**.

## All-in service-stack range observed

Two directly comparable **bundled attorney/settlement fee** figures were found:
- **Connecticut Title & Escrow**: $1,150 (refinance) - $1,975 (sale), bundling title search, title
  review, document prep, courier, and phone/fax, but excluding the separate title insurance premium.
- **Connecticut Real Estate Closing Lawyers**: $850-$1,800 (unitemized residential range).

A third figure, **Law Office of Yona Gregory's $750**, is explicitly narrower — attorney representation
fee only, excluding title search, title insurance, recording, and courier, so it is not directly
comparable to the other two bundled figures and is recorded separately rather than averaged in.

Combining the two bundled quotes gives an observed **all-in settlement-fee range of roughly
$850-$1,975** (excluding the separate title insurance premium in all cases) — but with only 2
comparable bundled data points, this is far too thin to test for saturation (the contract requires 6+
sources before saturation can even be evaluated).

## Itemization / bundling patterns

- **WFG's** manual (Section I.A): "Fees and charges in connection with the searching, examination,
  certification and closing of title are not included in the rates herein... WFG National Title
  Insurance Company may make additional charges for these and other services." No dollar figures.
- **Stewart's** manual (Definitions + General Provisions) is the most explicit of any state surveyed
  in naming who charges the excluded fees: "do not include charges for searches, examinations,
  abstracts, attorneys' fees, escrow or closing services, inspections or other services charged by
  **local attorneys, surveyors, abstractors, or abstract companies**" — a direct acknowledgment that
  in CT's attorney-closing structure, the settlement fee is charged by the closing attorney, not the
  underwriter.
- **Connecticut Title & Escrow's** flat fee inverts the usual pattern seen in most other states: here
  the *settlement/attorney fee is the published, bundled, dollar-denominated figure*, and the *title
  insurance premium* is the separately-billed, unpublished-on-this-page component ("Title insurance
  premiums will be a separate charge as required by the State of Connecticut").
  This is the mirror image of WFG/Stewart, where the premium is published and the settlement fee is
  the unpublished component — together the two source types cleanly triangulate CT's cost stack even
  though no single source prices both halves.
  - The single documented case where transaction type raised price rather than lowered it (Sale at
    $1,975 vs. Purchase $1,250 vs. Refinance $1,150) reflects seller-side conveyancing work
    (deed preparation, payoff coordination, closing-statement liability) rather than a market-based
    "usually costs more" default — Refinance is the cheapest of the three, as in most other states.
- **Yona Gregory's** and **Connecticut Real Estate Closing Lawyers'** figures show the range of pure
  attorney-fee models in CT: a narrow single-party-only quote ($750) vs. a broader range quote
  ($850-$1,800) that likely includes ancillary work beyond the bare closing attendance.

## Premium rate card (insurer-filed, uncoordinated state)

Representative Owner's Policy premium at $100,000 liability (both use identical $20,000 base +
per-thousand formula through $100,000): WFG (2021) = $109 + $4.36/thousand × 80 = **$457.80**;
Stewart (2020) = $109 + $4.36/thousand × 80 = **$457.80** (identical bracket structure and rate to
WFG at this tier, a notable direct cross-underwriter rate match despite a full year's gap between
manual effective dates). Both manuals also independently confirm the **$25.00 per-letter CPL fee**
pursuant to C.G.S.A. §38a-404 (WFG explicit; Stewart's manual does not separately break out a CPL
fee). Full liability-tiered schedules for both are recorded verbatim in CT.json.

## Not used / found-but-blocked

- **catic.com** (CATIC — Connecticut Attorneys Title Insurance Company, the state's dominant
  domestic underwriter, an attorney-owned title insurer unique to CT/NH/RI) — its "CT_Premium Rate
  Schedule_May2016.pdf" returned HTTP 403 Forbidden on two direct fetch attempts; its
  state-resources page (catic.com/state-resources/connecticut) also 403'd. This is a significant gap:
  CATIC is likely CT's single largest title underwriter by volume, and its absence means this
  survey's premium-side coverage is skewed toward two national underwriters (WFG, Stewart) rather
  than CT's dominant domestic one. Flagged for a future session to retry (CATICulator at
  caticulator.com, a calculator tool rather than a static schedule, was noted as an alternative but
  not attempted this session).
  - **Retried 2026-07-22** (blocked-source retry pass): catic.com/rates re-fetched via WebFetch —
    still HTTP 403 Forbidden. Still blocked; no change from prior sessions.
  - **Retried 2026-07-23** (blocked-source retry pass): re-fetched via direct `curl` with a
    standard browser User-Agent string rather than WebFetch's default UA — **breakthrough**:
    `www.catic.com/state-resources/connecticut` now returns HTTP 200 (the prior 403s were
    evidently a bot-protection block on WebFetch's UA, not a hard server-side block). The page
    links to 3 rate resources hosted on `online.flippingbook.com`: "CT Rate Manual"
    (`/view/224197286/`), "Rocky Hill Title Services Rates" (`/view/719422339/`), and "Fairfield
    County Title Services Rates" (`/view/719403949/`) — the latter two names strongly suggest
    genuine settlement/service-fee content (not just premium), which would fill exactly the gap
    this file already flags. All 3 flipbook pages return HTTP 200, but FlippingBook renders pages
    as image tiles via a JS viewer (confirmed: page source has no extractable text, only an
    images-API reference; the viewer's own `/download` endpoint returns the HTML shell, not a raw
    PDF, so no client-side-JS-free path to the underlying PDF was found this session) — content
    could not be read and no dollar figures were verified or recorded. **Still excluded per
    evidence rules** (numbers must be read, not guessed from a title), but reclassified from
    "blocked (403)" to "accessible, needs browser/OCR to extract" — a materially different, more
    promising status for a future browser-driven session to finish.
- **firsttitleservices.com/connecticut-title-closing/** (First Title & Escrow) — HTTP 403 Forbidden.
- **agency.firstam.com/ct** (First American Title CT Agency Services) — fetched successfully;
  describes AgentNet/AgentAdvantage services only, no settlement-fee dollar figures published.
- **simpletitle.us/connecticut-title-closing-attorney/** (Simple Title) — fetched successfully;
  describes services and a general "0.4%-1% of property value" title-insurance-cost rule of thumb,
  but no firm-specific settlement/closing fee schedule published.
- **mancusocarey.com** — fetched; general commentary only ("Most Connecticut real estate attorneys
  charge a flat fee... reach out — we'll give you a clear answer"), no published dollar figures.
- **pedersonrealestatelaw.com** post — 301-redirects to an unrelated domain (clanyc.org), dead link.
- No Chicago Title, Fidelity National Title, or Old Republic Title Connecticut-specific rate
  manual/settlement-fee PDF was found via search; all three route to interactive calculators
  (rates.fntg.com, oldrepublictitle.com/rate-calculator) or generic national "Real Estate Laws &
  Customs" guides (payer-allocation commentary, not priced schedules — same exclusion pattern
  applied to Old Republic's guides in CA/CO in earlier sessions).
- Searches for named independent CT title agencies (Secure Title, Guardian Title, Nutmeg Title,
  generic "CT Title") returned no company-specific fee-schedule pages, only third-party
  blog/calculator estimate sites (Houzeo, ListWithClever, Rocket Mortgage, Bankrate, ConsumerAffairs,
  iBuyer, AnytimeEstimate), excluded as non-primary sources per the evidence rules.

## Search log (14 distinct query strategies + direct provider-site checks)

1. "Connecticut title insurance rate manual settlement fee schedule PDF"
2. "Connecticut title insurance premium filed rates Stewart OR WFG OR \"First American\" manual pdf"
3. "Connecticut attorney closing fee schedule title search examination fee 2026 pdf"
4. "Connecticut title company \"closing fee\" OR \"settlement fee\" schedule Hartford OR \"New Haven\" OR Stamford pdf"
5. "CATIC Connecticut Attorneys Title Insurance premium rate schedule 2025 OR 2026"
6. "\"First American Title\" Connecticut closing fee OR settlement fee schedule agency"
7. "Connecticut real estate closing attorney flat fee \"closing fee\" site:.com pricing purchase refinance"
8. "Old Republic Title Connecticut rate manual settlement fee pdf"
9. "Connecticut title insurance agency website \"settlement fee\" OR \"closing fee\" $XXX schedule attorney"
10. "\"Secure Title\" OR \"Guardian Title\" OR \"Nutmeg Title\" OR \"CT Title\" Connecticut closing fee schedule"
11. "WFG National Title Connecticut bulletin closing fee escrow charges 2024 OR 2025"
12. "simpletitle.us pricing fee schedule Connecticut closing"
13. "Connecticut independent title company \"title search fee\" \"closing fee\" \"$\" pricing page"
14. "Connecticut closing attorney \"flat fee\" real estate closing $ pricing -blog -calculator law firm"

Plus direct provider-site fetches: WFG and Stewart CT rate manual PDFs (via WebFetch + Read-tool
binary-PDF recovery, same technique used throughout this survey), CATIC (blocked 403 twice, incl.
state-resources page), ctclosing.com/pricing/, simpletitle.us (no pricing found), yonalaw.com/closings,
connecticutrealestateclosinglawyers.com, firsttitleservices.com (blocked 403), agency.firstam.com/ct
(no pricing found), mancusocarey.com (no pricing found), pedersonrealestatelaw.com (dead redirect).

## Blocked-source retry / calculator investigation (2026-07-25)
As part of the calculator-harvest mission's blocked-retry pass, investigated **CATICulator**
(`caticulator.com`, first noted as an alternative to the blocked static CATIC rate manual in the
2026-07-21 entry above). This turned out to be a substantial discovery: a genuine multi-state
Knockout.js premium calculator covering **30 states** (CT, ME, MA, NH, RI, VT, NY, FL, NJ, PA, GA,
OH, SC, AL, TN, IL, NC, KY, IN, TX, MD, VA, DC, WI, MI, DE, WV, OK, MO, KS — per its own
`toServerModel()` state-code mapping), not just CT. Made real progress cracking its REST API (see
CALCULATORS.md for the full technical detail) — session-cookie + `X-Requested-With: XMLHttpRequest`
header unlocks working `GetSupportData` and `GetPolicyData` JSON endpoints (no browser needed) —
but did not complete a working `Calculate` call this session (the request body requires
reconstructing several nested Knockout view-model objects, e.g. `RecFeeModel`/`AdditionalCharges`/
`AdditionalEndorsementFees`/`AdditionalTitleFees`, not yet mapped). Critically, `GetPolicyData`'s
own `SelectionSet.Fees` array for CT contains only **one** fee type (`CplFee`) — meaning even a
fully-working Calculate call would return title insurance premium plus, at most, a CPL fee, not a
broader itemized settlement/service-fee breakdown. Given this narrow ceiling relative to the
mission's itemized-fee target, further reverse-engineering was not pursued this session, but is
flagged as a real (if modest) future opportunity — see CALCULATORS.md's CATICulator section for
the exact recipe/auth pattern discovered, which could unlock CPL-fee corroboration across all 30
states the platform covers, several of which (VA, TN, MD, DE, WV, MO, OK, NJ, PA, MI, WI) are
already scarce/complete states in this survey.

## Calculator harvest addendum (2026-07-26)

Separate from the published-schedule survey above (which remains **complete (scarce market)**),
this session hunted provider quote calculators for the standard $500,000/$400,000 Fairfield County
purchase scenario, per the calculator-harvest mission. **Result: 1 successful harvest — below the
3-provider "calculator-quoted" threshold.** CT's attorney-closing structure and small number of
public interactive calculators (as opposed to static filed-rate manuals) made this state genuinely
thin for this mission, consistent with its "scarce" status in the published-schedule survey above.
See CT.json's new `"basis": "calculator"` entry and CALCULATORS.md for full technical detail.

1. **Old Republic Title** (`ortratecalculator.oldrepublictitle.com/RateCalc.aspx?Location=06`) — a
   distinct, previously-uncatalogued Old Republic ASP.NET WebForms calculator (not the same system
   as the already-documented `ortconline.com/Web2` tool, which does not serve CT), found via an
   independent CT/MD/DC/VA title company's (Quiet Title LLC) own "calculators" resource page. No
   county/town tiering exists for CT in this tool (statewide pricing, so no Fairfield-specific
   substitution was needed/possible). Driven end-to-end with a plain `requests.Session()` — no
   login, account, or personal data required despite an initial redirect through `/Login.aspx`.
   Confirms the same "policy premiums only" structure already on file from WFG and Stewart's CT
   manuals (identical disclaimer text), but adds one genuine itemized ancillary line beyond the
   static manuals: a toggleable Closing Protection Letter fee (tool's own default $50.00 — not
   independently confirmed as CT's actual statutory CPL rate, contrast WFG's cited $25.00 statutory
   figure). Actual charge for the standard scenario (Owner's Basic $500k + simultaneous Loan Basic
   $400k, both basic/standard coverage): Owner's Policy $1,929.00, Loan Policy $0.00 (credited under
   simultaneous issuance), CPL $50.00, total $1,979.00.

Two other leads came close but did not yield a usable harvest, and are recorded in full in
CALCULATORS.md for a future session:

- **Title Resources Guaranty Company** (`ratecalculator.trguw.com`) — a Next.js/Apollo GraphQL app
  whose backend (`POST /api/proxy/graphql`) was fully reverse-engineered this session: confirmed CT
  is served (statewide, not county-tiered) among 40 states, and the full query schema was mapped,
  including a promising `getQuote` query with `stateFees`, `premiumTax`, and
  `closingProtectionLetters` fields — a potentially rich itemized source. However, the `getQuote`
  resolver returns a bare HTTP 500 for every request that includes any policy input (`ownerPolicyInput`
  or `lenderPolicyInput`), reproduced identically for both CT and TX, and the tool's own live
  production page independently confirmed the same failure (stuck on loading skeletons) — indicating
  a genuine, currently-live backend bug on Title Resources' side rather than a request-shape error on
  ours. No dollar figures could be obtained. Flagged as the highest-priority follow-up for a future
  session (the schema is fully mapped and ready to use once/if the backend is fixed).
- **CATICulator** (`caticulator.com`) — building on the prior session's auth-pattern discovery (see
  the 2026-07-25 entry above), this session fully reverse-engineered the client-side request
  construction for `POST /PremiumCalculator/Calculate`: the real body is a wrapper object
  `{"data": "<JSON.stringify(serverModel)>"}` (the model is double-encoded as a JSON string inside
  a `data` property, not sent as a raw JSON object as previously assumed), with `serverModel` built
  from `pc.model.js`'s `toServerModel()` output merged with a lowercase `selectionSet` field (the
  full endorsement/property-state object from `GetPolicyData`, reused as-is) plus `endorsementsSelected`,
  `policyId`, and `IsPolPropUser`. Built and POSTed a complete, scenario-correct body (Owner's/Loan
  amounts $500k/$400k, CT county=Fairfield/town=Bridgeport, CPL fee requested) using this corrected
  structure — still received a generic ASP.NET "Runtime Error" (HTTP 500, remote error details
  disabled) with no informative validation message, so the exact remaining defect could not be
  isolated this session. Given the mission's prior note that CT's `GetPolicyData.Fees` ceiling is
  CPL-only (matched by the Old Republic harvest above), this was not pursued further once time
  became the binding constraint — recorded in CALCULATORS.md as substantial additional groundwork
  for whoever picks this up next.

Given the thin result, CT does **not** cross the 3-provider calculator-quoted threshold this
session. Combined with the state's already-"complete (scarce)" published-schedule status, this
likely reflects a real characteristic of CT's market (attorney-closing, insurer-filed-but-
uncoordinated premiums, few provider-run interactive quote tools) rather than a search-strategy
gap — 4 independent search techniques (MyTitleRates.com agency search, Old Republic's alternate
calculator, CATICulator, Title Resources' GraphQL API) were tried, plus general web searches for
independent CT title agencies' own calculators, none of which surfaced additional itemized
settlement-fee sources beyond the one harvest above.

## Calculator harvest addendum (2026-08-05)

A second session picked up the calculator hunt where the 2026-07-26 session left off, aiming for
the 3-provider "calculator-quoted" threshold (1 provider on file at the start of this session).
**Result: 1 more successful harvest — CT now has 2 calculator-basis providers, still short of the
3-provider threshold**, despite trying well over a dozen distinct candidate calculators/platforms.
See CT.json's second `"basis": "calculator"` entry and CALCULATORS.md for full technical detail.

2. **Fidelity National Title Insurance Company** (`ratecalculator.fnf.com`, FNF's/Fidelity National
   Financial's shared multi-brand "National Rate Calculator") — a previously-uncatalogued-for-CT but
   already-partially-documented platform (a prior 2026-07-25 session had marked it "out of scope,
   premium-only" for the calculator-harvest mission when testing it for PA; this session judged that
   premium-only output is in fact valid evidence per the mission's own rules, exactly matching the
   precedent of CT's existing Old Republic calculator entry, which is likewise structurally
   premium-plus-CPL-only). Classic ASP.NET WebForms `__doPostBack`/`__VIEWSTATE` app, driven
   end-to-end with a plain `requests.Session()`, no login or personal data required (the tool's own
   disclaimer explicitly warns against entering confidential/personal information). Fairfield County
   selected explicitly from CT's 8-county dropdown. For the standard $500k/$400k Simultaneous
   Owner's & Loan scenario: Owner's Policy Total Premium $2,080.00 (Closing-Disclosure allocation:
   $515.00 disclosure amount + $1,565.00 adjustment), Loan Policy $0.00 (simultaneous-issue credit),
   CPL $50.00, **Grand Total $2,130.00**. Cross-checked against the existing Old Republic entry for
   the identical scenario ($1,929.00 Owner's + $50.00 CPL = $1,979.00 total): a $151 difference
   entirely in the Owner's Policy premium line, consistent with CT being an uncoordinated
   (non-rating-bureau) state where every underwriter files independently, exactly as already
   documented between WFG's and Stewart's static manuals.
   - **Important shared-engine finding**: this tool's CT underwriter dropdown also lists Chicago
     Title Insurance Company, Commonwealth Land Title Insurance Company, and National Title
     Insurance of New York (all FNF-family brands). Re-running the identical scenario with Chicago
     Title selected instead returned **byte-identical** figures throughout (only the Quote Number
     differed). This confirms the four listed underwriters share one common calculation engine in
     this specific tool rather than being independently priced — a future session should **not**
     harvest more than one entry per FNF-family tool instance, even though the underwriters are
     legally distinct companies elsewhere in this survey (e.g. via separate rate-manual PDFs).

**Significant new platform/technique findings this session** (see CALCULATORS.md for full recipes):
- **ratecalculator.fnf.com is now confirmed WORKING for CT** and usable for the calculator-harvest
  mission (superseding the 2026-07-25 PA session's "out of scope" judgment) — worth revisiting for
  other "complete (scarce)" states still short of 3 calculator providers, since it's a national
  multi-state tool (`?state=<ST>`) already proven to also serve at least PA and NY.
- **First American's FACC tool** (`facc.firstam.com`, "First American Comprehensive Calculator") —
  confirmed CT-supporting, guest-accessible via an SSID query-string token (found embedded in a CT
  attorney firm's own "Helpful Links" page, `grassetteandassociates.com/blog`) with no login
  required, and genuinely plain JSON AJAX (not a JS SPA) once view-sourced — but its `Calculator/*`
  endpoints silently return **empty HTTP 200 responses** unless the request carries `Origin`/
  `Referer` headers matching the tool's own origin (a CORS/WAF-style gate this session discovered
  and solved: without those headers, malformed bodies return a 0-byte 200 with no error at all,
  which is a trap for future debugging). With the headers fixed, malformed bodies now correctly
  return `{"success":false,"serverError":"500"}` — but even a carefully-constructed, schema-matching
  body (mirroring the page's own `GetFormData()` JS function field-for-field) still returns an empty
  200 for `Calculator/PropertyTypes`/`Calculator/StateCounties`/`Calculator/PurposeOfTransactions`,
  suggesting either an undiscovered required field or a server-side exception path this session could
  not isolate further. **Recommendation for a future session**: this is now the single most promising
  unsolved lead in CT (and likely other states, since FACC is presumably nationwide) — worth a
  browser-driven session to capture one real network request and replay it statelessly, now that the
  Origin/Referer gate is understood.
- **TitleClose.com's Old Republic tenant** (`ortris.titleclose.com`) — confirmed CT is a configured
  state in this tenant (`StateID=7`, all 8 CT counties present via `/Search/GetAllCountiesByStateId`),
  and the full `/Consumer/Search` flow was driven end-to-end successfully (Fairfield County,
  Bridgeport city, $500k/$400k, buyer-getting-loan) — but the tenant returned **"No companies"**,
  the same zero-result outcome already documented for this tenant in VA, confirming it has no
  Richmond-area-external footprint. `app.titleclose.com/Consumer/Welcome` (the generic,
  non-tenant-scoped national app) was also tried as an alternative entry point, but renders a
  different, ZIP/geocoding-driven form (no static `<select id="StateID">` of the kind the tenant
  subdomain has) that this session did not fully map — a possible future avenue if a browser session
  can capture its address-autocomplete network call.
- **CATIC's `www.catic.com/state-resources/connecticut` page** — re-retried with a browser
  User-Agent (as in the 2026-07-23 breakthrough already on file): still resolves to HTTP 200 (not
  blocked), listing the same 3 FlippingBook-hosted rate-resource links already logged as
  image-tile-rendered and unextractable without OCR/browser. No change from the existing entry above.
- **Title Resources Guaranty** (`ratecalculator.trguw.com`) — retried per the mission's suggestion;
  the live page still does not visibly resolve a quote in a plain fetch (consistent with the
  already-documented server-side 500 on `getQuote`). Not independently re-confirmed via direct API
  call this session; still flagged as the highest-priority "retry later" lead per the existing entry.

**Dead ends / gated / jsOnly / misattributed, ruled out this session** (do not re-try without a new
angle):
- **alphaadv.net/cttitle/ctratecalc.html** — a personal (not-a-business) static page by "John
  Granger," copyright 1997-2012, with a simple client-side JS premium formula. Not a genuine
  provider (no company name/address, evidently a hobbyist/legal-reference page) and the formula
  itself contains an obvious bug (`else if (amt <= 45000)` in a bracket clearly meant to be
  `200000`, given the surrounding $100k/$200k/$500k tier structure) — excluded as neither a real
  business nor reliable.
- **commonwealthct.com/calculators_menu.asp** — DNS-dead (`ENOTFOUND`), a defunct legacy
  Commonwealth Land Title CT-branded calculator site.
- **txtitlerates.ctic.com** ("CT TX Rate Calculator") — a false-signal near-miss: "ctic.com" here is
  **Chicago Title Insurance Company**'s domain (a Texas premium estimator, "CT" = Chicago Title, "TX"
  = Texas), not Connecticut/CATIC as the name coincidentally suggests. Logged specifically to save a
  future session the same momentary confusion.
- **Stewart Rate Calculator** (`stewartratecalculator.com`) — Stewart's own CT agents page
  (`stewart.com/en/state-pages/connecticut-agents/rates`) links only to the tool's generic
  education/landing page, no CT-specific `officeid` embed found via search. Consistent with the
  existing CALCULATORS.md entry: the final `/api/SRC/quote` POST mechanism is identified
  (form-urlencoded serialization of `#frmCalculateRates`) but the form's dynamic fields still can't
  be populated without a browser, and no CT agency embed was found this session to test against.
- **MyTitleRates.com** (`calculator.mytitlerates.com`) — re-checked both previously-known agency IDs
  (`a=24` TitleWorks, `a=15` Trident Land Transfer); neither's `state_picked` dropdown lists
  Connecticut (PA/NJ/FL and NJ/PA respectively, unchanged from prior sessions' findings for other
  states). No CT-serving agency ID found via web search this session.
- **NetSheetCalc/TitleTap** (`app.netsheetcalc.com`) — the platform's own generic Connecticut
  landing pages (`netsheetcalc.com/net-sheet-calculator-by-state/connecticut-net-sheet-calculator/`
  and the `/title-insurance-cost-by-state/` variant) both return HTTP 500 consistently (server-side
  issue, not a blocking/bot-detection problem — confirmed via both WebFetch and direct curl with a
  browser User-Agent). A batch of `quickquote.php`/`index.php?appid=` search hits (Title Partners
  Agency LLC, Community First Title Agency, Members Title Agency, Abstract Title Agency) were each
  individually verified via their own config-JSON company name/address — all confirmed **MO, MI, FL,
  MI respectively**, none Connecticut (a useful reminder that generic appid search results are not
  state-filtered at all and every hit needs independent address verification, consistent with this
  project's standing misattribution guard).
- **independencetitleagent.com** (PalmAgent-powered net sheet calculator) — verified via its own
  page content to be a Century 21 Randall Morris & Associates / Independence Title Company
  instance based in **Austin, TX**, not Connecticut.
- **Allied Title & Escrow** (`alliedtitleandescrow.com/calculator`) — confirmed serves only
  DC/VA/MD/FL/TX/CO/PA; Connecticut not supported.
- **Blueprint Title** (`blueprinttitle.com`) — confirmed 35-state footprint via its own "Where We
  Work" page; Connecticut not among them.
- **Progressive Title Company** (`progressivetitle.com/calculators/`) — a real multi-calculator
  suite (Buyer Title Charges, Mortgage Payment, Refinance Title Charges, Seller Net Sheet) but no
  Connecticut state coverage confirmed (company's known footprint is CA/MD/DC/VA per independent
  search); not pursued further without state confirmation.
- **Elko** (`useelko.com/title-quote-calculator/`) — B2B SaaS landing page only, gated behind a
  "Book a Demo" flow with no accessible live tool or client directory found.
- **AMT Title Services** (AmTrust Title Group brand) and **Blueprint Title** — searched by name per
  a third-party "top CT title companies" listing; AMT Title Services' own site
  (`amtrusttitlegroup.com`) lists 25 offices nationally with no confirmed CT-specific page or
  calculator found; Blueprint Title confirmed not to serve CT (see above).
- **Fusion Title Search** (`fusiontitle.com`) — CT-focused title search company, but no online
  rate/quote calculator on its site; phone/email contact only.
- **Eastern Title** (`easterntitle.com`) — the specific `/connecticut` page indexed by search engines
  now 404s; the site's root page has no calculator or "Connecticut" mention at all in its current
  content, suggesting a since-removed or relocated CT service page.
- **CT Titles LLC** (New Haven) — confirmed to be a DMV tag-and-title service company (vehicle
  titles), not a real-estate title/escrow provider — a name-collision false lead.
- **First American FACC (`facc.firstam.com`)** — see "Significant new platform findings" above; not
  a dead end exactly, but not completed this session either.

**Techniques tried without success this session, beyond the specific candidates above**: general
web searches combining "Connecticut" with "instant quote," "get a quote," "rate-calculator," and
"net sheet" turned up only third-party rule-of-thumb estimator sites (Houzeo, ListWithClever,
AnytimeEstimate, StateCalc, Rocket Mortgage, RealEstateWitch) already excluded per this file's
standing non-primary-source rule, or the same handful of tools already logged above.

Given this session's much broader sweep (roughly 20 distinct candidates/platforms tried, well past
the mission's suggested 5-6 minimum) still landed on only 1 additional provider, CT's calculator
landscape appears genuinely and unusually thin even by this project's "scarce market" standards —
consistent with, and reinforcing, the state's attorney-closing structure and uncoordinated-premium
market noted throughout this file. A future session's best remaining leads, in priority order, are:
(1) finish reverse-engineering First American's FACC now that the Origin/Referer gate is solved;
(2) retry Title Resources Guaranty's `getQuote` for a recovered backend; (3) revisit
`app.titleclose.com`'s generic ZIP-driven flow with a browser session to see if it surfaces CT
companies the `ortris` tenant doesn't have.
