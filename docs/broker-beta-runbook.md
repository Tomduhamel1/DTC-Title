# Broker / LO Beta — Operating Procedure Runbook

**Audience:** BetterClose admins/operators running the controlled broker beta.
**Scope:** documents the current, code-backed broker/LO flow exactly as it
behaves today. It is a runbook, not a spec — if the code changes, update this.

**One-line summary:** Admins create and verify a broker company, add a broker/LO
(who gets a welcome email), the broker creates/sends quotes and — once their
company is verified — converts a quote into a real Closing. **Conversion sends an
internal ops handoff email (to `BROKER_OPS_EMAIL`, default `orders@betterclose.co`)
but does not push to Garden. A human must open the order from that email (or from
`/admin/closings`) and handle the file operationally.**

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

## ⚠️ The manual ops handoff — read carefully

**Conversion creates the file, emails ops, and then stops. A human must run it.**

- **Conversion sends an internal ops handoff email.** When a verified broker
  converts a quote, BetterClose sends a best-effort internal email to
  **`BROKER_OPS_EMAIL`** (defaults to `orders@betterclose.co`) so a human knows
  to open and handle the order. The email includes the borrower, the broker +
  company, a link to the source quote, and a link to the closing in admin, and
  it states plainly that this is a temporary manual handoff until Garden
  linkage exists. The send is also recorded as a `NotificationLog` row
  (`kind='broker_conversion:ops_handoff'`), visible on the closing's admin
  detail page — so you can confirm it fired (or see `status='failed'` if SES
  hiccuped).
  - **Fires exactly once per conversion.** Replays / double-clicks / race-losers
    do **not** re-send (guarded on the genuine-conversion branch).
  - **Best-effort:** an email failure never blocks the conversion. If it fails,
    the `NotificationLog` row is `status='failed'` — the daily ritual below is
    still the backstop.
- **Conversion still does not push to Garden** or any downstream processing. It
  creates the BetterClose `Closing` row + seeded milestones and notifies ops by
  email — nothing more.
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

## Daily admin ritual

Conversions now email `BROKER_OPS_EMAIL` (default `orders@betterclose.co`), so the
primary signal is that inbox. Still do a daily sweep as a backstop (in case an
email failed to send) — once per business day, more often if a broker is mid-deal:

1. [ ] Work the **ops inbox** first: each "New broker-converted order" email links
       straight to the closing in admin and to the source quote. Open and handle it.
2. [ ] Then open **`/admin/closings`** and scan the most-recent rows (sorted by last
       updated; filter by **Active**) to catch anything whose ops email **failed**
       (look for a `broker_conversion:ops_handoff` notification with `status='failed'`
       on the closing detail page) or that you haven't handled yet. Begin the same
       handling you'd do for a TPS order.
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

1. **No Garden auto-push / no automated milestone progression on conversion.**
   Conversion now emails ops, but it does **not** push to Garden and does not
   advance milestones — a human still drives the file to close manually/TPS,
   exactly as today's TPS orders are. This is the remaining real gap.
2. **Ops email is best-effort.** If SES fails, the conversion still succeeds and a
   `broker_conversion:ops_handoff` `NotificationLog` row is written with
   `status='failed'`. The daily `/admin/closings` sweep is the backstop.
3. **Company-page activity counts.** The admin company page doesn't yet show a
   company's quote/conversion counts. (The closing detail page *does* now show
   source-quote/broker traceability.) Workaround: the data exists in the DB.
4. **Verification is a manual toggle** with no in-app vetting workflow. Fine — the
   vetting is a human conversation; the toggle records the decision.

**These are documentation/operational gaps, not correctness bugs.** The core path
(create → verify → add member → quote → send → convert → seeded Closing) is
functionally complete and safe.

---

## Garden push is still DEFERRED (the ops email is the temporary handoff)

The conversion → **ops email** is now implemented (this is the temporary manual
handoff). The remaining deferred piece is the **Garden push / automated downstream
processing** on conversion — that is **NOT a launch blocker for the first controlled
beta**: the ops email + daily sweep cover the handoff at beta volume. Revisit Garden
automation when conversion volume makes the manual handoff unreliable.

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
| Conversion ops handoff | email to `BROKER_OPS_EMAIL` (default `orders@betterclose.co`) on convert | automatic |
| Watch for conversions | ops inbox (primary) + `/admin/closings` daily sweep (backstop) | admin |
