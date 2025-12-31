# Setup Event Feature

## Database Migration

### Cara Termudah (Recommended)

Jalankan npm script:

```bash
cd backend
bun run events:create-table
```

### Cara Manual

Atau jalankan script langsung:

```bash
cd backend
bun run src/scripts/create-events-table.ts
```

Atau manual via MySQL client:

```sql
CREATE TABLE IF NOT EXISTS `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`venue` varchar(255) NOT NULL,
	`event_type` enum('offline','online') NOT NULL,
	`objectives` text,
	`target_audience` varchar(255),
	`start_date` datetime NOT NULL,
	`end_date` datetime NOT NULL,
	`start_time` varchar(10) NOT NULL,
	`end_time` varchar(10) NOT NULL,
	`image` varchar(255),
	`status` enum('upcoming','ongoing','completed','cancelled') DEFAULT 'upcoming',
	`created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`),
	CONSTRAINT `events_slug_unique` UNIQUE(`slug`)
);
```

## Backend Setup

1. Backend sudah dikonfigurasi dengan:
   - Event schema di `backend/src/db/schema.ts`
   - Event controller di `backend/src/controllers/event.controller.ts`
   - Event routes (public & admin) sudah ditambahkan
   - Upload directory untuk event images: `backend/public/uploads/events/`

2. Restart backend server untuk apply perubahan:
   ```bash
   cd backend
   bun run dev
   ```

## Frontend Setup

1. Halaman yang sudah dibuat:
   - `/event` - Daftar semua event (public)
   - `/event/[slug]` - Detail event (public)
   - `/admin/events` - Kelola event (admin)

2. Komponen:
   - `EventCard.svelte` - Card component untuk listing event
   - Navigation sudah ditambahkan link "Event"

3. Restart frontend untuk apply perubahan:
   ```bash
   cd frontend
   npm run dev
   ```

## Cara Menggunakan

### Admin Panel

1. Login ke admin panel: `http://localhost:5173/admin/login`
2. Buka menu "Event" di sidebar
3. Klik "Tambah Event" untuk membuat event baru
4. Isi form dengan data:
   - Nama Event
   - Deskripsi
   - Tempat
   - Tipe Event (Online/Offline)
   - Tujuan
   - Target Audiens
   - Tanggal & Jam Mulai
   - Tanggal & Jam Berakhir
   - Upload Foto Event
   - Status (Upcoming/Ongoing/Completed/Cancelled)

### Public View

1. User dapat melihat daftar event di: `http://localhost:5173/event`
2. Filter event berdasarkan: Semua, Mendatang, Selesai
3. Klik event untuk melihat detail lengkap

## API Endpoints

### Public Endpoints
- `GET /api/events` - Get all active events
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/completed` - Get completed events
- `GET /api/events/:slug` - Get event by slug

### Admin Endpoints (Require Auth)
- `GET /api/admin/events` - Get all events
- `GET /api/admin/events/:id` - Get event by ID
- `POST /api/admin/events` - Create new event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event

## Field Descriptions

1. **Nama Kegiatan** - Judul event
2. **Tempat** - Lokasi event (bisa URL untuk online event)
3. **Offline/Online** - Tipe event
4. **Tujuan** - Tujuan dari event ini
5. **Target Audiens** - Siapa yang menjadi target peserta
6. **Tanggal Mulai & Berakhir** - Periode event
7. **Jam Mulai & Berakhir** - Waktu pelaksanaan
8. **Foto** - Gambar event (max 5MB)
