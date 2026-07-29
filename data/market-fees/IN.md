# Indiana — Market Fee Evidence

## Status: complete (scarce market) — 6 verified documents (5 premium-only + 1 settlement-fee), 2026-07-22

Indiana is a well-documented filed-rate state on the **title insurance premium** side: four full
underwriter rate manuals (Stewart, Fidelity National, First National Title Insurance/FNTI, WFG)
were verified, plus the Indiana Department of Insurance's own **Title Insurance Rate Comparison
Tool** — a regulator-maintained spreadsheet aggregating filed Owner's/Lender's premium rates for
roughly 19 licensed insurers side by side, an unusually rich single-file resource. However, on the
**settlement/service-fee side (the core ask of this survey)**, only **one** genuine, non-premium,
dollar-denominated fee schedule was found (Regional Land Title, Bloomington) despite 25+ distinct
query variants and 10+ direct provider-site checks (Meridian Title, TitlePlus, John Bethell Title,
GCA Title, Titan Title, Allied Capital Title, Indiana Title and Closing Services, plus every
national-brand direct office). This mirrors the market-opacity pattern already documented in
MI/MO/WI/AZ/CO/VA/AL/AR: underwriters publish their regulated premium manuals but not their
unregulated settlement/escrow fees, and most independents route to quote tools rather than static
pricing pages. Since a saturation check requires a real, multi-source settlement/service-stack
range to test for stability, and only 1 such priced source exists, Indiana **cannot be marked
saturated** despite 6 total good-source documents; per the same reasoning applied to MI/MO/WI, it
is marked **complete (scarce)** on the settlement-fee track, notwithstanding strong premium-side
coverage.

## All-in service-stack range observed

Only one priced settlement-fee source exists (Regional Land Title, Bloomington/Monroe County), so
no cross-provider range can be tested. Its figures: **purchase** closing fee $200 + doc prep
$100/doc + title search $250-$300 + buyer's processing $200 + seller doc prep $125 (roughly
$675-$725 core stack before ancillary wire/courier/recording charges); **refinance** closing fee
$200 + buyer's processing $100 + title search $225-$275 (roughly $525-$575 core stack).

## Itemization / bundling patterns

- Every underwriter premium manual (Stewart, Fidelity, WFG, FNTI) contains **explicit exclusion
  language** for escrow/closing/settlement charges, document prep, and (Fidelity's is the most
  detailed) overnight delivery/fax fees and attorney's fees.
- **TIEFF (Title Insurance Enforcement Fund Fee), $5.00 per policy**, is an Indiana-specific
  statutory pass-through charge (Indiana Code 27-7-3.6) that appears independently in both
  Stewart's underwriter manual and Regional Land Title's consumer-facing fee page — a clean
  cross-source corroboration of a state-specific fee.
- CPL pricing varies more than in most other states surveyed: Stewart and the IDOI comparison tool
  show $25/party as standard, but FNTI charges an asymmetric $35/lender vs. $25/seller-borrower-buyer.
- Current (2024-2026) Owner's Policy premiums at $100,000 liability cluster tightly across most
  underwriters ($388-$395 for Chicago Title/Fidelity, First American, Old Republic, Stewart, WFG),
  with Rocket Title ($300) and Doma ($345) pricing meaningfully lower — a real, regulator-confirmed
  competitive spread even in a filed-rate state.

## Metro differences

Only one metro (Bloomington/Monroe County) has priced settlement-fee data; no cross-metro
comparison is possible with the evidence found. Underwriter premium manuals are filed statewide
with no county/metro breakout.

## Premium rate card (filed-rate state)

Representative Owner's Policy premium at $100,000 liability, by underwriter (from underwriter
manuals and the IDOI comparison tool; full tables in IN.json):

| Underwriter | Vintage | Owner's @ $100k | Lender's @ $100k (or noted) |
|---|---|---|---|
| Chicago Title/Fidelity/Commonwealth (FNF brands) | 2024-12-11 | $388 | simultaneous $120-$195 tiered |
| First American | 2026-01-13 | $390 | $150 (via IDOI tool, $500k tier $525) |
| Old Republic | 2025-04-11 | $390 | $155 |
| Stewart Guaranty | 2025-07-07 | $395 (~$390 via manual formula) | $153 (manual: $75 base + $1.55/1000) |
| WFG | 2025-04-01 (IDOI) / 2013-07-01 (own manual, stale) | $388 (IDOI) | $155 (IDOI) |
| Rocket Title (formerly Amrock) | 2024-11-12 | $300 | $125 |
| Doma | 2024-11-01 | $345 | $138 |
| First National Title Insurance (FNTI) | 2023-03-07 | $337.50 | simultaneous $100 flat |

All figures at $500,000 liability and full bracket tables (reissue %, builder discount, refinance
tiers) are recorded in IN.json.

## Not used / found-but-excluded

- **WFG's 2022-05-01 rate filing** (bulletin IN 2022-01) was referenced but only the memo/bulletin
  page was fetchable, not the full updated manual PDF -- the 2013 manual figures on file should be
  treated as superseded.
- **Old Republic's "rate-card-2021.pdf"** — a search hit that turned out, on fetch, to be an
  Illinois document, not Indiana — wrong-jurisdiction, excluded.
- **"Titan Title Indiana"** search surfaced Greater Illinois Title (gitc.com) as a false positive —
  confirmed via PDF extraction to be an Illinois company, excluded.
- **Meridian Title** (/cost-resources, /seller-net-sheet) — fetched directly, confirmed quote-tool
  only, no static dollar figures.
- **Metropolitan Title, Indylegal Title** — blog-style content only (Metropolitan's fetch returned
  empty), no attributable company-published schedule.
- **Chicago Title's rates.fntg.com calculator** — confirmed Indiana is selectable, but interactive
  quote-only, no static output retrievable.
- **indianatitlecs.com** (Indiana Title and Closing Services) — returned HTTP 503, unusable.
- **Royal Title Services** (royaltitle.com) redirects to actil.net (Allied Capital Title) — checked
  directly, quote-only, no numbers.
- **Fort Wayne (GCA Title, Titan Title) and Evansville** searches found companies but no static fee
  schedules; only county-recorder government fee schedules surfaced for Evansville/Vanderburgh
  County (not a title company source, excluded).
- **No confirmed active Indiana Title Insurance Rating Bureau** was found — Indiana Code 27-1-22-28
  (enacted "file and use," effective 2013-07-01) permits insurers to join a rating bureau starting
  2014-07-01, but only the unrelated Indiana Compensation Rating Bureau (workers' comp) surfaced in
  searches; each underwriter appears to file independently rather than through a bureau.

## Search log (31 distinct query strategies + direct provider-site checks)

1. "Indiana Title Insurance Rating Bureau rate manual"
2. "Indiana title insurance rate schedule filed premium"
3. "Indiana Department of Insurance title insurance rate filing"
4. "Indiana escrow settlement fee schedule PDF closing costs"
5. "\"Indiana Title Insurance Rating Bureau\" ITIRB members"
6. Direct fetch: virtualunderwriter.com Stewart PDF (binary recovered via PDF-text extraction)
7. Direct fetch: wfgunderwriting.com 2013 WFG PDF
8. Direct fetch: momentumclosings.com Fidelity PDF
9. Direct fetch: documentpub.fnti.com FNTI PDF
10. "Indianapolis title company closing fee settlement fee schedule doc prep/wire fee"
11. "\"title insurance rating bureau\" Indiana formed OR established"
12. "Fort Wayne Indiana title company closing fee OR settlement fee schedule"
13. "Evansville Indiana title company fee schedule closing costs PDF"
14. "South Bend Indiana title insurance company fees escrow settlement"
15. Meridian Title site search + direct fetch of /cost-resources and /seller-net-sheet
16. Metropolitan Title blog fetch
17. Indylegal Title blog fetch
18. "Old Republic Title Indiana rate manual schedule of charges PDF"
19. Direct fetch of Old Republic "rate-card-2021.pdf" (turned out to be Illinois, wrong-jurisdiction)
20. "Chicago Title Indiana rate manual schedule of charges PDF"
21. Chicago Title calculator (rates.fntg.com?brand=chicago) direct check
22. IDOI rate comparison tool xlsx — fetched and parsed directly (binary recovery)
23. "WFG National Title Indiana rate manual 2023 OR 2024"
24. "Bloomington Indiana Monroe County title company closing fee schedule"
25. "Titan Title Indiana fee schedule" (surfaced Illinois false positive)
26. "Chicago Title/Fidelity Indiana escrow fees and charges schedule"
27. GCA Title Fort Wayne page direct check
28. "Indiana Title and Closing Services fee schedule / John Bethell Title fee schedule"
29. "1st Title / Near North Title / Capital Title Indianapolis fee schedule"
30. "Indiana title company published rate sheet buyer's/seller's closing fee"
31. "Vanderburgh County Evansville title company fees.pdf"

## Calculator harvest addendum (2026-07-29)

Separate from the published-schedule survey above (which remains **complete (scarce)**),
this session harvested Indiana's first provider quote calculator for the standard
$500,000/$400,000 purchase scenario — see IN.json's entry marked `"basis": "calculator"`
and CALCULATORS.md for full technical detail.

**Agency Title, Inc.** (New Albany, IN office; serves the Louisville-metro/Southern
Indiana market) embeds the NetSheetCalc/TitleTap white-label platform (`appid=581`),
found via the agency's own site (`agencytitle.com/calculator/`). Unlike the gated
`login`/`quickquote.php` UI page itself, the platform's `non-auth-ajax.php?action=
getAppData&app_id=581` endpoint is a plain, unauthenticated JSON GET (the same "Quick
Quote, no sign in needed" pattern documented for Independent Title & Escrow LLC, VA)
that returns the agency's full fee-form schema, including hardcoded flat-dollar
constants: Settlement Fee $495.00, Borrower's CPL $25.00, Lender's CPL $25.00, Incoming
Wire Fee $35.00, TIEFF $10.00, E-Recording Fee $10.00, Recording Fees $118.50, Sales
Disclosure Fee $30.00, plus an ancillary "Lender's Title Insurance" line item ($120.00,
distinct from the underwriter's actual filed premium). These are statewide-flat
defaults in the tool's own config (not computed from the entered sale/loan amount) —
its 416-entry municipality dropdown supplies only a local transfer-tax multiplier for
the tax-proration line, so no specific county selection was needed to read them.

This is 1 of the 3 calculator-basis providers needed for IN to reach calculator-quoted
status (still below threshold). The same agency operator also has a Kentucky instance
(`appid=582`) harvested the same session — see KY.md.
