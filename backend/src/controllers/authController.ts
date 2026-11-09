import type { Request, Response } from "express";
import { AuthService } from "../services/authService.ts";
import type { LoginBody, RegisterBody } from "../schemas/authSchema.ts";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService = new AuthService()) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response) => {
    const user = await this.authService.register(
      req.validated!.body as RegisterBody,
    );
    res
      .status(201)
      .json({ status: "success", message: "Registrasi berhasil", data: user });
  };

  login = async (req: Request, res: Response) => {
    const result = await this.authService.login(
      req.validated!.body as LoginBody,
    );
    res
      .status(200)
      .json({ status: "success", message: "Login berhasil", data: result });
  };

  me = async (req: Request, res: Response) => {
    const user = await this.authService.me(req.user!.id);
    res.status(200).json({ status: "success", data: user });
  };
}
