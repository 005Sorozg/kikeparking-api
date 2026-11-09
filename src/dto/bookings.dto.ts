import { BookingPhase, BookingStatus, VehicleType } from "../data/models/booking.model";

// Datos que el conductor envía para reservar.
// El precio y la hora de salida NO los manda el cliente: los calcula el servidor.
export interface CreateBookingRequestDTO {
  parkingSpotId: number;
  vehicleType: VehicleType;
  // Fecha y hora de entrada en formato ISO 8601 (ej: "2026-11-07T08:00:00-05:00")
  startAt: string;
  // Cantidad de horas reservadas
  hours: number;
}

// Horario ocupado de un parqueadero: solo el rango, sin datos del conductor
export interface OccupiedSlotResponseDTO {
  startAt: string;
  endAt: string;
}

// Lo que la API devuelve de una reserva
export interface BookingResponseDTO {
  id: number;
  vehicleType: VehicleType;
  startAt: string;
  endAt: string;
  hours: number;
  totalPrice: number;
  status: BookingStatus;
  // "upcoming" (próxima), "in_progress" (en curso), "completed" (completada) o "cancelled"
  phase: BookingPhase;
  createdAt: string;
  parkingSpot: {
    id: number;
    title: string;
    neighborhood: string;
    address: string;
    pricePerHour: number;
    photoUrl: string | null;
  };
  driver: {
    id: number;
    name: string;
    // Calificación del conductor (la ve el propietario antes de aceptarlo)
    rating: number;
    reviewCount: number;
  };
  // La reseña que dejó quien consulta en esta reserva, o null si aún no califica
  myReview: { rating: number } | null;
}

