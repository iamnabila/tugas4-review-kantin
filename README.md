# Review Kantin API — Tugas 3 RSI

Nabila Azzahra Putri · L0225042 · Kelas A

REST API review warung kantin dengan validasi Zod, satu format error, autentikasi JWT, dan role admin/owner/customer.

## Teknologi

Express 5, TypeScript, Drizzle ORM, SQL Server, Zod, JWT, bcrypt, Swagger UI.

## Cara Menjalankan

1. `npm install`
2. Salin `.env.example` menjadi `.env`, lalu isi koneksi database dan `JWT_SECRET`.
3. Jalankan `npx tsx src/db/seedAuth.ts` untuk membuat akun uji.
4. Jalankan `npm run dev`.
5. Buka dokumentasi API di `http://localhost:3000/docs`.

## Akun Uji (password: `password123`)

| Email                | Role     |
| -------------------- | -------- |
| admin@kantin.test    | admin    |
| owner1@kantin.test   | owner    |
| owner2@kantin.test   | owner    |
| customer@kantin.test | customer |

## Hak Akses

| Endpoint                                            | Akses                         |
| --------------------------------------------------- | ----------------------------- |
| GET /api/v1/stalls, GET /api/v1/stalls/:id          | publik                        |
| POST /api/v1/auth/register, POST /api/v1/auth/login | publik                        |
| GET /api/v1/auth/me                                 | login (semua role)            |
| POST /api/v1/stalls/:id/reviews                     | login (semua role)            |
| POST /api/v1/stalls                                 | owner, admin                  |
| PUT /api/v1/stalls/:id                              | owner (hanya miliknya), admin |
| DELETE /api/v1/stalls/:id                           | admin                         |
