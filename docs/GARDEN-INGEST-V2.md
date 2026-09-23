# Garden ingest v2 — paired rollout required

This patch is not authorization to deploy, migrate production, activate Garden, rotate secrets or send customer emails.

## Identity and field ownership

`POST /api/orders/ingest` requires an authenticated request with a nonempty Garden file number. It matches only that exact key. Different files remain separate even for the same borrower/phone/property. No unbound lead is claimed by a fuzzy match; operators must explicitly correlate an existing lead when appropriate.

This dedicated path leaves website, broker conversion and admin intake implementations unchanged. Their broader identity/authorization behavior needs separate review before claiming end-to-end launch readiness.

Existing nonblank property, loan, borrower/contact and lender values cannot be overwritten by an ingest. Conflicts return HTTP 409 with field names only. Empty fields can be filled. The assigned officer remains TPS-owned and updateable. Borrower name is used for notification copy, not a stored Closing field. Source is fixed to garden. Unknown keys are rejected before mutation.

## Atomic application and truthful acknowledgment

An isolated serializable transaction saves the closing, milestones, teammate association, officer and notification intents. Any assignment failure rolls the transaction back. Concurrent key/serialization races return 503 and retry the same key; never fall back to contact matching.

A successful response includes:

```json
{
  "ok": true,
  "contractVersion": 2,
  "ingestApplied": true,
  "gardenFileNumber": "SYNTHETIC-EXAMPLE",
  "closingId": "receiver-id",
  "matchedBy": "garden_file_number",
  "teammateLinked": true,
  "officerFieldsSet": 2
}
```

TeammateLinked describes an actual association. OfficerFieldsSet counts the supplied officer keys applied. HTTP 200 requires all durable notification intents for that closing to have completed; it does not prove inbox delivery or retrospectively prove a legacy welcome email was sent.

## Notification retry

The additive IngestDelivery table stores welcome and placing-teammate invite intents atomically with their associated records. Sending happens after commit. HTTP 503 notification_pending keeps Garden's durable job retryable. Replays skip sent intents and recover expired five-minute leases. Active leases cannot be stolen.

There is no new scheduled sender: Garden's request retries drain these intents. If Garden exhausts its retry budget, an authorized operator must retry the failed job after resolving the cause. Legacy closings with a preexisting borrower email do not get a fabricated historical delivery marker or an automatic welcome resend.

Delivery is at-least-once, not exactly once: a crash between SES acceptance and saving sentAt can cause a duplicate. A process restart before sending loses no intent. Dry-run sends returning no provider ID remain pending.

## Rollout / rollback

Deploy only after separate authorization. Apply migration 20260923010000_garden_ingest_delivery, then deploy this receiver BEFORE the paired Garden sender branch fix/betterclose-integration-hardening. Keep customer synchronization inactive until SES production access, outstanding credential rotation, operator permissions and supervised acceptance are verified.

On rollback retain IngestDelivery records; do not delete pending intent. Reverting the receiver while the new Garden sender is active causes an explicit contract refusal, not false success.

## Verification

`node --test test/garden-ingest.pg.test.cjs` requires a local garden_ldi_* DATABASE_URL, verifies the connected database identity, and replaces every email function with a stub before loading application code. CI applies all migrations to an empty local PostgreSQL service and runs the same suite.

The full TypeScript check currently reports the same 10 errors as untouched main 325f67d (verified by byte-for-byte diagnostic comparison). Do not call that a passing build. The integration tests are distinct evidence.
