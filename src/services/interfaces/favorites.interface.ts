import { ParkingSpotResponseDTO } from "../../dto/parking-spots.dto";

export interface IFavoritesService {
  getFavorites(userId: number): Promise<ParkingSpotResponseDTO[]>;
  addFavorite(userId: number, parkingSpotId: number): Promise<void>;
  removeFavorite(userId: number, parkingSpotId: number): Promise<void>;
}