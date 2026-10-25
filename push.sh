#!/usr/bin/env bash
set -e

echo "==================================================="
echo "    MAZTE WEBDEV TEMPLATE - GIT AUTO PUSH (Linux)"
echo "==================================================="
echo "Remote: https://github.com/m4zzt3/Mzt-WebDev-Templeat---simple-.git"
echo ""

read -rp "Masukkan pesan pembaruan (tekan Enter untuk 'Update template'): " commit_msg
if [ -z "$commit_msg" ]; then
  commit_msg="Update template"
fi

echo ""
echo "[+] Sinkronisasi skills ke .agents/skills..."
rm -rf .agents/skills
cp -r skills .agents/skills

echo ""
echo "[+] Menambahkan perubahan ke Git..."
git add -A

echo ""
echo "[+] Membuat commit: \"$commit_msg\"..."
git commit -m "$commit_msg" || echo "Tidak ada perubahan baru untuk di-commit."

echo ""
echo "[+] Mengunggah ke GitHub (branch main)..."
git push origin main

echo ""
echo "==================================================="
echo "[OK] Push selesai! Template di GitHub berhasil diupdate."
echo "==================================================="
