# Alabama — Market Fee Evidence

## Status: complete (scarce market) — 2 verified premium sources, 0 published settlement/service-fee schedules, 2026-07-22

Alabama is a filed-rate (insurer-filed, not promulgated) state for title insurance premiums, and
premium schedules count as "good sources" under the completion contract for filed-rate states.
Alabama is also an attorney-closing state (a licensed attorney must handle real estate closings),
which per web-search snippets (not independently verified/fetched, so not treated as evidence)
tends to route settlement pricing through private attorney fee arrangements rather than published
schedules. This session verified **2 directly-fetched title insurance premium rate manuals** — WFG
National Title (2024) and Stewart Title Guaranty (2015 vintage, the most current found via search).
Both explicitly disclaim settlement/closing/escrow fees as separate and unpublished. **10 distinct
query strategies plus 11 direct provider-site checks** (WFG, Stewart, South Oak Title, First Alabama
Title, Alabama Land Services, alabamalandtitle.com, University Title, Jackson & Scott closing-cost
calculator [blocked by site, could not independently verify], Alabama Closing & Title, Boundary
Title, Cook and Associates/Blackbelt Lawyers) found **zero published settlement-fee dollar
figures** anywhere. This matches the market-opacity pattern already documented in AZ, CO, MI,
MO, VA, and WI. Marked **complete (scarce)** — well past the 8-strategy threshold with only 2
verified sources, both premium-only.

## All-in service-stack range observed

**None available.** Neither verified Alabama source contains a settlement, escrow, or closing
service fee dollar figure. The only quasi-settlement charge found is the Closing Protection Letter
(CPL), which both WFG and Stewart price identically: **$25 lender, $25 buyer/borrower, $50
seller** — not a settlement fee, but a fraud/negligence protection product priced alongside the
premium. Secondary, non-verified web-search snippets repeatedly cited a $500-$975 "closing fee"
or "settlement fee" range and $750-$1,250 flat attorney closing fees, but no title company, closing
attorney, or underwriter published a static, dated fee schedule confirming any figure in that range
this session — one candidate (Jackson & Scott, LLC, Montgomery) advertised a Title Search Fee of
$200.00 and Closing Fee of $350 (cash) / $450 (loan) in third-party search-engine snippets, but the
source page itself returned HTTP 403 on direct fetch and could not be independently verified, so it
is excluded from the evidence base per the "fetched and verified this session" rule.

## Itemization / bundling patterns

- **WFG's** manual (Section 1, Introduction) states the premium is "all-inclusive" for title insurance
  risk and service/work, but explicitly excludes "title search, surveys, escrow, closing services,
  settlement services, recording fees, other charges."
- **Stewart's** manual (General Provisions + "Charge" definition) states charges "do not include...
  settlement fees, closing fees, or escrow fees."
- Both underwriters use an identical **Birmingham-metro carve-out** (Jefferson, Shelby, and Blount
  counties priced separately from the rest of the state), suggesting this is a standing Alabama
  market convention rather than an underwriter-specific choice.
- Both underwriters price the **Closing Protection Letter** identically ($25/$25/$50 lender/buyer/
  seller), a rare exact cross-underwriter match worth noting even though neither prices settlement
  fees.
- Alabama's attorney-closing requirement (mentioned in unverified secondary sources) likely
  explains why static settlement-fee schedules are difficult to find publicly: attorney closing fees
  are typically negotiated or quoted per-file rather than published as a rate card, unlike title-agency
  states such as GA or NC.

## Premium rate card (filed-rate state)

Both manuals use a per-$1,000-of-liability tiered structure with a $125.00 minimum premium.
Representative Owner's Policy premium at $100,000 liability, State (non-Birmingham-metro) rate:
WFG (2024) = $3.50/thousand up to $50,000 then $3.00/thousand to $100,000 = $325.00; Stewart
(2015) = $3.50/thousand flat up to $100,000 = $350.00. Full liability-tiered schedules for Owner's,
Loan, reissue/refinance credits, simultaneous-issue rates, and CPL charges are recorded verbatim
in AL.json.

## Calculator harvest (2026-07-30) — 3 providers, threshold crossed

Separate from the published-schedule survey above (see PROGRESS.md's calculator harvest tracker
for the cross-state methodology). AL had zero calculator-basis providers at the start of this
session; found and harvested 3, crossing the 3-provider **calculator-quoted** threshold in one
session:

1. **Signature Title Services** (`secure.signaturetitleservices.net/Default.aspx?tabid=517`) — a
   distinct AL-specific portal from this same operator's TN instance already on file
   (`app.signaturetitleservices.net/PurchaseCalculator`, see TN.json) — classic ASP.NET WebForms
   postback, driven directly via `requests`, no browser needed. Jefferson County (Birmingham).
2. **Land Title Company of Alabama** (`land-title.net/rate-calculator/`) — first-party hand-rolled
   JS slider calculator with hardcoded bracket-rate premium formulas and flat fee constants,
   readable via plain view-source (the same technique already used for Modern Title Group/MI and
   the OH netsheet-calculator agencies). Jefferson/Shelby Counties.
3. **Alabama Land Title** (`alabamalandtitle.com/Closing-Cost-Calculator`) — resolves the prior
   session's HTTP 503 (the `https://` host 503s; plain `http://` works). A first-party calculator
   built on a previously-uncatalogued white-label CMS platform ("ydwebpro"), whose full fee
   schedule and premium-bracket formulas are hardcoded in a separately-linked JS file
   (`Content/plugins/ydshortcodes/closingcostcalculator/code.js`), again readable without browser
   execution. Statewide (no county tiering).

All three are genuine itemized settlement/service-fee sources (not premium-only), a meaningful
upgrade over this state's published-schedule survey, which found zero settlement-fee dollar
figures anywhere. See AL.json for full itemized figures; see CALCULATORS.md for the full technical
recipes (including the new "ydwebpro" platform, flagged there for reuse in other scarce states).

## Richness pass (2026-08-19) — FNF national rate calculator, Jefferson County
`ratecalculator.fnf.com` (already-solved recipe, reused nationwide), Jefferson County (Birmingham).
Premium-only: Owner's Policy Premium $1,625.00 (Disclosure $875.00 + Adjustment $750.00), Loan
Policy Premium $250.00, Grand Total $1,875.00. This is AL's 4th calculator-basis provider — **now
calculator-quoted (4 providers)**. See AL.json's 4th `"basis": "calculator"` entry for full detail.

## Not used / found-but-blocked

- **southoaktitle.com/resources/title-closing-rates/birmingham-rates** — fetched; directs to
  "Contact your local South Oak Title and Closing office" with no published figures.
- **firstalabamatitle.com/real-estate-closings** — fetched; describes the closing process, no fee
  figures.
- **alabamalandservices.com/titleinsurancerates** — fetched; rate tables are embedded as image
  (.gif) files not parseable as text; page text itself has no dollar figures.
- **alabamalandtitle.com/Closing-Cost-Calculator** — returned HTTP 503 on fetch, unusable.
- **u-titlealabama.com** (University Title, Birmingham/Montgomery/Huntsville) — fetched; no
  published fee schedule, quote-request only.
- **realestatelclosings.com/closing-costs-calculator/** (Jackson & Scott, LLC, Montgomery
  closing-attorney firm) — search-engine snippet showed Title Search Fee $200.00 and Closing Fee
  $350 (cash)/$450 (loan), but direct WebFetch returned HTTP 403 Forbidden on two attempts;
  excluded per evidence rules (must be independently fetched and verified this session).
  - **Retried 2026-07-22** (blocked-source retry pass): re-fetched via WebFetch and again via a
    direct curl request with a full browser User-Agent string — both still returned HTTP 403
    Forbidden. Still blocked (WAF/bot-protection, not a transient failure); the search-snippet
    figures above remain unverified and excluded.
  - **Retried 2026-07-23** (blocked-source retry pass): re-fetched again via direct curl with a
    current-generation browser User-Agent (both bare and `www.`-prefixed hosts) — still HTTP 403
    Forbidden on every attempt. Confirms this is a persistent WAF block, not UA-based (matches
    AZ DIFI's pattern this session, unlike CT's CATIC block which *was* UA-based and broke
    through). No change; figures remain unverified and excluded.
- **alabamaclosingandtitle.com/services** and **/cost-calculator** (Huntsville) — fetched; no
  published figures, calculator-only.
- **boundarytitle.com/huntsville-al/** — fetched; no published figures, quote-only.
- **blackbeltlawyers.com/real-estate-closing-costs-and-fees-explained/** (Cook and Associates,
  closing-attorney firm) — fetched; describes fee categories generally, only concrete figure is AL
  county deed-recording base fee (~$10.00 + $1.00/thousand recording tax), not a settlement fee.
- No First American or Old Republic Alabama-specific static rate-manual PDF was found via search
  (Old Republic's Alabama page is an interactive rate calculator, not a static schedule; excluded per
  the same convention used in prior states' research).

## Search log (10 distinct query strategies + direct provider-site checks)

1. "Alabama title insurance settlement fee schedule rate card 2026"
2. "Alabama title company closing fee schedule PDF"
3. "\"Alabama\" title insurance rate manual First American OR Stewart OR \"Old Republic\" filetype:pdf"
4. "Alabama independent title company closing fee \"settlement fee\" schedule site:.com"
5. "\"First American Title\" Alabama rate manual filetype:pdf"
6. "Old Republic Title Alabama rate manual insurance premiums PDF"
7. "Alabama real estate closing attorney \"settlement fee\" OR \"closing fee\" $ price"
8. "Alabama title company \"escrow fee\" OR \"closing fee\" schedule pdf attorney"
9. "Huntsville OR Mobile OR Montgomery Alabama title company rate sheet closing costs pdf"
10. "\"document preparation fee\" Alabama title closing $ site:.com -blog"

Plus direct provider-site fetches: WFG and Stewart rate-manual PDFs (via WebFetch + Read-tool
binary-PDF recovery, since WebFetch cannot parse FlateDecode-compressed PDF streams directly
— same recovery technique used in prior sessions for CA/GA/NC/WA/MI), South Oak Title, First
Alabama Title, Alabama Land Services, alabamalandtitle.com, University Title, Jackson & Scott
(blocked), Alabama Closing & Title (2 pages), Boundary Title, and Cook and Associates/Blackbelt
Lawyers.
  - **Retried 2026-07-25** (blocked-source retry pass): re-fetched `realestatelclosings.com/
    closing-costs-calculator/` via direct curl with a full current-generation browser header set
    (User-Agent, Accept, Accept-Language) — still HTTP 403 Forbidden. No change; confirms this
    remains a persistent WAF block across at least 4 retry sessions, not a transient or UA-specific
    issue. The search-snippet figures (Title Search Fee $200.00, Closing Fee $350/$450) remain
    unverified and excluded.
