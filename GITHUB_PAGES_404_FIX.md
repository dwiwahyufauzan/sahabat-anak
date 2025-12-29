# GitHub Pages 404 Error Fix

## ❌ Masalah
Saat akses halaman selain homepage di GitHub Pages (misal: `/admin`, `/program`, dll), muncul error:
```
404
There isn't a GitHub Pages site here.
```

## 🔍 Penyebab
- GitHub Pages adalah **static file server**
- Ketika user akses `/admin`, GitHub Pages mencari file `admin.html` atau `admin/index.html`
- SvelteKit menggunakan **client-side routing**, jadi hanya ada `index.html` di root
- Semua routing ditangani oleh JavaScript di browser, bukan server

## ✅ Solusi yang Sudah Diterapkan

### 1️⃣ Buat `404.html` Redirect
File: `frontend/static/404.html`
- Menyimpan URL yang diminta ke `sessionStorage`
- Redirect ke `index.html`

### 2️⃣ Update `app.html` dengan Redirect Handler
File: `frontend/src/app.html`
- Menambahkan script untuk membaca `sessionStorage`
- Restore URL asli setelah redirect

### 3️⃣ Sudah Ada `.nojekyll`
File: `frontend/static/.nojekyll`
- Mencegah GitHub Pages menggunakan Jekyll
- File yang diawali `_` tetap bisa diakses

## 🚀 Cara Deploy Ulang

```bash
# 1. Build frontend dengan konfigurasi baru
cd frontend
bun run build

# 2. Pastikan 404.html ada di build folder
ls build/404.html

# 3. Commit & push
cd ..
git add .
git commit -m "Fix GitHub Pages 404 error for SPA routing"
git push origin main
```

## 🧪 Cara Test

### Local Test:
```bash
cd frontend/build
npx serve -s .
# Buka http://localhost:3000/admin
# Seharusnya TIDAK error 404
```

### GitHub Pages Test (setelah deploy):
1. Tunggu ~1-2 menit untuk GitHub Pages rebuild
2. Buka: `https://username.github.io/sahabat-anak/admin`
3. Seharusnya berhasil load halaman admin

## 📝 Penjelasan Teknis

### Alur Kerja:
```
User akses: /admin
    ↓
GitHub Pages: 404 (file tidak ditemukan)
    ↓
GitHub Pages serve: 404.html
    ↓
404.html: Simpan "/admin" ke sessionStorage
    ↓
404.html: Redirect ke /
    ↓
index.html: Load SvelteKit app
    ↓
app.html script: Baca sessionStorage
    ↓
app.html script: Restore URL ke /admin
    ↓
SvelteKit router: Render halaman /admin
    ✅ Berhasil!
```

## 🔧 Alternative Solutions (jika masih error)

### Option 1: Hash Routing
Ubah URL format dari `/admin` ke `/#/admin`
```javascript
// svelte.config.js
kit: {
    paths: {
        base: '/sahabat-anak',
    },
    appDir: '_app',
}
```

### Option 2: Deploy ke Platform Lain
Platforms dengan native SPA support:
- **Vercel** (Recommended) - Auto-detect SvelteKit
- **Netlify** - Auto-detect SvelteKit
- **Cloudflare Pages** - Support SvelteKit
- **Railway** - Untuk backend

```bash
# Deploy ke Vercel (Frontend)
npm i -g vercel
cd frontend
vercel
```

## 📊 Checklist Verification

Setelah deploy, pastikan:
- [ ] File `build/404.html` exists
- [ ] File `build/.nojekyll` exists
- [ ] `build/index.html` contains redirect handler script
- [ ] GitHub Pages settings: Source = `gh-pages` branch atau `main/docs`
- [ ] Tunggu 1-2 menit untuk propagation
- [ ] Test direct access ke `/admin`, `/program`, etc.

## 🐛 Troubleshooting

### Masih 404 setelah deploy?
**Check:**
1. ✅ File `404.html` ada di root `build/` folder?
2. ✅ GitHub Pages source settings correct?
3. ✅ Sudah tunggu 1-2 menit untuk cache clear?
4. ✅ Browser cache cleared? (Ctrl+Shift+R)

### "Page keeps redirecting"
**Solusi:**
```javascript
// Check sessionStorage only once
if (redirect && !window.location.pathname.includes('redirect')) {
    sessionStorage.removeItem('redirect');
    history.replaceState(null, null, redirect);
}
```

### Base path tidak match
**Check `svelte.config.js`:**
```javascript
paths: {
    base: dev ? '' : '/sahabat-anak'  // Sesuaikan dengan repo name
}
```

## 📚 Resources

- SvelteKit Adapter Static: https://kit.svelte.dev/docs/adapter-static
- GitHub Pages SPA: https://github.com/rafgraph/spa-github-pages
- SvelteKit Routing: https://kit.svelte.dev/docs/routing

---

## ✨ Summary

Masalah **404 error di GitHub Pages** untuk SPA sudah diperbaiki dengan:
1. ✅ `404.html` redirect handler
2. ✅ `app.html` restore script
3. ✅ `.nojekyll` file

**Next Step:** Build ulang frontend dan push ke GitHub! 🚀
