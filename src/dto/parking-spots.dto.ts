export interface ParkingSpotResponseDTO {
  id: number;
  title: string;
  neighborhood: string;
  address: string;
  pricePerHour: number;
  available: boolean;
  rating: number;
  ownerId: number;
}

// Datos que el cliente envía para crear un parqueadero
export interface CreateParkingSpotRequestDTO {
  title: string;
  neighborhood: string;
  address: string;
  pricePerHour: number;
}

// Datos que el propietario envía para pausar o reactivar su parqueadero
export interface UpdateAvailabilityRequestDTO {
  available: boolean;
}

// Datos que el propietario envía para editar su parqueadero.
// Todos son opcionales: solo se actualiza lo que se envía.
export interface UpdateParkingSpotRequestDTO {
  title?: string;
  neighborhood?: string;
  address?: string;
  pricePerHour?: number;
}