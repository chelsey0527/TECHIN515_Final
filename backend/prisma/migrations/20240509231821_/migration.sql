/*
  Warnings:

  - You are about to drop the column `date` on the `IntakeLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IntakeLog" DROP COLUMN "date",
ADD COLUMN     "scheduleTime" TEXT;
