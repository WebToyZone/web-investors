-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('draft', 'published', 'scheduled');

-- CreateTable
CREATE TABLE "DocumentCategorySettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "names" TEXT[],

    CONSTRAINT "DocumentCategorySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminDocument" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "status" "PublishStatus" NOT NULL,
    "date" TEXT NOT NULL,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "files" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KpiStat" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "translations" JSONB NOT NULL,

    CONSTRAINT "KpiStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformLocation" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT NOT NULL,
    "translations" JSONB NOT NULL,

    CONSTRAINT "PlatformLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardMember" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "translations" JSONB NOT NULL,

    CONSTRAINT "BoardMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingBoardSeat" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "translations" JSONB NOT NULL,

    CONSTRAINT "PendingBoardSeat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthRevenue" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "year" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "GrowthRevenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthMilestone" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "translations" JSONB NOT NULL,

    CONSTRAINT "GrowthMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,

    CONSTRAINT "ContactSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminVideo" (
    "slot" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "size" TEXT NOT NULL,

    CONSTRAINT "AdminVideo_pkey" PRIMARY KEY ("slot")
);

-- CreateIndex
CREATE INDEX "AdminDocument_category_year_idx" ON "AdminDocument"("category", "year");

-- CreateIndex
CREATE UNIQUE INDEX "GrowthRevenue_year_key" ON "GrowthRevenue"("year");
