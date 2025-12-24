# 🚀 Panduan Deployment

## Frontend - GitHub Pages

### Setup Otomatis
Frontend sudah dikonfigurasi untuk auto-deploy ke GitHub Pages setiap kali push ke branch `main`.

### Langkah-langkah:

1. **Enable GitHub Pages di Repository**
   - Buka repository di GitHub
   - Settings → Pages
   - Source: **GitHub Actions**

2. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Setup deployment"
   git push origin main
   ```

3. **Akses Website**
   - URL: `https://[username].github.io/sahabat-anak/`
   - Setelah deployment selesai (2-3 menit)

### Build Manual (Opsional)
```bash
cd frontend
bun install
bun run build
```

---

## Backend - Railway (Recommended)

### 1. Setup Railway

1. **Sign up di Railway**
   - Kunjungi: https://railway.app
   - Login dengan GitHub

2. **Create New Project**
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository `sahabat-anak`
   - Pilih folder `backend`

3. **Configure Environment Variables**
   Di Railway Dashboard → Variables, tambahkan:
   ```env
   DB_HOST=mysql_host
   DB_PORT=3306
   DB_USER=mysql_user
   DB_PASSWORD=mysql_password
   DB_NAME=sahabat_anak
   PORT=3000
   FRONTEND_URL=https://[username].github.io/sahabat-anak
   JWT_SECRET=your-super-secret-jwt-key-change-this
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Add MySQL Database**
   - Di Railway project, klik "New"
   - Pilih "Database" → "Add MySQL"
   - Copy connection details ke environment variables

5. **Deploy**
   - Railway akan auto-deploy
   - Dapatkan URL production: `https://[project-name].up.railway.app`

---

## Backend - Render (Alternative)

### 1. Setup Render

1. **Sign up di Render**
   - Kunjungi: https://render.com
   - Login dengan GitHub

2. **Create Web Service**
   - Dashboard → New → Web Service
   - Connect repository `sahabat-anak`
   - Root Directory: `backend`
   - Runtime: **Docker** atau **Node**

3. **Configure**
   ```
   Build Command: bun install
   Start Command: bun run start
   ```

4. **Environment Variables** (sama seperti Railway)

5. **Add PostgreSQL/MySQL Database** (Render menyediakan database gratis)

---

## Backend - Vercel (Alternative untuk API Routes)

⚠️ **Note**: Vercel free tier memiliki limitasi untuk Bun runtime. Lebih cocok untuk Node.js.

---

## Update Frontend URL Backend

Setelah backend di-deploy, update API URL di frontend:

**File**: `frontend/src/lib/api/client.ts`

```typescript
const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:3000/api' 
  : 'https://your-backend-url.railway.app/api';
```

**File**: `frontend/src/lib/utils/adminApi.ts`

```typescript
const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:3000' 
  : 'https://your-backend-url.railway.app';
```

Rebuild frontend:
```bash
cd frontend
bun run build
git add .
git commit -m "Update API URL"
git push
```

---

## Checklist Deployment

### Frontend ✅
- [x] GitHub Actions workflow created
- [x] Static adapter configured
- [x] Build script dengan .nojekyll
- [ ] Enable GitHub Pages di repository settings
- [ ] Push ke GitHub
- [ ] Verify deployment success

### Backend
**Railway**: 
- [ ] Create Railway account
- [ ] Deploy backend service
- [ ] Add MySQL database
- [ ] Configure environment variables
- [ ] Update CORS untuk production URL
- [ ] Test API endpoints

**atau Render**:
- [ ] Create Render account
- [ ] Deploy web service
- [ ] Add database
- [ ] Configure environment variables
- [ ] Test API endpoints

### Integration
- [ ] Update API URLs di frontend
- [ ] Rebuild & redeploy frontend
- [ ] Test full application flow
- [ ] Test email notifications
- [ ] Test file uploads
- [ ] Test admin panel

---

## Monitoring

### Frontend
- GitHub Actions logs untuk build status
- GitHub Pages status di Settings

### Backend
- Railway/Render dashboard untuk logs
- Monitor CPU/Memory usage
- Check database connections

---

## Troubleshooting

### Frontend tidak muncul
- Cek GitHub Actions logs
- Pastikan `base: '/sahabat-anak'` di svelte.config.js
- Pastikan `.nojekyll` file ada

### Backend error 502/503
- Cek environment variables
- Cek database connection
- Cek logs di Railway/Render dashboard

### CORS Error
- Update `FRONTEND_URL` di backend .env
- Tambahkan production URL ke CORS config

### Email tidak terkirim
- Verify SMTP credentials
- Check SMTP_USER dan SMTP_PASS

---

## Production URLs

Frontend: `https://[username].github.io/sahabat-anak/`
Backend: `https://[project-name].up.railway.app` atau `https://[project-name].onrender.com`
Admin: `https://[username].github.io/sahabat-anak/admin`

---

## Support

Jika ada masalah:
1. Cek logs di GitHub Actions (frontend)
2. Cek logs di Railway/Render (backend)
3. Verify environment variables
4. Test API dengan curl/Postman
