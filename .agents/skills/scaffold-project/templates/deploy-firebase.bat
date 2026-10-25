@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul
title Deploy to Firebase Hosting

echo ===================================================
echo       DEPLOY TO FIREBASE HOSTING (Mazte)
echo ===================================================
echo.

:: 1. Periksa Node.js dan npm
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js tidak ditemukan di PATH sistem.
    echo Silakan install Node.js terlebih dahulu: https://nodejs.org
    goto END
)

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm tidak ditemukan. Pastikan Node.js terinstal dengan benar.
    goto END
)

:: 2. Periksa Firebase CLI (firebase-tools)
where firebase >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [INFO] Firebase CLI (firebase-tools) belum terdeteksi.
    set /p INSTALL_CLI="Apakah Anda ingin menginstal firebase-tools sekarang? (Y/T): "
    if /i "!INSTALL_CLI!"=="Y" (
        echo Menginstal firebase-tools secara global...
        call npm install -g firebase-tools
        if !ERRORLEVEL! neq 0 (
            echo [ERROR] Gagal menginstal firebase-tools. Coba jalankan CMD sebagai Administrator.
            goto END
        )
    ) else (
        echo [BATAL] Deploy dibatalkan karena Firebase CLI dibutuhkan.
        goto END
    )
)

:: 3. Jalankan build project
echo.
echo [1/3] Membangun file project (npm run build)...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Build gagal! Periksa error di atas sebelum deploy.
    goto END
)
echo [OK] Build selesai. Folder dist/ siap.

:: 4. Periksa login Firebase
echo.
echo [2/3] Memeriksa otentikasi Firebase...
call firebase projects:list >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [INFO] Sesi Firebase belum aktif atau sudah kedaluwarsa.
    echo Silakan login melalui browser yang akan terbuka...
    call firebase login
    if !ERRORLEVEL! neq 0 (
        echo [ERROR] Login Firebase gagal.
        goto END
    )
)
echo [OK] Akun Firebase terautentikasi.

:: 5. Periksa konfigurasi .firebaserc
echo.
echo [3/3] Memeriksa konfigurasi Project ID...
set NEEDS_PROJECT_ID=0

if not exist ".firebaserc" (
    set NEEDS_PROJECT_ID=1
) else (
    findstr /C:"PROJECT_ID" ".firebaserc" >nul
    if !ERRORLEVEL! equ 0 (
        set NEEDS_PROJECT_ID=1
    )
)

if "!NEEDS_PROJECT_ID!"=="1" (
    echo.
    echo [SETUP] Firebase Project ID belum ditentukan di .firebaserc.
    echo Anda bisa melihat Project ID di Firebase Console ^(Project Settings^).
    echo Contoh: my-store-app-888
    echo.
    set /p INPUT_PROJ="Masukkan Firebase Project ID Anda: "
    if "!INPUT_PROJ!"=="" (
        echo [ERROR] Project ID tidak boleh kosong.
        goto END
    )
    (
        echo {
        echo   "projects": {
        echo     "default": "!INPUT_PROJ!"
        echo   }
        echo }
    ) > .firebaserc
    echo [OK] .firebaserc berhasil diperbarui dengan Project ID: !INPUT_PROJ!
)

:: 6. Mulai Deploy ke Hosting
echo.
echo ===================================================
echo     Mendeploy ke Firebase Hosting...
echo ===================================================
echo.

call firebase deploy --only hosting

if %ERRORLEVEL% equ 0 (
    echo.
    echo ===================================================
    echo  [SUKSES] Website berhasil di-deploy ke Firebase!
    echo ===================================================
) else (
    echo.
    echo ===================================================
    echo  [GAGAL] Terjadi kesalahan saat deploy.
    echo  Periksa pesan error di atas.
    echo ===================================================
)

:END
echo.
pause
