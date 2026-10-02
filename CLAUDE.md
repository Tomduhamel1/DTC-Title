# BetterClose (Garden DTC) — working notes for Claude

Next.js title-and-settlement site. Read this before touching infrastructure,
deploys, or email — several things here are non-obvious and have burned real
hours.

## Deploy

- **Host:** AWS Amplify. App `betterclose`, **app ID `d35onu8fu08g89`**,
  region `us-east-1`, AWS account `621852467690`. AWS CLI works from Tom's
  laptop — use it instead of asking him to read consoles.
- **Branches:** `main` (production), `develop`. **Amplify auto-deploys on
  push to `main`** — after a merge a build starts by itself, so
  `start-job` will fail with `LimitExceededException`. Poll instead:
  `aws amplify list-jobs --app-id d35onu8fu08g89 --branch-name main`.
  Builds take ~4 minutes.
- **Live site:** https://www.betterclose.co (apex + `www` both → `main`).
  Local dev runs on port **5273** (never 5173 — that's another project).
- **Workflow:** branch → PR → merge to `main` → verify on the live site.

## Environment variables (read this before debugging config)

- Vars are split across **two levels** — check both: app-level
  (`aws amplify get-app`) and branch-level
  (`aws amplify get-branch --branch-name main`).
- **Amplify does not pass env vars to the runtime SSR Lambdas.**
  `amplify.yml`'s preBuild writes each whitelisted name into
  `.env.production` so Next bakes them in. Therefore:
  - env changes require a **rebuild** to take effect;
  - a var deleted in the console stays live in the running build and only
    vanishes on the *next* build (this nearly took the coming-soon gate
    down — see below);
  - a **new** var must also be added to the `for k in ...` list in
    `amplify.yml`;
  - the build log prints `- KEY (len=N)` or `KEY MISSING!` — grep it to
    confirm propagation.
- **Naming trap:** AWS reserves bare `AWS_*` names, so deployed vars use an
  **`APP_AWS_*`** prefix. Always read
  `process.env.APP_AWS_X || process.env.AWS_X || <literal>`. A mismatch here
  silently broke all sign-in email (PR #85).

## Email / auth

- NextAuth **magic links** (no passwords), sent via SES from
  `noreply@betterclose.co`.
- Sign-in emails now land on `/login/confirm`; an explicit confirmation POST
  redeems the unchanged one-use NextAuth token. GET/HEAD to the legacy email
  callback also show confirmation, never consume a token. Preserve this guard:
  mail-security scans can otherwise exhaust a fresh link before its recipient.
  Tokens travel in email URL fragments and POST bodies, not new GET queries.
- **SES production access was verified enabled on 2026-09-30 in us-east-1**;
  sending enabled, enforcement HEALTHY. Earlier sandbox denial/appeal notes
  are historical. Recheck `aws sesv2 get-account` before relying on this state.
- **Debugging trap:** the sandbox refusal comes back as `AccessDenied`
  naming the **recipient's** ARN, which looks exactly like an IAM problem.
  NextAuth then shows every failure as the same opaque `EmailSignin`
  error. Testing with an already-verified address (e.g. Tom's Gmail)
  **falsely appears to pass** — always test with an unverified outside
  address, and check `ProductionAccessEnabled` via
  `aws sesv2 get-account --region us-east-1` first.
- Interim unblock for one person:
  `aws ses verify-email-identity --email-address <addr> --region us-east-1`
  (they must click AWS's confirmation email). Confirmed working end to end
  for a verified recipient on 2026-08-17.
- **IAM shape for SES (do not "tighten" this):** AWS authorizes
  `ses:SendEmail` against the **recipient's** identity ARN as well as the
  sender's, so listing specific identity ARNs as `Resource` silently blocks
  mail to everyone not listed. The working policy on `betterclose-app` is
  `Resource: "*"` plus
  `Condition: StringLike { ses:FromAddress: "*@betterclose.co" }` — the
  condition is the real constraint (this key can only send *as*
  betterclose.co). Scoping `Resource` to `identity/betterclose.co` looks
  safer but yields `implicitDeny` with no matched statement. Check any
  change with `aws iam simulate-principal-policy` and a
  `ses:FromAddress` context entry.
- **Admin access** = email listed in `ADMIN_EMAILS` (app-level env,
  comma-separated; `src/lib/auth/admin.ts`). No role column. Changing it
  requires a rebuild.

## Coming-soon gate

`middleware.ts` gates public marketing pages when `COMING_SOON_MODE=true`;
`/quote`, `/admin`, `/api`, auth, and dashboard stay live. Preview bypass:
`https://www.betterclose.co/?preview=<COMING_SOON_BYPASS_KEY>` (sets a
30-day cookie, lands on `/preview`); any signed-in session also bypasses.
The owner authorized public launch on 2026-09-30 by setting the production
branch's `COMING_SOON_MODE=false` and rebuilding. Verify actual deployed config
and release status; source authorization is not deployment evidence. Preserve
the preview key and all unrelated settings. The switch can restore the marketing
gate without changing private-file authorization. `/licenses` now provides a
contact page rather than an unverified licensing list; `/for-lenders` describes
available Encompass/email ordering and custom API work by arrangement.
State-specific quote availability is separate: do not enable unoffered states
or remove Garden integration test restrictions as part of a marketing launch.

## Database

Neon serverless Postgres (not RDS, despite a stale comment in
`amplify.yml`), Prisma. **Migrations do not run during build** — run
`npx prisma migrate deploy` from the laptop before deploying schema
changes.

## Conventions

- **`ISSUES.md`** at the repo root tracks open problems — log new issues
  there.
- Pricing/savings numbers come from one engine; premiums are never compared
  or discounted. Evidence depth varies by state — `/admin/states` grades
  each state and lists what would upgrade it. Never inflate a comparison.
- Long local scripts: wrap in `caffeinate -i` (the laptop sleeping kills
  background jobs).
