-- AlterTable
ALTER TABLE "LenderRequest" ADD COLUMN     "closingId" TEXT,
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "LenderRequest_userId_idx" ON "LenderRequest"("userId");

-- CreateIndex
CREATE INDEX "LenderRequest_closingId_idx" ON "LenderRequest"("closingId");

-- AddForeignKey
ALTER TABLE "LenderRequest" ADD CONSTRAINT "LenderRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LenderRequest" ADD CONSTRAINT "LenderRequest_closingId_fkey" FOREIGN KEY ("closingId") REFERENCES "Closing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
