/*
  Warnings:

  - You are about to drop the `CcaProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CcaProject" DROP CONSTRAINT "CcaProject_clientId_fkey";

-- DropTable
DROP TABLE "CcaProject";

-- DropTable
DROP TABLE "Client";

-- DropEnum
DROP TYPE "CcaProjectType";

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "ttlockId" TEXT NOT NULL,
    "pmsId" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);
