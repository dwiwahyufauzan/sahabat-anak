# 🚀 QUICK START - Setup Email Sahabat Anak

## Email: dwiwhy31@gmail.com

### ⚡ 3 Langkah Cepat:

#### 1️⃣ Generate App Password Gmail
   - Buka: https://myaccount.google.com/apppasswords
   - Pilih: Mail → Other (Sahabat Anak)
   - **Copy 16 karakter password** yang muncul

#### 2️⃣ Update File .env
   ```bash
   # Buka: backend/.env
   SMTP_USER=dwiwhy31@gmail.com
   SMTP_PASS=abcdefghijklmnop  # Paste App Password di sini (tanpa spasi)
   ```

#### 3️⃣ Restart Backend
   ```bash
   cd backend
   bun run dev
   ```

## ✅ Fitur Email yang Aktif:

### 1. Auto-Reply Donasi
- ✅ Kirim otomatis saat ada donasi
- ✅ Template: Terima kasih + detail donasi
- Test: Isi form di /donasi

### 2. Auto-Reply Pesan Kontak  
- ✅ Kirim otomatis saat ada pesan masuk
- ✅ Template: Konfirmasi penerimaan
- Test: Isi form di /contact

### 3. Manual Reply dari Admin
- ✅ Admin bisa balas pesan di panel
- ✅ Custom reply untuk tiap pesan
- Test: Login admin → Kelola Pesan → Balas

### 4. Notifikasi Status Volunteer
- ✅ Email saat status berubah
- ✅ Template: Pending/Approved/Rejected
- Test: Admin ubah status volunteer

---

📖 **Dokumentasi lengkap**: Lihat [EMAIL_SETUP.md](./EMAIL_SETUP.md)

⚠️ **PENTING**: 
- Harus pakai App Password (bukan password Gmail biasa)
- 2FA harus aktif di akun Gmail
- Jangan commit file .env ke Git
