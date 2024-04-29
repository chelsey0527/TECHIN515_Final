/*
  Warnings:

  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_pillcaseId_fkey";

-- AlterTable
ALTER TABLE "Pillcase" ADD COLUMN     "scheduleTimes" TIMESTAMP(3)[];

-- DropTable
DROP TABLE "Schedule";

-- CreateTable
CREATE TABLE "IntakeLog" (
    "id" TEXT NOT NULL,
    "pillcaseId" TEXT NOT NULL,
    "intakeTime" TIMESTAMP(3) NOT NULL,
    "isIntaked" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntakeLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IntakeLog" ADD CONSTRAINT "IntakeLog_pillcaseId_fkey" FOREIGN KEY ("pillcaseId") REFERENCES "Pillcase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
