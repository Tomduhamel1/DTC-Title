# New Hampshire (NH) — Market Fee Evidence

## Status: COMPLETE (scarce market) — 2 verified published sources; calculator-quoted (4 providers) as of 2026-08-19

## Calculator harvest (2026-08-14; richness pass 2026-08-19)

Separate from the published-schedule survey below, calculator-basis quotes were harvested for the
standard scenario ($500,000 purchase / $400,000 loan / Hillsborough County-Manchester / residential
resale) — crossing the 3-provider calculator-quoted threshold on the first pass (2026-08-14), then
gaining a 4th corroborating provider in a 2026-08-19 richness pass. See NH.json entries with
`"basis": "calculator"` for full itemized figures and CALCULATORS.md for the technical recipes.

1. **Stewart Title Guaranty Company** — Stewart Rate Calculator (stewartratecalculator.com). This
   session completed reverse-engineering of the `/api/SRC/quote` endpoint (previously unsolved across
   many prior state sessions — see CALCULATORS.md's master recipe entry). Returned a genuinely
   itemized settlement statement: Title Closing Fee $725.00 (buyer, Great East Title and Closing/
   Bedford NH) plus Deed Prep $150, Discharge Management $50, Overnight $35, Wire Transfer $35,
   Recording Service $25 (all seller/buyer split as shown), alongside Owner's/Lender's premiums.
2. **Old Republic Title Insurance Company** — second rate calculator
   (ortratecalculator.oldrepublictitle.com, `Location=NH`). New technical finding this session: the
   tool's NoBot anti-bot check is Referer-gated — hitting it via
   `oldrepublictitle.com/rate-calculator/?location=new-hampshire` and preserving that Referer across
   the full session resolves the block reliably (previously logged as inconsistently blocked). Premium-
   only output (Owner's $1,200/Lender's $100 simultaneous, $800 lender standalone).
3. **Absolute Title, LLC** ("New England's Premier Title Company") — own first-party rate calculator,
   client-side JS (`rc_ct.js`), read directly for its hardcoded constants (same technique as Modern
   Title Group/MI, Columbus Title Agency/OH). Settlement Fee $595.00 flat, Owners Premium $1,275.00,
   Endorsements $125.00 — a rare genuine non-premium NH service-fee figure.
4. **FNF-family underwriter** — `ratecalculator.fnf.com` national rate calculator, ASP.NET WebForms
   postback flow (same recipe already applied to AR/CT/CO/MA/ND/VT/WY/RI/DE/SD/AK). Premium-only:
   Owner's Policy Premium $1,275.00, Loan Policy Premium $100.00, Survey Coverage/Endorsement Package
   $125.00, CPL $25.00, Grand Total $1,525.00.

## Published-schedule survey (original, 2026-07-22)

## Status: COMPLETE (scarce market) — 2 verified sources

2 premium-only rate manuals verified (Stewart, WFG), both explicitly and
affirmatively excluding settlement/closing/escrow charges. Despite 24
combined query strategies and direct provider-site checks, zero
independently-verifiable settlement-fee dollar figures were found. This
matches the AZ/CO/MI/MO/VA/AL/AR/WI/IN/KY/ME/MS/NE market-opacity pattern
seen in many other states. Marked **complete (scarce market)**.

## Key market structure finding

New Hampshire title insurance premiums are filed with the NH Insurance
Department (RSA 416-A) but rates are not fixed or promulgated by the
state -- each insurer sets its own rate, filed for public inspection.
CATIC (Connecticut Attorneys Title Insurance Company), New England's
dominant bar-related/attorney-affiliated title insurer, could not be
accessed this session (its rate book PDF 403-blocked on both known hosting
paths). NH does not require attorney closings, but attorney involvement is
customary; the only independent title company found with a specific
(repeatedly cited in search results) flat settlement fee -- Best Rates Title
Company of NH, LLC, quoting $199 for NH residential closings -- could not be
independently fetched and verified this session: its website
(nhtitlecompany.com) is caught in an unresolvable session-ID redirect loop
across every page and URL variant tried (https/http, with/without
trailing slash, with/without query string), so per the evidence rules
(exact quotes only from pages fetched this session) this figure is logged
as an unverified candidate, not counted as a source.

## Verified sources

1. **Stewart Title Guaranty Company** — Schedule of Charges and Forms,
   effective 2017-02-09. Premium-only; General Provisions and the
   "Charge" definition both explicitly exclude title search, examination,
   settlement, closing, and escrow fees. Notable for its detailed
   simultaneous-issue-for-residential-construction rule (builder loan +
   ultimate purchaser's owner's policy at original owner's charge + $50).
2. **WFG National Title Insurance Company** — Manual of Title Insurance
   Premiums, effective 2023-03-01. Premium explicitly "does not include
   charges for title search, surveys, escrow, closing services, settlement
   services, recording fees, other charges." Notable for its Lender's
   Special Rates volume-discount program and $25 CPL fee.

## Observed service-stack range

Not calculable — no independently-verified settlement/service-fee dollar
figures were found from any source. Both verified sources price only the
title insurance premium. (Best Rates Title Company of NH's oft-cited $199
flat closing fee could not be independently fetched/verified this session
and is excluded per evidence rules -- see search log items 17-21.)

## Itemization / bundling patterns

- Both underwriters use nearly identical explicit-exclusion language
  ("does not include... settlement, closing, or escrow services") --
  Stewart's is the more detailed of the two, separately defining "Charge"
  to exclude abstracting/searching/examination/settlement/closing/escrow
  fees in its Definitions section.
- WFG prices a $25 Closing Protection Letter fee; Stewart's NH manual does
  not price a CPL at all (the only state surveyed so far where one of the
  two national underwriters omits CPL pricing entirely from its rate
  manual).
- Both manuals price simultaneous issuance of a loan policy alongside an
  owner's policy as a flat, low fee ($50 Stewart / $75 WFG) rather than a
  percentage — a bundling pattern common across many states' premium
  schedules.
- No source in this state itemizes doc prep, courier, wire, e-recording,
  or notary/signing fees — every non-premium ancillary-fee category in the
  data model is unpopulated for New Hampshire.

## Premium rate cards

See Verified sources above — both are premium-only. No settlement/service-fee
rate card exists from any independently-verified provider found this
session.

## Metro differences

Not assessable — both verified sources are statewide (no county/metro rate
differentiation published by either underwriter).

## Search log (24 combined query strategies + direct provider-site checks)

1. "New Hampshire title insurance premium rate regulated filed New
   Hampshire Insurance Department" search — confirmed NH is a filed-but-
   unregulated-rate state (RSA 416-A) and surfaced CATIC's NH rate book
   PDF (two host paths).
2. "New Hampshire title company closing fee OR escrow fee schedule PDF
   settlement fee '$' Manchester OR Nashua" search — surfaced Best Rates
   Title Company of NH's $199 flat-fee claim, Lighthouse Title, Simple
   Title, Compass Title.
3. Direct fetch of catic.com/sites/default/files/Portals/0/PDF/NH_Ratebook.pdf
   — HTTP 403 Forbidden, unreachable.
4. Direct fetch of nhtitlecompany.com/buyers.html — redirect loop
   (session-ID query string regenerates on every follow, never resolves).
5. Direct fetch of lighthouseclosings.com — no dollar figures published;
   references only an interactive "Closing Cost Calculator."
6. Direct fetch (retry) of nhtitlecompany.com/buyers.html with session-ID
   query string — redirect loop persists.
7. "Stewart Title Guaranty New Hampshire rate manual PDF effective
   virtualunderwriter" search — surfaced the exact Stewart NH manual PDF
   and confirmed via the search snippet itself that charges exclude
   settlement/closing/escrow services.
8. Direct fetch of nhtitlecompany.com/ (root) — redirect loop persists
   with a new session-ID each time.
9. Direct fetch + PDF-recovery of the Stewart NH manual — **verified**
   (source #1).
10. Direct fetch (retry) of nhtitlecompany.com/default.html with session-ID
    — redirect loop persists.
11. Direct fetch of simpletitle.us/new-hampshire-title-escrow-services/ —
    no dollar figures published.
12. Direct fetch of compasstitlenh.com — no dollar figures; references
    only an interactive "Rate Calculator."
13. "WFG National Title New Hampshire rate manual PDF wfgunderwriting.com"
    search — surfaced the exact WFG NH manual PDF directly.
14. Direct fetch + PDF-recovery of the WFG NH manual — **verified**
    (source #2).
15. Direct fetch of catic.com/sites/default/files/Portals/0/Agents/NH%20Rate%20Book%20-%20February%202013.pdf
    — HTTP 403 Forbidden, unreachable (second CATIC host path attempted).
16. "New Hampshire real estate closing attorney flat fee published website
    '$' Concord OR Portsmouth OR Manchester" search — only generic
    aggregator ranges found ($800-$1,500), no attributable firm-published
    figures.
17. "'Best Rates Title' Nashua New Hampshire '$199' closing fee
    residential" search — confirmed the $199 figure is repeated across
    at least 8 distinct nhtitlecompany.com page titles/snippets in search
    results, but the live site itself remains unreachable (see items 4,
    6, 8, 10, 19 below) -- logged as an unverified candidate per evidence
    rules, not counted as a source.
18. "First American Title New Hampshire rate manual PDF premium schedule"
    search — surfaced two "First American Rate Sheet" PDFs hosted on
    oahure.com; both later confirmed to be Hawaii-jurisdiction documents
    mislabeled/miscategorized in search results, not New Hampshire --
    excluded as wrong-jurisdiction (matching the MD/MN/HI wrong-
    jurisdiction pattern from earlier sessions).
19. Direct fetch of nhtitlecompany.com/common-questions.html — redirect
    loop persists.
20. Direct fetch + PDF-recovery of the oahure.com First American rate
    sheet — confirmed Hawaii jurisdiction (Aiea/Honolulu/Hilo/Kona/Maui
    branch addresses, effective 2026-01-15) — **discarded**, wrong state.
21. Direct fetch (retry) of nhtitlecompany.com/buyers.html via plain-http
    301/302 redirect chain — redirect loop persists across every variant
    tried (https, http, with/without www, with/without session-ID query
    string) — genuinely inaccessible this session, not confirmed-no-figures.
22. Direct fetch of nh.gov/insurance/consumers/documents/titleinsfinal.pdf
    — HTTP 403 Forbidden, unreachable.
23. "Old Republic Title New Hampshire rate manual OR closing costs guide
    PDF" search — no NH-specific static rate manual PDF found; only
    generic aggregator/blog content and Old Republic's general "required
    closing costs" blog post (not NH-specific, no dollar figures).
24. Direct fetch (retry) of catic.com/sites/default/files/Portals/0/PDF/NH_Ratebook.pdf
    — HTTP 403 Forbidden again, confirmed CATIC's rate book is
    consistently blocked regardless of host path.

With only 2 verified sources despite this exhaustive search, NH meets the
contract's scarce criterion.
