-- AlterTable
ALTER TABLE "parking_spots" ADD COLUMN     "ownerId" INTEGER;

-- AddForeignKey
ALTER TABLE "parking_spots" ADD CONSTRAINT "parking_spots_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
