import {CreateParkingSpotRequestDTO, ParkingSpotResponseDTO, UpdateAvailabilityRequestDTO, UpdateParkingSpotRequestDTO} from "../../dto/parking-spots.dto";


// Opciones de orden permitidas: rating (mayor primero) y price (menor primero)
export const PARKING_SORT_OPTIONS = ["rating", "price"] as const;
export type ParkingSpotsSort = (typeof PARKING_SORT_OPTIONS)[number];

export interface ParkingSpotsFilters {
  search?: string;
  onlyAvailable?: boolean;
  sort?: ParkingSpotsSort;
}

export interface IParkingSpotsService {
  getParkingSpots(filters?: ParkingSpotsFilters): Promise<ParkingSpotResponseDTO[]>;
  getParkingSpotById(id: number): Promise<ParkingSpotResponseDTO>;
  createParkingSpot(data: CreateParkingSpotRequestDTO, ownerId: number): Promise<ParkingSpotResponseDTO>;
  getMyParkingSpots(ownerId: number): Promise<ParkingSpotResponseDTO[]>;
  updateAvailability(id: number, data: UpdateAvailabilityRequestDTO, ownerId: number): Promise<ParkingSpotResponseDTO>;
  updateParkingSpot(id: number, data: UpdateParkingSpotRequestDTO, ownerId: number): Promise<ParkingSpotResponseDTO>;
}