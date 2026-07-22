# Connecticut — Market Fee Evidence

## Status: complete (scarce market) — 5 verified sources (2 premium-only, 3 settlement/attorney-fee-priced), 2026-07-22

Connecticut is an **attorney-closing state** with **insurer-filed but uncoordinated title premiums**
(each underwriter files its own rate manual with the CT Insurance Department; premiums are not
promulgated or rating-bureau-uniform as in TX/FL/NM/PA/NY/NJ/OH/DE/NC). This session verified
**5 directly-fetched sources**: WFG National Title (effective 2021-02-01) and Stewart Title Guaranty
(effective 2020-03-01), both premium-only filed rate manuals; and three closing-attorney firms with
published flat-fee settlement pricing — Connecticut Title & Escrow LLC ($1,250 purchase/$1,150
refinance/$1,975 sale, comprehensive bundled fee, as of 2026-01-01), Law Office of Yona Gregory
($750 flat, attorney-fee-only, statewide), and Connecticut Real Estate Closing Lawyers ($850-$1,800
range, statewide, unitemized). **14 distinct query strategies plus 10 direct provider-site checks**
found only 5 usable sources — below the 6-source saturation floor. Marked **complete (scarce)**.

## All-in service-stack range observed

Two directly comparable **bundled attorney/settlement fee** figures were found:
- **Connecticut Title & Escrow**: $1,150 (refinance) - $1,975 (sale), bundling title search, title
  review, document prep, courier, and phone/fax, but excluding the separate title insurance premium.
- **Connecticut Real Estate Closing Lawyers**: $850-$1,800 (unitemized residential range).

A third figure, **Law Office of Yona Gregory's $750**, is explicitly narrower — attorney representation
fee only, excluding title search, title insurance, recording, and courier, so it is not directly
comparable to the other two bundled figures and is recorded separately rather than averaged in.

Combining the two bundled quotes gives an observed **all-in settlement-fee range of roughly
$850-$1,975** (excluding the separate title insurance premium in all cases) — but with only 2
comparable bundled data points, this is far too thin to test for saturation (the contract requires 6+
sources before saturation can even be evaluated).

## Itemization / bundling patterns

- **WFG's** manual (Section I.A): "Fees and charges in connection with the searching, examination,
  certification and closing of title are not included in the rates herein... WFG National Title
  Insurance Company may make additional charges for these and other services." No dollar figures.
- **Stewart's** manual (Definitions + General Provisions) is the most explicit of any state surveyed
  in naming who charges the excluded fees: "do not include charges for searches, examinations,
  abstracts, attorneys' fees, escrow or closing services, inspections or other services charged by
  **local attorneys, surveyors, abstractors, or abstract companies**" — a direct acknowledgment that
  in CT's attorney-closing structure, the settlement fee is charged by the closing attorney, not the
  underwriter.
- **Connecticut Title & Escrow's** flat fee inverts the usual pattern seen in most other states: here
  the *settlement/attorney fee is the published, bundled, dollar-denominated figure*, and the *title
  insurance premium* is the separately-billed, unpublished-on-this-page component ("Title insurance
  premiums will be a separate charge as required by the State of Connecticut").
  This is the mirror image of WFG/Stewart, where the premium is published and the settlement fee is
  the unpublished component — together the two source types cleanly triangulate CT's cost stack even
  though no single source prices both halves.
  - The single documented case where transaction type raised price rather than lowered it (Sale at
    $1,975 vs. Purchase $1,250 vs. Refinance $1,150) reflects seller-side conveyancing work
    (deed preparation, payoff coordination, closing-statement liability) rather than a market-based
    "usually costs more" default — Refinance is the cheapest of the three, as in most other states.
- **Yona Gregory's** and **Connecticut Real Estate Closing Lawyers'** figures show the range of pure
  attorney-fee models in CT: a narrow single-party-only quote ($750) vs. a broader range quote
  ($850-$1,800) that likely includes ancillary work beyond the bare closing attendance.

## Premium rate card (insurer-filed, uncoordinated state)

Representative Owner's Policy premium at $100,000 liability (both use identical $20,000 base +
per-thousand formula through $100,000): WFG (2021) = $109 + $4.36/thousand × 80 = **$457.80**;
Stewart (2020) = $109 + $4.36/thousand × 80 = **$457.80** (identical bracket structure and rate to
WFG at this tier, a notable direct cross-underwriter rate match despite a full year's gap between
manual effective dates). Both manuals also independently confirm the **$25.00 per-letter CPL fee**
pursuant to C.G.S.A. §38a-404 (WFG explicit; Stewart's manual does not separately break out a CPL
fee). Full liability-tiered schedules for both are recorded verbatim in CT.json.

## Not used / found-but-blocked

- **catic.com** (CATIC — Connecticut Attorneys Title Insurance Company, the state's dominant
  domestic underwriter, an attorney-owned title insurer unique to CT/NH/RI) — its "CT_Premium Rate
  Schedule_May2016.pdf" returned HTTP 403 Forbidden on two direct fetch attempts; its
  state-resources page (catic.com/state-resources/connecticut) also 403'd. This is a significant gap:
  CATIC is likely CT's single largest title underwriter by volume, and its absence means this
  survey's premium-side coverage is skewed toward two national underwriters (WFG, Stewart) rather
  than CT's dominant domestic one. Flagged for a future session to retry (CATICulator at
  caticulator.com, a calculator tool rather than a static schedule, was noted as an alternative but
  not attempted this session).
- **firsttitleservices.com/connecticut-title-closing/** (First Title & Escrow) — HTTP 403 Forbidden.
- **agency.firstam.com/ct** (First American Title CT Agency Services) — fetched successfully;
  describes AgentNet/AgentAdvantage services only, no settlement-fee dollar figures published.
- **simpletitle.us/connecticut-title-closing-attorney/** (Simple Title) — fetched successfully;
  describes services and a general "0.4%-1% of property value" title-insurance-cost rule of thumb,
  but no firm-specific settlement/closing fee schedule published.
- **mancusocarey.com** — fetched; general commentary only ("Most Connecticut real estate attorneys
  charge a flat fee... reach out — we'll give you a clear answer"), no published dollar figures.
- **pedersonrealestatelaw.com** post — 301-redirects to an unrelated domain (clanyc.org), dead link.
- No Chicago Title, Fidelity National Title, or Old Republic Title Connecticut-specific rate
  manual/settlement-fee PDF was found via search; all three route to interactive calculators
  (rates.fntg.com, oldrepublictitle.com/rate-calculator) or generic national "Real Estate Laws &
  Customs" guides (payer-allocation commentary, not priced schedules — same exclusion pattern
  applied to Old Republic's guides in CA/CO in earlier sessions).
- Searches for named independent CT title agencies (Secure Title, Guardian Title, Nutmeg Title,
  generic "CT Title") returned no company-specific fee-schedule pages, only third-party
  blog/calculator estimate sites (Houzeo, ListWithClever, Rocket Mortgage, Bankrate, ConsumerAffairs,
  iBuyer, AnytimeEstimate), excluded as non-primary sources per the evidence rules.

## Search log (14 distinct query strategies + direct provider-site checks)

1. "Connecticut title insurance rate manual settlement fee schedule PDF"
2. "Connecticut title insurance premium filed rates Stewart OR WFG OR \"First American\" manual pdf"
3. "Connecticut attorney closing fee schedule title search examination fee 2026 pdf"
4. "Connecticut title company \"closing fee\" OR \"settlement fee\" schedule Hartford OR \"New Haven\" OR Stamford pdf"
5. "CATIC Connecticut Attorneys Title Insurance premium rate schedule 2025 OR 2026"
6. "\"First American Title\" Connecticut closing fee OR settlement fee schedule agency"
7. "Connecticut real estate closing attorney flat fee \"closing fee\" site:.com pricing purchase refinance"
8. "Old Republic Title Connecticut rate manual settlement fee pdf"
9. "Connecticut title insurance agency website \"settlement fee\" OR \"closing fee\" $XXX schedule attorney"
10. "\"Secure Title\" OR \"Guardian Title\" OR \"Nutmeg Title\" OR \"CT Title\" Connecticut closing fee schedule"
11. "WFG National Title Connecticut bulletin closing fee escrow charges 2024 OR 2025"
12. "simpletitle.us pricing fee schedule Connecticut closing"
13. "Connecticut independent title company \"title search fee\" \"closing fee\" \"$\" pricing page"
14. "Connecticut closing attorney \"flat fee\" real estate closing $ pricing -blog -calculator law firm"

Plus direct provider-site fetches: WFG and Stewart CT rate manual PDFs (via WebFetch + Read-tool
binary-PDF recovery, same technique used throughout this survey), CATIC (blocked 403 twice, incl.
state-resources page), ctclosing.com/pricing/, simpletitle.us (no pricing found), yonalaw.com/closings,
connecticutrealestateclosinglawyers.com, firsttitleservices.com (blocked 403), agency.firstam.com/ct
(no pricing found), mancusocarey.com (no pricing found), pedersonrealestatelaw.com (dead redirect).
