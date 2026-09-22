-- Garden's own file/order number: the reconciliation key between Garden and
-- BetterClose. Nullable; unique when present.
ALTER TABLE "Closing" ADD COLUMN "gardenFileNumber" TEXT;
CREATE UNIQUE INDEX "Closing_gardenFileNumber_key" ON "Closing"("gardenFileNumber");
