import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../utils/AppError.ts";

export const notFound: RequestHandler = (req, _res, next) => {
  next(
    new AppError(
      404,
      `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan`,
    ),
  );
};

// SATU-SATUNYA tempat yang membentuk response error.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ status: "fail", message: "Body JSON tidak valid" });
    return;
  }

  console.error(err);
  res
    .status(500)
    .json({ status: "error", message: "Terjadi kesalahan pada server" });
};
