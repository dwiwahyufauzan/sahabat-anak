# Panduan Debug Dashboard Admin

## Masalah yang Diperbaiki

### Bug yang ditemukan:
Di file `frontend/src/lib/utils/adminApi.ts`, ada inkonsistensi penggunaan localStorage key:
- Beberapa tempat menggunakan `admin_token` ✅
- Satu tempat menggunakan `token` ❌ (sudah diperbaiki)

### File yang diperbaiki:
1. ✅ `frontend/src/lib/config.ts` - Dibuat untuk konfigurasi API URL
2. ✅ `frontend/src/lib/utils/adminApi.ts` - Diperbaiki localStorage key dari `token` menjadi `admin_token`

## Cara Testing

### 1. Pastikan Server Berjalan
Backend: http://localhost:3000
Frontend: http://localhost:5174

### 2. Logout dan Login Ulang
Karena ada perubahan pada token key, Anda perlu:
1. Buka http://localhost:5174/admin
2. Jika sudah login, klik **Logout** 
3. **Login kembali** dengan kredensial yang benar
4. Token baru akan tersimpan dengan key yang benar (`admin_token`)

### 3. Cek Browser Console
Buka Developer Tools (F12) dan lihat:
- **Console** - untuk melihat error JavaScript
- **Network** - untuk melihat request API
- **Application > Local Storage** - untuk melihat apakah `admin_token` tersimpan

### 4. Verifikasi Token Tersimpan
Di Browser Console, jalankan:
```javascript
localStorage.getItem('admin_token')
```
Seharusnya mengembalikan token string, bukan `null`

## Troubleshooting

### Jika masih error "Gagal memuat data":

1. **Clear Local Storage:**
   ```javascript
   localStorage.clear()
   ```
   Lalu login ulang

2. **Cek Network Request:**
   - Buka DevTools > Network
   - Refresh dashboard
   - Lihat request ke `/api/admin/...`
   - Periksa apakah ada header `Authorization: Bearer [token]`

3. **Cek Response Error:**
   - Jika 401 Unauthorized → Token tidak valid, login ulang
   - Jika 404 Not Found → Endpoint salah
   - Jika 500 Server Error → Cek backend logs

### Backend Test
Test apakah backend API berfungsi:
```powershell
# Test public endpoint
Invoke-WebRequest -Uri "http://localhost:3000/api/programs"

# Test dengan token (ganti TOKEN dengan token asli)
Invoke-WebRequest -Uri "http://localhost:3000/api/admin/programs" -Headers @{"Authorization"="Bearer TOKEN"}
```

## Status Perbaikan

✅ Config file created
✅ Token key fixed (token → admin_token)  
✅ Backend running on port 3000
✅ Frontend running on port 5174
✅ CORS configured for both ports
✅ API tested and working

## Next Steps

1. **Logout** dari admin panel
2. **Login kembali**
3. Dashboard seharusnya sudah menampilkan data dengan normal

Jika masih ada masalah setelah logout/login ulang, screenshot error di console dan share untuk debugging lebih lanjut.
