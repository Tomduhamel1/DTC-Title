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
| CA | unprocessed | | |
| GA | unprocessed | | |
| NC | unprocessed | | |
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
