# Alaska — Market Fee Evidence

## Calculator harvest (2026-08-18)

Separate from the published-schedule survey below, 2 calculator-basis quotes were harvested for the
standard scenario ($500,000 purchase / $400,000 loan / Anchorage / residential resale) — below the
3-provider calculator-quoted threshold this session. See AK.json's `"basis": "calculator"` entries
for full itemized figures and CALCULATORS.md for the technical recipes.

1. **Stewart Title Company — Stewart Title of Alaska** (Anchorage) — via Stewart Rate Calculator
   (stewartratecalculator.com), applying the recipe fully documented in CALCULATORS.md's 2026-08-14
   entry unmodified. Unlike VT/WY above, this is a genuine Alaska-based settlement office, not an
   out-of-state remote provider. Title Closing Fee **$1,381.00** total (split $690.50/$690.50) — the
   largest single settlement-fee line item recorded anywhere in this entire survey to date — plus
   Title Courier Fee $20.00, Title Document Preparation Fee $50.00 (split $25/$25), Title Wire
   Transfer Fee $25.00 (seller), and Owner's/Lender's Basic Policy standalone premiums
   $1,990.00/$1,336.00. No deed/transfer tax (Alaska has none, corroborating the published-schedule
   finding below).
2. **FNF-family underwriter** (ratecalculator.fnf.com, shared ASP.NET WebForms engine) — Anchorage,
   via the recipe already documented in CALCULATORS.md's FNF section. Owner's Policy Premium
   $1,910.25, Loan Policy Premium $75.00 (concurrent-issue rate), Grand Total **$1,985.25**.
   Premium-only, no settlement-fee itemization.

**3rd-provider search**: WFG's own `GetCalculationEnabledStates` list does not include Alaska at
all (confirmed via direct query this session), so WFG — the tool that supplied a fast provider for
every other state harvested this session — is not usable here. AK now needs 1 more provider (up
from needing 2, since FNF worked where WFG couldn't) — try NetSheetCalc/TitleTap or MyTitleRates.com
search for an independent AK agency, or Old Republic's 2nd tool with the full session-affinity fix.

## Status: complete (scarce market) — 2 verified sources (1 genuine escrow schedule + 1 premium manual), 2026-07-22

Alaska is unusual among states surveyed to date: **AS 21.66.460 legally requires title insurance
companies to file escrow, settlement, and closing charge schedules with the Division of Insurance,
separately from title insurance premium rates** (AS 21.66.370 governs the premium side). This
statutory split explains why this session found a genuine, dollar-denominated escrow fee schedule
(Alyeska Title Guaranty Agency) alongside a separate title-premium-only rate manual (Stewart Title
Guaranty) — the two documents are filed and published independently, matching the two different
statutes. Despite this promising regulatory structure, **14 distinct query strategies plus roughly 10
direct provider-site checks** (Alyeska, Fidelity Title Agency AK [redirects to Stewart's Anchorage
market page], alaska-escrow-title.com [503 error], Western Alaska Land Title, Integrated Title
Agency, Kachemak Bay Title [2 attempts, rate-calculator/rate-sheet both non-static], First American
Alaska document center, Chicago Title Library [CA-only, no AK schedule], Old Republic Alaska)
found only **2 verified sources total** with actual figures. Marked **complete (scarce)** — well past
the 8-strategy threshold with only 2 sources, below the 6-source saturation floor.

## All-in service-stack range observed

**Escrow/settlement fee (Alyeska Title, the only verified settlement-fee source):** formula-based,
$400 base + $1.60/thousand of insurance liability up to $1,000,000, then $0.80/thousand thereafter.
At representative purchase-price tiers: **$480** at $50,000 liability, **$560** at $100,000, **$720**
at $200,000, **$1,200** at $500,000, **$2,000** at $1,000,000. Flat **$375** for residential refinance.
With only one settlement-fee-priced source, this range cannot be tested for cross-provider
saturation, but it is a genuine, granular, dollar-denominated escrow schedule — a notably better
find than the premium-only manuals that dominate most other "scarce" states surveyed so far (AZ,
CO, MI, MO, VA, WI, AL).

## Itemization / bundling patterns

- Alaska's two-statute structure (AS 21.66.370 for title premium, AS 21.66.460 for escrow/
  settlement/closing charges) means the two fee types are filed as **entirely separate schedules**
  by the same underwriter/agency, unlike most other states where settlement fees are unfiled and
  unpublished by convention rather than by statute.
- Alyeska's escrow schedule is explicitly described as **minimums**, "subject to change dependent
  upon the complexity of the transaction," and conditioned on title insurance being issued through
  Alyeska itself (i.e., not available as a stand-alone escrow-only rate).
- Stewart's 2017 premium manual contains zero escrow/settlement dollar figures, consistent with
  the statutory separation -- Stewart's escrow/settlement filing (if it exists) is a different document
  that was not locatable via search this session.

## Premium rate card (filed-rate state)

Stewart Title Guaranty's Basic Insurance Rate Schedule (statewide, 2017 vintage): $250.00 flat
minimum up to $28,000 of liability, rising to $582.00 at $100,000, then tiered per-thousand
increments above that (see AK.json for the full table). Owner's Standard Coverage = 100% of Basic
Rate; Extended Coverage = 135%; Homeowner's Policy = 110%; Loan Standard = 80%; Loan
Extended = 110%. Newer Stewart Alaska rate-manual bulletins (AK2025001, AK2026001) were
referenced in Virtual Underwriter's bulletin index but the actual current-vintage PDF could not be
located or fetched this session -- only the 2017 filing was reachable via a working URL.

## Not used / found-but-blocked

- **fidelitytitleagencyak.com** — redirects (301) to stewart.com/en/markets/anchorage/ (Fidelity
  Title Agency of Alaska appears to have merged into / been rebranded under Stewart); no separate
  fee schedule found at the redirect target.
- **alaska-escrow-title.com** (Alaska Escrow and Title Insurance Agency, Ketchikan/Juneau/Sitka) —
  returned HTTP 503 on fetch, unusable.
- **westernaktitle.com** (Western Alaska Land Title, Kodiak) — fetched; quote-request only, no
  published figures.
- **integratedtitle.us** (Integrated Title Agency, Kenai) — fetched; no published figures.
- **kbaytitle.com/rate-calculator/** and **/rate-sheet** (Kachemak Bay Title, Homer) — both fetched
  (rate-sheet attempted twice); page references a "Printable Rate Sheet" but no dollar figures were
  retrievable from either page's fetched content; the only concrete figure found anywhere on the
  site is an unrelated $20 "Seller Verify" identity-verification fee.
- **local.firstam.com/ak/documents** (First American Alaska document center) — fetched; page
  returned only a bare header with no document links in the fetched content.
- **chicagotitlelibrary.com/rate-schedule/** — fetched; hosts only California county escrow rate
  schedules (Loan and Sale), no Alaska schedule present.
- **oldrepublictitle.com/alaska/** — fetched; no linked rate schedule or PDF, calculator-only
  reference with no working link found.
- Stewart's newer Alaska filings (AK2025001 "New Alaska Rate Manual", AK2026001 effective
  2026-04-27) were referenced only as bulletin titles in Virtual Underwriter's index; the underlying
  PDF documents require an account/could not be located via public search, so the 2017 vintage
  above is the most current verifiable Stewart Alaska document.

## Search log (14 distinct query strategies + direct provider-site checks)

1. "Alaska title insurance rate manual settlement fee schedule PDF"
2. "Alaska title company closing fee escrow fee schedule Anchorage"
3. "\"Alaska\" title insurance rate manual First American OR Stewart OR Fidelity filetype:pdf"
4. "Alaska USA Title OR \"First American Title\" Alaska rate schedule closing costs"
5. "virtualunderwriter.com alaska rate manual title insurance"
6. "WFG Alaska title insurance rate manual pdf wfgunderwriting.com"
7. "site:virtualunderwriter.com alaska-manual filetype:pdf"
8. "\"schedule of charges for title insurance in the state of alaska\" pdf"
9. "Alaska Division of Insurance title insurance filed rates escrow settlement charges search"
10. "\"Western Alaska Land Title\" OR \"Kachemak Bay Title\" escrow rates schedule pdf"
11. "First American Title Alaska escrow rates schedule pdf Anchorage"
12. "\"Integrated Title Agency\" Kenai Alaska rates escrow pdf"
13. "\"Chicago Title\" OR \"Old Republic Title\" Alaska escrow rate schedule pdf Anchorage"
14. Direct fetch of Alaska Land Title Association member directory to identify all AK title/escrow
    companies operating statewide, then direct-checked each

Plus direct provider-site fetches: Alyeska Title (main page -> rates.html -> downloads/rates-
escrow.pdf, via WebFetch + Read-tool binary-PDF recovery -- same recovery technique used in
prior sessions for CA/GA/NC/WA/MI/AL), Stewart Title (virtualunderwriter.com bulletin index ->
stewart.com/en/state-pages/alaska-agents/rates -> direct media PDF, same recovery technique),
Fidelity Title Agency AK, alaska-escrow-title.com, Western Alaska Land Title, Integrated Title
Agency, Kachemak Bay Title (2 pages), First American AK document center, Chicago Title Library,
and Old Republic Alaska.
