---
description: Buat file spesifikasi teknis lengkap (prd.md) dari ide aplikasi menggunakan skill generate-prd (blueprint GAS + Google Sheets + Alpine.js).
---

Generate file `prd.md` dari ide atau kebutuhan aplikasi menggunakan skill **generate-prd** (yang berada di `Mazte Projek Skill/skills/generate-prd/` atau `.agents/skills/generate-prd/`).

Langkah kerja:
1. Baca input ide dari `$ARGUMENTS` atau dari permintaan user (misal: "buatkan web toko kasir percetakan", "web landing page katalog produk", dsb.).
2. Bedah kebutuhan bisnis secara lengkap: Role Akses, Menu Publik & Admin/Kasir, Fitur Lengkap, Struktur Google Sheets (tabel & kolom), Relasi Data, dan Aturan Bisnis (Business Logic).
3. Simpan hasilnya langsung ke file `prd.md` di root project.
4. Buat diagram Mermaid ERD terpisah yang memetakan relasi antar Sheet.
5. Setelah `prd.md` tersimpan, tawarkan user untuk langsung melanjutkan ke tahap scaffolding aplikasi menggunakan perintah `/init` atau skill **scaffold-project**.
