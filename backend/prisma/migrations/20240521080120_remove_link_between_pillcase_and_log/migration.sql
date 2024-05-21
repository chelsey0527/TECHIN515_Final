/*
  Warnings:

  - Made the column `caseNo` on table `IntakeLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `doses` on table `IntakeLog` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pillName` on table `IntakeLog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "IntakeLog" DROP CONSTRAINT "IntakeLog_pillcaseId_fkey";

-- AlterTable
ALTER TABLE "IntakeLog" ALTER COLUMN "caseNo" SET NOT NULL,
ALTER COLUMN "doses" SET NOT NULL,
ALTER COLUMN "pillName" SET NOT NULL;
