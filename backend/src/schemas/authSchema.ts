import { z } from "zod";

const nameField = z
  .string({
    error: (iss) =>
      iss.input === undefined ? "name wajib diisi" : "name harus berupa teks",
  })
  .trim()
  .min(3, "name minimal 3 karakter")
  .max(100, "name maksimal 100 karakter");

const emailField = z
  .string({
    error: (iss) =>
      iss.input === undefined ? "email wajib diisi" : "email harus berupa teks",
  })
  .trim()
  .toLowerCase()
  .max(150, "email maksimal 150 karakter")
  .email("format email tidak valid");

const passwordField = z
  .string({
    error: (iss) =>
      iss.input === undefined
        ? "password wajib diisi"
        : "password harus berupa teks",
  })
  .min(8, "password minimal 8 karakter")
  .max(72, "password maksimal 72 karakter");

export const registerSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
});

export const loginSchema = z.object({
  email: emailField,
  password: z
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "password wajib diisi"
          : "password harus berupa teks",
    })
    .min(1, "password wajib diisi"),
});

// Dipakai admin di POST /users (boleh menentukan role).
export const createUserSchema = registerSchema.extend({
  role: z.enum(["admin", "owner", "customer"], {
    error: "role harus admin, owner, atau customer",
  }),
});

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
export type CreateUserBody = z.infer<typeof createUserSchema>;
