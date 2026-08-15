# Delaware (DE) — Market Fee Evidence

## Calculator harvest (2026-08-15)

Separate from the published-schedule survey below, 1 calculator-basis quote was harvested for the
standard scenario ($500,000 purchase / $400,000 loan / New Castle County-Wilmington / residential
resale) — below the 3-provider calculator-quoted threshold this session. See DE.json's `"basis":
"calculator"` entry for full itemized figures and CALCULATORS.md for the technical recipe.

1. **Stewart Title Guaranty Company** — Stewart Rate Calculator (stewartratecalculator.com), matched
   to Stewart's own Wilmington office. Returns no itemized settlement fee (null in the tool's
   response) — corroborating this file's central DTIRB/attorney-closing finding below rather than
   representing a gap in the harvest. Genuinely new figures: Owner's Premium $2,275.00, Lender's
   Premium $1,235.00 (simultaneous)/$25.00 (standalone), recording fees (Mortgage $360/Deed $116/
   Release $81), and Delaware's combined Realty Transfer Tax of $20,000.00 on $500,000 (State $12,500
   + New Castle County $7,500, both 50/50 buyer/seller split) — a 4.0% combined rate, the highest
   transfer-tax figure recorded anywhere in this survey.

**2nd/3rd-provider search (dead ends this session)**: Old Republic's 2nd tool (`Location=DE`) NoBot-
blocked, same as ME/RI this session (see CALCULATORS.md — the Referer-header fix is confirmed
unreliable). Web search for a DE-specific attorney or title-agency calculator (New Castle County
focus) surfaced only third-party aggregator estimate calculators (AnytimeEstimate, ListWithClever,
StateCalc, etc.), none of which are a provider's own system — out of scope per this project's
standing `alphaadv.net`-precedent exclusion rule. No genuine second DE provider calculator found.

## Status: complete (scarce market) — 2 verified sources (1 rating-bureau regulatory manual + 1 attorney-published settlement-fee estimate range), 2026-07-22

## DTIRB premium note (regulatory backbone)
Delaware title insurance premiums are set uniformly for all member insurers/agents by the
**Delaware Title Insurance Rating Bureau (DTIRB)**, licensed by the Delaware Insurance Department
under section 2511 of the Delaware Insurance Code, 18 Del. C. Current reference: the **DTIRB Rating
Manual, effective as amended through April 1, 2025** —
https://www.virtualunderwriter.com/-/media/files/virtualunderwriter/imported/pdfs/dtirb-rate-manual-final-approved-04-01-2025.pdf
(recovered this session via PDF stream decompression + content-stream text extraction, since WebFetch's
native PDF parser could not read the raw binary). DTIRB's 16 current members include all five national
underwriters named in the task brief (Chicago Title, Fidelity National, First American, Old Republic
National, Stewart Title Guaranty) plus WFG National. Owner's Policy Rate: $5.15/thousand up to
$100,000, tiering down to $1.85/thousand above $15 million; $146 minimum. Loan Policy Rate:
$3.65/thousand up to $100,000; $146 minimum. CPL (single transaction): flat $125.00, remitted entirely
to the Insurer (Section 6.1).

**Central structural finding**: like Ohio's OTIRB (GP-4), DTIRB states outright, in two places, that the
regulated premium never includes settlement/closing charges. Section 1.5 defines "Rate(s)" as being
"for title insurance premiums ... and do not include charges for searches, abstracts, attorney's fees,
escrow or closing services or other services charged by attorneys, abstractors, etc." Section 2.1
repeats: "The Rates herein quoted are for title insurance premium only and do not include charges for
searches, abstracts, Commitments, attorney's fees, or settlement/closing fees." No promulgated
settlement-fee number exists in Delaware (contrast NJ's NJLTIRB Article 6) — the entire
settlement/service-fee stack the task brief targeted is, by the Manual's own text, 100% market-set,
just as in Ohio.

## Delaware's attorney-closing custom (verified this session)
Delaware is an "attorney state": a Delaware-licensed attorney is required to conduct the settlement and
disburse funds on both purchase and refinance transactions (confirmed via multiple independent sources
found this session, including offitkurman.com's article title "Delaware Real Estate Closings: Why
Attorneys Are Required" and repeated confirmation across general closing-cost aggregator pages). This
means the closing-attorney's own fee — not a separate title-company settlement-fee line layered on top
of an independent attorney fee, as in NJ — is the primary settlement-fee market signal in Delaware.
Independent title/settlement companies found this session (Delaware Settlement Services, Eastern
Title, Armour Settlement Services, SPN Title Services) uniformly describe themselves as working
**through** a Delaware-approved-attorney network rather than closing files independently, consistent
with this custom.

## Observed service-fee range
Only **one** genuine provider-published, dollar-denominated settlement-fee figure was located despite
an extensive search:

| Provider | Metro/county | Settlement/attorney fee (as published) |
|---|---|---|
| Law Office of L. Echevarría (lem.associates) | Kent County & Sussex County (also virtual) | **$1,400-$1,600** bundled estimate range (title exam + attorney review + settlement coordination + admin + transaction coordination), plus a **$300** initial consultation fee applied toward the total if the client proceeds |

With only one priced source, there is no multi-provider range to test for saturation stability — the
same "too few comparable data points" situation previously documented for PA, NM, OH, IN, and VT (see
PROGRESS.md). Third-party aggregator sites (HomeLight, Rocket Mortgage, RealEstateWitch, etc.) cite a
generic "$750-$1,250" attorney flat-fee range and an "average $431/hour" figure for DE real estate
attorneys, but these are not provider-published fee schedules verifiable to a specific firm and are
noted here only as directional context, not counted as a verified source.

## Itemization patterns
- L. Echevarría's page is the only Delaware source found this session that states a specific dollar
  range for the settlement/closing service itself, and it bundles title exam, attorney review,
  settlement coordination, administrative services, and transaction coordination into one estimate
  range rather than itemizing doc prep/wire/courier/notary/CPL separately — the firm's own language
  ("there is no one-size-fits-all formula") is itself a market-opacity data point.
- Cramer & DiMichele, P.A. (Wilmington/New Castle County closing-attorney firm) explicitly states on
  its site that it does not "nickel and dime you with copy fees, delivery fees, wire fees, etc.,"
  implying an all-inclusive attorney fee model, but publishes no dollar figure — a qualitative
  bundling-practice confirmation without a priced data point.
- No independent Delaware title/settlement company (Delaware Settlement Services, Eastern Title,
  Armour Settlement Services, SPN Title Services) publishes a static, itemized settlement-fee
  schedule; all direct closings to/through their Delaware-approved-attorney network rather than
  quoting a company-set price.
- No national-brand underwriter (First American, Fidelity/Chicago Title, Old Republic, Stewart, WFG)
  publishes a static DE settlement-fee schedule — First American's own DE agency page
  (agency.firstam.com/de) has no fee calculator or static schedule at all (not even the
  calculator-only pattern seen in most other states); Old Republic's DE page gates fee information
  behind its StarsLink agent portal; WFG and Chicago Title both route to generic multi-state
  rate-calculator wrapper tools (netsheetcalc.com, oneclosingsource.com) with no DE-specific static
  figures — matching the pattern documented in every other state surveyed to date.

## Metro/county notes
- **New Castle County / Wilmington**: best-covered by attorney-firm identification (Cramer &
  DiMichele, Carr Law LLC/Newark, SMF Legal all checked directly) but **no dollar figure was found**
  for this county specifically — all three firms describe closing services qualitatively with no
  published price. Delaware Settlement Services (Newark-based, serving all three counties) and Eastern
  Title (offices in Wilmington, Newark, Middletown) likewise publish no static settlement-fee figure.
- **Kent County / Dover**: covered via L. Echevarría's explicit Kent County service area (the one
  priced source, $1,400-$1,600) alongside Eastern Title's Dover office (no figures) — the
  best-evidenced of the three counties on a per-dollar basis despite being only one data point.
- **Sussex County / coastal Delaware**: covered via L. Echevarría (also names Sussex County) plus SPN
  Title Services (Millsboro/Ocean View/Lewes, builder-closing specialist) and Lakeside Title Company
  (Ocean View/Rehoboth Beach/Millsboro) — neither SPN nor Lakeside publishes a static fee figure; a
  Lakeside "Services Quick Sheet" PDF was located and downloaded but its content stream uses a
  non-standard/obfuscated character encoding that could not be reliably decoded within this session's
  budget, so it is logged as found-but-unusable rather than a confirmed data point.

## Search log
**Regulatory (1 strategy, resolved on first query):** "Delaware Title Insurance Rating Bureau DTIRB
rate manual PDF 2025 2026" — located the current 04/01/2025 DTIRB Manual (virtualunderwriter.com host)
plus a superseded 04/01/2023 vintage (go.stewart.com) and a 09/01/2017 vintage (oldrepublictitle.com),
neither needed as a second citation per the task brief's "one clearly-dated vintage" instruction.

**Provider settlement-fee research (14 distinct query strategies):** "Delaware title company
settlement fee schedule closing costs Wilmington New Castle County"; "SPN Title Services Delaware fee
schedule closing costs Sussex County"; "'Delaware Settlement Services' desettle.com fees closing
settlement charge"; "Lakeside Title Company Delaware Sussex County fee schedule settlement charges";
"Delaware title company 'closing fee' OR 'settlement fee' schedule filetype:pdf"; "Delaware attorney
closing state real estate settlement custom title company"; "Armour Title Company Delaware fee
schedule settlement charges closing"; "First American OR Old Republic OR Stewart Title Delaware
settlement fee bulletin 'closing fee' dollar"; "Delaware real estate closing attorney flat fee
'settlement' price New Castle Kent Sussex"; "'Delaware' title company 'doc prep' OR 'wire fee' OR
'courier fee' OR 'e-recording fee' schedule"; "Wilmington New Castle County Delaware real estate
attorney closing flat fee price settlement"; "Dover Delaware Kent County real estate closing attorney
fee title company settlement"; "'Delaware' title agency OR title company 'settlement fee' '$'
residential closing schedule"; "WFG National Title OR Chicago Title Delaware fee calculator settlement
schedule".

**Direct provider-site checks (17):** virtualunderwriter.com DTIRB Manual PDF (USED — regulatory,
recovered via Python zlib stream decompression + PDF content-stream Tj/TJ text-token extraction after
WebFetch's native parser failed); easterntitle.com/delaware (no figures); website-media.com Lakeside
Services Quick Sheet PDF (downloaded, but content-stream text uses a non-standard encoding that
resisted decoding, unresolved); virtualunderwriter.com/.../real-estate-practices/delaware.html (Stewart
Real Estate Practices — nav-only page, substantive content gated); communitytn.com/content/
settlement-company-delaware (HTTP 403); nationwide-title-company.com/delaware-title-company.html
(Armour Settlement Services — no figures); oldrepublictitle.com/media/5596/real-estate-laws-customs-
brch-070820.pdf (multi-state PDF, Delaware section not isolated within session budget, unresolved);
offitkurman.com's Delaware attorney-closing-requirement article (HTTP 403); oldrepublictitle.com/
delaware/ (no figures, StarsLink-portal-gated); lem.associates/faqs (USED — L. Echevarría, $1,400-
$1,600 + $300 consultation); bonniebenson.com (HTTP 403); derealestatelaw.com/Cramer & DiMichele (no
figures, qualitative "no nickel and dime" statement); carrlawde.com (no figures); smflegal.com (no
figures); desettle.com/Delaware Settlement Services (no figures); firsttitleservices.com/
delaware-title-closing/ (HTTP 403); agency.firstam.com/de (no figures, no calculator at all).

### Verified and used this session (2 total)
DTIRB Rating Manual (regulatory — premium tables + the Section 1.5/2.1 unregulated-settlement-fee
finding + the Section 6.1 CPL rate); Law Office of L. Echevarría/lem.associates (Kent & Sussex
Counties, $1,400-$1,600 bundled attorney/settlement estimate + $300 consultation fee).

### Found but not usable (no dollar figures, blocked, or unresolved despite a working or attempted fetch)
easterntitle.com (no figures); Lakeside Services Quick Sheet PDF (non-standard encoding, undecoded);
Stewart's Real Estate Practices Delaware page (gated); communitytn.com (403); nationwide-title-
company.com/Armour (no figures); Old Republic's 50-state Real Estate Laws & Customs PDF (Delaware
section not isolated); offitkurman.com (403); oldrepublictitle.com/delaware (gated); bonniebenson.com
(403); derealestatelaw.com, carrlawde.com, smflegal.com (all qualitative, no dollar figures);
desettle.com (no figures); firsttitleservices.com (403); agency.firstam.com/de (no figures/calculator).

## Saturation/scarcity reasoning
This session located only **2 good sources** (1 regulatory + 1 attorney-published settlement-fee
estimate), well below the 6-source saturation floor, despite **15 distinct query strategies and 17
direct provider-site checks** — comfortably past the 8-strategy exhaustive-search threshold required
to invoke the scarce-market provision, and direct checks covered all five national-brand underwriters
named in the task brief (each confirmed as a DTIRB member whose Manual excludes settlement/closing
charges from the regulated rate, with none publishing a static DE settlement-fee schedule; First
American's own DE agency page notably lacks even the calculator-only fallback seen in most other
states). Delaware's structural characteristics plausibly explain the thinness of provider-side
evidence, and make it one of the scarcest states in this 51-state survey: (1) DTIRB's Sections 1.5/2.1
remove any regulatory prompt to publish a standalone settlement-fee number, mirroring Ohio's GP-4;
(2) Delaware's mandatory-attorney-closing custom means the settlement-fee market signal is scattered
across dozens of small solo/boutique real-estate-attorney practices (Cramer & DiMichele, Carr Law, SMF
Legal, Bonnie M. Benson, and others checked this session) that overwhelmingly market "fees explained
upfront" or "no nickel and dime" qualitatively rather than publishing a number, a genuine market-opacity
finding distinct from a search failure; and (3) independent title/settlement companies (Delaware
Settlement Services, Eastern Title, Armour, SPN Title, Lakeside Title) structurally route closings
through the attorney network rather than pricing settlement services themselves, so they have no
company-level settlement fee to publish in the first place — a distinct structural reason for thinness
not seen in title-company-closing states. DE is marked **complete (scarce market)** on that basis; being
the last of 51 states surveyed, this closes the full survey with the same fundamental pattern observed
throughout Priority tier 3 (rating-bureau states regulate the premium but not the settlement fee) now
confirmed in a jurisdiction where the settlement-fee market itself is additionally thinned by a
mandatory-attorney-closing custom, the clearest example of that combined effect found in the survey.
