# Professional file experience

## Where to find it

- **My dashboard → My settings:** borrower email defaults for future files.
- **File → Notifications for this file:** choose File opened, Title search
  update, Title policy issued and File closed independently. This is below the
  file's progress, officer and documents, not an opening-page instruction card.
- **Documents → View:** opens a scanned PDF/JPEG/PNG in a new tab. Download remains
  available, including for other formats. No change to who can share documents.

## Notification contract

Defaults are OFF for existing and new users until saved. Editing defaults never
changes existing files, contact details, Pro subscriptions or queued events.
New Garden-first files and trusted Pro quote/intake creation copy saved defaults
only when a verified, authorized Pro is already associated and a borrower email
is present. Unregistered/unverified Pros and missing borrowers leave emails OFF.
An existing request later linked to Garden retains its original file settings.

Multiple-Pro initial-default policy: all eligible Pros must have identical,
nonempty defaults; otherwise leave the file OFF. No arbitrary first/last Pro
wins. This is a conservative implementation assumption pending owner feedback.
Later participant/default changes never re-seed the file. Authorized Pros share
one file preference set; the latest explicit successful save applies. New UI
sends the permission version and borrower identity and refuses stale saves.
Verified borrower owners can also manage their own file emails. Existing legacy
all-event opt-ins and borrower-initiated permissions are preserved by migration.

Both event preparation and delivery/retry check the selected type and existing
recipient-bound permission. Every changed choice rotates the permission version,
invalidating older queued borrower intents. Saves never send or replay email.
Opening a file with no borrower displays a clear explanation, not an unusable
toggle. Loan-rate notifications are not offered in the title-file UI. A new save
of the four visible choices intentionally replaces any legacy loan-rate choice.

The My settings link formerly went to `/dashboard#contacts`; that destination is
still reachable as File contacts. Pro's own per-file Subscribed/Muted controls
are unchanged. No historical richer-settings implementation was found in the
inspected current source/history; do not claim that one was deleted.

## Documents and copy

Names and role labels are resolved only for uploaders of authorized documents.
The timestamp is the first `upload_verified` event, not intent creation. Missing
verification history has no invented timestamp. Garden currently supplies an
internal operator ID, not a verified staff display name: these rows say
**Closing team (Garden)**. No raw user/operator IDs are exposed to recipients.

Preview reuses membership, visibility, clean-scan, immutable-version and
post-storage-I/O revocation checks. A session-authenticated GET produces a
private/no-store/no-referrer redirect to a 60-second signed storage URL. Only
PDF/JPEG/PNG may be inline, on the storage origin, never the application origin.
The URL lifetime and inability to recall downloaded/viewed bytes are unchanged.
No public URLs, automatic sharing, scanner bypass, S3 configuration change,
content edits or email-on-upload were added. Pending uploads still use the
existing Verify upload flow; automatic scan polling is a separate improvement.

Milestone descriptions and borrower/Pro emails no longer promise clean/lien-free
title, a rated underwriter, recorded deeds, disbursed funds or policy-before-
closing sequencing based only on status flags. The completion savings calculation,
email addresses, Reply-To behavior, subjects and links are unchanged.

## Release gates

1. Apply additive `20260926050000_borrower_notification_choices` to the verified
   BetterClose database only after explicit production migration authorization.
   It adds two array columns and checks; it does not enable any legacy file.
2. Merge/deploy only after separate approval. Old application code can run with
   the extra columns; new application code requires them. Do not drop columns
   during an application rollback or reset preferences.
3. Controlled acceptance with synthetic file/users only: settings save, new-file
   defaults, file overrides, clean document preview and correctly named uploader.
   No live customer messages or financial data changes are needed for acceptance.
4. SES production access, real EO reply routes and general launch readiness are
   separate gates. Passing these tests does not establish public launch readiness.
