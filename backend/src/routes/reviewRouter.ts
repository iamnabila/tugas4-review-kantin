import { Router } from "express";
import { ReviewController } from "../controllers/reviewController.ts";
import { validate } from "../middlewares/validate.ts";
import { authenticate, authorize } from "../middlewares/auth.ts";
import { idParamSchema } from "../schemas/stallSchema.ts";

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.get("/", reviewController.getReviews);
reviewRouter.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validate({ params: idParamSchema }),
  reviewController.deleteReview,
);

export { reviewRouter };
