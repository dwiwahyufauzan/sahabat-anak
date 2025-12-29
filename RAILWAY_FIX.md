# ⚡ Quick Fix: Railway Deployment Failed

## ❌ Error yang Anda Alami
```
Environment variable validation failed:
- DB_HOST: Invalid input: expected string, received undefined
- DB_PORT: Invalid input: expected string, received undefined
...
```

## ✅ Solusi Cepat

Environment variables **BELUM DI-SET** di Railway!

---

## 🚀 Langkah-langkah Perbaikan

### **STEP 1: Buka Railway Dashboard**
1. Buka: https://railway.app/dashboard
2. Pilih project "sahabat-anak" (atau nama project Anda)
3. Klik service **backend**

### **STEP 2: Setup PostgreSQL Database**
1. Di Railway Dashboard, klik **"New"** di kanan atas
2. Pilih **"Database"** → **"Add PostgreSQL"**
3. Railway akan create database otomatis
4. Klik database yang baru dibuat
5. Klik tab **"Variables"** atau **"Connect"**
6. **COPY** nilai-nilai berikut:
   ```
   PGHOST     → akan jadi DB_HOST
   PGPORT     → akan jadi DB_PORT
   PGUSER     → akan jadi DB_USER
   PGPASSWORD → akan jadi DB_PASSWORD
   PGDATABASE → akan jadi DB_NAME
   ```

### **STEP 3: Generate JWT Secret**
Buka terminal dan jalankan:
```bash
openssl rand -base64 32
```
**COPY** hasilnya (contoh: `VGhpc0lzQVZlcnlTdHJvbmdTZWNyZXRLZXlGb3JKV1Q=`)

### **STEP 4: Setup Gmail App Password**
1. Buka: https://myaccount.google.com/apppasswords
2. Login dengan Gmail Anda
3. Create app password untuk "Mail"
4. **COPY** app password (16 karakter, contoh: `abcd efgh ijkl mnop`)

### **STEP 5: Set Variables di Railway**
1. Kembali ke service **backend**
2. Klik tab **"Variables"**
3. Klik **"RAW Editor"** (di kanan atas)
4. **PASTE** template berikut (isi dengan data Anda!):

```bash
DB_HOST=<paste-PGHOST-dari-step2>
DB_PORT=5432
DB_USER=<paste-PGUSER-dari-step2>
DB_PASSWORD=<paste-PGPASSWORD-dari-step2>
DB_NAME=<paste-PGDATABASE-dari-step2>
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=3000
JWT_SECRET=<paste-hasil-dari-step3>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=<paste-app-password-dari-step4>
```

5. Klik **"Save"** atau **"Update Variables"**

### **STEP 6: Deploy Ulang**
1. Railway akan **auto-redeploy** setelah save variables
2. Atau klik **"Deploy"** manual
3. Tunggu ~2-3 menit
4. Check **"Deployments"** tab → klik deployment terbaru → **"View Logs"**

### **STEP 7: Verifikasi**
Jika berhasil, logs akan show:
```
✅ Database connected successfully
✅ Server running on port 3000
```

---

## 📝 Contoh Lengkap (ISI DENGAN DATA ANDA!)

```bash
# Database (dari Railway PostgreSQL)
DB_HOST=monorail.proxy.rlwy.net
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=abc123xyz789secret
DB_NAME=railway

# Frontend (deploy frontend ke Vercel/Netlify dulu)
FRONTEND_URL=https://sahabat-anak.vercel.app
NODE_ENV=production
PORT=3000

# Security (generate dengan: openssl rand -base64 32)
JWT_SECRET=VGhpc0lzQVZlcnlTdHJvbmdTZWNyZXRLZXlGb3JKV1Q=

# Email (Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@sahabatanak.org
SMTP_PASS=abcd efgh ijkl mnop
```

---

## 🐛 Troubleshooting

### "Masih error setelah set variables!"
✅ Pastikan **tidak ada spasi** sebelum/sesudah nilai
✅ Pastikan **tidak ada quotes** (jangan pakai `"` atau `'`)
✅ Check typo di nama variable (case sensitive!)

### "DB connection failed!"
✅ Pastikan Railway PostgreSQL database **sudah running** (hijau)
✅ Copy-paste **exact values** dari Railway database variables
✅ Jangan tambahkan https:// di DB_HOST

### "FRONTEND_URL must be valid URL"
✅ Harus **https://** (bukan http://)
✅ Deploy frontend ke Vercel/Netlify dulu
✅ Format: `https://nama-project.vercel.app`

### "JWT_SECRET must be at least 32 characters"
✅ Jangan pakai nilai default
✅ Generate dengan: `openssl rand -base64 32`
✅ Minimal 32 karakter

### "SMTP authentication failed"
✅ Gunakan **App Password** (bukan password biasa!)
✅ Remove spasi dari app password (`abcdefghijklmnop`)
✅ Check SMTP_USER adalah email lengkap

---

## 🎉 Setelah Berhasil

1. **Test API:** `curl https://your-backend.railway.app/health`
2. **Connect Frontend:** Update `VITE_API_URL` di frontend ke Railway URL
3. **Run Migrations:** `railway run bun run db:migrate`
4. **Create Admin:** `railway run bun run scripts/create-admin.ts`

---

## 📞 Butuh Bantuan?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check file: `RAILWAY_DEPLOYMENT.md` untuk detail lebih lanjut
