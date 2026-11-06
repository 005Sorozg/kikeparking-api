import { BookingResponseDTO, CreateBookingRequestDTO, OccupiedSlotResponseDTO } from "../../dto/bookings.dto";

export interface IBookingsService {
  createBooking(data: CreateBookingRequestDTO, driverId: number): Promise<BookingResponseDTO>;
  getMyBookings(driverId: number): Promise<BookingResponseDTO[]>;
  getReceivedBookings(ownerId: number, parkingSpotId?: number): Promise<BookingResponseDTO[]>;
  getOccupiedSlots(parkingSpotId: number): Promise<OccupiedSlotResponseDTO[]>;
  cancelBooking(id: number, userId: number): Promise<BookingResponseDTO>;
}