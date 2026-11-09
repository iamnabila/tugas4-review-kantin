import { Router } from "express";
import { UserController } from "../controllers/userController.ts";
import { validate } from "../middlewares/validate.ts";
import { createUserSchema } from "../schemas/authSchema.ts";

// Seluruh /users sudah dibatasi admin di src/index.ts.
const userRouter = Router();
const userController = new UserController();

userRouter.get("/", userController.getUsers);
userRouter.post(
  "/",
  validate({ body: createUserSchema }),
  userController.createUser,
);

export { userRouter };
