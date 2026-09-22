# Prompt for the Garden session — BetterClose order/officer/milestone push

Copy everything below the line into the Claude session working on Garden.

---

Implement the BetterClose (BC) integration in Garden. BC is our consumer
site (https://www.betterclose.co, Next.js on AWS Amplify); its API is live
and already accepts everything described here. Garden is the system of
record — BC never writes into Garden; Garden pushes to BC at three moments
in a file's life. Most orders arrive by email and are opened in Garden
first, so this push is the ONLY way those customers get their BC dashboard,
welcome email, and escrow-officer card — treat delivery as must-not-drop.

## Auth & base

- Base URL: `https://www.betterclose.co`
- Every call: header `Authorization: Bearer $BC_ORDER_INGEST_SECRET`
- Put the secret in Garden's environment/secret store as
  `BC_ORDER_INGEST_SECRET`. Tom will provide the value out of band (it is
  the `ORDER_INGEST_SECRET` in BC's Amplify env). Never hardcode or log it.
- All bodies are JSON (`Content-Type: application/json`).

## Moment 1 — a file is opened (or its core fields change) in Garden

`POST /api/orders/ingest`

```json
{
  "gardenFileNumber": "<Garden's own order/file number — ALWAYS send>",
  "borrowerEmail": "buyer@example.com",
  "borrowerName": "Pat Buyer",
  "borrowerPhone": "401-555-0100",
  "propertyAddress": "12 Main St",
  "propertyCity": "Providence",
  "propertyState": "RI",
  "propertyZip": "02903",
  "propertyType": "purchase",            // or "refinance"
  "closingDate": "2026-10-31",           // ISO date
  "salePrice": 500000,                    // number, purchase only
  "loanAmount": 400000,                   // number
  "lenderName": "Lee Lender",
  "lenderCompany": "Acme Mortgage",
  "lenderEmail": "lee@acmemortgage.com",
  "lenderPhone": "401-555-0101",
  "lenderNmls": "123456",
  "teammateEmail": "lee@acmemortgage.com", // who placed the order
  "teammateRole": "lender",                // lender | broker | realtor
  "escrowOfficer": {                       // include if already assigned
    "name": "Jordan Rivera",
    "title": "Senior Escrow Officer",
    "email": "jordan.rivera@betterclose.co",
    "phone": "1-800-316-9508"
  }
}
```

Every field is optional except that you should always send
`gardenFileNumber`, and an order is only useful with at least a borrower
email or a property address. Response:

```json
{ "ok": true, "closingId": "cmu...", "matchedBy": "garden_file_number" | "email" | ... | null,
  "officerFieldsSet": 4, "ignoredKeys": ["typoedField"] }
```

- **Store `closingId` on the Garden file.** It is the key for Moments 2–3.
- `matchedBy` non-null means BC merged into an existing file (e.g. the
  borrower had already started on the website) — that is success, not an
  error. Merging only fills blanks; it never overwrites.
- Re-pushing the same file is always safe (idempotent by
  `gardenFileNumber`). Push again whenever core fields materially change.
- **If `ignoredKeys` is ever non-empty, fail the integration test** — it
  means a field name is misspelled and being dropped.

## Moment 2 — the escrow officer is assigned or changed

(Skip if the officer was already included in Moment 1 and hasn't changed.)

`PATCH /api/tps/closings/{closingId}/details`

```json
{ "escrowOfficer": { "name": "...", "title": "...", "email": "...",
                     "phone": "...", "nmls": "...", "photoUrl": "https://..." } }
```

⚠️ Null semantics: an **omitted** key is left untouched; an explicit
**null clears the field on the customer's dashboard**. Build the payload by
including only the keys you mean to set — make sure the serializer drops
undefined/absent values rather than emitting nulls.

Can also carry `"title": {"underwriter": "...", "policyNumber": "..."}` and
`"closingLocation": "..."` when known.

## Moment 3 — a milestone changes

`POST /api/tps/closings/{closingId}/milestone`

```json
{ "kind": "title_ordered", "status": "done" }
```

- `kind` ∈ `loan_locked | title_ordered | title_search | title_issued | closed`
- `status` ∈ `pending | active | done`
- Map Garden's internal statuses onto these five however fits Garden's
  model; fire one call per transition. First time a milestone hits `done`,
  BC emails the borrower and non-muted teammates automatically (exactly
  once — BC tracks `notifiedAt`; re-sending the same transition is safe).
  `closed` also freezes the fee-report snapshot on the BC side.

## Reliability requirements

- Queue + retry with backoff on network errors and 5xx (BC is serverless;
  a cold start can 5xx occasionally). All three endpoints are idempotent —
  blind retry is safe.
- On 4xx, do NOT retry blindly: log the response body (it names the invalid
  field) and surface it somewhere a human sees.
- 401 means the secret is wrong/missing — alert loudly, don't spin.
- If a push permanently fails, the fallback is manual: ops can enter the
  order at betterclose.co/admin/closings/new — so failures must be visible,
  never swallowed.

## Verify (acceptance test)

1. Open a throwaway test file in Garden ("TEST — do not process") with a
   plus-addressed borrower email → expect `ok:true` + a `closingId`, and
   `ignoredKeys` absent.
2. Assign an officer → `GET /api/tps/closings/{closingId}` (same Bearer
   auth) must show the officer block populated.
3. Flip a milestone to done → GET shows it done.
4. Push the same file a second time → same `closingId` comes back
   (`matchedBy: "garden_file_number"`), no duplicate created.

Full spec, field-by-field reference, and FAQ live in the DTC-Title repo at
`docs/tps-integration.md` (see "Contract updates (2026-09-22)" for the
`gardenFileNumber` + inline-officer additions).
