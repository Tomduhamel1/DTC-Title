# Rhode Island (RI) — Market Fee Evidence

## Calculator harvest (2026-08-15)

Separate from the published-schedule survey below, 1 calculator-basis quote was harvested for the
standard scenario ($500,000 purchase / $400,000 loan / Providence County / residential resale) —
below the 3-provider calculator-quoted threshold this session. See RI.json's `"basis": "calculator"`
entry for full itemized figures and CALCULATORS.md for the technical recipe.

1. **Stewart Title Guaranty Company** — Stewart Rate Calculator (stewartratecalculator.com), matched
   to settlement office **Warr & Warr, PC**, a Riverside RI closing-attorney firm — confirming RI's
   attorney-closing custom already noted in the published-schedule survey below. Unusually rich
   itemization for this survey's New England scarce states: Title Closing Fee $1,725.00 ($875 buyer/
   $850 seller), Title Examination Fee $500.00 ($375/$125), Title Courier Fee $85.00 ($40/$45), Title
   E Recording Fee $30.00 (buyer), Title Municipal Lien Certificate $25.00 (buyer), Owner's Premium
   $1,750.00, Lender's Premium $1,000.00 (simultaneous), recording fees, and Rhode Island's real
   estate conveyance tax $3,750.00 (100% seller-paid).

**2nd/3rd-provider search (dead ends this session)**: Old Republic's 2nd tool (`Location=RI`) NoBot-
blocked, same as ME this session — the Referer-header fix alone did not resolve it. Priority Title
Company's RI closing-cost calculator (`prioritytitlecompany.com/purchase-cash`) is a Wix SPA with no
discoverable static API — jsOnly. Absolute Title, LLC does not maintain a real RI calculator (see
ME.md's note this session — `ratecalculator_ri.asp` resolves to a generic fallback page). A
NetSheetCalc/TitleTap agency search surfaced "Island Title & Escrow Agency" (appid 396) but it is
Merritt Island, FLORIDA-based and FL-only (`approved_states: [FL]`) — not an RI provider, excluded.

## Status: COMPLETE (scarce market) — 1 document / 1 provider verified

Only 1 document verified despite 12+ query strategies and extensive direct
provider-site checks: WFG National Title Insurance Company's Rhode Island
Rate Manual (effective 2023-03-01), a premium-only (with a notable
"risk + service/work portion" bundling wrinkle) filed rate schedule. No
independent title/escrow company, closing-attorney firm, or national-brand
direct office (Stewart, First American, Old Republic, Fidelity National,
Chicago Title) was found to publish a static, dollar-denominated
settlement/closing fee schedule. Marked **complete (scarce)**.

## Key market structure finding

Rhode Island is a genuine insurer-filed, prior-approval rate state: R.I.
Gen. Laws § 27-2.6-16 states "No title insurer may charge any rates
regulated by the state ... except in accordance with the premium rate
schedule and manuals filed with and approved by the commissioner in
accordance with the provisions of chapter 44" -- confirmed, on direct
review, to address *only* premium rate schedules, with no parallel
statutory requirement to file escrow/settlement/closing fees (unlike
Oregon's OAR 836-080-0365 or Idaho's IDAPA 18.05.01.022). R.I. Gen. Laws
§ 27-2.6-3 separately *defines* an "escrow, settlement, or closing fee" as
"the consideration for supervising or handling the actual execution,
delivery, or recording of transfer and lien documents and for disbursing
funds" -- confirming the legal category exists and is distinct from the
title premium -- but does not require it to be filed or published.

Rhode Island is also, per multiple closing-attorney firms' own service-page
descriptions (Bilodeau Capalbo, Slepkow Law, Palumbo Law), a practical
attorney-closing state: closings are customarily handled by a real estate
attorney representing each side, similar to Massachusetts and Connecticut,
even though (unlike MA) an attorney is not statutorily mandated. This
matches the MA/CT market-opacity pattern where the closing-attorney layer
tends not to publish flat-fee pricing online, preferring direct
consultation.

Rhode Island's Division of Insurance does route Property & Casualty and
title-adjacent filings through the NAIC's public SERFF Filing Access portal
(filingaccess.serff.com/sfa/home/RI), which DBR's own guidance says allows
public rate-filing review "from your home, office or anywhere ... at any
time ... no charge." However, direct access to this portal returned an
HTTP 403 in this session -- the search-and-browse interface itself appears
to require interactive navigation/session cookies rather than a directly
fetchable URL, so it could not be used to compile a fuller filed-rate
picture the way Kansas's static document-listing page could.

## Verified sources

1. **WFG National Title Insurance Company** — Rhode Island Title Insurance
   Rate Manual, effective March 1, 2023 (PDF-recovery technique). Basic
   Rate Table: Owner's Policy $3.50/$1,000 up to $2,000,000 liability
   ($3.00/$1,000 above), Acquisition Loan $2.50/$1,000, Finance/Refinance
   Loan $1.50/$1,000; $100 minimum; $25 flat CPL fee. Notably, the manual's
   General Rules describe the rate as covering "both the risk portion and
   the service or work portion" while still excluding title search,
   escrow, closing, and settlement services -- a distinctive partial-bundle
   structure not seen as explicitly stated in most other states surveyed.

## Observed service-stack range

**No comparable range can be established.** No independent settlement/
closing/escrow fee dollar figure was independently verified for Rhode
Island from any source in this survey.

## Itemization / bundling patterns

- WFG's manual is the only Rhode Island document found that quantifies a
  non-premium charge at all: the $25 CPL fee, explicitly structured as "a
  single fee ... for the protection of all parties" (buyer/borrower and
  lender combined), rather than the per-party CPL tiering seen in some
  other states (e.g. Kentucky's Stewart $50/$25/$25 lender/buyer/seller
  split).
- The "risk portion and service or work portion" bundling language in
  WFG's General Rules is worth flagging for marketBaseline documentation:
  it suggests Rhode Island's filed premium may already compensate for some
  title-search/exam labor, similar in spirit (though not necessarily in
  magnitude) to Tennessee's regulatory All-Inclusive Rate structure — but
  unlike Tennessee, RI's rule is a WFG-specific manual provision, not a
  statewide regulatory mandate, so this pattern cannot be assumed to hold
  for other Rhode Island underwriters without their own manuals to compare.
- Bilodeau Capalbo, LLC's "Seller Representation Flat Fee $400" page
  (bilodeaucapalbo.com) was found and directly fetched, but its visible
  page text contains **no dollar figure anywhere** -- the "$400" appears
  only in the URL slug, likely a stale/renamed page whose pricing content
  was later removed. Per the evidence rule requiring exact quotes from
  content actually present on a fetched page, this candidate is excluded
  and logged as unverifiable (matching the precedent set by New
  Hampshire's unverifiable "$199" flat-fee claim).

## Premium rate cards

See Verified sources above (WFG, effective 2023-03-01). No Stewart, First
American, Old Republic, or Fidelity National/Chicago Title Rhode
Island-specific rate manual PDF was located; all four route Rhode Island
pricing through interactive online rate calculators only (Stewart's own
"Rate Calculator" page at stewart.com/en/state-pages/rhode-island-agents/
rates; Fidelity/Chicago Title/Commonwealth via rates.fntg.com).

## Metro differences

None found. WFG's Basic Rate Table applies statewide with no county-level
differentiation, and no independent provider's settlement-fee schedule was
verified to allow any metro-level comparison (Rhode Island is small enough
that "metro" distinctions are less common in filed materials generally).

## Search log (12 combined query strategies + direct provider-site checks)

1. "Rhode Island title insurance premium rate regulated filed Department of
   Business Regulation" search — confirmed RI's prior-approval premium-rate
   filing regime (R.I. Gen. Laws Ch. 27-2.6) and surfaced the WFG Rhode
   Island rate manual PDF directly.
2. Direct fetch + PDF-recovery of the WFG Rhode Island Rate Manual
   (effective 2023-03-01) — **verified** (source #1), including the Basic
   Rate Table, $25 CPL fee, and the notable "risk + service/work portion"
   bundling language.
3. "Rhode Island title company closing fee escrow fee schedule PDF
   Providence attorney closing" search — surfaced only aggregator-blog
   commentary (excluded) and Providence Title's homepage.
4. Direct fetch of provtitlenlg.com (Providence Title) — no pricing
   information published; "Contact Us" only.
5. "Rhode Island real estate attorney closing fee flat rate purchase
   refinance" search plus a companion "Rhode Island real estate attorney
   'flat fee' real estate closing website Providence Warwick Cranston"
   search — surfaced several named RI closing-attorney firms (Bilodeau
   Capalbo, Zangari, Johnston Law, Tomassi Law, Slepkow Law, Palumbo Law).
6. Direct fetch of Bilodeau Capalbo's "Seller Representation Flat Fee $400"
   page and companion buyer-representation page — both fetched successfully
   but **contain no dollar figure in the visible page text** (the "$400"
   exists only in the URL slug); excluded as unverifiable per evidence
   rules, matching the NH $199-claim precedent.
7. Direct fetch of Slepkow Law's residential-closings FAQ page — no dollar
   figures found (only a generic mention that "an additional legal fee
   would be required" for zoning verification, no amount given).
8. Direct fetch of Richard Palumbo Law's real-estate-closings page — no
   dollar figures found; services listed (title searches, closing
   disclosures) but no pricing.
9. "Rhode Island title insurance agency escrow closing fee schedule
   published rates independent" search — surfaced Armour Title Company's
   RI-area-served page (fetched, no pricing) and RI statutory text (R.I.
   Gen. Laws §§ 27-2.6-3, 27-2.6-6) confirming the "escrow, settlement, or
   closing fee" legal definition exists but isn't filing-mandated.
10. "Stewart Title Guaranty Rhode Island rate manual pdf
    virtualunderwriter.com" search — confirmed Stewart routes RI pricing
    through an interactive "Stewart Rate Calculator" tool only
    (stewart.com/en/state-pages/rhode-island-agents/rates), no static
    manual found.
11. "First American Title Rhode Island rate manual pdf OR Old Republic
    Rhode Island rate manual pdf" search plus "Chicago Title OR Fidelity
    National Title Rhode Island rate manual pdf premium" search — both
    confirmed all three FNF-family brands (Chicago Title, Commonwealth,
    Fidelity National) and Old Republic route Rhode Island pricing through
    interactive calculators (rates.fntg.com, oldrepublictitle.com/
    rate-calculator) only; one ortconline.com document link that appeared
    promising in search results turned out (on direct fetch) to be an
    unrelated 2015 Adobe Illustrator brand-signoff file, not a rate
    document; excluded. "Title Group" (titlegrp.com) surfaced in search but
    confirmed via direct fetch to be a Tennessee company (Jefferson/Shelby/
    Blount County rate calculator), not Rhode Island; excluded as
    wrong-jurisdiction.
12. "Rhode Island DBR filed title insurance rate manuals list SERFF public"
    search plus direct fetch of dbr.ri.gov's Rate/Rule/Form Filing page —
    confirmed RI routes public rate-filing access through the NAIC's SERFF
    Filing Access portal (filingaccess.serff.com/sfa/home/RI), but a direct
    fetch of that portal URL returned HTTP 403 (interactive search
    interface, not a directly fetchable static listing like Kansas's or
    Idaho's regulator repositories); could not be used to expand coverage
    this session.
13. "Rhode Island real estate closing attorney flat fee dollar-amount"
    search (multiple dollar-amount variants tried) — found no additional
    attorney firm publishing a verifiable, page-visible flat-fee dollar
    figure; all results were aggregator-blog range estimates, excluded per
    evidence rules.

With only 1 verified source despite 12+ query strategies and direct checks
of 9+ named providers (5 closing-attorney firms, 2 independent title
companies, all 5 national-brand underwriters), and Rhode Island's own
statutes confirming escrow/settlement/closing fees are legally defined but
not filing-mandated (unlike premiums), RI meets the contract's scarce
criterion. Marked **complete (scarce)**.
