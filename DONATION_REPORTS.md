# Fitur Laporan Donasi

## 📊 Overview

Halaman Kelola Donasi telah ditingkatkan dengan fitur filter bulanan dan export multi-format untuk memudahkan pelaporan dan arsip donasi.

## ✨ Fitur Utama

### 1. Filter Bulanan
- **Tampilkan Semua Bulan**: Checkbox untuk melihat semua donasi
- **Pilih Bulan**: Dropdown untuk memilih bulan tertentu (Januari-Desember)
- **Pilih Tahun**: Dropdown untuk memilih tahun (5 tahun terakhir)
- **Statistik Real-time**: Menampilkan jumlah donasi dan total nominal per periode

### 2. Export Multi-Format

#### 📄 Word (.docx)
- Format dokumen profesional dengan header dan tabel
- Mencakup:
  - Header: Judul, nama yayasan, periode
  - Tabel donasi dengan kolom: No, Tanggal, Donatur, Jumlah, Status
  - Ringkasan: Total donasi, total nominal, terverifikasi, pending
- Library: `docx`

#### 📊 Excel (.xlsx)
- File spreadsheet dengan 2 sheet:
  - **Sheet "Donasi"**: Data lengkap donasi (No, Tanggal, Donatur, Email, Telepon, Jumlah, Program, Status, Metode Pembayaran)
  - **Sheet "Ringkasan"**: Statistik periode (Periode, Total Donasi, Total Nominal, Terverifikasi, Pending)
- Library: `xlsx`

#### 📑 PDF (.pdf)
- Format PDF dengan header profesional dan tabel
- Mencakup:
  - Header dengan judul dan periode
  - Tabel donasi dengan auto-pagination
  - Ringkasan statistik di akhir dokumen
- Library: `jspdf`, `jspdf-autotable`

## 🚀 Penggunaan

### Akses Halaman
1. Login ke admin panel
2. Navigasi ke **Kelola Donasi**

### Filter Donasi per Bulan
1. **Uncheck** "Tampilkan Semua Bulan"
2. Pilih bulan dari dropdown
3. Pilih tahun dari dropdown
4. Statistik akan diupdate otomatis

### Export Laporan
1. Filter donasi sesuai kebutuhan (bulan, status, pencarian)
2. Klik salah satu tombol export:
   - **Word (.docx)**: Untuk dokumen formal
   - **Excel (.xlsx)**: Untuk analisis data dan spreadsheet
   - **PDF (.pdf)**: Untuk cetak dan arsip
3. File akan terdownload otomatis

## 📦 Dependencies

```json
{
  "xlsx": "^0.18.5",
  "jspdf": "^2.5.1",
  "jspdf-autotable": "^3.8.2",
  "docx": "^8.5.0"
}
```

## 🔧 Instalasi Dependencies

```bash
cd frontend
npm install xlsx jspdf jspdf-autotable docx
```

## 💡 Fitur Tambahan

### Statistik Periode
- **Total Donasi**: Jumlah donasi dalam periode
- **Total Nominal**: Total uang yang masuk
- **Terverifikasi**: Jumlah donasi dengan status completed
- **Pending**: Jumlah donasi yang masih pending

### Filter Kombinasi
Filter dapat dikombinasikan:
- **Bulan + Status**: Misal Januari 2024 + Completed
- **Bulan + Pencarian**: Misal Desember 2024 + "John"
- **Status + Pencarian**: Misal Pending + "gmail.com"

## 📁 Nama File Export

Format nama file yang dihasilkan:
- Word: `Laporan-Donasi-{Periode}.docx`
  - Contoh: `Laporan-Donasi-Januari-2024.docx`
- Excel: `Laporan-Donasi-{Periode}.xlsx`
  - Contoh: `Laporan-Donasi-Semua-Periode.xlsx`
- PDF: `Laporan-Donasi-{Periode}.pdf`
  - Contoh: `Laporan-Donasi-Desember-2024.pdf`

## 🎨 UI Components

### Monthly Filter
```svelte
- Checkbox: "Tampilkan Semua Bulan"
- Select: Bulan (Januari - Desember)
- Select: Tahun (5 tahun terakhir)
- Badge: Menampilkan jumlah & total
```

### Export Buttons
```svelte
- Button Word: Blue gradient (bg-blue-600)
- Button Excel: Green gradient (bg-green-600)
- Button PDF: Red gradient (bg-red-600)
- Icons: file-text icon untuk semua
```

## 🔐 Security & Performance

### Dynamic Imports
- Libraries di-import secara dinamis saat dibutuhkan
- Mengurangi bundle size awal aplikasi
- Lazy loading untuk performa optimal

### Error Handling
- Try-catch untuk setiap fungsi export
- Alert user-friendly jika export gagal
- Console.error untuk debugging

### TypeScript Compatibility
- Menggunakan `@ts-ignore` untuk dynamic imports
- Type casting untuk compatibility dengan library

## 📝 Code Structure

```
frontend/src/routes/admin/donations/+page.svelte
├── Script Section
│   ├── Monthly Filter State
│   ├── exportToWord() function
│   ├── exportToExcel() function
│   └── exportToPDF() function
├── Template Section
│   ├── Monthly Filter UI
│   └── Export Buttons
└── Reactive Statements
    ├── filteredDonations (with month filter)
    ├── monthlyCompletedCount
    └── monthlyPendingCount
```

## 🎯 Use Cases

### 1. Laporan Bulanan ke Donor
- Filter bulan tertentu
- Export ke PDF
- Kirim via email atau cetak

### 2. Analisis Data Donasi
- Export ke Excel
- Analisis dengan pivot table
- Buat grafik dan visualisasi

### 3. Dokumentasi Formal
- Export ke Word
- Edit sesuai kebutuhan
- Tambahkan logo dan tanda tangan

### 4. Arsip Tahunan
- Filter per tahun
- Export semua format
- Simpan untuk audit

## 🐛 Troubleshooting

### Export Gagal
1. Pastikan semua dependencies terinstall
2. Check console untuk error detail
3. Refresh halaman dan coba lagi

### File Tidak Download
1. Check browser download settings
2. Allow popups untuk aplikasi
3. Coba browser lain

### Format Tidak Sesuai
1. Update dependencies ke versi terbaru
2. Clear cache browser
3. Restart dev server

## 🔄 Future Improvements

- [ ] Export dengan custom template
- [ ] Email otomatis laporan bulanan
- [ ] Chart visualization dalam PDF
- [ ] Filter date range custom
- [ ] Export to CSV
- [ ] Batch export (multiple months)
- [ ] Scheduled exports
- [ ] Cloud storage integration

## 📞 Support

Jika mengalami masalah:
1. Check dokumentasi library:
   - [xlsx](https://docs.sheetjs.com/)
   - [jsPDF](https://github.com/parallax/jsPDF)
   - [docx](https://docx.js.org/)
2. Check browser console untuk error
3. Hubungi tim development

## ✅ Checklist Implementasi

- [x] Install dependencies (xlsx, jspdf, jspdf-autotable, docx)
- [x] Add monthly filter UI
- [x] Implement month/year selection
- [x] Add monthly statistics
- [x] Implement Word export function
- [x] Implement Excel export function
- [x] Implement PDF export function
- [x] Add export buttons to UI
- [x] Test all export formats
- [x] Add error handling
- [x] Create documentation

## 🎉 Conclusion

Fitur laporan donasi ini memberikan fleksibilitas maksimal untuk:
- Monitoring donasi per periode
- Export ke berbagai format profesional
- Analisis dan dokumentasi yang komprehensif
- Pelaporan yang mudah dan cepat

**Status**: ✅ Production Ready
