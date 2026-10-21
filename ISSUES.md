# Issues to resolve

Running list of open problems so nothing gets lost. New issues go at the top
of **Open** with the date found; when something is fixed, move it to
**Resolved** with the date closed.

## Program summary for company discussion (2026-08-13)

### Purchase example and service fees (2026-10-20, staged)

Owner requested a $600,000 purchase example, notary $140, attorney $40 and
abstractor $90, the Bucks row at the end of Title & Settlement, and a neutral
savings summary that does not compete with the estimate CTA. The sample uses
the existing Providence ZIP and 80% LTV ($480,000 loan), freshly calculated
from the public fee API. Owner confirmed proportional reductions in every
state: notary ×14/15, attorney ×4/5, abstractor title search ×9/10, rounded
to cents. These apply to new purchase/refinance estimates, including restored
refi search lines, while preserving each state's underlying service schedule.
Premiums, CPL, endorsements, recording, taxes, state availability, credit
exclusions and already-issued quote amounts remain unchanged. Comparison
package dollars are calculated before these discounts and remain unchanged;
no new comparison savings are claimed on excluded search/pass-through lines.
Comparison allocation now preserves below-our-cost competitor packages rather
than flooring them up to our old price (which would fabricate savings after
a discount). Upper package ranges are allocated once, without multiplying
non-settlement rows again. This changes attribution, not the source bands.
RI competitor package dollars remain $690 low / $770 modeled high independent
of our fee changes. Marketing/admin caches were refreshed through the real
engine for 300 scenarios across 50 state/DC entries. NC still returns upstream
HTTP 500 after retries and remains absent from these caches; no stale entry
was retained or synthetic NC quote invented. The new sample is $2,475, with $600 at-closing savings
($170 services + $430 Bucks). Release status belongs on the PR.

Cache comparison note: fresh upstream data also differs from the prior cached
data in CO, DE, MD, MO, MS and WV. Some all-in totals increase despite the
three service discounts; premium fields differ in CO, MO, MS and WV.
Settlement amounts are unchanged in all 300 scenarios. These caches reflect
the existing live upstream calculator, not new overrides of those charges.
Issued quote snapshots and production data were not modified.

### Security presentation correction (2026-10-20)

Owner requested removal of the homepage security sales section, including the
document-permissions replacement introduced in #136. The component is removed;
the Security navigation/footer destination remains a factual wire-fraud and
personal-information guide, with CFPB/IC3 references rather than feature cards.
No access controls, financial workflows or customer records are changed.
Homepage order/variant, copy and responsive regression tests cover this scope.
Deployment evidence belongs on the release PR; this note is not proof of deployment.

**What's done:** the site's pricing is now one engine with an evidence-backed
market comparison. Five conflicting fee engines were consolidated; fabricated
comparison multipliers were replaced by a 51-state survey of published
competitor fee schedules (241 verified sources + First American direct-API
recon, maintained nightly by an automated agent); premiums are never compared
or discounted anywhere (promulgated/bureau states labeled "Set by state");
every issued quote freezes its numbers; every marketing figure derives from
the engine at render. **Important nuance: evidence depth is NOT uniform** —
the comparison method is the same everywhere, but of the 34 live states
only 8 have solid multi-provider evidence behind their band (CT, FL, ID,
IL, KS, OH, OK, TX); 5 are thin at 1–2 providers (GA, IA, MO, NY, RI) and
21 ride inferred pooled bands (AL, AR, AZ, CO, DE, IN, KY, LA, MA, MD, ME,
MI, MS, NC, NH, NJ, PA, SC, TN, VA, VT). Inferred/thin states need more
sources: provider calls, browser-based calculator harvests, DOI filings.
`/admin/states` now grades every state (solid / thin / inferred) with the
specific upgrade action, and rolls up the gap list at the top of the page.
Master reference: `docs/STATE_MASTER_VS_FNTE.csv`
(51 states × purchase/refi — our fees, market evidence with provenance,
verdicts, and the assumptions each comparison rests on). Florida was
restructured on 2026-08-13: $195 published settlement fee, promotional
credit (Bucks) excluded there, savings claims rest on our own service fee
only.

**Decisions/actions needed, by owner:**
- **FNTE API team:** canonical Lambda + prod URL; IN/LA refi constant 500s;
  NC intermittent 500s; refi search column unpopulated; IA/OH fee inversions.
- **Counsel:** FL $195 fee vs below-cost-inducement doctrine (our defensible
  basis: fee ≈1.4–2.3× blended direct vendor costs); Bucks credit structure
  state-by-state — priority on the other promulgated states (TX, NM).
- **Pricing/leadership:** multi-source evidence says our service fees exceed
  the known market in OK, NV, NM, UT, MO (and TX escrow) — review against
  `docs/STATE_MASTER_VS_FNTE.csv`; FL seller-side card proposal ($329
  all-in; scenario modeling pending); workshare-state activation.
- **Ops:** align charged CDs to the quoted card (FL first — actuals show
  three charging regimes and wire/courier lines never quoted; proposal: the
  read-only CD-classification harness becomes a weekly quoted-vs-charged
  auditor).
- **Tom:** ID buyer/seller escrow-split question (one call to a Boise title
  office; ~2× Idaho's claimable savings if filed fees are split); confirm or
  remove "BBB Accredited" in the footer.

## Open

### Preserve Typical prices when discounting our fees (2026-10-20)

PR #138 preserved comparison-package totals but reallocated their line amounts
after applying our discounts. This incorrectly lowered the displayed Typical
notary, attorney and abstractor prices and moved their savings into settlement.
The correction changes only ourCost after assigning the original comparisons.
The $600k example shows $150/$140/$10 notary, $50/$40/$10 attorney and
$100/$90/$10 abstractor; settlement savings return to $140. Total savings remain
$600, including the unchanged $430 BetterClose Bucks credit. Preview totals are
bold green with a green divider, not a large filled panel competing with the CTA.

Version 4 refreshes unsaved estimates; issued snapshots and frozen totals remain
untouched. Nationwide regressions pin every pre/post-discount Typical range,
and browser checks pin each row and green savings emphasis. Aggregate pricing
and marketing-cache numbers are unchanged. The separate rating-cleanup PR #133
is not bundled. This note describes prepared code, not a deployed correction.

### Security copy: remove baseline-security promotion (2026-10-20)

The owner requested removal of HTTPS as a selling point everywhere and no
unsupported security assurances. Homepage and Security copy now describes
file-specific access and document-specific sharing, with explicit limits for
forwarded links, shared quotes, downloaded copies and payment instructions.
Reusable badges and dormant marketing components no longer promote HTTPS.
No banking-system security or certification is claimed.

Evidence: fileWorkspace/access.ts checks file membership and staff access;
fileWorkspace/documents.ts limits document visibility, staff-selected sharing
and preview/download permissions; fileWorkspace/storage.ts issues short-lived
document links. quote/view/page.ts intentionally permits share-token access
without sign-in. The existing file-workspace PG suite exercises these boundaries
and is included in release validation. No permissions or infrastructure changed.
The owner-approved privacy policy is retained, not recast as a security badge.
The broader mobile and underwriter/handout draft PRs remain separate.

### Optional intake uploader retired — deployed and verified (2026-10-12)

PR #135 merged as a0368b7; Amplify job 166 succeeded. Live checks confirmed both
retired endpoints return 410 and the intake page directs users to file Documents.

The owner approved directing optional intake document uploads to the current
closing-file Documents workspace. Both retired intake upload endpoints return
410 Gone without reading request bodies, using storage or accessing records.
The intake form displays a file-workspace link instead of upload controls.
Existing stored documents, file-sharing permissions, email behavior and the
current file Documents workflow are unchanged. This does not retire the rest
of the intake form or represent a broader application-security certification.
Regression coverage includes the retired routes, mobile/desktop notice,
compiled-server HTTP checks and the existing file-workspace tests.

### Security-claims cleanup — deployed and verified (2026-10-12)

PR #134 merged as afde8fa; Amplify job 165 succeeded. Live checks verified the
Security page and retired homepage variant URLs.

Old public homepage variants still exposed unsupported security, escrow and
licensing assertions. The homepage wrapper now consistently renders the current
homepage, including on `/preview`; query parameters no longer select retired
experiments. Stale reusable components no longer claim guaranteed or bank-level
security, certified processes, or blanket FDIC coverage. The Security page uses
specific access/connection descriptions, distinguishes the portal from bank
transfers, and prioritizes contacting the sending bank after suspected wire fraud.
The owner's previously confirmed no-sale privacy policy is unchanged.

This is a claims correction, not a security certification or infrastructure
hardening release. Application-access and browser-header follow-ups from the
audit remain separate; they are not represented as fixed here. No customer data,
payment behavior, permissions, infrastructure settings or email sending changed.
The handout/underwriter-disclosure and mobile-layout branches remain separate.

### Search discovery foundation — prepared, not deployed (2026-10-09)

Public routes lack a sitemap, explicit canonicals and page-specific sharing
metadata. This branch adds an explicit public sitemap, robots controls,
metadata for 12 public routes, homepage Organization identity and two linked
educational pages. The existing apex metadata origin is retained; host
redirect changes need a separate authentication/callback review. Do not
claim indexing improvement before a production deployment and webmaster
verification. Coverage configuration is not verified licensing: retain the
contact-based licensing page until the operating entity and authority are
confirmed. New guides need final operational review before publication.


### Repeated fresh sign-in links rejected — scanner-safe fix prepared (2026-10-02)

The email callback consumed a one-use token on GET, allowing a mail preview or
security scanner to create a session before the recipient clicked. Reproduced
three times with fresh synthetic links and the installed NextAuth/Prisma adapter.
This is a confirmed failure mode, not proof of which client accessed Steve's links.
The fix places email credentials in a fragment-backed confirmation page and
requires an explicit same-origin POST. Legacy callback GET/HEAD cannot consume
tokens either. NextAuth retains token verification, expiry, single use and
session creation; admin and per-file permissions are unchanged. Existing file
access confirmations POST their short-lived handoff without an extra prompt.
Release verification includes preview/replay, CSRF/origin, admin/normal-user and
real-browser/compiled-runtime tests. Deployment pending.

### Public-copy consistency — corrections prepared (2026-10-01)

The public-site audit found misleading navigation/copy, unsupported service
promises, and inconsistent marketing illustrations. This branch makes
transparent, line-by-line pricing the primary message, clarifies that modeled
loan savings include the at-closing savings, and labels national examples.
The fee illustration now uses the existing sample report without invented
premium discounts; marketing stages reuse the actual four-stage customer flow.
Order receipts distinguish requests from opened files; borrower notification
permissions remain unchanged. Unverified licensing/accreditation, security,
support-time and future-integration claims are removed rather than asserted.
Footer sign-in and About sharing use the existing routes/components.
Pricing calculations, issued quotes, private-file access, production data,
Garden integration and email sending are unchanged. These corrections are not
deployed yet. Verified accreditation can be restored separately with evidence.
Verification: typecheck, 84 focused content/behavior checks and 8 offline browser
checks pass (320–1440px across the responsive suites). The actual local Next
homepage and team sample were visually inspected; About sharing opens and closes
the existing sheet without sending a message. The PDF brochures and transactional
email copy were outside this public-page audit and are not certified by it.

### Policy publication approved; operational/legal follow-up retained (2026-10-01)

PR #124 (`fix/quote-summary-and-policy-links`) adds `/privacy` and `/terms` and
corrects the placeholder footer destinations. The owner approved publication,
confirmed BetterClose is a DBA of First National Title & Escrow LLC, ruled out
selling personal information, marketing sharing, promotional emails and
customer-list advertising, and confirmed contact-email forwarding works.
The supplied FNTE customer Privacy Policy Notice was reviewed. Its permissive
marketing language is broader than the owner's confirmed practices, not proof
of actual marketing disclosures; legal review should align the notices.
The published copy describes retention criteria without inventing deletion dates
or altering stored records. A record-specific schedule, applicable privacy
rights/notices, and account/order acceptance still need compliance review.
Owner approval does not constitute legal-compliance certification. Public draft
notices/checklists are removed and the effective date is October 1, 2026.
No new acceptance is recorded for existing users, and no deletion behavior is
changed. This operational/legal follow-up remains internal; it is not displayed
on the customer pages. Deployment must be verified against the merged commit.

### Chat was advertised without a chat service — correction prepared (2026-09-30)

The shared contact strip labelled a mailto link "Chat" and displayed a static
online indicator and reply-time claim. The story homepage also advertised chat
and rendered inert chat buttons. `fix/remove-unavailable-chat` changes these to
email/phone contact options and working mailto/tel links, without an online or
instant-reply promise. Automated calculator conversations are unchanged. The
fix is isolated from the unapproved Privacy/Terms drafts and is not deployed yet.

### File upload scan wait looks like an outage — correction prepared (2026-09-25)

Live synthetic acceptance of the new private workspace confirmed that an upload
can finish before its GuardDuty result is ready. The bucket correctly denies HEAD
until clean, but the application showed a generic unavailable error and needed a
list refresh before Verify upload appeared. The bytes stayed private; verification
and download succeeded after the scan. `fix/document-scan-pending` checks scan
status first, pins verification to the attested immutable version, returns a typed
wait state, and refreshes the pending row with a neutral status message. Non-clean
results still block sharing/downloads. This correction is not deployed yet.

The live synthetic estimate initially failed, then succeeded on retry using the
existing fee engine/provider. No cause for the first provider failure was proven;
no pricing policy or fallback was changed and no invented total was saved.

### Dependency audit — compatible fixes prepared, major upgrades remain (2026-09-23)

The user-approved production dependency audit found 49 flagged packages.
Compatible auth/AWS/monitoring/transitive patches on PR #106 reduce this to 8
(1 critical, 7 high), all through Next.js/Puppeteer. These patches are not live.
The actual old auth implementation fails six new security regression cases;
the patched implementation passes all ten. SDK transport/signing coverage and
existing PG/browser/build checks pass. Next 14 is unsupported; Puppeteer is also
used for runtime PDFs, so neither remaining root may be hidden or dismissed as
test-only. See `docs/DEPENDENCY-SECURITY-20260923.md` for versions, upstream
sources, proof and the separate framework/browser upgrade requirements. No
production compromise is established by a dependency audit.

### Order receipt versus Garden file opening — correction prepared (2026-09-23)

`fix/order-receipt-email-sequence` replaces the existing initial web/broker
borrower welcome with clear request-received copy, and makes Garden/ops
dashboard welcomes neutral. It does not add an extra email or assert a
milestone. "Title ordered" remains a separate completed-milestone notification.
This is not released or an integration activation. See
`docs/ORDER-EMAIL-SEQUENCE.md` for exact recipients/triggers and outstanding
handoff, delivery-retry, professional completion and historical-sync gaps.
In particular, existing milestone delivery marks notified even after a caught
failure, and excludes professionals at closing; those are not fixed here.

### Borrower file navigation and sign-in feedback — implemented, not released (2026-09-23)

Branch `fix/closing-role-journeys` preserves completed borrower files, adds
ownership-checked file selection, targets welcome/milestone links to the exact
closing, scopes invitation progress to that file, and makes failed sign-in
requests show a retry message instead of a false success confirmation. Separate
borrower/broker/lender/realtor identities are covered with real local PostgreSQL
and actual rendered components. See `docs/CLOSING-ROLE-JOURNEYS.md` for evidence
and test boundaries. No production activation or delivery is authorized by this
change; release remains pending review.

### Garden integration hardening — pending review/deployment (2026-09-23)

Branch fix/garden-integration-identity-ack prevents distinct Garden files from
matching by contact details, refuses conflicting nonblank field updates, and
commits officer/teammate changes with durable notification intents. Paired
Garden sender changes require v2 acknowledgments and queued manual pushes.
See docs/GARDEN-INGEST-V2.md. This is NOT deployed or activated.

Remaining release gates: verify SES production access and outstanding credential
rotations, review the broader borrower/teammate access and explicit lead-linking
workflow, agree any overwrite/reassignment policy, and obtain rollout approval.
Full TypeScript checking still reports 10 pre-existing errors identical to main;
the focused PostgreSQL tests do not substitute for a full-app build/security audit.

### Onboarding follow-ups after the /open launch flow (found 2026-09-15)
The open-a-file flow shipped (PR #92): every persona can open a real file
from /open, it reuses the Garden/TPS write path, and the borrower dashboard
now shows the escrow-officer card. Verified end-to-end on prod (web order →
officer PATCH → officer in file). Remaining, in rough priority:
- **SES sandbox still blocks sign-in for everyone unverified** — the /open
  welcome email and magic links silently don't deliver. The whole dashboard
  leg of onboarding is dead until the appeal (see the SES entry above).
- **Garden-side push: SHIPPED DARK 2026-09-22** — merged to Garden
  release/prod (their PR #843, commit 3d2c536), migration run on prod, both
  services deployed. Worker confirmed idling cleanly with the secret unset
  ("Not configured — idle" on Garden's Admin › BetterClose Sync page); new
  Garden orders queue in its outbox from now on and drain automatically at
  go-live. **Go-live (5 min, whenever Tom wants):** (1) set
  `BC_ORDER_INGEST_SECRET` on Render from
  `~/Desktop/bc-order-ingest-secret-for-render.txt` (then delete the file),
  (2) restart the Garden backend (worker reads the secret at boot),
  (3) run `backend/scripts/betterclose/acceptanceTest.js` and watch the
  sync page's failed list during the first drain — the queued backlog
  pushes all at once, which also fires welcome/invite emails for those
  files (delivery still subject to the SES sandbox). Until then, ops uses
  /admin/closings/new (Mode B of the runbook).
- Spec history: handed off 2026-09-22 — self-contained
  implementation prompt in `docs/GARDEN_INTEGRATION_PROMPT.md` (Tom's Garden
  session is building it). BC side is DONE and prod-verified: ingest accepts
  `gardenFileNumber` (unique, top-priority dedupe key) + inline
  `escrowOfficer` (one call = file + officer), Zod-validated with
  `ignoredKeys` reporting. Ops fallback shipped: /admin/closings/new opens a
  file from an email order in ~60s; closing editor now edits the officer +
  Garden file #. Runbook: `docs/EMAIL_ORDER_RUNBOOK.md`.
- Officer's TeammateClosing row is created with role 'unknown' (no
  'escrow_officer' role in the enum) — officers show up oddly on teammate
  dashboards.
- Broker portal membership is still admin-grant-only (by design for beta) —
  /open bypasses it for order intake, but "Request portal access" remains a
  mailto with no queue.
- `/api/professional/quotes` still writes null-company FeeQuotes that the
  convert route structurally can't see (write-only data).
- Nav "My dashboard" hardcodes /dashboard; works now because /dashboard
  redirects professionals server-side, but a persona-aware nav would be
  cleaner.
- Two e2e test files are live prod data (useful as demos; delete when
  unwanted): `77 Verification Way, Providence RI`
  (tomduhamel+launchtest@gmail.com) and `88 Handoff Lane, Providence RI`
  (tomduhamel+gardentest@gmail.com, gardenFileNumber GDN-TEST-2026-0922).

### Intake / invitation access boundaries — pending review/deployment (2026-09-23)
The isolated `fix/public-intake-claim-access` patch separates public and broker
intake from existing-file contact matching and checks verified recipient identity
and existing ownership atomically for teammate invitation claims. It does not
rewrite existing records or resolve historical memberships. See
`docs/INTAKE-ACCESS-BOUNDARIES.md` for behavior, tests and release boundaries.
This patch is NOT deployed. Keep rollout separate from code review; a full-app
authorization audit and the other launch gates are not replaced by these tests.

### MACHINE: iCloud is evicting files inside the repo — disk 98% full (found 2026-09-14)
Tom's laptop disk is at 98% (11 GiB free), so macOS "Optimize Mac Storage"
is evicting iCloud-synced files under Documents — including **inside this
repo's `.git`**: 3,100+ dataless files in `.git` (among them `config`,
`index`, `packed-refs`) and ~45,000 in the working tree at time of writing.
Symptoms: `git push`/`for-each-ref` hang for minutes in uninterruptible
reads while iCloud rehydrates each evicted loose ref; eviction re-runs
faster than downloads under disk pressure. One iCloud conflict duplicate
(`.git/index 2`) already exists — iCloud sync is a known git-repo
corruption vector.
- **Fix (Tom):** free disk space, then either move `~/Documents/GitHub`
  out of iCloud-synced scope or disable "Optimize Mac Storage" (or
  Desktop & Documents sync). Until then, expect random multi-minute
  hangs in any git or build command in this repo.
- Mitigation applied 2026-09-14: `brctl download .git` requested;
  wedged remote-tracking ref `origin/docs/parity-verdict` removed
  (recreated by the next `git fetch`).

### LAUNCH BLOCKER: SES is in the sandbox — no real user can sign in (found 2026-08-17)
`ProductionAccessEnabled: false` on account 621852467690 (us-east-1), and a
prior production-access request was **DENIED** (case `177722805500436`). In
the sandbox SES delivers only to *verified* identities, so every
magic-link sign-in from a real broker/agent/lender fails. It surfaces as
NextAuth's opaque `error=EmailSignin` ("Could not send email"), and SES
reports it as `AccessDenied` naming the *recipient* ARN — which reads like
an IAM problem and is not one.
- **Fix:** appeal the denied case. Draft justification ready in
  `docs/SES_PRODUCTION_ACCESS_APPEAL.md`.
- **Status 2026-09-22:** appeal filed; Trust & Safety asked about a related
  account (711798022106 — Servist, Tom's separate pre-launch venture with
  unused eu-west-1 production access). Reply sent same day (paste-ready text
  in the appeal doc, "2026-09-22" section) explaining the two ventures each
  need their own sending. AWS says ~24h to respond; watch the case so it
  doesn't auto-resolve. On approval: re-test sign-in with an unverified
  outside address, then remove one-off verified identities.
- **Interim:** `aws ses verify-email-identity --email-address <addr>` per
  person (they must click AWS's confirmation). Done for
  `steve@firstnte.com` 2026-08-17 — verified, and his sign-in is
  **confirmed working** end to end. Does not scale to customers.
- **IAM footgun found the same day:** AWS authorizes `ses:SendEmail`
  against the *recipient's* identity ARN too, so a policy listing specific
  identity ARNs as `Resource` blocks everyone not listed. Final working
  policy: `Resource: "*"` + `Condition StringLike ses:FromAddress
  *@betterclose.co`. An intermediate attempt that scoped `Resource` to
  `identity/betterclose.co` produced `implicitDeny` — verify with
  `aws iam simulate-principal-policy` before trusting a change here.
- Two real bugs were found and fixed while chasing this, both of which
  would have broken sending anyway once the sandbox is lifted: the
  `AWS_SES_FROM_EMAIL` → `APP_AWS_SES_FROM_EMAIL` name mismatch (PR #85)
  and an over-scoped IAM policy that listed recipient ARNs as resources
  (corrected 2026-08-17 to resource=domain identity + `ses:FromAddress`
  condition).
- **Worth doing regardless:** every send failure — bad from-address, IAM
  denial, sandbox restriction — presents identically in the UI. Surface a
  distinguishable error so the next outage is diagnosable without
  CloudWatch.

### Production secrets need rotation (found 2026-08-17, 1 of 5 done 2026-09-22)
**ORDER_INGEST_SECRET rotated 2026-09-22** (before wiring it into Garden's
Render env — verified: new value authenticates, old/bogus 401). Remaining
four: `DATABASE_URL` (Neon password), `NEXTAUTH_SECRET` (signs out all
sessions — quiet window), `APP_AWS_ACCESS_KEY_ID`/`APP_AWS_SECRET_ACCESS_KEY`
(highest priority — standing credential usable outside the app).

Original note: The Amplify `main` branch environment was read in full during a support
session, putting live production secrets into a chat transcript:
`DATABASE_URL` (Neon password), `NEXTAUTH_SECRET`, `ORDER_INGEST_SECRET`,
and the `APP_AWS_ACCESS_KEY_ID`/`APP_AWS_SECRET_ACCESS_KEY` pair. Rotate
all five. Notes: rotating `NEXTAUTH_SECRET` signs out every existing
session (pick a quiet window); the AWS key is the highest priority since
it is a standing credential usable outside the app. After rotating, update
the branch env in Amplify and redeploy `main`.

### Coming-soon gate was one deploy from failing open (found/fixed 2026-08-17)
`COMING_SOON_MODE` and `COMING_SOON_BYPASS_KEY` had been removed from the
Amplify environment while the *running* build still had them baked in — so
the gate worked, but `amplify.yml` would have written neither into
`.env.production` on the next build, and `middleware.ts` opens the whole
site when `COMING_SOON_MODE !== 'true'`. That would have exposed
`/licenses` (placeholder "[number]" license numbers) and `/for-lenders`
(advertises an API/portal/webhooks that are not live). Both vars restored
on the `main` branch env 2026-08-17 + redeploy (job 114).
**Lesson: env vars deleted from the console are invisible until the next
build.** Before any deploy that matters, confirm the build log shows
`- COMING_SOON_MODE (len=4)` rather than `MISSING!`. Longer-term fix worth
considering: fail the build when a launch-critical var is missing, instead
of printing `MISSING!` and continuing.


### DECISIONS MADE 2026-08-14 — for team review (Tom-directed)
Bucks (premium-derived credit) is now excluded in the four verified-strict
anti-rebating states, and each got an FL-style BetterClose service-fee card
so the state still has a compliant competitive lever. Calibration rule:
target our comparable service stack at ~56% of the state's evidenced market
low (Florida's landing), floored at $195 (the counsel-gated below-cost
basis; blended direct vendor costs ~$85–135/file).

| State | Card (settlement, purch+refi) | Our stack | Market low (evidence) | Quoted savings |
|-------|------------------------------|-----------|----------------------|----------------|
| FL    | $195 (2026-08-13)            | $345      | $615 (P25 of 6 published) | $270 / $250 refi |
| TX    | $195 — floor binds           | $345      | $462 (P25 of 5 published) | $117 |
| NY    | $195 — floor binds           | $345      | $574 (Tier One, real)     | $229 |
| NM    | $295                         | ~$475     | $834 (First American API) | $359 / $147 refi |

Open questions the team should weigh in on:
1. Counsel: does the $195 floor clear below-cost-inducement in TX and NY as
   assumed for FL? (Same basis; different statutes: TX §2502.051/P-53, NY
   §6409(d).)
2. NM's card rests on a single evidence point (FA's API) — acceptable, or
   hold NM claims until a second provider corroborates? Note NM is a
   workshare state currently OFF in the state master, so the card and
   Bucks exclusion are dormant config that activates with the state
   (verified 2026-08-14: NM quotes return "doesn't currently offer").
3. TX charges a separate $150 search line the TX market bundles into the
   promulgated premium — keep billing it (shown, no-comparison) or have
   FNTE fold it? (It is really billed; quotes must keep showing it until
   ops changes.)
4. Revenue: these cards cut TX/NY/NM settlement revenue the same way FL's
   did — needs the FL-style actuals/scenario modeling per state before
   anyone treats the cards as final.
5. Ops/CD alignment now applies to four states, not one.

### Counsel gate: FL $195 fee + Bucks review for remaining states (found 2026-08-13, updated 2026-08-14)
$195 FL settlement fee shipped (PR #81) with Bucks excluded in FL. On
2026-08-14 the exclusion was extended to the other verified-strict states:
TX (Ins. Code §2502.051 + TDI P-53), NM (promulgated, same structure), and
NY (Ins. Law §6409(d)). Consequence: those states' quotes now show little or
no savings until a compliant competitive lever exists there (e.g., a
BetterClose service-fee card like FL's $195 — pricing/leadership decision).
Still with counsel: (1) confirm FL $195 clears below-cost-inducement, (2)
confirm the NM statute cite, (3) review Bucks in the bureau-uniform states
(PA/NJ/OH/DE/NC — premiums effectively fixed, statutes unverified) and the
filed states, (4) confirm whether TX/NM/NY should get FL-style service-fee
cards as the compliant alternative.

### FL: quoted-vs-charged ops alignment (found 2026-08-13)
Prod actuals (189 files/12mo, `support-incidents/fl-charging-actuals-2026-08-13/`)
show practice does not match any card: settlement modes $650/$350/$250,
wire $50 on 93% and courier $70 on 58% of files never quoted, sellers pay
$250 on 77% of purchases while the engine quotes $0 seller-side. The new
$195 card is only true if ops charges it. Proposal: weekly read-only CD
auditor from the recon harness + deviations-only-downward rule.

### FL: seller-side card and seller-side quoting (found 2026-08-13)
Seller pays us on ~4 of 5 FL purchases but the engine discards all
SellerFee lines — sellers (who choose the agent outside Miami-Dade/Broward)
can't be quoted at all. Proposed $329 all-in seller fee is
claim-ready vs published competitor typical ($425–520); needs scenario
modeling net of credits and a product decision on seller-facing quotes.

### Pricing review: states priced above the known market (found 2026-07-24)
Multi-source evidence (3+ independent providers) puts our service fees above
every known competitor in OK ($2,340/$1,415 vs markets ~$400) and above the
known market in NV, NM, UT, MO, plus TX escrow. Site honestly shows ~$0
savings there. Evidence: `docs/STATE_MASTER_VS_FNTE.csv` + data/market-fees.

### ID: escrow buyer/seller split resolution (found 2026-07-24)
Nine DOI-filed Idaho escrow schedules at $1,650–1,750 vs First American's
$700 buyer-side imply the filed fees are whole-transaction and split by
custom. Band deliberately held conservative; resolving the split (~one call)
roughly doubles Idaho's claimable savings.

### Evidence coverage: browser-only calculators + thin states (found 2026-07-23, admin visibility added 2026-08-14)
Per-state evidence grades (solid ≥3 providers / thin 1–2 / inferred) now
show on `/admin/states` with the upgrade action per state — use that page
as the work queue for calls and deeper calculator-based agent searches.

FNF's National Rate Calculator and First American's FACC (the two highest-
coverage fee sources) are JS-only and need a browser session to harvest;
~20 states still ride the inferred/capped band. Also open: refi-side
boundary audit (refi overrides predate the symmetric-stack convention),
price-tiered bands for the eight scaling-escrow states (flat bands
understate jumbo savings), and SD/IA anomalies (our SD stack $2,436 with no
market evidence; IA $1,150 vs partial published market).

### Footer still claims "BBB Accredited" (found 2026-07-22)
The only remaining unverified trust badge — confirm accreditation is real or
remove it.

### FNTE calculator: NC failing — DEGRADED from flaky to mostly down (found 2026-08-12, updated 2026-09-14)
Originally intermittent in both modes. Re-probed 2026-09-14: 4 of 5
purchase attempts returned 500 — effectively down. NC's fee-schedule row is
well-formed, so it looks like infrastructure, not data. NC is an ON state
and the ONLY state with no engine-generated savings anchor (it falls back
to national figures), so today an NC visitor usually gets the friendly
"rates system unresponsive" notice instead of a quote.
- Decision for Tom: turn NC OFF in `src/lib/stateMaster.ts` (visitors get
  the /quote/unavailable coming-soon page + waitlist) or keep pressing FNTE.
- After the fix: `npx tsx scripts/build-state-savings.ts NC` and
  `npx tsx scripts/build-state-matrix.ts NC`.

### Upstream omits the refi title-search line in every state (found 2026-08-12)
`AbstractorTitleSearchREFI` is unpopulated for all 51 rows in
`eLEND_public_calc`, and the Lambda suppresses the purchase column on
refis — so upstream refi quotes silently drop the search fee. BetterClose
compensates downstream via `ENSURE_LINES` in `src/lib/betterCloseFees.ts`;
FNTE should still fix the source (populate the REFI column or add a
fallback). Details: `docs/FEE_CALCULATOR_REFI_SEARCH_GAP.md`.

### Which fee-calculator Lambda is canonical? (found 2026-08-12)
The live `/test` API-Gateway stage routes to `fnte-fee-calculator-l2-test`.
A newer `fnte-fee-calculator-prod` (2026-08-03) exists but is not on this
path. Confirm with FNTE which is canonical and point `FEE_CALC_API_URL`
accordingly.

### Fee-schedule quirks worth confirming (found 2026-08-12)
IA settlement: purchase $250 < refi $350. OH: purchase $291 < refi $350.
Confirm with FNTE that these inversions are intentional.

### Product decisions parked (as of 2026-08-12)
- Workshare states + DC: decide whether/when to turn on the 16 OFF states.
- BetterClose Bucks: counsel review of the credit structure.
- Liberty Title quote documents: archive to `data/market-fees/` so comp
  provenance survives.

### Garden integration activation prerequisites (checked 2026-09-23)

Paired draft PRs #106 (BetterClose) and Garden #848 add Pro-first notifications,
explicit request binding and a read-only notification-setup check. Not deployed.
SES remains sandboxed (`ProductionAccessEnabled=false`), despite verified domain
and DKIM. `BC_EO_REPLY_ROUTES` is absent from the current app/main branch variable
names; actual receiving mailboxes and photos still need verification. The AWS
Support API requires a paid support subscription in this account; use the existing
support-console case rather than treating that API error as a new SES denial.
Garden's already-queued events need review before activation; `BC_SYNC_SINCE`
does not filter the existing queue. See `docs/INTEGRATION-LAUNCH-CHECKLIST.md`.

### Supported framework bridge and PDF hosting verification (2026-09-23)

A stacked, unmerged runtime upgrade prepares Next 15.5.26 / React 19, Node 22
and Puppeteer 25.12.0. Its production dependency audit has zero current findings;
this is not a deployed fix or a full security review. Next 15's documented
two-year maintenance window ends around October 21, 2026. Recheck Amplify's
Next 16 support and plan the next supported-host/runtime step before that date.
Do not silently switch hosts or select an undocumented hosting combination.
The PDF generator has no current application caller; production Chromium
provisioning remains unverified, and no server-PDF route was activated.
See `docs/RUNTIME-UPGRADE-20260923.md` for evidence and release conditions.

## Resolved

### FNTE calculator: IN & LA refinance 500s (found 2026-08-12, resolved upstream by 2026-08-14, confirmed 2026-09-14)
Every IN/LA refinance quote returned 500 (constant; FirstAm L2 path
suspected). Fixed on the FNTE side; anchors/matrix backfilled 2026-08-14
(both states present in the generated data). Re-confirmed working on prod
2026-09-14 (three consecutive successful IN refi quotes).


### FL restructure: $195 fee, Bucks excluded, bands re-based (resolved 2026-08-13)
PRs #81/#82. Verified live: settlement $195, no credit line, exact
$270/$250 quoted savings vs unchanged six-provider market evidence.
Counsel gate on the number remains open (see Open).

### Five pricing engines consolidated to one; quotes frozen at issuance (resolved 2026-07)
Placeholder engines (`/pricing`, TrueFee print, title-calculator,
quote-calculator, orphaned quote-engine) deleted with redirects; per-line
savings badges sum exactly to headline; issued FeeQuotes freeze totals;
fabricated "$2,400 average"/"up to 50% less" claims replaced with
engine-derived figures.

### Market comparison rebuilt on evidence (resolved 2026-07-25, maintained nightly)
51-state survey of published competitor fee schedules (241 verified sources,
per-state search logs) + First American direct-API recon + calculator
harvests; symmetric stack-boundary audit across all 20 evidence states;
per-state bands with provenance and basis disclosed on every quote; premiums
never compared or counted toward savings in any state (NC's rating bureau
caught and corrected). Nightly cloud agent maintains freshness.

### Site footer carried unverified trust claims (found 2026-08-11, resolved by 2026-08-13)
SOC 2 / ALTA membership / bonded claims appeared on the site without basis.
Verified scrubbed from the live homepage, /security, /about, and
/for-brokers on 2026-08-13. Rule stands: never state SOC 2, ALTA membership,
or bonding anywhere.
