import { Request, Response } from "express";
import { CreateReviewRequestDTO } from "../dto/reviews.dto";
import { IReviewsService } from "../services/interfaces/reviews.interface";

export class ReviewsController {
  constructor(readonly reviewsService: IReviewsService) {}

  createReview = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateReviewRequestDTO;

    const result = await this.reviewsService.createReview(Number(req.params.id), req.user!.id, body);

    res.status(201).json(result);
  };

  getParkingSpotReviews = async (req: Request, res: Response): Promise<void> => {
    const result = await this.reviewsService.getParkingSpotReviews(Number(req.params.id));

    res.status(200).json(result);
  };
}