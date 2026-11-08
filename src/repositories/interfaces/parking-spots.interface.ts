import { ParkingSpot, ParkingSpotChanges, ParkingSpotPhoto, ParkingSpotWithPhotos } from "../../data/models/parking-spot.model";
import { ParkingSpotsFilters } from "../../services/interfaces/parking-spots.interface";

export interface IParkingSpotsRepository {
  getParkingSpotsByFilters(filters?: ParkingSpotsFilters): Promise<ParkingSpotWithPhotos[]>;
  getParkingSpotById(id: number): Promise<ParkingSpotWithPhotos | undefined>;
  createParkingSpot(data: Omit<ParkingSpot, "id">): Promise<ParkingSpotWithPhotos>;
  getParkingSpotsByOwner(ownerId: number): Promise<ParkingSpotWithPhotos[]>;
  updateAvailability(id: number, available: boolean): Promise<ParkingSpotWithPhotos>;
  updateParkingSpot(id: number, changes: ParkingSpotChanges): Promise<ParkingSpotWithPhotos>;
  addPhoto(parkingSpotId: number, url: string, publicId: string): Promise<ParkingSpotPhoto>;
  deletePhoto(photoId: number): Promise<void>;
}