# Michigan — Market Fee Evidence

## Status: complete (scarce market) — 6 verified premium sources, 0 published settlement/service-fee schedules + 4 calculator-basis providers (**calculator-quoted (4 providers)**, threshold crossed 2026-08-02; 4th provider added 2026-08-19)

## Richness pass (2026-08-19) — FNF national rate calculator, Wayne County
`ratecalculator.fnf.com` (already-solved recipe, reused nationwide), Wayne County (Detroit, MI's
actual most-populous county — the existing 3 providers used Washtenaw/Lenawee instead). Premium-only,
no Disclosure/Adjustment split for MI: Owner's Final Policy Premium $2,436.00, Loan Final Policy
Premium $1,372.00, Grand Total $3,808.00. See MI.json's 4th `"basis": "calculator"` entry for full
detail.

Michigan is a filed-rate (insurer-filed, not promulgated) state for title insurance premiums, and
premium schedules count as "good sources" under the completion contract for filed-rate states.
This session verified **6 directly-fetched title insurance premium rate manuals** spanning all 4
major national-brand underwriters active in Michigan: Stewart Title Guaranty (2 vintages: 2024
and 2025), First National Title Insurance Company (FNTI), First American Title (2 vintages: Basic
2020 and Eagle 2023), and WFG National Title Insurance Company (2025). That clears the
contract's 6-source floor on the premium side. However, **not one of the 6 sources — nor any
other document found across 15+ distinct query strategies and direct provider-site checks —
prices settlement, escrow, or closing service fees with an actual dollar figure.** Every source
that addresses the point explicitly states settlement/search/exam charges are separate from
the filed premium and left to the agent/office to set, undisclosed. This is the same market-opacity
pattern already documented in AZ (independent agencies quote-only, no static fee schedule) and
CO (settlement fees filed privately with the regulator, not published), so MI's settlement-fee
research track is marked **complete (scarce)** even though its premium-rate-manual coverage is
comfortably above the saturation floor. No further settlement-fee-specific searching is likely to be
productive absent a change in market practice.

## All-in service-stack range observed

**None available.** Zero of the 6 verified Michigan sources contain a settlement, escrow, or
closing service fee dollar figure. The only quasi-service charge found anywhere is Stewart's and
WFG's identical "Work Fee" / "additional work charge" of **$300/hour**, billed only for unusual
complexity or multiple chains of title — not a standard settlement fee. Secondary, non-verified web
search snippets (not independently fetched, not treated as evidence) repeatedly cited a
$300–$800 range for Michigan "title settlement fee," but no title company, escrow office, or
underwriter published a static, dated fee schedule confirming any figure in that range this session.

## Itemization / bundling patterns — and a notable regulatory shift

Michigan's premium/settlement-fee bundling convention **changed mid-research window** for at
least one underwriter:

- **Stewart's 2024-02-26 vintage** was titled "ALL-INCLUSIVE RESIDENTIAL SCHEDULE OF
  CHARGES FOR TITLE INSURANCE" and stated the premium "include[s] all ordinary charges
  including... the title search, tax search, title examination, commitment, and policy" — i.e., search/
  exam costs were bundled into the premium, Tennessee-style.
- **Stewart's 2025-02-17 vintage** (filed less than a year later) drops the "all-inclusive" framing
  entirely, replacing it with: "The charges are risk rates for title insurance only and do not include
  any fees or costs for title searches, title examinations or any other fees for services that might
  be charged by the Company or agents." The Owner's Policy minimum rate also rose from $375 to
  $450 (+20%) across the same filings — consistent with unbundling search/exam costs out of the
  premium and into a separately charged (but still unpublished) service fee.
- **FNTI's 2023 manual** and **WFG's 2025 manual** both use the "risk rate only" framing already,
  explicitly excluding "title search, title examination, closing, or escrow services" from the premium
  (FNTI General Rule F; WFG Section 1).
- **First American's** rate sheets (both Basic 2020 and Eagle 2023 vintages) carry a standing
  disclaimer: "This is not a complete Schedule of Fees. To see a complete Schedule of Fees,
  please contact your local First American Title office" — confirming a fuller (unpublished) fee
  schedule exists but isn't distributed publicly.

Two underwriters' 2025 rate figures are identical at several tiers (Stewart's $450 Owner's minimum
/ WFG's $450 Owner's minimum, same per-thousand step schedule), a cross-underwriter
corroboration worth noting even though neither prices settlement fees.

## Premium rate card (filed-rate state)

Michigan requires title insurers to file premium rate manuals; all 6 verified sources are such
filings. Representative Owner's Policy premium (residential, base tier, 2025 vintages): **$450**
minimum up to $20,000 of liability (Stewart and WFG identical); FNTI and First American's older
vintages show **$375** (2023) and **$375** (2020) respectively at the same tier, evidencing typical
year-over-year premium inflation independent of any settlement-fee question. Full liability-tiered
schedules for Owner's, Loan, Homeowner's/Eagle (expanded coverage), MDOT, foreclosure
guarantee, and lender's bulk-rate products are recorded verbatim in MI.json.

## Not used / found-but-blocked

- **prioritytitle.biz/fee_schedule.php** (independent MI title agency) — page fetched successfully;
  it is a gateway linking to Stewart, First American, and Westcor rate-card PDFs, but does not
  itself publish a settlement/closing fee schedule. No dollar figures on the page itself.
- **sterling-title.com/document-library-rates/** (independent MI title agency, Sterling Heights) —
  fetched; hosts only underwriter Basic/Eagle rate sheets (used above as sources), plus closing
  instructions/deed templates. No settlement-fee schedule of its own.
- **oldrepublictitle.com/michigan/state** — fetched; Old Republic's MI state office page has no
  linked rate cards or fee schedules of any kind (contact-only page). No Old Republic MI premium
  or settlement-fee document was found via search either, despite Old Republic providing detailed
  escrow fee schedules in other states surveyed (WA, CA).
- Multiple named independent MI title agencies (Community Title, Absolute Title, Continental
  Title, and generic "Michigan title company fee schedule" searches) returned no company-specific
  fee-schedule documents — only third-party blog/calculator estimate pages (ConsumerAffairs,
  Houzeo, ListWithClever, Rocket Mortgage, etc.), which are excluded as non-primary sources per
  the evidence rules.

## Search log (15+ distinct query strategies + direct provider-site checks)

1. "Michigan title insurance rate manual settlement fee schedule PDF"
2. "First American Title Michigan closing fee schedule PDF"
3. "Old Republic Title Michigan escrow fee schedule filetype:pdf"
4. "Stewart Title Michigan rate manual closing fee"
5. "WFG Michigan escrow closing fee schedule PDF"
6. "Old Republic Title Michigan closing fee schedule PDF"
7. "Michigan title company \"closing fee\" schedule site:.com filetype:pdf"
8. "Michigan independent title agency fee schedule buyer seller closing costs Detroit Grand Rapids"
9. "\"sterling-title.com\" Michigan fee schedule closing"
10. "Michigan title company \"our fees\" OR \"closing fee\" $ escrow settlement site:*.com -blog"
11. "\"title company\" Michigan \"closing fee\" \"$\" pdf schedule -blog -calculator"
12. "Michigan title agency \"settlement fee\" OR \"closing fee\" $500 OR $600 OR $700 buyer seller"
13. "\"Community Title\" OR \"Absolute Title\" OR \"Continental Title\" Michigan closing fee schedule"
14. "Michigan title company website \"fee schedule\" OR \"closing costs\" page real estate settlement"
15. "Old Republic Title Michigan office locations" (→ direct fetch of resulting office page)

Plus direct provider-site fetches: prioritytitle.biz, sterling-title.com document library,
oldrepublictitle.com/michigan/state, and all 6 underwriter rate-manual PDFs (via WebFetch +
Read-tool binary-PDF recovery, since WebFetch cannot parse FlateDecode-compressed PDF
streams directly — same recovery technique used in prior sessions for CA/GA/NC/WA).

## Calculator harvest (2026-07-24, separate from the published-schedule survey above)

Found and harvested **Modern Title Group** (Ann Arbor, Washtenaw County) — see MI.json's
`basis: "calculator"` entry for full itemized figures. Unlike every underwriter rate manual
above (premium-only, zero settlement-fee dollar figures despite exhaustive search), this
independent company's own website (`moderntitlegroup.com/Calculator/Rate`) ships a genuinely
itemized buyer/seller/refi fee calculator whose complete logic (title-insurance-premium
formula plus 6 flat ancillary fees: closing, recording, courier, wire transfer, deed escrow,
title search) lives as hardcoded constants in its own client-side JS (`/js/views/
rateCalculator.js`), fetchable via plain HTTP GET with no JS execution or personal data
required. This is the first genuine MI settlement-fee evidence found in this survey. The same
company's site also links to a Qualia Connect widget and a TitleCapture-hosted quote page —
both logged as jsOnly in CALCULATORS.md; only the custom Vue calculator was harvestable
statelessly. MI calculator-basis status: 1 provider — below the 3-provider threshold (see
PROGRESS.md tracker); 2 more MI-specific working calculators are needed to cross it. A
same-technique check of Independent Title Services' MI rate calculator
(independenttitle.services/michigan-rates-calculator) found only a premium-only client-side
formula (no settlement/closing fee itemization) — excluded as out of scope for the calculator
mission (duplicates the premium-only evidence already on file, adds no settlement-fee signal).

**Update 2026-07-25**: found and harvested a second MI provider, **Knight Barry Title Group**
(`knightbarry.com`) — its own ASP.NET rate calculator (`dashboard.knightbarry.com/Rates/
michigan-rate-calculator.aspx`, statewide formula, no county tiering) was cracked via a plain
`__doPostBack`/`__VIEWSTATE` HTTP replay (the same WebForms-postback technique that worked on Old
Republic's ortconline.com tool and FNF's ratecalculator.fnf.com — no browser needed). Itemized:
Loan Closing Fee $350.00, Transaction Security Fee $25.00/side, Loan Policy premium $1,372.00,
Owner's Policy premium $2,435.60 — a materially different fee structure from Modern Title Group's
own (6 separate named ancillary fees) despite both being "independent" MI providers. MI now has 2
of the 3 providers needed to cross the calculator-quoted threshold.

**Update 2026-08-02 — 3rd provider found, MI crosses the calculator threshold.** The 2026-07-27
session logged **Prestige Title Insurance Agency** (Adrian/Tecumseh/Manitou Beach, Lenawee County)
as gated on the TitleTap/NetSheetCalc platform (`non-auth-ajax.php?action=getAppData` 404s for its
`app_id=385`). This session discovered (via AZ's Arizona Premier Title tenant, same platform) that
TitleTap has migrated to a newer backend — `getNetSheetConfig` action under a `/company/` path, plus
a separate `api/index.php/rate/<amount>/<rate-key>` endpoint for tiered fields — and retried Prestige
Title's tenant against it: **not actually gated**, just stale documentation of a platform migration.
Result at $500k purchase/$400k loan, Lenawee County: Closing Fee $425.00 (flat), Owner's Title
Insurance Premium $2,436.00, Lender's Title Insurance Premium $1,372.00, Deed Recording Fee $30.00,
Deed Certification Fee $5.00, Recording Service Fees $10.00, Mortgage Recording Fee $30.00. No
CPL/notary/doc-prep/search/exam fields exist in this tenant's schema at all — a leaner fee structure
than Modern Title Group's. This crosses MI to 3 calculator-basis providers (Modern Title Group,
Knight Barry, Prestige Title) — **calculator-quoted (3 providers)**. See CALCULATORS.md's
2026-08-02 entry for the full `getNetSheetConfig`/`api/index.php/rate` recipe.
