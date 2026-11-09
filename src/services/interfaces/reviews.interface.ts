import { CreateReviewRequestDTO, ReviewResponseDTO } from "../../dto/reviews.dto";

export interface IReviewsService {
  createReview(bookingId: number, userId: number, data: CreateReviewRequestDTO): Promise<ReviewResponseDTO>;
  getParkingSpotReviews(parkingSpotId: number): Promise<ReviewResponseDTO[]>;
}