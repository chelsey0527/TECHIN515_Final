/*
  Warnings:

  - Added the required column `userId` to the `IntakeLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IntakeLog" ADD COLUMN     "userId" TEXT NOT NULL;
