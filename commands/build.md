---
description: Build aplikasi Google Apps Script (Code.gs + Index.html) dari design.md memakai skill gas-builder, lalu deploy ke Firebase Hosting (default). Backend Supabase hanya bila user minta.
---

Jalankan skill **gas-builder** (`skills/gas-builder/SKILL.md`).

Langkah:
1. Pastikan ada `design.md` di root project (atau path dari `$ARGUMENTS`). Kalau belum ada, jalankan skill **design-analyst** dulu.
2. **Token Lock**: restate token `design.md` (warna, font, radius, spacing) — dipakai VERBATIM.
3. Rancang screen/route + tabel Google Sheets (konfirmasi ke user).
4. Generate `Code.gs` (backend GAS + Sheets CRUD + cache + `doPost` JSON API dengan `ALLOWED_ACTIONS`).
5. Generate frontend `Index.html` + `JavaScript.html` + `Stylesheet.html` (Alpine.js + **Tailwind v3 stable** (`cdn.tailwindcss.com`) dengan token `design.md` di `theme.extend`; NOL mock data).
6. Copy build pipeline dari `skills/scaffold-project/templates/` lalu verifikasi dengan `npm install && npm run build`.
7. Pandu setup Apps Script (`setupDatabase()`, deploy web app), masukkan URL `/exec` ke `WEB_APP_URLS`, rebuild, lalu **deploy Firebase Hosting** (`deploy-firebase.bat` / `npm run deploy:firebase`).

Catatan: jika `$ARGUMENTS` secara eksplisit menyebut **Supabase**, gunakan skill **supabase-builder** (opsional) sebagai gantinya.

Konteks tambahan dari user: $ARGUMENTS
