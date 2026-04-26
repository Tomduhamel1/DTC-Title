-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "homeValue" REAL,
    "mortgageBalance" REAL,
    "currentRate" REAL,
    "creditScore" TEXT,
    "propertyType" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "intakeString" TEXT,
    "completionPercentage" INTEGER DEFAULT 0,
    "resumeToken" TEXT,
    "tokenExpiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "homeValue" REAL NOT NULL,
    "mortgageBalance" REAL NOT NULL,
    "currentRate" REAL NOT NULL,
    "newRate" REAL NOT NULL,
    "creditScore" TEXT NOT NULL,
    "loanTerm" INTEGER NOT NULL DEFAULT 360,
    "currentMonthlyPayment" REAL NOT NULL,
    "newMonthlyPayment" REAL NOT NULL,
    "monthlySavings" REAL NOT NULL,
    "totalInterestCurrent" REAL NOT NULL,
    "totalInterestNew" REAL NOT NULL,
    "lifetimeSavings" REAL NOT NULL,
    "closingCosts" REAL,
    "breakEvenMonths" INTEGER,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" DATETIME,
    "pdfUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Quote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "s3Url" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MortgageScenario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "lenderName" TEXT,
    "loanAmount" REAL NOT NULL,
    "interestRate" REAL NOT NULL,
    "term" INTEGER NOT NULL,
    "points" REAL,
    "lenderFees" REAL,
    "propertyTaxes" REAL,
    "homeInsurance" REAL,
    "hoaFees" REAL,
    "pmi" REAL,
    "principalInterest" REAL NOT NULL,
    "totalMonthly" REAL NOT NULL,
    "totalUpfront" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MortgageScenario_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MortgageReferral" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "partnerId" TEXT,
    "creditBand" TEXT NOT NULL,
    "occupancy" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "downPaymentPct" REAL NOT NULL,
    "termPreference" TEXT NOT NULL,
    "contactPreference" TEXT NOT NULL,
    "requestedLoanAmount" REAL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "partnerResponse" TEXT,
    "partnerContactedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MortgageReferral_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MortgageReferral_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "specialties" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ActivityEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Closing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "propertyAddress" TEXT,
    "propertyCity" TEXT,
    "propertyState" TEXT,
    "propertyZip" TEXT,
    "propertyAddressKey" TEXT,
    "propertyType" TEXT,
    "salePrice" REAL,
    "loanAmount" REAL,
    "closingDate" DATETIME,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Closing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "closingId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "completedAt" DATETIME,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Milestone_closingId_fkey" FOREIGN KEY ("closingId") REFERENCES "Closing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
