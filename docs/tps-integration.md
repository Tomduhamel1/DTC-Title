# BetterClose ↔ TPS Integration Spec

This document is the contract between the BetterClose customer-facing app
(this repo) and the TPS title-production system. It's the source of truth
for the API endpoints, payload shapes, and message sequencing that wire
the two sides together.

**Audience:** the engineer (or LLM) building the TPS-side integration.

---

## 1. Overview

Two independent systems share files:

- **BetterClose (BC)** owns the borrower's account, the borrower-facing
  dashboard, the teammate (lender / broker / realtor) portal, the
  marketing site, and outbound email notifications. The borrower is the
  source of truth for property, loan, and contact details until BC
  staff or TPS overrides them.
- **TPS** owns the production of the title file: title search, policy
  issuance, escrow disbursement, and the actual closing event. TPS is
  the source of truth for title underwriter, policy number, the
  assigned BC escrow officer (Jamie etc.), and the closing location.

They communicate over a small set of HTTPS endpoints. Each side stores
the other's stable identifier so the conversation can be resumed
without re-matching.

---

## 2. Auth & base URL

All BC endpoints below are HTTPS only. TPS authenticates with a Bearer
token shared out-of-band:

```
Authorization: Bearer <ORDER_INGEST_SECRET>
```

The same secret authorises every TPS-callable endpoint. **Treat it like
a database password** — store in TPS's secret manager, never log,
rotate quarterly.

Base URL:
```
https://www.betterclose.co
```

For local TPS testing against a non-prod BC, the BC team will provide a
staging base URL with its own secret.

---

## 3. The four flows

### Flow A — Teammate places an order in TPS → BC creates / matches a closing

**Trigger (TPS-side):** a lender / broker / realtor opens a new title
order in TPS, naming BetterClose as the title company.

**Action (TPS):** POST the order details to BC.

```http
POST /api/orders/ingest
Authorization: Bearer <ORDER_INGEST_SECRET>
Content-Type: application/json
```

**Request body:**

```json
{
  "borrowerEmail":   "sarah.chen@example.com",
  "borrowerName":    "Sarah Chen",
  "borrowerPhone":   "+15125551234",

  "propertyAddress": "4218 Cedar Lake Dr",
  "propertyCity":    "Austin",
  "propertyState":   "TX",
  "propertyZip":     "78704",
  "propertyType":    "purchase",

  "salePrice":       650000,
  "loanAmount":      520000,
  "closingDate":     "2026-06-14",

  "lenderName":      "Mike Alvarez",
  "lenderCompany":   "Cardinal Financial",
  "lenderEmail":     "mike@cardinal.example",
  "lenderPhone":     "+15125555678",
  "lenderNmls":      "1234567",

  "teammateEmail":   "mike@cardinal.example",
  "teammateRole":    "lender"
}
```

**Required fields:** none are *required* by the validator (all flow
through), but at minimum send `borrowerEmail` *or* `borrowerPhone` *or*
`propertyAddress` so BC can match. Without any of those, BC creates an
orphan closing it can never reattach.

**`teammateEmail`** is the single most important field for attribution.
This is the **work email of the human who placed the order in TPS** —
typically the loan officer, broker, or realtor. BC uses it to:

- Auto-link this closing to that person's BetterClose account if they
  have one (so it appears on `/teammate/dashboard`).
- Stamp an orphan teammate row if they don't have an account yet — the
  link gets claimed automatically the first time they sign in with the
  same email.

If `teammateEmail` is omitted, BC falls back through `placedByEmail` →
`lenderContactEmail` → `orderingPartyEmail` → `lenderEmail`. **Always
send `teammateEmail` when you can** — it's the canonical name and the
others are kept only for backwards compatibility.

**`teammateRole`** is `"lender"` | `"broker"` | `"realtor"`. If omitted
and the email matches `lenderEmail`, BC infers `"lender"`. Otherwise it
defaults to `"unknown"`.

**Idempotency:** BC matches by (in priority): `borrowerEmail` →
existing User's email → last-10-digit `borrowerPhone` → normalised
`propertyAddress`. If a match is found, only blank fields on the
existing closing are updated (TPS data does not clobber what the
borrower already entered themselves). If no match, a new orphan closing
is created and a welcome email is sent to the borrower.

**Response (200):**

```json
{
  "ok": true,
  "matchedBy": "email",
  "closingId": "cmog6df9w000412gbn6o7uagt",
  "teammateLinked": true,
  "welcomeEmailedTo": null
}
```

- `matchedBy`: `"email"` | `"phone"` | `"property"` | `null` (no match
  → orphan was created).
- `closingId`: **store this in your TPS file record.** Every subsequent
  call from TPS about this file uses it.
- `teammateLinked`: `true` if BC successfully attributed the order to a
  teammate (whether they had a BC account or not).
- `welcomeEmailedTo`: borrower email if BC sent a welcome (only when
  the closing was orphan-created), else `null`.

**Errors:**

| Status | When |
|--------|------|
| 401    | Bearer token missing or wrong |
| 400    | Body unparseable |
| 5xx    | BC unavailable — see retry guidance below |

---

### Flow B — TPS marks a milestone → BC notifies borrower + teammates

**Trigger (TPS-side):** TPS staff complete a milestone on the file
(e.g. finished the title search, issued the policy, recorded the deed).

**Action (TPS):** POST the new milestone status to BC.

```http
POST /api/tps/closings/{closingId}/milestone
Authorization: Bearer <ORDER_INGEST_SECRET>
Content-Type: application/json
```

**Request body:**

```json
{
  "kind":   "title_search",
  "status": "done"
}
```

**`kind`** must be one of the canonical milestones BC tracks (in order
of normal progression):

| kind            | Plain meaning                                        |
|-----------------|------------------------------------------------------|
| `loan_locked`   | Lender locked the rate                              |
| `title_ordered` | TPS opened the order in its system                  |
| `title_search`  | TPS finished the title search; clear-to-issue       |
| `title_issued`  | Underwriter issued the policy                       |
| `closed`        | Funds disbursed, deed recorded, file complete       |

`status` is `"pending"` | `"active"` | `"done"`. **TPS will almost
always send `"done"`.** When BC gets `"done"` for the first time on a
milestone:

- Borrower receives a tailored email about that milestone
- Every teammate on the file (with a BC account, not muted) receives
  the same email pointing at their teammate dashboard
- For `"closed"`, BC additionally snapshots the savings report into
  the closing record and sends the celebratory closed email

**Idempotency:** BC tracks `notifiedAt` per milestone. Repeating a
`"done"` transition for an already-done milestone is a no-op — no
duplicate emails, no errors. Safe to retry.

**Response (200):**

```json
{
  "ok": true,
  "closingId": "cmog6df9w000412gbn6o7uagt",
  "kind": "title_search",
  "status": "done",
  "emailed": true,
  "snapshotted": false
}
```

`emailed: false` means the borrower had no email on file (rare; orphan
closings created by TPS without `borrowerEmail`). `snapshotted` is only
ever `true` for `kind: "closed"`.

**Errors:** 401, 400 (bad kind/status), 404 (no closing with that id).

---

### Flow C — TPS assigns the escrow officer / sets title details → BC dashboard updates

**Trigger:** TPS assigns Jamie (or any officer) to the file, picks the
underwriter, gets the policy number back, or sets the closing
location.

**Action (TPS):** PATCH the relevant fields. **Send only the fields
you want to change.** Omitted fields are untouched.

```http
PATCH /api/tps/closings/{closingId}/details
Authorization: Bearer <ORDER_INGEST_SECRET>
Content-Type: application/json
```

**Request body (full shape):**

```json
{
  "escrowOfficer": {
    "name":     "Jamie Doe",
    "title":    "Senior Escrow Officer",
    "email":    "jamie.doe@betterclose.co",
    "phone":    "(855) 555-0142",
    "nmls":     "2184593",
    "photoUrl": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=512&h=512&fit=facearea&facepad=2.5"
  },
  "title": {
    "underwriter":  "First American Title",
    "policyNumber": "FA-2026-0512-883421"
  },
  "closingLocation": "Remote — RON via Notarize"
}
```

**Per-field semantics:**

- Set a string to assign / change the value.
- Set explicit `null` to clear it.
- Omit a key entirely to leave it untouched.

When `escrowOfficer.email` is set, BC also creates a `TeammateClosing`
row for that email so the officer (if they're a BC user) sees the file
on their teammate dashboard.

**Response (200):**

```json
{ "ok": true, "updated": 7 }
```

`updated` is the count of columns actually changed.

**Photo URLs:** Must be HTTPS. BC currently uses Unsplash with
`fit=facearea&facepad=2.5` for face-centred crops; any HTTPS URL is
fine, but it must be reachable by the user's browser (not behind a
private CDN that requires auth).

**Errors:** 401, 400 (invalid email format / non-HTTPS photo URL), 404.

---

### Flow D — TPS pulls a fresh snapshot of the closing

**Trigger:** TPS needs the latest BC-side state — typically because the
borrower edited their property address / closing date / agent contact
on their dashboard, and TPS wants to mirror that into its own file
record.

**Action (TPS):** GET the closing.

```http
GET /api/tps/closings/{closingId}
Authorization: Bearer <ORDER_INGEST_SECRET>
```

**Response (200):**

```json
{
  "ok": true,
  "closing": {
    "id":        "cmog6df9w000412gbn6o7uagt",
    "status":    "active",
    "source":    "inbound_order",
    "createdAt": "2026-04-30T17:22:01.123Z",
    "updatedAt": "2026-05-06T15:50:59.829Z",
    "closedAt":  null,

    "borrower": {
      "userId": "cmog6deyp000012gbwzgcdx6d",
      "name":   "Sarah Chen",
      "email":  "sarah.chen@example.com",
      "phone":  "+15125551234"
    },
    "property": {
      "address": "4218 Cedar Lake Dr",
      "city":    "Austin",
      "state":   "TX",
      "zip":     "78704",
      "type":    "purchase"
    },
    "transaction": {
      "salePrice":   650000,
      "loanAmount":  520000,
      "closingDate": "2026-06-14T00:00:00.000Z"
    },
    "lender": {
      "name":    "Mike Alvarez",
      "company": "Cardinal Financial",
      "email":   "mike@cardinal.example",
      "phone":   "+15125555678",
      "nmls":    "1234567"
    },
    "agent": {
      "name":    null,
      "company": null,
      "email":   null,
      "phone":   null
    },
    "title": {
      "underwriter":  "First American Title",
      "policyNumber": null
    },
    "escrowOfficer": {
      "name":     "Jamie Doe",
      "title":    "Senior Escrow Officer",
      "email":    "jamie.doe@betterclose.co",
      "phone":    "(855) 555-0142",
      "nmls":     "2184593",
      "photoUrl": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=512&h=512&fit=facearea&facepad=2.5"
    },
    "closingLocation": "Remote — RON via Notarize",

    "milestones": [
      { "kind": "loan_locked",   "status": "done",    "completedAt": "2026-05-04T12:00:00Z" },
      { "kind": "title_ordered", "status": "done",    "completedAt": "2026-05-04T12:30:00Z" },
      { "kind": "title_search",  "status": "done",    "completedAt": "2026-05-06T14:15:00Z" },
      { "kind": "title_issued",  "status": "pending", "completedAt": null },
      { "kind": "closed",        "status": "pending", "completedAt": null }
    ],

    "teammates": [
      { "email": "mike@cardinal.example",     "role": "lender",  "muted": false },
      { "email": "jamie.doe@betterclose.co",  "role": "unknown", "muted": false }
    ]
  }
}
```

**Errors:** 401, 404.

---

## 4. The TPS-side integration sequence

Recommended order of operations for a new file:

```
TPS event                    HTTP call                                     What BC does
───────────────────────────  ────────────────────────────────────────────  ──────────────────────────────
1. Order opened              POST /api/orders/ingest                       create / match Closing,
   in TPS                    (full borrower + teammate payload)            stamp teammate, return
                                                                           closingId
2. TPS staff finishes        POST /api/tps/closings/{id}/milestone         email borrower + teammates,
   title search              { kind: "title_search", status: "done" }      mark milestone done

3. Underwriter assigned,     PATCH /api/tps/closings/{id}/details          update Closing record,
   policy issued             { title: { underwriter, policyNumber } }      update borrower's dashboard

4. Escrow officer assigned   PATCH /api/tps/closings/{id}/details          dashboard shows officer's
                             { escrowOfficer: { ...full block } }          face / contact info

5. Borrower edits their      (no TPS action needed — BC stores it)         no-op
   property type on the
   dashboard

6. TPS staff opens the       GET /api/tps/closings/{id}                    return full snapshot,
   file the next morning                                                   TPS reconciles its record

7. File closes               POST /api/tps/closings/{id}/milestone         celebratory email +
                             { kind: "closed", status: "done" }            savings snapshot
```

---

## 5. Network reliability

- **Retries:** for 5xx and network-timeout failures, retry with
  exponential backoff: 5s, 30s, 2 min, 10 min, 1 hour. After ~5 attempts,
  log to a TPS-side dead-letter queue and alert.
- **All endpoints are idempotent** (matched by closingId and milestone
  kind, or upsert by email + closing for teammates). Safe to retry.
- **Do not retry 4xx** (400, 401, 404). Those are wrong-payload bugs;
  fix the call.
- **Timeouts:** BC endpoints typically respond in <500ms. Set TPS-side
  HTTP client timeout to 10s.

---

## 6. Field reference: borrower-owned vs TPS-owned

| Field on Closing       | Source of truth | TPS can write? |
|------------------------|-----------------|----------------|
| propertyAddress / city / state / zip | borrower (overridden by orders/ingest fill-blanks)  | only via /orders/ingest, blanks-only |
| propertyType           | borrower        | only via /orders/ingest, blanks-only |
| salePrice / loanAmount | borrower        | only via /orders/ingest, blanks-only |
| closingDate            | borrower (TPS may correct) | only via /orders/ingest, blanks-only |
| borrowerEmail / borrowerPhone | borrower | only via /orders/ingest, blanks-only |
| lenderName / company / email / phone / nmls | TPS (initial) | /orders/ingest, blanks-only |
| agentName / company / email / phone | borrower | not currently writable by TPS |
| titleUnderwriter, titlePolicyNo | TPS | yes via /tps/closings/{id}/details |
| escrowOfficer*         | TPS / BC ops    | yes via /tps/closings/{id}/details |
| closingLocation        | TPS             | yes via /tps/closings/{id}/details |

The "blanks-only" rule prevents `/orders/ingest` from clobbering values
the borrower has already typed in their dashboard. If TPS needs to
override (rare), reach out to BC ops — there's no API for that today.

---

## 7. NotificationLog visibility

Every email BC sends (or skips because of a teammate mute) is recorded
in `NotificationLog` with a `kind` prefix that tells you who triggered
it:

- `admin:milestone:title_search` — admin UI flipped the milestone
- `tps:milestone:title_search` — TPS posted the milestone
- `teammate:milestone:title_search` — teammate fanout from either of the above
- `teammate:milestone_skipped:title_search` — teammate had it muted
- `teammate:mute_on` / `teammate:mute_off` — mute toggle audit

This is admin-only viewing today (`/admin/notifications`); TPS doesn't
need to poll it but it's available if BC ops needs to debug a missing
email with you.

---

## 8. Things explicitly **not** in this spec

- **Polling endpoints for milestone state.** TPS is the writer of
  milestones; BC is the reader for the borrower dashboard. There's no
  reason for TPS to read milestone state back, and BC doesn't expose
  one.
- **Outbound webhooks from BC to TPS.** BC currently does not push to
  TPS — TPS pulls via GET when it wants the latest snapshot. If we add
  this later, it'll be a separate doc.
- **Document upload / e-signing flow.** Closing documents live in TPS,
  not BC. BC doesn't store them.
- **Wire instructions / disbursements.** TPS owns this end-to-end.

---

## 9. Versioning

This spec is `v1.0`. Breaking changes get a new path prefix
(`/api/v2/tps/...`) with at least 30 days notice. Non-breaking
additions (new optional fields, new milestone kinds) are added without
a version bump but will be announced.

If you find an inconsistency between this doc and BC's actual response,
**the BC implementation is canonical** — file an issue and we'll fix
the doc.

---

## 10. Quick test

A 30-second sanity check from the TPS side, once you have the secret:

```bash
# 1. Open a test order
ORDER=$(curl -sX POST 'https://www.betterclose.co/api/orders/ingest' \
  -H "Authorization: Bearer $ORDER_INGEST_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{
    "borrowerEmail":"test+'$(date +%s)'@betterclose.co",
    "propertyAddress":"123 Test St","propertyCity":"Austin",
    "propertyState":"TX","propertyZip":"78704","propertyType":"purchase",
    "salePrice":500000,"loanAmount":400000,
    "lenderEmail":"loadtest@example.com",
    "teammateEmail":"loadtest@example.com","teammateRole":"lender"
  }')
echo "$ORDER" | jq .
CLOSING_ID=$(echo "$ORDER" | jq -r .closingId)

# 2. Pull it back
curl -s "https://www.betterclose.co/api/tps/closings/$CLOSING_ID" \
  -H "Authorization: Bearer $ORDER_INGEST_SECRET" | jq .closing.escrowOfficer

# 3. Push an escrow-officer assignment
curl -sX PATCH "https://www.betterclose.co/api/tps/closings/$CLOSING_ID/details" \
  -H "Authorization: Bearer $ORDER_INGEST_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"escrowOfficer":{"name":"Test Officer","email":"officer@betterclose.co"}}'

# 4. Mark title-search done
curl -sX POST "https://www.betterclose.co/api/tps/closings/$CLOSING_ID/milestone" \
  -H "Authorization: Bearer $ORDER_INGEST_SECRET" \
  -H 'Content-Type: application/json' \
  -d '{"kind":"title_search","status":"done"}'
```

If all four return `"ok": true`, the integration is live.
