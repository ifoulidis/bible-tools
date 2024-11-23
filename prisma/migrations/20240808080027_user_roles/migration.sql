-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'Staff');

-- CreateTable
CREATE TABLE "UserRoles" (
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("userId")
);
