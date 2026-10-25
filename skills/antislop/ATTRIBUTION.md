# Atribusi — Anti Slop

Skill `antislop*` di folder ini **bukan karya repo ini**. Disalin dari:

- **Repo:** https://github.com/miqdadbadjuber/anti-slop
- **Versi:** `3.2.20` (lihat `skills/antislop/VERSION`)
- **Lisensi:** MIT (lihat `skills/antislop/LICENSE`)

## Isi yang disalin

| Folder | Peran |
|---|---|
| `skills/antislop/` | Core — 38 aturan (R-01..R-38), Delivery Gate, Liveliness Toolkit |
| `skills/antislop/reference/antislop.md` | Single-file core (untuk paste ke chat apa pun) |
| `skills/antislop-ui/` | Pola slop UI/visual |
| `skills/antislop-copywriting/` | Pola slop copywriting (fake stats, buzzword) |
| `skills/antislop-human/` | Aksesibilitas (kontras, keyboard, focus) + `contrast-check.py` |
| `skills/antislop-layoutmobile/` | Slop layout responsif |
| `skills/antislop-code/` | Higiene komentar kode |

## Perubahan dari sumber

- Struktur folder di-*flatten* agar sesuai konvensi OpenCode repo ini (`skills/<nama>/SKILL.md`). Di repo asal, keenam skill berada di bawah `skills/` yang sama.
- `antislop.md` dipindah ke `skills/antislop/reference/`.
- **Isi SKILL.md tidak diubah** — aturan, nomor, dan Delivery Gate apa adanya, supaya tetap sinkron dengan sumber dan angka versi.

## Cara update

Salin ulang folder skill dari release sumber yang lebih baru, lalu sesuaikan `VERSION` dan tabel di atas. Jangan mengedit isi SKILL.md agar tidak menyimpang dari upstream.
