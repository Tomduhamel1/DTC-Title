CREATE TABLE "IngestDelivery" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "closingId" TEXT NOT NULL REFERENCES "Closing"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "kind" TEXT NOT NULL CHECK ("kind" IN ('welcome', 'teammate_invite')),
  "recipient" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending' CHECK ("status" IN ('pending', 'sending', 'sent')),
  "leaseToken" TEXT,
  "leaseUntil" TIMESTAMP(3),
  "sentAt" TIMESTAMP(3),
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "IngestDelivery_closingId_kind_recipient_key"
  ON "IngestDelivery" ("closingId", "kind", "recipient");
CREATE INDEX "IngestDelivery_status_leaseUntil_idx" ON "IngestDelivery" ("status", "leaseUntil");
