# Closing role journeys

Implemented on `fix/closing-role-journeys`, based on main
`a5903757e21ae92f8816bef44cd89b63ebf18ab9`. Not a deployment or integration activation.

## Corrections

- Borrower dashboard keeps completed files available. The default prefers the
  latest active/pending file, then any existing owned file; only a genuinely
  new borrower receives an onboarding stub.
- `/dashboard?closingId=...` selects an explicitly owned file. Missing,
  malformed and unauthorized IDs return not-found without creating a fallback.
  An email address or professional membership is not ownership.
- Borrowers with multiple files have an address/file-number selector, including
  completed files. Mixed borrower/professional users retain access to both
  dashboards. Professional-only users still avoid spurious borrower files.
- Welcome and borrower milestone links identify the exact closing, and that
  destination survives login. Existing queued welcomes take the authoritative
  closing ID from the durable delivery row; no queue data backfill is needed.
  Teammate links, recipients, mute preferences and delivery leases are unchanged.
- Invitation progress is specific to the selected file. Selecting another file
  cannot move an already-linked invitation. Existing anonymous, unassigned
  invitation attachment remains supported with conditional updates.
- Both welcome and "Track this closing" forms check the sign-in response and
  catch errors. Failure shows a retry message, not "Check your email"; input is
  locked while submitting, and existing invitation callbacks are preserved.

## Verification

Local passing matrix: **82 tests**:

| Suite | Tests | Boundary |
| --- | ---: | --- |
| Role journeys | 26 | Actual auth sign-in event, dashboard bodies, permission helpers, routes, ingest and milestone functions; real PostgreSQL |
| Sign-in browser journeys | 12 | Actual React components in Chromium; success, legacy links, provider failure, missing response, network rejection, retry |
| Existing access boundaries | 25 | Public intake isolation, broker conversion, intended-recipient claims, races |
| Existing Garden ingest | 14 | File identity, retry/lease/idempotency, conflicting fields, rollback, auth |
| Existing release tests | 5 | Type/build and prior regression guards |

`npm run typecheck` and a full production-mode `npm run build` pass. Existing
Browserslist age and static-page CSR warnings remain; dependencies unchanged.

The first 17 role checks against unchanged main had 8 passes and 9 failures.
Those failures demonstrated completed-file/default-selection problems, missing
file-specific navigation, and invitation scoping. Some assertions describe the
new explicit selection contract; they do not imply nine security vulnerabilities.
The first 8 browser checks also failed against the unchanged client components,
including false success on refused sends and stuck submission on network errors.

Real local scratch databases are restricted to localhost and `garden_ldi_*`;
the new role suite verifies database name, role and server address before fixture
writes. Fixtures use run-specific synthetic IDs and `example.invalid` recipients.
Only those fixtures are removed afterward. Existing shared dependencies are reused
without reinstallation or regeneration after verifying lock/schema equality.

## Test limits and visual evidence

These are application-module and browser-component integration checks, not a live
email/cookie end-to-end test. Sessions, SES and the external fee API are replaced;
all client test-page requests are blocked. Actual email delivery is not claimed.
Shared navigation/footer are omitted from local component renders; dashboard
contents and production-build CSS are real. Six 390px/1280px screenshots cover
file selection, mixed-role navigation and sign-in failure. No horizontal page
overflow. Existing dashboard support-number placeholder is outside this fix.

To regenerate local screenshots after building, set `BC_JOURNEY_PREVIEW_DIR` to
an output directory and run the role/browser suites and
`node test/helpers/role-preview.cjs`. Set `PUPPETEER_EXECUTABLE_PATH` to an installed
Chrome. Do not point test databases at production.

## Release scope

No migrations, pricing/accounting changes, recipient-policy changes, credential
changes, production messages, automatic sync activation, or Garden source edits.
This is separate from email-design PR #104. The only shared application file is
`src/lib/email/welcome.ts`: this change adds the optional closing ID/link, while
#104 changes presentation. Preserve both at integration time.

Merge/deployment and a separately authorized live sign-in smoke test remain
release steps, not actions performed by these tests.
