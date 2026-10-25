---
description: Jalankan filter Anti Slop (38 aturan R-01..R-38 + Delivery Gate) untuk membersihkan UI, copy, aksesibilitas, layout mobile, dan komentar kode dari ciri khas output AI.
---

Terapkan **Anti Slop** (skills `antislop*`, disalin dari github.com/miqdadbadjuber/anti-slop) untuk: $ARGUMENTS

Langkah:
1. Baca **core** `skills/antislop/SKILL.md` (selalu). Lalu baca skill tambahan sesuai pekerjaan:
   - UI/visual → `skills/antislop-ui/SKILL.md`
   - Copy/teks → `skills/antislop-copywriting/SKILL.md`
   - Aksesibilitas → `skills/antislop-human/SKILL.md`
   - Layout mobile/responsif → `skills/antislop-layoutmobile/SKILL.md`
   - Komentar kode → `skills/antislop-code/SKILL.md`
2. **Resolve mode** sesuai bagian "Two Usage Modes" core: **during** (membangun) atau **after** (audit). Tanyakan bila belum jelas, dan umumkan `antislop active: <mode>` sekali.
3. **Resolver arah desain dulu (R-37):** Anti Slop adalah **filter, bukan sumber arah**. Kalau ada `design.md` (dari skill `design-analyst`) atau `prd.md`, pakai sebagai arah; kalau tidak ada, minta user isi arah atau tandai hasilnya `draft without direction` + dial ENERGY 1 / RHYTHM 1 / MOTION 1.
4. Terapkan aturan. Di akhir, jalankan **Delivery Gate** (4 blok PASS/FAIL) sebelum menyerahkan hasil. Jangan pernah menyerahkan hasil yang masih ada FAIL.

Catatan: rule ini selaras dengan konvensi repo (NOL mock data ↔ R-17/R-18/R-36/R-38; WCAG ↔ R-25; status kosong/loading/error ↔ R-27). Aturan yang sudah dipakai skill lain tidak perlu diduplikasi.
