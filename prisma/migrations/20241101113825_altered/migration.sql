/*
  Warnings:

  - Added the required column `areaRuled` to the `Character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "areaRuled" TEXT NOT NULL;
