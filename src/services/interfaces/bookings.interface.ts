import {
  BookingResponseDTO,
  CreateBookingRequestDTO,
  OccupiedSlotResponseDTO,
  PayBookingRequestDTO,
} from "../../dto/bookings.dto";

export interface IBookingsService {
  createBooking(data: CreateBookingRequestDTO, driverId: number): Promise<BookingResponseDTO>;
  getMyBookings(driverId: number): Promise<BookingResponseDTO[]>;
  getReceivedBookings(ownerId: number, parkingSpotId?: number): Promise<BookingResponseDTO[]>;
  getOccupiedSlots(parkingSpotId: number): Promise<OccupiedSlotResponseDTO[]>;
  cancelBooking(id: number, userId: number): Promise<BookingResponseDTO>;
  payBooking(id: number, data: PayBookingRequestDTO, driverId: number): Promise<BookingResponseDTO>;
}