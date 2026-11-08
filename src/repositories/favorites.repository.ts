import { ParkingSpotWithPhotos } from "../data/models/parking-spot.model";
import { prisma } from "../config/prisma";
import { IFavoritesRepository } from "./interfaces/favorites.interface";

export class FavoritesRepository implements IFavoritesRepository {
  async getFavoriteSpots(userId: number): Promise<ParkingSpotWithPhotos[]> {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      // Se trae cada parqueadero con sus fotos, igual que en el resto de la API
      include: { parkingSpot: { include: { photos: { orderBy: { id: "asc" } } } } },
    });

    return favorites.map((favorite) => favorite.parkingSpot);
  }

  async addFavorite(userId: number, parkingSpotId: number): Promise<void> {
    // upsert: si ya era favorito no hace nada, en vez de fallar por la llave repetida
    await prisma.favorite.upsert({
      where: { userId_parkingSpotId: { userId, parkingSpotId } },
      create: { userId, parkingSpotId },
      update: {},
    });
  }

  async removeFavorite(userId: number, parkingSpotId: number): Promise<void> {
    // deleteMany no falla si el favorito no existía
    await prisma.favorite.deleteMany({ where: { userId, parkingSpotId } });
  }
}