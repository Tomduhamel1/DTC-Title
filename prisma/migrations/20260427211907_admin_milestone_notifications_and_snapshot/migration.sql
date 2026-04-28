-- AlterTable
ALTER TABLE "Closing" ADD COLUMN     "closedAt" TIMESTAMP(3),
ADD COLUMN     "snapshotFeeReport" JSONB;

-- AlterTable
ALTER TABLE "Milestone" ADD COLUMN     "notifiedAt" TIMESTAMP(3);
