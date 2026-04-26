-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "homeValue" DOUBLE PRECISION,
    "mortgageBalance" DOUBLE PRECISION,
    "currentRate" DOUBLE PRECISION,
    "creditScore" TEXT,
    "propertyType" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "intakeJson" JSONB,
    "completionPercentage" INTEGER DEFAULT 0,
    "resumeToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "homeValue" DOUBLE PRECISION NOT NULL,
    "mortgageBalance" DOUBLE PRECISION NOT NULL,
    "currentRate" DOUBLE PRECISION NOT NULL,
    "newRate" DOUBLE PRECISION NOT NULL,
    "creditScore" TEXT NOT NULL,
    "loanTerm" INTEGER NOT NULL DEFAULT 360,
    "currentMonthlyPayment" DOUBLE PRECISION NOT NULL,
    "newMonthlyPayment" DOUBLE PRECISION NOT NULL,
    "monthlySavings" DOUBLE PRECISION NOT NULL,
    "totalInterestCurrent" DOUBLE PRECISION NOT NULL,
    "totalInterestNew" DOUBLE PRECISION NOT NULL,
    "lifetimeSavings" DOUBLE PRECISION NOT NULL,
    "closingCosts" DOUBLE PRECISION,
    "breakEvenMonths" INTEGER,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "s3Url" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MortgageScenario" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "lenderName" TEXT,
    "loanAmount" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "term" INTEGER NOT NULL,
    "points" DOUBLE PRECISION,
    "lenderFees" DOUBLE PRECISION,
    "propertyTaxes" DOUBLE PRECISION,
    "homeInsurance" DOUBLE PRECISION,
    "hoaFees" DOUBLE PRECISION,
    "pmi" DOUBLE PRECISION,
    "principalInterest" DOUBLE PRECISION NOT NULL,
    "totalMonthly" DOUBLE PRECISION NOT NULL,
    "totalUpfront" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MortgageScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MortgageReferral" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "partnerId" TEXT,
    "creditBand" TEXT NOT NULL,
    "occupancy" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "downPaymentPct" DOUBLE PRECISION NOT NULL,
    "termPreference" TEXT NOT NULL,
    "contactPreference" TEXT NOT NULL,
    "requestedLoanAmount" DOUBLE PRECISION,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "partnerResponse" JSONB,
    "partnerContactedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MortgageReferral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "specialties" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityEvent" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Closing" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "propertyAddress" TEXT,
    "propertyCity" TEXT,
    "propertyState" TEXT,
    "propertyZip" TEXT,
    "propertyAddressKey" TEXT,
    "propertyType" TEXT,
    "salePrice" DOUBLE PRECISION,
    "loanAmount" DOUBLE PRECISION,
    "closingDate" TIMESTAMP(3),
    "borrowerEmail" TEXT,
    "borrowerPhone" TEXT,
    "lenderName" TEXT,
    "lenderCompany" TEXT,
    "lenderEmail" TEXT,
    "lenderPhone" TEXT,
    "lenderNmls" TEXT,
    "agentName" TEXT,
    "agentCompany" TEXT,
    "agentEmail" TEXT,
    "agentPhone" TEXT,
    "titleUnderwriter" TEXT,
    "titlePolicyNo" TEXT,
    "closingLocation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Closing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "closingId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LenderRequest" (
    "id" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "lenderEmail" TEXT,
    "lenderFirstName" TEXT,
    "lenderCompany" TEXT,
    "clientName" TEXT,
    "clientEmail" TEXT,
    "note" TEXT,
    "savingsEstimate" DOUBLE PRECISION,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LenderRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_resumeToken_key" ON "Lead"("resumeToken");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_resumeToken_idx" ON "Lead"("resumeToken");

-- CreateIndex
CREATE INDEX "Quote_leadId_idx" ON "Quote"("leadId");

-- CreateIndex
CREATE INDEX "Quote_createdAt_idx" ON "Quote"("createdAt");

-- CreateIndex
CREATE INDEX "Document_leadId_idx" ON "Document"("leadId");

-- CreateIndex
CREATE INDEX "Document_type_idx" ON "Document"("type");

-- CreateIndex
CREATE INDEX "Document_createdAt_idx" ON "Document"("createdAt");

-- CreateIndex
CREATE INDEX "MortgageScenario_leadId_idx" ON "MortgageScenario"("leadId");

-- CreateIndex
CREATE INDEX "MortgageScenario_source_idx" ON "MortgageScenario"("source");

-- CreateIndex
CREATE INDEX "MortgageScenario_createdAt_idx" ON "MortgageScenario"("createdAt");

-- CreateIndex
CREATE INDEX "MortgageReferral_leadId_idx" ON "MortgageReferral"("leadId");

-- CreateIndex
CREATE INDEX "MortgageReferral_partnerId_idx" ON "MortgageReferral"("partnerId");

-- CreateIndex
CREATE INDEX "MortgageReferral_status_idx" ON "MortgageReferral"("status");

-- CreateIndex
CREATE INDEX "MortgageReferral_createdAt_idx" ON "MortgageReferral"("createdAt");

-- CreateIndex
CREATE INDEX "Partner_isActive_idx" ON "Partner"("isActive");

-- CreateIndex
CREATE INDEX "Partner_priority_idx" ON "Partner"("priority");

-- CreateIndex
CREATE INDEX "ActivityEvent_leadId_idx" ON "ActivityEvent"("leadId");

-- CreateIndex
CREATE INDEX "ActivityEvent_type_idx" ON "ActivityEvent"("type");

-- CreateIndex
CREATE INDEX "ActivityEvent_createdAt_idx" ON "ActivityEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Closing_userId_idx" ON "Closing"("userId");

-- CreateIndex
CREATE INDEX "Closing_propertyAddressKey_idx" ON "Closing"("propertyAddressKey");

-- CreateIndex
CREATE INDEX "Closing_borrowerPhone_idx" ON "Closing"("borrowerPhone");

-- CreateIndex
CREATE INDEX "Closing_borrowerEmail_idx" ON "Closing"("borrowerEmail");

-- CreateIndex
CREATE INDEX "Closing_status_idx" ON "Closing"("status");

-- CreateIndex
CREATE INDEX "Milestone_closingId_idx" ON "Milestone"("closingId");

-- CreateIndex
CREATE UNIQUE INDEX "Milestone_closingId_kind_key" ON "Milestone"("closingId", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "LenderRequest_refId_key" ON "LenderRequest"("refId");

-- CreateIndex
CREATE INDEX "LenderRequest_refId_idx" ON "LenderRequest"("refId");

-- CreateIndex
CREATE INDEX "LenderRequest_createdAt_idx" ON "LenderRequest"("createdAt");

-- CreateIndex
CREATE INDEX "LenderRequest_channel_idx" ON "LenderRequest"("channel");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MortgageScenario" ADD CONSTRAINT "MortgageScenario_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MortgageReferral" ADD CONSTRAINT "MortgageReferral_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MortgageReferral" ADD CONSTRAINT "MortgageReferral_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityEvent" ADD CONSTRAINT "ActivityEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Closing" ADD CONSTRAINT "Closing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_closingId_fkey" FOREIGN KEY ("closingId") REFERENCES "Closing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
