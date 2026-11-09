import { BookingWithDetails, VEHICLE_TYPES, BookingPhase } from "../data/models/booking.model";
import { BookingResponseDTO, CreateBookingRequestDTO, OccupiedSlotResponseDTO } from "../dto/bookings.dto";
import { AppException } from "../exceptions/app.exception";
import { AppErrors } from "../exceptions/errors/app.error";
import { IBookingsRepository } from "../repositories/interfaces/bookings.interface";
import { IParkingSpotsRepository } from "../repositories/interfaces/parking-spots.interface";
import { IBookingsService } from "./interfaces/bookings.interface";

const HOUR_MS = 60 * 60 * 1000;

// Máximo 30 días seguidos en una sola reserva
const MAX_HOURS = 24 * 30;

// Margen para que una reserva "para ya" no falle por unos minutos de diferencia de reloj
const START_TOLERANCE_MS = 15 * 60 * 1000;

export class BookingsService implements IBookingsService {
  constructor(
    readonly bookingsRepository: IBookingsRepository,
    readonly parkingSpotsRepository: IParkingSpotsRepository,
  ) {}

  async createBooking(data: CreateBookingRequestDTO, driverId: number): Promise<BookingResponseDTO> {
    const problems = this.validateCreateData(data);

    if (problems.length > 0) {
      this.fail(AppErrors.BOOKING_INVALID_DATA, problems.join(", "));
    }

    const spot = await this.parkingSpotsRepository.getParkingSpotById(data.parkingSpotId);

    if (!spot) {
      this.fail(AppErrors.PARKING_NOT_FOUND);
    }

    if (!spot.available) {
      this.fail(AppErrors.BOOKING_SPOT_UNAVAILABLE);
    }

    // El parqueadero debe aceptar el vehículo elegido
    if (
      (data.vehicleType === "carro" && !spot.acceptsCars) ||
      (data.vehicleType === "moto" && !spot.acceptsMotorcycles)
    ) {
      this.fail(AppErrors.BOOKING_VEHICLE_NOT_ACCEPTED);
    }

    if (spot.ownerId === driverId) {
      this.fail(AppErrors.BOOKING_OWN_SPOT);
    }

    const startAt = new Date(data.startAt);
    const endAt = new Date(startAt.getTime() + data.hours * HOUR_MS);

    // El precio siempre lo calcula el servidor: nunca se confía en lo que diga el cliente
    const booking = await this.bookingsRepository.createBookingIfFree({
      parkingSpotId: spot.id,
      driverId,
      vehicleType: data.vehicleType,
      startAt,
      endAt,
      totalPrice: spot.pricePerHour * data.hours,
    });

    if (!booking) {
      this.fail(AppErrors.BOOKING_TIME_TAKEN);
    }

    return this.toResponseDTO(booking, driverId);
  }

  async getMyBookings(driverId: number): Promise<BookingResponseDTO[]> {
    const bookings = await this.bookingsRepository.getBookingsByDriver(driverId);

    return bookings.map((booking) => this.toResponseDTO(booking, driverId));
  }

  async getReceivedBookings(ownerId: number, parkingSpotId?: number): Promise<BookingResponseDTO[]> {
    // Filtro opcional por parqueadero: debe existir y ser de este propietario
    if (parkingSpotId !== undefined) {
      if (!Number.isInteger(parkingSpotId) || parkingSpotId <= 0) {
        this.fail(AppErrors.PARKING_INVALID_ID);
      }

      const spot = await this.parkingSpotsRepository.getParkingSpotById(parkingSpotId);

      if (!spot) {
        this.fail(AppErrors.PARKING_NOT_FOUND);
      }

      if (spot.ownerId !== ownerId) {
        this.fail(AppErrors.PARKING_NOT_OWNED);
      }
    }

    const bookings = await this.bookingsRepository.getBookingsByOwner(ownerId, parkingSpotId);

    return bookings.map((booking) => this.toResponseDTO(booking, ownerId));
  }

  async cancelBooking(id: number, userId: number): Promise<BookingResponseDTO> {
    if (!Number.isInteger(id) || id <= 0) {
      this.fail(AppErrors.BOOKING_INVALID_ID);
    }

    const booking = await this.bookingsRepository.getBookingById(id);

    if (!booking) {
      this.fail(AppErrors.BOOKING_NOT_FOUND);
    }

    // Solo pueden cancelar el conductor que reservó o el dueño del parqueadero
    const isDriver = booking.driverId === userId;
    const isOwner = booking.parkingSpot.ownerId === userId;

    if (!isDriver && !isOwner) {
      this.fail(AppErrors.BOOKING_FORBIDDEN);
    }

    if (booking.status === "cancelled") {
      this.fail(AppErrors.BOOKING_ALREADY_CANCELLED);
    }

    if (booking.endAt.getTime() <= Date.now()) {
      this.fail(AppErrors.BOOKING_ALREADY_FINISHED);
    }

    const cancelled = await this.bookingsRepository.cancelBooking(id);

    return this.toResponseDTO(cancelled, userId);
  }

  async getOccupiedSlots(parkingSpotId: number): Promise<OccupiedSlotResponseDTO[]> {
    if (!Number.isInteger(parkingSpotId) || parkingSpotId <= 0) {
      this.fail(AppErrors.PARKING_INVALID_ID);
    }

    const spot = await this.parkingSpotsRepository.getParkingSpotById(parkingSpotId);

    if (!spot) {
      this.fail(AppErrors.PARKING_NOT_FOUND);
    }

    // Las reservas que ya terminaron no le sirven a quien va a reservar
    const slots = await this.bookingsRepository.getOccupiedSlots(parkingSpotId, new Date());
    
    return slots.map((slot) => ({
      startAt: slot.startAt.toISOString(),
      endAt: slot.endAt.toISOString(),
    }));
  }

  // El cuerpo llega del cliente, así que se valida el tipo y el valor de cada campo
  private validateCreateData(data: CreateBookingRequestDTO): string[] {
    const problems: string[] = [];

    if (!Number.isInteger(data?.parkingSpotId) || data.parkingSpotId <= 0) {
      problems.push("parkingSpotId debe ser un número entero positivo");
    }

    if (!(VEHICLE_TYPES as readonly string[]).includes(data?.vehicleType)) {
      problems.push(`vehicleType debe ser uno de: ${VEHICLE_TYPES.join(", ")}`);
    }

    const startAt = typeof data?.startAt === "string" ? new Date(data.startAt) : null;

    if (!startAt || Number.isNaN(startAt.getTime())) {
      problems.push("startAt debe ser una fecha válida en formato ISO 8601");
    } else if (startAt.getTime() < Date.now() - START_TOLERANCE_MS) {
      problems.push("startAt no puede estar en el pasado");
    }

    if (!Number.isInteger(data?.hours) || data.hours < 1 || data.hours > MAX_HOURS) {
      problems.push(`hours debe ser un número entero entre 1 y ${MAX_HOURS}`);
    }

    return problems;
  }

  // Lanza el error del catálogo; "never" le dice a TypeScript que aquí se corta el flujo
  private fail(error: { code: string; message: string; statusCode: number }, detail?: string): never {
    const message = detail ? `${error.message}: ${detail}` : error.message;

    throw new AppException(error.code, message, error.statusCode);
  }

  // Próxima, en curso o completada según la hora actual; la cancelación manda sobre todo
  private getPhase(booking: BookingWithDetails): BookingPhase {
    if (booking.status === "cancelled") return "cancelled";

    const now = Date.now();

    if (now < booking.startAt.getTime()) return "upcoming";
    if (now < booking.endAt.getTime()) return "in_progress";

    return "completed";
  }

  // Convierte el modelo interno al formato que se devuelve al cliente
  // viewerId: quien consulta, para saber si ya dejó su reseña en esta reserva
  private toResponseDTO(booking: BookingWithDetails, viewerId: number): BookingResponseDTO {
    const myReview = booking.reviews.find((review) => review.authorId === viewerId);

    return {
      id: booking.id,
      vehicleType: booking.vehicleType,
      startAt: booking.startAt.toISOString(),
      endAt: booking.endAt.toISOString(),
      hours: Math.round((booking.endAt.getTime() - booking.startAt.getTime()) / HOUR_MS),
      totalPrice: booking.totalPrice,
      status: booking.status,
      phase: this.getPhase(booking),
      createdAt: booking.createdAt.toISOString(),
      parkingSpot: {
        id: booking.parkingSpot.id,
        title: booking.parkingSpot.title,
        neighborhood: booking.parkingSpot.neighborhood,
        address: booking.parkingSpot.address,
        pricePerHour: booking.parkingSpot.pricePerHour,
        photoUrl: booking.parkingSpot.photos[0]?.url ?? null,
      },
      driver: {
        id: booking.driver.id,
        name: booking.driver.name,
        rating: booking.driver.driverRating,
        reviewCount: booking.driver.driverReviewCount,
      },
      myReview: myReview ? { rating: myReview.rating } : null,
    };
  }
}