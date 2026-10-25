---
name: scaffold-project
description: Scaffold a complete project from a prd.md using the "Ceisya Shop / Gudang Farmasi" blueprint (Google Apps Script + Google Sheets backend, Alpine.js frontend, build.js → dist/ → Firebase Hosting / Vercel). Use when the user says scaffold, bikin proyek baru, buat project baru, generate app from PRD, or runs /init in a fresh folder that contains prd.md, so the project gets a matching AGENTS.md and boilerplate.
---

# scaffold-project

Generate a full project from a product requirements file (`prd.md`) following the reference blueprint this skill ships with. The result mirrors the Ceisya Shop landing page architecture: a Google Apps Script (`Code.gs`) backend that CRUDs Google Sheets, a single-page Alpine.js frontend, and a `build.js` → `dist/` → Firebase Hosting / Vercel pipeline.

## Prerequisites

- The project folder must contain a `prd.md`. If `prd.md` does not exist, trigger the **`generate-prd`** skill first to create it from the user's idea before scaffolding.
- `node`/`npm` available (for `npm run build`).

## What this skill produces

1. Boilerplate build & deploy pipeline (copied verbatim from `templates/`): `build.js`, `build.sh`, `package.json`, `vercel.json`, `firebase.json`, `.firebaserc`, `deploy-firebase.bat`, `sw.js`, `manifest.json`, `.gitignore`.
2. Backend `Code.gs` (Google Apps Script).
3. Frontend: `Index.html`, `JavaScript.html`, `Stylesheet.html`.
4. `AGENTS.md` documenting the generated repo (adapted from `templates/AGENTS.md.blueprint`).

## Workflow

### 1. Read the PRD
Read `prd.md` at the project root (or `$ARGUMENTS` if a path is given). Extract:
- **App name** and one-line description (Indonesian, as written in the PRD).
- **Roles & features** (e.g. admin vs visitor).
- **Data model**: every Google Sheet name + its columns; note primary/foreign keys.
- **Business rules** that must be enforced client-side (visibility filters, ordering, conditional buttons, off-site purchases, etc.).

### 2. Copy boilerplate & blueprints
Copy these files from `templates/` to the project root, adapting placeholders:

| Template | Adapt |
|---|---|
| `templates/build.js`, `templates/build.sh` | copy as-is (copies `assets/`, `favicon.ico`, `logo.png`, SVGs, and inlines templates) |
| `templates/package.json` | `name` (`APP_SLUG`), `description` (uses `npx -y firebase-tools` for deployment) |
| `templates/vercel.json`, `templates/firebase.json`, `templates/deploy-firebase.bat`, `templates/.gitignore` | copy as-is (`firebase.json` pre-configured with security headers & cache controls) |
| `templates/.firebaserc` | `default` → `<APP_SLUG>` or Firebase Project ID |
| `templates/sw.js` | `CACHE_NAME` → `<slug>-v1` (with `Promise.allSettled` and navigation safeguards) |
| `templates/manifest.json` | `name`, `short_name`, `description` (keep theme `#ec4899`-style pink unless PRD says otherwise) |
| `templates/Stylesheet.html.blueprint` | copy as starting `Stylesheet.html` (fonts, glassmorphism, glowing badges, modern modal styling) |
| `templates/JavaScript.html.blueprint` | copy as starting `JavaScript.html` (`setupModernSwal`, API bridge, security shield) |
| `templates/Code.gs.blueprint` | copy as starting `Code.gs` (`LockService`, `boldHeader`, SHA-256 password hashing, `doPost`) |

### 3. Write the backend (`Code.gs`)
Implement or adapt from `templates/Code.gs.blueprint`:
- `doGet(e)`: serve page by `?p=` param (`HtmlService.createTemplateFromFile`), `template.serverData = "{}"`. Wrap in `try/catch` fallback to return status JSON `{ success: true, message: 'API Backend is running!', data: getAllData(false) }` when running headless/API-only.
- `include(filename)`: return raw content of a referenced HTML file.
- `setupDatabase()`: create all sheets + bold header rows (`#f3f4f6`) via `boldHeader(sheet)`, seed a default admin with SHA-256 password hash (`hashPassword('admin123')`).
- `getSheetData(sheetName)`: rows → objects keyed by header row with timezone-aware date formatting (`Session.getScriptTimeZone() || 'Asia/Jakarta'`).
- `getAllData(isAdmin)`: returns every entity array (+ `users` when `isAdmin`), cached 60s under `__CACHE_PREFIX___DATA_ADMIN`/`__CACHE_PREFIX___DATA_PUBLIC`.
- `clearDataCache()`: remove both cache keys — **call after every write**.
- One `save*`/`delete*` per sheet; save functions must accept the frontend's PascalCase keys (sheet header names) OR both PascalCase and camelCase. Validate required fields, return `{ success, message, data? }`.
- `doLogin(username, password)`: verify username & SHA-256 hash against Users sheet; fallback `admin`/`admin123` when empty.
- `doPost(e)`: JSON entrypoint with `LockService.getScriptLock()` (`lock.tryLock(10000)`) to guard against concurrent Google Sheets write collisions — parse `{ action, args }`, dispatch `this[action](...args)`, whitelist every client-callable function in `ALLOWED_ACTIONS`, and release lock in `finally`.

Conventions: dates `dd/MM/yyyy` or `dd/MM/yyyy HH:mm`; IDs `'PREFIX-' + new Date().getTime()`; booleans stored as `'TRUE'`/`'FALSE'` and compared via `String(v).toUpperCase() === 'TRUE'`.

### 4. Write the frontend
`Index.html` (public page + hidden admin panel), `JavaScript.html`, `Stylesheet.html`:
- Head loads CDN libs directly: Tailwind CDN (v3), Alpine.js 3.13.3, Font Awesome 6.4.0, SweetAlert2 11. Add `<link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="alternate icon" type="image/png" href="/favicon.png"><link rel="icon" type="image/x-icon" href="/favicon.ico">`.
- References shared files: `<?!= include('Stylesheet'); ?>`, `<?!= include('JavaScript'); ?>`, `<?!= serverData ?>`.
- `Stylesheet.html`:
  - Plus Jakarta Sans / Inter + JetBrains Mono.
  - `[x-cloak] { display: none !important; }`, `html, body { overflow-x: hidden; overflow-x: clip; max-width: 100%; }`.
  - Glassmorphic classes (`glass-card`, `glass-nav`), ambient glow (`glow-brand`, `glow-emerald`, `glow-rose`), custom scrollbars.
  - Single-click datepicker indicator (`.date-picker-single-click`) and `.dark input[type="date"] { color-scheme: dark; }`.
  - Mobile safe area padding (`.safe-bottom`).
  - Modern SweetAlert2 backdrop and card CSS overrides.
- `JavaScript.html` must ship:
  - Dua tipe URL Apps Script (Produksi & Developer):
    - `const PROD_WEB_APP_URL = 'https://script.google.com/macros/s/PROD_WEB_APP_URL_HERE/exec';` (Database Produksi / Live)
    - `const DEV_WEB_APP_URL = 'https://script.google.com/macros/s/DEV_WEB_APP_URL_HERE/exec';` (Database Pengujian / Developer)
    - `const WEB_APP_URLS = [PROD_WEB_APP_URL];` (Pilih environment aktif: PROD atau DEV)
  - `fetchFromAppsScript()` POSTing `{ action, args }` with header `'Content-Type': 'text/plain;charset=utf-8'`; `runApi()` using `google.script.run` when present, else the fetch path (retry + `redirect: 'follow'`).
  - **`setupModernSwal()`**: Automatically formats all SweetAlert2 popups (info, success, warning, question, error, delete, and toast) into modern rounded glassmorphism cards with glowing icon badges and themed gradient action buttons.
  - Anti-Inspect & DevTools shield with localhost auto-detection and `Ctrl+Alt+Shift+D` shortcut unlock.
  - `appData()` Alpine state with getters that enforce the PRD business rules and read sheet columns by header name; `localStorage` session keys + a first-paint data cache.
- Dark mode default = light; dark only when the user toggles (`localStorage.theme === 'dark'`).

### 5. Write `AGENTS.md`
Copy `templates/AGENTS.md.blueprint` → `AGENTS.md` and replace every placeholder:
- `__APP_NAME__`, `__APP_DESCRIPTION__`
- `__BACKEND_FILE__` (e.g. `Code.gs`)
- `__PAGES__` / `__PAGES_DIST__` (e.g. `Index.html` → `index.html`)
- `__CACHE_PREFIX___` (e.g. `CS` for Ceisya Shop — the app initials, uppercase)
- `__SHEETS_SECTION__`: bullet list, one per sheet, with columns (`SheetName`: Col1, Col2, …)
- `__RELATION_LINKS__` (e.g. `Products.CategoryID → Categories.CategoryID`)
- `__BUSINESS_RULES__`: concise bullets from the PRD

Keep the section structure intact; delete nothing.

### 6. Verify
Run `npm install && npm run build`. Fix any failure and rebuild.

### 7. Set up the Apps Script database & connect the web app link
After the build passes, guide the user to create the Apps Script backend and give you back the web app URL:

1. **Create the Apps Script project.** Tell the user to open <https://script.google.com/home> (or Google Sheets → Extensions → Apps Script) and create a new project. Rename the default `Code.gs` file to match `__BACKEND_FILE__` (e.g. `Code`) and paste the full generated `__BACKEND_FILE__` content into it.
2. **Add the HTML files.** For the Apps Script runtime (`google.script.run`) to serve the page, the project also needs the HTML files as Apps Script HTML files: create `Index`, `Stylesheet`, `JavaScript` via File → New → HTML and paste the content of the matching source files (`Index.html`, `Stylesheet.html`, `JavaScript.html`). Note: for the Vercel build only `doPost()` matters, but without these files `doGet()` throws "File HTML dengan nama Index tidak ditemukan".
3. **Run `setupDatabase()`** once: select the `setupDatabase` function in the editor and click Run (authorize when prompted) to create the sheets and seed the default admin (`admin`/`admin123`).
4. **Deploy the web app:** Deploy → New deployment → type *Web app* → Execute as *Me*, Who has access *Anyone* → Deploy. Authorize any new scopes (e.g. Google Drive if the app has image upload). Copy the `/exec` URL.
5. **Ask the user to send you the `/exec` link.** When they paste it, insert it into `WEB_APP_URLS` in `JavaScript.html` (replace the `..._WEB_APP_URL_HERE/exec` placeholder), then run `npm run build` again.
6. Remind them to redeploy a new version of the Apps Script project whenever `__BACKEND_FILE__` changes (Deploy → Manage deployments → Edit → New version) — otherwise the API rejects new actions with `Action not authorized`.
7. **Deploy Frontend:**
   - **Opsi Firebase Hosting (Recommended):** Jalankan `deploy-firebase.bat` (di Windows) atau jalankan `npm run deploy:firebase`. Ikuti petunjuk untuk login & tentukan Firebase Project ID.
   - **Opsi Vercel:** Deploy folder `dist/` ke Vercel (via Vercel CLI `vercel` atau push git ke Vercel).

Then report which files were generated and the remaining deployment step (Firebase Hosting via `deploy-firebase.bat` / Vercel).

## Guardrails

- Never edit `dist/` — change sources and rebuild.
- Keep every `runApi('name')` in sync with `ALLOWED_ACTIONS` in `doPost()`.
- Booleans are text `'TRUE'/'FALSE'`; never store JS booleans.
- Sheet names in the backend are written as-is (e.g. PascalCase); headers must exactly match the keys the frontend reads.
- No hardcoded mock arrays in generated frontend code — data must come from `google.script.run` / the web app API, with the seeded `setupDatabase()` data as the local-only fallback.
- If the PRD asks for multiple pages, replicate the include pattern and register each page in `doGet` and `build.js`'s filename mapping.
