# Catatan Instalasi — Mazte Projek Skill

Dokumen ini berisi **semua dependensi yang harus diinstal manual** oleh user di komputer baru sebelum menggunakan skill ini. Skill ini tidak bisa menginstal dependensi sistem secara otomatis.

---

## Ringkasan

| Software | Wajib? | Versi Minimum | Untuk Skill |
|----------|--------|---------------|-------------|
| **Antigravity CLI / opencode** | Ya | Terbaru | Runner AI Coding utama |
| **generate-prd** | Terintegrasi | - | Built-in prompt engineer (tanpa dependensi luar) |
| **Node.js + npm** | Ya | 18.x LTS | scaffold-project, generate-assets |
| **Python 3** | Ya | 3.9+ | ui-ux-pro-max |
| **Firebase CLI** | Disarankan | Terbaru | Deploy Firebase Hosting (`deploy-firebase.bat`) |
| **Git** | Disarankan | 2.x | Version control |

---

## A. Instalasi di Windows

### 1. openencode (CLI AI coding)

```powershell
# Instal opencode via npm (global)
npm install -g opencode

# Verifikasi
opencode --version
```

> Jika belum ada npm, instal Node.js dulu (langkah 2).

---

### 2. Node.js + npm

**Opsi A — Installer resmi (disarankan)**
1. Download LTS installer dari https://nodejs.org
2. Pilih versi **18.x LTS** atau **20.x LTS** (64-bit .msi)
3. Jalankan installer, centang **"Automatically install the necessary tools"** (ini penting untuk `sharp` — menginstal Chocolatey + Visual Studio Build Tools + Python)
4. Setelah selesai, buka Command Prompt / PowerShell baru dan verifikasi:
   ```powershell
   node --version   # harus >= v18
   npm --version    # harus >= v9
   ```

**Opsi B — Chocolatey (jika sudah terpasang)**
```powershell
choco install nodejs-lts
```

**Verifikasi tambahan (build tools untuk sharp):**
```powershell
npm install -g node-gyp
```
> `sharp` (dipakai generate-assets untuk konversi SVG → PNG) butuh compiler C++ dan Python. Centang opsi "Automatically install tools" saat instal Node.js sudah mencakup ini.

---

### 3. Python 3

**Opsi A — Python.org (disarankan)**
1. Download installer dari https://python.org/downloads
2. Pilih versi **3.9 atau lebih baru** (3.11 atau 3.12 disarankan)
3. Saat instalasi, **centang "Add Python to PATH"**
4. Setelah selesai, verifikasi:
   ```powershell
   python --version
   ```
   > Di Windows, perintahnya `python` bukan `python3`.

**Opsi B — Chocolatey**
```powershell
choco install python
```

**Opsi C — Microsoft Store**
- Cari "Python 3.12" di Microsoft Store, klik Install.

> Python untuk skill `ui-ux-pro-max` hanya pakai **standard library** (csv, pathlib, json, argparse, dsb.) — tidak ada pip install tambahan.

---

### 4. Git

1. Download dari https://git-scm.com/download/win
2. Install dengan opsi default.
3. Verifikasi:
   ```powershell
   git --version
   ```

---

## B. Instalasi di Linux (Ubuntu/Debian)

### 1. opencode (CLI AI coding)

```bash
# Instal opencode via npm (global)
npm install -g opencode

# Verifikasi
opencode --version
```

---

### 2. Node.js + npm (via NodeSource)

```bash
# Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Verifikasi
node --version
npm --version
```

> **Catatan untuk pengguna Fedora/RHEL/Arch:** ganti perintah sesuai package manager distro masing-masing.

---

### 3. Build tools untuk sharp

```bash
# Ubuntu/Debian
sudo apt install build-essential python3 -y

# Fedora
sudo dnf groupinstall "Development Tools"
sudo dnf install python3

# Arch
sudo pacman -S base-devel python3
```

> `sharp` (npm) meng-compile native addon saat `npm install`. Jika build tools tidak ada, `generate-icons.js` akan gagal saat auto-install sharp.

---

### 4. Python 3

```bash
# Ubuntu/Debian (biasanya sudah terpasang)
sudo apt install python3 -y

# Verifikasi
python3 --version   # harus >= 3.9
```

> Skill `ui-ux-pro-max` menggunakan Python 3 dengan **standard library saja** — tidak perlu `pip install` apa pun.

---

### 5. Git

```bash
# Ubuntu/Debian
sudo apt install git -y

# Fedora
sudo dnf install git -y

# Arch
sudo pacman -S git
```

---

## C. Instalasi di Linux (ringkasan satu perintah)

### Ubuntu/Debian
```bash
# 1. Build tools
sudo apt update && sudo apt install -y build-essential python3 git curl

# 2. Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# 3. opencode
npm install -g opencode

# 4. Verifikasi
echo "=== Verifikasi ==="
node --version
npm --version
python3 --version
git --version
opencode --version
```

### Fedora/RHEL
```bash
sudo dnf groupinstall "Development Tools"
sudo dnf install python3 git curl
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install nodejs -y
npm install -g opencode
```

### Arch
```bash
sudo pacman -S base-devel python3 git curl nodejs npm
npm install -g opencode
```

---

## D. Setup Awal Skill (setelah semua dependensi terpasang)

Setelah semua software di atas terinstal, langkah setup skill:

1. **Salin folder** `Mazte Projek Skill/` ke root project baru (atau gunakan sebagai skill di opencode config).

2. **Buat `opencode.json`** di root project:
   ```json
   {
     "$schema": "https://opencode.ai/config.json",
     "skills": { "paths": ["Mazte Projek Skill/skills"] },
     "command": {
       "init": {
         "description": "Scaffold a new project from prd.md (GAS + Google Sheets + Vercel).",
         "template": "Scaffold this project from prd.md using the **scaffold-project** skill in `Mazte Projek Skill/skills/scaffold-project/`. Baca prd.md, salin boilerplate dari templates/, buat Code.gs + Index.html/JavaScript.html/Stylesheet.html, tulis AGENTS.md dari AGENTS.md.blueprint, lalu verifikasi dengan `npm install && npm run build`."
       }
     }
   }
   ```

3. **Buat `prd.md`** di root project (lihat `prd.md.example` sebagai template).

4. **Restart opencode**, lalu jalankan `/init`.

---

## E. Dependensi Per Skill (detail)

### scaffold-project
- **Node.js + npm**: `npm install && npm run build`
- npm packages yang diinstal per project (dari `templates/package.json`):
  - `serve` — dev server lokal
- Tidak ada dependensi Python.

### ui-ux-pro-max
- **Python 3** (stdlib only)
- Script: `core.py`, `search.py`, `design_system.py`, `validate_data.py`
- Module stdlib: `csv`, `re`, `pathlib`, `math`, `collections`, `json`, `os`, `sys`, `io`, `datetime`, `argparse`
- **Tidak** perlu pip install.

### generate-assets
- **Node.js + npm**
- `sharp` — diinstal otomatis saat `generate-icons.js` dijalankan (`npm install sharp --no-save`)
- `sharp` butuh build tools (compiler C++) — sudah tercakup di langkah instalasi Node.js di atas.

---

## F. Opsional / Tambahan

| Software | Keterangan |
|----------|------------|
| **Firebase CLI** | Untuk deploy ke Firebase Hosting (`npm install -g firebase-tools` atau otomatis via `deploy-firebase.bat`) |
| **Vercel CLI** | Untuk deploy ke Vercel (`npm install -g vercel`), opsi alternatif selain Firebase |
| **Google Apps Script** | Web-based (script.google.com), tidak perlu instalasi |
| **Browser modern** | Chrome, Firefox, atau Edge untuk testing PWA + favicon SVG |

---

## G. Panduan Lengkap Deploy ke Firebase Hosting

Firebase Hosting adalah layanan hosting statis dari Google yang sangat cepat, gratis, mendukung HTTPS otomatis, custom domain gratis, dan terintegrasi baik dengan ekosistem Google.

### Langkah 1: Buat Project di Firebase Console
1. Buka browser dan kunjungi **[Firebase Console](https://console.firebase.google.com/)**.
2. Login menggunakan **Akun Google** Anda.
3. Klik tombol **"Add project"** (atau **"Tambahkan project"**).
4. Masukkan **Nama Project** (misalnya: `ceisya-shop-store` atau `inventori-gudang`).
5. Perhatikan **Project ID** unik di bawah nama project (misal `ceisya-shop-store-8899`). *Catat ID ini karena akan dipakai di `.firebaserc`*.
6. Klik **Continue**.
7. Pada pilihan Google Analytics, Anda bisa mematikan toggle (opsional) atau membiarkannya aktif, lalu klik **Create project**.
8. Tunggu proses pembuatan project selama beberapa detik hingga muncul pesan *"Your new project is ready"*, lalu klik **Continue**.

### Langkah 2: Aktifkan Menu Hosting di Firebase Console
1. Di halaman dashboard project Firebase, buka menu sidebar kiri: **Build** → **Hosting**.
2. Klik tombol **Get started** (atau **Mulai**).
3. Anda akan melihat petunjuk instalasi CLI (bisa klik **Next** → **Next** → **Continue to console** karena file konfigurasi sudah disediakan otomatis oleh skill ini).

### Langkah 3: Deploy Project (Otomatis via `.bat` di Windows)
Setiap project baru hasil generate sudah memiliki file `deploy-firebase.bat`, `firebase.json`, dan `.firebaserc`.

1. **Jalankan `deploy-firebase.bat`** (cukup klik ganda / double-click file ini di root folder project Anda).
2. Script akan otomatis melakukan:
   - Memeriksa instalasi Node.js & npm.
   - Memeriksa `firebase-tools` (jika belum ada, script akan menawarkan instalasi otomatis).
   - Menjalankan `npm run build` untuk meng-compile frontend ke folder `dist/`.
   - Memeriksa status login Firebase (akan membuka browser untuk login jika belum).
   - Meminta **Firebase Project ID** yang sudah Anda buat di Langkah 1 (hanya saat pertama kali).
   - Melakukan upload/deploy folder `dist/` ke Firebase Hosting.
3. Setelah selesai, terminal akan menampilkan URL website Anda yang sudah live:
   - `https://<project-id>.web.app`
   - `https://<project-id>.firebaseapp.com`

### Langkah 4: Deploy Manual via Terminal (Linux / Mac / Windows)
Jika tidak ingin menggunakan file `.bat`:
```bash
# 1. Instal Firebase CLI (jika belum)
npm install -g firebase-tools

# 2. Login ke akun Google Anda
firebase login

# 3. Set Project ID pada .firebaserc (ganti PROJECT_ID dengan Project ID Anda)
# Atau jalankan: firebase use --add

# 4. Build dan Deploy
npm run deploy:firebase
# atau:
npm run build && firebase deploy --only hosting
```

### Langkah 5: Update Website di Masa Depan
Setiap kali ada perubahan kode di project lokal:
1. Pastikan backend Google Apps Script sudah di-deploy ke versi terbaru (jika ada perubahan `Code.gs`).
2. Cukup klik ganda kembali file `deploy-firebase.bat` (atau jalankan `npm run deploy:firebase`).
3. Website di Firebase Hosting akan langsung terupdate dalam hitungan detik.

---

## H. Troubleshooting

### `npm install` gagal dengan error `node-gyp` / `gyp ERR!`
→ Build tools tidak terpasang. Di Windows: jalankan ulang installer Node.js dan centang "Automatically install tools". Di Linux: `sudo apt install build-essential python3`.

### `sharp` gagal compile
→ Pastikan compiler C++ dan Python tersedia. Di Windows: `npm install --global windows-build-tools` (via PowerShell admin). Di Linux: `sudo apt install build-essential`.

### `python3: command not found` (Linux)
→ Ganti dengan `python3` jika pakai Ubuntu/Debian, atau `python` untuk distro lain. Skill `ui-ux-pro-max` otomatis mendeteksi: pertama coba `python3`, fallback ke `python`.

### `python` tidak dikenali (Windows)
→ Pastikan "Add Python to PATH" dicentang saat instalasi. Atau gunakan Python dari Microsoft Store.

### `opencode: command not found`
→ npm global packages belum di PATH. Di Windows: restart terminal. Di Linux: pastikan `~/.npm-global/bin` atau `$(npm config get prefix)/bin` ada di `$PATH`.

### `firebase: command not found` / deploy gagal
→ Jalankan `npm install -g firebase-tools` di terminal / CMD Administrator.

### `Error: Failed to authenticate, have you run firebase login?`
→ Sesi login Anda berakhir. Jalankan `firebase login --reauth` di terminal.

### `Error: HTTP Error: 404, Project '<project-id>' not found`
→ Project ID di `.firebaserc` salah atau belum dibuat di Firebase Console. Buka file `.firebaserc` dan pastikan field `default` sesuai dengan Project ID di Firebase Console (Settings → General → Project ID).

