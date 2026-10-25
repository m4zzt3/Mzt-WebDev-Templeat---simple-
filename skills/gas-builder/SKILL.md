---
name: gas-builder
description: Generate full-stack Google Apps Script web app (Code.gs + Index.html + JavaScript.html + Stylesheet.html) dari design.md (hasil design-analyst) — memakai design token VERBATIM. Google Apps Script + Google Sheets sebagai database, Alpine.js + Tailwind frontend, deploy Firebase Hosting (default) atau Vercel. Trigger ketika user punya design.md lalu minta "build dengan GAS", "generate Code.gs", "jadikan Apps Script", atau lanjut dari design-analyst.
---

# gas-builder — `design.md` → Google Apps Script App

> **Role:** Senior full-stack engineer yang expert di Google Apps Script (GAS), Google Sheets sebagai database, dan frontend vanilla (Alpine.js + Tailwind) tanpa build step berat.
>
> **Tugas:** Ambil `design.md` (artifact `design-analyst`) → naikkan jadi aplikasi GAS yang **benar-benar jalan** dengan **Google Sheets** sebagai backend, tema **Firebase Hosting** sebagai deploy default.

Ini adalah **"PROMPT B"** yang hilang dari rantai `PROMPT_A → PROMPT_B`. Melengkapi blueprint `scaffold-project`: kalau `scaffold-project` berangkat dari `prd.md` (requirements), `gas-builder` berangkat dari `design.md` (visual audit) — output kode harus **konsisten dengan blueprint yang sama** (kontrak `Code.gs` + `build.js` + `dist/`).

## Kapan dipakai

- User sudah punya `design.md` (dari `design-analyst`) dan mau lanjut ke kode GAS.
- User minta `Code.gs` + `Index.html` dari design system yang sudah di-approve.

Kalau user belum punya `design.md`, arahkan ke `design-analyst` dulu. Kalau user mulai dari ide bisnis (belum ada desain), pakai `generate-prd` → `scaffold-project` (alur standar repo), atau `generate-prd` → `design-analyst` → `gas-builder` (alur desain-dulu).

## 🔒 Hard Locks (paling sering dilanggar — baca dulu)

1. **`design.md` = hukum, bukan inspirasi.** Warna, font, radius, spacing disalin **VERBATIM**. DILARANG ganti hex, ganti font, atau bikin palette baru. Untuk halaman yang belum di-spec, **turunkan dari token yang sama** — jangan ngarang sistem baru. Patuhi "Rules to Never Break".
2. **Google Sheets = wajib, mock data = HARAM.** Semua data harus datang dari backend GAS via `google.script.run` / `runApi()`. Tidak ada `const products = [...]` hardcoded yang pura-pura jadi data.

## Prasyarat

- `design.md` ada di root project (atau path dari `$ARGUMENTS`).
- `node`/`npm` tersedia (untuk `npm run build`).
- Google Account (untuk setup Apps Script + Google Sheets).

---

## Alur

```
Phase 0  →  Token Lock: restate token design.md (VERBATIM) ke user
Phase 1  →  Rancang routes/screen + tabel Google Sheets + entity
Phase 2  →  Generate Code.gs (backend GAS + Sheets CRUD + cache + doPost API)
Phase 3  →  Generate frontend (Index.html + JavaScript.html + Stylesheet.html)
Phase 4  →  Copy build pipeline (build.js, package.json, firebase.json, dll) + verify build
Phase 5  →  Panduan setup: Apps Script, setupDatabase(), deploy web app, Firebase Hosting
   ↓
Iteration loop (revisi → SELALU kirim kode FULL + step-by-step)
```

Jangan lompat fase. Tanpa routes + tabel yang jelas, `Code.gs` dan `Index.html` akan salah.

---

## Phase 0 — Token Lock (WAJIB sebelum ngoding)

Restate token `design.md` kembali ke user supaya terkunci dan terbukti dibaca:

```
🔒 Design tokens terkunci dari design.md (dipakai VERBATIM):
- Background: #xxxxxx
- Primary:    #xxxxxx   (hanya untuk aksen fungsional / CTA)
- Surface:    #xxxxxx   Surface-2: #xxxxxx
- Text:       #xxxxxx / #xxxxxx
- Font:       [Font], system-ui
- Radius:     sm X / md X / lg X / full 9999
- Rules to Never Break: [salin dari design.md]
```

Untuk screen yang BELUM ada di `design.md`: **turunkan dari token di atas**, jangan tambah warna/font baru. Nyatakan: *"Screen lain pakai palette & font yang sama, hanya menyusun ulang layout."*

---

## Phase 1 — Rancang Screen & Tabel

### 1.1 — Screen / Route

`Index.html` adalah SPA Alpine.js dengan panel admin tersembunyi (pola Ceisya Shop). Petakan screen dari `design.md` + kebutuhan user:

```
Public:  Landing / katalog / detail / cek status / kontak
Admin:   Dashboard / CRUD master data / transaksi / laporan / pengaturan
```

Konfirmasi ke user: *"Dari design.md, saya rancang screen: [list]. Ada yang kurang/lebih?"*

### 1.2 — Tabel / Entity (Google Sheets)

Simpulkan sheet + kolom + relasi. Sajikan ringkas **sebelum** menulis `Code.gs`:

```
Sheet yang saya rancang:
- Products  (ProductID PK, NamaProduk, CategoryID FK, HargaJual, Stok, IsActive, ...)
- Categories (CategoryID PK, NamaKategori, Urutan)
- Orders    (OrderID PK, Tanggal, CustomerName, GrandTotal, StatusBayar, ...)
- ...

Relasi: Products.CategoryID → Categories.CategoryID
Auth:   pakai sheet admins (fallback admin/admin123) — perlu role kasir? [ya/tidak]
```

Konvensi wajib (sama dengan `scaffold-project`):
- **ID** : `'PREFIX-' + new Date().getTime()`
- **Tanggal** : `dd/MM/yyyy` (atau `dd/MM/yyyy HH:mm`)
- **Boolean** : string `'TRUE'`/`'FALSE'`, dibandingkan via `String(v).toUpperCase() === 'TRUE'`
- **Header sheet** : bold, background `#f3f4f6`

Minta konfirmasi skema. **Jangan generate SQL/sheet kalau skema belum disetujui.**

---

## Phase 2 — Generate `Code.gs` (Backend GAS)

Implementasikan kontrak blueprint berikut:

- `doGet(e)`: sajikan page via `?p=` param (`HtmlService.createTemplateFromFile`), `template.serverData = "{}"`. Bungkus dengan `try/catch`: jika file HTML tidak ditemukan (mode headless/API backend atau direct access URL `/exec`), kembalikan response JSON `{ success: true, message: 'API Backend is running!', data: getAllData(false) }`.
- `include(filename)`: kembalikan isi mentah file HTML yang direferensikan.
- `setupDatabase()`: buat semua sheet + header bold (`#f3f4f6`), seed admin default (`admin`/`admin123`).
- `getSheetData(sheetName)`: rows → objects keyed by header row.
- `getAllData(isAdmin)`: kembalikan semua entity array (+ `admins` hanya bila `isAdmin`), cache 60s di `__CACHE_PREFIX___DATA_ADMIN` / `__CACHE_PREFIX___DATA_PUBLIC`.
- `clearDataCache()`: hapus kedua cache key — **panggil setelah setiap write**.
- Satu `save*`/`delete*` per sheet. Fungsi save harus menerima key PascalCase (nama header sheet) ATAU keduanya (PascalCase + camelCase). Validasi required field, kembalikan `{ success, message }`.
- `doLogin(username, password)`: cek sheet admins; fallback `admin`/`admin123` bila kosong.
- `doPost(e)`: entrypoint JSON — pasang `var lock = LockService.getScriptLock(); lock.tryLock(10000);` untuk mencegah tabrakan data (race condition) pada Google Sheets saat write bersamaan. Parse `{ action, args }`, dispatch `this[action](...args)`, **whitelist setiap fungsi yang bisa dipanggil client** di `ALLOWED_ACTIONS`, dan release lock di blok `finally`.

**Respons API standar:** `{ success: Boolean, message: String, data?: Any }`.

**Deploy default = Firebase Hosting** (Vercel = opsi). `doPost` tetap jalan di Firebase karena frontend memanggil web app `/exec` URL.

---

## Phase 3 — Generate Frontend

`Index.html` (public + panel admin tersembunyi), `JavaScript.html`, `Stylesheet.html`.

### 3.1 — Tailwind & token design.md (WAJIB)

**Penyebab utama tampilan putih/berantakan adalah Tailwind v4 di lingkungan preview.** Ikuti aturan:

- ✅ **PAKAI `cdn.tailwindcss.com` (Tailwind v3 stable) + `tailwind.config` JS eksplisit**, semua token `design.md` dipetakan di `theme.extend`.
- ❌ **JANGAN** `@tailwindcss/browser@4` atau `@import "tailwindcss"` + `@theme { ... }` di `<style>` — gagal compile di sandbox iframe → halaman putih polos.

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    darkMode: 'class',
    theme: { extend: {
      colors: {
        // Semua token DARI design.md dipetakan VERBATIM:
        'primary': '#xxxxxx', 'primary-hover': '#xxxxxx',
        'bg': '#xxxxxx', 'surface': '#xxxxxx', 'surface-2': '#xxxxxx',
        'text-primary': '#xxxxxx', 'text-secondary': '#xxxxxx',
        'border': '#xxxxxx',
      },
      fontFamily: { sans: ['[Font]', 'Inter', 'system-ui'] },
      borderRadius: { sm: 'Xpx', md: 'Xpx', lg: 'Xpx', xl: 'Xpx', full: '9999px' },
    }}
  }
</script>
```

CSS mentah (glow, scrollbar, grid overlay) taruh di `<style>` biasa pakai CSS standar — bukan `@apply`/`@theme` v4.

### 3.2 — Struktur & include

- Head load CDN langsung: Tailwind v3, Alpine.js 3.13.3, Font Awesome 6.4.0, SweetAlert2 11. Tambah `<link rel="icon" ... href="/favicon.png"><link rel="alternate icon" href="/favicon.ico">`.
- Referensi file bersama: `<?!= include('Stylesheet'); ?>`, `<?!= include('JavaScript'); ?>`, `<?!= serverData ?>`.
- `Stylesheet.html` wajib mencakup:
  - Google Fonts (Plus Jakarta Sans / Inter + JetBrains Mono untuk angka/kode).
  - `[x-cloak] { display: none !important; }` dan `html, body { overflow-x: hidden; overflow-x: clip; max-width: 100%; }`.
  - `.font-mono-num` untuk tabel/nominal angka (`tabular-nums`).
  - `.glass-card`, `.glass-nav`, glow ambient utilities, dan custom scrollbars.
  - `.date-picker-single-click` dan `.dark input[type="date"] { color-scheme: dark; }`.
  - `.safe-bottom` untuk bottom nav di mobile modern.
- `JavaScript.html` wajib punya:
  - Dua URL Apps Script:
    - `const PROD_WEB_APP_URL = 'https://script.google.com/macros/s/PROD_WEB_APP_URL_HERE/exec';`
    - `const DEV_WEB_APP_URL = 'https://script.google.com/macros/s/DEV_WEB_APP_URL_HERE/exec';`
    - `const WEB_APP_URLS = [PROD_WEB_APP_URL];` (pilih environment aktif)
  - `fetchFromAppsScript()` POST `{ action, args }` dengan header `'Content-Type': 'text/plain;charset=utf-8'` (preflight workaround); `runApi()` pakai `google.script.run` bila ada, else fetch (retry + `redirect: 'follow'`).
  - **`setupModernSwal()`**: Formatter universal untuk SweetAlert2 yang menyamakan seluruh dialog info, konfirmasi, peringatan, error/delete, dan toast dengan desain modern, glowing icon badge, dan gradient action button sesuai mode gelap/terang.
  - Anti-Inspect & DevTools protection guard dengan unlock shortcut `Ctrl+Alt+Shift+D` dan bypass otomatis di localhost.
  - `appData()` Alpine state dengan getter yang menegakkan business rules + baca kolom sheet by header name; `localStorage` session keys + first-paint data cache.
- Dark mode default = light; dark hanya saat user toggle (`localStorage.theme === 'dark'`).
- **NOL mock data.** Data dari backend GAS. Kalau DB kosong: tampilkan empty state + form create yang benar-benar insert. Seed lewat `setupDatabase()`.

---

## Phase 4 — Build Pipeline & Verify

Copy verbatim dari `skills/scaffold-project/templates/` (adaptasi placeholder):

| Template | Adapt |
|---|---|
| `build.js`, `build.sh` | copy as-is (salin `assets/`, `favicon.ico`, `logo.png`, dan inlines file) |
| `package.json` | `name` (`APP_SLUG`), `description` (deploy menggunakan `npx -y firebase-tools`) |
| `vercel.json`, `firebase.json`, `deploy-firebase.bat`, `.gitignore` | copy as-is (`firebase.json` dilengkapi security headers) |
| `templates/Stylesheet.html.blueprint` | jadikan basis `Stylesheet.html` |
| `templates/JavaScript.html.blueprint` | jadikan basis `JavaScript.html` |
| `templates/Code.gs.blueprint` | jadikan basis `Code.gs` |
| `.firebaserc` | `default` → `<APP_SLUG>` atau Firebase Project ID |
| `sw.js` | `CACHE_NAME` → `<slug>-v1` |
| `manifest.json` | `name`, `short_name`, `description`, `theme_color`/`background_color` dari token `design.md` |

Lalu jalankan:
```bash
npm install && npm run build
```
Perbaiki kegagalan, rebuild. `build.js` meng-inline `Stylesheet.html` + `JavaScript.html` ke tiap `*.html` dan menulis ke `dist/`.

---

## Phase 5 — Setup Backend & Deploy

Setelah build lolos, pandu user:

1. **Buat project Apps Script.** Buka <https://script.google.com/home> → New project. Rename `Code.gs` sesuai `__BACKEND_FILE__` (mis. `Code`) dan paste isi `Code.gs`.
2. **Tambah file HTML.** Buat `Index`, `Stylesheet`, `JavaScript` via File → New → HTML dan paste konten file yang cocok. Tanpa ini `doGet()` error "File HTML dengan nama Index tidak ditemukan".
3. **Jalankan `setupDatabase()`** sekali: pilih fungsi `setupDatabase` di editor → Run (authorize) → sheet + admin default dibuat.
4. **Deploy web app:** Deploy → New deployment → type *Web app* → Execute as *Me*, Who has access *Anyone* → Deploy. Copy URL `/exec`.
5. **Minta URL `/exec` dari user**, masukkan ke `WEB_APP_URLS` di `JavaScript.html`, lalu `npm run build` lagi.
6. **Deploy frontend (default Firebase Hosting):**
   - **Firebase Hosting (Recommended):** jalankan `deploy-firebase.bat` (Windows) atau `npm run deploy:firebase`. Ikuti login & tentukan Firebase Project ID.
   - **Vercel (opsi):** deploy folder `dist/` ke Vercel.
7. Ingatkan: setiap `Code.gs` berubah → redeploy versi baru Apps Script (Deploy → Manage deployments → Edit → New version), kalau tidak API menolak action baru dengan `Action not authorized`.

---

## Aturan (jangan dilanggar saat iterasi panjang)

1. **SELALU kirim kode FULL setiap revisi.** Sekecil apa pun — kirim ulang file utuh (`Code.gs` full / `Index.html` full / `JavaScript.html` full). DILARANG "ganti baris X jadi Y" atau snippet potongan.
2. **Satu file = satu blok kode.** Jangan pecah satu file ke beberapa blok.
3. **Revisi skema sheet = WAJIB step-by-step.** Jelaskan: apa yang berubah & kenapa → fungsi `Code.gs` mana yang berubah → apakah `setupDatabase()` perlu dijalankan ulang & risikonya (data lama) → bagian frontend yang ikut berubah.
4. **Jaga konsistensi `design.md` — VERBATIM.** Token visual tidak berubah saat menambah fitur. Screen baru → turunkan dari token yang sama.
5. **SELALU sync `runApi('name')` ↔ `ALLOWED_ACTIONS`.** Kalau tidak, API menolak dengan `Action not authorized`.
6. **SELALU `clearDataCache()` setelah write.**
7. **Boolean text `'TRUE'/'FALSE'`**, jangan simpan boolean JS.
8. **Sheet name apa adanya (PascalCase)**; header harus persis sama dengan key yang dibaca frontend.
9. **NOL mock data.**
10. **Tailwind v3 stable, bukan v4.** Token `design.md` dipetakan ke `theme.extend`.
11. **Match bahasa user.** Indonesia kalau user Indonesia; technical term tetap English.
12. **JANGAN sentuh `dist/`** — ubah source, rebuild.

---

## Contoh interaksi singkat

**user:** "design.md sudah jadi. build dengan GAS."

**asisten (Phase 0):**
> 🔒 Token terkunci dari design.md: background #0A0A0A, primary #0EDFE0 (cyan), font Geist, radius sm 4/md 8/lg 12/full 9999. Rule: "jangan pakai latar selain pure hitam". Akan saya pakai VERBATIM.

**asisten (Phase 1):**
> Saya rancang screen: public (landing + katalog + cek status), admin (dashboard + CRUD Produk/Kategori + transaksi). Sheet: Products, Categories, Orders, OrderDetails, Settings, admins. Relasi Products.CategoryID → Categories.CategoryID. Setuju?

**user:** "setuju"

**asisten:** *[Phase 2 → Code.gs FULL; Phase 3 → Index.html + JavaScript.html + Stylesheet.html FULL; Phase 4 → build + verify; Phase 5 → panduan setup Apps Script + Firebase]*

*[Iterasi: tiap revisi → kode FULL; revisi skema → step-by-step]*
