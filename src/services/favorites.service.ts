import { ParkingSpotWithPhotos } from "../data/models/parking-spot.model";
import { ParkingSpotResponseDTO } from "../dto/parking-spots.dto";
import { AppException } from "../exceptions/app.exception";
import { AppErrors } from "../exceptions/errors/app.error";
import { IFavoritesRepository } from "../repositories/interfaces/favorites.interface";
import { IParkingSpotsRepository } from "../repositories/interfaces/parking-spots.interface";
import { IFavoritesService } from "./interfaces/favorites.interface";

export class FavoritesService implements IFavoritesService {
  constructor(
    readonly favoritesRepository: IFavoritesRepository,
    readonly parkingSpotsRepository: IParkingSpotsRepository,
  ) {}

  async getFavorites(userId: number): Promise<ParkingSpotResponseDTO[]> {
    const spots = await this.favoritesRepository.getFavoriteSpots(userId);

    return spots.map((spot) => this.toResponseDTO(spot));
  }

  async addFavorite(userId: number, parkingSpotId: number): Promise<void> {
    this.validateId(parkingSpotId);

    const spot = await this.parkingSpotsRepository.getParkingSpotById(parkingSpotId);

    if (!spot) {
      const error = AppErrors.PARKING_NOT_FOUND;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    await this.favoritesRepository.addFavorite(userId, parkingSpotId);
  }

  async removeFavorite(userId: number, parkingSpotId: number): Promise<void> {
    this.validateId(parkingSpotId);

    await this.favoritesRepository.removeFavorite(userId, parkingSpotId);
  }

  private validateId(parkingSpotId: number): void {
    if (!Number.isInteger(parkingSpotId) || parkingSpotId <= 0) {
      const error = AppErrors.PARKING_INVALID_ID;

      throw new AppException(error.code, error.message, error.statusCode);
    }
  }

  // Mismo formato que devuelve /parking-spots, para que la app lo trate igual
  private toResponseDTO(spot: ParkingSpotWithPhotos): ParkingSpotResponseDTO {
    return {
      id: spot.id,
      title: spot.title,
      neighborhood: spot.neighborhood,
      address: spot.address,
      pricePerHour: spot.pricePerHour,
      available: spot.available,
      rating: spot.rating,
      ownerId: spot.ownerId,
      photos: spot.photos.map((photo) => ({ id: photo.id, url: photo.url })),
    };
  }
}