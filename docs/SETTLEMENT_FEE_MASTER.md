# Settlement Fee Master — FA recon + FNTE comparison

**Date:** 2026-07-24
**One-file master.** Combines (1) the FNTE-vs-FirstAm comparison for decisions and (2) the full tiered
FirstAm buyer-side data behind it. Supersedes the earlier `FA_VS_FNTE_SETTLEMENT.md` and
`FA_SETTLEMENT_RECON_TIERED.md` (removed). Raw per-tier data: `fa-settlement-recon-<amount>.csv`.

## What this is
- **FNTE** = the fixed settlement fee we currently quote (`FNTEFees` table; flat per state, Purchase/Refi).
- **FA** = FirstAm's own **buyer-side** escrow/closing fee, from a live LVIS-API recon, at 6 deal sizes.
- **These are two different companies' fees** (FirstAm = underwriter/escrow provider; FNTE = agency). A
  difference is **intel / sanity-check, not "our fee is wrong."** Nothing here is deployed or wired in.
- FA amounts are **buyer-side only** (FA splits escrow buyer/seller, often 50/50; we compare the buyer
  share to our buyer-facing fee).

**Legend:** `$n` = FA buyer-side settlement · `bundled` = FA folds closing into the premium (no separate
fee) · `no-menu` = FA offers no closing product for that state (nothing to compare).

**Method:** $250k/$500k/$750k/$1M/$1.5M/$2M, loan = 80% LTV, residential, county seat per state,
Purchase + Refinance. Tool: `scratchpad/fa-settlement-recon-all-states.js`.

---

# PART 1 — FNTE vs FA (the comparison)

`Δ @500k` = FA(500k) − FNTE. Comparison shown only where FA prices settlement.

## Purchase

| ST | FNTE | FA 250k | FA 500k | FA 1M | FA 2M | FA behavior | Δ @500k |
|----|-----:|--------:|--------:|------:|------:|-------------|--------:|
| AK | $1,150 | $400 | $650 | $1,150 | $2,150 | scales | −500 |
| CA | $550 | $1,250 | $1,750 | $2,750 | $3,950 | scales | **+1,200** |
| CO | $550 | $685 | $685 | $685 | $685 | flat | +135 |
| FL | $550 | $595 | $595 | $595 | $595 | flat | +45 |
| HI | $595 | $1,123 | $1,425 | $2,232 | $3,103 | scales | **+830** |
| ID | $450 | $438 | $700 | $700 | $700 | scales | +250 |
| IL | $550 | $2,050 | $2,200 | $2,700 | $3,700 | scales | **+1,650** |
| KS | $550 | $225 | $225 | $225 | $225 | flat | −325 |
| MI | $550 | $595 | $595 | $595 | $595 | flat | +45 |
| MN | $550 | $325 | $325 | $325 | $325 | flat | −225 |
| MO | $550 | $395 | $395 | $395 | $395 | flat | −155 |
| NJ | $350 | $525 | $525 | $525 | $525 | flat | +175 |
| NM | $1,700 | $646 | $834 | $1,238 | $2,045 | scales | **−866** |
| NV | $1,300 | $515 | $695 | $880 | $1,193 | scales | **−605** |
| OH | $291 | $295 | $295 | $295 | $295 | flat | +4 |
| OK | $550 | $395 | $395 | $395 | $395 | flat | −155 |
| OR | $1,200 | $1,075 | $1,200 | $1,450 | $1,950 | scales | +0 |
| TX | $550 | $795 | $795 | $795 | $795 | flat | +245 |
| UT | $550 | $415 | $415 | $415 | $415 | flat | −135 |
| WA | $450 | $1,382 | $1,631 | $1,879 | $2,045 | scales | **+1,181** |
| WY | $580 | $225 | $225 | $375 | $500 | scales | −355 |
| PA | $550 | $0 | $0 | $0 | $0 | (caveat) | −550 |

**No FA comparison (Purchase):** bundled → AZ, IN, WI · no-menu → AL, AR, CT, DC, DE, GA, IA, KY, LA,
MA, MD, ME, MS, MT, NC, ND, NE, NH, NY, RI, SC, SD, TN, VA, VT, WV.

## Refinance

| ST | FNTE | FA 250k | FA 500k | FA 1M | FA 2M | FA behavior | Δ @500k |
|----|-----:|--------:|--------:|------:|------:|-------------|--------:|
| AK | $350 | $400 | $400 | $500 | bundled | scales | +50 |
| CA | $350 | $605 | $685 | $925 | $1,085 | scales | +335 |
| CO | $250 | $425 | $425 | $425 | $425 | flat | +175 |
| ID | $350 | $600 | $900 | $900 | $900 | scales | **+550** |
| IL | $350 | $325 | $325 | $325 | $325 | flat | −25 |
| KS | $350 | $400 | $400 | $400 | $400 | flat | +50 |
| MI | $350 | $195 | $195 | $195 | $195 | flat | −155 |
| MN | $350 | $325 | $325 | $325 | $325 | flat | −25 |
| MO | $350 | $250 | $250 | $250 | $250 | flat | −100 |
| NJ | $350 | $525 | $525 | $525 | $525 | flat | +175 |
| NM | $350 | $592 | $592 | $592 | $592 | flat | +242 |
| OH | $350 | $250 | $250 | $250 | $250 | flat | −100 |
| OK | $350 | $325 | $325 | $325 | $325 | flat | −25 |
| OR | $350 | $395 | $395 | $395 | $395 | flat | +45 |
| UT | $350 | $410 | $410 | $410 | $410 | flat | +60 |
| WA | $350 | $768 | $768 | $768 | $768 | flat | **+418** |
| WY | $350 | $225 | $225 | $225 | $600 | scales | −125 |
| PA | $350 | $0 | $0 | $0 | $0 | (caveat) | −350 |

**No FA comparison (Refinance):** bundled → AZ, FL, HI, IN, NV, TX, WI · no-menu → same 26 as purchase.

## Where FNTE and FA diverge most (purchase, $500k)
- **FNTE below FA** (our flat fee cheaper — the scaling-escrow states): IL +$1,650 · CA +$1,200 ·
  WA +$1,181 · HI +$830 · ID +$250 · TX +$245.
- **FNTE above FA** (our flat fee higher): NM −$866 · NV −$605 · PA −$550 (caveat) · WY −$355 ·
  KS −$325 · MN −$225.
- **Close (±$50):** OH +$4, OR +$0, FL/MI +$45.

Pattern: in **value-based-escrow states** (CA, WA, HI, IL) our flat fee is far under FA on big deals and
close on small ones; in **flat-fee promulgated states** we're usually within a few hundred dollars.

---

# PART 2 — Full FA buyer-side data (tiered)

## Purchase — FA buyer-side by deal size

| ST | 250k | 500k | 750k | 1M | 1.5M | 2M |
|----|-----:|-----:|-----:|---:|-----:|---:|
| AK | 400 | 650 | 900 | 1,150 | 1,650 | 2,150 |
| CA | 1,250 | 1,750 | 2,250 | 2,750 | 3,350 | 3,950 |
| CO | 685 | 685 | 685 | 685 | 685 | 685 |
| FL | 595 | 595 | 595 | 595 | 595 | 595 |
| HI | 1,123 | 1,425 | 1,882 | 2,232 | 2,668 | 3,103 |
| ID | 438 | 700 | 700 | 700 | 700 | 700 |
| IL | 2,050 | 2,200 | 2,450 | 2,700 | 3,200 | 3,700 |
| KS | 225 | 225 | 225 | 225 | 225 | 225 |
| MI | 595 | 595 | 595 | 595 | 595 | 595 |
| MN | 325 | 325 | 325 | 325 | 325 | 325 |
| MO | 395 | 395 | 395 | 395 | 395 | 395 |
| NJ | 525 | 525 | 525 | 525 | 525 | 525 |
| NM | 646 | 834 | 1,076 | 1,238 | 1,641 | 2,045 |
| NV | 515 | 695 | 802 | 880 | 1,037 | 1,193 |
| OH | 295 | 295 | 295 | 295 | 295 | 295 |
| OK | 395 | 395 | 395 | 395 | 395 | 395 |
| OR | 1,075 | 1,200 | 1,325 | 1,450 | 1,700 | 1,950 |
| TX | 795 | 795 | 795 | 795 | 795 | 795 |
| UT | 415 | 415 | 415 | 415 | 415 | 415 |
| WA | 1,382 | 1,631 | 1,824 | 1,879 | 2,045 | 2,045 |
| WY | 225 | 225 | 250 | 375 | 375 | 500 |
| PA | 0 | 0 | 0 | 0 | 0 | 0 |

**bundled:** AZ, IN, WI. **no-menu:** AL, AR, CT, DC, DE, GA, IA, KY, LA, MA, MD, ME, MS, MT, NC, ND, NE,
NH, NY, RI, SC, SD, TN, VA, VT, WV.

## Refinance — FA buyer-side by deal size

| ST | 250k | 500k | 750k | 1M | 1.5M | 2M |
|----|-----:|-----:|-----:|---:|-----:|---:|
| AK | 400 | 400 | 500 | 500 | bundled | bundled |
| CA | 605 | 685 | 785 | 925 | 1,085 | 1,085 |
| CO | 425 | 425 | 425 | 425 | 425 | 425 |
| ID | 600 | 900 | 900 | 900 | 900 | 900 |
| IL | 325 | 325 | 325 | 325 | 325 | 325 |
| KS | 400 | 400 | 400 | 400 | 400 | 400 |
| MI | 195 | 195 | 195 | 195 | 195 | 195 |
| MN | 325 | 325 | 325 | 325 | 325 | 325 |
| MO | 250 | 250 | 250 | 250 | 250 | 250 |
| NJ | 525 | 525 | 525 | 525 | 525 | 525 |
| NM | 592 | 592 | 592 | 592 | 592 | 592 |
| OH | 250 | 250 | 250 | 250 | 250 | 250 |
| OK | 325 | 325 | 325 | 325 | 325 | 325 |
| OR | 395 | 395 | 395 | 395 | 395 | 395 |
| UT | 410 | 410 | 410 | 410 | 410 | 410 |
| WA | 768 | 768 | 768 | 768 | 768 | 768 |
| WY | 225 | 225 | 225 | 225 | 600 | 600 |
| PA | 0 | 0 | 0 | 0 | 0 | 0 |

**bundled:** AZ, FL, HI, IN, NV, TX, WI. **no-menu:** same 26 as purchase (incl. TN).

## What the tiers reveal
- **Scales with deal size** (value-based escrow): CA, WA, HI, IL, AK, NM, NV, OR. e.g. CA purchase buyer
  $1,250 (250k) → $3,950 (2M); WA plateaus at $2,045 above $1.5M.
- **Flat** (fixed regardless of size): TX $795, FL $595, CO $685, MI $595, KS $225, OH $295, NJ $525,
  OK $395, UT $415, MN $325, MO $395, ID $700 (above 250k).
- Coverage per tier: ~22 states price purchase, ~17 price refi, 3 bundled, 26 no-menu.
- Refi is cheaper/flatter than purchase and bundled in more states (TX, FL, HI, NV, AZ, IN, WI).

---

# Caveats
- **PA = $0** via this path — a product-selection quirk, not truly free; treat PA rows as unresolved.
- **TN / IN** need non-default transaction types (TN: "Owner's Policy and Loan Policy (Simo)" / "Loan
  Policy - Property Already Owned"; IN refi: "Mortgage"). Confirmed separately: TN = no-menu, IN =
  bundled; shown as such.
- Buyer-side; 80% LTV; one metro county per state; one sample per tier (a few states vary by county).
- **FA ≠ FNTE fees** — intel/sanity-check only, not a directive to change any FNTE price.

## Tool & data (reusable, read-only)
`scratchpad/fa-settlement-recon-all-states.js <amount> [ST,…]` → `fa-settlement-recon-<amount>.csv`
(columns: State, Txn, Status, **FA_Buyer**, FA_Seller, FA_Total, DefaultClosingName, Breakdown).
Node 22 + FA OAuth (`shared/auth.js`) + `NODE_PATH`→repo `node_modules`. Research only.
