# New Mexico (NM) — Market Fee Evidence

## Status: complete (scarce market) — 6 verified published sources + 1 calculator-basis provider (not yet at the 3-provider calculator threshold), 2026-07-22

## Calculator harvest (2026-07-22)
Old Republic Title's public **Estimated Rate/Fee Calculator**
(https://www.ortconline.com/Web2/productsservices/informationservices/ratefeecalc/default.aspx) was
driven directly via HTTP GET/POST (ASP.NET WebForms postback replication, no browser/JS execution)
for the standard $500,000 purchase/$400,000 loan scenario, **Albuquerque (Bernalillo County)**.
Result: Courier Fee $30, Recording Fees E-File $60.74, Lender's Title Policy $100 (of $1,770 total).
Owner's Title Policy shown "(seller paid)", Total $717.00 (full ALTA Owner's Policy rate $2,387 + $100
concurrent-issue charge − $1,770 lender's premium). Section C (shop-for) total: $190.74. The $2,387
full owner's-rate figure is a genuine additional NM OSI-promulgated-rate data point on top of the
single settlement-fee source (Centric Title & Escrow) already on file — an independent (calculator)
channel corroborating the regulator-set premium schedule. Full entry recorded in NM.json with
`"basis": "calculator"`. No personal information was entered (Name/Company fields are optional and
were left blank). This is 1 calculator provider; the task's 3-provider threshold was not reached this
session (see CALCULATORS.md).

New Mexico is a **promulgated-rate state**: title insurance PREMIUMS are set by the New Mexico
Title Insurance Law and promulgated by the Office of Superintendent of Insurance (OSI), uniform
across every title insurer/agent in the state at a given liability amount. OSI's own promulgated-
forms packet (NM Form 49) states this in plain language: *"New Mexico title insurance premium
rates are set every other year or approved by the New Mexico Superintendent of Insurance... The
Superintendent of Insurance does not regulate other title company charges."* That second sentence
is the crux of this survey: SETTLEMENT/CLOSING/ESCROW fees in NM are unregulated and left to the
market, which is exactly the segment this survey needed to capture — and which turned out to be
genuinely scarce despite an exhaustive search (20+ query strategies, 30+ direct provider-site
checks).

## Regulatory backbone (uniform statewide, not a market signal)

- **OSI Table of New Mexico Promulgated Title Insurance Premiums and Charges**, adopted June 27,
  2025 (`osi.state.nm.us`, fetched and machine-read this session): a full transaction-code table of
  roughly 150 endorsement/service charges. Owner's/Loan policy premium by liability tier (e.g.
  $100,000 → $707/$636; $500,000 → $2,387/$2,148; $1,000,000 → $4,032/$3,629); High Liability
  brackets above $50,000; Closing Protection Letter (NM's CPL equivalent) promulgated at **$0, no
  charge**, for both single- and multiple-transaction CPLs; "unusual complexity" 15% surcharge;
  additional-chain-of-title charge $50; abstract retirement credit 25% up to $100; cancellation fee
  left as "reasonable and appropriate" rather than a fixed figure.
- **Cross-verified against two independent provider restatements of the same table**: WFG National
  Title's 2025 rate card (effective July 1, 2025) and Centric Title & Escrow's own 2022 issuing-
  agent rate card (effective July 1, 2022) are **numerically identical to each other and to the OSI
  table** at every tier checked — meaning the promulgated rate has not changed since at least 2022.
- **A third, older data point** — Fidelity National Title Group's 2012-vintage NM rate table
  (hosted via Las Cruces Abstract and Title's document library at `lcat.net`) shows **meaningfully
  higher** premiums at every tier (e.g. $100,000 → $831 owner's/$748 90%-loan, vs. $707/$636 in the
  2022-2025 tables; $500,000 → $2,807/$2,526 vs. $2,387/$2,148). This is evidence the promulgated
  premium was **reduced** sometime between 2012 and 2022 and then **held flat** through mid-2025 —
  a genuine, if secondary, regulatory-history finding.
- Because the premium is fixed and carries no market signal, the real question for this survey is
  the unregulated settlement/closing/escrow fee — documented below.

## Observed all-in SERVICE-fee-stack range (the real signal — premiums don't vary)

Only **one** genuine real-estate purchase/refinance settlement-fee schedule was found and verified
this session:

- **Centric Title & Escrow, LLC** (Albuquerque + Rio Rancho, Bernalillo/Sandoval County):
  closing/settlement fee = **base $595 + $1.00 per thousand of the sales price + NM gross receipts
  tax**. At representative sale prices this works out to roughly **$695** at $100,000, **$795** at
  $200,000, **$1,095** at $500,000 (before gross receipts tax, which in NM runs roughly 5-9%
  depending on locality). Plus ~20 separately itemized ancillary fees (title binder $100, mortgagee
  policy $225, credit report $60-65, appraisal $525, survey $225, home warranty $399, etc. — full
  list in NM.json).

With only **one** priced real-estate settlement-fee data point, there is no multi-provider range to
test for cross-source stability — this is the central reason NM is classified **scarce** rather than
**saturated** (see reasoning section below), even though 6 total "good source" documents were
verified.

Two additional provider-published fee schedules were found and verified — **New Mexico Escrow
Solutions** (statewide) and **Sunwest Escrow** (Albuquerque) — but both are **RLD-licensed
loan-servicing/mortgage-payment-collection businesses**, not real-estate closing agents (see the
Itemization/bundling section immediately below). Their fees (escrow/servicing fee $20-22/month
tiered by payment size, wire $25, overnight $50, close-out $200-250, etc.) are retained in NM.json
for completeness and transparency but are **explicitly excluded** from the real-estate
settlement-fee-stack range above, because they price an entirely different service (ongoing
collection of seller-carry/contract-for-deed payments over the life of a note) rather than a
one-time purchase/refinance closing.

## Itemization / bundling patterns

- **Structural finding (OSI vs. RLD licensing split):** New Mexico's Regulation and Licensing
  Department (RLD) licenses "escrow companies" as a category distinct from title companies, but
  explicitly **exempts title companies performing real-estate closing/escrow services** from that
  licensing requirement. The practical effect: every RLD-licensed "escrow company" this session
  could find (New Mexico Escrow Solutions, Sunwest Escrow) turned out to be a loan-servicing/
  mortgage-collection business administering ongoing payment streams on privately-held notes or
  contracts for deed — not a real-estate settlement agent. This is analogous in shape to Alaska's
  AS 21.66.370/460 statutory premium-vs-escrow split (see `AK.md`), but structurally different: in
  NM it is a licensing-category carve-out (title companies are exempt from RLD escrow licensing),
  not two separate rate filings for the same transaction type. Real-estate title companies in NM
  are free to set settlement fees however they like, and — unlike Alaska — nothing requires them to
  file or publish a schedule.
- **Centric Title & Escrow's explicit no-charge list** is a useful market-structure data point in
  its own right: the company's published fee sheet states it does **not** charge separately for
  e-doc, email, wire transfer, or tax transfer affidavit fees, explicitly labeling these as "misc.
  fees that may be charged by title company" — an implicit acknowledgment that other NM providers
  *do* charge separately for these items, even though no other provider's itemized schedule for
  them was locatable this session.
- Centric's core closing/settlement fee is **formula-based** (base + per-thousand-of-sale-price +
  gross receipts tax) rather than a flat number or a tiered flat-fee table — a different pricing
  convention from the flat-fee-by-tier conventions seen in prior TX/FL sessions.
- Every national-brand underwriter checked (First American, Fidelity National/Chicago Title, Old
  Republic, Stewart, WFG) published **premium-only** rate cards with zero settlement/escrow fee
  content — consistent with the OSI/RLD structural finding above: underwriters file/restate the
  promulgated premium, but settlement fees are an individual agent's own unregulated, unfiled
  pricing decision, and apparently a much less commonly *published* one in NM than in other states
  surveyed.

## Metro differences

- **Albuquerque / Bernalillo County (+ Rio Rancho / Sandoval County):** the only metro with a
  genuine, verified real-estate settlement-fee schedule (Centric Title & Escrow, two office
  locations). Also the location of both loan-servicing-escrow companies found (New Mexico Escrow
  Solutions is statewide but appears to operate out of the Albuquerque area; Sunwest Escrow is
  based in Albuquerque).
- **Las Cruces / Doña Ana County:** only thinly covered — the Fidelity National 2012 premium table
  is hosted by Las Cruces Abstract and Title (`lcat.net`), giving it partial relevance as a
  southern-NM data point, but it is premium-only with no settlement-fee content of LCAT's own.
  Direct checks of San Juan Title (`sanjuantitle.com`) for a Farmington-area schedule and other
  southern-NM independents did not turn up a usable settlement-fee schedule (see Search log).
- **Santa Fe / Santa Fe County:** **no verified settlement-fee source found** despite multiple
  targeted search strategies (see Search log) — a clear metro-coverage gap for this state. Every
  Santa Fe-area title company checked (Eastern Title, others found via search) either had no
  pricing published or was unreachable/off-topic.
- No source in this survey distinguishes purchase vs. refinance settlement-fee pricing (Centric's
  formula scales with sale price and does not appear to vary by transaction type; the two
  loan-servicing entries are not purchase/refinance transactions at all).

## Search log (far exceeding the 8-strategy exhaustive-search threshold)

1. "New Mexico title insurance rate manual promulgated premium schedule OSI"
2. "New Mexico title company closing fee escrow fee schedule Albuquerque pdf"
3. "\"New Mexico\" title insurance settlement fee schedule filetype:pdf"
4. "New Mexico OSI promulgated title insurance premium table 2025"
5. "Centric Title Albuquerque escrow fees rate sheet pdf"
6. "WFG National Title New Mexico rate card 2025 pdf"
7. "Fidelity National Title New Mexico rate table pdf"
8. "New Mexico escrow company license RLD closing settlement"
9. "\"Santa Fe\" title company closing fee escrow schedule New Mexico"
10. "\"Las Cruces\" title company closing fee escrow schedule New Mexico"
11. "San Juan Title Farmington New Mexico rates pdf"
12. "New Mexico Land & Title Company rate chart Albuquerque"
13. "\"Assurance Title\" Albuquerque OR \"Title Alliance of New Mexico\" fee schedule closing
    settlement pdf"
14. "site:nmlta.org member directory title companies New Mexico" (New Mexico Land Title Association
    member list, used to identify additional independent agents to check directly)
15. NM OSI website direct navigation for the current promulgated forms/rates packet
16. "New Mexico Escrow Solutions fees" / "Sunwest Escrow Albuquerque fees"
17. "First American Title New Mexico rate schedule pdf" / "Old Republic Title New Mexico rate
    schedule pdf" / "Chicago Title New Mexico rate schedule pdf" / "Stewart Title New Mexico rate
    schedule pdf" (national-brand underwriter checks)
18. "Pioneer Abstract Title Alamogordo fee schedule" / "Landmark Title Roswell Clovis rates"
19. "Southwestern Title Escrow New Mexico fee schedule"
20. Wayback Machine check on `sanjuantitle.com` PDF path after live 404

### Verified and used this session (6 total)

1. NM OSI promulgated premium/charges table (regulatory backbone)
2. WFG National Title 2025 rate card (premium cross-verification)
3. Centric Title & Escrow — 2023 escrow/settlement fee schedule + 2022 premium rate card (the
   only genuine real-estate settlement-fee source found)
4. Fidelity National Title 2012 rate table via `lcat.net` (premium, older vintage, cross-verifies
   the 2012→2022 rate decrease)
5. New Mexico Escrow Solutions (loan-servicing escrow, different market segment)
6. Sunwest Escrow (loan-servicing escrow, different market segment)

### Found but not usable (dead links, off-topic, or no dollar figures despite a working fetch)

- **sanjuantitle.com/pdf/SJT-2022-Rates-to-500K.pdf** — consistently 404 both via WebFetch and a
  direct `curl` status check; homepage HTML has no `.pdf` links at all. Also checked the Wayback
  Machine for a cached copy — none found. Dead link.
- **nmltco.com** (New Mexico Land & Title Company, Albuquerque) — homepage embeds `Rate-Chart.jpg`
  and `Rate-Chart2.jpg` image references, but both image URLs return Apache 404 pages when fetched
  directly (likely a broken relative-path/CDN configuration on the site). No text-extractable rate
  data recoverable. Also checked via the NM Land Title Association member-directory listing for
  this company — the listing itself contains no fee data, only a link back to the same broken site.
- **rgtc.com** (expected to be Rio Grande Title Company) — redirects to an Afternic domain-parking
  "for sale" page; the domain has apparently lapsed. Excluded.
- **fitico.com/rates/** — turned out to be Fidelity Title Company of Yakima, WASHINGTON, not New
  Mexico; wrong-jurisdiction result, excluded.
- **First New Mexico Title & Abstract** — site fetched; no pricing/fee schedule published anywhere
  on the site.
- **Pioneer Abstract & Title (Alamogordo)** — fee information present but rendered as an image, not
  extractable text; no usable dollar figures recovered.
- **Landmark Title (Roswell/Clovis)** — site fetched; no pricing published.
- **Southwestern Title & Escrow** — site fetched; no pricing published.
- **Eastern Title (Santa Fe)** — site fetched; no pricing published — the closest this survey came
  to a Santa Fe-specific source, and it did not pan out, consistent with the Santa Fe coverage gap
  noted above.
- **Title Alliance of New Mexico** (`taofnewmexico.com`) — found via search (address/phone/site
  only in results); no fee schedule located on or linked from the site.
- **Assurance Title (Albuquerque)** — no fee schedule located via search or direct site check.
- The 280-page **NM OSI "2024 Promulgated Title Insurance Forms"** PDF turned out to be blank ALTA
  policy/endorsement form TEMPLATES (Owner's Policy NM Form 1 through NM Form 95) with
  placeholder `[Premium: $___]` fields — not a rate table. Its only usable content was confirming
  the CPL is "No charge" (NM Form 81/81.1) and providing the NM Form 49 regulatory-text excerpt
  quoted at the top of this document.
- Every national-brand underwriter's NM page checked (First American, Old Republic, Chicago Title/
  Fidelity National, Stewart) returned premium-only content or an interactive rate calculator with
  no static settlement-fee fallback — the same underwriter pattern seen in TX and FL.

## Saturation reasoning (honest caveat)

This session found **6 total good-source documents**, comfortably past the 6-source saturation
floor by raw count, and ran **20 distinct query strategies plus 30+ direct provider-site checks**,
comfortably past the 8-strategy exhaustive-search threshold. On raw numbers alone this could look
like a borderline "saturated" case. However, applying the saturation test *as written* — "the last
3 [sources] added did not move the observed all-in service-stack range... by more than ~10%" —
requires a genuine multi-point range of comparable real-estate settlement fees to test for
stability. NM has **exactly one** such data point (Centric Title & Escrow's formula). The other two
non-regulatory sources found (New Mexico Escrow Solutions, Sunwest Escrow) price a structurally
different service — ongoing loan-servicing/collection-escrow, not real-estate closing — and cannot
be averaged into or compared against a real-estate settlement-fee range without conflating two
different markets. This is the same situation documented for Indiana (IN) and Vermont (VT)
elsewhere in `PROGRESS.md`: roughly 6 total good sources, but only one (or a structurally
incompatible set) of genuine settlement-fee data points, meaning there is no range whose stability
can honestly be tested. Following that same precedent, NM is marked **complete (scarce market)**
rather than saturated: the market for *published* NM settlement-fee schedules is genuinely thin —
independents overwhelmingly do not publish pricing, and the state's licensing structure actively
routes the search toward a different (loan-servicing) business type — despite an exhaustive,
far-past-threshold search effort.

## Calculator harvest addendum (2026-08-06) — FNF national rate calculator

**2 of 3 calculator-basis providers** (prior: 1 (Old Republic — ortconline.com, Albuquerque/Bernalillo County)). See NM.json's newest
`basis: "calculator"` entry for full itemized figures and methodology.

- **national FNF-family shared rate calculator** (`ratecalculator.fnf.com`) —
  WORKING. Bernalillo County (state param confirmed supported in the tool's own county dropdown).
  Driven via plain HTTP POST (Python `requests.Session()`, not WebFetch) replaying the classic
  `__doPostBack`/`__VIEWSTATE` ASP.NET WebForms flow already documented in this project's
  CALCULATORS.md and previously used for CT/CO/AR: select county + underwriter + Next → select
  "Property Purchase" transaction type (own postback) → enter Purchase Amount $500,000 and Loan
  Amount $400,000 together (own postback on the loan field, reveals any further conditional
  questions) → auto-answer any newly-revealed required Yes/No question with its first listed
  option → click Finish for the Rate Summary. Result at $500,000/Bernalillo County: **Grand Total
  $2,487.00 (Owner's Policy Premium $2,387.00 + Title Commitment $100.00)**. No Loan Policy premium appeared anywhere in the flow despite the $400,000 loan
  amount entered (same behavior already documented for this tool's NV/AR entries) — recorded as-is.
  Premium-only output is valid calculator-harvest evidence per the 2026-08-05 CT-session scoping
  correction. Same Bernalillo County used as Old Republic's existing entry. This tool's only non-premium line item found for NM is a flat $100.00 Title Commitment fee.

## Calculator harvest addendum (2026-08-08) — WFG National Title

**3 of 3 calculator-basis providers — crosses the 3-provider threshold** (prior: 2 (Old Republic — Albuquerque/Bernalillo County; FNF national rate calculator — Bernalillo County, Grand Total $2,487.00)). See NM.json's newest `basis: "calculator"` entry for full itemized figures and methodology.

This session solved `rates.wfgnationaltitle.com`'s `POST /api/rates/fees/estimatefeesforsellernet` endpoint, flagged since 2026-08-07 as the single highest-value remaining lead (a genuine 5th major underwriter, separate from the FNF/Old Republic/Stewart/First American families already on file, confirmed via `GET /api/rates/State/GetCalculationEnabledStates` to cover 47 states + DC). The prior session's blocker was a payload-shape guess — this session extracted the real request schema directly from the calculator's own lazy-loaded Angular route chunk (`prepareCalculateFeeRequest()` in webpack chunk 7, hash `8a01902021d264bdb338`): a nested `Properties: [{City, County, IsPrimary, State}]` array, not the flat `PropertyState`/`PropertyCounty`/`PropertyCity` fields tried previously. Full technical recipe in CALCULATORS.md's 2026-08-08 entry. No personal data required.

- **WFG National Title Insurance Company** (`rates.wfgnationaltitle.com`) — WORKING. Bernalillo County (NM's most-populous/standard-scenario county), Albuquerque, NM, $500,000 purchase / $400,000 loan, SettlementStatementVersion `CD`. Result: Owner's Title Insurance Premium **$2,387.00**, premium-only (no itemized HUD-fee lines configured for NM in this tool). Loan Policy premium returned $0/null in every state tried this session, consistent with this tool's seller-net-sheet (seller-side) design — not pursued further as out of scope.

**NM now calculator-quoted (3 providers)** — WFG National Title crosses the threshold.
