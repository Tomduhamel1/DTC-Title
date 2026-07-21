# North Carolina Market Fees — Research Status

## UPDATE 2026-07-21 — verified from the local (unblocked) session

The egress blocker below applied only to the cloud environment. Three sources were
fetched and verified locally; NC.json is now populated:

1. **Chicago Title NC rates (NCTIRB member), eff. 2025-10-01**: bureau-uniform premiums
   $2.78/$2.17/$1.41 per $1,000 tiered, min $56, simultaneous issue +$28.50 per loan
   policy. Confirms NC is a rating-bureau state — the site's marketBaseline was updated
   accordingly (PR #43) and NC premium lines no longer claim savings.
2. **24 Hour Closing (NC/SC, 2025 schedule)**: financed-purchase service stack
   $650 closing + $375 search/final title + $150 admin = **$1,175**, plus a
   **$250-per-$100k escalator above $500k**, plus add-ons (loan doc prep $400, mail-away $200).
3. **Cline Donaldson PLLC**: settlement fee NOT published ("reach out") — market-opacity
   data point; e-recording ~$10, overnight $50 each, mobile notary $300.

Status upgraded: good (3 verified sources).


## Thin evidence

**No providers could be verified. `NC.json` is an empty array `[]` per the evidence rules.**

This is not because no candidate sources exist — the search step below surfaced several
plausible North Carolina title company / closing attorney / underwriter fee pages and rate
manuals. It is because **this research environment's outbound web access is blocked at the
network/policy layer for essentially all external domains**, which made it impossible to
satisfy the task's core evidence requirement: *"verify the URL is real and actually loads
real fee schedule content (use WebFetch to confirm and extract exact numbers)."*

### What was tried

Web searches run (via the WebSearch tool, which — unlike WebFetch — appears to run outside
this session's blocked egress path and did return results):

1. `North Carolina title company fee schedule pdf settlement fee`
2. `North Carolina closing attorney fee schedule title insurance`
3. `North Carolina Rate Bureau title insurance rate manual filed rates`
4. `North Carolina title company "closing fee" "title search" "settlement fee" rate card site:.com -blog`
5. `North Carolina Land Title Association rate survey closing costs`
6. `"fee schedule" North Carolina title company attorney closing "docs prep" OR "e-recording" OR "wire fee" filetype:pdf`
7. `Investors Title Insurance Company North Carolina agent fee schedule rate manual`

These searches surfaced candidate pages/PDFs that looked like real, on-point sources,
including:

- `https://24hourclose.com/fee-schedule/` — a title/closing company fee schedule page (search-result snippet suggested a closing fee, title search/final title fee, and admin fee line items)
- `https://harrymarshlaw.com/closings/costs/` — an NC closing attorney's costs page
- `https://www.clinelawgroupnc.com/news/buyer-closing-costs` — Cline Donaldson PLLC buyer closing costs page
- `https://www.ncctitle.com/current-rate-information` — NC Title Services current rate info
- `https://barristerstitle.com/rates` — Barristers Title NC rates page
- `https://go.stewart.com/rs/067-YWO-436/images/NCTIRB%20Rate%20Manual%2003-01-2020.pdf` — Stewart Title's posting of the NCTIRB (NC Title Insurance Rating Bureau) rate manual
- `https://www.northcarolina.ctic.com/getattachment/News-Events/Chicago-Title-Rates-Effective-10-1-2025.pdf?lang=en-US` — Chicago Title's NC rates, effective 10/1/2025
- `https://wfgunderwriting.com/.../NC%202016-01%20Rate%20and%20Form%20Bulletin...pdf` — WFG's NC rate bulletin
- `https://documentpub.fnti.com/.../FNTI%20NCTIRB%20Rates%20&%20Supplement%202020-03-01.pdf` — First National Title's posting of NCTIRB rates
- `https://www.invtitle.com/docs/news/nc/ncratebrochure201810.pdf` — Investors Title NC rate brochure
- `https://www.ncrb.org/ncrb/` — North Carolina Rate Bureau

### Why none of these were used

Every attempt to load these pages directly and extract verified text — via the `WebFetch`
tool, and via `curl` through the session's HTTPS proxy — returned **HTTP 403 Forbidden**,
including for domains with no plausible reason to block automated fetching (e.g.
`www.google.com`, `en.wikipedia.org`, `example.com`, `www.ncdoi.gov`, `www.ncrb.org`).
Checking the proxy's own status endpoint (`$HTTPS_PROXY/__agentproxy/status`) confirmed
this is a **blanket organization egress-policy denial** ("gateway answered 403 to CONNECT
(policy denial or upstream failure)") applied to essentially any host not on a small
allowlist (npm registry, PyPI, anthropic.com, etc.) — not a per-site block by the title
companies themselves. Per the proxy's own guidance ("do not retry organization policy
denials — report them instead"), this was not something further retries could fix.

Because WebFetch could not load a single one of the candidate pages, I could not confirm
that any of the numbers appearing in WebSearch's synthesized snippets (e.g., a claimed
"$650 closing fee / $375 title search & final title fee / $150 admin fee" attributed to
24 Hour Closing) are accurate, current, or even correctly attributed — WebSearch snippets
are summarized by an intermediate model and are not a substitute for reading the primary
source. Per the task's evidence rules, publishing those figures into `NC.json` as if
verified would risk citing numbers that were never actually confirmed against the source
document, so they have been deliberately left out rather than guessed into the dataset.

### What would unblock this

To complete this research task properly, the session would need either:
- Outbound HTTPS access allowed to the specific candidate domains listed above (or to the
  open web generally) so WebFetch can load and confirm content, or
- The fee-schedule PDFs/pages fetched by some other means (e.g. pasted in, or downloaded
  in an environment with web access) and handed to this session for extraction.

### Premium-rate nuance (for context, not independently verified here)

Multiple candidate sources above (Stewart, Chicago Title, WFG, First National Title
Insurance) appear to each be re-publishing the **same underlying NCTIRB (North Carolina
Title Insurance Rating Bureau) promulgated rate manual** rather than independent pricing —
consistent with the brief's note that NC is a filed/advisory-rate state where many
underwriters adopt the same bureau rates for the *insurance premium* itself. That
convergence is exactly why the task brief says to focus on **settlement/service fees**
(closing fee, title search/exam, doc prep, courier, wire, e-recording, notary, CPL,
binder), which are unregulated and vary by provider — but none of those service-fee
figures could be confirmed against a primary source in this session.

## Sources referenced (unverified — listed for traceability only, not cited as evidence)

- https://24hourclose.com/fee-schedule/
- https://harrymarshlaw.com/closings/costs/
- https://www.clinelawgroupnc.com/news/buyer-closing-costs
- https://www.ncctitle.com/current-rate-information
- https://barristerstitle.com/rates
- https://go.stewart.com/rs/067-YWO-436/images/NCTIRB%20Rate%20Manual%2003-01-2020.pdf
- https://www.northcarolina.ctic.com/getattachment/News-Events/Chicago-Title-Rates-Effective-10-1-2025.pdf?lang=en-US
- https://wfgunderwriting.com/wp-content/uploads/filebase/north-carolina/bulletins/NC%202016-01%20Rate%20and%20Form%20Bulletin%20-%20Effective%204-1-2016%20-%20Rates,%20Rate%20Manual,%20Title%20Insurance%20Ratges,%20NCTIRB,%20North%20Carolina.pdf
- https://documentpub.fnti.com/Documents/North%20Carolina/Rate%20Manual/FNTI%20NCTIRB%20Rates%20&%20Supplement%202020-03-01.pdf
- https://www.invtitle.com/docs/news/nc/ncratebrochure201810.pdf
- https://www.ncrb.org/ncrb/
- https://www.ncdoi.gov/consumers/homeowners-insurance/title-insurance
