# BetterClose Controlled Broker Beta — Deployment Readiness Checklist (planning memo)

**Status:** planning/checklist only. No code. A go/no-go gate to run **before inviting the first broker/LO** to the controlled beta on production.

**Two bars, kept separate:**
- **§A — MUST be true before the controlled beta** (inviting one broker/LO).
- **§B — MUST be true before public launch** (lifting coming-soon to the world).

Verified against `main` HEAD `bc9fc81` (PR #26). Where a value can only be checked in the live Amplify/DB environment, the item says **[verify in prod]**.

---

## §A — Before the controlled broker beta

### A1. Deployed commit
- [ ] **Amplify has built & deployed `bc9fc81`** (the PR #26 merge) or later. **This is hard-gating:** the broker-conversion ops email + admin Source card (PR 8) only exist as of `bc9fc81`. Inviting a broker before this commit is live means conversions are still silent.
  - Verify: Amplify console → app `d35onu8fu08g89` → latest successful build's commit == `bc9fc81` (or newer).

### A2. Environment variables (runtime SSR Lambdas)
Amplify only propagates vars listed in `amplify.yml`'s whitelist into `.env.production`. The whitelist currently includes: `DATABASE_URL NEXTAUTH_SECRET NEXTAUTH_URL AUTH_EMAIL_DRY_RUN APP_AWS_REGION APP_AWS_ACCESS_KEY_ID APP_AWS_SECRET_ACCESS_KEY APP_AWS_SES_FROM_EMAIL APP_AWS_S3_BUCKET HELLO_EMAIL ORDER_INGEST_SECRET COMING_SOON_MODE ADMIN_EMAILS COMING_SOON_BYPASS_KEY BROKER_OPS_EMAIL`. For each, confirm it's **set in the Amplify env** (the build log prints `- KEY (len=…)` vs `KEY MISSING!`):

- [ ] **`AUTH_EMAIL_DRY_RUN` = `false`** (or unset). **Most important email switch.** If it's `true` in prod, the welcome/magic-link/ops-handoff emails are **logged, not sent** — the broker never gets a sign-in link and ops never gets the handoff. **[verify in prod]**
- [ ] **`NEXTAUTH_URL` = `https://www.betterclose.co`** (exact prod origin). Consumed by the magic-link callback **and** every emailed link (welcome, conversion-ops, milestone, `/for-my-team`). A wrong value breaks sign-in and all email links. **[verify in prod]**
- [ ] **`BROKER_OPS_EMAIL`** — optional; defaults to `orders@betterclose.co`. Set it only if a dedicated ops inbox is wanted. Confirm whoever monitors it is briefed. **[verify in prod]**
- [ ] **`ORDER_INGEST_SECRET`** — set. *Note:* not used by the broker convert→ops chain itself; it gates the **TPS/order-ingest + TPS milestone** endpoints. Needed if TPS/Garden will push milestone updates onto the converted closing (the manual-ops handoff path). Set for beta so milestone updates can flow.
- [ ] **`DATABASE_URL`** — points at the prod DB (Neon). **[verify in prod]**
- [ ] **`NEXTAUTH_SECRET`** — set (sessions break if rotated/missing).
- [ ] **`ADMIN_EMAILS`** — includes the operator(s) who will verify companies + run the daily ritual (e.g. `tomduhamel@gmail.com`).
- [ ] **`APP_AWS_SES_FROM_EMAIL` / `APP_AWS_REGION` / SES creds** — set (see A4).
- [ ] **`COMING_SOON_MODE` = `true`** for the controlled beta (see A6).

### A3. Prisma migration status
- [ ] **Prod DB is at migration `20260512023652_broker_portal_foundation`** (the 7th/latest; adds BrokerCompany/BrokerMembership/FeeQuote/FeeQuoteEvent). The whole broker flow depends on it.
  - **Migrations are NOT run at Amplify build time** — they must be applied manually against the prod DB URL: `DATABASE_URL="<prod>" npx prisma migrate deploy`. (This was already applied to prod Neon during PR-2 work; **confirm** it's still current.)
  - Verify: `npx prisma migrate status` against the prod URL shows no pending migrations. **[verify in prod]**
  - **Note:** `amplify.yml`'s migration comment still says "RDS / your laptop," but prod is **Neon** — the *procedure* (manual `migrate deploy` from a whitelisted machine) holds; the comment wording is stale (doc-only cleanup, not a blocker).
- [ ] **PR 8 added no migration** — confirmed; nothing new to apply for the ops-handoff feature beyond migration 7.

### A4. SES production / DNS readiness
- [ ] **SES is out of sandbox** (or every beta recipient is a verified identity). In sandbox, SES only sends to verified addresses — the broker's welcome/magic-link and the ops inbox must each be verified, or sending fails. For a controlled beta with known addresses, sandbox + verified recipients is acceptable; production access is cleaner. **[verify in prod]**
- [ ] **From-address (`APP_AWS_SES_FROM_EMAIL`, default `noreply@betterclose.co`) is a verified SES identity.**
- [ ] **DNS: SPF + DKIM (and ideally DMARC) for `betterclose.co`** so welcome/magic-link/ops emails land in inbox, not spam. A magic link in spam = broker can't sign in. **[verify in prod]**
- [ ] **Reply-to (`HELLO_EMAIL`, default `hello@betterclose.co`) and `orders@betterclose.co` are monitored mailboxes** — the ops handoff and "reply if wrong" footers go there.
- [ ] **One real end-to-end email test** to a real inbox (welcome + magic link + a test conversion's ops email) with `AUTH_EMAIL_DRY_RUN=false`. This is the single most important pre-beta check after A1/A2.

### A5. Support phone placeholder status
- [ ] **Known/accepted:** `SUPPORT_PHONE_DISPLAY = '[SUPPORT PHONE TBD]'`, `SUPPORT_PHONE_TEL = ''` (PR 1). On surfaces that show it (dashboard, quote results, welcome email) the text reads "[SUPPORT PHONE TBD]" and **no `tel:` link renders** (guarded). For a controlled beta with a handful of known brokers this is **acceptable but visible** — decide whether to (a) drop a real number into `src/lib/contact.ts` first, or (b) accept the placeholder for beta. **Not a hard blocker for beta; flag for the invitee.** (It *is* a §B public-launch blocker — see B2.)

### A6. Coming-soon / public route posture
- [ ] **`COMING_SOON_MODE = true`** in prod. The beta runs **behind** coming-soon: the public homepage stays gated, while the broker can still reach the functional routes.
- [ ] **Functional routes reachable under coming-soon** (in `FUNCTIONAL_PREFIXES`): `/login`, `/teammate`, `/quote`, `/for-my-team`, `/for-brokers`, `/dashboard`, `/admin`, `/api`. ✓ (these let the broker sign in, quote, convert, and the public `/quote/view` link works for borrowers).
- [ ] **Brief the broker that the marketing homepage is intentionally gated** (they may see coming-soon at `/`); their entry point is the magic-link/sign-in, not the homepage. Optionally share `COMING_SOON_BYPASS_KEY` if you want them to see the full site.
- [ ] **Confirm `/licenses` and `/for-lenders` remain gated** (they carry placeholder license numbers / unlive API claims — the middleware guardrail comment from PR 3 documents "do not allowlist until fixed"). Not broker-beta-facing, but verify they didn't get un-gated. **[verify in prod]**

### A7. Login legal copy status
- [ ] **Already done (PR 3):** the `/login` consent line reads *"By continuing, you agree to receive a secure sign-in link from BetterClose."* — no links to nonexistent `/terms` or `/privacy`, no 404s. ✓ Acceptable for beta as-is. (Real Terms/Privacy pages are a §B item.)

### A8. Production smoke test (run once `bc9fc81` is live, with a throwaway/test broker)
Do this on prod **before** inviting the real broker. Use a verified test email for the broker and a separate one for the borrower.

1. [ ] **Admin onboarding:** create a BrokerCompany, **verify** it, **add** the test broker by email → confirm the **welcome email arrives** (real inbox, not dry-run).
2. [ ] **Broker sign-in:** broker uses the magic link → lands on `/teammate/dashboard` (confirms `NEXTAUTH_URL` + SES + `AUTH_EMAIL_DRY_RUN=false`).
3. [ ] **Quote create:** broker creates a quote → appears in their pipeline.
4. [ ] **Quote send:** broker sends it → **borrower receives the email**; the public `/quote/view?token=…` renders (confirms link/base-url + public route posture).
5. [ ] **Convert:** broker converts the quote (verified company, borrower email present) → a new `active` Closing is created.
6. [ ] **Ops email receipt:** the **`broker_conversion:ops_handoff` email arrives** at `BROKER_OPS_EMAIL`/`orders@betterclose.co`, with working links to the admin closing and the source quote. (This is the launch-blocker fix — verify it actually lands.)
7. [ ] **Admin Source card:** open `/admin/closings/[id]` → the **"converted from broker quote"** card shows broker name/email, BrokerCompany (linked), quote-view link, conversion time.
8. [ ] **Idempotency:** broker (or admin) re-hits convert → no duplicate Closing, **no second ops email**; one `broker_conversion:ops_handoff` NotificationLog row.
9. [ ] **Professional quote link (parallel surface):** open `/for-my-team/quote`, generate a quote → the **durable `/quote/view?token=…` share link** works in a fresh/incognito session (PR 4).
10. [ ] **Borrower invite claim:** create a `we_email` LenderRequest tied to a Closing → the invited pro opens `/for-my-team?ref=…`, signs in via magic link → `/teammate/dashboard?claim=…` creates a `TeammateClosing(role='unknown')`, self-identify works, and an admin milestone (`title_ordered → done`) fans out the teammate notification (PR 5 chain, now on real email).
11. [ ] **Tear down test rows** after the smoke test (the test company/quote/closing) so they don't clutter the real beta.

**Go/no-go:** all of A1–A4 + the A8 smoke (esp. steps 2, 6, 7) must pass. A5 (phone placeholder) is an accept-or-fix decision, not a hard stop.

---

## §B — Before public launch (NOT required for the controlled beta)

These can stay open during the controlled beta but block opening to the public.

- [ ] **B1. Lift coming-soon** (`COMING_SOON_MODE=false`) only after the public marketing surfaces are launch-clean.
- [ ] **B2. Real support phone** in `src/lib/contact.ts` (replace `[SUPPORT PHONE TBD]` / empty tel). Public visitors seeing a "TBD" number is a credibility problem at scale.
- [ ] **B3. Real `/terms` and `/privacy` pages** (PR 3 shipped honest interim copy with no links; a public launch with account creation should have real legal pages).
- [ ] **B4. `/licenses` real license numbers** (currently `[number]` placeholders — a public, indexable page advertising licensure with placeholders is a regulatory risk). Keep gated until fixed.
- [ ] **B5. `/for-lenders` unlive API claims** rewritten (developer portal / webhooks / `POST /api/quote/quick` don't exist). Keep gated until fixed.
- [ ] **B6. Verify `1-800-316-9508`** (the real-looking number pervasive in nav/footer/`/security`) is a real, answered line — or replace it. Flagged in PR 3; unverified.
- [ ] **B7. Rate-limit durability** — the in-memory limiter (`/api/fee-estimate`, `/api/professional/quotes`, quote-view, auth) is per-instance; fine for beta, swap to Upstash/Redis before public scale.
- [ ] **B8. Garden push / automated milestone progression** — the conversion ops email is the *temporary* handoff; public volume needs the real Garden integration (the runbook's deferred item).
- [ ] **B9. SES production access** (if still in sandbox) — mandatory before sending to arbitrary public addresses.

---

## Cross-references
- Operating procedure once live: `docs/broker-beta-runbook.md`.
- Conversion ops handoff behavior: PR #26 (`bc9fc81`).
- The invite→claim→fanout chain: validated in the PR 5 QA gate.

## Open questions for you
1. **`AUTH_EMAIL_DRY_RUN` in prod today** — is it `false`? (If it was ever set `true` in prod, no real emails are going out — this is the #1 thing to confirm.)
2. **Support phone for beta (A5/B2)** — drop a real number into `contact.ts` before the beta, or accept "[SUPPORT PHONE TBD]" for the controlled beta?
3. **SES** — are we in SES sandbox or production? (Determines whether beta recipients must be pre-verified.)
4. **Dedicated ops inbox** — keep the `orders@betterclose.co` default, or set `BROKER_OPS_EMAIL` to a separate monitored inbox?
5. Want me to turn §A into a one-page printable go/no-go checklist, or leave it inline here?
