import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.ts";

export type Role = "admin" | "owner" | "customer";

// 401 = belum login / token tidak valid
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(
      new AppError(401, "Token tidak ditemukan, silakan login terlebih dahulu"),
    );
  }

  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as {
      id: number;
      role: Role;
    };
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    next(new AppError(401, "Token tidak valid atau sudah kedaluwarsa"));
  }
};

// 403 = sudah login, tapi role-nya tidak diizinkan
export const authorize =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Silakan login terlebih dahulu"));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, "Anda tidak memiliki akses ke resource ini"),
      );
    }
    next();
  };

// GET bebas, selain GET hanya admin (dipakai untuk /menu-items).
export const adminForWrites = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method === "GET") return next();
  authenticate(req, res, (err?: unknown) => {
    if (err) return next(err);
    authorize("admin")(req, res, next);
  });
};
