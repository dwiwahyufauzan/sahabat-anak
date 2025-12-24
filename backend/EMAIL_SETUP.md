# Setup Email untuk Sahabat Anak

## Email: dwiwhy31@gmail.com

### Langkah 1: Aktifkan 2-Factor Authentication (2FA)

1. Buka [Google Account](https://myaccount.google.com/)
2. Pilih **Security** di sidebar kiri
3. Scroll ke bawah ke bagian **How you sign in to Google**
4. Klik **2-Step Verification** dan ikuti langkah-langkahnya
5. Verifikasi dengan nomor HP Anda

### Langkah 2: Generate App Password

1. Setelah 2FA aktif, kembali ke [Google Account Security](https://myaccount.google.com/security)
2. Scroll ke **How you sign in to Google**
3. Klik **App passwords** (atau langsung ke: https://myaccount.google.com/apppasswords)
4. Pilih app: **Mail**
5. Pilih device: **Other (Custom name)**, ketik: **Sahabat Anak Backend**
6. Klik **Generate**
7. **COPY password 16 karakter yang muncul** (contoh: `abcd efgh ijkl mnop`)

### Langkah 3: Update File .env

Buka file `backend/.env` dan update baris berikut:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=dwiwhy31@gmail.com
SMTP_PASS=abcdefghijklmnop  # Paste 16-character App Password (tanpa spasi)
```

**PENTING**: 
- Hapus semua spasi dari App Password (16 karakter tanpa spasi)
- Jangan gunakan password Gmail biasa, harus App Password
- Jangan commit file .env ke Git (sudah ada di .gitignore)

### Langkah 4: Restart Backend Server

Setelah update .env, restart backend server:

```bash
cd backend
bun run dev
```

### Langkah 5: Test Email

#### Test Auto-Reply Donasi:
1. Buka http://localhost:5173/donasi
2. Isi form donasi dengan email Anda
3. Submit
4. Cek inbox - Anda akan menerima email terima kasih

#### Test Auto-Reply Contact:
1. Buka http://localhost:5173/contact
2. Isi form kontak dengan email Anda
3. Submit
4. Cek inbox - Anda akan menerima email konfirmasi

#### Test Manual Reply dari Admin:
1. Login ke admin panel: http://localhost:5173/admin/login
2. Buka menu **Kelola Pesan**
3. Pilih pesan dan klik **Balas**
4. Tulis balasan dan kirim
5. Pengirim akan menerima email balasan

## Fitur Email yang Sudah Tersedia

### 1. Auto-Reply Donasi ✅
- Dikirim otomatis saat ada donasi baru
- Template: Ucapan terima kasih + detail donasi
- Email pengirim: dwiwhy31@gmail.com

### 2. Auto-Reply Pesan Kontak ✅
- Dikirim otomatis saat ada pesan masuk
- Template: Konfirmasi penerimaan pesan
- Email pengirim: dwiwhy31@gmail.com

### 3. Manual Reply dari Admin ✅
- Admin bisa balas pesan dari panel admin
- Custom reply untuk setiap pesan
- Email pengirim: dwiwhy31@gmail.com

### 4. Volunteer Status Notification ✅
- Email saat status volunteer berubah (pending/approved/rejected)
- Template berbeda untuk setiap status
- Email pengirim: dwiwhy31@gmail.com

## Troubleshooting

### Error: "Invalid login"
- Pastikan 2FA sudah aktif
- Pastikan menggunakan App Password, bukan password Gmail biasa
- Pastikan App Password di-paste tanpa spasi

### Error: "Connection timeout"
- Pastikan SMTP_PORT=587
- Pastikan SMTP_SECURE=false
- Cek koneksi internet

### Email tidak terkirim tapi tidak ada error
- Cek folder Spam di inbox penerima
- Pastikan backend server sudah restart setelah update .env
- Cek console log untuk pesan "Email sent to..."

### Test manual dengan curl:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "your-email@gmail.com",
    "subject": "Test Email",
    "message": "Testing auto-reply email"
  }'
```

## Keamanan

- ✅ File .env sudah di .gitignore (tidak akan ter-commit)
- ✅ App Password lebih aman dari password biasa
- ✅ 2FA melindungi akun Gmail
- ⚠️ Jangan share App Password ke siapapun
- ⚠️ Jika App Password bocor, revoke dan generate baru

## Support

Jika ada masalah:
1. Cek console log backend untuk error detail
2. Pastikan semua environment variable sudah benar
3. Restart backend server setelah perubahan .env
4. Test dengan email Anda sendiri terlebih dahulu
