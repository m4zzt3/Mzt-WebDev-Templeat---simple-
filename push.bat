@echo off
chcp 65001 >nul
title Mazte WebDev Template - Git Push Tool
echo ===================================================
echo     MAZTE WEBDEV TEMPLATE - GIT AUTO PUSH
echo ===================================================
echo Remote: https://github.com/m4zzt3/Mzt-WebDev-Templeat---simple-.git
echo.

set /p commit_msg="Masukkan pesan pembaruan (tekan Enter untuk 'Update template'): "
if "%commit_msg%"=="" set commit_msg=Update template

echo.
echo [+] Sinkronisasi skills ke .agents/skills...
powershell -Command "if (Test-Path '.agents/skills') { Remove-Item -Recurse -Force '.agents/skills' }; Copy-Item -Recurse -Force 'skills' '.agents/skills'"

echo.
echo [+] Menambahkan perubahan ke Git...
git add -A

echo.
echo [+] Membuat commit: "%commit_msg%"...
git commit -m "%commit_msg%"

echo.
echo [+] Mengunggah ke GitHub (branch main)...
git push origin main

echo.
echo ===================================================
echo [OK] Push selesai! Template di GitHub berhasil diupdate.
echo ===================================================
echo.
pause
