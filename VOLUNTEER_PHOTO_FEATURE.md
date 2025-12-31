# Fitur Upload Foto Relawan

Dokumentasi perubahan untuk menambahkan fitur upload foto profil pada formulir pendaftaran relawan.

## Perubahan yang Dilakukan

### Backend

#### 1. Database Schema (`backend/src/db/schema.ts`)
- Menambahkan kolom `photo` VARCHAR(255) pada tabel `volunteers`
- Lokasi: setelah kolom `availability`

#### 2. Migration File
- File: `backend/migrations/add-volunteer-photo.sql`
- Perintah SQL:
  ```sql
  ALTER TABLE volunteers ADD COLUMN photo VARCHAR(255) AFTER availability;
  ```

#### 3. Upload Configuration (`backend/src/utils/secureUpload.ts`)
- Menambahkan folder `volunteers` ke dalam `UPLOAD_DIRS`
- Mendukung upload gambar untuk relawan dengan validasi keamanan

#### 4. Controller (`backend/src/controllers/volunteer.controller.ts`)
- Menambahkan parameter `photo?: string` pada method `create()`
- Mendukung penyimpanan path foto di database

#### 5. Routes

**Public Route** (`backend/src/routes/public.ts`):
- Menambahkan file upload handling untuk endpoint `/api/volunteers`
- Validasi file: JPG, PNG, WEBP (max 5MB)
- Upload ke folder `public/uploads/volunteers/`

**Admin Route** (`backend/src/routes/admin/volunteers.ts`):
- Menambahkan file upload handling untuk endpoint `/api/admin/volunteers`
- Sama seperti public route dengan validasi yang sama

#### 6. Folder Upload
- Membuat folder: `backend/public/uploads/volunteers/`
- Foto-foto relawan akan disimpan di folder ini

### Frontend

#### 1. Volunteer Form Store (`frontend/src/lib/stores/volunteerForm.js`)
- Menambahkan field `photo` pada `formErrors` untuk tracking error upload foto

#### 2. Volunteer Form Component (`frontend/src/lib/components/volunteer/VolunteerForm.svelte`)
- Menambahkan state untuk photo upload:
  - `photoFile`: menyimpan file yang akan diupload
  - `photoPreview`: URL preview gambar
- Menambahkan fungsi:
  - `handlePhotoChange()`: validasi dan preview foto
  - `removePhoto()`: menghapus foto yang dipilih
- Menambahkan UI upload foto dengan:
  - Preview gambar sebelum upload
  - Validasi client-side (type & size)
  - Drag & drop friendly interface
- Update `handleSubmit()` untuk menggunakan FormData

#### 3. API Client (`frontend/src/lib/api/client.ts`)
- Update method `createVolunteer()` untuk mendukung FormData
- Tetap backward compatible dengan JSON payload

#### 4. Admin API (`frontend/src/lib/utils/adminApi.ts`)
- Update method `volunteers.create()` untuk mendukung FormData
- Menangani authorization header dengan benar untuk FormData

#### 5. Admin Volunteers Page (`frontend/src/routes/admin/volunteers/+page.svelte`)
- Menambahkan kolom "Foto" di tabel daftar relawan
- Menampilkan foto profil atau placeholder jika tidak ada foto
- Update modal detail untuk menampilkan foto relawan
- Menambahkan input foto di form "Tambah Relawan"
- Menambahkan state dan fungsi untuk admin photo upload:
  - `adminPhotoFile`: file yang akan diupload
  - `adminPhotoPreview`: preview foto
  - `handleAdminPhotoChange()`: validasi foto
  - `removeAdminPhoto()`: hapus foto
- Update `handleAddVolunteer()` untuk menggunakan FormData

## Cara Menggunakan

### Untuk User (Frontend)
1. Buka halaman Gabung Relawan (`/relawan`)
2. Isi formulir pendaftaran
3. Klik area "Upload Foto" atau drag foto ke area tersebut
4. Preview foto akan muncul
5. Submit formulir - foto akan otomatis terupload

### Untuk Admin
1. Login ke admin panel
2. Buka menu "Kelola Relawan"
3. Foto relawan akan terlihat di kolom pertama tabel
4. Klik "Detail" untuk melihat foto dalam ukuran lebih besar
5. Saat menambah relawan baru, admin juga bisa upload foto

## Validasi File

### Client-side:
- Tipe file: image/* (JPG, PNG, WEBP, GIF)
- Ukuran maksimal: 5MB

### Server-side:
- Tipe MIME: image/jpeg, image/jpg, image/png, image/webp
- Ukuran maksimal: 5MB
- Path sanitization untuk keamanan
- Filename randomization untuk menghindari konflik

## Migrasi Database

Untuk menerapkan perubahan database, jalankan SQL migration:

```bash
# Jika menggunakan MySQL client
mysql -u username -p database_name < backend/migrations/add-volunteer-photo.sql

# Atau melalui phpMyAdmin / tool database lainnya
# Jalankan query di file: backend/migrations/add-volunteer-photo.sql
```

## Struktur Folder Upload

```
backend/
  public/
    uploads/
      volunteers/
        [generated-filename].jpg
        [generated-filename].png
        ...
```

## URL Akses Foto

Foto dapat diakses melalui:
- Development: `http://localhost:3000/uploads/volunteers/[filename]`
- Production: `https://api.sahabat-anak.org/uploads/volunteers/[filename]`

## Notes

- Foto bersifat **opsional** - relawan tetap bisa mendaftar tanpa foto
- Jika tidak ada foto, akan ditampilkan placeholder dengan icon user
- Foto disimpan dengan nama random untuk keamanan
- Original filename tidak disimpan untuk menghindari path traversal attacks
