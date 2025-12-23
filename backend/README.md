# Sahabat Anak Backend

Backend API menggunakan **Bun**, **Elysia.js**, **Drizzle ORM**, dan **MySQL**.

## Fitur

✅ RESTful API dengan Elysia.js  
✅ Authentication JWT untuk Admin  
✅ CRUD lengkap untuk semua data  
✅ Auto-generated Swagger Documentation  
✅ Type-safe dengan Drizzle ORM  
✅ Password hashing dengan Bun.password  

## Setup

1. Install dependencies:
```bash
bun install
```

2. Setup database MySQL dan sesuaikan konfigurasi di `.env`:
```bash
cp .env.example .env
# Edit .env sesuai konfigurasi MySQL Anda
```

3. Generate dan push schema ke database:
```bash
bun run db:push
```

4. Buat admin pertama (lihat bagian "Membuat Admin Pertama")

5. Jalankan development server:
```bash
bun run dev
```

Server akan berjalan di `http://localhost:3000`  
Swagger docs di `http://localhost:3000/swagger`

## Scripts

- `bun run dev` - Jalankan development server dengan hot reload
- `bun run start` - Jalankan production server
- `bun run db:generate` - Generate migration files dari schema
- `bun run db:push` - Push schema langsung ke database
- `bun run db:studio` - Buka Drizzle Studio untuk manage database

## Membuat Admin Pertama

Gunakan endpoint `/api/auth/register` untuk membuat admin pertama:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@sahabatanak.org",
    "password": "admin123",
    "fullName": "Super Admin",
    "role": "super_admin"
  }'
```

Response akan berisi token JWT yang bisa digunakan untuk authenticate.

## API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Register admin baru
- `POST /api/auth/login` - Login admin
- `GET /api/auth/me` - Get current admin info (requires token)

### 🌐 Public Endpoints (`/api`)
- `GET /api/programs` - Get all active programs
- `GET /api/programs/:slug` - Get program by slug
- `GET /api/news` - Get all news
- `GET /api/news/:slug` - Get news by slug
- `POST /api/donations` - Create donation
- `POST /api/volunteers` - Submit volunteer application
- `POST /api/contact` - Send contact message

### 👨‍💼 Admin Endpoints (requires JWT token)

**Programs** (`/api/admin/programs`)
- `GET /api/admin/programs` - Get all programs
- `GET /api/admin/programs/:id` - Get program by ID
- `POST /api/admin/programs` - Create new program
- `PUT /api/admin/programs/:id` - Update program
- `DELETE /api/admin/programs/:id` - Delete program

**News** (`/api/admin/news`)
- `GET /api/admin/news` - Get all news
- `GET /api/admin/news/:id` - Get news by ID
- `POST /api/admin/news` - Create new news
- `PUT /api/admin/news/:id` - Update news
- `DELETE /api/admin/news/:id` - Delete news

**Donations** (`/api/admin/donations`)
- `GET /api/admin/donations` - Get all donations
- `GET /api/admin/donations/:id` - Get donation by ID
- `PUT /api/admin/donations/:id/status` - Update payment status
- `DELETE /api/admin/donations/:id` - Delete donation

**Volunteers** (`/api/admin/volunteers`)
- `GET /api/admin/volunteers` - Get all volunteers
- `GET /api/admin/volunteers/:id` - Get volunteer by ID
- `PUT /api/admin/volunteers/:id/status` - Approve/reject volunteer
- `DELETE /api/admin/volunteers/:id` - Delete volunteer

**Contact Messages** (`/api/admin/contacts`)
- `GET /api/admin/contacts` - Get all messages
- `GET /api/admin/contacts/:id` - Get message by ID
- `PUT /api/admin/contacts/:id/status` - Mark as read/replied
- `DELETE /api/admin/contacts/:id` - Delete message

**Team Members** (`/api/admin/team`)
- `GET /api/admin/team` - Get all team members
- `GET /api/admin/team/:id` - Get team member by ID
- `POST /api/admin/team` - Add new team member
- `PUT /api/admin/team/:id` - Update team member
- `DELETE /api/admin/team/:id` - Delete team member

## Authentication

Semua admin endpoints memerlukan JWT token di header:

```
Authorization: Bearer <your-jwt-token>
```

Contoh request dengan token:
```bash
curl -X GET http://localhost:3000/api/admin/programs \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Database Schema

- **admins** - Admin users dengan authentication
- **programs** - Program donasi
- **news** - Berita & artikel
- **donations** - Transaksi donasi
- **volunteers** - Pendaftaran relawan
- **contact_messages** - Pesan kontak
- **team_members** - Anggota tim organisasi

## Environment Variables

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=sahabat_anak
PORT=3000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=super-secret-key-change-in-production
```

**⚠️ IMPORTANT:** Ganti `JWT_SECRET` dengan string random yang panjang di production!
