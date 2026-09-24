ALTER TABLE "Closing"
  ADD COLUMN "borrowerEmailsEnabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "borrowerEmailPermissionRecipient" TEXT,
  ADD COLUMN "borrowerEmailPermissionBy" TEXT,
  ADD COLUMN "borrowerEmailPermissionSource" TEXT,
  ADD COLUMN "borrowerEmailPermissionAt" TIMESTAMP(3),
  ADD COLUMN "borrowerEmailPermissionVersion" TEXT;
ALTER TABLE "Milestone" ADD COLUMN "deliveryPreparedAt" TIMESTAMP(3);
ALTER TABLE "TeammateClosing" ADD COLUMN "mayManageBorrowerEmails" BOOLEAN NOT NULL DEFAULT false;
-- No historical opt-in or email replay. Existing rows remain disabled.
ALTER TABLE "IngestDelivery" DROP CONSTRAINT "IngestDelivery_kind_check";
ALTER TABLE "IngestDelivery" ADD CONSTRAINT "IngestDelivery_kind_check" CHECK (
  "kind" IN ('welcome', 'teammate_invite') OR
  "kind" ~ '^milestone:(loan_locked|title_ordered|title_search|title_issued|closed):(borrower|pro)$'
);
ALTER TABLE "IngestDelivery" DROP CONSTRAINT "IngestDelivery_status_check";
ALTER TABLE "IngestDelivery" ADD CONSTRAINT "IngestDelivery_status_check"
  CHECK ("status" IN ('pending', 'sending', 'sent', 'cancelled'));
