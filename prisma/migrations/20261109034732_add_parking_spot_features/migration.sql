-- AlterTable
ALTER TABLE "parking_spots" ADD COLUMN     "acceptsCars" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "acceptsMotorcycles" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "covered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasCameras" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasEvCharging" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasSecurity" BOOLEAN NOT NULL DEFAULT false;
