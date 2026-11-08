-- CreateTable
CREATE TABLE "parking_spot_photos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parkingSpotId" INTEGER NOT NULL,

    CONSTRAINT "parking_spot_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parking_spot_photos_publicId_key" ON "parking_spot_photos"("publicId");

-- CreateIndex
CREATE INDEX "parking_spot_photos_parkingSpotId_idx" ON "parking_spot_photos"("parkingSpotId");

-- AddForeignKey
ALTER TABLE "parking_spot_photos" ADD CONSTRAINT "parking_spot_photos_parkingSpotId_fkey" FOREIGN KEY ("parkingSpotId") REFERENCES "parking_spots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
