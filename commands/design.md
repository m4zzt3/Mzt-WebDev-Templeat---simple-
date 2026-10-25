---
description: Analisa 1-3 screenshot UI → generate design.md (design system lengkap) memakai skill design-analyst. Lampirkan gambar, atau sebut konteks di argumen.
---

Jalankan skill **design-analyst** (`skills/design-analyst/SKILL.md`).

Langkah:
1. Minta/terima **1-3 screenshot UI** referensi (screenshot, mockup, atau sketsa). Kalau belum ada gambar, minta user upload dulu.
2. Lakukan **visual audit 12 dimensi** (silent) memakai vocabulary dari `skills/design-analyst/reference/uiux-dictionary.md`.
3. Sajikan **design audit** ringkas (padat, scannable, bahasa Indonesia + technical term English).
4. **Default: zero-question** — langsung generate `design.md` lengkap (tanpa placeholder tak perlu). Mode klarifikasi hanya jika `$ARGUMENTS` meminta, atau gambar ambigu.
5. Tulis `design.md` ke root project, lalu arahkan user ke **gas-builder** (default) atau **supabase-builder** (opsional).

Konteks tambahan dari user: $ARGUMENTS
