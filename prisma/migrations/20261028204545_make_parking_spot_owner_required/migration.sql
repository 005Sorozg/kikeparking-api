/*
  Warnings:

  - Made the column `ownerId` on table `parking_spots` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "parking_spots" DROP CONSTRAINT "parking_spots_ownerId_fkey";

-- AlterTable
ALTER TABLE "parking_spots" ALTER COLUMN "ownerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "parking_spots" ADD CONSTRAINT "parking_spots_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
