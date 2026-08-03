-- AlterTable
ALTER TABLE "ContactSettings" ADD COLUMN     "translations" JSONB;

-- Seed both languages from the columns this supersedes, so neither locale
-- renders an empty address before the first save from the admin. Spanish
-- starts as a copy of English and is corrected there ("SPAIN." -> "ESPAÑA.").
UPDATE "ContactSettings"
SET "translations" = jsonb_build_object(
  'en', jsonb_build_object(
    'addressLine1', "addressLine1",
    'addressLine2', "addressLine2"
  ),
  'es', jsonb_build_object(
    'addressLine1', "addressLine1",
    'addressLine2', "addressLine2"
  )
)
WHERE "translations" IS NULL;
