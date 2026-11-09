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

// Datos de la tarjeta para pagar una reserva (pago simulado: nada se guarda completo)
export interface PayBookingRequestDTO {
  // Se aceptan espacios o guiones: "4242 4242 4242 4242"
  cardNumber: string;
  // "MM/AA", ej: "08/28"
  expiry: string;
  cvc: string;
  holderName: string;
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
  // "pending_payment" (falta pagar), "expired" (no pagó a tiempo), "upcoming" (próxima),
  // "in_progress" (en curso), "completed" (completada) o "cancelled"
  phase: BookingPhase;
  // Hasta cuándo puede pagar (solo mientras está pendiente de pago)
  paymentDeadline: string | null;
  // Con qué se pagó, o null si aún no se ha pagado
  payment: { brand: string; last4: string; paidAt: string } | null;
  // true si se canceló después de pagar y se devolvió el dinero
  refunded: boolean;
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

