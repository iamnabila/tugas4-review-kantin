const errorResponse = (description: string, example: object) => ({
  description,
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/Error" },
      example,
    },
  },
});

const r400 = errorResponse("Validasi gagal", {
  status: "fail",
  message: "Validasi gagal",
  errors: [{ field: "name", message: "name minimal 3 karakter" }],
});
const r401 = errorResponse("Belum login / token tidak valid", {
  status: "fail",
  message: "Token tidak ditemukan, silakan login terlebih dahulu",
});
const r403 = errorResponse("Sudah login, tapi tidak punya akses", {
  status: "fail",
  message: "Anda tidak memiliki akses ke resource ini",
});
const r404 = errorResponse("Tidak ditemukan", {
  status: "fail",
  message: "Data warung tidak ditemukan",
});
const r409 = (message: string) =>
  errorResponse("Konflik data", { status: "fail", message });

const ok = (description: string) => ({ description });
const jsonBody = (ref: string) => ({
  required: true,
  content: { "application/json": { schema: { $ref: ref } } },
});
const auth = [{ bearerAuth: [] }];
const idParam = { $ref: "#/components/parameters/IdParam" };

const stallProps = {
  name: {
    type: "string",
    minLength: 3,
    maxLength: 100,
    example: "Warung Bu Sri",
  },
  category: { type: "string", maxLength: 50, example: "Nasi" },
  location: { type: "string", maxLength: 100, example: "Kantin FK" },
  description: {
    type: "string",
    maxLength: 1000,
    example: "Nasi rames murah meriah",
  },
};

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Review Kantin API",
    version: "3.0.0",
    description:
      "Validasi Zod, autentikasi JWT, role admin/owner/customer.\n\n" +
      "Cara pakai token: login di **POST /api/v1/auth/login**, copy `token`, klik tombol **Authorize**, tempel token-nya.",
  },
  servers: [{ url: "/" }],
  tags: [
    { name: "Auth" },
    { name: "Stalls" },
    { name: "Reviews" },
    { name: "Users" },
    { name: "Menu Items" },
    { name: "Likes" },
    { name: "Flags" },
    { name: "Audit Logs" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    parameters: {
      IdParam: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "integer", minimum: 1 },
      },
    },
    schemas: {
      UserCreate: {
        type: "object",
        required: ["name", "email", "password", "role"],
        properties: {
          name: {
            type: "string",
            minLength: 3,
            maxLength: 100,
            example: "Owner Baru",
          },
          email: {
            type: "string",
            format: "email",
            example: "ownerbaru@kantin.test",
          },
          password: {
            type: "string",
            minLength: 8,
            maxLength: 72,
            example: "password123",
          },
          role: {
            type: "string",
            enum: ["admin", "owner", "customer"],
            example: "owner",
          },
        },
      },
      MenuItemInput: {
        type: "object",
        required: ["stallId", "name", "price"],
        properties: {
          stallId: { type: "integer", example: 1 },
          name: { type: "string", example: "Nasi Goreng" },
          price: { type: "integer", example: 15000 },
          isAvailable: { type: "boolean", example: true },
        },
      },
      LikeInput: {
        type: "object",
        required: ["reviewId", "userId"],
        properties: {
          reviewId: { type: "integer", example: 1 },
          userId: { type: "integer", example: 1 },
        },
      },
      FlagStatusInput: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: ["pending", "resolved", "dismissed"],
            example: "resolved",
          },
        },
      },
      AuditLogInput: {
        type: "object",
        required: ["userId", "action", "targetTable", "targetId"],
        properties: {
          userId: { type: "integer", example: 1 },
          action: { type: "string", example: "UPDATE" },
          targetTable: { type: "string", example: "STALLS" },
          targetId: { type: "integer", example: 1 },
          metadata: { type: "string", example: '{"note":"contoh"}' },
        },
      },
      Error: {
        type: "object",
        properties: {
          status: { type: "string", example: "fail" },
          message: { type: "string" },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
      RegisterInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: {
            type: "string",
            minLength: 3,
            maxLength: 100,
            example: "Budi Santoso",
          },
          email: {
            type: "string",
            format: "email",
            maxLength: 150,
            example: "budi@mail.com",
          },
          password: {
            type: "string",
            minLength: 8,
            maxLength: 72,
            example: "password123",
          },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "admin@kantin.test",
          },
          password: { type: "string", example: "password123" },
        },
      },
      StallCreate: {
        type: "object",
        required: ["name"],
        properties: stallProps,
      },
      StallUpdate: { type: "object", properties: stallProps },
      ReviewInput: {
        type: "object",
        required: ["rating"],
        properties: {
          rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
          comment: {
            type: "string",
            maxLength: 1000,
            example: "Enak dan murah!",
          },
        },
      },
    },
  },
  paths: {
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Daftar user — admin",
        security: auth,
        responses: { 200: ok("Daftar user"), 401: r401, 403: r403 },
      },
      post: {
        tags: ["Users"],
        summary: "Buat user dengan role apa pun — admin",
        security: auth,
        requestBody: jsonBody("#/components/schemas/UserCreate"),
        responses: {
          201: ok("User dibuat"),
          400: r400,
          401: r401,
          403: r403,
          409: r409("Email sudah terdaftar"),
        },
      },
    },
    "/menu-items": {
      get: {
        tags: ["Menu Items"],
        summary: "Daftar menu — publik",
        responses: { 200: ok("Daftar menu") },
      },
      post: {
        tags: ["Menu Items"],
        summary: "Tambah menu — admin",
        security: auth,
        requestBody: jsonBody("#/components/schemas/MenuItemInput"),
        responses: { 201: ok("Menu dibuat"), 401: r401, 403: r403 },
      },
    },
    "/menu-items/{id}": {
      get: {
        tags: ["Menu Items"],
        summary: "Detail menu — publik",
        parameters: [idParam],
        responses: { 200: ok("Detail menu"), 404: ok("Tidak ditemukan") },
      },
      put: {
        tags: ["Menu Items"],
        summary: "Ubah menu — admin",
        security: auth,
        parameters: [idParam],
        requestBody: jsonBody("#/components/schemas/MenuItemInput"),
        responses: {
          200: ok("Menu diperbarui"),
          401: r401,
          403: r403,
          404: ok("Tidak ditemukan"),
        },
      },
      delete: {
        tags: ["Menu Items"],
        summary: "Hapus menu — admin",
        security: auth,
        parameters: [idParam],
        responses: {
          200: ok("Menu dihapus"),
          401: r401,
          403: r403,
          404: ok("Tidak ditemukan"),
        },
      },
    },
    "/likes": {
      post: {
        tags: ["Likes"],
        summary: "Tambah like — admin",
        security: auth,
        requestBody: jsonBody("#/components/schemas/LikeInput"),
        responses: { 201: ok("Like dibuat"), 401: r401, 403: r403 },
      },
    },
    "/likes/{id}": {
      delete: {
        tags: ["Likes"],
        summary: "Hapus like — admin",
        security: auth,
        parameters: [idParam],
        responses: {
          200: ok("Like dihapus"),
          401: r401,
          403: r403,
          404: ok("Tidak ditemukan"),
        },
      },
    },
    "/flags": {
      get: {
        tags: ["Flags"],
        summary: "Daftar laporan review — admin",
        security: auth,
        responses: { 200: ok("Daftar flag"), 401: r401, 403: r403 },
      },
    },
    "/flags/{id}": {
      put: {
        tags: ["Flags"],
        summary: "Ubah status flag — admin",
        security: auth,
        parameters: [idParam],
        requestBody: jsonBody("#/components/schemas/FlagStatusInput"),
        responses: {
          200: ok("Status diperbarui"),
          401: r401,
          403: r403,
          404: ok("Tidak ditemukan"),
        },
      },
    },
    "/audit-logs": {
      get: {
        tags: ["Audit Logs"],
        summary: "Daftar audit log — admin",
        security: auth,
        responses: { 200: ok("Daftar audit log"), 401: r401, 403: r403 },
      },
      post: {
        tags: ["Audit Logs"],
        summary: "Tambah audit log — admin",
        security: auth,
        requestBody: jsonBody("#/components/schemas/AuditLogInput"),
        responses: { 201: ok("Audit log dibuat"), 401: r401, 403: r403 },
      },
    },
    "/reviews": {
      get: {
        tags: ["Reviews"],
        summary: "Daftar semua review — publik",
        responses: { 200: ok("Daftar review") },
      },
    },
    "/reviews/{id}": {
      delete: {
        tags: ["Reviews"],
        summary: "Hapus review — admin",
        security: auth,
        parameters: [idParam],
        responses: {
          200: ok("Review dihapus"),
          401: r401,
          403: r403,
          404: ok("Tidak ditemukan"),
        },
      },
    },
    "/api/v1/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registrasi akun baru (otomatis role customer) — publik",
        requestBody: jsonBody("#/components/schemas/RegisterInput"),
        responses: {
          201: ok("Registrasi berhasil"),
          400: r400,
          409: r409("Email sudah terdaftar"),
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login dan mendapatkan JWT — publik",
        requestBody: jsonBody("#/components/schemas/LoginInput"),
        responses: {
          200: ok("Login berhasil, response berisi token"),
          400: r400,
          401: errorResponse("Email atau password salah", {
            status: "fail",
            message: "Email atau password salah",
          }),
        },
      },
    },
    "/api/v1/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Profil user dari token — login (semua role)",
        security: auth,
        responses: { 200: ok("Data user"), 401: r401 },
      },
    },
    "/api/v1/stalls": {
      get: {
        tags: ["Stalls"],
        summary: "Daftar warung — publik",
        parameters: [
          {
            name: "search",
            in: "query",
            schema: { type: "string", maxLength: 100 },
          },
          {
            name: "category",
            in: "query",
            schema: { type: "string", maxLength: 50 },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
          },
        ],
        responses: { 200: ok("Daftar warung"), 400: r400 },
      },
      post: {
        tags: ["Stalls"],
        summary: "Tambah warung — owner, admin (ownerId diambil dari token)",
        security: auth,
        requestBody: jsonBody("#/components/schemas/StallCreate"),
        responses: {
          201: ok("Warung dibuat"),
          400: r400,
          401: r401,
          403: r403,
        },
      },
    },
    "/api/v1/stalls/{id}": {
      get: {
        tags: ["Stalls"],
        summary: "Detail warung — publik",
        parameters: [idParam],
        responses: { 200: ok("Detail warung"), 400: r400, 404: r404 },
      },
      put: {
        tags: ["Stalls"],
        summary: "Ubah warung — owner (hanya miliknya), admin",
        security: auth,
        parameters: [idParam],
        requestBody: jsonBody("#/components/schemas/StallUpdate"),
        responses: {
          200: ok("Warung diperbarui"),
          400: r400,
          401: r401,
          403: r403,
          404: r404,
        },
      },
      delete: {
        tags: ["Stalls"],
        summary: "Hapus warung — admin",
        security: auth,
        parameters: [idParam],
        responses: {
          200: ok("Warung dihapus"),
          400: r400,
          401: r401,
          403: r403,
          404: r404,
        },
      },
    },
    "/api/v1/stalls/{id}/menus": {
      get: {
        tags: ["Stalls"],
        summary: "Daftar menu sebuah warung — publik",
        parameters: [idParam],
        responses: { 200: ok("Daftar menu"), 400: r400, 404: r404 },
      },
    },
    "/api/v1/stalls/{id}/reviews": {
      post: {
        tags: ["Reviews"],
        summary:
          "Tambah review — login (semua role), userId diambil dari token",
        security: auth,
        parameters: [idParam],
        requestBody: jsonBody("#/components/schemas/ReviewInput"),
        responses: {
          201: ok("Review dibuat"),
          400: r400,
          401: r401,
          404: r404,
          409: r409("Anda sudah pernah mereview warung ini"),
        },
      },
    },
  },
};
