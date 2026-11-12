import { CreateParkingSpotRequestDTO, ParkingSpotDetailResponseDTO, ParkingSpotResponseDTO, UpdateAvailabilityRequestDTO, UpdateParkingSpotRequestDTO } from "../../dto/parking-spots.dto";
import { UploadedFileData } from "./image-storage.interface";

// Opciones de orden permitidas: rating (mayor primero) y price (menor primero)
export const PARKING_SORT_OPTIONS = ["rating", "price"] as const;
export type ParkingSpotsSort = (typeof PARKING_SORT_OPTIONS)[number];

export interface ParkingSpotsFilters {
  search?: string;
  onlyAvailable?: boolean;
  sort?: ParkingSpotsSort;
  // Solo parqueaderos que acepten este vehículo
  vehicle?: "carro" | "moto";
  // Cada uno en true deja solo los que tienen esa característica
  covered?: boolean;
  hasSecurity?: boolean;
  hasCameras?: boolean;
  hasEvCharging?: boolean;
  // Solo los que estén dentro de este rectángulo del mapa (lo que se ve en pantalla)
  area?: MapArea;
}

export interface MapArea {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface IParkingSpotsService {
  getParkingSpots(filters?: ParkingSpotsFilters): Promise<ParkingSpotResponseDTO[]>;
  getNearbyParkingSpots(lat: number, lng: number, limit: number): Promise<ParkingSpotResponseDTO[]>;
  getParkingSpotById(id: number): Promise<ParkingSpotDetailResponseDTO>;
  createParkingSpot(data: CreateParkingSpotRequestDTO, ownerId: number): Promise<ParkingSpotResponseDTO>;
  getMyParkingSpots(ownerId: number): Promise<ParkingSpotResponseDTO[]>;
  updateAvailability(id: number, data: UpdateAvailabilityRequestDTO, ownerId: number): Promise<ParkingSpotResponseDTO>;
  updateParkingSpot(id: number, data: UpdateParkingSpotRequestDTO, ownerId: number): Promise<ParkingSpotResponseDTO>;
  addPhoto(id: number, file: UploadedFileData | undefined, ownerId: number): Promise<ParkingSpotResponseDTO>;
  removePhoto(id: number, photoId: number, ownerId: number): Promise<ParkingSpotResponseDTO>;
}