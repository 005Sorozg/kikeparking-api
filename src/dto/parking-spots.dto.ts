import { ParkingFeatures } from "../data/models/parking-spot.model";

// Foto de un parqueadero: solo lo que necesita la app
export interface ParkingSpotPhotoDTO {
  id: number;
  url: string;
}

export interface ParkingSpotResponseDTO extends ParkingFeatures {
  id: number;
  title: string;
  neighborhood: string;
  address: string;
  pricePerHour: number;
  available: boolean;
  // Ubicación en el mapa (null si todavía no la tiene)
  latitude: number | null;
  longitude: number | null;
  // Solo en /nearby: a cuántos kilómetros está del punto consultado
  distanceKm?: number;
  rating: number;
  // Cantidad de reseñas (0 = parqueadero nuevo, sin calificar)
  reviewCount: number;
  ownerId: number;
  photos: ParkingSpotPhotoDTO[];
}

// Las características son opcionales: si no se envían, acepta carros y motos y lo demás queda en false
export interface CreateParkingSpotRequestDTO extends Partial<ParkingFeatures> {
  title: string;
  neighborhood: string;
  address: string;
  pricePerHour: number;
  // Opcionales, pero van juntas: si llega una, debe llegar la otra
  latitude?: number;
  longitude?: number;
}

// Datos que el propietario envía para pausar o reactivar su parqueadero
export interface UpdateAvailabilityRequestDTO {
  available: boolean;
}

// Datos que el propietario envía para editar su parqueadero.
// Todos son opcionales: solo se actualiza lo que se envía.
export interface UpdateParkingSpotRequestDTO extends Partial<ParkingFeatures> {
  title?: string;
  neighborhood?: string;
  address?: string;
  pricePerHour?: number;
  latitude?: number;
  longitude?: number;
}