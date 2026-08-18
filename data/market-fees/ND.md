# North Dakota (ND) — Market Fee Evidence

## Calculator harvest (2026-08-18) — **calculator-quoted (3 providers)**

Separate from the published-schedule survey below, 3 calculator-basis quotes were harvested for the
standard scenario ($500,000 purchase / $400,000 loan / Cass County-Fargo / residential resale),
crossing the 3-provider calculator-quoted threshold. See ND.json's `"basis": "calculator"` entries
for full itemized figures and CALCULATORS.md for the technical recipes.

1. **Dickey and LaMoure County Abstract and Title Company** — via Stewart Rate Calculator
   (stewartratecalculator.com), applying the recipe fully documented in CALCULATORS.md's 2026-08-14
   entry unmodified. Rich 7-line itemization: Title Closing Fee $350.00, Title Certification Fee
   $25.00, Title Courier Fee $22.95, Title Examination Fee $200.00, Title Plat Draw $175.00, Title
   Search Fee $50.00, Title Wire Transfer Fee $15.00 (all buyer-side), plus Owner's/Lender's Basic
   Policy standalone premiums $1,400.00/$1,050.00. No deed/transfer tax (North Dakota has none,
   corroborating the published-schedule finding below).
2. **WFG National Title Insurance Company** — Seller Net Sheet Rate Calculator
   (rates.wfgnationaltitle.com), via the publicly-reachable no-auth JSON API solved and documented
   in CALCULATORS.md's 2026-08-08 entry. Premium-only result: Owner's Title Insurance Premium
   $1,238.00 (ND is not one of the 7 states with configured HUD-fee itemization in this tool).

3. **FNF-family underwriter** (ratecalculator.fnf.com, shared ASP.NET WebForms engine) — Cass
   County, via the recipe already documented in CALCULATORS.md's FNF section. Owner's Policy Premium
   $1,300.00, Loan Policy Premium $150.00 (concurrent-issue rate), Grand Total **$1,450.00**.
   Premium-only, no settlement-fee itemization. **This crosses ND to the 3-provider calculator-quoted
   threshold.**

## Status: COMPLETE (scarce market) — 2 verified sources

2 premium-only rate manuals verified (Stewart, WFG), both explicitly
excluding settlement/closing/escrow charges from their priced rates.
Despite 15 combined query strategies and direct provider-site checks, no
independent title company's published settlement-fee schedule and no
additional underwriter's rate manual (First American, Old Republic) could
be located. This matches the MT/NE/NV/NH market-opacity pattern seen
repeatedly in lower-population filed-rate states. Marked **complete
(scarce market)**.

## Key market structure finding

North Dakota title insurance rates must be filed with the ND Insurance
Department (NDCC 26.1-25-04) but are not promulgated/fixed by the state
-- each insurer files and uses its own rate. The Department's own
"Policy, Form and Rate Filing" page makes no specific mention of title
insurance and offers no public directory of filed rate manuals; its
general "Title Insurance" page provides only consumer-education content,
no rate-mechanism detail or links to filed schedules. Unlike Nevada,
Kansas, or Idaho, North Dakota's regulator does not appear to publicly
host a searchable repository of filed title rate/escrow schedules, so
Virtual Underwriter (Stewart's own hosting platform) and
wfgunderwriting.com remain the only accessible sources of static, current
rate manuals for this state.

## Verified sources

1. **Stewart Title Guaranty Company** — North Dakota manual, last updated
   2024-04-23, effective 2024-07-31. Premium-only. Contains a notable
   data-integrity anomaly: an appended "Schedule A - Special Products
   Available for Stewart Title Guaranty Company Issuance in Indiana"
   section (Centralized Processing Loan/Refinance Rate table, STG HELP
   home equity table) that is explicitly labeled for Indiana, not North
   Dakota -- an apparent copy-paste/template error, excluded from this
   evidence file as not ND-specific.
2. **WFG National Title Insurance Company** — North Dakota manual, "Rate
   and Rules for the State of North Dakota," effective 2022-04-01.
   Premium-only, standard exclusion language. Notable for omitting CPL
   pricing entirely (rare among WFG's state manuals, which typically
   price a $25 CPL).

## Observed service-stack range

Not calculable — no independently-verified settlement/service-fee dollar
figures were found from any source. Both verified sources price only the
title insurance premium.

## Itemization / bundling patterns

- Both underwriters use standard explicit-exclusion language for
  settlement/closing/escrow services; neither prices any ancillary
  service fee (doc prep, courier, wire, e-recording, notary/signing).
- WFG's ND manual is one of the few state manuals surveyed so far where
  the CPL fee is omitted entirely rather than priced at the customary
  $25.
- Both underwriters price simultaneous issuance of a loan policy with an
  owner's policy as a flat, low fee (Stewart's rules embedded in its
  Simultaneous Issue section; WFG $100/$125 flat depending on coverage
  type) rather than a percentage.
- Refinance and reissue rates are both set at 75% of the applicable
  premium by both underwriters -- an unusually clean cross-provider
  match on refinance/reissue discount percentage for this state.

## Premium rate cards

See Verified sources above — both are premium-only. No settlement/
service-fee rate card exists from any independently-verified provider
found this session.

## Metro differences

Not assessable — both verified sources are statewide manuals with no
county/metro rate differentiation (Fargo, Bismarck, Grand Forks, Minot,
Williston are not priced separately by either underwriter).

## Search log (15 combined query strategies + direct provider-site checks)

1. "North Dakota title insurance premium rate regulated filed North
   Dakota Insurance Department" search — confirmed ND is a filed-but-
   unregulated-rate state (NDCC 26.1-25-04) and surfaced the ND
   Insurance Department's general "Title Insurance" consumer page.
2. "Stewart Title Guaranty North Dakota rate manual PDF virtualunderwriter
   effective" search — surfaced the exact Stewart ND manual PDF link.
3. Direct fetch + PDF-recovery of the Stewart ND manual — **verified**
   (source #1), including discovery of the appended Indiana Schedule A
   anomaly.
4. "WFG National Title North Dakota rate manual PDF wfgunderwriting.com"
   search — surfaced a WFG underwriting bulletin (ND 2021-01, dated
   2021-05-07) referencing http://wfgunderwriting.com/north-dakota/rates
   rather than a direct manual PDF link.
5. Direct fetch of the WFG ND rates landing page
   (wfgunderwriting.com/north-dakota/rates) — extracted the current
   manual PDF link.
6. Direct fetch + PDF-recovery of the WFG ND manual — **verified**
   (source #2).
7. Direct fetch of insurance.nd.gov/title-insurance — consumer-education
   content only; no rate-mechanism detail, no links to filed schedules.
8. Direct fetch of securetitlecompany.com/north-dakota/ (Secure Title
   Company) — only illustrative ranges ("$1,200-$1,800 premiums for a
   $250,000 property," "closing costs 2-5% of purchase price"), no
   published fee schedule.
9. "First American Title North Dakota rate manual PDF premium schedule
   agency.firstam.com" search — surfaced only First American's general
   ND agency landing pages and interactive calculator tools (Title Fee
   Calculator, AgentNet, Comprehensive Calculator); no direct static
   rate manual PDF found.
10. "North Dakota independent title company escrow fee schedule PDF
    Fargo OR Bismarck OR Minot closing fee" search — surfaced only
    generic aggregator content (Rocket Mortgage, ConsumerAffairs,
    Houzeo, NewHomeSource) and Secure Title Company (already checked);
    no independent schedule found.
11. "Old Republic Title North Dakota rate manual PDF virtualunderwriter"
    search — surfaced only Virtual Underwriter's ND location index page
    (which lists Stewart's own ND2024001 rate-update notice, not an
    Old Republic filing) and Old Republic's general ND landing page
    (oldrepublictitle.com/north-dakota/, no static schedule).
12. "'North Dakota' title insurance rate manual First American
    virtualunderwriter.com pdf" search — confirmed no First American ND
    rate manual is indexed on Virtual Underwriter; only Stewart's own
    ND2024001 notice appears there.
13. Direct fetch of insurance.nd.gov/companies/policy-form-and-rate-filing
    — confirmed this page makes no mention of title insurance and
    provides no directory of filed rate manuals (SERFF references only).
14. "'North Dakota' independent title company 'closing fee' OR
    'settlement fee' schedule dollar Grand Forks OR Williston" search —
    surfaced only generic aggregator/blog content (Houzeo, ListWithClever,
    Rocket Mortgage, Redfin, iBuyer) and Secure Title Company (already
    checked); no independent title company's published fee schedule
    found for any ND metro.
15. Cross-check of virtualunderwriter.com's North Dakota location index
    page — confirmed only Stewart's own manual/update notice is listed;
    no Old Republic, First American, or Chicago Title ND filing is
    indexed on this platform.

With only 2 verified sources despite this exhaustive search, ND meets the
contract's scarce criterion.
