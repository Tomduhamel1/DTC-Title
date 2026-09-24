# Garden ↔ BetterClose launch checklist

Prepared September 23, 2026. A checklist is not authorization to change production.
Paired drafts: BetterClose #106 and Garden #848. Always reverify current heads,
CI and serving versions. Do not conflate a deployed receiver with enabled syncing.

## 1. Review and preparation — no delivery

- Review both PRs together. Require final-head CI, real two-app synthetic
  acceptance, default-off borrower coverage and duplicate-binding/race coverage.
- Resolve the remaining Next.js/Puppeteer security upgrade work before launch.
  Compatible dependency patches reduce but do not clear the audit; see
  `DEPENDENCY-SECURITY-20260923.md`. Green functional CI is not security clearance.
- Verify both repositories' migration status before schema-dependent code runs.
  No automatic database reset, linking backfill or cleanup. Garden's request-link
  down migration intentionally refuses when bindings exist.
- Review current Garden outbox counts using the dedicated read-only role. Review
  each pending/processing file's intended BC identity and first-notification
  audience through an authorized operator, without copying customer data to PRs.
- **BC_SYNC_SINCE is not a filter for already-queued events.** It limits new
  hook/sweep work; enabling the worker can drain existing rows regardless of a
  newer cutoff. Do not delete the backlog or presume a cutoff makes it harmless.
- Historical/progressed files can prepare several completed milestones on first
  sync. Decide and approve their handling before activation; no silent replay.
- Confirm authorized Garden integration operators (`BC_ADMIN_USER_IDS`). A user
  session, public Pro role, or selecting a request alone is not Pro authority.

## 2. Mail prerequisites — separately approved configuration/verification

- Verify AWS account/region first, then read SES `ProductionAccessEnabled` and
  `SendingEnabled`. Domain/DKIM verification does not remove sandbox restrictions.
  Verified test-recipient success is not proof ordinary users can sign in.
- Obtain production sending approval through the existing SES support case.
  Do not move to another business's AWS account or substitute credentials.
- Verify assigned EO name/photo. Garden currently has no Employee photo column;
  populate the correct BC profile through its authorized path, not a fake image.
- Provision/verify each EO-owned BetterClose mailbox or forwarding destination,
  then attest that exact Garden-email → receiving-alias mapping in server-only
  `BC_EO_REPLY_ROUTES`. Do not assume a Reply-To header provisions an inbox.
- Verify runtime environment propagation after an approved Amplify rebuild.
  The allowlist in `amplify.yml` includes `BC_EO_REPLY_ROUTES`. Presence in the
  console alone does not prove the serving build has it.
- A controlled live test needs explicit recipient approval and a verified reply
  reaching the correct EO. No customer or bulk test sends by default.

## 3. Approved paired release — keep sending disabled

1. Confirm authorization, a known maintenance/rollback plan, and sender quiescence.
2. Apply reviewed additive migrations without backfill; verify them read-only.
3. Release BC receiver first; then Garden sender/UI. Verify actual serving SHAs.
   Main auto-deploys BC on merge; do not start a duplicate Amplify build.
4. Keep automatic delivery disabled. Check capabilities and the read-only request
   preview without enabling the worker. Existing linked files can use Check
   notification setup; no readiness read should enqueue/send anything.
5. Confirm receiver/sender identity contract. Old v2 senders cannot update records
   already UUID-bound under v3. Do not blindly roll back a sender or drop schema.

## 4. Approved controlled acceptance and activation

- Exercise both Garden-first and BC-first with approved synthetic identities:
  correct file reuse, trusted Pro association, EO photo/reply, borrower default-off,
  opt-in then revocation, retry without a second opening introduction.
- Verify mailbox delivery and an actual reply, not just SES acceptance or a
  synced badge. Dry-run and offline tests cannot establish either.
- Review backlog and historical-first-sync decisions before enabling automation.
  Log the exact approved cutoff/queue scope and verify no unreviewed files drain.
- Observe outbox and BC pending/sending/accepted states. Retry existing identities
  after a correction; never create a duplicate to resolve a failed push.
- If containment is needed, disable sending and preserve queue/history; an email
  already accepted by the provider cannot be recalled. Do not reset production.

## Limits that remain explicit

Staff opens the Garden file; no unattended BC→Garden order creation is included.
General Pro request receipts and durable retries for legacy receipt/invitation/
operations-handoff paths are separate from milestone delivery. First-sync policy
is an operational decision, not inferred from a successful synthetic test.
