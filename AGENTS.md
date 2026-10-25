# AGENTS.md — Mazte Projek Skill (Template Paket Skill)

Repo ini **bukan aplikasi** — ini paket skill portabel untuk agent (OpenCode / Google Antigravity CLI) yang **men-generate project web app baru** (Google Apps Script + Google Sheets backend, Alpine.js + Tailwind frontend, deploy Firebase Hosting / Vercel). Saat bekerja di repo ini, Anda mengedit *skill-nya*, bukan menjalankan build aplikasi.

## Struktur & sumber kebenaran

- `skills/` — versi kanonik skill. **Edit di sini.** Isi: requirement-flow (`generate-prd`, `scaffold-project`, `generate-assets`, `ui-ux-pro-max`) + design-flow (`design-analyst`, `gas-builder`, `supabase-builder`) + **vendored** (`antislop`, `antislop-ui`, `antislop-copywriting`, `antislop-human`, `antislop-layoutmobile`, `antislop-code`).
- `.agents/skills/` — salinan untuk Antigravity. **Harus identik dengan `skills/`** (dulu sempat stale). Setelah mengubah skill, jalankan sinkronisasi (lihat bawah); jangan biarkan kedua pohon menyimpang.
- `commands/` — definisi slash command: `/prd`, `/init` (requirement-flow), `/design`, `/build`, `/supabase` (design-flow), `/slop` (filter anti-slop). Path di dalamnya harus cocok dengan struktur aktual.
- `STITCH UIUX/` — **dokumentasi + arsip** alur design-first (bukan kode eksekusi). Skill aktifnya ada di `skills/`; prompt asli lama di `STITCH UIUX/_archive/`. Lihat `STITCH UIUX/README.md`.
- Verifikasi build nyata terjadi di **project hasil scaffold**, bukan di repo ini.

## Anti Slop (vendored — JANGAN edit isinya)

- `skills/antislop*/` disalin dari <https://github.com/miqdadbadjuber/anti-slop> (versi di `skills/antislop/VERSION`, lisensi MIT di `skills/antislop/LICENSE`, atribusi di `skills/antislop/ATTRIBUTION.md`).
- **Peran: filter, bukan sumber arah.** Dijalankan bersama `design.md`/`prd.md`: `design.md` = arah; antislop = hapus slop + wajibkan liveliness (dial ENERGY/RHYTHM/MOTION) + Delivery Gate PASS/FAIL.
- **Jangan mengedit isi `SKILL.md` antislop\*** — aturan (R-01..R-38) dirujuk silang antar-skill dan ke core; edit = menyimpang dari upstream. Untuk update, salin ulang dari release sumber.
- Struktur di-*flatten* agar cocok konvensi OpenCode (`skills/<nama>/SKILL.md`); `antislop.md` di `skills/antislop/reference/`.
- Aturan antislop yang tumpang-tindih dengan konvensi repo (jangan diduplikasi, cukup dirujuk): R-17/R-18/R-36/R-38 ↔ NOL mock data; R-25 ↔ WCAG AA; R-27 ↔ state kosong/loading/error; R-03/R-32 ↔ mobile + keyboard.

## Cara pakai (perilaku yang harus dipahami agent)

Pipeline otomatis 4 langkah: permintaan user → `generate-prd` (tulis `prd.md`) → `scaffold-project` (`Code.gs`, `Index.html`, `JavaScript.html`, `Stylesheet.html`, `AGENTS.md`) → `generate-assets` (favicon/logo/PWA) → deploy.

- `/prd <ide>` — hanya generate `prd.md`.
- `/init <ide atau path prd>` — generate `prd.md` bila belum ada, lalu scaffold penuh + build.

**Alur design-first (dari screenshot):** `/design` (screenshot → `design.md` via `design-analyst`) → `/build` (→ `Code.gs` + `Index.html` via `gas-builder`, deploy Firebase) atau `/supabase` (**OPSIONAL**, → app Supabase via `supabase-builder`). Filter `/slop` (anti-slop) dijalankan bersama alur ini.

Config contoh: `opencode.json.example` (paths `skills`, command `design`/`build`/`supabase`/`prd`/`init`/`slop`) dan `opencode.model.example.json`. File asli (`opencode.json`) tidak dikomit — salin dari `.example`.

## Aturan penting saat mengedit skill

- **Kontrak backend ↔ frontend (scaffold-project)**: setiap `runApi('nama')` harus terdaftar di `ALLOWED_ACTIONS` dalam `doPost()`; setelah setiap penulisan data panggil `clearDataCache()`; boolean disimpan sebagai string `'TRUE'`/`'FALSE'`; tanggal `dd/MM/yyyy`; ID `'PREFIX-' + new Date().getTime()`.
- **Selalu ubah source, jangan `dist/`** — `build.js` meng-inline `Stylesheet.html` + `JavaScript.html` ke tiap `*.html` (selain keduanya) dan menjadikan nama file output lowercase. `build.sh` adalah padanan bash `build.js`; jika mengubah filename mapping atau regex include di `build.js`, samakan `build.sh`.
- Skill bersifat instruksional: dokumen utama tiap skill adalah `skills/<nama>/SKILL.md` (frontmatter `name` + `description` wajib). Efek samping skill ditentukan teks SKILL.md + `templates/`, jadi perubahan perilaku = edit teks itu.
- Boilerplate yang dikopi verbatim ke project hasil terletak di `skills/scaffold-project/templates/` dan `skills/generate-assets/templates/`. Placeholder `AGENTS.md.blueprint` (`__APP_NAME__`, `__CACHE_PREFIX___`, `__SHEETS_SECTION__`, dst.) harus diisi oleh skill saat scaffold.
- **Design-flow (`design-analyst` → `gas-builder`/`supabase-builder`) punya Hard Lock yang sama**: `design.md` = kontrak, token visual (hex/font/radius/spacing) dipakai **VERBATIM** — halaman baru diturunkan dari token yang sama, bukan palette baru. **NOL mock data** (semua dari `google.script.run`/`runApi()` atau Supabase `db.from(...)`).
- **`gas-builder` adalah "PROMPT B" yang dulu hilang** — ia **tidak punya `templates/` sendiri**; ia menyalin pipeline build dari `skills/scaffold-project/templates/`, jadi ubahan pada build pipeline scaffold otomatis berlaku ke gas-builder. Menambah skill baru berarti menambah baris di `opencode.json.example` + `commands/` + README.
- **Tailwind: WAJIB v3 stable (`cdn.tailwindcss.com` + `tailwind.config` JS dengan token di `theme.extend`), BUKAN v4 (`@tailwindcss/browser@4`/`@theme`)** — v4 gagal compile di sandbox iframe (mis. Gemini Canvas) → halaman putih. Ini diulang di semua skill builder; jangan "memperbaiki"-nya ke v4.

## Sinkronisasi `skills/` → `.agents/skills/`

Setelah mengubah apa pun di `skills/`, samakan salinan Antigravity:

```powershell
Remove-Item -Recurse -Force ".agents\skills"; Copy-Item -Recurse -Force "skills" ".agents\skills"
```

`.agents/skills/ui-ux-pro-max/scripts/__pycache__/` boleh ada (bytecode); jangan dijadikan sumber kebenaran. `skills/antislop-human/contrast-check.py` juga Python 3 (stdlib) — dipakai untuk cek kontras WCAG.

## Dependensi runtime (dari `catatan.md`)

- **Node.js 18+/20+** — scaffold-project & generate-assets (`npm install && npm run build`).
- **Python 3.9+** — hanya untuk `skills/ui-ux-pro-max/scripts/*.py`; **stdlib saja, tanpa pip install**. Di Windows pakai `python`, bukan `python3`. Script auto-detect encoding UTF-8 untuk emoji di Windows.
- **`sharp`** (via `generate-icons.js`, `npm install sharp --no-save`) untuk SVG→PNG; butuh build tools C++ (Windows: centang "Automatically install tools" saat install Node). Tanpa `sharp`, SVG tetap valid sebagai favicon/PWA di browser modern.
- Contoh pemakaian ui-ux-pro-max: `python skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "Nama"`; tambah `--persist --output-dir <project-root>` untuk menyimpan ke `design-system/<project-slug>/MASTER.md` (tanpa `--force`, akan **skip jika sudah ada**). Data skill ada di `skills/ui-ux-pro-max/data/*.csv` + `data/stacks/*.csv`.

## Quirk & gotcha

- Repo ini terhubung ke Git remote `https://github.com/m4zzt3/Mzt-WebDev-Templeat---simple-.git` (branch `main`).
- File `opencode.json` dan `prd.md` asli **tidak** ada di root template ini dengan nama itu — hanya versi `.example`/template. `AGENTS.md` root ada (file ini). Jangan menganggap `.example` sebagai konfigurasi aktif.
- Output `dist/` dan `__pycache__/` (mis. `scripts/__pycache__/*.pyc`) tidak untuk diedit/dikomit.
