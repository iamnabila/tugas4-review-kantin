import { Router } from "express";
import { StallController } from "../controllers/stallController.ts";
import { validate } from "../middlewares/validate.ts";
import { authenticate, authorize } from "../middlewares/auth.ts";
import {
  createReviewSchema,
  createStallSchema,
  idParamSchema,
  listStallsQuerySchema,
  updateStallSchema,
} from "../schemas/stallSchema.ts";

const stallRouter = Router();
const stallController = new StallController();

// Publik
stallRouter.get(
  "/",
  validate({ query: listStallsQuerySchema }),
  stallController.getStalls,
);
stallRouter.get(
  "/:id",
  validate({ params: idParamSchema }),
  stallController.getStallById,
);
stallRouter.get(
  "/:id/menus",
  validate({ params: idParamSchema }),
  stallController.getStallMenus,
);

// owner, admin
stallRouter.post(
  "/",
  authenticate,
  authorize("owner", "admin"),
  validate({ body: createStallSchema }),
  stallController.createStall,
);

// owner (hanya miliknya, dicek di service), admin
stallRouter.put(
  "/:id",
  authenticate,
  authorize("owner", "admin"),
  validate({ params: idParamSchema, body: updateStallSchema }),
  stallController.updateStall,
);

// admin
stallRouter.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validate({ params: idParamSchema }),
  stallController.deleteStall,
);

// semua role yang sudah login
stallRouter.post(
  "/:id/reviews",
  authenticate,
  validate({ params: idParamSchema, body: createReviewSchema }),
  stallController.createReview,
);

export { stallRouter };
