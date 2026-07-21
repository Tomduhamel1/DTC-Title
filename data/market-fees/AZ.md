# Arizona — Market Fee Evidence

Evidence quality: **good** (4 verified providers, though short of the ideal 6 because the
richest source — the state DIFI filing library — was blocked; see below).

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

## Sources

See `AZ.json` for full structured records with source URLs.
