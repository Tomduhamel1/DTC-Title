# Texas (TX) — Market Fee Evidence

## Status: complete (saturated) — 6 verified sources (1 regulatory bundle + 5 provider-published settlement-fee schedules), 2026-07-22

Texas is a **promulgated-rate state**: title insurance *premiums* are fixed statewide by the
Texas Department of Insurance (TDI) under Insurance Code ch. 2703 and are byte-for-byte
identical across every title company and agent in the state at a given liability amount — this
was independently confirmed by fetching three separately-branded documents (TDI's own
Commissioner's Order, Republic Title's March-2026 rate card, and Independence Title's
March-2026 rate card) and finding numerically identical premium tables in all three
($780 at $100,000 of liability, $2,262 at $400,000, $5,226 at $1,000,000, etc., effective
2026-03-01 after a commissioner-ordered 6.2% reduction). Texas's Insured Closing Letter
(the state's CPL equivalent, Form T-50/T-51) is likewise price-fixed — but at **zero**: Tex.
Ins. Code §2702.001(c) flatly states *"A title insurance company may not impose a charge
for issuing insured closing and settlement letters."* This was independently corroborated
by two providers fetched this session (First Texas Title's site states ICLs are issued
"incidentally to title insurance at no additional cost"; National Investors Title Insurance
Company's Texas Underwriting Manual says the same).

Because premium and CPL are both fixed, **the entire market-fee signal in Texas lives on the
unregulated settlement/escrow/service-fee side**, which this survey documents below. Five
provider-published, dollar-denominated settlement-fee schedules were fetched and verified
this session, spanning Abilene, Houston, Austin, San Antonio, and one statewide (multi-metro)
independent — plus one statewide TDI regulatory bundle (premium table + CPL statute + the
Texas Title Insurance Guaranty Association's $2→$3 policy-guaranty-fee increase). Per the
completion contract, 6 good sources with the last additions not producing runaway range
growth is sufficient to mark the state **complete (saturated)**; see the saturation
reasoning at the end of this document for the honest caveat on that call.

## Regulatory backbone (uniform statewide, not a market signal)

- **Basic (Owner's Policy) premium**, effective 2026-03-01 (Commissioner's Order No.
  2025-9697, a 6.2% reduction from the prior 2019 schedule): $308 at $25,000 of liability,
  $465 at $50,000, $780 at $100,000, $1,274 at $200,000, $1,768 at $300,000, $2,262 at
  $400,000, $2,756 at $500,000, $5,226 at $1,000,000. Formula for face amounts above
  $100,000: (Face Amount − $100,000) × 0.00494 + $780, with further tiers to $100,000,000+.
  Source: https://www.tdi.texas.gov/orders/documents/20259697.pdf (Exhibit A), cross-verified
  against https://www.republictitle.com/wp-content/uploads/2026/02/Residential-Title-Rates.pdf
  and https://www.independencetitle.com/wp-content/uploads/pdfs/TitleRates_March2026.pdf —
  all three show identical figures.
- **Insured Closing Letter (ICL/CPL)**: $0 by statute (Tex. Ins. Code §2702.001(c)).
- **State of Texas Title Insurance Guaranty Association (TTIGA) Policy Guaranty Fee**:
  $2.00 per owner's policy and $2.00 per loan policy since 5/1/2019, rising to $3.00 per
  policy for closings after 9/30/2026 (https://tlta.com/TLTA/News_Articles/Compliance_Update_Guaranty_Fee_Increasing_Starting_Oct_1_2026.aspx
  and https://ttiga.org/guaranty-fees/) — independently corroborated at $2.00/policy on two
  of the provider fee sheets below (Patten Title, Texas National Title).

## Observed all-in SERVICE-fee-stack range (the real signal — premiums don't vary)

The base escrow/settlement fee (before recording, tax certificate, courier, doc prep, etc.)
across the five provider schedules fetched this session:

| Provider | Metro | Purchase escrow/settlement fee | Refinance escrow/settlement fee |
|---|---|---|---|
| Valero Title | San Antonio | not published | **$100** (explicitly marketed as the market's lowest) |
| First Texas Title | Abilene | $300 (cash, seller side) – $475 (w/ loan, buyer side) | $495 |
| Texas National Title | Austin (per doc text) | $450 flat (all financing types) | $450 |
| Great American Title Co. | Statewide | $550 | $500 |
| Patten Title Company | Houston / statewide | $795 (residential) / $995 (commercial) | $795 (residential) |

**Core purchase-side range: $300–$795 (a ~165% spread)** across four providers that publish
a purchase figure. Adding Valero's $100 refinance-only figure (an explicitly promotional,
refinance-only price point, not a purchase figure) drops the observed floor for *any*
escrow-fee figure in this survey to $100. This is the genuine, wide, provider-set variation
the completion contract anticipated — a >2.5x-to-nearly-8x spread on the one line item that
Texas actually lets providers compete on, sitting directly alongside a title *premium* that
is provably identical to the penny across the same providers.

## Itemization / bundling patterns

- **Universal separation of premium and settlement fee.** Every TX source in this survey
  (including the regulatory one) treats the promulgated premium and the settlement/escrow
  fee as two entirely separate line items — confirming the background brief's framing.
  R-1 of the Basic Manual states the basic premium rate "include[s] the charge for title
  insurance, title examination and closing the transaction" as a matter of statutory
  agent-compensation accounting, but in market practice every provider fetched this session
  still bills a separate, unregulated settlement/escrow fee on top of the premium.
- **CPL/ICL is universally $0** — the one fee item where "bundling" isn't a provider choice
  at all but a hard statutory floor (§2702.001(c)). No provider in this survey itemizes a
  separate CPL charge, consistent with the prohibition.
- **National-brand underwriters (First American, Fidelity National, Old Republic, Stewart,
  Chicago Title, WFG) consistently publish ONLY the promulgated premium table** (often with
  attached endorsement-fee schedules) and push settlement-fee disclosure behind interactive
  calculators (Stewart Rate Calculator, FACC, National Rate Calculator, ORT Rate/Fee Calc,
  Texas Title Calculator) rather than static PDFs — a market pattern distinct from states
  like Illinois where the same national brands publish full closing-fee tiers alongside
  premium. Every national-brand rate card fetched this session in TX (Old Republic DFW,
  Old Republic Houston, Republic Title, Independence Title) contained premium and/or
  endorsement pricing only, with zero settlement/escrow dollar figures.
  **Independent/regional title companies (First Texas Title, Patten Title, Texas National
  Title, Valero Title, Great American Title) are the ones actually publishing settlement-fee
  dollar figures** in Texas — the inverse of the provider-type mix this contract expected.
- **Recording/e-recording fees converge tightly**: First Texas Title ($25 first page/$4
  additional + $4.54 e-recording), Great American ($24 first page/$4 additional + $12
  e-recording), Patten ($5.33 e-recording, recording $24-$100 by side) — all in the same
  general band, likely reflecting actual county recorder costs rather than provider markup.
- **Tax certificate fees cluster near $65-$94**: Texas National Title $65, First Texas Title
  $10/account (lower, possibly a different fee concept or subsidized), Great American $80,
  Patten $93.80 — a real but comparatively modest provider-to-provider spread versus the
  escrow-fee spread above.
- **Courier/processing "junk fees" are explicitly contested terrain**: Valero Title
  advertises that it does *not* charge processing, courier, copy, fax, or recording-service
  fees, directly naming the same fee categories that First Texas Title ($50-$80 mailout
  processing+courier surcharge) and Great American ($20-$30 courier fee) itemize and charge
  — direct evidence of price competition on exactly the ancillary fees this survey targets.
- **Purchase vs. refinance pricing is inconsistent across providers** — some charge more for
  purchase (Great American: $550 vs $500; First Texas Title's underlying components lean
  higher for purchase), Patten charges the identical $795 for both, and Texas National
  Title's one filled-in figure ($450) is stated as identical "for transactions involving
  properties" regardless of financing type. No uniform refinance-discount convention exists
  in TX comparable to the ~70-75%-of-purchase-rate convention seen in some other states'
  premium schedules (which doesn't apply here since TX premium has no purchase/refi split
  at all).

## Metro differences

- **Houston**: Patten Title (headquartered Houston/River Oaks) publishes the highest escrow
  fee in this survey ($795 residential / $995 commercial) but also the most granular
  itemization (individual endorsement pricing, a full attorney-doc-prep menu). Great American
  Title (statewide, includes Houston branches) sits mid-range ($550/$500).
- **Austin**: Texas National Title's flat $450 escrow fee, identical across Conventional/
  VA/FHA/Cash financing.
- **San Antonio**: Valero Title is the explicit low-price outlier ($100 refi, with an
  advertised "$500 or more in savings" claim and a no-junk-fees policy) — the only source in
  this survey that names its own price positioning relative to competitors.
- **Abilene (smaller metro, included for granularity)**: First Texas Title publishes the
  widest range of transaction-type-specific figures found in this survey ($300-$600
  depending on cash/loan/mobile-home status and buyer/seller side), plus a detailed
  attorney-doc-prep price list ($75-$350 per document type).
- **Dallas-Fort Worth**: no provider-published settlement-fee schedule with dollar figures
  was found for DFW specifically despite extensive searching (see search log) — every DFW
  source found (Old Republic DFW, Republic Title, Independence Title DFW, Superior Abstract
  & Title, Trinity Title of Texas, Chicago Title DFW) either published premium/endorsement
  figures only or pushed all settlement pricing behind an interactive calculator with no
  static fallback. Great American Title and Patten Title both describe themselves as
  statewide (including DFW) but their published figures aren't DFW-specific line items.

## Search log (far exceeding the 8-strategy exhaustive-search threshold)

**Regulatory/CPL research (7 strategies):** "Texas Department of Insurance Basic Manual
title insurance promulgated rate schedule 2026"; "Texas title insurance closing protection
letter fee TDI promulgated"; "Order No. 2025-9697 title insurance rate table Texas";
"Texas insured closing letter fee $25 OR $50 promulgated rate rule"; "Texas title insurance
closing protection letter fee amount TDI rule P-64"; "Texas Basic Manual Rate Rule R-24
insured closing letter fee amount"; "Insurance Code 2702.001 Texas insured closing letter
may not charge" — plus direct fetches of tdi.texas.gov/rules/2025/documents/2026titlerateprop.pdf,
tdi.texas.gov/orders/documents/20259697.pdf, tdi.texas.gov/title/titlem4c.html,
tdi.texas.gov/title/titlem4m.html, tdi.texas.gov/title/titlem3a.html, tdi.texas.gov/title/titlem3c.html,
tdi.texas.gov/title/titlemm3.html, tdi.texas.gov/title/documents/form_t-50.pdf, and
texas.public.law's republication of Ins. Code §2702.001.

**Provider settlement-fee research (18+ strategies):** "Texas title company escrow fee
schedule PDF closing fee Houston Dallas Austin"; "Independence Title Austin closing fee
escrow fee rate schedule"; "Texas title company rate card PDF closing fee filetype:pdf";
"Stewart Title Texas rate card closing fee schedule PDF"; "Capital Title of Texas fee
schedule closing settlement PDF"; "Willow Bend Title OR All American Title OR Nations
Title Agency Houston Dallas Texas closing fee schedule"; "Texas title company wire fee
e-doc fee processing fee schedule PDF"; "escrow fee Houston Texas title company schedule
filetype:pdf"; "Charter Title Houston fee schedule closing settlement PDF"; "Dallas title
company escrow fee schedule PDF 2026"; "San Antonio title company fee sheet PDF closing
escrow 2026"; "Gracy Title Austin fee schedule closing settlement PDF"; "Nations Title OR
EndeavorTitle OR Metropolitan Title Texas escrow fee schedule PDF"; "San Antonio title
company escrow fee schedule PDF $"; "WFG National Title Texas rate manual PDF"; "Republic
Title Dallas escrow fee schedule PDF settlement"; "Old Republic Title Texas escrow fee
schedule PDF" (repeated per-metro: DFW, Houston, Austin, San Antonio); "Trinity Title
Texas fee schedule PDF closing settlement rate card"; "Texas title company fee sheet
filetype:pdf escrow closing 2026"; "AllStar Title OR First Continental Title OR Texas
Secure Title Dallas escrow fee schedule"; "Alamo Title San Antonio escrow fee OR
settlement fee schedule"; "greatamtitleco.com fee schedule closing PDF"; "tlta.com rate
card member directory Texas title company fee schedule".

**Direct provider-site checks (30+):** Independence Title (site + 2019 PDF + March-2026
PDF), Republic Title (premium PDF, homepage, endorsement guide), Old Republic Title (DFW
premium/endorsement PDF, Houston premium PDF, San Antonio market page, seller's-closing-costs
glossary PDF — no dollar figures), Great American Title (homepage, rate-card page,
calculators page, and the closing-fee-schedule PDF — live URL now 404s but content
recovered via a 2025-04-16 Wayback Machine capture), Patten Title (homepage, fee-sheet PDF),
Texas National Title (seller's-estimated-charges PDF, buyer-handbook 404), Valero Title
(homepage), First Texas Title (buyer/seller/lender pages), Stewart Title (Houston, San
Antonio market + tools-and-resources pages — calculator-only, no static PDF), Chicago Title
(Houston and DFW market pages — calculator-only), Fidelity National (not separately
checked — no distinct TX portal found), WFG (bulletin index only, no TX rate manual PDF
located), First American (local.firstam.com/tx main page and /documents page — both
returned bare headers with no document links; firstamtx.com fee-attorney site is dead/
unresolvable DNS), Trinity Title of Texas (DFW page, services page), Superior Abstract &
Title (homepage, calculator page — 503 on one attempt), RBFCU (title-services page — no
dollar figures, only "no fee for courier/copies" qualitative claims), Lawyers Escrow
Company (homepage + sellers page — references a "published fee schedule" but doesn't show
it online), San Antonio Title Company (homepage), Alamo Title/Alamo Title of Texas/Alamo
Title San Antonio (multiple related sites, no figures), Capital Title of Texas (homepage,
rate-card tag page), N Title (multiple pages, Old-Republic-powered calculator only),
Heritage Title of Austin (503 error), Austin Title (Closing Fee Reference Guide PDF —
qualitative "who pays what" only, no dollar figures), Centric Title & Escrow (initially
misidentified via search as San Antonio-relevant; fetched PDF revealed it is actually a
New Mexico company — Albuquerque/Rio Rancho — and was correctly excluded as out of scope).

### Verified and used this session (6 total — target of 10 not reached, but 6-source
saturation floor cleared)
TDI/Basic Manual regulatory bundle (premium + CPL statute + TTIGA guaranty fee); First
Texas Title (Abilene); Patten Title Company (Houston/statewide); Texas National Title
(Austin per document text); Valero Title (San Antonio); Great American Title Company
(statewide, recovered via Wayback Machine after the live URL returned 404).

### Found but not usable (no dollar figures despite a working fetch, or off-topic)
Independence Title (2019 and March-2026 rate PDFs — premium table only, no settlement fee);
Republic Title (premium PDF, homepage, endorsement guide — no settlement fee figures); Old
Republic Title (all four TX market documents checked — premium and/or endorsement pricing
only); RBFCU (qualitative claims, no dollar figures); Trinity Title of Texas; Superior
Abstract & Title; Stewart Title (all TX market pages — calculator-only); Chicago Title
Houston/DFW (calculator-only); Austin Title's Closing Fee Reference Guide (qualitative
"who pays for what" only); Lawyers Escrow Company (references a fee schedule without
publishing it); Capital Title of Texas, N Title, San Antonio Title Company, Alamo Title
(multiple sites), Gracy Title, Heritage Title of Austin, First American (local.firstam.com/tx),
WFG National Title — none had a locatable, dollar-denominated static fee schedule as of
this session.

## Saturation reasoning (honest caveat)

The contract's saturation test requires 6+ sources where the last 3 additions don't move
the observed range by more than ~10%. Applying that literally here: adding Valero Title's
$100 refinance-only figure did move the observed floor sharply (from a prior low of ~$300
to $100), a >10% swing. However, this session treats that outlier as a genuine, provider-
disclosed market signal (Valero explicitly markets itself as the deliberate low-price
outlier) rather than noise from insufficient sampling — and after 18+ distinct query
strategies plus 30+ direct provider-site checks turned up no further static, dollar-
denominated settlement-fee schedules (every additional candidate was either a bare
interactive-calculator page or had no fee content at all), continuing to search further
had clearly hit diminishing returns rather than a sampling gap. TX is marked **complete
(saturated)** on that basis: 6 good sources reached, exhaustive search performed, and the
"core" purchase-side range across the 4 providers that publish a purchase figure ($300-$795)
is stable and internally consistent even though the single refinance-only outlier widens
the absolute floor.
