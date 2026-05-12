-- Broker portal schema foundation (PR 2). Additive only.
--
-- Adds four new tables — BrokerCompany, BrokerMembership, FeeQuote,
-- FeeQuoteEvent — and one new column User.accountType. No existing tables
-- are altered structurally; the back-relation Closing.feeQuote in the Prisma
-- schema is virtual and does NOT add a Closing column. No existing unique
-- constraints, indexes, foreign keys, or column types are modified.
--
-- User.accountType is NOT NULL with DEFAULT 'borrower' so all existing rows
-- keep their current semantics with no backfill needed.

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountType" TEXT NOT NULL DEFAULT 'borrower';

-- CreateTable
CREATE TABLE "BrokerCompany" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "primaryDomain" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrokerCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrokerMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrokerMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeQuote" (
    "id" TEXT NOT NULL,
    "brokerUserId" TEXT,
    "brokerCompanyId" TEXT,
    "shareToken" TEXT NOT NULL,
    "inputHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "inputJson" JSONB NOT NULL,
    "outputJson" JSONB NOT NULL,
    "borrowerName" TEXT,
    "borrowerEmail" TEXT,
    "borrowerPhone" TEXT,
    "propertyAddress" TEXT,
    "propertyCity" TEXT,
    "propertyState" TEXT,
    "propertyZip" TEXT,
    "pdfS3Url" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "convertedClosingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeeQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeQuoteEvent" (
    "id" TEXT NOT NULL,
    "feeQuoteId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeeQuoteEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrokerCompany_slug_key" ON "BrokerCompany"("slug");

-- CreateIndex
CREATE INDEX "BrokerCompany_verifiedAt_idx" ON "BrokerCompany"("verifiedAt");

-- CreateIndex
CREATE INDEX "BrokerMembership_companyId_idx" ON "BrokerMembership"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "BrokerMembership_userId_companyId_key" ON "BrokerMembership"("userId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "FeeQuote_shareToken_key" ON "FeeQuote"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "FeeQuote_convertedClosingId_key" ON "FeeQuote"("convertedClosingId");

-- CreateIndex
CREATE INDEX "FeeQuote_brokerUserId_idx" ON "FeeQuote"("brokerUserId");

-- CreateIndex
CREATE INDEX "FeeQuote_brokerCompanyId_idx" ON "FeeQuote"("brokerCompanyId");

-- CreateIndex
CREATE INDEX "FeeQuote_status_idx" ON "FeeQuote"("status");

-- CreateIndex
CREATE INDEX "FeeQuote_borrowerEmail_idx" ON "FeeQuote"("borrowerEmail");

-- CreateIndex
CREATE INDEX "FeeQuote_expiresAt_idx" ON "FeeQuote"("expiresAt");

-- CreateIndex
CREATE INDEX "FeeQuoteEvent_feeQuoteId_idx" ON "FeeQuoteEvent"("feeQuoteId");

-- CreateIndex
CREATE INDEX "FeeQuoteEvent_kind_idx" ON "FeeQuoteEvent"("kind");

-- CreateIndex
CREATE INDEX "FeeQuoteEvent_createdAt_idx" ON "FeeQuoteEvent"("createdAt");

-- CreateIndex
CREATE INDEX "User_accountType_idx" ON "User"("accountType");

-- AddForeignKey
ALTER TABLE "BrokerMembership" ADD CONSTRAINT "BrokerMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrokerMembership" ADD CONSTRAINT "BrokerMembership_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "BrokerCompany"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeQuote" ADD CONSTRAINT "FeeQuote_brokerUserId_fkey" FOREIGN KEY ("brokerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeQuote" ADD CONSTRAINT "FeeQuote_brokerCompanyId_fkey" FOREIGN KEY ("brokerCompanyId") REFERENCES "BrokerCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeQuote" ADD CONSTRAINT "FeeQuote_convertedClosingId_fkey" FOREIGN KEY ("convertedClosingId") REFERENCES "Closing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeQuoteEvent" ADD CONSTRAINT "FeeQuoteEvent_feeQuoteId_fkey" FOREIGN KEY ("feeQuoteId") REFERENCES "FeeQuote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
