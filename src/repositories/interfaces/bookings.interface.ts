import { NewBooking, BookingWithDetails, OccupiedSlot } from "../../data/models/booking.model";

export interface IBookingsRepository {
  // Crea la reserva solo si el parqueadero está libre en ese horario.
  // Devuelve undefined si se cruza con otra reserva pagada o con una apartada que aún no vence.
  createBookingIfFree(data: NewBooking): Promise<BookingWithDetails | undefined>;
  getBookingById(id: number): Promise<BookingWithDetails | undefined>;
  getBookingsByDriver(driverId: number): Promise<BookingWithDetails[]>;
  getBookingsByOwner(ownerId: number, parkingSpotId?: number): Promise<BookingWithDetails[]>;
  // refunded: true si ya estaba pagada (se marca la fecha del reembolso)
  cancelBooking(id: number, refunded: boolean): Promise<BookingWithDetails>;
  // Marca como pagada solo si sigue pendiente y no se le acabó el tiempo; si no, undefined
  markAsPaid(id: number, payment: { cardBrand: string; cardLast4: string }): Promise<BookingWithDetails | undefined>;   
  getOccupiedSlots(parkingSpotId: number, from: Date): Promise<OccupiedSlot[]>;
}