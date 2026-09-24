# BetterClose file notifications — implementation and release checklist

Updated 2026-09-23. This draft supersedes the receipt-only version of PR #106.
**Implemented and tested on this branch, not deployed or activated.**
Pro means broker, real estate agent, or lender.

## Two entry paths; registration is not file identity

| Entry path | What exists first | How BetterClose identifies the file |
| --- | --- | --- |
| Pro emails operations; Garden opens a file | Garden order; Pro may have no BC account or property | Stable Garden UUID plus exact file number creates/reuses the BC closing. A trusted Pro association may have no user ID. |
| BetterClose website or Pro portal request | BC request/closing | Operations handoff carries its explicit request ID. Paired Garden draft adds review/confirmation before initial file creation. The v3 return reuses this record; contact guessing is never used. |

No email/address/phone guessing is added. Existing admin-only legacy matching
is unchanged; it is not the missing explicit two-system handoff. An email
arriving in operations' mailbox is not itself a BetterClose acknowledgement.

## Sequence implemented by this draft

| Event | Pro | Borrower |
| --- | --- | --- |
| Pro places web/portal request | Existing new-user invitation path; internal operations handoff is separate. No new general Pro receipt is claimed. | No automatic receipt or file update by default. |
| Borrower submits their own web request | Internal operations handoff | One attempted request receipt, explicitly NOT a Garden-opening confirmation. |
| Garden sends file details | Association created without requiring registration; no generic ingest invitation | No ingest welcome. An address is not permission. |
| Garden confirms file opened | EO introduction: assigned name, photo, phone if present, verified EO BetterClose Reply-To; login unnecessary to receive/reply | Opening update only with current file-specific permission. |
| Later completed milestones | Pro update, including completion, respecting their own mute | Update/completion only with current permission. |
| Explicit sign-in request | Requested magic link | Requested magic link, separate from automatic-email permission. |
| Repeated event / ordinary detail edit | No new duplicate intent | No new duplicate intent. Opt-in does not replay old events. |

Garden can supply only the ordering Pro contact currently supported by its
payload. Fanout supports multiple trusted Pro memberships if they exist; this
draft does not expand Garden's contact extraction.

The Garden event mapping is unchanged: open -> title_ordered done; commitment
issued or later status -> title_search done; final policy -> title_issued done;
closed/post-close -> closed done. loan_locked is not emitted by Garden.

## Borrower permission

- All existing and new Closing rows default OFF. A prior account or merely
  claiming a Garden-created file does not automatically enable notifications.
- Permission is per file, not a global Pro default. The Pro's own mute remains
  separate. Trusted Pros see “Email the borrower file updates” in that file's
  dashboard. The borrower can control their own file setting.
- Trusted authority is granted by authenticated Garden ingest with a known Pro
  role, or verified broker-company conversion. Self-editing a display role does
  not grant it. A public form's role/email alone cannot grant authority over an
  existing file. Public Pro requests need trusted confirmation before this
  control becomes available.
- Anonymous borrower self-initiation permits its specifically requested initial
  receipt, not ongoing automatic email. Verified sign-in claims only that
  borrower's self-initiated requests and enables their future updates, unless
  they already explicitly changed the setting. A new verified borrower account
  can enable its new onboarding file. Other existing files stay OFF.
- Actor, time, source, recipient and unique permission version are recorded.
  Explicit permission changes and audit rows commit together.
- Queued messages recheck permission at delivery. Changing the borrower address,
  disabling, or disabling then enabling cancels old intents. Opt-in is future-only.
  An email already accepted by the provider cannot be unsent.

## EO introduction and replies

The email uses BetterClose's existing verified sender with an EO-owned
BetterClose Reply-To. It does not assume every EO alias is an authorized sender.

Server-only `BC_EO_REPLY_ROUTES` is a JSON object mapping the actual Garden EO
email to the verified EO `@betterclose.co` receiving address. Example syntax only:
`{"eo@example.invalid":"synthetic-eo@betterclose.co"}`.

**Provision and test the actual mailbox/forwarding first.** A configuration
entry is an operator attestation, not automated proof that an inbox works.
No mailbox or route is created by this code. The EO name, HTTPS photo and exact
Garden file identity must also exist. Missing prerequisites retain the
introduction as pending; no invented officer/shared mailbox or false reply
promise. Unregistered Pros receive the introduction; verified sign-in remains
required for private dashboard access.

Authorized Garden operators can use **Check notification setup** on a linked
file. The authenticated TPS GET adds `notificationReadiness` (version 1): EO
configuration gaps from the same validator used by delivery, trusted/unmuted Pro
count, current borrower permission, opening-event state and grouped milestone
intent counts. It never leases, queues, retries, sends or alters a record. Counts
are advisory and can change during delivery. Provider acceptance is not inbox
delivery; this check cannot verify SES production access, photo availability or
actual mailbox/forwarding. It exposes no recipient list or raw delivery error.

## Delivery and retries

- Milestone changes and per-recipient intents commit together. Closing state and
  fee snapshots are no longer dependent on having a borrower email recipient.
- Delivery leases prevent normal concurrent duplicate sends. Accepted recipients
  are not retried when another recipient fails. Empty provider responses and
  dry-run responses are not marked sent.
- Milestone endpoint returns retryable 503 while intents are pending, including
  an EO intro missing prerequisites. Garden keeps its order; its sync worker can
  pause later steps/reach its retry limit and require an operator requeue after
  prerequisites are corrected. There is no new independent queue worker.
- Pending state/reason is retained in IngestDelivery; not claimed as a new admin
  queue screen. Do not report delivery success from the mere existence of a file.
- Unsent legacy ingest welcomes/invites are cancelled when that file is ingested
  under this version. Sent history is retained.
- **At-least-once, not exactly-once:** provider acceptance followed by a process
  crash before recording success can still resend on recovery.

## Explicit binding added in this draft

`POST /api/orders/ingest` accepts `gardenOrderId` and optional
`betterCloseRequestId`. Both IDs and the file number are acknowledged by v3.
The request ID is an existing Closing.id, not a new order number paradigm.
Missing requests or identities resolving to different rows refuse atomically.
Nonblank conflicting property/contact/amount/date fields still refuse; identity
confirmation does not authorize overwriting them. Owner, quote, permission,
milestones and Pro memberships are preserved. Linking itself sends no email.

Stable UUID/file binding is unique and immutable, including under concurrent
admin writes; its time/source are recorded. The Garden draft records the
selecting operator/time. Existing unbound v2 records can adopt v3 identity once;
v2 cannot later alter a bound record. Receiver must deploy before the sender.
Neither migration backfills records or links by email, address or phone.

The paired Garden UI selects the request **before** the initial order insert,
avoiding a worker race that a post-save linking button would introduce. It
does not create Garden files unattended or merge existing duplicates. Public
form Pro roles remain untrusted until Garden ordering-contact confirmation;
merely selecting their request does not silently grant Pro permissions.

## Not finished / not authorized by this draft

1. Unattended BetterClose -> Garden file creation and repairs/merges for files
   already created independently. File opening remains an explicit staff action;
   the request-link implementation requires the paired Garden draft release.
2. Actual EO email identities, mailbox ownership, and controlled reply verification.
3. General Pro request receipts and durable retries for existing web receipts,
   invitations, and internal operations handoff messages.
4. First-sync historical/backlog policy: importing already-progressed files can
   prepare multiple completed milestones. This is not a bulk rollout approval.
5. SES production-access/deliverability verification. The earlier read-only check
   was reverified September 23: sandbox restrictions remain. No SES setting or
   support case was changed. Use `docs/INTEGRATION-LAUNCH-CHECKLIST.md`.

## Release gates

Keep automatic integration off during release preparation. Obtain separate
authorization for production migrations, merge/deploy, mailbox/config changes,
or controlled live messages. Apply this additive migration before deploying
schema-dependent code; do not roll schema back while this version runs. Quiesce
old senders during rollout—an old in-flight process cannot be cancelled by new
code's permission checks.

Do not activate broad syncing until explicit-ID handoff (for BC-first), verified
EO routes/photo coverage, recipient access, retry monitoring and historical
first-sync behavior have passed the agreed acceptance test. No live customers,
secrets, production DB writes or mailbox provisioning were used for the local
tests. Paired Garden code changes are isolated in their own draft/worktree.
