---
description: Scaffold a new project from prd.md using the blueprint (GAS + Google Sheets + Firebase/Vercel) and write AGENTS.md. Automatically generates prd.md first if it does not exist.
---

Scaffold this project from `prd.md` using the **scaffold-project** skill (located in `Mazte Projek Skill/skills/scaffold-project/` or `.agents/skills/scaffold-project/`).

Steps:
1. **Periksa `prd.md`**:
   - Jika file `prd.md` belum ada di root project, atau jika `$ARGUMENTS` berisi ide aplikasi (contoh: "buatkan web toko kasir percetakan"), jalankan skill **generate-prd** terlebih dahulu untuk menghasilkan dan menyimpan file `prd.md`.
   - Jika `$ARGUMENTS` adalah path file PRD, baca file tersebut; jika `prd.md` sudah ada di root, gunakan file yang sudah ada.
2. **Jalankan alur scaffold-project**:
   - Salin boilerplate dari `templates/` (`build.js`, `build.sh`, `package.json`, `vercel.json`, `firebase.json`, `.firebaserc`, `deploy-firebase.bat`, `sw.js`, `manifest.json`, `.gitignore`).
   - Buat backend Google Apps Script (`Code.gs`) yang mencakup CRUD setiap sheet, otentikasi, cache, dan JSON API `doPost`.
   - Buat frontend Alpine.js (`Index.html`, `JavaScript.html`, `Stylesheet.html`) dengan tema dan data yang sesuai dengan `prd.md`.
   - Buat dokumentasi `AGENTS.md` dari template `AGENTS.md.blueprint`.
3. **Verifikasi build**:
   - Jalankan `npm install && npm run build`, pastikan build sukses ke folder `dist/`.
4. **Generate Assets (Favicon & Logo)**:
   - Jalankan skill **generate-assets** untuk membuat logo dan favicon sesuai nama aplikasi dan warna brand dari `prd.md`.
5. **Panduan Setup Apps Script**:
   - Berikan panduan kepada user untuk membuat project Apps Script di script.google.com, memasukkan `Code.gs` dan file HTML, menjalankan `setupDatabase()`, serta melakukan Deploy Web App.
6. **Hubungkan Web App URL**:
   - Masukkan URL `/exec` ke dalam `WEB_APP_URLS` di `JavaScript.html`, rebuild dengan `npm run build`, dan jelaskan langkah deploy ke Firebase Hosting (`deploy-firebase.bat`) atau Vercel.
