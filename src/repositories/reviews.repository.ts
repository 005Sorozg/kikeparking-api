import { Review, ReviewTarget, ReviewWithAuthor } from "../data/models/review.model";
import { prisma } from "../config/prisma";
import { IReviewsRepository } from "./interfaces/reviews.interface";

// Máximo de reseñas que se devuelven por parqueadero
const REVIEWS_LIMIT = 50;

export class ReviewsRepository implements IReviewsRepository {
  async createReview(data: Omit<Review, "id" | "createdAt">): Promise<Review | undefined> {
    try {
      // En una transacción: si falla el promedio, tampoco queda guardada la reseña
      return await prisma.$transaction(async (tx) => {
        const review = await tx.review.create({ data });

        if (data.target === "parking_spot") {
          const stats = await tx.review.aggregate({
            where: { parkingSpotId: data.parkingSpotId, target: "parking_spot" },
            _avg: { rating: true },
            _count: true,
          });

          await tx.parkingSpot.update({
            where: { id: data.parkingSpotId },
            data: { rating: roundRating(stats._avg.rating), reviewCount: stats._count },
          });
        } else {
          const stats = await tx.review.aggregate({
            where: { driverId: data.driverId, target: "driver" },
            _avg: { rating: true },
            _count: true,
          });

          await tx.user.update({
            where: { id: data.driverId },
            data: { driverRating: roundRating(stats._avg.rating), driverReviewCount: stats._count },
          });
        }

        return { ...review, target: review.target as ReviewTarget };
      });
    } catch (error) {
      // P2002 = se violó la llave única: ese lado ya calificó esa reserva
      if ((error as { code?: string })?.code === "P2002") {
        return undefined;
      }

      throw error;
    }
  }

  async getParkingSpotReviews(parkingSpotId: number): Promise<ReviewWithAuthor[]> {
    const reviews = await prisma.review.findMany({
      where: { parkingSpotId, target: "parking_spot" },
      orderBy: { createdAt: "desc" },
      take: REVIEWS_LIMIT,
      include: { author: { select: { name: true, avatarUrl: true } } },
    });

    return reviews.map((review) => ({ ...review, target: review.target as ReviewTarget }));
  }
}

// Promedio con un decimal (ej: 4.67 → 4.7)
function roundRating(average: number | null): number {
  return Math.round((average ?? 0) * 10) / 10;
}