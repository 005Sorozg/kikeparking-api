import { ReviewTarget, ReviewWithAuthor } from "../data/models/review.model";
import { CreateReviewRequestDTO, RatingSummaryResponseDTO, ReviewResponseDTO } from "../dto/reviews.dto";
import { AppException } from "../exceptions/app.exception";
import { AppErrors } from "../exceptions/errors/app.error";
import { IBookingsRepository } from "../repositories/interfaces/bookings.interface";
import { IParkingSpotsRepository } from "../repositories/interfaces/parking-spots.interface";
import { IReviewsRepository } from "../repositories/interfaces/reviews.interface";
import { IUsersRepository } from "../repositories/interfaces/users.interface";
import { IReviewsService } from "./interfaces/reviews.interface";

const MAX_COMMENT_LENGTH = 500;

export class ReviewsService implements IReviewsService {
  constructor(
    readonly reviewsRepository: IReviewsRepository,
    readonly bookingsRepository: IBookingsRepository,
    readonly parkingSpotsRepository: IParkingSpotsRepository,
    readonly usersRepository: IUsersRepository,
  ) {}

  // Califica una reserva completada. Lo que se califica depende de quién envía:
  // el conductor de la reserva califica el parqueadero; el dueño del parqueadero, al conductor.
  async createReview(bookingId: number, userId: number, data: CreateReviewRequestDTO): Promise<ReviewResponseDTO> {
    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      this.fail(AppErrors.BOOKING_INVALID_ID);
    }

    const rating = data?.rating;

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      this.fail(AppErrors.REVIEW_INVALID_DATA, "rating debe ser un número entero entre 1 y 5");
    }

    if (data.comment !== undefined && data.comment !== null && typeof data.comment !== "string") {
      this.fail(AppErrors.REVIEW_INVALID_DATA, "comment debe ser texto");
    }

    // Comentario opcional: vacío cuenta como sin comentario
    const comment = data.comment?.trim() || null;

    if (comment && comment.length > MAX_COMMENT_LENGTH) {
      this.fail(AppErrors.REVIEW_INVALID_DATA, `comment no puede pasar de ${MAX_COMMENT_LENGTH} caracteres`);
    }

    const booking = await this.bookingsRepository.getBookingById(bookingId);

    if (!booking) {
      this.fail(AppErrors.BOOKING_NOT_FOUND);
    }

    let target: ReviewTarget;

    if (booking.driverId === userId) {
      target = "parking_spot";
    } else if (booking.parkingSpot.ownerId === userId) {
      target = "driver";
    } else {
      this.fail(AppErrors.BOOKING_FORBIDDEN);
    }

    // Solo se califica lo que de verdad se usó: confirmada y ya terminada
    if (booking.status !== "confirmed" || booking.endAt.getTime() > Date.now()) {
      this.fail(AppErrors.REVIEW_NOT_COMPLETED);
    }

    const review = await this.reviewsRepository.createReview({
      bookingId,
      target,
      authorId: userId,
      parkingSpotId: booking.parkingSpotId,
      driverId: booking.driverId,
      rating,
      comment,
    });

    if (!review) {
      this.fail(AppErrors.REVIEW_ALREADY_EXISTS);
    }

    const author = await this.usersRepository.getUserById(userId);

    return this.toResponseDTO({
      ...review,
      author: { name: author?.name ?? "Usuario", avatarUrl: author?.avatarUrl ?? null },
    });
  }

  async getParkingSpotReviews(parkingSpotId: number): Promise<ReviewResponseDTO[]> {
    if (!Number.isInteger(parkingSpotId) || parkingSpotId <= 0) {
      this.fail(AppErrors.PARKING_INVALID_ID);
    }

    const spot = await this.parkingSpotsRepository.getParkingSpotById(parkingSpotId);

    if (!spot) {
      this.fail(AppErrors.PARKING_NOT_FOUND);
    }

    const reviews = await this.reviewsRepository.getParkingSpotReviews(parkingSpotId);

    return reviews.map((review) => this.toResponseDTO(review));
  }
  
  // Conductor: lo que le han dado los propietarios. Propietario: el promedio de sus parqueaderos.
  async getMyRating(userId: number, role: string): Promise<RatingSummaryResponseDTO> {
    return role === "propietario"
      ? this.reviewsRepository.getOwnerRatingSummary(userId)
      : this.reviewsRepository.getDriverRatingSummary(userId);
  }

  // Lanza el error del catálogo; "never" le dice a TypeScript que aquí se corta el flujo
  private fail(error: { code: string; message: string; statusCode: number }, detail?: string): never {
    const message = detail ? `${error.message}: ${detail}` : error.message;

    throw new AppException(error.code, message, error.statusCode);
  }

  private toResponseDTO(review: ReviewWithAuthor): ReviewResponseDTO {
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      author: review.author,
    };
  }
}