# File documents and estimate history — release checklist

Status: implemented for review; default off. This document is not authorization to
change production, enable syncing, send emails, or expose existing documents.

## Behavior

- The real borrower dashboard (both variants), Pro file dashboard, and staff file
  detail page contain the same file workspace. Ordinary authenticated members
  can upload; staff control recipient selection. EO display/contact fields do not
  confer staff access. BetterClose staff use the existing `ADMIN_EMAILS` allowlist.
- A new upload is accessible only to its uploader and authorized closing staff.
  Only staff can select additional **individual, registered file participants**.
  Email/mute permissions are separate. No document action sends email.
- Garden uses a separate, default-off operator feature. It verifies the exact
  Garden UUID, file number and BetterClose closing before reading/transferring a
  selected local file. There is no document sweep, automatic publication, or
  automatic copying of borrower uploads into Garden. Garden staff can view BC
  uploads through authorized, expiring downloads.
- Downloads are attachments, not public URLs. They bind the confirmed immutable
  S3 version, require current membership/visibility and a successful malware scan,
  and expire in 60 seconds. Revocation blocks newly issued links; it cannot recall
  downloaded files or the remaining lifetime of a previously issued link. A revoked
  source version cannot be silently republished; sharing with an empty recipient
  list is the reversible way to return a document to uploader/staff-only visibility.
- Supported uploads: PDF, JPEG, PNG, TXT, DOCX, XLSX; 20 MB maximum; 500 document
  records per file. Legacy Lead uploads and public headshot storage are not reused.
- New Garden/intake files with verified transaction type, property ZIP and amounts
  capture the website fee engine's output, inputs, assumptions and frozen totals.
  A converted website quote is preserved exactly as version 1. A manual revision
  appends a version and never changes the initial estimate or financial records.
- Missing purchase loan amount uses the site's 80% assumption, explicitly disclosed
  and never written to `Closing.loanAmount`. Explicit zero/cash pricing requires
  separate review rather than treating zero as missing. Unknown transaction type
  remains unknown. Missing/failed estimates show pending with a staff retry.
- GETs never price or mutate. Failed pricing does not roll back an opened file.
  Existing files are not bulk repriced or backdated. Closed-file recalculation is
  refused. An estimate is not a final settlement statement or promised rate.

## Required deployment order and acceptance (not executed)

1. Review both PRs. Apply `20260925090000_file_workspace` to the verified BC database
   with the existing approved migration process, then deploy BC with flags OFF.
   Do not deploy Garden's additive `transactionType` sender before BC accepts it.
2. Create/approve a **dedicated private document bucket**: S3 Block Public Access,
   bucket-owner-enforced ownership, versioning Enabled, default encryption, TLS
   only, no public ACLs. Do not use the headshot/public-assets bucket. Configure
   GuardDuty Malware Protection for S3 and enable its object-result tagging.
3. Review least-privilege IAM and bucket policy: app may put immutable objects under
   `closing-documents/`, head/check versions, inspect scan tags and download clean
   versions. App/upload recipients must **not** be able to set/remove malware scan
   tags, overwrite approved objects, or remove object versions. Only the scanner
   can attest `GuardDutyMalwareScanStatus=NO_THREATS_FOUND`. Enforce conditional
   writes and clean-result read restrictions in bucket policy as defence in depth.
   Test HEAD/confirmation under that policy: it may need a retry while scan/tagging
   completes. Do not weaken the scan requirement to make a test pass.
4. CORS: exact approved BC origin(s), PUT only as needed, required signed headers
   (`content-type`, `if-none-match`, `x-amz-checksum-sha256`,
   `x-amz-server-side-encryption`); never wildcard origins with credentials.
5. Set BC `BC_DOCUMENT_BUCKET`, then separately enable `BC_FILE_WORKSPACE_ENABLED`
   and `BC_DOCUMENTS_ENABLED` after verification. New names are whitelisted in
   `amplify.yml`; environment changes require a rebuild. Keep all unrelated SES,
   coming-soon and email-permission settings unchanged.
6. Initial pricing currently runs after file commit in the creation request; the
   existing fee-provider timeout is 25 seconds. Before enabling initial pricing,
   give Garden's `BC_REQUEST_TIMEOUT_MS` at least 35000 ms and verify the hosting
   request duration supports it. Test slow provider failure + retry. A durable
   background pricing worker is not part of this first version. Pending estimates
   have an explicit staff retry; no silent zero/default total is displayed.
7. Deploy Garden second. Authorize operators with its existing `BC_ADMIN_USER_IDS`.
   Set `BC_DOCUMENT_UPLOAD_ORIGIN` to the exact dedicated bucket HTTPS origin and
   enable `BC_DOCUMENT_SHARING_ENABLED` separately. This does NOT enable the worker
   (`BC_INTEGRATION_ENABLED` must remain at its separately authorized value).
8. Use only synthetic documents and approved test identities initially. Prove:
   borrower upload -> staff visibility -> explicit selected-Pro sharing; unrelated
   file denial; no email sent; exact Garden file binding; pending/failed scan denial;
   clean scan download; revoked-link denial; immutable overwrite rejection; original
   quote preservation; Garden-first automatic baseline and manual version history.
   Confirm no raw storage keys/permanent URLs in participant JSON.
9. Agree retention separately before automatic object deletion. No cleanup job,
   production backfill, existing-document publication, or retention deletion ships
   with this PR. Abandoned upload objects are private and may require later scoped
   cleanup; do not delete confirmed versions using a blanket lifecycle rule.

Primary references: [S3 conditional writes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html),
[GuardDuty clean-result access control](https://docs.aws.amazon.com/guardduty/latest/ug/tag-based-access-s3-malware-protection.html).
