# External email design

All ten customer/professional email types use `src/lib/email/layout.ts`:
borrower welcome, borrower milestone update, professional milestone update,
teammate invitation, broker portal welcome, broker quote, closing completed,
lender request, mortgage partner referral, and sign-in magic link.

The renderer owns the BetterClose wordmark, 560px fluid card, system font stack,
24px heading, accessible dark-green action button, spacing, savings panels and
footer. Professional role labels are separate context labels, not a different
brand treatment. Content, destinations and recipient roles remain template-specific.
Internal `*-ops.ts` notifications are intentionally unchanged.

## Boundaries

This is presentation only. SES transport, recipients, CC/reply-to, subjects,
token creation, expiry, rate limits, fee calculations, lifecycle events and
existing dry-run gates are unchanged. No dependencies or database schema changed.
The sign-in renderer was extracted from auth options without moving auth logic.
Dynamic content is HTML-escaped; action URLs are escaped, never rebuilt.

Two small text corrections accompany the design: the referral template's old
TrueFee Closing name becomes BetterClose, and the welcome email no longer prints
`[SUPPORT PHONE TBD]` when no telephone number is configured. A configured phone
number still appears. Existing product claims and milestone wording are otherwise
preserved; this change does not certify those claims or expand integration scope.

## Verification and previews

```sh
npm run typecheck
npm run test:release-types
npm run test:email-design
npm run test:email-layout
npm run preview:email -- /tmp/betterclose-email-preview
```

The capture harness runs the real templates against intercepted send boundaries,
synthetic environment variables and `.example.invalid` recipients. It refuses
database access and unknown external dependencies. It does not read local secrets.
The browser uses a fresh disposable profile and blocks all page network requests.
No test or preview sends a message. The preview generator writes ten HTML examples,
twenty desktop/mobile PNGs and an index page into the requested directory.

The 34-case delivery fixture was captured from unchanged main commit
`a5903757e21ae92f8816bef44cd89b63ebf18ab9` (tree
`49e4c3a4e1b5c497ba9dfdc5c29e959c36472429`). It pins recipients, subject, sender
overrides, CC/reply-to, plain text and decoded action URLs. Only the two declared
text corrections above are normalized. Additional tests cover hostile contact
text, role copy, dry-run behavior, send failures, rate limiting and frozen savings.

Browser assertions cover all 34 variants at 800px, 375px and 320px, plus long
contact fields with head styles stripped. The shared frame uses inline table
layout and an Outlook/MSO width fallback. These checks and local visual previews
are not a substitute for Gmail/Outlook/Apple Mail inbox testing. No live-inbox
rendering verification is claimed, and sending test emails needs separate approval.

Both template and browser checks run on pull requests to main. A merge/push to
main can deploy through Amplify; do not merge this presentation change without
release authorization. It does not enable Garden syncing or change SES settings.
