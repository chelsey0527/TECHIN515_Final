/*
  Warnings:

  - You are about to drop the column `pillboxLat` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pillboxLong` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "pillboxLat",
DROP COLUMN "pillboxLong",
ADD COLUMN     "pillboxHumidity" DOUBLE PRECISION,
ADD COLUMN     "pillboxTemperature" DOUBLE PRECISION;
