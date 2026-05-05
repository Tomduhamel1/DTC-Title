-- Add assigned BetterClose escrow officer fields to Closing.
-- Populated when the order is opened; assignment based on order type (TBD).

ALTER TABLE "Closing"
  ADD COLUMN "escrowOfficerName"     TEXT,
  ADD COLUMN "escrowOfficerTitle"    TEXT,
  ADD COLUMN "escrowOfficerEmail"    TEXT,
  ADD COLUMN "escrowOfficerPhone"    TEXT,
  ADD COLUMN "escrowOfficerNmls"     TEXT,
  ADD COLUMN "escrowOfficerPhotoUrl" TEXT;
