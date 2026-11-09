import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { AppError, type FieldError } from "../utils/AppError.ts";

type Schemas = { body?: ZodType; params?: ZodType; query?: ZodType };

// Satu middleware validasi untuk body, params, dan query.
// Hasil yang sudah bersih disimpan di req.validated.
export const validate =
  (schemas: Schemas) => (req: Request, _res: Response, next: NextFunction) => {
    const errors: FieldError[] = [];
    const validated: Record<string, unknown> = {};

    for (const key of ["params", "query", "body"] as const) {
      const schema = schemas[key];
      if (!schema) continue;

      const result = schema.safeParse(req[key] ?? {});
      if (result.success) {
        validated[key] = result.data;
      } else {
        for (const issue of result.error.issues) {
          errors.push({
            field: issue.path.map(String).join(".") || key,
            message: issue.message,
          });
        }
      }
    }

    if (errors.length > 0) {
      return next(new AppError(400, "Validasi gagal", errors));
    }

    req.validated = validated;
    next();
  };
