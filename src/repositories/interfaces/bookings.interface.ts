import { Booking, BookingWithDetails, OccupiedSlot } from "../../data/models/booking.model";

export interface IBookingsRepository {
  // Crea la reserva solo si el parqueadero está libre en ese horario.
  // Devuelve undefined si se cruza con otra reserva confirmada.
  createBookingIfFree(data: Omit<Booking, "id" | "createdAt" | "status">): Promise<BookingWithDetails | undefined>;
  getBookingById(id: number): Promise<BookingWithDetails | undefined>;
  getBookingsByDriver(driverId: number): Promise<BookingWithDetails[]>;
  getBookingsByOwner(ownerId: number, parkingSpotId?: number): Promise<BookingWithDetails[]>;
  cancelBooking(id: number): Promise<BookingWithDetails>;   
  getOccupiedSlots(parkingSpotId: number, from: Date): Promise<OccupiedSlot[]>;
}