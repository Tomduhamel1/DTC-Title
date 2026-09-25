ALTER TABLE "Closing" ADD COLUMN "transactionType" TEXT;
ALTER TABLE "Closing" ADD CONSTRAINT "Closing_transactionType_check" CHECK ("transactionType" IN ('purchase', 'refinance'));

CREATE TABLE "ClosingDocument" (
  "id" TEXT PRIMARY KEY, "closingId" TEXT NOT NULL REFERENCES "Closing"("id") ON DELETE CASCADE,
  "origin" TEXT NOT NULL CHECK ("origin" IN ('participant', 'staff', 'garden')),
  "sourceDocumentId" TEXT, "sourceVersion" TEXT,
  "fileName" TEXT NOT NULL, "fileSize" INTEGER NOT NULL CHECK ("fileSize" > 0 AND "fileSize" <= 20971520),
  "mimeType" TEXT NOT NULL, "sha256" TEXT NOT NULL,
  "storageKey" TEXT NOT NULL UNIQUE, "storageVersion" TEXT,
  "uploaderId" TEXT NOT NULL, "recipientUserIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "status" TEXT NOT NULL DEFAULT 'pending' CHECK ("status" IN ('pending', 'uploaded', 'revoked')),
  "revision" INTEGER NOT NULL DEFAULT 1 CHECK ("revision" > 0),
  "uploadExpiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClosingDocument_source_check" CHECK (("origin" = 'garden') = ("sourceDocumentId" IS NOT NULL AND "sourceVersion" IS NOT NULL)),
  CONSTRAINT "ClosingDocument_version_check" CHECK ("status" <> 'uploaded' OR "storageVersion" IS NOT NULL)
);
CREATE INDEX "ClosingDocument_closingId_createdAt_idx" ON "ClosingDocument"("closingId", "createdAt");
CREATE UNIQUE INDEX "ClosingDocument_closingId_sourceDocumentId_sourceVersion_key" ON "ClosingDocument"("closingId", "sourceDocumentId", "sourceVersion");
CREATE TABLE "ClosingDocumentEvent" (
  "id" TEXT PRIMARY KEY, "documentId" TEXT NOT NULL REFERENCES "ClosingDocument"("id") ON DELETE CASCADE,
  "actorId" TEXT NOT NULL, "kind" TEXT NOT NULL, "metadata" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "ClosingDocumentEvent_documentId_createdAt_idx" ON "ClosingDocumentEvent"("documentId", "createdAt");
CREATE TABLE "ClosingEstimateVersion" (
  "id" TEXT PRIMARY KEY, "closingId" TEXT NOT NULL REFERENCES "Closing"("id") ON DELETE CASCADE,
  "revision" INTEGER NOT NULL CHECK ("revision" > 0), "source" TEXT NOT NULL CHECK ("source" IN ('linked_quote', 'file_estimate')),
  "sourceQuoteId" TEXT, "inputHash" TEXT NOT NULL, "inputJson" JSONB NOT NULL, "outputJson" JSONB NOT NULL,
  "assumptions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], "actorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "ClosingEstimateVersion_closingId_revision_key" ON "ClosingEstimateVersion"("closingId", "revision");
