-- CreateEnum
CREATE TYPE "CcaProjectType" AS ENUM ('CCA', 'CIA');

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CcaProject" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "clientId" INTEGER NOT NULL,
    "maxResponseDate" TIMESTAMP(3) NOT NULL,
    "maxResponsesCount" INTEGER NOT NULL,
    "code" TEXT,
    "classification" TEXT NOT NULL,
    "sponsor" TEXT NOT NULL,
    "projectManager" TEXT,
    "commentary" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "primaryContactEmail" TEXT NOT NULL,
    "secondaryContactEmail" TEXT,
    "type" "CcaProjectType" NOT NULL,

    CONSTRAINT "CcaProject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CcaProject" ADD CONSTRAINT "CcaProject_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
