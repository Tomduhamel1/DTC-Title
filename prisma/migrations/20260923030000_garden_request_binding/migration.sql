-- Additive only: existing records stay unbound until a verified ingest.
ALTER TABLE "Closing"
  ADD COLUMN "gardenOrderId" UUID,
  ADD COLUMN "gardenLinkedAt" TIMESTAMP(3),
  ADD COLUMN "gardenLinkSource" TEXT;
CREATE UNIQUE INDEX "Closing_gardenOrderId_key" ON "Closing"("gardenOrderId");
ALTER TABLE "Closing" ADD CONSTRAINT "Closing_garden_binding_complete" CHECK (
  ("gardenOrderId" IS NULL AND "gardenLinkedAt" IS NULL AND "gardenLinkSource" IS NULL)
  OR ("gardenOrderId" IS NOT NULL AND "gardenLinkedAt" IS NOT NULL
      AND "gardenLinkSource" IS NOT NULL
      AND "gardenLinkSource" IN ('explicit_request', 'garden_first', 'legacy_file_number')
      AND "gardenFileNumber" IS NOT NULL)
);
-- Protect the identity even if an unrelated admin/API writer races ingest.
CREATE FUNCTION protect_garden_closing_binding() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD."gardenOrderId" IS NOT NULL AND (
    NEW."gardenOrderId" IS DISTINCT FROM OLD."gardenOrderId"
    OR NEW."gardenFileNumber" IS DISTINCT FROM OLD."gardenFileNumber"
    OR NEW."gardenLinkedAt" IS DISTINCT FROM OLD."gardenLinkedAt"
    OR NEW."gardenLinkSource" IS DISTINCT FROM OLD."gardenLinkSource"
  ) THEN
    RAISE EXCEPTION 'Garden binding cannot be reassigned' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER closing_protect_garden_binding BEFORE UPDATE ON "Closing"
FOR EACH ROW EXECUTE FUNCTION protect_garden_closing_binding();
