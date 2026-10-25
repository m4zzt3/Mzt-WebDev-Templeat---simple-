---
name: generate-prd
description: >-
  Generate a comprehensive, production-ready Product Requirements Document (prd.md)
  for web applications using the Mazte blueprint (Google Apps Script backend +
  Google Sheets database + Alpine.js/Tailwind CSS frontend). Trigger when the user
  asks to build, create, or design any new web app (e.g. "buatkan saya web landing page",
  "buatkan web toko kasir", "bikin aplikasi kasir", "buatkan web...") before scaffolding,
  or when the user explicitly requests to create, generate, or update prd.md.
---

# generate-prd — Mazte PRD Generator

> **Role**: Expert System Analyst & Prompt Engineer khusus untuk menerjemahkan ide, kebutuhan, atau revisi Web App menjadi Spesifikasi Teknis / PRD lengkap yang siap di-coding oleh AI.  
> **Brand**: MAZTE Generate Prompt — By @mazteprojek  
> **Fokus Utama**: Google Apps Script (GAS) + Google Sheets sebagai database + Alpine.js + Tailwind CSS + Font Awesome + SweetAlert2 (arsitektur Mazte / Ceisya Shop / Gudang Farmasi).

---

## Kapan Skill Ini Digunakan?

1. **Otomatis sebagai Langkah Pertama**: Setiap kali user meminta pembuatan web app baru di CLI (misalnya: *"buatkan saya web landing page"*, *"buatkan web toko kasir untuk percetakan"*, *"bikin web inventori barang"*, dsb.), skill ini **WAJIB berjalan pertama kali** untuk menyusun dan menyimpan file `prd.md` di root project sebelum eksekusi scaffolding.
2. **Permintaan Eksplisit**: Ketika user meminta *"buatkan prd"*, *"generate prd.md"*, *"analisis sistem web"*, atau menjalankan command `/prd`.

---

## Prinsip Kerja & Sikap AI

- **Langsung Hasilkan Output**: Jangan bertele-tele, jangan ceramah, jangan memberikan sapaan pembuka atau basa-basi ("Tentu", "Baik", "Siap", "Berikut hasilnya", "Saya akan membantu").
- **Analisis Mendalam & Mandiri**: User seringkali hanya memberikan satu kalimat singkat (contoh: *"BUATKAN WEB TOKO KASIR UNTUK PERCETAKAN"*). Kembangkan permintaan tersebut secara cerdas menjadi spesifikasi enterprise/operasional yang lengkap, realistis, dan logis.
- **Standar Blueprint Mazte**:
  - Backend: `Code.gs` (Google Apps Script)
  - Database: Google Sheets dengan header tebal `#f3f4f6`
  - Frontend: `Index.html` (Single-Page Alpine.js + Tailwind CSS CDN + Font Awesome 6 + SweetAlert2)
  - Build & Deploy: `build.js` -> `dist/` -> Firebase Hosting / Vercel
  - Format ID: `'PREFIX-' + new Date().getTime()`
  - Format Tanggal: `dd/MM/yyyy`
  - Format Boolean: `'TRUE'` / `'FALSE'`
  - Status Standar: `PENDING`, `DIPROSES`, `SELESAI`, `BATAL`, `AKTIF`, `NONAKTIF`

---

## Analisis Bisnis Wajib

Dari ide user, bedah dan definisikan secara menyeluruh:

1. **Role Pengguna**: Siapa saja yang menggunakan aplikasi (contoh: Admin Toko, Kasir/Operator, Pelanggan/Pengunjung publik).
2. **Menu & Navigasi**: Menu apa saja yang tersedia untuk setiap role (Sidebar admin, navbar publik, modal transaksi).
3. **Fitur & Alur Kerja**: Fitur publik vs fitur internal (katalog, keranjang/form pemesanan, kasir POS, validasi stok, cetak nota/struk, rekapitulasi).
4. **Master Data**: Data referensi dasar (Produk/Layanan, Kategori, Pelanggan, Supplier, Pengguna/Kasir, Pengaturan Sistem).
5. **Transaksi & Detail Transaksi**: Alur pemesanan/penjualan, tabel header transaksi, tabel rincian transaksi (line items).
6. **Pembayaran & Kas**: Metode pembayaran (Tunai, QRIS, Transfer Bank, Hutang/Tempo), status pembayaran (LUNAS, DP, BELUM_LUNAS).
7. **Status & Histori**: Tracking status pesanan/transaksi dan riwayat log.
8. **Laporan & Dashboard**: Statistik ringkas (total omzet hari ini, pesanan pending, stok menipis, grafik penjualan).
9. **Struktur Google Sheets**: Nama sheet yang presisi, kolom terstruktur, tipe data, dan constraints.
10. **Relasi Antar Data**: Foreign key yang jelas antar sheet.
11. **Business Logic**: Aturan validasi stok, diskon, pajak, proteksi data publik (`IsActive = TRUE`), dsb.

---

## Struktur File `prd.md` yang Dihasilkan

File `prd.md` yang ditulis ke root project **WAJIB** mengikuti format berikut:

```markdown
# Deskripsi Aplikasi
[Nama Aplikasi] adalah [deskripsi lengkap fungsi aplikasi, target pengguna, dan nilai tambah bisnis].
Tema Warna Brand:
- Primary: [Hex Code, contoh #3b82f6 (Blue-500)]
- Secondary: [Hex Code, contoh #1e40af (Blue-800)]
- Accent: [Hex Code, contoh #f59e0b (Amber-500)]

# Role Akses
- **Admin**: [Hak akses penuh: kelola master data, laporan laba/rugi, konfigurasi sistem, user management]
- **Kasir / Operator**: [Akses transaksi POS, input order, cetak invoice/struk, cek stok harian]
- **Pengunjung / Pelanggan**: [Melihat katalog produk/layanan, tracking status order, kontak CS WhatsApp]

# Menu & Fitur Utama
## Bagian Publik (Landing Page / Pelanggan)
- [Section 1: Hero Banner + Call-to-Action]
- [Section 2: Katalog Produk / Layanan interaktif dengan pencarian & filter kategori]
- [Section 3: Form Cek Status Pesanan / Tracking Nota]
- [Section 4: Informasi Kontak, Jam Buka, & FAQ]

## Bagian Kasir / Operasional (POS)
- [Fitur Kasir Cepat: pemilihan item, hitung otomatis diskon/pajak, kalkulasi kembalian]
- [Cetak Struk / Nota Termal & kirim nota ke WhatsApp]
- [Riwayat Transaksi Harian Kasir]

## Bagian Admin (Dashboard & Manajemen)
- [Dashboard Ringkasan: Omzet, Jumlah Transaksi, Piutang, Stok Kritis]
- [CRUD Master Data: Produk, Kategori, Satuan, Harga Grosir/Eceran]
- [Manajemen Transaksi: Filter tanggal, status bayar, status pengerjaan]
- [Laporan Keuangan & Ekspor Data]
- [Pengaturan Profil Toko & Rekening Pembayaran]

# Struktur Data (Google Sheets)

**Sheet: Products**
| Kolom | Tipe | Keterangan |
|---|---|---|
| ProductID | String | PK: 'PRD-' + timestamp |
| NamaProduk | String | Nama item / layanan |
| CategoryID | String | FK -> Categories.CategoryID |
| HargaModal | Number | Harga modal / HPP |
| HargaJual | Number | Harga jual ke konsumen |
| Stok | Number | Sisa stok fisik (jika barang fisik) |
| Satuan | String | Pcs, Lembar, Meter, Rim, dll |
| GambarUrl | String | Link gambar produk |
| IsActive | Boolean | 'TRUE' / 'FALSE' (tampil publik) |

**Sheet: Categories**
| Kolom | Tipe | Keterangan |
|---|---|---|
| CategoryID | String | PK: 'CAT-' + timestamp |
| NamaKategori | String | Nama kategori |
| Urutan | Number | Nomor urut tampilan |

**Sheet: Orders**
| Kolom | Tipe | Keterangan |
|---|---|---|
| OrderID | String | PK: 'ORD-' + timestamp |
| Tanggal | String | dd/MM/yyyy HH:mm |
| CustomerName | String | Nama pelanggan |
| CustomerPhone | String | Nomor WhatsApp pelanggan |
| TotalBelanja | Number | Total rupiah sebelum diskon |
| Diskon | Number | Nilai diskon |
| GrandTotal | Number | Total akhir tagihan |
| MetodeBayar | String | TUNAI, QRIS, TRANSFER |
| StatusBayar | String | LUNAS, DP, BELUM_LUNAS |
| StatusPesanan | String | BARU, DIPROSES, SELESAI, DIAMBIL |
| KasirUsername | String | Operator yang melayani |
| Catatan | String | Catatan khusus pengerjaan |

**Sheet: OrderDetails**
| Kolom | Tipe | Keterangan |
|---|---|---|
| DetailID | String | PK: 'DTL-' + timestamp |
| OrderID | String | FK -> Orders.OrderID |
| ProductID | String | FK -> Products.ProductID |
| NamaProduk | String | Nama produk saat transaksi |
| Qty | Number | Jumlah item |
| HargaSatuan | Number | Harga satuan saat transaksi |
| Subtotal | Number | Qty * HargaSatuan |

**Sheet: Settings**
| Kolom | Tipe | Keterangan |
|---|---|---|
| SettingKey | String | PK: Nama pengaturan (NamaToko, Alamat, NoWA, dll) |
| SettingValue | String | Nilai pengaturan |

**Sheet: Users**
| Kolom | Tipe | Keterangan |
|---|---|---|
| UserID | String | PK: 'USR-' + timestamp |
| Username | String | Username login |
| Password | String | Password login |
| Role | String | 'admin' atau 'kasir' |
| FullName | String | Nama lengkap petugas |
| IsActive | Boolean | 'TRUE' / 'FALSE' |

# Catatan Khusus & Business Logic
1. **Primary & Foreign Key**: Seluruh ID digenerate dengan format `'PREFIX-' + new Date().getTime()`.
2. **Format Tanggal**: Tersimpan dalam format `dd/MM/yyyy` atau `dd/MM/yyyy HH:mm`.
3. **Boolean**: Selalu string `'TRUE'` atau `'FALSE'`.
4. **Data Publik**: Frontend publik hanya mengambil produk dengan `IsActive = 'TRUE'`.
5. **Kalkulasi POS**: GrandTotal dihitung dari `Sum(Subtotal) - Diskon`. Kembalian = `Bayar - GrandTotal`.
6. **Pengurangan Stok**: Saat pesanan disimpan, stok produk otomatis berkurang sejumlah `Qty`.
7. **Cache Invalidation**: Setiap penulisan data ke Google Sheets harus memanggil `clearDataCache()`.
8. **Respons API Standar**: Semua fungsi backend mengembalikan objek `{ success: Boolean, message: String, data?: Any }`.
9. **Concurrency Guard**: Penulisan transaksi multi-user menggunakan `LockService.getScriptLock()` untuk mencegah race condition.
10. **Keamanan Kredensial**: Password akun disimpan dalam bentuk hash SHA-256 (`Utilities.computeDigest`), bukan plain-text.
11. **Ekspor & Cetak Laporan**: Cetak struk POS termal, ekspor invoice, atau ringkasan PDF langsung di client (`html2pdf.js` / window.print).
12. **Arsip / Tutup Buku (Bila Relevan)**: Pemindahan data transaksi historis ke sheet `Archive_*` untuk menjaga performa database Sheets tetap cepat.

Tolong Buatkan dalam 2 file Canvas format Code : Index.html yang bisa dipreview dan Code.gs
```

---

## Blok Diagram Relasi Data (Mermaid ERD)

Tepat setelah blok Markdown spesifikasi di atas, sertakan blok diagram Mermaid ERD yang menggambarkan relasi seluruh sheet:

```mermaid
erDiagram
    CATEGORIES ||--o{ PRODUCTS : categorizes
    PRODUCTS ||--o{ ORDER_DETAILS : included_in
    ORDERS ||--|{ ORDER_DETAILS : contains
    USERS ||--o{ ORDERS : processes
    SETTINGS

    CATEGORIES {
        string CategoryID PK
        string NamaKategori
        int Urutan
    }
    PRODUCTS {
        string ProductID PK
        string CategoryID FK
        string NamaProduk
        number HargaJual
        int Stok
        boolean IsActive
    }
    ORDERS {
        string OrderID PK
        string Tanggal
        string CustomerName
        number GrandTotal
        string StatusBayar
        string StatusPesanan
        string KasirUsername FK
    }
    ORDER_DETAILS {
        string DetailID PK
        string OrderID FK
        string ProductID FK
        int Qty
        number Subtotal
    }
    USERS {
        string UserID PK
        string Username
        string Role
        boolean IsActive
    }
```

---

## Alur Kerja Otomatis (Pipeline)

1. **Terima Permintaan User**: User memberikan ide aplikasi (singkat atau detail).
2. **Generate `prd.md`**: Buat konten spesifikasi sesuai standar di atas, tuliskan langsung ke file `prd.md` di root project.
3. **Sampaikan Ringkasan Cepat**: Beritahu user bahwa `prd.md` telah berhasil dibuat dengan arsitektur Google Sheets + Apps Script + Alpine.js.
4. **Lanjutkan ke Langkah Berikutnya**:
   - Tanyakan konfirmasi atau langsung lanjutkan ke skill `scaffold-project` untuk meng-generate `Code.gs`, `Index.html`, `JavaScript.html`, `Stylesheet.html`, `build.js`, dan `AGENTS.md`.
   - Lanjutkan ke `generate-assets` untuk membuat favicon, logo, dan ikon PWA sesuai warna tema brand yang ada di `prd.md`.
