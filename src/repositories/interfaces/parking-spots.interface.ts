import { ParkingSpot, ParkingSpotChanges } from "../../data/models/parking-spot.model";
import { ParkingSpotsFilters } from "../../services/interfaces/parking-spots.interface";

export interface IParkingSpotsRepository {
  getParkingSpotsByFilters(filters?: ParkingSpotsFilters): Promise<ParkingSpot[]>;
  getParkingSpotById(id: number): Promise<ParkingSpot | undefined>;
  createParkingSpot(data: Omit<ParkingSpot, "id">): Promise<ParkingSpot>;
  getParkingSpotsByOwner(ownerId: number): Promise<ParkingSpot[]>;
  updateAvailability(id: number, available: boolean): Promise<ParkingSpot>;
  updateParkingSpot(id: number, changes: ParkingSpotChanges): Promise<ParkingSpot>;
}