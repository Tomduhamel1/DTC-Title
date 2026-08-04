# Colorado — Market Fee Evidence

## Status: complete (scarce) — 4 verified sources, 2026-07-21

Colorado does not meet the target (10) or saturation (6+) bar, but meets the contract's
**scarce** completion criterion: an exhaustive search across two sessions — combining the
6 dead-end candidates logged below with this session's 9 additional distinct query
strategies and direct provider-site checks (15+ total) — consistently surfaces Colorado
title/settlement companies that either (a) explicitly decline to publish fee figures
publicly, requiring direct contact or an interactive quote tool (Title Company of the
Rockies, Northwest Title Company, Central Colorado Title, Land Title Guarantee Company),
(b) link to rate-sheet PDFs that could not be located or resolved (Advanced Title
Company, Fidelity National Title of Colorado), or (c) publish only a customary
payer-allocation table, not priced figures (Chicago Title of Colorado — confirmed this
session, same pattern as Old Republic in CA). This is consistent with Colorado's
regulatory structure: settlement/closing fees are filed directly and privately with the
Colorado Division of Insurance rather than published on public rate cards as a matter of
routine, and the DOI's own consumer-facing fee-sheet page returned HTTP 403 both times it
was checked (this session and prior). 4 verified sources with real dollar figures is the
practical ceiling reachable from public web sources at this time. Marked **complete
(scarce)**.

## All-in service-stack range observed

Across the three settlement-agent (non-underwriter) sources with real closing/settlement
dollar figures — Empire Title (Stewart, El Paso/Teller Counties), Warranty Title (Colorado
Springs), and Homestead Title & Escrow (Denver-metro counties) — the base residential
real estate closing/settlement fee for a standard resale ranges roughly **$285–$420** in
Denver-metro/premium counties and **$200–$360** in non-metro counties, with For-Sale-By-Owner
transactions running noticeably higher ($325–$550+ per these sources). Loan/refinance closing
fees run a similar **$250–$550** range depending on lender/loan type and county tier.

## Itemization / bundling patterns

All three settlement-agent sources itemize ancillary charges separately from the base fee by
default — wire ($25 in two sources), courier ($30 Warranty Title; "1 included" in Empire
Title's bundle), e-recording/e-filing ($8–$43/document), tax certificate ($35–$40), cashier's
check ($25) — but Empire Title and Warranty Title also each sell an explicit "bundled"
closing-fee product that folds wire, courier, tax certificate, e-recording/e-doc, and
mail/cashier's-check fees into one flat number (Empire Title: $360/$550 realtor-directed/FSBO;
Warranty Title: $390 bundled loan package, premium counties only). Homestead Title keeps its
fees fully unbundled/itemized. None of the three settlement agents publicly itemize doc-prep
as a distinct consumer line beyond a small "mail-out preparation" charge (Empire, $30) or fold
it silently into the closing fee.

## Premium rate card (filed-rate state)

The WFG National Title Insurance Company rate manual (filed effective 2026-01-15) confirms
Colorado's structure directly: title insurance **premium** is a filed-rate, underwriter-set
number (by county zone, tiered to policy amount) that by rule *excludes* escrow/settlement/
closing charges, document prep, and disbursement fees — those are filed and charged separately
by the settlement/closing agent (title company). WFG's manual also confirms a standard $25
Closing Protection Letter (CPL) fee (waived if the deal doesn't close), and shows Colorado's
zone-based premium minimums ($600–$900 minimum owner's policy premium depending on zone).
This separates the two "filed" price components in CO: underwriter premium (WFG manual) vs.
agency closing/settlement fee (Empire, Warranty, Homestead).

## Sources found but not usable / partially blocked

- **Land Title Guarantee Company (LTGC)** — a major CO underwriter/agency — has no static
  public fee-schedule PDF; only an interactive rate-quote portal requiring transaction inputs.
- **Colorado Division of Insurance** (doi.colorado.gov/insurance-products/title-insurance) —
  returned HTTP 403 Forbidden; confirmed via search snippets that DOI hosts filed "Agency Fee
  Sheet for Consumers" disclosures but content could not be independently verified.
- **Fidelity National Title Company of Colorado** (jimcfidelity.com/Title-Rates) — DNS
  resolution failure, could not fetch.
- **Central Colorado Title** (centralcoloradotitle.com) — page loads but explicitly does not
  publish itemized numbers publicly; states fees are itemized only at quote time.
- **Advanced Title Company** — confirmed real CO title company with county-specific rate-sheet
  PDFs, but none surfaced with current, fetchable dollar figures (one located PDF was dated
  2021 and excluded as stale).
- `comparetitlecompanies.com/education/savings.php` — a third-party aggregator (dated
  2025-09-23) shows Denver-metro "Real Estate Closing Fee" ranging $300–$700 (broker vs. FSBO)
  and refinance closing fees $200–$475 across 15 compared companies, but doesn't attribute
  figures to individually named companies, so not included as a standalone provider record —
  useful as corroborating market-range context only.

## Additional search this session (2026-07-21) — confirms scarce

- **Colorado Division of Insurance** (`doi.colorado.gov/insurance-products/title-insurance`)
  — retried; still HTTP 403 Forbidden. Consumer-facing "Agency Fee Sheet" filings remain
  unreachable.
- **Title Company of the Rockies** (`titlecorockies.com`) — fetched; page explicitly states
  fee schedules are filed with the CO Division of Insurance and "available for inspection
  by the public" upon request, but publishes no dollar figures on the public site.
- **Northwest Title Company** (`nwtitlecompany.com`) — same pattern; no public dollar figures.
- **Chicago Title of Colorado** "Closing Costs — Who pays what in Colorado" PDF (fetched and
  read via the WebFetch-then-Read binary-recovery technique) — confirmed to be a
  customary-payer-allocation table (37 line items × buyer/seller/split/prorate by loan
  type), structurally identical to Old Republic's CA "Guide to Closing Costs" — not a
  priced fee schedule, excluded per evidence rules.
- **Advanced Title Company** (`advancedtitleco.com`) — main site and its linked
  `/purchase-rates/` and `/refi-rates-2/` pages fetched; both link to further PDF rate
  sheets that were not directly resolvable from the page content provided, so remain
  unverified this session.
- **Land Title Guarantee Company** — reconfirmed no static public fee-schedule PDF exists;
  only an interactive rate calculator and a page describing "how title companies set
  rates" in general terms, no CO-specific dollar figures.
- Queries run this session: "Colorado title company closing fee schedule pdf 2025 2026
  settlement fee OR closing fee", "Land Title Guarantee Company Colorado fee schedule pdf
  published rates", "Chicago Title Colorado closing fee schedule rates pdf", "Colorado
  title company closing fee $ site:.com filetype:pdf rate sheet" — 4 new search
  strategies, plus 5 new direct provider-site fetches, on top of the prior session's 6
  logged dead ends — combined total comfortably exceeds the contract's 8-strategy scarce
  threshold.

## Calculator harvest (2026-07-28 session)

Colorado had **zero calculator-basis providers on file** entering this session, flagged in
PROGRESS.md as a high-priority target since `comparetitlecompanies.com`'s own consumer-facing
root domain markets directly to Colorado. This session confirmed and harvested it:

- **comparetitlecompanies.com/get_quote/get_quote.php?id=1** — a plain server-rendered PHP
  2-step wizard (no JS/browser needed), distinct from the already-documented per-agency
  `getquote.php?title_co_id=<id>` embed (used for AZ). This `id=1` entry point is
  comparetitlecompanies.com's own Colorado-branded multi-company **comparison** tool: one
  standard-scenario submission returns every title company licensed in the chosen county at
  once. Only companies that subscribe to the platform ("TRAC-subscribing") show a "View
  Details" link with a full itemized buyer/seller breakdown; the remaining (majority)
  non-subscribing companies show only a DOI-filed-rate aggregate total with no itemization —
  explicitly out of scope for calculator-basis evidence per the tool's own footnote.
- **Provider found**: First Integrity Title Company (Denver, CO; underwriter Westcor Land
  Title Insurance Company) — the platform's only Colorado-subscribing agency, confirmed
  identical across every county checked (Denver, Jefferson, Arapahoe, Douglas). El Paso
  County (CO's nominally most populous) had zero subscribing companies, so Denver County was
  substituted per the task's fallback allowance. Boulder, Larimer, Pueblo, Weld, and Mesa
  Counties also returned zero subscribing companies — this appears to be the platform's only
  active CO subscriber statewide, not a coverage gap in this session's search.
- Standard scenario ($500k purchase / $400k loan, Denver County) returned: Buyer Total
  $1,155.00 (Closing Fee $180 + 1st Loan Closing Fee $450 + Buyer's CPL $25 + Lender's CPL
  $25 + Loan Policy premium $450, plus government recording $86 and transfer tax $50 shown
  separately); Seller Total $2,301.00 (Owner's Title Insurance $2,001 + OEC $95 + Seller's
  CPL $25 + Closing Fee $180). See `CO.json` for the full itemized record.
- **Near-miss, not solved**: Advanced Title Company's (`advancedtitleco.com/rate-calculator/`)
  own site embeds a branded Stewart Rate Calculator instance
  (`stewartratecalculator.com/?branded=false&officeid=2f33fe38-a50a-431a-9d84-cad7dd329fcf`).
  Confirmed this session (correcting the prior session's guess in CALCULATORS.md) that
  Stewart's final `/api/SRC/quote` endpoint is a **plain form-urlencoded POST** (jQuery
  `.serialize()` of `#frmCalculateRates`), not a hand-built JSON `quoteRequestRoot` object —
  but the form's actual input fields are rendered client-side via Knockout.js data-binding
  from a template, not present in the static HTML or reconstructable from the minified JS
  bundles via source inspection alone, so the exact POST field names remain unsolved. The
  `transactiontypes` and `propertysearch` lookup endpoints are confirmed working plain GETs
  (`?stateCode=CO&propertyType=Residential` and `?stateCode=CO&propertyType=Residential&value=<city>`
  respectively). Flagged in CALCULATORS.md for a browser-driven session to capture the real
  POST body via devtools network inspection.
- Below the 3-provider calculator-quoted threshold (1 of 3) — flagged for a future session to
  find 2 more distinct CO calculator providers (Stewart's officeid above, once solved, would
  be a 2nd; MyTitleRates.com/TitleClose.com/NetSheetCalc searches this session found no open
  "no sign-in needed" CO tenant).

## Sources

See `CO.json` for full structured records with source URLs.

## Calculator harvest addendum (2026-08-04) — no new provider found; one significant new platform discovered but jsOnly

Searched for CO's 2nd/3rd calculator provider. Found **Land Title Guarantee Company (LTGC)**,
Colorado's largest independent title company, whose `ltgc.com/resources/seller-net-sheets/` page
links to `portal.settlor.com/ltgc/rate-quote/create` — a previously-uncatalogued platform
("Settlor," `api.settlor.com` backend). The portal page is a Vite-built JS SPA shell with no
computation logic present in the initial bundle, and its `api.settlor.com/graphql` guess 404'd
(not necessarily the real path) — **jsOnly**, logged for the browser-driven follow-up queue; given
LTGC's market position this is a high-priority target for a future browser-driven session. Also
checked **Upward Title & Closing**'s CO/UT calculator page (`upwardtitle.com/colorado-utah-
calculators/`) and its AR/KY/IN-serving sibling page (`ar-ky.upwardtitle.com/calculators/`) — both
embed Title Resources Guaranty's "PowerSnap" Angular SPA (`mobile.trgc.com/powersnap/company/
UPWARDCO_*` and `UPWARDARKYIN_*` respectively), the same already-catalogued jsOnly platform found
independently this session for Burnet Title Wisconsin — confirmed no static API config
(`appConfig.json` and the Angular bundle itself carry no discoverable backend URL) — not a new
discovery, just further confirmation of this platform's breadth (now confirmed to cover CO, WI,
AR, KY, IN via various tenants, all jsOnly). CO remains at 1 of 3 calculator-basis providers.
**Recommendation**: PowerSnap (`mobile.trgc.com/powersnap`) and Settlor (`portal.settlor.com`) are
now confirmed high-value, multi-state, browser-only targets covering several of this survey's
still-below-threshold scarce states at once — worth prioritizing in the first browser-driven
session available, ahead of further plain-HTTP searching.
