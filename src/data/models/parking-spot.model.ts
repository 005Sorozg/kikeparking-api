export interface ParkingSpot {
  id: number;
  title: string;
  neighborhood: string;
  address: string;
  pricePerHour: number;
  available: boolean;
  rating: number;
  ownerId: number;
}

export interface ParkingSpotPhoto {
  id: number;
  url: string;
  // Identificador de la imagen en Cloudinary
  publicId: string;
  parkingSpotId: number;
}

// Parqueadero tal como lo devuelve el repositorio: junto con sus fotos
export interface ParkingSpotWithPhotos extends ParkingSpot {
  photos: ParkingSpotPhoto[];
}

// Campos que el propietario puede modificar de su parqueadero
export type ParkingSpotChanges = Partial<
  Pick<ParkingSpot, "title" | "neighborhood" | "address" | "pricePerHour">
>;