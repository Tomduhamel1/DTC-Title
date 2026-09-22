# Email-order runbook (orders@betterclose.co)

Most orders arrive as an email to orders@betterclose.co (Namecheap Private
Email mailbox; MX verified healthy 2026-09-22). This is the loop that turns
each one into a live BetterClose file with the escrow officer on the
customer's dashboard. Two modes:

## Mode A — Garden integration live (target state)

1. Ops reads the email, opens the file **in Garden** as usual.
2. Garden pushes to BetterClose automatically on file-open:
   `POST /api/orders/ingest` — now accepts the `escrowOfficer` block and
   `gardenFileNumber` in the same call, so one push covers open + officer.
3. Garden pushes milestone changes as they happen
   (`POST /api/tps/closings/{id}/milestone`).
4. Nothing else to do. The borrower gets the welcome email, the placing
   lender/broker/agent gets a dashboard-invite email keyed to their work
   address, and everyone's dashboard shows the officer card.

## Mode B — manual (until Garden ships, or when the push fails)

1. Ops reads the email.
2. Open **betterclose.co/admin/closings** → **"+ Open a file (email/phone
   order)"** → paste the details (borrower, property, placed-by from the
   signature, Garden file # if known) → **Open the file**. ~60 seconds.
   The same matching/dedupe, welcome email, and teammate invite fire as in
   Mode A.
3. You land on the file page: fill the **Escrow officer** section once the
   officer is assigned in Garden, and flip **Milestones** as the file moves.

## Rules that keep this bulletproof

- **Never skip the Garden file # when you have it** — it's the dedupe key.
  A second push/entry with the same number lands on the same file instead of
  creating a duplicate.
- Re-pushing/re-entering is always safe: matching fills blanks and never
  overwrites values someone already entered.
- If a customer says "I never got the email": until SES production access is
  granted, welcome/invite emails only deliver to verified addresses (see
  ISSUES.md). Their file still exists — they can sign in at
  betterclose.co/login with the same email any time.
- The `/open` page on the site produces identical files (source
  `web_open_file`); web and email orders converge in the same pipeline.
