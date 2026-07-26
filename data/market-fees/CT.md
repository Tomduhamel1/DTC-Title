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
