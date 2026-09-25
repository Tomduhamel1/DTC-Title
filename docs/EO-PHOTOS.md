# Approved Escrow Officer photos

The owner supplied and approved publication of Kristen Deyton, Steve Patti and
Nicole Micciche's headshots on September 24, 2026. Originals are served from
`public/images/escrow-officers/`; the filename suffix is their SHA256 prefix.
No retouching, resampling or re-encoding is applied. Display cards frame the
original with `object-fit: cover` and `object-position: center 30%`.

The owner also supplied Brittany Arrington's headshot on September 24, 2026.
Her assigned employee email was verified against the active Garden record with
a read-only lookup. Although the supplied filename ends in `.PNG`, the original
bytes are JPEG; the versioned public copy uses `.jpg` without re-encoding.

`src/lib/closing/officerPhoto.ts` is the shared server-side resolver for both
borrower dashboards, the professional file dashboard, the authenticated TPS
snapshot/readiness check, and the Pro introduction email. It selects only by the
assigned EO's exact, normalized Garden employee email. It never infers identity
from a name, property, borrower or professional contact.

An existing nonblank per-file photo wins. Unknown officers keep their current
photo or initials; there is no generic person's headshot. Blank photos resolve
at read time, so no database migration, closing backfill, new order or resend is
needed. The existing officer-change clearing protection is unchanged: these
defaults are not persisted as stale per-file overrides.

These publicly accessible HTTPS assets are intentional: email image clients
cannot use an authenticated dashboard URL. Do not store tokens or customer data
in this directory. New headshots require owner approval and a verified employee
identity. Use a new content-versioned filename when replacing an image.

Publishing a photo is not proof of an EO mailbox, recipient consent or email
delivery. Existing reply-routing, borrower-permission and sender-OFF gates remain
unchanged. No email is triggered by this lookup or by deployment.
