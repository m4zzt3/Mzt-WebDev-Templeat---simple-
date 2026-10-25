# 🎨 STITCH UIUX — Design-First Pipeline

Folder ini adalah dokumentasi + titik masuk untuk alur **"design-first"**: dari screenshot UI referensi → design system → aplikasi full-stack.

Skill-nya sendiri hidup di `skills/` (bisa dipanggil dari OpenCode / Antigravity). Folder ini menyimpan README + arsip prompt lama.

---

## Skill aktif (di `../skills/`)

| Skill | Peran | Output |
|---|---|---|
| **`design-analyst`** | Upload 1-3 screenshot → audit visual 12 dimensi → design system | `design.md` (+ Stitch prompt opsional) |
| **`gas-builder`** | `design.md` → aplikasi Google Apps Script (Sheets backend, Alpine.js + Tailwind) | `Code.gs`, `Index.html`, `JavaScript.html`, `Stylesheet.html`, `dist/` |
| **`gas-builder`** + Firebase | **Deploy default** | Firebase Hosting (atau Vercel sebagai opsi) |
| **`supabase-builder`** | **OPSIONAL** — `design.md` → app Supabase (Postgres/Auth/RLS), preview Gemini Canvas | `index.html`, `script.js`, SQL migration |
| **`antislop*`** | **Filter** (bukan sumber arah) — bersihkan UI/copy/a11y/layout/code dari ciri output AI | PASS/FAIL Delivery Gate |

> **Backend default repo ini adalah Google Apps Script + Google Sheets dengan deploy Firebase Hosting.**
> Supabase hanya dipakai bila user eksplisit menerima opsi itu.
>
> **Anti Slop** (dari <https://github.com/miqdadbadjuber/anti-slop>) berperan sebagai **filter** yang dijalankan bersama `design.md`. `design.md` memberi *arah*; antislop menghapus *slop*. Keduanya beda peran — lihat `skills/antislop/ATTRIBUTION.md`.

---

## Alur utama (default: GAS + Firebase)

```
screenshot UI (1-3)
   ↓  design-analyst
design.md   ← token terkunci (warna, font, radius, spacing VERBATIM)
   ↓  gas-builder
Code.gs + Index.html + JavaScript.html + Stylesheet.html
   ↓  npm install && npm run build
dist/
   ↓  deploy-firebase.bat / npm run deploy:firebase
Firebase Hosting   → live 🚀
```

Skill `gas-builder` memakai boilerplate `build.js` yang **sama** dengan `skills/scaffold-project` — jadi outputnya konsisten entah mulai dari `design.md` (desain-dulu) atau `prd.md` (requirement-dulu).

**Filter Anti Slop di sepanjang alur.** Setelah `design.md` ada, jalankan filter `antislop*` (lewat `/slop` atau dengan memanggil skill-nya) selagi `gas-builder` membangun:
- `design.md` = **arah** (identity, palette, typography, mood).
- `antislop` = **filter** (hapus slop + wajib "liveliness": dial ENERGY/RHYTHM/MOTION).
- Builder harus lulus **Delivery Gate** (4 blok PASS/FAIL) sebelum hasil dinyatakan selesai.

## Alur alternatif (OPSIONAL: Supabase)

```
design.md
   ↓  supabase-builder
index.html + script.js + SQL migration
   ↓  (preview single-file, mis. Gemini Canvas)
Supabase (Postgres + Auth + RLS)
```

---

## Hard Lock yang berlaku di semua builder

1. **`design.md` = hukum, bukan inspirasi.** Token visual disalin **VERBATIM**. Halaman baru → turunkan dari token yang sama, jangan ngarang palette/font baru.
2. **NOL mock data.** Semua data dari backend (Sheets via `google.script.run`/`runApi()`, atau Supabase via `db.from(...)`). Array hardcoded = gagal.
3. **Tailwind v3 stable, BUKAN v4.** Selalu `cdn.tailwindcss.com` + `tailwind.config` JS. `@tailwindcss/browser@4` + `@theme` **gagal compile di sandbox iframe** (mis. Gemini Canvas) → halaman putih polos.
4. **WCAG AA.** Hitung contrast ratio; target 4.5:1 body / 3:1 large text.
5. **Anti Slop = filter, bukan arah.** Jalankan bersama `design.md`. Aturannya (R-01..R-38 + Delivery Gate) **tidak boleh diedit** — itu diatur upstream; lihat `skills/antislop/ATTRIBUTION.md`. Aturan antislop yang sudah sejalan dengan Hard Lock di atas: R-17/R-18/R-36/R-38 (NOL data fiktif ↔ NOL mock data), R-25 (WCAG), R-27 (state kosong/loading/error), R-03/R-32 (mobile + keyboard).

---

## Arsip

Prompt asli (sudah dikonsolidasi) ada di `_archive/`:

| File arsip | Menjadi |
|---|---|
| `UIUX_TECHNICAL_DICTIONARY.md` | `skills/design-analyst/reference/uiux-dictionary.md` |
| `PROMPT_A_VISUAL_ANALYST.md` | `skills/design-analyst/SKILL.md` (zero-question, digabung) |
| `STITCH_PROMPT_GENERATOR.md` | `skills/design-analyst/SKILL.md` (mode klarifikasi opsional) |
| `SUPABASE_BUILDER.md` | `skills/supabase-builder/SKILL.md` (ditandai OPSIONAL) |
| `UIUX STITCH FULL VERSI.md` | Gabungan semua di atas, kini dipecah ke skill terpisah |

Yang **ditambahkan** (tidak ada di arsip): **`skills/gas-builder/`** — "PROMPT B" yang hilang, penghubung `design.md` → `Code.gs` + `Index.html`.
