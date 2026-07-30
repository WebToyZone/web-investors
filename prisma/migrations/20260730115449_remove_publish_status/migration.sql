/*
  Warnings:

  - You are about to drop the column `status` on the `AdminDocument` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdminDocument" DROP COLUMN "status";

-- DropEnum
DROP TYPE "PublishStatus";
