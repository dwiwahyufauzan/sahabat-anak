# Railway Deployment Guide

## Required Environment Variables

Anda **HARUS** mengatur environment variables berikut di Railway Dashboard:

### 🗄️ Database Configuration
```bash
DB_HOST=<your-database-host>
DB_PORT=5432
DB_USER=<your-database-username>
DB_PASSWORD=<your-database-password>
DB_NAME=<your-database-name>
```

### 🌐 Server Configuration
```bash
PORT=3000
FRONTEND_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
```

### 🔐 Security
```bash
JWT_SECRET=<generate-a-random-32-character-string>
```

**⚠️ PENTING:** Gunakan string random yang kuat untuk JWT_SECRET!
Generate dengan:
```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 3: Online
https://generate-secret.vercel.app/32
```

### 📧 Email (SMTP) Configuration
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=<app-password>
```

**Untuk Gmail:**
1. Aktifkan 2-Factor Authentication
2. Buat App Password: https://myaccount.google.com/apppasswords
3. Gunakan App Password sebagai `SMTP_PASS`

---

## 📝 Cara Set Environment Variables di Railway

### Method 1: Via Railway Dashboard (Recommended)
1. Buka project Anda di Railway: https://railway.app/dashboard
2. Pilih service backend Anda
3. Klik tab **"Variables"**
4. Klik **"New Variable"**
5. Masukkan semua variables di atas satu per satu
6. Klik **"Deploy"** untuk restart dengan env baru

### Method 2: Via Railway CLI
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Set variables
railway variables set DB_HOST=your-host
railway variables set DB_PORT=5432
railway variables set DB_USER=your-user
railway variables set DB_PASSWORD=your-password
railway variables set DB_NAME=your-database
railway variables set FRONTEND_URL=https://your-frontend.vercel.app
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set SMTP_HOST=smtp.gmail.com
railway variables set SMTP_PORT=587
railway variables set SMTP_USER=your-email@gmail.com
railway variables set SMTP_PASS=your-app-password
```

---

## 🗃️ Database Setup di Railway

### Option 1: Railway PostgreSQL (Recommended)
1. Di Railway Dashboard, klik **"New"** → **"Database"** → **"PostgreSQL"**
2. Railway akan auto-create database
3. Copy connection details ke environment variables:
   - `DB_HOST` → dari `PGHOST`
   - `DB_PORT` → dari `PGPORT` 
   - `DB_USER` → dari `PGUSER`
   - `DB_PASSWORD` → dari `PGPASSWORD`
   - `DB_NAME` → dari `PGDATABASE`

### Option 2: External Database
Gunakan database external seperti:
- Neon (https://neon.tech) - Free PostgreSQL
- Supabase (https://supabase.com) - Free PostgreSQL
- ElephantSQL (https://www.elephantsql.com)

---

## ✅ Verifikasi Deployment

Setelah set semua variables:
1. Railway akan auto-redeploy
2. Check logs: `railway logs` atau di Dashboard → Deployments
3. Test endpoint: `curl https://your-backend.railway.app/health`

---

## 🐛 Troubleshooting

### Error: "Environment variable validation failed"
✅ **Solusi:** Set semua required variables di Railway Dashboard → Variables

### Error: "DB connection failed"
✅ **Solusi:** 
- Pastikan Railway PostgreSQL database sudah running
- Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
- Test connection dari local: `psql -h <DB_HOST> -U <DB_USER> -d <DB_NAME>`

### Error: "SMTP authentication failed"
✅ **Solusi:**
- Pastikan menggunakan App Password (bukan password biasa)
- Check SMTP_HOST dan SMTP_PORT
- Untuk Gmail, pastikan "Less secure app access" disabled & gunakan App Password

### Error: "JWT token invalid"
✅ **Solusi:**
- Pastikan JWT_SECRET minimal 32 characters
- Jangan gunakan default value seperti "super-secret-jwt-key"

---

## 📚 Resources

- Railway Docs: https://docs.railway.app
- Railway Variables: https://docs.railway.app/develop/variables
- PostgreSQL Setup: https://docs.railway.app/databases/postgresql
- Gmail SMTP Setup: https://support.google.com/accounts/answer/185833

---

## 🚀 Quick Start (Copy-Paste)

```bash
# 1. Set all variables via Railway CLI
railway variables set DB_HOST=<paste-from-railway-db>
railway variables set DB_PORT=5432
railway variables set DB_USER=<paste-from-railway-db>
railway variables set DB_PASSWORD=<paste-from-railway-db>
railway variables set DB_NAME=<paste-from-railway-db>
railway variables set FRONTEND_URL=https://your-frontend.vercel.app
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=$(openssl rand -base64 32)
railway variables set SMTP_HOST=smtp.gmail.com
railway variables set SMTP_PORT=587
railway variables set SMTP_USER=your-email@gmail.com
railway variables set SMTP_PASS=your-app-password

# 2. Trigger redeploy
railway up

# 3. Check logs
railway logs
```
