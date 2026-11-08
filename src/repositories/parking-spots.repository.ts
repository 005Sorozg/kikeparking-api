import { ParkingSpot, ParkingSpotChanges, ParkingSpotPhoto, ParkingSpotWithPhotos } from "../data/models/parking-spot.model";
import { prisma } from "../config/prisma";
import { ParkingSpotsFilters } from "../services/interfaces/parking-spots.interface";
import { IParkingSpotsRepository } from "./interfaces/parking-spots.interface";

// Todas las consultas traen también las fotos del parqueadero, de la más antigua a la más nueva
const withPhotos = { photos: { orderBy: { id: "asc" as const } } };

export class ParkingSpotsRepository implements IParkingSpotsRepository {
  async getParkingSpotsByFilters(filters?: ParkingSpotsFilters): Promise<ParkingSpotWithPhotos[]> {
    return prisma.parkingSpot.findMany({
      where: {
        // El texto se busca en el barrio o en el título, sin distinguir mayúsculas
        ...(filters?.search && {
          OR: [
            { title: { contains: filters.search, mode: "insensitive" } },
            { neighborhood: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
        ...(filters?.onlyAvailable && { available: true }),
      },
      orderBy:
        filters?.sort === "rating"
          ? { rating: "desc" }
          : filters?.sort === "price"
            ? { pricePerHour: "asc" }
            : undefined,
      include: withPhotos,
    });
  }

  async getParkingSpotById(id: number): Promise<ParkingSpotWithPhotos | undefined> {
    const spot = await prisma.parkingSpot.findUnique({ where: { id }, include: withPhotos });

    return spot ?? undefined;
  }

  async createParkingSpot(data: Omit<ParkingSpot, "id">): Promise<ParkingSpotWithPhotos> {
    return prisma.parkingSpot.create({ data, include: withPhotos });
  }

  async getParkingSpotsByOwner(ownerId: number): Promise<ParkingSpotWithPhotos[]> {
    return prisma.parkingSpot.findMany({ where: { ownerId }, include: withPhotos });
  }

  async updateAvailability(id: number, available: boolean): Promise<ParkingSpotWithPhotos> {
    return prisma.parkingSpot.update({ where: { id }, data: { available }, include: withPhotos });
  }

  async updateParkingSpot(id: number, changes: ParkingSpotChanges): Promise<ParkingSpotWithPhotos> {
    return prisma.parkingSpot.update({ where: { id }, data: changes, include: withPhotos });
  }

  async addPhoto(parkingSpotId: number, url: string, publicId: string): Promise<ParkingSpotPhoto> {
    return prisma.parkingSpotPhoto.create({ data: { parkingSpotId, url, publicId } });
  }

  async deletePhoto(photoId: number): Promise<void> {
    await prisma.parkingSpotPhoto.delete({ where: { id: photoId } });
  }
}