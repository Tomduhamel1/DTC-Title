# Maine (ME) — Market Fee Evidence

## Calculator harvest (2026-08-15 through 2026-08-19) — **calculator-quoted (4 providers)**

Separate from the published-schedule survey below, 4 calculator-basis quotes have been harvested for
the standard scenario ($500,000 purchase / $400,000 loan / Cumberland County-Portland / residential
resale), crossing the 3-provider calculator-quoted threshold (2026-08-18) and gaining a 4th
corroborating provider in a 2026-08-19 richness pass. See ME.json entries with `"basis":
"calculator"` for full itemized figures and CALCULATORS.md for the technical recipes.

1. **Stewart Title Guaranty Company** — Stewart Rate Calculator (stewartratecalculator.com), via
   settlement office Stewart Title-Northern New England Division (Portsmouth NH, the only office this
   tool lists serving Cumberland County). Title Closing Fee $695.00 (100% buyer), Owner's Premium
   $1,500.00, Lender's Premium $700.00 (simultaneous)/$50.00 (standalone), recording fees ($40 each
   Mortgage/Deed/Release), Maine Real Estate Transfer Tax $2,200.00 total (50/50 buyer/seller split).
2. **Absolute Title, LLC** ("New England's Premier Title Company") — own first-party rate calculator,
   Maine edition (`ratecalculator_me.asp`/`rc_me.js`), same technique as this company's NH calculator
   (already on file). Settlement Fee $650.00 flat, Owner's Premium $1,600.00, Lender's Premium
   $700.00, Endorsements $125.00, Transfer Tax $1,100.00 (byte-identical buyer/seller split to
   Stewart's figure above — a cross-provider convergence). Confirmed this session that Absolute Title
   only maintains calculators for NH/ME/MA, not RI/CT/DE/VT (those URLs resolve to a generic fallback
   page).

3. **WFG National Title Insurance Company** — Seller Net Sheet Rate Calculator
   (rates.wfgnationaltitle.com), via the publicly-reachable no-auth JSON API solved and documented
   in CALCULATORS.md's 2026-08-08 entry. Confirmed ME `isCalculationEnabled: true` via
   `GetCalculationEnabledStates` and harvested directly (Cumberland County/Portland). Premium-only
   result: Owner's Title Insurance Premium **$1,750.00** (ME is not one of the 7 states with
   configured HUD-fee itemization in this tool). **This crosses ME to the 3-provider
   calculator-quoted threshold.**

4. **FNF-family underwriter** — `ratecalculator.fnf.com` national rate calculator, ASP.NET WebForms
   postback flow (same recipe already applied to AR/CT/CO/MA/ND/VT/WY/RI/DE/SD/AK), harvested
   2026-08-19 as a richness pass. Premium-only: Owner's Policy Premium $1,500.00, Loan Policy
   Premium $50.00, Grand Total $1,550.00 (no separate CPL line for this state/scenario).

**Earlier 3rd-provider search (2026-08-15, dead ends before the WFG technique above)**: Old
Republic's 2nd tool (`Location=ME`) still NoBot-blocked despite the Referer-header fix that worked
for NH — the fix is not universally reliable, matching the WV session's finding that a deeper
session-affinity fix (not just Referer) is sometimes required. Gateway Title of Maine's "rate
calculator" page is a Gravity Forms reCAPTCHA-gated contact form, not a calculator — jsOnly/gated.
Cumberland Title Services + Central Maine Title's "fee calculator" routes to First American's FACC
tool (`facc.firstam.com`), a known login/SSO gate. No Maine-specific MyTitleRates.com or
NetSheetCalc/TitleTap agency instance found via search.

## Status: complete (scarce market)

2 providers verified (3 documents: 1 WFG manual, 2 Stewart documents from the same
underwriter's Maine rates page) against a 6-source saturation floor, after 17 distinct
query strategies and 10 direct provider-site checks (well past the 8-strategy scarce
threshold). Zero settlement/closing/escrow service-fee dollar figures were found
anywhere in the Maine market despite exhaustive search -- every located document is a
title-insurance-premium-only rate card that explicitly excludes settlement/closing/escrow
charges from its stated rates. This matches the "market-opacity" pattern documented in
several other insurer-filed states (AZ, CO, MI, MO, VA, AL, AR, KY, WI) where independent
title/escrow companies and closing attorneys do not publish static fee schedules.

## Verified sources

1. **WFG National Title Insurance Company** -- Maine Manual of Title Insurance Premiums,
   effective March 1, 2022. Premium rate tables (owner's/loan, standard/enhanced),
   lender's special rates, endorsement charges, and a Closing Protection Letter fee of
   $25.00 per issuance. Explicitly states rates "do not include charges for title search,
   surveys, escrow, closing services, settlement services, recording fees, other charges."
2. **Stewart Title Guaranty Company** -- "Schedule of Charges and Forms for Title
   Insurance in the State of Maine" (full manual) + companion one-page "Schedule of Rates
   for Title Insurance" rate card from the same Stewart Maine rates page. Both are
   premium/endorsement-only; the manual's own Definitions section states "The charge does
   not include the abstracting or searching fee, examination fee, settlement fees,
   closing fees, or escrow fees." Counted as one provider (two documents, same underwriter,
   same effective scope).

## Observed service-stack range

**No range exists.** No source in Maine publishes a dollar-denominated settlement,
closing, or escrow service fee. The only non-premium dollar figures found anywhere are:
- WFG's Closing Protection Letter fee: $25.00 per issuance
- WFG's survey-exception-deletion fees: $100 (owner's) / $25 (loan)
- Stewart's commitment-to-insure fee: $25; residential mortgage survey affidavit: $50

These are all title-insurance-adjacent regulatory/administrative charges, not settlement
or closing service fees, so they do not constitute a service-stack range.

## Itemization / bundling patterns

Both underwriters' rate manuals affirmatively and explicitly carve settlement/closing/
escrow fees out of their filed premium rates (WFG: "do not include charges for title
search, surveys, escrow, closing services, settlement services..."; Stewart: "do not
include any fee made for title search, title examination, settlement, closing, or escrow
services performed by approved attorneys, agents, or offices"). Maine permits attorneys
or title companies to close real estate transactions (attorney use is optional, per
secondary sources), and neither underwriter nor any independent title company or closing
attorney found in this search publishes a static settlement-fee schedule -- all route
prospective clients to a quote request or an interactive fee calculator instead.

## Metro differences

None found. Both premium rate manuals are statewide flat-rate schedules with no
county/metro tiering. No independent provider published pricing of any kind (metro or
otherwise) to compare.

## Premium rate cards (filed/insurer-filed state)

Maine is an insurer-filed state (not promulgated/rating-bureau). WFG and Stewart file
their own premium schedules with the Maine Bureau of Insurance:
- **Owner's/leasehold policy, up to $750,000**: WFG $3.00/$1,000 (min $100); Stewart
  $3.00/$1,000 (min $100)
- **Loan policy, up to $750,000**: WFG $1.50/$1,000 (finance loan) or $1.75/$1,000
  (acquisition loan) (min $100); Stewart $1.75/$1,000 (min $100)
- **ALTA Homeowner's/Enhanced Owner's Policy**: WFG $3.50/$1,000 (min $150); Stewart
  $3.30/$1,000 (min $110)
- Both cap "over $750,000" liability at "negotiable" / a company-set rate rather than a
  fixed per-thousand increment.
- Stewart's Schedule of Charges is governed by Maine Revised Statutes Title 24-A, §601 and
  requires any deviation to be "filed and approved by the Department of Insurance of the
  State of Maine" -- confirming Maine's insurer-filed (not promulgated) regime.

## Search log (17 query strategies + 10 direct provider-site checks)

Query strategies:
1. "Maine title insurance settlement fee schedule PDF" -- surfaced the WFG manual (used)
   and only blog/aggregator estimate content otherwise.
2. "Maine closing attorney title fees rate schedule" -- only aggregator blog estimates
   ($750-$1,250 attorney flat fee, $248/hr).
3. "Stewart Title Maine rate manual premium schedule" -- surfaced Stewart's Maine rates
   hub page and both Schedule-of-Charges PDF links (used).
4. "'Maine' title insurance rate manual First American OR 'First National Title'
   filetype:pdf" -- no Maine-specific document found (other states only).
5. Maine independent title company "settlement fee" OR "closing fee" schedule dollar --
   surfaced Two Lights Settlement Services fee-calculator page (checked directly, routes
   to First American's interactive facc.firstam.com tool, not a static schedule) plus
   aggregator estimates.
6. Maine title company escrow fee schedule PDF site:.com -- surfaced an out-of-state
   (Centric Title) escrow schedule, not Maine; otherwise only aggregator content.
7. "First American Title" Maine rate manual filetype:pdf -- no Maine document indexed
   (Idaho, Wisconsin, Arizona, Nevada, Pennsylvania documents only).
8. Old Republic Title Maine rates schedule PDF -- surfaced only Old Republic's interactive
   rate-calculator and office-locator pages for Maine; the one PDF rate card found
   (rate-card-2021.pdf) is for Montana, not Maine.
9. Maine real estate attorney closing fee flat fee published "settlement" -- aggregator
   estimates only ($750-$975 settlement fee range cited by iBuyer/Houzeo-style sites, not
   a primary source).
10. FNTI "First National Title Insurance" Maine rate manual -- FNTI's bulletins/manual tag
    pages returned no Maine-specific document.
11. "documentpub.fnti.com" Maine -- only a Utah rate manual indexed on that domain; no
    Maine document found.
12. Maine title insurance agent CPL closing protection letter fee independent agency --
    surfaced the Maine CPL statute (24-A §3202, confirming a single-fee CPL structure) but
    no independent-agency CPL dollar figure beyond WFG's $25.
13. "Vesta Title" OR "Title Alliance" OR "Maine Coast Title" OR "Coastal Title" Maine fee
    schedule -- surfaced Coastal Title Company (Lynch & Newman) and Atlantic Coast Title;
    both checked directly (no published fees).
14. Fidelity National Title Maine rate schedule PDF -- only interactive rate-calculator
    links and a Maine agency contact page; no static Maine rate document.
15. Maine title insurance agent "escrow fee" OR "closing fee" rate sheet -blog -calculator
    -- aggregator content only.
16. "Church Hill" OR "Portland Title" OR "Bangor Title" OR "Katahdin Title" Maine closing
    fee -- surfaced several real independent Maine title companies (Cumberland Title
    Services/Central Maine Title, Caislean Title/T&B Title of Ellsworth, Preferred Title &
    Closing, Gateway Title of Maine, Liberty Title and Escrow); all checked directly, none
    publish static fees.
17. Maine Bureau of Insurance title insurance rate filings list approved insurers --
    confirmed filings exist via SERFF (filingaccess.serff.com/sfa/home/ME) but SERFF is an
    interactive filing-search database, not a directly fetchable published fee schedule;
    not counted as a usable source without further interactive access this session.

Direct provider-site checks (10): Two Lights Settlement Services (calculator only),
Atlantic Coast Title Company, Sinclaw ("Maine Title Services" page -- fetch returned no
content), Coastal Title Company via Lynch & Newman, Cumberland Title Services + Central
Maine Title, Caislean Title (T&B Title of Ellsworth), Preferred Title & Closing, Liberty
Title and Escrow (Maine branches page -- links to a fee-calculator tool, no static
figures), Gateway Title of Maine (Bangor location page), Stewart's Maine rates hub page
(stewart.com/en/state-pages/maine-agents/rates.html).

## Notes for future sessions

- Maine's SERFF public filing portal (filingaccess.serff.com/sfa/home/ME) was identified
  but not searched interactively this session -- a future session with browser/interactive
  access could search it for additional insurer premium filings (though SERFF filings are
  typically premium-only and unlikely to contain settlement-fee schedules, per the pattern
  in every other insurer-filed state surveyed).
- First American, Old Republic, and Fidelity National all maintain Maine pages but route
  exclusively to interactive rate calculators (facc.firstam.com, oldrepublictitle.com/
  rate-calculator/maine, ratecalculator.fnf.com) rather than static published schedules --
  consistent with the calculator-only pattern seen for national-brand direct offices in
  other scarce states (e.g. MD, MN).
- No FNTI-published Maine rate manual was locatable via search (unlike FNTI's indexed
  manuals for TX, UT, NE, FL).


## Calculator harvest addendum (2026-08-21) — Old Republic's 2nd-tool richness pass

Old Republic's second calculator (`ortratecalculator.oldrepublictitle.com`), statewide, SIMULTANEOUS LOAN & OWNERS BASIC: Grand Total Policy & Endorsement Premium — Owners+Lenders combined **$1,600.00** (Owner's $1,500.00 + $100.00 simultaneous surcharge), Lenders-only standalone **$700.00**. In the same range as this state's already-on-file Stewart and FNF entries. Premium-only, no settlement-fee itemization. 5th corroborating provider — ME rises to **calculator-quoted (5 providers)**. See ME.json's newest `basis: "calculator"` entry for full detail.
