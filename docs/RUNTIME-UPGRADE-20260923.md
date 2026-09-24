# BetterClose framework / PDF security follow-up

Prepared September 23, 2026 (Pacific), on `fix/betterclose-runtime-security`.
Stacked on #106 head `0f3b94cfab9d21e2a26a78825d41b10156666511`;
the existing #106 branch and all production state remain unchanged.
No new schema migration, financial/pricing rule, notification audience, mailbox,
credential, sync configuration or live email is part of this upgrade.

## Selected versions and hosting constraint

| Component | Previous locked version | Prepared locked version |
| --- | --- | --- |
| Next / eslint-config-next | 14.0.4 | 15.5.26 |
| React / react-dom | 18.3.1 | 19.3.0 |
| Puppeteer | 21.11.0 | 25.12.0 |
| Next's PostCSS | 8.4.31 | 8.5.28 |
| CI/build Node major | 20 / implicit host default | 22 (minimum 22.12) |

The [Amplify support matrix](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html)
documents Next 12–15, not 16. [Next's policy](https://nextjs.org/support-policy)
lists 14 unsupported and 15 Maintenance LTS. **This is a short bridge**: its
two-year window from October 21, 2024 reaches October 21, 2026. Confirm support
again before release and plan the Next 16/hosting decision before then.

[Puppeteer requires Node 22.12+](https://pptr.dev/guides/system-requirements).
`.nvmrc` and all CI jobs now select 22; package engines accept supported 22/24.
Amplify's build selects 22 explicitly with nvm; the
[SSR runtime follows the build's Node major](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-supported-features.html).
The actual AWS build/runtime still requires approved deployment verification.
No hosting setting was changed by preparing this file.

## Compatibility work

- Official Next 15 codemod converted request `params`, page `searchParams` and
  `cookies()` to asynchronous access. Route authorization and identity logic
  are unchanged; database tests now pass real Promise-valued route inputs.
- `/quote`, `/quote/results`, `/start` need Suspense around `useSearchParams`
  under production prerendering. Their inner forms/content remain unchanged.
  Real production-browser tests cover query selection, hydration and styles.
- Removed the obsolete `experimental.instrumentationHook` setting. Production
  TypeScript remains enabled; no errors were suppressed to pass the build.
- React 19 no longer ships UMD bundles. Offline browser fixtures now bundle the
  actual installed React/createRoot using esbuild, retaining all assertions.
- Puppeteer 25's HTML API separates `setContent` lifecycle from network idle;
  the helper waits for load then network idle before capturing. URL, Letter,
  margins, Buffer return and browser-finally-close behavior remain intact.
- `npm ci` replaces the deployment's legacy-peer/loose-install fallback. A
  failed deterministic install must stop the build instead of changing the tree.

## Dependency audit and deliberate override

After a clean install, `npm audit --omit=dev --json` reports **0 production
findings**, down from the base's 8 (1 critical, 7 high). Advisory results are
dated and package-level, not proof of complete application security or of any
prior exploitation. CI repeats this production audit; recheck before release.

Next 15.5.26 still pins PostCSS 8.4.31. Updating Next alone leaves the current
[PostCSS advisory](https://github.com/postcss/postcss/security/advisories/GHSA-6g55-p6wh-862q)
unresolved. The deliberate npm override uses the exact direct `postcss: 8.5.28`
through `"postcss": "$postcss"`. It stays in major 8, deduplicates all consumers,
and is verified by a clean `npm ci`, `npm ls postcss`, production build and
real-browser compiled-CSS checks. Review/remove it when Next's own pinned
version is patched. No `npm audit fix --force` or ignored peer conflicts.

## Verification evidence

Local Node 24.15.0, separate worktree and private dependency install:

- Clean locked install, Prisma generation, typecheck, full production build.
- 74 unit/contract/template/security/SDK tests, 84 database-backed integration,
  request-link, notification-policy and role-journey tests.
- 17 existing offline browser tests; both new real PDF generator tests pass.
- 7 new compiled-server checks: database sessions, a real CSRF/magic-link
  callback and token reuse refusal, borrower and Pro file authorization,
  integration key enforcement/read-only snapshot, auth cache/admin/marketing
  protections, and client hydration with compiled Tailwind/PostCSS styles.
- Local writes only to the verified task-owned loopback
  `garden_ldi_betterclose_journeys_link_sep23`, with synthetic fixtures. The
  compiled server receives an explicit environment allowlist and dry-run email.
- Four PDFs generated: HTML/URL paths with the old and new installed engines,
  same local Chrome and self-contained synthetic two-page Letter content.
  Every page's text/dimensions checked; all rendered PNGs are byte-identical
  old/new. Both distinct rendered pages visually inspected: no clipping,
  missing lines or changed pagination. No production/customer report used.
- CI adds the real build/server and PDF tests on Node 22/Linux/runner Chrome,
  alongside all existing integration, access and browser suites. CI status is
  tracked on the PR; local success does not substitute for a green final head.

## Release boundary and residual risks

Do not merge directly to `main`: main pushes auto-deploy. Review this stacked
PR and #106 together, then obtain explicit coordinated release approval with
Garden #848 and the integration launch checklist. This upgrade introduces no
additional database migration beyond the still-unreleased base draft.

No current `src/` route imports the server PDF generator. Amplify still skips
Puppeteer's browser download. Local/CI PDF success proves generator compatibility,
**not** a working production Chromium installation; verify a provisioned binary,
bundle size and AWS runtime before enabling any server-generated PDF feature.
No PDF endpoint was invented to make the test pass.

AWS/edge serving versions, auth headers through CloudFront, optimizer/middleware
behavior and real delivery must be checked after an explicitly approved release.
SES sandbox, actual EO photos/reply mailbox testing and queued-file review remain
separate launch gates; this security work does not resolve or bypass them.
