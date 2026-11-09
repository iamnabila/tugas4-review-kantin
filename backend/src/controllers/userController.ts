import type { Request, Response } from "express";
import { UserService } from "../services/userService.ts";
import type { CreateUserBody } from "../schemas/authSchema.ts";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }

  getUsers = async (_req: Request, res: Response) => {
    const users = await this.userService.getAllUsers();
    res.status(200).json({ status: "success", data: users });
  };

  createUser = async (req: Request, res: Response) => {
    const user = await this.userService.createUser(
      req.validated!.body as CreateUserBody,
    );
    res
      .status(201)
      .json({ status: "success", message: "User berhasil dibuat", data: user });
  };
}
