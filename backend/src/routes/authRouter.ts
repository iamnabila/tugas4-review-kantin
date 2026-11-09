import { Router } from "express";
import { AuthController } from "../controllers/authController.ts";
import { validate } from "../middlewares/validate.ts";
import { authenticate } from "../middlewares/auth.ts";
import { loginSchema, registerSchema } from "../schemas/authSchema.ts";

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  "/register",
  validate({ body: registerSchema }),
  authController.register,
);
authRouter.post(
  "/login",
  validate({ body: loginSchema }),
  authController.login,
);
authRouter.get("/me", authenticate, authController.me);

export { authRouter };
