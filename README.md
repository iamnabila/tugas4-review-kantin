# Ulas Kantin

Aplikasi web untuk melihat dan mengelola data warung kantin kampus beserta rating ulasannya. Proyek ini mengintegrasikan frontend React dengan backend REST API dari Tugas 2–3 (Praktikum Rekayasa Sistem Informasi).

- Nama: Nabila Azzahra Putri
- NIM: L0225042
- Kelas: A

## Teknologi

| Bagian          | Teknologi                                                                |
| --------------- | ------------------------------------------------------------------------ |
| Frontend        | React 19 + TypeScript, Vite, React Router, Axios, Tailwind CSS v4        |
| Backend         | Express 5 + TypeScript (tsx), Drizzle ORM, Zod, JSON Web Token, bcryptjs |
| Database        | Microsoft SQL Server                                                     |
| Dokumentasi API | Swagger UI (`/docs`)                                                     |

Seluruh komunikasi frontend ke backend memakai **Axios** (instance di `frontend/src/lib/http.ts`), termasuk interceptor untuk menempelkan token JWT dan menangani respons 401.

## Fitur

- Daftar warung dengan pencarian, filter kategori, dan pagination
- Detail warung
- Tambah, ubah, dan hapus warung sesuai hak akses
- Register, login, profil (`/auth/me`), dan logout
- Hak akses per role:

| Aksi                         | Publik | Customer | Owner                | Admin |
| ---------------------------- | ------ | -------- | -------------------- | ----- |
| Lihat daftar & detail warung | ✓      | ✓        | ✓                    | ✓     |
| Tambah warung                |        |          | ✓                    | ✓     |
| Ubah warung                  |        |          | ✓ (miliknya sendiri) | ✓     |
| Hapus warung                 |        |          |                      | ✓     |

## Struktur folder

```
tugas4_praktikum_rsi/
├── backend/     # REST API Express + SQL Server
├── frontend/    # Aplikasi React (Vite)
└── README.md
```

## Prasyarat

- Node.js 22.18 atau lebih baru
- Microsoft SQL Server (Express/Developer) dan SQL Server Management Studio (SSMS)
- Git

## 1. Menyiapkan database

1. Buka SSMS dan connect ke SQL Server lokal.
2. Buka folder `backend/src/db/`. Di file `.sql` yang berisi `GANTI_PASSWORD_KAMU`, ganti teks itu dengan password pilihanmu. Password ini nanti diisi juga di `DB_PASSWORD` pada `backend/.env`.
3. Jalankan file SQL berikut secara berurutan di SSMS:
   1. `00-setup-mixed-mode.sql` (mengaktifkan login SQL Server; setelah itu restart layanan SQL Server lewat SQL Server Configuration Manager)
   2. `01-create-database-and-user.sql`
   3. `02-schema.sql`
   4. `03-seed.sql`
   5. `04-create-login-tugas.sql`

## 2. Menjalankan backend

```bash
cd backend
npm install
copy .env.example .env
```

Isi `backend/.env`:

| Variabel                      | Keterangan                                                    | Contoh                    |
| ----------------------------- | ------------------------------------------------------------- | ------------------------- |
| `PORT`                        | Port backend                                                  | `3000`                    |
| `DB_SERVER`                   | Alamat SQL Server                                             | `localhost`               |
| `DB_PORT`                     | Port SQL Server                                               | `1433`                    |
| `DB_USER`                     | Login SQL Server                                              | `tugas2_praktikum_rsi`    |
| `DB_PASSWORD`                 | Password login di atas (sama dengan yang dipakai di file SQL) | _(isi sendiri)_           |
| `DB_NAME`                     | Nama database                                                 | `review_kantin`           |
| `DB_ENCRYPT`                  | Enkripsi koneksi                                              | `false`                   |
| `DB_TRUST_SERVER_CERTIFICATE` | Percayai sertifikat lokal                                     | `true`                    |
| `JWT_SECRET`                  | Kunci rahasia untuk menandatangani token                      | _(isi teks acak panjang)_ |
| `CORS_ORIGIN`                 | Alamat frontend yang diizinkan                                | `http://localhost:5173`   |

Untuk membuat `JWT_SECRET` acak:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Buat akun uji, lalu jalankan server:

```bash
npm run seed:auth
npm run dev
```

- API: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/docs`

File `swagger-output.json` dibuat otomatis setiap kali `npm run dev` dijalankan.

## 3. Menjalankan frontend

Buka terminal baru:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Isi `frontend/.env`:

| Variabel            | Keterangan               | Contoh                         |
| ------------------- | ------------------------ | ------------------------------ |
| `VITE_API_BASE_URL` | Alamat dasar API backend | `http://localhost:3000/api/v1` |

Buka `http://localhost:5173` di browser.

## Akun uji

Dibuat oleh `npm run seed:auth`. Password semua akun: `password123`.

| Role     | Email                  |
| -------- | ---------------------- |
| Admin    | `admin@kantin.test`    |
| Owner 1  | `owner1@kantin.test`   |
| Owner 2  | `owner2@kantin.test`   |
| Customer | `customer@kantin.test` |

## Endpoint yang dipakai frontend

| Method | Endpoint                                        | Akses                   |
| ------ | ----------------------------------------------- | ----------------------- |
| POST   | `/api/v1/auth/register`                         | Publik                  |
| POST   | `/api/v1/auth/login`                            | Publik                  |
| GET    | `/api/v1/auth/me`                               | Sudah login             |
| GET    | `/api/v1/stalls?search=&category=&page=&limit=` | Publik                  |
| GET    | `/api/v1/stalls/:id`                            | Publik                  |
| POST   | `/api/v1/stalls`                                | Owner, Admin            |
| PUT    | `/api/v1/stalls/:id`                            | Owner (miliknya), Admin |
| DELETE | `/api/v1/stalls/:id`                            | Admin                   |

Endpoint lain (ulasan, menu, pengguna) dapat dilihat di Swagger.
