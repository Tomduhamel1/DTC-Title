# Broker / LO Beta — Operating Procedure Runbook

**Audience:** BetterClose admins/operators running the controlled broker beta.
**Scope:** documents the current, code-backed broker/LO flow exactly as it
behaves today. It is a runbook, not a spec — if the code changes, update this.

**One-line summary:** Admins create and verify a broker company, add a broker/LO
(who gets a welcome email), the broker creates/sends quotes and — once their
company is verified — converts a quote into a real Closing. **Conversion is
silent: it does not notify ops or push to Garden. An admin must notice it by
checking `/admin/closings` and then handle the file operationally.**

---

## Roles & gates (read this first)

- **Admin** — anyone whose email is in the `ADMIN_EMAILS` allowlist. All
  broker-company management is admin-only (`requireAdmin`).
- **Broker/LO** — a `User` with a `BrokerMembership`. **Membership is the broker
  portal gate** (`requireBrokerMember`), *not* `accountType`.
- **Two independent gates, don't confuse them:**
  - **BrokerMembership** → can the user use the broker portal at all (create/send
    quotes, see pipeline).
  - **BrokerCompany verified** (`verifiedAt` set) → can the broker **convert** a
    quote into a Closing. Verification gates **conversion only** — nothing else.

---

## The process, step by step

### 1. Create a BrokerCompany (admin)
- **Where:** `/admin/broker-companies` (list page + editor).
- **API:** `POST /api/admin/broker-companies` — `name` required; `slug`
  auto-derives from the name if you don't supply one; optional `primaryDomain`,
  `notes`.
- New companies start **unverified** (`verifiedAt = null`).
- `primaryDomain` is **informational only** — it is never used for auth or to
  auto-assign members. Adding members is always explicit.
- Slug must be unique (duplicate → error).

### 2. Verify a BrokerCompany (admin)
- **Where:** `/admin/broker-companies/[id]` (the company editor).
- **API:** `PATCH /api/admin/broker-companies/[id]` with `{ verified: true }`
  → sets `verifiedAt = now()`. Idempotent (re-verifying keeps the original
  timestamp). `{ verified: false }` clears it.
- **Verification is a human decision made out-of-band** (vet NPN, state licenses,
  settlement-agent arrangement on a call), then flip the toggle. There is no
  in-app verification workflow — just the toggle.
- **What verification unlocks: quote → closing conversion. Nothing else.**

### 3. Add a broker / LO to the company (admin)
- **Where:** company editor → add member by email (+ optional name).
- **API:** `POST /api/admin/broker-companies/[id]/members`.
- **Behavior (idempotent — safe to re-run):**
  - Email matches **no** existing user → creates a minimal `User`
    (`accountType='professional'`, no password/session yet; their first
    magic-link sign-in hydrates the account).
  - Email matches a **borrower** user → upgraded to `professional`.
  - Email matches a `professional`/`admin` → left as-is (never demoted).
  - Inserts a `BrokerMembership` (default `role='member'`) unless one already
    exists for that (user, company).

### 4. Welcome email (what the broker/LO receives)
- **Fires only on initial membership creation** — never on an idempotent re-add.
- **Best-effort:** an email send failure does **not** roll back the membership
  (the broker is still added).
- **Local/dev:** honors `AUTH_EMAIL_DRY_RUN=true` (logs instead of sending).
- **Subject:** "You're set up on BetterClose · {Company}".
- **Body branches on the company's verified state at the moment of add:**
  - **Verified company:** tells them they can convert approved quotes into
    closings.
  - **Unverified company:** "Create and send quotes now. Quote-to-closing
    conversion unlocks once BetterClose verifies your company."
- CTA: one-tap magic-link sign-in to `/teammate/dashboard`.

> Note: if you add a member **before** verifying, their welcome email says
> conversion is not yet unlocked. Verify first if you want the member's first
> email to reflect full access.

---

## What a broker/LO can do — by verification state

### Before verification (membership exists, company NOT verified)
- ✅ Sign in (magic link) → `/teammate/dashboard`.
- ✅ **Create quotes** — `POST /api/broker/quotes` (no verified gate).
- ✅ **Send / share quotes** — `POST /api/broker/quotes/[id]/send`. Borrower opens
  the public `/quote/view?token=…` (no login). Quote status: `draft → sent`;
  resending a `sent`/`viewed` quote is allowed.
- ✅ **Track pipeline** — `/teammate/pipeline`, quote list/detail.
- ❌ **Cannot convert** — `POST /api/broker/quotes/[id]/convert` returns **403**
  ("broker company is not verified for conversion").

### After verification (membership exists, company verified)
- ✅ Everything above, **plus**
- ✅ **Convert a quote into a real Closing** (see next section).

---

## Quote create / send / convert behavior

### Create
`POST /api/broker/quotes` — requires membership. Produces a `FeeQuote`
(`status='draft'`) scoped to the broker's company, with a public `shareToken`
and a 30-day expiry.

### Send
`POST /api/broker/quotes/[id]/send` — emails the borrower a public-view link.
- `draft` → sends, records `sent`, status → `sent`.
- `sent` / `viewed` → resends, no status change.
- `converted` / `expired` → 400 (make a new quote).

### Convert (verified companies only)
`POST /api/broker/quotes/[id]/convert`. Eligibility, checked in order (each
failure stops before any write):
1. caller has BrokerMembership → else 401
2. quote belongs to the caller's company → else 404 (no existence leak)
3. quote already converted → 200 idempotent replay (returns the same Closing)
4. **company is verified → else 403**
5. quote not expired → else 400
6. quote has a `borrowerEmail` → else 400

Concurrency: conversion runs under a **per-quote advisory lock**, so two
simultaneous "Convert" clicks cannot create two Closings.

### What conversion creates
Conversion reuses the shared order-ingest path (`createClosingFromOrder`), so the
resulting Closing is **shaped identically to one TPS would create**:
- A `Closing` with `status='active'`, `source='inbound_order'`.
- **All 5 milestones seeded** in their initial state.
- Borrower identity resolved: matched to an existing borrower User/Closing, or an
  orphan Closing is created and the **borrower** gets a welcome email.
- A `TeammateClosing(role='broker')` is upserted for the converting broker, so
  the file appears in their team dashboard / pipeline.
- The `FeeQuote` is marked `status='converted'` and linked to the new Closing.

---

## ⚠️ The manual ops gap — read carefully

**Conversion creates the file and then stops. Nothing automatic happens next.**

- **Conversions are silent.** Converting a quote does **not** notify the ops team
  — there is **no Slack message, no ops email, no admin alert** on conversion.
  (The borrower may get a welcome email on the orphan branch; ops gets nothing.)
- **Conversion does not push to Garden** or any downstream processing. It only
  creates the BetterClose `Closing` row + seeded milestones.
- **Milestones do not advance on their own.** The file sits `active` with all 5
  milestones in their initial state until **a human advances them** — an admin in
  `/admin/closing/[id]` (milestone controls) or the TPS/Garden integration calling
  the milestone endpoint. Borrower + teammate milestone emails only fire **when a
  milestone is marked done**, i.e. after manual/TPS action.
- **A converted Closing looks like any TPS order** in the admin list (both are
  `source='inbound_order'`). The admin closing detail page does **not** currently
  surface the source quote or the broker who converted it.

**Therefore, for the beta, an admin MUST manually notice conversions and handle
each file operationally.** The only signal that a conversion happened is the new
row appearing in `/admin/closings`.

---

## Beta checklist — inviting ONE broker/LO

1. [ ] **Create the company:** `/admin/broker-companies` → create with the real
       company name.
2. [ ] **Vet & verify (if granting conversion now):** confirm NPN / state licenses
       / settlement arrangement out-of-band, then toggle **verified** on the
       company. (Skip if you intend to let them quote first and verify later —
       but then their welcome email will say conversion is locked.)
3. [ ] **Add the broker/LO** by their work email (+ name) on the company detail
       page. This sends the welcome email.
4. [ ] **Confirm the welcome email** (in dev: check the dry-run log; in prod:
       confirm delivery to a real address once).
5. [ ] **Have the broker sign in** via the magic link and create a test quote;
       confirm it appears in their pipeline and the public `/quote/view?token=…`
       link renders for the borrower.
6. [ ] **If verified — test one conversion** end to end: broker converts a quote
       with a `borrowerEmail` → confirm a new `active` Closing appears in
       `/admin/closings`, then **advance its milestones manually** to validate the
       borrower/teammate milestone emails.
7. [ ] **Brief the broker** that quotes are live now and that file
       progress/closing is handled by the BetterClose team after they convert.

---

## Daily admin ritual (while the beta is silent)

Because conversions don't notify anyone, do this **once per business day** (more
often if a broker is mid-deal):

1. [ ] Open **`/admin/closings`** and scan the most-recent rows (it's sorted by
       last updated). Filter by **Active** to focus on live files.
2. [ ] For any **new file you didn't already know about**, confirm it's a broker
       conversion (recently created, `inbound_order`) and **open it operationally**
       — i.e. begin the same handling you'd do for a TPS order.
3. [ ] **Advance milestones** as the file progresses (`/admin/closing/[id]`), which
       is what triggers borrower + teammate update emails.
4. [ ] Sanity-check for an **orphaned Closing** (rare worst case: a Closing got
       created but its source quote link failed) — a recent `inbound_order` Closing
       with no corresponding converted quote. If found, reconcile manually.

> Tip: `/admin/closings` and `/admin/users` now support search/filter — use them
> to find a specific borrower or company quickly.

---

## Known limitations — NOT launch blockers for a controlled beta

These are accepted gaps for a **small, hands-on, controlled** beta. They become
priorities as volume grows.

1. **Silent conversions (no ops notification).** Mitigated by the daily admin
   ritual above. Acceptable at low volume where an admin is already watching.
2. **No automated milestone progression / no Garden auto-push on conversion.**
   Files are driven to close manually/TPS, exactly as today's TPS orders are.
3. **Thin admin traceability.** The admin closing detail doesn't yet link back to
   the source quote/broker; the company page doesn't show quote/conversion counts.
   Workaround: the data exists in the DB and the file behaves like any order.
4. **Verification is a manual toggle** with no in-app vetting workflow. Fine — the
   vetting is a human conversation; the toggle records the decision.

**These are documentation/operational gaps, not correctness bugs.** The core path
(create → verify → add member → quote → send → convert → seeded Closing) is
functionally complete and safe.

---

## Tier 3 (conversion → ops notification) is DEFERRED

A push notification to ops on conversion (Slack/email/log) is the highest-value
next improvement, but it is a **product code change** and is **explicitly deferred**.
**It is NOT a launch blocker for the first controlled beta** — the daily admin
ritual covers it at beta volume. Revisit and prioritize Tier 3 if/when conversion
volume makes the manual check unreliable.

---

## Quick reference — endpoints & gates

| Action | Endpoint | Gate |
|---|---|---|
| Create company | `POST /api/admin/broker-companies` | admin |
| Verify company | `PATCH /api/admin/broker-companies/[id] {verified:true}` | admin |
| Add member | `POST /api/admin/broker-companies/[id]/members` | admin |
| Create quote | `POST /api/broker/quotes` | membership |
| Send quote | `POST /api/broker/quotes/[id]/send` | membership |
| Convert quote | `POST /api/broker/quotes/[id]/convert` | membership **+ verified** |
| Advance milestone | `/admin/closing/[id]` (UI) / `POST /api/admin/closing/[id]/milestone` | admin |
| Watch for conversions | `/admin/closings` (manual, daily) | admin |
