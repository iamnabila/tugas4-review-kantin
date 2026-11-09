import type { Request, Response } from "express";
import { ReviewService } from "../services/reviewService.ts";

export class ReviewController {
  private reviewService: ReviewService;

  constructor(reviewService: ReviewService = new ReviewService()) {
    this.reviewService = reviewService;
  }

  getReviews = async (_req: Request, res: Response) => {
    const reviews = await this.reviewService.getAllReviews();
    res.status(200).json({ status: "success", data: reviews });
  };

  deleteReview = async (req: Request, res: Response) => {
    const { id } = req.validated!.params as { id: number };
    const review = await this.reviewService.deleteReview(id);
    res.status(200).json({
      status: "success",
      message: "Review berhasil dihapus",
      data: review,
    });
  };
}
