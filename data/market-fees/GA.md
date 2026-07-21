# Georgia (GA) Title / Closing / Settlement Fee Research

## UPDATE 2026-07-21 — verified from the local (unblocked) session

The egress blocker below applied only to the cloud environment. Two of the logged
candidates were fetched and verified locally; GA.json is now populated:

1. **Stewart Title Guaranty GA rate manual** (eff. 2024-07-08, filed rates): owner's
   $5.65/$4.95/$4.05 per $1,000 tiered (min $200); loan $4.00/$3.30/$2.95 (min $200);
   **simultaneous-issue loan policy = flat $200**; CPL $50/party. Manual states rates
   exclude attorney/settlement services (GA = attorney-close state).
2. **Campbell & Brannon (Atlanta closing attorneys)**: purchase closing fee $825 +
   title exam $295 + doc prep $150 + CPL ~$50 ≈ **$1,320 service stack** on a financed
   purchase, before optional add-ons (mail-away $350, second mortgage $350, etc.).

Status upgraded: thin (2 verified sources). Remaining candidates (FNTI manual,
Wilson Pruitt, etc.) still listed below for future verification.


## Thin evidence

**Result: No usable, verified published fee schedules were collected for Georgia. `GA.json` is an empty array `[]`.**

This is not because Georgia sources don't exist — `WebSearch` surfaced several promising, specific candidates (listed below). The blocker is technical: every attempt to actually load a page and verify its contents with `WebFetch` in this session failed with **HTTP 403 at the outbound egress proxy**, not at the destination website. The proxy status endpoint (`$HTTPS_PROXY/__agentproxy/status`) confirmed this is an organization-level policy denial on outbound HTTPS `CONNECT`, not a site-specific block: `WebFetch` was tested against nine distinct hosts, including well-known non-title-industry domains (`en.wikipedia.org`, `www.google.com`) as a control, and **all nine returned 403 "gateway answered 403 to CONNECT (policy denial or upstream failure)"**. Per this environment's own guidance (`/root/.ccr/README.md`): *"do not retry organization policy denials (403/407) — report them instead."* Retrying or routing around it was not attempted further once the pattern was confirmed across unrelated domains.

Because I could not independently load any of these pages, I have **no way to confirm the URLs are live, that they contain the fee data implied by their titles/snippets, or to extract exact figures/quoted language** as the evidence rules require. `WebSearch` returns AI-summarized snippets, not verbatim page text — using those summarized numbers as if verified would risk exactly the kind of guessed/extrapolated/misattributed figures the task explicitly forbids. So none of the candidates below were promoted into `GA.json`.

### Search queries run
- `Georgia title company settlement fee schedule pdf 2025`
- `Georgia closing attorney fee schedule title insurance`
- `Georgia Land Title Association rate survey fee guide`
- `Stewart Title Georgia rate manual schedule of charges site:virtualunderwriter.com`
- `Georgia Office Insurance Safety Fire Commissioner title insurance rate filing`
- `"settlement fee" Georgia title company itemized closing fees courier wire fee e-recording`

### Candidate sources found but NOT verified (not used in GA.json — content unconfirmed)
These looked, from search titles/URLs, like they could be real published fee schedules, but every `WebFetch` attempt against them failed with the proxy-level 403 described above, so none of their content was directly inspected by me:

- Stewart Title Guaranty Company, "All Inclusive Schedule of Charges" for Georgia (rate manual) — `https://www.virtualunderwriter.com/-/media/files/virtualunderwriter/imported/pdfs/georgia-rate-manual_final_-eff-7-08-2024-2.pdf` (search snippet suggested an effective date of 7/8/2024; an older version effective 1/3/17 and 9/1/12 also turned up at the same host)
- First National Title Insurance Company (FNTI), Georgia Title Insurance Rates and Rules Manual — `https://documentpub.fnti.com/Documents/Georgia/Rate%20Manual/FNTI%20GA%20Rate%20Manual%20Effective%202022-02-02.pdf` (search snippet suggested effective 2/2/2022)
- Campbell & Brannon (GA closing attorney firm), "Our Fees" page — `https://www.campbellandbrannon.com/our-fees/`
- Wilson Pruitt LLC (GA closing attorney firm), "Fee Sheet" — `https://wilsonpruittlaw.com/fee-sheet/`
- Law Office of Michael Howe, LLC, GA closing fee schedule (hosted as a PDF exhibit on a third-party auction site) — `https://www.tranzon.com/otherdocs/ga_closing_fee_schedule.pdf`
- Sherman Phalen Law, closing cost calculator page — `https://shermanphalenlaw.com/calculator/`
- Georgia Title & Escrow Company, recording fees / closing cost pages — `https://georgiatitle.com/Real-Estate-Taxes/GA-Recording-Fees/index.html` and related pages on the same domain
- Georgia Office of the Commissioner of Insurance and Safety Fire — regulatory filings / SERFF portal — `https://oci.georgia.gov/regulatory-filings` and `https://oci.georgia.gov/regulatory-filings/insurance-product-filings/serff` (this is where GA title insurers' filed rate schedules would live, per the search summary, but SERFF filings are not straightforwardly public-document-linkable without loading the portal, which also could not be verified)

None of these are represented in `GA.json`, and no figures from them (settlement fee amounts, premium rates, itemized fee amounts) are asserted anywhere in this write-up, because I could not confirm via direct page load that the numbers a search summary attached to them are actually what the page says.

### What would resolve this
Re-running this research with `WebFetch` (or an equivalent tool) able to reach these hosts — i.e., once the outbound egress policy for this session allows HTTPS `CONNECT` to public websites — would very likely turn several of the candidates above into usable entries, since Georgia closing-attorney fee pages and underwriter-published Georgia rate manuals of exactly this kind are known to exist and be publicly posted. Georgia title insurance premiums are filed-rate (not promulgated/uniform) — each underwriter (e.g., Stewart, First National Title Insurance, and others) files its own rate schedule with the Georgia Office of the Commissioner of Insurance and Safety Fire, which is consistent with what the OCI regulatory-filings search result described, but I could not pull the actual filed numbers.

## Source URLs referenced in this document (unverified — see above)
- https://www.virtualunderwriter.com/-/media/files/virtualunderwriter/imported/pdfs/georgia-rate-manual_final_-eff-7-08-2024-2.pdf
- https://documentpub.fnti.com/Documents/Georgia/Rate%20Manual/FNTI%20GA%20Rate%20Manual%20Effective%202022-02-02.pdf
- https://www.campbellandbrannon.com/our-fees/
- https://wilsonpruittlaw.com/fee-sheet/
- https://www.tranzon.com/otherdocs/ga_closing_fee_schedule.pdf
- https://shermanphalenlaw.com/calculator/
- https://georgiatitle.com/Real-Estate-Taxes/GA-Recording-Fees/index.html
- https://oci.georgia.gov/regulatory-filings
- https://oci.georgia.gov/regulatory-filings/insurance-product-filings/serff
