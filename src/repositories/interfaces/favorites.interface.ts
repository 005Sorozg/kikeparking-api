import { ParkingSpotWithPhotos } from "../../data/models/parking-spot.model";

export interface IFavoritesRepository {
  // Parqueaderos guardados por el usuario, del más reciente al más antiguo
  getFavoriteSpots(userId: number): Promise<ParkingSpotWithPhotos[]>;
  // Agregar y quitar no fallan si ya estaba (o ya no estaba): el resultado final es el mismo
  addFavorite(userId: number, parkingSpotId: number): Promise<void>;
  removeFavorite(userId: number, parkingSpotId: number): Promise<void>;
}