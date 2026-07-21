# California Title & Escrow Fee Evidence

## Summary

California is a filed-rate state: each title insurer/underwritten title company files its own
schedule of rates and fees with the California Department of Insurance (CDOI) under Insurance
Code Section 12401.8, and premiums genuinely vary by underwriter (unlike promulgated states).
Settlement/escrow fees are separately filed and, in practice, are usually described by
California title companies as varying by office/branch location rather than being a single
statewide number — several published schedules explicitly punt the escrow fee to "contact your
local office" even while publishing full title-premium rate tables.

Two provider fee schedules were independently retrieved and verified in this session (fetched
and parsed directly, not just summarized from search results):

1. **Corinthian Title Company**, underwritten by North American Title Insurance Company —
   "Partial Schedule of Fees," California, effective February 15, 2021 (revised).
2. **First American Title Insurance Company** — "Guide To California Residential Resale Title
   and Escrow Services," Region 3 (Alameda, Contra Costa, Marin, Santa Clara, San Francisco, San
   Mateo counties), title rates effective March 1, 2026 / escrow fees effective April 30, 2026.

Per the evidence-quality legend (3+ = good, 1–2 = thin), this is **thin** evidence — but the two
sources that were verified are high quality: full, current, exact-dollar rate tables rather than
blog estimates. A significant number of additional real, apparently-published fee schedules were
located via search (Pacific Coast Title, Stewart Title, WFG National Title, Fidelity National
Title, Old Republic Title, California Best Title/NATIC) but could **not** be independently
fetched and verified in this session — see "Thin evidence / search log" below for why, and what
was found but excluded.

## Escrow/settlement fee range actually observed

Only First American's document publishes a priced escrow-fee tier table (Corinthian explicitly
does not publish escrow fees; see below). First American's Region 3 (SF Bay Area) all-cash
**Residential Sale Escrow Fee** ranges from **$1,100** (transactions up to $250,000) to **$2,500**
(transactions above $2,000,000), rising in defined steps, e.g. $1,460 up to $550,000, $1,800 up
to $850,000, $2,000 up to $1,050,000, $2,390 up to $2,000,000. For a financed purchase, First
American adds a separate, exactly-published **"New Loan Services Escrow Fee"** of **$430 for one
loan, plus $200 for each additional loan** — i.e. a $500,000 financed purchase would run roughly
$1,460 (escrow) + $430 (loan tie-in) = **~$1,890** before any title premium, recording, or other
add-ons. A Short Sale or For-Sale-By-Owner transaction adds a flat **+$500** to the applicable
escrow fee.

Corinthian Title's public "Partial Schedule of Fees" does **not** price the escrow fee at all —
it states verbatim: *"The escrow fee charged on transactions is determined by the location of the
Corinthian Title Company office performing the escrow services. The complete Schedule of Escrow
and Service Fees is available for inspection at your local Corinthian Title Company office."*
This is itself a useful data point: even large, DOI-compliant published "partial schedules" in
California routinely omit the settlement/escrow fee from public disclosure while fully itemizing
title insurance premiums.

Neither of the two verified documents itemizes doc prep, courier, wire, e-doc, e-recording,
notary/signing, search/exam, CPL, or binder fees as separate priced line items. Both instead use
catch-all bundling language:

- Corinthian: *"Additional charges are made for special services, processing fees, associated
  services rendered in connection with the issuance of any policy, endorsement and/or services
  performed."* On its refinance-rate page specifically: *"Additional fees may be charged for
  services such as recording, process service fee, sub-escrow fees, wire transfer fees and
  overnight delivery charges"* — named but not priced.
- First American: *"The charges shown in this Guide for escrow services apply to Basic Escrow
  Services for a residential resale transaction as described in the complete California Schedule
  of Escrow Fees. Depending on the specific services provided, additional Charges may be made."*
  and *"Pricing herein does not include governmental fees, including recording fees, mortgage
  registration tax or conservation fee, or fees for other services excluded from the definition
  of Basic Escrow Services..."*

Pattern: the escrow/settlement fee tier itself is usually presented as one flat, price-tiered
number that already bundles the "basic"/"ordinary" escrow work (settlement statement prep,
funds handling, disbursement, closing coordination). Itemized line items like doc prep, courier,
wire, and notary/signing are reserved as separately-billed "additional charges" only when
non-basic/non-ordinary services are needed — and the exact dollar amounts for those add-ons are
almost never published in these consumer-facing guides (only the two exceptions both companies
did publish — First American's New Loan Services fee and Short Sale/FSBO surcharge — were
captured).

## Title insurance premiums (filed-rate, for context)

Since CA premiums are filed per-insurer rather than promulgated, here is what the two verified
schedules show at two comparison points:

| Sale/policy price | Corinthian (underwritten by NATIC) Basic/CLTA-Standard rate | Corinthian Homeowner's Policy | First American EAGLE Owner's Policy (Region 3) | First American Standard Owner's Policy (Region 3) |
|---|---|---|---|---|
| $500,000 | $1,480.00 | $1,628.00 | $1,746 | $1,587 |
| $1,000,000 | $2,280.00 | $2,508.00 | $2,723 | $2,475 |

These are not directly comparable apples-to-apples (different policy types, different
underwriters, different county footprints — Corinthian's table covers 28 CA counties, First
American's Region 3 covers 6 Bay Area counties only) but they illustrate real filed-rate
divergence between underwriters at the same price point, consistent with CA being a filed-rate
(not promulgated) state. Corinthian also separately publishes a refinance-only rate table:
$385 up to $250,000 liability, rising to $4,100 up to $5,000,000 (plus $600 per additional
$1,000,000 above that).

No standalone CLTA (California Land Title Association) rate survey or DOI-hosted aggregated rate
comparison was found to be directly fetchable in this session (see log below); the only CLTA
reference located was First American's own "Member of: ... California Land Title Association"
listing.

## Thin evidence / search log

**Tooling limitation encountered:** in this session, the WebFetch tool returned HTTP 403 on the
overwhelming majority of URLs attempted — including plainly innocuous, non-title-industry control
URLs (e.g. `example.com`, `example.org`, `en.wikipedia.org`, `sec.gov`, `cnn.com`) — while raw
Amazon S3 object URLs (`s3-us-west-1.amazonaws.com`, `first-american-bucket.s3.amazonaws.com`)
consistently succeeded. This indicates the fetch path in this environment is being blocked by
bot/WAF protection (or IP-reputation blocking) on most vendor domains rather than any
site-specific access restriction, and is not something that could be routed around beyond finding
alternate unprotected mirrors of the same public documents (which is how the two S3-hosted PDFs
above were ultimately retrieved and verified).

Real, apparently-legitimate published fee/rate schedules were **located via search** for the
following additional providers, but could **not** be independently fetched/verified via WebFetch
in this session, so no figures from them are included in CA.json:

- **Pacific Coast Title Company** — "Escrow Fees and Charges" (`documents.pct.com/industry-documents/EscrowEFF9-30.pdf`, and a 2015-dated mirror at `pct.com/industry-documents/EscrowEFF9-30.pdf`). WebFetch returned 403 on every attempt against `pct.com`/`documents.pct.com`. Search-engine-summarized snippets suggested tiered escrow fees and a courier charge, but the numbers returned were inconsistent across repeated identical queries (e.g. one summary cited "$500" and another cited "$350" for the same described tier), so nothing from this source was trusted enough to publish.
- **California Best Title / NATIC** — `calbesttitle.com/wp-content/uploads/sites/269/2023/08/CBT_-_NATIC_Rate_Schedule.pdf`. 403 on every WebFetch attempt (WordPress/Cloudflare-hosted).
- **Stewart Title** — rate book at `prioritytitle.biz/assets/files/Stewart-Ratebook.pdf` and Stewart's own filed rate manual at `virtualunderwriter.com` (redline filing eff. 4/3/2023). Both 403'd on every attempt.
- **WFG National Title** — `wfgunderwriting.com/.../California Title and Escrow Rate Manual effective 2-1-2024.pdf` and `wfgtitle.com/.../WFG-California-Rate-Book-7.1.2022-Up-to-5-Mil.pdf`. Both 403'd.
- **Fidelity National Title** — rate book at `realtor-info.com/fid/fntfees/...` and an Issuu-hosted CA rate document. Both 403'd.
- **Old Republic Title** — CA "Guide to Closing Costs" at `ortconline.com/Web2/downloads/english/california/guide-to-closing-costs.pdf` and its rate-calculator landing page. Both 403'd.
- **California Department of Insurance** rate-filing index pages (`insurance.ca.gov/.../title-insur-rate-filings/...`) — these list which companies filed rate changes and when, but are index/list documents, not fee schedules themselves; also 403'd on fetch attempts.

Also checked and explicitly ruled out as **not usable** (found, but not a real fee schedule):

- `firstam-bucket` "Closing Costs: Who Pays What in California" (`10892-transfer-taxes-who-pays-what-california.pdf`) — successfully fetched and read in full, but it is a county-by-county *who-customarily-pays* transfer-tax/escrow-split reference, not a priced fee schedule (no dollar fee amounts for escrow/title service work itself).
- Consumer blog posts on "typical California escrow fees" (e.g. 805escrow.com, Renee White Team, Legacy SF Homes) — these give rule-of-thumb estimates ("base amount ($400–$600) plus $2.00 per $1,000 of sale price") rather than a named provider's own published rate card, so they were excluded per the evidence rules.

Queries used in this search included: "California title company fee schedule pdf escrow fee",
"California escrow fee schedule filed rate title company", "'schedule of fees' OR 'rate schedule'
California title company site:.com filetype:pdf escrow charges", plus provider-specific queries
for Fidelity National Title, Placer Title, North American Title, Stewart Title, Pacific Coast
Title, WFG National Title, Chicago Title, Westcor Land Title, and Title365, and several
S3/CDN-targeted queries used to locate fetchable mirrors.

## Sources used (verified via direct fetch)

- Corinthian Title Company, "Partial Schedule of Fees," California, effective Feb 15, 2021 (revised): https://s3-us-west-1.amazonaws.com/ctc-site/brochures/Residential+Rate+Schedule+-+North+American.pdf (same document also linked from https://cdn.corinthiantitle.com/brochures/ResidentialRateBook-CTC-DOMA.pdf, which could not be fetched directly in this session)
- First American Title Insurance Company, "Guide To California Residential Resale Title and Escrow Services," Region 3, title rates eff. March 1, 2026 / escrow fees eff. April 30, 2026: https://first-american-bucket.s3.amazonaws.com/local-firstam-com/live/assets/documents/ca/-shared/ca-rates/10288-ca-residential-rates-region-3.pdf

Retrieved and verified 2026-07-21.
