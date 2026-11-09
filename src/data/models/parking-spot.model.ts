// Características que el propietario marca en su parqueadero
export const PARKING_FEATURES = [
  "acceptsCars",
  "acceptsMotorcycles",
  "covered",
  "hasSecurity",
  "hasCameras",
  "hasEvCharging",
] as const;
export type ParkingFeature = (typeof PARKING_FEATURES)[number];
export type ParkingFeatures = Record<ParkingFeature, boolean>;

export interface ParkingSpot extends ParkingFeatures {
  id: number;
  title: string;
  neighborhood: string;
  address: string;
  pricePerHour: number;
  available: boolean;
  // null si el propietario todavía no marcó la ubicación en el mapa
  latitude: number | null;
  longitude: number | null;
  rating: number;
  reviewCount: number;
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
  Pick<
    ParkingSpot,
    "title" | "neighborhood" | "address" | "pricePerHour" | "latitude" | "longitude" | ParkingFeature
  >
>;