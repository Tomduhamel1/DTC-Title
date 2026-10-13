# Washington — Market Fee Evidence

## Status: complete (saturated) — 7 verified providers, 8 documents, 2026-07-21

Washington meets the completion contract's saturation bar: 7 independently verified,
directly-fetched providers, spanning national-brand underwriters (Old Republic, WFG) and
independent county-based title/escrow companies (CW Title, Grays Harbor, Puget Sound,
Spokane County Title, Equity Title). The 2 most recently added sources (Spokane County
Title, Equity Title) both price purchase and refinance escrow fees that fall comfortably
within the range already established by the prior 5 providers ($700-$2,900 purchase,
$430-$695 refinance) — neither pushes the observed min or max by more than ~10%. Marked
**complete (saturated)**.

## All-in service-stack range observed

For a typical residential purchase in the $300K–$500K band, base settlement/escrow fees
(pre-tax, before any itemized add-ons) ranged roughly **$1,180 (Grays Harbor) to $2,600
(CW Title)**, with Old Republic (2023) at $2,000–$2,400, Puget Sound Title at
$1,960–$2,430, Spokane County Title at $1,500–$1,700, and Equity Title at $2,200–$2,400
for the same band — all 7 providers cluster within the pre-existing range. For refinance,
flat fees clustered tightly: **$430–$695** (Old Republic, WFG, Puget Sound Title, Spokane
County Title, Grays Harbor's half-fee-or-$400 rule, Equity Title's core-county $430-$450
vs. outside-county $675-$695), with CW Title's $525/$625 loan-tiered refi fee in the same
band. WFG's schedule stood out for having no published purchase-price tier at all — only
flat refinance and negotiable commercial rates. Equity Title's core-4-county
($430-$450) vs. outside-county ($675-$695) refinance pricing — a ~54% premium outside
King/Pierce/Thurston/Snohomish — is the most explicit geographic bundling differential
found in WA, reinforcing county/metro-area variance as the dominant driver of WA
settlement-fee spread (consistent with the pattern already observed across the other 6
providers' county-specific schedules).

## Itemization / bundling patterns

Every provider files the base escrow/settlement fee as a "minimum charge for standard/
ordinary services," reserving the right to add "additional work charges" for complexity/risk
beyond the ordinary. Sub-escrow (lien payoff/disbursement) fees are itemized separately by
all five providers, in a tight $150–$350 band. Reconveyance fees ($325–$450+) and
document-prep fees ($75–$175, sometimes tier-based) are consistently broken out. A recurring
bundling pattern is a **capped "included" signing/notary session**: Old Republic bundles one
signing session per side up to $150 into the base fee (overage passed to the party); Puget
Sound Title fully bundles courier, doc prep, e-doc printing, wire fees, and credit-card
payoffs into its flat refinance fee, explicitly excluding only recording fees, mobile-home
processing, and notary fees. CW Title similarly bundles sub-escrow, 1031 exchange handling,
and certain doc prep into one $150 line, but itemizes wire/courier/multiple-payoff handling
separately at $95/side. Grays Harbor is the most granular, itemizing courier, wire, email/
edoc, sign-up, and re-draw as distinct line items, and separately discloses its 9.08% local
sales tax add-on directly on the rate card — WA sales tax applies to escrow fees and varies by
county/jurisdiction.

## Premium rate card (filed-rate state)

Washington is a filed-rate (not promulgated) state — RCW 48.29.193/195 requires escrow rate
schedules to be filed with the Office of the Insurance Commissioner (OIC) at least 15 days
before their effective date, submitted directly to OIC staff rather than through SERFF.
Stewart Title Guaranty Company's WA title insurance premium rate manual (Rate Filing No.
2016-02, effective 2016-11-09, linked from Puget Sound Title's rate-sheets page) confirms the
filed-rate mechanism and shows builder/subdivider/multiple-issue discount structures varying
by county (27%–70% of General Schedule Rate depending on transaction type and county) — this
covers title insurance premiums, not escrow/settlement service fees, so it is not included as
a settlement-fee source in WA.json. Old Republic's 2017-vintage combined document also shows
title insurance premium tiers alongside escrow (e.g., $500,000 Owner's Policy Standard =
$1,307.00 as of May 2017).

## Not used / found-but-blocked

All 6 verified documents fetched successfully once binary PDF/image content was routed
through direct file reading. Two additional leads were pursued but yielded no usable
Washington-specific document: a First American Title "Schedule of Residential Fees and
Services" PDF (effective 2025-01-01) that on inspection was for **Illinois** counties (Cook,
DuPage, Grundy, Kane, Kendall, Lake, McHenry, Will), not Washington — discarded as wrong-state;
and Fidelity National Title, where only an Arizona escrow schedule surfaced publicly (WA
schedule not found — only an online rate calculator at rates.fntg.com, not a downloadable
schedule).

- **First American Title (WA):** No publicly posted Washington-specific escrow/closing fee
  PDF found despite multiple query phrasings; only their national rate calculator and an
  Illinois-specific schedule surfaced.
- **Fidelity National Title (WA):** Same pattern — no static WA PDF found; only office listing
  pages and a rate calculator.
- **Washington Land Title Association (WLTA):** No published fee survey found.
- **OIC filed-rate database:** No public searchable portal for individual title/escrow
  filings was found; OIC's own guidance directs requesters to submit a records request or
  email to obtain specific filed schedules — the providers above chose to self-publish
  instead, which is why they were findable.

## Additional sources found this session (2026-07-21)

- **Spokane County Title** (`spokanetitle.com/rates-escrow`) — fetched directly (HTML,
  no PDF recovery needed); full price-tiered residential schedule, effective 2024-01-01.
- **Equity Title of Washington** (`equitywa.com/docs/ETW_EscrowFees_Flyer_Digital.pdf`) —
  WebFetch's summarizer failed on the PDF text; recovered via the Read-on-saved-binary
  technique. Notable for its explicit core-county vs. outside-county refinance pricing
  differential.
- Also found via search but not fetched (time/priority): Whatcom Land Title
  (`whatcomtitle.com`, PDF fetched but Read-recovery also failed — image-based/scanned
  PDF), Stevens County Title (`stevenscountytitle.com`, PDF not attempted this session).
  These remain candidates if WA needed further sources, but the state already meets
  saturation without them.
- Queries run this session: "Washington title company escrow fee schedule pdf 2025 2026
  rate sheet [excluding known providers]", "Chicago Title Washington escrow fee schedule
  pdf rate card" — Chicago Title's WA-specific schedule was not found (results returned
  IL/AZ documents instead, consistent with the prior session's finding).

## Sources

See `WA.json` for full structured records with source URLs.
