import { Review, ReviewWithAuthor } from "../../data/models/review.model";

export interface IReviewsRepository {
  // Guarda la reseña y recalcula el promedio del parqueadero o del conductor.
  // Devuelve undefined si ese lado ya había calificado esa reserva.
  createReview(data: Omit<Review, "id" | "createdAt">): Promise<Review | undefined>;
  // Reseñas que los conductores dejaron sobre un parqueadero, de la más reciente a la más antigua
  getParkingSpotReviews(parkingSpotId: number): Promise<ReviewWithAuthor[]>;
  // Promedio y cantidad de reseñas que recibió un conductor
  getDriverRatingSummary(driverId: number): Promise<{ rating: number; reviewCount: number }>;
  // Promedio y cantidad de reseñas de todos los parqueaderos de un propietario
  getOwnerRatingSummary(ownerId: number): Promise<{ rating: number; reviewCount: number }>;
}