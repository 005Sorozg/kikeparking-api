import { NewBooking, BookingWithDetails, OccupiedSlot } from "../data/models/booking.model";
import { prisma } from "../config/prisma";
import { IBookingsRepository } from "./interfaces/bookings.interface";

// Qué datos relacionados se traen junto con cada reserva
const DETAILS = {
  parkingSpot: {
    select: {
      id: true,
      title: true,
      neighborhood: true,
      address: true,
      pricePerHour: true,
      ownerId: true,
      photos: { select: { url: true }, orderBy: { id: "asc" }, take: 1 },
    },
  },
  driver: { select: { id: true, name: true, driverRating: true, driverReviewCount: true } },
  reviews: { select: { authorId: true, rating: true } },
} as const;

const MAX_ATTEMPTS = 3;

// Reservas que ocupan el horario: las pagadas y las que se están pagando (aún en tiempo).
// Una pendiente cuyo plazo ya venció deja la hora libre sin que nadie tenga que borrarla.
const holdsTheSlot = (now: Date) => ({
  OR: [{ status: "confirmed" }, { status: "pending_payment", paymentDeadline: { gt: now } }],
});

export class BookingsRepository implements IBookingsRepository {
  async createBookingIfFree(
    data: NewBooking,
  ): Promise<BookingWithDetails | undefined> {
    // Si dos reservas llegan al mismo tiempo, Postgres aborta una de las transacciones
    // (código P2034). Se reintenta: en el reintento ya verá la otra reserva y responderá 409.
    for (let attempt = 1; ; attempt++) {
      try {
        return await this.tryCreateBooking(data);
      } catch (error) {
        const isConflict = (error as { code?: string })?.code === "P2034";

        if (!isConflict || attempt >= MAX_ATTEMPTS) {
          throw error;
        }
      }
    }
  }

  private async tryCreateBooking(
    data: NewBooking,
  ): Promise<BookingWithDetails | undefined> {
    // Revisar y crear dentro de una misma transacción "Serializable" evita que dos
    // conductores reserven el mismo horario al mismo tiempo
    return prisma.$transaction(
      async (tx) => {
        // Dos rangos se cruzan si uno empieza antes de que el otro termine, y viceversa
        const overlapping = await tx.booking.findFirst({
          where: {
            parkingSpotId: data.parkingSpotId,
            ...holdsTheSlot(new Date()),
            startAt: { lt: data.endAt },
            endAt: { gt: data.startAt },
          },
        });

        if (overlapping) {
          return undefined;
        }

        const booking = await tx.booking.create({ data, include: DETAILS });

        return booking as BookingWithDetails;
      },
      { isolationLevel: "Serializable" },
    );
  }

  async getBookingById(id: number): Promise<BookingWithDetails | undefined> {
    const booking = await prisma.booking.findUnique({ where: { id }, include: DETAILS });

    return (booking as BookingWithDetails) ?? undefined;
  }

  async getBookingsByDriver(driverId: number): Promise<BookingWithDetails[]> {
    const bookings = await prisma.booking.findMany({
      where: { driverId },
      include: DETAILS,
      orderBy: { startAt: "desc" },
    });

    return bookings as BookingWithDetails[];
  }

  async getBookingsByOwner(ownerId: number, parkingSpotId?: number): Promise<BookingWithDetails[]> {
    // Reservas hechas en los parqueaderos de este propietario (o solo en uno de ellos)
    const bookings = await prisma.booking.findMany({
      where: {
        parkingSpot: { ownerId },
        ...(parkingSpotId !== undefined && { parkingSpotId }),
      },
      include: DETAILS,
      orderBy: { startAt: "desc" },
    });

    return bookings as BookingWithDetails[];
  }

  async cancelBooking(id: number, refunded: boolean): Promise<BookingWithDetails> {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status: "cancelled", ...(refunded && { refundedAt: new Date() }) },
      include: DETAILS,
    });

    return booking as BookingWithDetails;
  }

  async markAsPaid(
    id: number,
    payment: { cardBrand: string; cardLast4: string },
  ): Promise<BookingWithDetails | undefined> {
    // updateMany deja poner condiciones extra: si justo se venció el plazo, no actualiza nada
    const { count } = await prisma.booking.updateMany({
      where: { id, status: "pending_payment", paymentDeadline: { gt: new Date() } },
      data: { status: "confirmed", paidAt: new Date(), ...payment },
    });

    if (count === 0) {
      return undefined;
    }

    return this.getBookingById(id);
  }

  async getOccupiedSlots(parkingSpotId: number, from: Date): Promise<OccupiedSlot[]> {
    return prisma.booking.findMany({
      where: { parkingSpotId, ...holdsTheSlot(new Date()), endAt: { gt: from } },
      select: { startAt: true, endAt: true },
      orderBy: { startAt: "asc" },
    });
  }
}