import { ParkingSpot } from "../data/models/parking-spot.model";
import { prisma } from "../config/prisma";
import { ParkingSpotsFilters } from "../services/interfaces/parking-spots.interface";
import { IParkingSpotsRepository } from "./interfaces/parking-spots.interface";

export class ParkingSpotsRepository implements IParkingSpotsRepository {
  async getParkingSpotsByFilters(filters?: ParkingSpotsFilters): Promise<ParkingSpot[]> {
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
    });
  }

  async getParkingSpotById(id: number): Promise<ParkingSpot | undefined> {
    const spot = await prisma.parkingSpot.findUnique({ where: { id } });

    return spot ?? undefined;
  }

  async createParkingSpot(data: Omit<ParkingSpot, "id">): Promise<ParkingSpot> {
    return prisma.parkingSpot.create({ data });
  }

  async getParkingSpotsByOwner(ownerId: number): Promise<ParkingSpot[]> {
    return prisma.parkingSpot.findMany({ where: { ownerId } });
  }
}