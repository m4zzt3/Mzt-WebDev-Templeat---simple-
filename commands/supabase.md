---
description: OPSIONAL. Generate app full-stack Supabase (Postgres + Auth + RLS) dari design.md memakai skill supabase-builder — alternatif dari Firebase/GAS default.
---

Jalankan skill **supabase-builder** (`skills/supabase-builder/SKILL.md`) — **OPSIONAL**.

Langkah:
1. Pastikan ada `design.md` di root project. Kalau belum, jalankan **design-analyst** dulu.
2. **Token Lock**: restate token `design.md` — dipakai VERBATIM (JANGAN ganti hex/font).
3. Rancang routes (hash router) + tabel Supabase (konfirmasi ke user).
4. Minta creds: **Project URL** + **anon public key**. Tolak `service_role`/DB password.
5. Generate **SQL migration FULL** (tables + indexes + RLS + policies + trigger opsional) + langkah paste ke SQL Editor.
6. Generate `index.html` (hash router) + `script.js` (CDN Supabase) memakai **Tailwind v3 stable** + token `design.md` di `theme.extend`. NOL mock data.

Konteks tambahan dari user: $ARGUMENTS
