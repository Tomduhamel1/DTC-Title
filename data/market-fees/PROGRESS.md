# Market Fee Evidence — Progress Tracker

Nightly research agent collects published title/settlement fee schedules per
state into `data/market-fees/<ST>.json` + `<ST>.md`. This file tracks status.

Evidence quality legend:
- **good** — 3+ distinct published provider fee schedules found
- **thin** — 1–2 published schedules found, or schedules found but sparse detail
- **none** — no usable published fee schedule located; see state's .md for search log

Priority order: CA, GA, NC, CO, AZ, WA, VA, TN, MI, MO first (large filed-rate
states), then remaining filed-rate states, then TX/FL/NM/PA/NY/NJ/OH/DE last
(premiums uniform there, but service fees still vary and matter).

## Priority tier 1 (filed-rate, high volume)

| State | Status | Quality | Last run |
|---|---|---|---|
| CA | done | thin (2 verified sources; several more found but blocked by WAF/403) | 2026-07-21 |
| GA | done | none (thin evidence — blocker) | 2026-07-21 |
| NC | done | none (thin evidence — blocker) | 2026-07-21 |
| CO | unprocessed | | |
| AZ | unprocessed | | |
| WA | unprocessed | | |
| VA | unprocessed | | |
| TN | unprocessed | | |
| MI | unprocessed | | |
| MO | unprocessed | | |

## Priority tier 2 (remaining filed-rate states)

| State | Status | Quality | Last run |
|---|---|---|---|
| AL | unprocessed | | |
| AK | unprocessed | | |
| AR | unprocessed | | |
| CT | unprocessed | | |
| DC | unprocessed | | |
| HI | unprocessed | | |
| ID | unprocessed | | |
| IL | unprocessed | | |
| IN | unprocessed | | |
| IA | unprocessed | | |
| KS | unprocessed | | |
| KY | unprocessed | | |
| LA | unprocessed | | |
| ME | unprocessed | | |
| MD | unprocessed | | |
| MA | unprocessed | | |
| MN | unprocessed | | |
| MS | unprocessed | | |
| MT | unprocessed | | |
| NE | unprocessed | | |
| NV | unprocessed | | |
| NH | unprocessed | | |
| ND | unprocessed | | |
| OK | unprocessed | | |
| OR | unprocessed | | |
| RI | unprocessed | | |
| SC | unprocessed | | |
| SD | unprocessed | | |
| UT | unprocessed | | |
| VT | unprocessed | | |
| WV | unprocessed | | |
| WI | unprocessed | | |
| WY | unprocessed | | |

## Priority tier 3 (promulgated / rating-bureau — premiums uniform, service fees still researched)

| State | Status | Quality | Last run |
|---|---|---|---|
| TX | unprocessed | | |
| FL | unprocessed | | |
| NM | unprocessed | | |
| PA | unprocessed | | |
| NY | unprocessed | | |
| NJ | unprocessed | | |
| OH | unprocessed | | |
| DE | unprocessed | | |

## Run log

- 2026-07-21: Initialized tracker (50 states + DC). First run begins with CA, GA, NC.
- 2026-07-21: GA research blocked — this session's outbound egress proxy returned HTTP 403
  on every `WebFetch` attempt (confirmed session-wide via control domains en.wikipedia.org
  and www.google.com, not site-specific). No fee data could be verified, so GA.json is `[]`
  and GA.md documents the candidate sources found via WebSearch but not independently
  confirmed. CA and NC runs in progress under the same session; likely to hit the same
  blocker. Needs a human to check the environment's network egress policy before re-running.
- 2026-07-21: CA research hit the same session-wide WebFetch 403 issue (confirmed against
  example.com, example.org, en.wikipedia.org, sec.gov, cnn.com — all failed identically to
  the vendor domains, so it is not a per-site block). Found a partial workaround: WebFetch
  *does* succeed against raw Amazon S3 object URLs (`s3-us-west-1.amazonaws.com`,
  `<bucket>.s3.amazonaws.com`) even when the same document's normal vendor-domain URL (CDN /
  WordPress / Cloudflare-fronted) 403s. Several title companies host their public rate-book
  PDFs on S3 buckets (e.g. Corinthian Title's `ctc-site` bucket, First American's
  `first-american-bucket`), and searching for `site:<bucket>.s3.amazonaws.com` or
  `"s3.amazonaws.com" OR "s3-us-west"` alongside the provider name surfaces fetchable mirrors
  of the same public documents. Using this, CA landed 2 fully verified sources (Corinthian
  Title, First American Title) — see CA.md for detail and for other providers found but not
  verifiable (Pacific Coast Title, Stewart, WFG, Fidelity National Title, Old Republic,
  California Best Title/NATIC all had real-looking schedules that 403'd on every domain
  tried). Worth a retry on GA/NC with the same S3-mirror-search technique.
