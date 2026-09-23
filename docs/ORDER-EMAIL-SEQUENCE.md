# Order emails: receipt is not file opening

Source audit: 2026-09-23, BetterClose main `83cad241`, Garden released
integration source (including PR #844). This branch changes receipt/welcome
wording only. It does not activate integration, create Garden orders, change
notification recipients/timing, or fix the remaining delivery/linking gaps.

## BetterClose website / broker quote conversion

1. `/api/orders/open` or a first successful broker quote conversion creates a
   new BetterClose closing, not a Garden order. All five milestones start
   pending. Publicly supplied contact data cannot select an existing file.
2. The borrower gets one attempted initial email. **On this branch** that
   email says the request was received and still needs to be opened by the
   closing team. It replaces the existing welcome; it is not an extra email.
   Previously this welcome misleadingly said the title order was opened.
3. A named professional without an existing account gets an invitation if
   their file association is new. An already-registered professional is
   linked without another invitation. This is not a general submitter-receipt
   email; existing professionals do not receive a separate submission receipt.
4. Operations gets a separate internal handoff message. The configured
   `BROKER_OPS_EMAIL` recipient defaults to `orders@betterclose.co`. It contains
   order details and the BetterClose closing ID, asking ops to open/handle the
   Garden file. Sending failure does not undo the BetterClose record.

There is currently no automatic BetterClose-to-Garden order creation. The
BetterClose admin editor has a Garden file-number field, but this is a manual
association, not a complete validated two-system handoff. The Garden ingest
receiver uses the exact Garden file number; it deliberately does not guess
that an unbound web lead is the same file from email, phone or address. Do not
turn on syncing and assume the web lead will automatically be reused.

## Garden-originated file and later updates

When explicitly enabled/configured, Garden sends the initial file details,
then changed details, then changed milestone states. Ingest can occur for a
pre-open file: existence of a BetterClose record is not evidence of opening.

- New Garden-backed BetterClose closing: borrower dashboard welcome and,
  conditionally, professional invite. This branch makes the dashboard welcome
  neutral; only the milestone email asserts file opening.
- Garden status `open`: `title_ordered=done` triggers the borrower "Title
  ordered" email and eligible professional update. `title_search=active`
  updates the dashboard without an email.
- Commitment issued (or closed status): `title_search=done` triggers "Title
  search complete". This is the existing mapping, not a new policy.
- Final policy number: `title_issued=done` triggers "Title issued".
- Garden status `closed` / `post-close`: `closed=done` sends the borrower's
  closing-completed email. **The current code excludes professionals from
  this final email.**
- Officer, title details or closing-location PATCH alone: no email.
- `loan_locked`: supported in BetterClose but not emitted by Garden; Garden
  has no mapped source field for it.
- A newly imported already-progressed file can trigger several completed
  milestone emails in its first sync. There is no historical-summary/coalescing
  policy implemented yet. Normal repeated completed milestones are suppressed.

Professional milestone updates require a linked user account and unmuted
file membership. The current fanout is also nested inside the presence of a
borrower recipient. No borrower recipient means no professional fanout.

## Sign-in is a separate sequence

The welcome/invite links open a page. If sign-in is needed, the person requests
a magic-link email and follows it back to their authorized file. A magic-link
email is not a second order acknowledgement or a file-status update.

## Remaining work, not claimed complete by this branch

1. Explicit, validated same-file linkage and a durable BetterClose-to-Garden
   handoff. Reuse the same BetterClose closing without another welcome or
   guessing by contacts. Preserve admin authorization and conflicting-field
   refusal. Do not enable bulk/background syncing to test this.
2. Durable delivery/retry for web/broker receipt and ops emails. Unlike Garden
   ingest delivery intents, these paths currently swallow/log failures after
   creating the record; the record existing does not prove an email arrived.
3. Milestone delivery reliability: current code sets `notifiedAt` even after a
   caught send failure; retries of the now-done milestone do not resend.
   A per-recipient durable delivery design must address this and concurrent
   duplicate calls before claiming reliable automatic notifications.
4. Professional closing-completed notifications and borrower-independent
   professional fanout. Confirm behavior in tests with distinct identities.
5. Review historical first-sync notifications before activation; never flood
   old files with the full sequence just to catch up dashboards.
6. SES production access: read-only check on 2026-09-23 still returned false.
   Delivery to ordinary unverified recipients, including magic links, remains
   restricted. A successful verified-recipient test is not launch acceptance.

Nothing in this document authorizes production activation, messages, data
edits, secret access, merges or deployments.
