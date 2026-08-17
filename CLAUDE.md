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
- **SES is in the SANDBOX and a production-access request was DENIED**
  (case `177722805500436`). In the sandbox SES delivers only to *verified*
  addresses, so real users cannot sign in. **This is launch-blocking.**
  Appeal text: `docs/SES_PRODUCTION_ACCESS_APPEAL.md`.
- **Debugging trap:** the sandbox refusal comes back as `AccessDenied`
  naming the **recipient's** ARN, which looks exactly like an IAM problem.
  NextAuth then shows every failure as the same opaque `EmailSignin`
  error. Testing with an already-verified address (e.g. Tom's Gmail)
  **falsely appears to pass** — always test with an unverified outside
  address, and check `ProductionAccessEnabled` via
  `aws sesv2 get-account --region us-east-1` first.
- Interim unblock for one person:
  `aws ses verify-email-identity --email-address <addr> --region us-east-1`
  (they must click AWS's confirmation email).
- **Admin access** = email listed in `ADMIN_EMAILS` (app-level env,
  comma-separated; `src/lib/auth/admin.ts`). No role column. Changing it
  requires a rebuild.

## Coming-soon gate

`middleware.ts` gates public marketing pages when `COMING_SOON_MODE=true`;
`/quote`, `/admin`, `/api`, auth, and dashboard stay live. Preview bypass:
`https://www.betterclose.co/?preview=<COMING_SOON_BYPASS_KEY>` (sets a
30-day cookie, lands on `/preview`); any signed-in session also bypasses.
Keep `COMING_SOON_MODE` and `COMING_SOON_BYPASS_KEY` set — with them
missing the gate fails **open**, exposing `/licenses` (placeholder license
numbers) and `/for-lenders` (advertises a non-live API).

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
