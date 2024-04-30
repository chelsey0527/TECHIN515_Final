/*
  Warnings:

  - Added the required column `caseNo` to the `Pillcase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pillcase" ADD COLUMN     "caseNo" INTEGER NOT NULL;
