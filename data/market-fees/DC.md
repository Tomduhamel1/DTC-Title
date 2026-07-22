# District of Columbia — Market Fee Evidence

## Status: complete (scarce market) — 4 verified sources (2 premium-only, 2 settlement-fee-priced), 2026-07-22

Washington DC is an **attorney/title-agent-closing jurisdiction** with **insurer-filed but uncoordinated
title premiums** (DC DISB requires filing but does not promulgate uniform rates; similar structure to
CT). This session verified **4 directly-fetched sources**: Stewart Title Guaranty (effective
2024-02-26) and WFG National Title (effective 2014-10-01), both premium-only filed rate manuals; and
two independent title/settlement companies with published, itemized settlement-fee schedules —
Federal Title & Escrow Company (buyer $1,275 / seller $550 / refinance $975, all flat-regardless-of-
price, richly itemized with sub-fees) and Avenue Title Group (buyer/seller each $550-$650, ranged
pricing, DC/MD/VA/PA/FL multi-jurisdiction). **9 distinct query strategies plus 8 direct provider-site
checks** found only 4 usable sources — below the 6-source saturation floor. Marked **complete
(scarce)**.

## All-in service-stack range observed

Two directly comparable settlement-fee sources give a genuine, published DC settlement-fee range:
- **Federal Title & Escrow**: $550 (seller) - $1,275 (buyer), fixed flat regardless of price. This is
  the largest buyer/seller fee asymmetry found in this entire survey — the buyer fee is more than
  double the seller fee at the same company, reflecting DC's heavier buyer-side title-exam and
  policy-issuance workload versus the seller's lighter payoff-coordination role.
- **Avenue Title Group**: $550-$650 each side (buyer and seller pay separately, ranged rather than
  fixed).

Combining these gives an observed **all-in settlement-fee range of roughly $550-$1,275** (excluding
the separately-billed title insurance premium in both cases). With only 2 comparable settlement-fee
sources, this is far too thin to test for saturation (the contract requires 6+ sources before
saturation can even be evaluated) — but the two sources' seller/buyer-side figures ($550 seller at
Federal Title vs. $550-$650 either side at Avenue Title) overlap closely at the low end, a useful
informal cross-company corroboration.

## Itemization / bundling patterns

- **Stewart's** and **WFG's** manuals use near-identical exclusion language: charges "do not include
  charges for searches, examinations, abstracts, attorney's fees, escrow, or closing service
  performed and charged for by local attorneys, abstractors, and title companies" — both name local
  attorneys directly, consistent with DC's attorney/title-agent-closing structure. Both manuals also
  independently confirm an identical **$50.00 per-letter CPL fee**, a direct cross-underwriter
  corroboration spanning a full decade between the two manuals' effective dates (2014 vs. 2024).
- **Federal Title's** three-tier fixed-fee model (buyer/seller/refinance, each a different flat
  dollar amount regardless of transaction size) is the most granular buyer-vs-seller-vs-refinance
  breakdown found for any jurisdiction in this survey. Notably its per-transaction-type ordering
  (buyer $1,275 > refinance $975 > seller $550) differs from the more common pattern in other states
  where refinance is the cheapest of the three — here seller is cheapest, reflecting that DC settlement
  agents (not sellers) bear the title-exam/policy-issuance cost, which the fee structure assigns
  mostly to the buyer side.
- **Avenue Title's** DC/MD/VA/PA/FL multi-jurisdiction page uses ranged, complexity-based pricing
  ($550-$650) rather than Federal Title's flat-regardless-of-price model — the same range vs. flat
  distinction observed between similarly-paired sources in other states (e.g. CT's Connecticut Title
  & Escrow flat vs. Connecticut Real Estate Closing Lawyers' range).

## Premium rate card (insurer-filed, uncoordinated jurisdiction)

Representative Owner's Policy premium at $100,000 liability (both hit their respective minimum
charge at this size, since both use a single "up to $250,000" bracket at this range): Stewart (2024)
= $100,000 x $5.70/thousand = $570.00 (above the $300 minimum); WFG (2014, Standard Coverage) =
$100,000 x $5.50/thousand = $550.00 (above the $210 minimum) — WFG's decade-older per-thousand rate
is only $0.20 lower than Stewart's current rate, a modest ~4% difference despite the 10-year gap,
suggesting DC premium rates have been relatively stable. Both manuals also independently confirm the
**$50.00 per-letter CPL fee**. Full liability-tiered schedules for both are recorded verbatim in
DC.json.

## Not used / found-but-blocked

- **choicefinance.net** (title-attorney-fees.htm and washington-dc-closing-costs.htm) — DNS
  resolution failure (`ENOTFOUND`) on two separate fetch attempts across the session; could not be
  reached at all.
- **flatlawfees.com/rates.html** — a promising attorney flat-fee page (search snippets suggested
  "Standard Real Estate Closing $950 / Advanced $1,500 / Complex $2,000+" tiers) returned HTTP 503
  Service Unavailable on direct fetch and could not be independently verified; excluded per evidence
  rules despite the appealing snippet data.
- **easterntitle.com/washington-dc** (Eastern Title & Settlement) — fetched successfully; describes
  services only (title search, settlement, escrow, deed prep, RON), no published fee figures —
  "Start Your Order" contact-form model.
- **oldrepublictitle.com/district-of-columbia/** — fetched successfully; lists two Columbia, MD
  office locations serving DC, no linked fee schedule or PDF.
- **agency.firstam.com/dc** / firstam.com DC Agency Services — First American's DC page routes to a
  Title Fee Calculator and Comprehensive Calculator (FACC) tool, not a static published schedule; not
  independently fetchable as a priced document.
- A "Greater Illinois Title" (GITC) "Schedule of Fees and Services" PDF surfaced in search results
  but is an Illinois document (Chicago-area offices only, already on file from the IL survey) —
  excluded as wrong-jurisdiction, matching the MD/Hawaii and MN/Michigan wrong-jurisdiction pattern
  from earlier sessions.
- No Chicago Title or Fidelity National Title DC-specific rate manual or settlement-fee PDF was found
  via search.

## Search log (9 distinct query strategies + direct provider-site checks)

1. "Washington DC title insurance rate manual settlement fee schedule pdf"
2. "District of Columbia title insurance premium Stewart OR WFG OR \"First American\" manual pdf rates"
3. "federaltitle.com DC settlement fee closing fee schedule"
4. "Washington DC title company closing fee settlement fee schedule attorney pdf dollar"
5. "Washington DC title company independent \"settlement fee\" \"$\" pricing page Chicago Title OR \"Old Republic\" OR Fidelity"
6. "Washington DC title company \"settlement fee\" OR \"closing fee\" schedule independent pricing site:.com -federaltitle"
7. "\"District of Columbia\" title agency closing attorney flat fee settlement $ pricing law firm"
8. "DC metro title company \"settlement fee\" flat rate $1000 OR $1200 OR $1500 pricing purchase Washington"
9. "Washington DC real estate closing attorney \"flat fee\" $ own pricing page law office"

Plus direct provider-site fetches: Stewart and WFG DC rate manual PDFs (via WebFetch + Read-tool
binary-PDF recovery, same technique used throughout this survey), federaltitle.com/homebuying/fees/,
federaltitle.com/homeowners/selling/fees/, federaltitle.com/homeowners/refinancing/fees/ (all three
fetched successfully with rich itemization), avenuesettlements.com/settlement-resources/settlement-fees/,
easterntitle.com/washington-dc (no pricing found), oldrepublictitle.com/district-of-columbia/ (no
fee schedule linked), choicefinance.net (DNS failure, unreachable), flatlawfees.com (503 unavailable),
agency.firstam.com/dc (calculator only, no static schedule).
