export const VEHICLE_TYPES = ["carro", "moto"] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const BOOKING_STATUSES = ["pending_payment", "confirmed", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_PHASES = [
  "pending_payment",
  "expired",
  "upcoming",
  "in_progress",
  "completed",
  "cancelled",
] as const;
export type BookingPhase = (typeof BOOKING_PHASES)[number];

export interface Booking {
  id: number;
  vehicleType: VehicleType;
  startAt: Date;
  endAt: Date;
  totalPrice: number;
  status: BookingStatus;
  paymentDeadline: Date | null;
  paidAt: Date | null;
  cardBrand: string | null;
  cardLast4: string | null;
  refundedAt: Date | null;
  createdAt: Date;
  parkingSpotId: number;
  driverId: number;
}

// Lo que se necesita para crear una reserva (el estado y el pago los pone la base de datos)
export type NewBooking = Pick<
  Booking,
  "vehicleType" | "startAt" | "endAt" | "totalPrice" | "paymentDeadline" | "parkingSpotId" | "driverId"
>;

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