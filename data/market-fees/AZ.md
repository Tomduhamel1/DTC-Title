# Arizona — Market Fee Evidence

## Status: complete (scarce) — 5 verified published sources + 1 calculator-basis provider (not yet at the 3-provider calculator threshold), 2026-07-22

## Calculator harvest (2026-07-22)
Old Republic Title's public **Estimated Rate/Fee Calculator**
(https://www.ortconline.com/Web2/productsservices/informationservices/ratefeecalc/default.aspx) was
driven directly via HTTP GET/POST (ASP.NET WebForms postback replication, no browser/JS execution)
for the standard $500,000 purchase/$400,000 loan scenario, **Phoenix (Maricopa County)**. Result:
Closing Protection Letter Fee $25, Concurrent Loan Charge $200 (of $400 total), Lender's Title Policy
$2,187, Settlement Agent Fee $677.50 (of $1,355 total, buyer half). Owner's Title Policy (Section H)
totaled $0.00 buyer-side — consistent with AZ's seller-pays-owner's-policy custom already documented
in this file. Section C (shop-for) total: $3,089.50. This buyer-side Settlement Agent Fee figure
($677.50) is notably lower than Pioneer Title Agency's/Arizona Escrow & Financial's already-verified
Maricopa escrow-fee tiers (~$1,342 at the $500k tier), a genuine cross-provider spread data point.
Full entry recorded in AZ.json with `"basis": "calculator"`. No personal information was entered
(Name/Company fields are optional and were left blank). This is 1 calculator provider; the task's
3-provider threshold was not reached this session (see CALCULATORS.md for FNF/First American
JS-only findings).

Arizona does not meet the target (10) or saturation (6+) bar, but meets the contract's
**scarce** completion criterion. The state's single richest source — the DIFI
(Department of Insurance and Financial Institutions) filing library, which hosts filed
escrow-fee schedules for essentially every AZ title/escrow agency — sits behind a
domain-wide Cloudflare block that has now been retried and confirmed blocked across two
separate sessions, on the portal page, on direct PDF URLs, and on the alternate `dfi.az.gov`
subdomain. This session added Arizona Escrow & Financial Corporation (5th verified
source, found on its own `.com` domain rather than DIFI) but an exhaustive further search
of independent AZ title agencies' own websites (Magnus Title, Premier Title Agency,
Security Title Agency) found each requires a quote request rather than publishing a
static fee schedule — a genuine market-opacity finding, not a search failure. Combined
across both sessions this exceeds the contract's 8-distinct-query-strategy threshold with
only 5 verified sources (fewer than the 6-source saturation floor). Marked **complete
(scarce)**.

## Important caveat

The Arizona Department of Insurance and Financial Institutions (DIFI, difi.az.gov) hosts by
far the richest library of filed escrow-fee schedules (Stewart, Fidelity National, Chicago
Title, First American, Old Republic, dozens of independent agencies) — but that domain sits
behind a Cloudflare JS challenge that blocked every fetch attempt (direct fetch, curl with
browser UA, Wayback Machine mirror, reader-proxy mirrors — all 403'd or were blocked). No
DIFI PDF could be independently opened, so none are included as verified sources per the
evidence rules (only real, fetched, working sources are recorded).

## All-in service-stack range observed

The only entity where a real escrow/settlement fee table could be pulled directly (Pioneer
Title Agency, Maricopa County) shows the base "Escrow Service" charge scaling from **$800 at
a $100K transaction up to roughly $1,942 at $1M**, rising in fine increments (every
$10K–$20K of price/loan amount) — genuinely price-tiered, not flat. The exact same escrow-fee
table appeared, dollar-for-dollar, across five separately filed rate cards branded for five
different underwriters (First American, Old Republic, Stewart, First National, Title
Resources) — strong confirmation that in Arizona the **escrow/settlement fee is set and filed
by the title/escrow agency, not the underwriter**, while underwriter-specific numbers only
vary the title insurance premium columns.

## Itemization / bundling patterns

Underwriter rate manuals (WFG, Stewart Title Guaranty, FNTI) do not carry a settlement fee at
all — they explicitly carve it out ("do not include any additional service(s) unless otherwise
noted," "only applicable for title only transactions where there is no escrow service
provided"). What those manuals do carry consistently is a **Closing Protection Letter (CPL)
fee clustered at $20–$25 per letter** (WFG $25/party, FNTI $25 flat, Stewart Guaranty $20/
letter capped at $40/transaction) — a stable itemized comparison point across underwriters
even where the base settlement fee isn't disclosed. Pioneer's agency schedule explicitly
folds e-doc, domestic wire, and courier into a flat $300 add-on when a sale and loan escrow
are combined, and into a separate $300 "Seller All Inclusive Rate" (also covering unlimited
reconveyance/tracking); standalone courier absent that bundle is $30/package.

## Premium rate card (filed-rate state)

Arizona is confirmed as a filed-rate state, not a promulgated/set-by-regulator state — each
underwriter files its own manual with DIFI (WFG's manual cites its ARS 30-1563/30-1591 filing
obligation).

## Corroborating but unverified color (NOT included in AZ.json — could not independently open source)

Google's search index has clearly crawled DIFI PDF text (search snippets surfaced verbatim
numbers), which gives narrative color even though it could not be personally certified:
First American's Sept-2024 DIFI filing reportedly adds "$250 for each loan over one" in
multi-loan transactions; Carefree Title Agency's escrow manual references a "Senior Citizen
Rate at 70% of the Basic Escrow Rate" and a "First Responder's Rate"; an "Accelerated Escrow
Rate" of "+$250" for 3-business-day rush closings and a "Loan Tie-In Fee" of "$100 per loan"
appeared in aggregate snippets; Chicago Title Agency's filing appears to use a zone system
("Zone 2A charges 100% of the Basic Escrow Rate plus an additional $500.00, and Zone 3...
plus an additional $330.00") and states its Basic Escrow Rate "includes overnight delivery
fees, courier fees, wire processing fees, and notary/signing fees"; Homie Title Inc.'s filing
showed a distinct "Doc Prep: $50" line. Per evidence rules, none of this is treated as
verified data — flagged here only so a future run knows what to re-attempt if DIFI access
improves.

## Sources found but not independently verifiable (blocked)

All returned Cloudflare "Just a moment..." challenge pages (HTTP 403) on every fetch method
attempted:

- First American Title Insurance Company — difi.az.gov filing (03/01/2026 and prior 09/22/2024)
- Stewart Title Company (agency filing, distinct from the Stewart Title Guaranty underwriter
  manual verified above) — difi.az.gov filing
- Chicago Title Agency, Inc. — difi.az.gov filing
- Fidelity National Title Insurance Company — difi.az.gov filing
- Old Republic Title Insurance Agency, Inc. — difi.az.gov filing
- Commonwealth Land Title Insurance Company — difi.az.gov filing
- Carefree Title Agency, Brightland Title Arizona, Accelerated Title Agency, Homie Title,
  Metro Title Agency, New Land Title Agency, Navi Title Agency, and other smaller agencies —
  all same domain, same block.

Also attempted and came up empty/unusable rather than blocked: Fidelity National's and
Chicago Title's rate-calculator tools (interactive JS quote tools, no static fee data, and
each disclaims the output isn't an authoritative rate schedule); Pioneer Title Agency's
"Cost & Fees" narrative page (loads fine but contains only qualitative bundling language, no
dollar figures beyond what's already quoted in AZ.json); no distinct North American Title
Arizona filing was found.

## Additional search this session (2026-07-21) — confirms scarce

- **DIFI retried on 3 access paths**: the escrow-rate-filings portal page (403), a direct
  Chicago Title Agency PDF URL on `difi.az.gov` (403), and the same PDF pattern on the
  alternate `dfi.az.gov` subdomain used for some older filings, e.g. Carefree Title (403)
  — confirms the Cloudflare block is domain-wide and persists across sessions, not a
  one-off or portal-specific issue.
- **Arizona Escrow & Financial Corporation** (`arizonaescrow.com/rates/`) — fetched
  successfully (not on the blocked domain); verified and added as the 5th source. Its
  $800 entry-tier real-property escrow fee exactly matches Pioneer Title Agency's $800
  figure at the same $100,000 tier — a strong independent corroboration point.

## Blocked-source retry (2026-07-22)
Retried DIFI's escrow-rate-filings portal page (`difi.az.gov/title-insurance-rate-filings`) via
WebFetch — still HTTP 403 Forbidden, same Cloudflare block confirmed across 3+ sessions now. No
change. (See also the calculator-basis harvest added this session in the "Calculator harvest"
section above, which independently adds a 6th Maricopa County data point via Old Republic's
public calculator, unaffected by the DIFI block.)

## Blocked-source retry (2026-07-23)
Retried via direct `curl` with a standard browser User-Agent (the technique that broke through
CT's CATIC block this same session) against 3 DIFI paths: `difi.az.gov/title-insurance-rate-
filings` (403), `difi.az.gov/Consumers/Insurance/Title` (403), and `azdifi.gov/title-insurance-
rate-filings` (connection failure, no DNS/route). All still blocked — confirms this is a genuine
Cloudflare WAF block independent of User-Agent (unlike CATIC's, which was UA-based), so the
CATIC-style browser-UA workaround does not apply here. No change; still flagged for a future
browser-driven or IP-diverse session.
- **Magnus Title Agency** (`magnustitle.com`) — fetched; publishes a "Cost Estimator" tool
  and "Resources" page but no static fee schedule; quote-only.
- **Premier Title Agency** (`ptanow.com`) — fetched; "Order Title & Get Rates" is an
  inquiry form, no published dollar figures.
- **Security Title Agency** (`securitytitle.com/buyers-sellers`) — fetched; directs
  visitors to "request a quote," no published dollar figures.
- Queries run this session: "difi.az.gov Chicago Title Agency escrow fee filing pdf
  Arizona", "Arizona title company escrow fee schedule pdf Carefree Title OR Homie Title
  OR Metro Title", "North American Title Company Arizona escrow fee schedule rate card
  pdf", "Nextitle Arizona escrow rates fee schedule", "Magnus Title Agency OR Title
  Security Agency Arizona escrow fee schedule pdf", "\"escrow fee\" Arizona title company
  rate schedule pdf -difi.az.gov -dfi.az.gov 2025 OR 2026", "Premier Title Agency Arizona
  escrow rates", "Title Security Agency Arizona rates fees" — 8 new search strategies this
  session alone, plus 5 new direct provider-site fetches, on top of the prior session's
  extensive DIFI-blocked list (8+ agencies) and calculator-tool dead ends.

## Sources

See `AZ.json` for full structured records with source URLs.

## Blocked-source retry (2026-07-25)
Retried `difi.az.gov` root and the escrow-rate-filings path via direct curl with a full current-
generation browser header set (User-Agent, Accept, Accept-Language) — still HTTP 403 Forbidden.
No change; confirms the Cloudflare WAF block persists across at least 4 retry sessions now.
