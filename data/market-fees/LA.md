# Louisiana — Market Fee Evidence

## Status: complete (scarce market) — 1 verified source (rating bureau), 0 published settlement/service-fee schedules, 2026-07-22

Louisiana is a **rating-bureau-uniform** state for title insurance premiums, not merely
insurer-filed as originally assumed at the start of this session -- the Louisiana Title
Statistical Services Organization, Inc. (LATISSO) is a private rating organization
authorized by RS 22:1467/RS 22:1409.1 to make title insurance rate filings with the
Louisiana Department of Insurance on behalf of its members; membership is voluntary but
no properly-licensed title insurer may be denied membership, so LATISSO's manual
functions as a near-universal single source of truth for the state's premiums, similar
in kind to NCTIRB (NC) or OTIRB (OH) even though LA was not originally grouped with the
tier-3 rating-bureau states in this survey's priority list. Louisiana is also unique
among US states in using a civil-law notary system for real estate closings (an attorney
or licensed notary typically handles the act of sale), which the extensive search below
suggests correlates with an almost complete absence of publicly posted settlement-fee
schedules -- every independent title company and notary/closing-attorney site found
directs prospective clients to "request a quote" rather than publishing pricing. This
session verified **1 directly-fetched, richly-detailed rating-bureau rate manual**
(LATISSO, 06/01/2026 Edition, recovered via the Read-tool binary-PDF recovery technique
after WebFetch's markdown conversion failed on the FlateDecode-compressed PDF). **~12
distinct query strategies plus 10 direct provider-site checks** (Steeg Law [blocked by
anti-bot CAPTCHA], Southern Title, Grand Title, Baton Rouge Title, Crescent Title, DSLD
Title, louisiana-notary.org [server error], and others) found **zero published
settlement/escrow/notary-fee dollar figures** anywhere. Marked **complete (scarce)** --
well past the 8-strategy threshold with only 1 verified source, itself premium-only
(aside from a genuinely priced Closing Protection Coverage rate).

## All-in service-stack range observed

**None available.** The LATISSO manual contains no settlement, escrow, or notary-closing
service-fee dollar figure -- GP-3 explicitly states the rates exclude "title search,
title examination, closing, or escrow services performed by the Insurer or any of its
attorneys or agents." The only quasi-settlement charge found in this entire survey of
Louisiana is the LATISSO Closing Protection Coverage rate: a flat **$25 per transaction**
(Section 3), materially simpler than most other states' CPL structures (which typically
tier by party -- lender/buyer/seller). Secondary, non-verified web-search/blog snippets
repeatedly cited a $750-$975 "settlement fee" range and "1% of sales price" escrow fee
figures, and closing costs overall estimated at 2%-5% of purchase price, but no title
company, notary, or closing-attorney firm published a static, dated fee schedule
confirming any figure in that range this session -- all were excluded per the "fetched
and verified this session" rule.

## Itemization / bundling patterns

- **GP-3** (General Provisions): "The rates set forth herein do not include any charge
  made for title search, title examination, closing, or escrow services performed by the
  Insurer or any of its attorneys or agents. Similarly, corporate operating expenses and
  pre-tax profit provisions are excluded. Charges made for such services are in addition
  to the rates and charges set forth herein."
- **GP-4**: "Nothing herein shall be construed as indemnification against improper acts
  or omissions of a person with regard to escrow or settlement services" -- confirming
  the rating bureau's premium filing is legally distinct from, and silent on, whoever
  performs the actual closing/settlement function (typically a notary or attorney under
  Louisiana's civil-law system).
- Louisiana premiums are **not metro/parish-tiered** in the base rate tables; the only
  parish-level variation found in this survey's research (via a WFG bulletin pattern
  documented in other states, not independently re-verified for LA this session) would
  be a separately-published municipal/local premium tax, analogous to Kentucky's county
  premium tax structure.
- LATISSO's Closing Protection Coverage rate ($25 flat, any party) is simpler than every
  other state's CPL structure surveyed to date (which typically differentiate lender vs.
  buyer/borrower vs. seller, e.g. Stewart's Kentucky $50/$25/$25 tiering) -- a genuine,
  verified structural difference worth noting even though it is not itself a settlement
  fee.
- The 60% Reissue Credit (Owner's Policies, within 10 years) and 60% Substitution Credit
  (Loan Policies) are more generous than the typical 70%-of-original-rate refinance
  discount seen in filed-rate states like Kentucky, Alabama, and Georgia.

## Premium rate card (rating-bureau state)

LATISSO uses a per-$1,000-of-liability tiered structure with a **flat $100 minimum
premium** up to $12,000 of liability (lower than Kentucky's $200 or Alabama's $125
minimum, but Louisiana's minimum applies to a much smaller liability band before the
per-thousand rate begins). Representative Owner's Policy premium at $100,000 liability:
$100 (first $12,000) + $205.20 ($12,001-$50,000 @ $5.40/M × 38) + $240 ($50,001-$100,000
@ $4.80/M × 50) = $545.20. Loan Policy premium at the same liability: $100 + $159.60
($12,001-$50,000 @ $4.20/M) + $180 ($50,001-$100,000 @ $3.60/M) = $439.60. Full
liability-tiered schedules for Owner's, Homeowner's, Loan, and Expanded Loan policies,
reissue/substitution credits, mechanics'/materialmen's lien protection, simultaneous
issue, and the complete 109-item ALTA/LATISSO endorsement rate schedule are recorded
verbatim in LA.json.

## Calculator harvest (2026-07-30) — 0 providers found, extensively searched

Tried per the standing calculator-harvest priority (LA is ~4.6M population, the 3rd-highest-volume
"complete (scarce)" state with zero calculator-basis providers on file, after SC and AL). No
usable calculator found this session:
- **Southern Title** (`southerntitleonline.com/calculators/closing-costs`) — the strongest lead
  found (a genuine first-party, itemized, all-64-parish closing cost calculator) but is a Next.js/
  React SPA; the only discoverable backend endpoints (`/api/calculator-usage`,
  `/api/saved-calculations`, `/api/geocode`) are analytics/logging calls, not the fee-computation
  itself, which appears to run entirely client-side against data not found in any fetched JS
  chunk (parish millage tables likely load from a separate data source not identified this
  session). **jsOnly**, logged for the browser-driven follow-up queue.
- **Louisiana Title Services, Inc.** (`louisianatitle.com/premium-rate-calculator`) — HTTP 503 on
  every host/scheme variant tried (`http://`, `https://`, with/without `www.`), consistent across
  repeated attempts (also 503'd in the 2026-07-22 published-schedule session) — likely a standing
  server-side or bot-protection issue, not transient.
- **comparetitlecompanies.com/get_quote/netsheet.php?pid=29** (Ascendant Title, a multi-state
  national title company confirmed to have an LA branch per public filings) — a previously-
  uncatalogued TRACcalculator entry-point variant (`netsheet.php`, distinct from the already-
  documented `getquote.php`/`get_quote.php` variants), but this specific `pid=29` instance is
  hardcoded to Colorado (`var state_val = "CO"` in its own JS) — Ascendant's LA branch, if it has
  its own `pid`, was not located this session. Flagged for a future session: search for other
  `netsheet.php?pid=<n>` values or Ascendant's own site for an LA-specific embed.
- Also checked without success: Great American Title Company (confirmed Texas, not LA, despite
  surfacing in LA-targeted search results), Bayou Title, Grand Title, Legacy Title, Cypress Title,
  Central Title & Closing, Team Title (commercial-only calculator, out of scope), TitleClose.com
  (no LA tenant found), MyTitleRates.com (no LA agency found), NetSheetCalc/TitleTap (search
  results for LA cities returned only non-LA agencies, the same false-positive pattern seen in
  this session's SC search).
- LA's civil-law notary-closing structure (see below) likely explains the thin calculator coverage
  here, consistent with its already-scarce published-schedule survey.

### 2026-08-01 retry — still 0 providers, but a major new lead surfaced (jsOnly)
Retried per the standing recommendation (LA tied with SC as top priority). **Pulsar Title Insurance
Company** (`pulsartitleinsurance.com/rate-calculator`, servicing "the Mississippi Gulf Coast &
Louisiana" per its own footer) embeds a calculator built on a previously-uncatalogued platform,
"Modiphy Flux" (`flux.modiphy.com`), whose bundle's own US-map component shows coverage for LA, MS,
AL, FL, and TX. The actual quote-computation API call could not be pinned down via static analysis of
the 600KB+ minified Aurelia bundle (only a CSS-fetch URL is a literal string; the JSON/quote endpoint
is assembled from mangled variables at runtime) — logged **jsOnly**, see CALCULATORS.md's "2026-08-01
session" entry for full detail. This is now the single highest-priority browser-driven target for LA
(and MS) given its apparent multi-state reach. Also confirmed Old Republic's `Location=LA` parameter
is NoBot-blocked (matching the already-logged IN/SC block) and that Louisiana Title Services' premium
calculator has regressed from HTTP 503 to a full connection failure. No new NetSheetCalc/TitleTap, no
new TitleClose.com tenant, and no calculator found on Bayou Title, TitlePlus of LA, La Louisiane Title
Company, United Title of Louisiana, Cypress Title, or Legacy Title (all checked directly, all
Wix/Squarespace marketing sites with no calculator subpage).

## Not used / found-but-blocked

- **steeglaw.com/residential-real-estate/residential-closing-fees-purchaser/** (New
  Orleans law firm, page titled "Residential Closing Fees for Purchaser" -- a highly
  promising title) -- the hosting site returned an anti-bot CAPTCHA challenge (HTTP 202
  with `sg-captcha: challenge` header) on direct fetch, identical to the pattern seen on
  momentumclosings.com in the Kentucky research this session; no alternate mirror found.
  Excluded per the "fetched and verified this session" rule -- flagged as a notable
  coverage gap for a future retry given its specific, on-topic title.
- **louisiana-notary.org/notary-service-price-guide/** -- returned HTTP 500 Internal
  Server Error on two fetch attempts.
- **southerntitleonline.com** (closing cost calculator, both the tools-downloads and
  calculators paths) -- fetched; one path 404'd, the other returned only a percentage-
  range estimate (2%-5% of purchase price) with no itemized static dollar figures.
- **grandlawfirm.com/grand-title-real-estate-services/** (Grand Title Company) --
  fetched; "Contact us anytime to request a fee quote," no published figures.
- **crescenttitle.com/real-estate-closings** (New Orleans) -- fetched; describes the
  closing process and promises "line-by-line explanations" but publishes no dollar
  figures; directs to "order title online" for a customized estimate.
- **dsldtitle.com** (Baton Rouge/Covington/Lafayette) -- fetched; no pricing information,
  "Request Info" form only.
- **brtitle.com** (Baton Rouge Title Company) and **qtsnola.com** (Quality Title
  Services) surfaced in search but were not independently fetched this session given the
  strong, consistent quote-only pattern already confirmed across 6 other LA providers.
- No First American, Old Republic, Chicago Title, Fidelity National, or WFG
  Louisiana-specific settlement-fee schedule was found; all such underwriters in
  Louisiana operate under the single LATISSO rate manual rather than filing independent
  premium schedules (unlike Kentucky, Alabama, or Georgia), so no additional
  underwriter-specific premium source exists to log separately.

## Search log (~12 distinct query strategies + direct provider-site checks)

1. "Louisiana title insurance premium rate promulgated OR filed Department of Insurance"
2. "Louisiana title insurance settlement fee closing fee schedule attorney closing state"
3. "\"Louisiana Title Statistical Services Organization\" rate manual title insurance"
4. Direct fetch of the LATISSO rate manual PDF (via stewart.com's Louisiana microsite
   host, recovered via Read-tool binary-PDF technique after two failed WebFetch
   markdown-conversion attempts on different LATISSO PDF URLs, one of which 404'd)
5. "Louisiana notary title company \"closing fee\" OR \"settlement fee\" schedule New
   Orleans OR Baton Rouge pdf"
6. "Louisiana title company independent \"escrow fee\" OR \"closing fee\" published price
   sheet"
7. Direct fetch of louisiana-notary.org's notary service price guide (500 error, twice)
8. Direct fetch of Southern Title's closing cost calculator (two different URL paths)
9. Direct fetch of Grand Title Company's real estate services page
10. "\"Baton Rouge Title\" OR \"Crescent Title\" OR \"Louisiana Title Company\" real
    estate closing fee schedule dollar"
11. Direct fetch of Crescent Title's real estate closings page
12. Direct fetch of DSLD Title's homepage
13. Direct fetch (blocked, CAPTCHA) of Steeg Law's "Residential Closing Fees for
    Purchaser" page -- the single most promising unverified lead found this session

Plus general searches confirming LATISSO's regulatory status (RS 22:1467, RS 22:1409.1)
and identifying additional LATISSO rate manual editions (2020, 2022, 2024, 2025, 2026)
to confirm the 06/01/2026 edition fetched is current.

## Calculator harvest addendum (2026-08-06) — FNF national rate calculator

**1 of 3 calculator-basis providers** (prior: 0 — extensively searched across 2 sessions (2026-07-31, 2026-08-01), only jsOnly finds (Modiphy/Flux)). See LA.json's newest
`basis: "calculator"` entry for full itemized figures and methodology.

- **national FNF-family shared rate calculator** (`ratecalculator.fnf.com`) —
  WORKING. East Baton Rouge County (state param confirmed supported in the tool's own county dropdown).
  Driven via plain HTTP POST (Python `requests.Session()`, not WebFetch) replaying the classic
  `__doPostBack`/`__VIEWSTATE` ASP.NET WebForms flow already documented in this project's
  CALCULATORS.md and previously used for CT/CO/AR: select county + underwriter + Next → select
  "Property Purchase" transaction type (own postback) → enter Purchase Amount $500,000 and Loan
  Amount $400,000 together (own postback on the loan field, reveals any further conditional
  questions) → auto-answer any newly-revealed required Yes/No question with its first listed
  option → click Finish for the Rate Summary. Result at $500,000/East Baton Rouge County: **Grand Total
  $2,345.20**. No Loan Policy premium appeared anywhere in the flow despite the $400,000 loan
  amount entered (same behavior already documented for this tool's NV/AR entries) — recorded as-is.
  Premium-only output is valid calculator-harvest evidence per the 2026-08-05 CT-session scoping
  correction. LA's first calculator-basis provider. East Baton Rouge Parish (LA's most-populous parish) used per the standard scenario's most-populous-county rule, a deviation from prior published-schedule-survey searches that centered on Orleans/Jefferson.
