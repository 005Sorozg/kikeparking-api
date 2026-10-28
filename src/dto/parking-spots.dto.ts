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