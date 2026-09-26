# Professional file-email access

## User experience

New professional file-opening and milestone emails sent by the existing delivery
service contain a personal **View my file** link. The recipient opens it and
confirms **View my file** on a minimal BetterClose page. They do not need to type
their email, receive a second message, set a password or register beforehand.
The confirmation is intentional: ordinary email previews/GET scanners must not
consume a login credential.

An already signed-in member goes directly to that file using their existing
session. Someone signed into a different account sees an explicit account-switch
notice before proceeding. Expired, used or unavailable credentials offer a new
access-link request with the intended file retained and instructions to use the
email that received the update. That recovery step still requires an email.

Previously delivered email URLs cannot be rewritten. Ordinary protected links
and passwordless sign-in remain supported. This change does not replay historical
notifications, enable the Garden worker, change borrower consent, or fix the
separately tracked notification-settings/document-viewer UX.

## Authentication contract

- Only the existing trusted Pro notification boundary issues these links. No
  public mint endpoint, self-selected role, new membership or sharing grant.
- Recheck the exact file, recipient, trusted Pro role, linked user identity and
  membership eligibility at issuance and redemption. Removed/changed membership
  refuses redemption. Exclude borrower/EO identities and administrator accounts,
  including admins with unclaimed memberships. Administrators receive ordinary
  protected links, not notification-derived login credentials.
- Accept unambiguous canonical ASCII email identities only. Do not reinterpret
  compatibility characters, display names or comma-suffixed addresses when
  bypassing NextAuth's normal sign-in normalization endpoint.
- Random 256-bit key, 24-hour expiry, purpose-separated SHA-256 hash in the
  existing VerificationToken table. The raw key is never persisted. No migration.
- The raw key is in the URL fragment, not the request URL. The client removes it
  from browser history and sends it only on explicit same-origin JSON POST.
  GETs do not consume it. Atomically consume once, including concurrent requests.
- The POST exchanges it for a single-use, 60-second standard NextAuth email token.
  NextAuth's existing callback/adapter creates the normal database-backed session
  and claims only existing matching memberships. The destination still enforces
  per-file access. No handcrafted cookies or public file access.
- This is a **normal Pro account session**, not a file-only guest session. It has
  the same existing memberships and session lifetime as ordinary passwordless
  sign-in. The token chooses the landing file; it does not narrow the signed-in
  user's existing account permissions. Forwarding a still-valid link can allow
  the holder to authenticate as that recipient, so both email and landing page
  explicitly say it is personal and must not be forwarded.
- Trust only configured NEXTAUTH_URL for origin/callback, HTTPS outside loopback.
  Require the existing NEXTAUTH_SECRET; never read a client callback override.
- No-store/private, no-referrer, frame denial and noindex on the access page.
  Credential-route errors/traces/breadcrumbs are dropped from Sentry, with client
  Sentry disabled on this landing page. Never log raw keys or response URLs.
- Possession of a link proves access to the email, not that its holder is the
  intended human. This retains the existing email-auth trust model. No claim of
  MFA or protection against an intentionally forwarded credential.

The token lifetime follows the existing [NextAuth email provider](https://next-auth.js.org/providers/email)
default. Randomness, one-time use, expiry and referrer precautions follow the
[OWASP token-handling guidance](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html).
The app uses NextAuth v4 hashing/adapter behavior; compiled HTTP regressions must
remain green when that dependency or its provider secret configuration changes.

## Verification (2026-09-25)

All local writes used a verified loopback `garden_ldi_betterclose_journeys_*`
database. No production credentials, live customer data, storage operations or
real email sends were used.

- Production build and TypeScript validation pass.
- 156 tests pass across file-access, role-journey, notification-policy,
  file-workspace, storage, receipt, email-design and auth-dependency suites.
- Nine compiled-server HTTP checks pass, including actual first-time NextAuth
  sign-in/session creation without a second email, account switching, replay,
  revoked membership, exact-file authorization, existing login and admin gates.
- In-app browser verified the compiled landing page, removal of the fragment,
  real button → authenticated synthetic file, no email field or second message,
  expired-key handling and file-preserving recovery. No browser console warnings
  or errors were observed for the successful path.
- One unrelated existing Puppeteer client-page test was excluded locally because
  its bundled Chrome is absent; CI uses its existing runner Chrome to run the
  full HTTP/browser suite. No claim that the full local browser suite passed.

Before release: inspect all CI checks at the final commit. Merge/deploy requires
separate approval. After deployment, confirm the deployed version and request a
single authorized synthetic-recipient test for actual email-client link handling.
Do not resend past milestones or create production files merely to test this UI.
