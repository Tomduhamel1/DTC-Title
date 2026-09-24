# Dependency security review — September 23, 2026

Scope: BetterClose's production dependency tree on the unmerged PR #106 branch.
The user approved sending dependency names/versions to npm for this audit.
No source, secrets or customer records were submitted. No production change.

## Compatible corrections prepared

| Dependency | Before | Prepared version |
| --- | --- | --- |
| next-auth | 4.24.14 | 4.24.15 |
| @auth/prisma-adapter | 2.11.2 | 2.11.3 |
| adapter's @auth/core | 0.41.2 | 0.41.3 |
| AWS S3/SES clients and S3 presigner | 3.972.0 | 3.1139.0 |
| @sentry/nextjs | 10.50.0 | 10.75.3 |

Also refreshed compatible vulnerable transitive packages within their declared
ranges. No forced overrides, audit-fix force, Next/React/Prisma major upgrade,
or Puppeteer major upgrade. AWS SDK requires Node 20+, matching existing CI.

The auth patch addresses upstream identifier normalization and malformed Bearer
handling. See the maintainer's [email normalization advisory](https://github.com/nextauthjs/next-auth/security/advisories/GHSA-7rqj-j65f-68wh).
Tests invoke the actual installed sign-in route and JWT implementation, with
only persistence and mail delivery intercepted. Six tests fail on the previous
4.24.14 library; all ten pass on 4.24.15. This is a local regression reproduction,
not evidence of exploitation in production. The app uses email, not OAuth login.

Three additional tests run actual application SES/upload helpers through real
SDK signing/serialization, with synthetic credentials and an in-memory HTTP
transport. They verify the Pro recipient, EO Reply-To, message content, provider
refusal propagation and five-minute S3 URL signing. No request reaches AWS.

## Audit result — partial remediation, not launch clearance

`npm audit --omit=dev --json` reported:

| Stage | Critical | High | Moderate | Low | Total flagged packages |
| --- | ---: | ---: | ---: | ---: | ---: |
| Starting tree | 6 | 13 | 29 | 1 | 49 |
| Auth patches | 3 | 13 | 28 | 1 | 45 |
| Compatible patches | 1 | 7 | 0 | 0 | 8 |

These are npm package-level findings, including dependent packages; they are
not counts of distinct exploitable application defects. The final eight are
`next`, its nested `postcss`, `puppeteer`, `puppeteer-core`,
`@puppeteer/browsers`, `extract-zip`, `tar-fs` and `ws`.

- Next remains 14.0.4. Even npm's suggested 14.2.35 is not a complete fix:
  [14.x is unsupported](https://nextjs.org/support-policy), and current
  [image-optimization patches](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4)
  are on 15.5.24/16.3.3 or newer supported lines. Plan a dedicated supported
  framework migration with Amplify compatibility, route/session/access/cache,
  image, build and browser regression verification. Do not label a 14.x patch
  as a clean security audit.
- Puppeteer remains 21.11.0. It is used in `src/lib/pdf/generator.ts`, not only
  tests. Do not hide findings by moving it to devDependencies. Its major/browser
  upgrade needs PDF-output and deployment-runtime tests; no unreviewed browser
  download, dependency override or major migration was performed here.
- This was dependency triage, not a full penetration test or live exposure audit.
  Audit counts/advisories can change; rerun before the eventual release.

## Verification on the prepared dependency tree

- TypeScript check and local production-mode build passed.
- 84 real-local-PostgreSQL integration/policy/identity/journey tests passed.
- 74 unit/contract/template/security/SDK tests passed, including the 13 new tests.
- 17 offline browser tests passed: email layout, EO intro, sign-in journeys and
  borrower controls. Browser/network boundaries remain synthetic.
- Focused new auth/SDK tests are now required by the release-typecheck workflow.
- Final-head remote CI must also pass; local success is not a deployment.

Test writes were confined to the existing verified local
`garden_ldi_betterclose_journeys_link_sep23`
database. No production database, recipient, mailbox, credential or sync changes.

SES approval, real EO photo/reply-route verification, backlog review and explicit
release/activation approval remain separate gates in
`INTEGRATION-LAUNCH-CHECKLIST.md`.
