import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce
    .number({ error: "id harus berupa angka" })
    .int("id harus bilangan bulat")
    .positive("id harus lebih dari 0"),
});

export const listStallsQuerySchema = z.object({
  search: z
    .string({ error: "search harus berupa teks" })
    .trim()
    .max(100, "search maksimal 100 karakter")
    .optional(),
  category: z
    .string({ error: "category harus berupa teks" })
    .trim()
    .max(50, "category maksimal 50 karakter")
    .optional(),
  page: z.coerce
    .number({ error: "page harus berupa angka" })
    .int("page harus bilangan bulat")
    .min(1, "page minimal 1")
    .default(1),
  limit: z.coerce
    .number({ error: "limit harus berupa angka" })
    .int("limit harus bilangan bulat")
    .min(1, "limit minimal 1")
    .max(100, "limit maksimal 100")
    .default(10),
});

export const createStallSchema = z.object({
  name: z
    .string({
      error: (iss) =>
        iss.input === undefined ? "name wajib diisi" : "name harus berupa teks",
    })
    .trim()
    .min(3, "name minimal 3 karakter")
    .max(100, "name maksimal 100 karakter"),
  category: z
    .string({ error: "category harus berupa teks" })
    .trim()
    .max(50, "category maksimal 50 karakter")
    .optional(),
  location: z
    .string({ error: "location harus berupa teks" })
    .max(100, "location maksimal 100 karakter")
    .optional(),
  description: z
    .string({ error: "description harus berupa teks" })
    .max(1000, "description maksimal 1000 karakter")
    .optional(),
});

// PUT = versi parsial dari POST, tapi minimal harus ada satu field.
export const updateStallSchema = createStallSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "minimal satu field harus diisi",
  });

export const createReviewSchema = z.object({
  rating: z
    .number({
      error: (iss) =>
        iss.input === undefined
          ? "rating wajib diisi"
          : "rating harus berupa angka",
    })
    .int("rating harus bilangan bulat")
    .min(1, "rating minimal 1")
    .max(5, "rating maksimal 5"),
  comment: z
    .string({ error: "comment harus berupa teks" })
    .trim()
    .max(1000, "comment maksimal 1000 karakter")
    .optional(),
});

export type ListStallsQuery = z.infer<typeof listStallsQuerySchema>;
export type CreateStallBody = z.infer<typeof createStallSchema>;
export type UpdateStallBody = z.infer<typeof updateStallSchema>;
export type CreateReviewBody = z.infer<typeof createReviewSchema>;
