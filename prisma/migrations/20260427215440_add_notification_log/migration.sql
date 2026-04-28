-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "closingId" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'email',
    "kind" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "providerMessageId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NotificationLog_userId_idx" ON "NotificationLog"("userId");

-- CreateIndex
CREATE INDEX "NotificationLog_closingId_idx" ON "NotificationLog"("closingId");

-- CreateIndex
CREATE INDEX "NotificationLog_kind_idx" ON "NotificationLog"("kind");

-- CreateIndex
CREATE INDEX "NotificationLog_createdAt_idx" ON "NotificationLog"("createdAt");

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_closingId_fkey" FOREIGN KEY ("closingId") REFERENCES "Closing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
