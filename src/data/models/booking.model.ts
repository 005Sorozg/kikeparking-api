export const VEHICLE_TYPES = ["carro", "moto"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const BOOKING_STATUSES = ["confirmed", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_PHASES = ["upcoming", "in_progress", "completed", "cancelled"] as const;
export type BookingPhase = (typeof BOOKING_PHASES)[number];

export interface Booking {
  id: number;
  vehicleType: VehicleType;
  startAt: Date;
  endAt: Date;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
  parkingSpotId: number;
  driverId: number;
}

// Rango de tiempo ocupado por una reserva (sin datos de quién reservó)
export interface OccupiedSlot {
  startAt: Date;
  endAt: Date;
}

// Reserva con los datos del parqueadero y del conductor, para no tener que pedirlos aparte
export interface BookingWithDetails extends Booking {
  parkingSpot: {
    id: number;
    title: string;
    neighborhood: string;
    address: string;
    pricePerHour: number;
    ownerId: number;
    photos: { url: string }[];
  };
  driver: {
    id: number;
    name: string;
    driverRating: number;
    driverReviewCount: number;
  };
  // Reseñas de esta reserva (como mucho una de cada lado)
  reviews: { authorId: number; rating: number }[];
}