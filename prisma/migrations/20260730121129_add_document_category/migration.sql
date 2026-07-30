-- CreateTable
CREATE TABLE "DocumentCategory" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "translations" JSONB NOT NULL,

    CONSTRAINT "DocumentCategory_pkey" PRIMARY KEY ("id")
);

-- AlterTable: add categoryId nullable for now, backfill below
ALTER TABLE "AdminDocument" ADD COLUMN "categoryId" INTEGER;

-- Migrate existing category names into DocumentCategory rows (en = es = old
-- name, editable afterwards) and backfill AdminDocument.categoryId
DO $$
DECLARE
  cat_name TEXT;
  cat_order INTEGER := 0;
  new_id INTEGER;
BEGIN
  FOR cat_name IN
    SELECT unnest(names) FROM "DocumentCategorySettings" WHERE id = 1
  LOOP
    cat_order := cat_order + 1;
    INSERT INTO "DocumentCategory" ("order", "translations")
    VALUES (
      cat_order,
      jsonb_build_object(
        'en', jsonb_build_object('name', cat_name),
        'es', jsonb_build_object('name', cat_name)
      )
    )
    RETURNING id INTO new_id;

    UPDATE "AdminDocument" SET "categoryId" = new_id WHERE "category" = cat_name;
  END LOOP;
END $$;

-- Make categoryId required now that it has been backfilled
ALTER TABLE "AdminDocument" ALTER COLUMN "categoryId" SET NOT NULL;

-- Drop the old string-based category column
ALTER TABLE "AdminDocument" DROP COLUMN "category";

-- Drop the old single-row category-settings table
DROP TABLE "DocumentCategorySettings";

-- Recreate the composite index on the new categoryId column. The old
-- category-based index is already gone at this point: dropping the
-- "category" column above automatically cascades and drops any index
-- that depends on it.
CREATE INDEX "AdminDocument_categoryId_year_idx" ON "AdminDocument"("categoryId", "year");
