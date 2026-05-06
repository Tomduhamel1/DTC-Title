-- Add TeammateClosing many-to-many link.
-- One row per (teammate-email, closing) — represents that the email is
-- attached to that closing in some teammate role (lender / broker / realtor /
-- escrow officer). userId is null until a User with that email signs up,
-- at which point the auth signin hook claims the row.

CREATE TABLE "TeammateClosing" (
  "id"           TEXT NOT NULL,
  "userId"       TEXT,
  "closingId"    TEXT NOT NULL,
  "matchedEmail" TEXT NOT NULL,
  "role"         TEXT NOT NULL DEFAULT 'unknown',
  "muted"        BOOLEAN NOT NULL DEFAULT false,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TeammateClosing_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TeammateClosing_userId_closingId_key"
  ON "TeammateClosing" ("userId", "closingId");

CREATE UNIQUE INDEX "TeammateClosing_matchedEmail_closingId_key"
  ON "TeammateClosing" ("matchedEmail", "closingId");

CREATE INDEX "TeammateClosing_closingId_idx"
  ON "TeammateClosing" ("closingId");

CREATE INDEX "TeammateClosing_matchedEmail_idx"
  ON "TeammateClosing" ("matchedEmail");

ALTER TABLE "TeammateClosing"
  ADD CONSTRAINT "TeammateClosing_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "TeammateClosing"
  ADD CONSTRAINT "TeammateClosing_closingId_fkey"
  FOREIGN KEY ("closingId") REFERENCES "Closing"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── Backfill: existing closings ────────────────────────────────────────────
-- Walk every Closing row and create TeammateClosing rows for each non-null
-- teammate-side email already on the closing. Then do the same for
-- LenderRequest.lenderEmail. userId is set when a User with that email
-- already exists; otherwise the row is orphaned and will be claimed when
-- the teammate signs up.

INSERT INTO "TeammateClosing" ("id", "userId", "closingId", "matchedEmail", "role", "muted", "createdAt", "updatedAt")
SELECT
  'tc_' || substr(md5(random()::text || c."id" || lower(c."lenderEmail")), 1, 24),
  u."id",
  c."id",
  lower(c."lenderEmail"),
  'lender',
  false,
  NOW(),
  NOW()
FROM "Closing" c
LEFT JOIN "User" u ON lower(u."email") = lower(c."lenderEmail")
WHERE c."lenderEmail" IS NOT NULL AND c."lenderEmail" <> ''
ON CONFLICT ("matchedEmail", "closingId") DO NOTHING;

INSERT INTO "TeammateClosing" ("id", "userId", "closingId", "matchedEmail", "role", "muted", "createdAt", "updatedAt")
SELECT
  'tc_' || substr(md5(random()::text || c."id" || lower(c."agentEmail")), 1, 24),
  u."id",
  c."id",
  lower(c."agentEmail"),
  'realtor',
  false,
  NOW(),
  NOW()
FROM "Closing" c
LEFT JOIN "User" u ON lower(u."email") = lower(c."agentEmail")
WHERE c."agentEmail" IS NOT NULL AND c."agentEmail" <> ''
ON CONFLICT ("matchedEmail", "closingId") DO NOTHING;

INSERT INTO "TeammateClosing" ("id", "userId", "closingId", "matchedEmail", "role", "muted", "createdAt", "updatedAt")
SELECT
  'tc_' || substr(md5(random()::text || c."id" || lower(c."escrowOfficerEmail")), 1, 24),
  u."id",
  c."id",
  lower(c."escrowOfficerEmail"),
  'unknown',
  false,
  NOW(),
  NOW()
FROM "Closing" c
LEFT JOIN "User" u ON lower(u."email") = lower(c."escrowOfficerEmail")
WHERE c."escrowOfficerEmail" IS NOT NULL AND c."escrowOfficerEmail" <> ''
ON CONFLICT ("matchedEmail", "closingId") DO NOTHING;

-- LenderRequest.lenderEmail (only when the request is linked to a closing —
-- anonymous shares without a closingId can't be backfilled).
INSERT INTO "TeammateClosing" ("id", "userId", "closingId", "matchedEmail", "role", "muted", "createdAt", "updatedAt")
SELECT
  'tc_' || substr(md5(random()::text || lr."id" || lower(lr."lenderEmail")), 1, 24),
  u."id",
  lr."closingId",
  lower(lr."lenderEmail"),
  'lender',
  false,
  NOW(),
  NOW()
FROM "LenderRequest" lr
LEFT JOIN "User" u ON lower(u."email") = lower(lr."lenderEmail")
WHERE lr."lenderEmail" IS NOT NULL
  AND lr."lenderEmail" <> ''
  AND lr."closingId" IS NOT NULL
ON CONFLICT ("matchedEmail", "closingId") DO NOTHING;
