---
name: generate-assets
description: Generate favicon, logo, and PWA icons from prd.md branding info (app name, brand colors). Produces SVG favicons/logos and optional PNG via sharp. Use when the user says buat favicon, bikin logo, generate icon, or the project needs custom app icons.
---

# generate-assets

Generate app favicon, logo, and PWA icons from the project's `prd.md`. Extracts the app name, brand color(s), and description, then produces SVG-based icons — plus an optional `sharp`-based script to convert them to PNG for PWA manifests.

## Prerequisites

- A `prd.md` must exist in the project root (or the user must specify a path). If none exists, stop and ask the user for the PRD or the app name and brand color directly.
- `node`/`npm` available (for running the conversion script).

## What this skill produces

1. **`favicon.svg`** — SVG favicon with the app initial on the brand-colored background. Lightweight, scalable, supported by all modern browsers via `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`.
2. **`logo.svg`** — Master SVG logo (app initial + full name below).
3. **`logo-192.svg`** / **`logo-512.svg`** — Sized PWA icon SVGs (modern PWA manifests support SVG icons).
4. **`generate-icons.js`** — Converts SVGs to PNG at required sizes using `sharp` (optional; only if PNG is needed for broader PWA compatibility).
5. Updates **`manifest.json`** — `theme_color`, `background_color`, `name`, `short_name`, `description` from PRD.
6. Updates **`Index.html`** — adds `<link rel="icon">` for the SVG favicon.
7. Updates **`build.js`** — integrates the asset pipeline (copy SVGs to dist, optionally run PNG conversion).

## Workflow

### 1. Read the PRD

Read `prd.md` at the project root (or `$ARGUMENTS` if a path is given). Extract:

| What | Where to find | Fallback |
|------|--------------|----------|
| **App name** | `# Deskripsi Aplikasi` first sentence — `NamaAplikasi adalah ...` | Ask user |
| **App initial** | First letter of app name (uppercase) | — |
| **Short name** | First word of app name | App name |
| **Brand color** | Search for `warna`, `color`, `hijau`, `biru`, `merah`, `ungu`, `pink`, `oranye`, `kuning`, `cyan`, `teal`, `indigo` in the PRD. If a CSS color / hex is stated, use it. | Default: `#ec4899` (pink, from scaffold template) |
| **Description** | First paragraph of `# Deskripsi Aplikasi` | App name |
| **Dark/light preference** | From PRD context (e.g. "dark mode", "tampilan gelap") | Light (white `#ffffff` background) |

### 2. Pick brand color

Parse the color preference:
- `hijau` → `#16a34a` (green-600) or `#059669` (emerald-600)
- `biru` → `#2563eb` (blue-600) or `#0284c7` (sky-600)  
- `merah` → `#dc2626` (red-600)
- `ungu` / `purple` → `#7c3aed` (violet-600) or `#9333ea` (purple-600)
- `pink` / `merah muda` → `#db2777` (pink-600)
- `oranye` / `orange` → `#ea580c` (orange-600)
- `kuning` / `yellow` / `emas` → `#ca8a04` (yellow-600)
- `cyan` / `biru muda` → `#0891b2` (cyan-600)
- `teal` → `#0d9488` (teal-600)
- `indigo` → `#4f46e5` (indigo-600)
- `abu-abu` / `gray` / `slate` → `#475569` (slate-600)
- `hitam` / `black` / `dark` → `#1e293b` (slate-800)
- Explicit hex in PRD → use that exact hex.

### 3. Generate SVG files

Generate each file using the template pattern below. **Customize** the placeholders.

#### 3a. `favicon.svg` (32×32 viewBox, clean at 16×16)

The favicon must be **legible at 16×16 pixels** (browser tab). Use a bold single letter on a rounded square with the brand color.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="BRAND_COLOR"/>
  <text x="16" y="22" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="700" fill="#ffffff">APP_INITIAL</text>
</svg>
```

#### 3b. `logo.svg` (200×200, app initial + name)

A centered composition: large initial letter on brand-colored circle, app name below.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="80" r="60" fill="BRAND_COLOR"/>
  <text x="100" y="95" text-anchor="middle" font-family="system-ui,sans-serif" font-size="48" font-weight="800" fill="#ffffff">APP_INITIAL</text>
  <text x="100" y="170" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" font-weight="600" fill="#1e293b">SHORT_NAME</text>
</svg>
```

#### 3c. `logo-192.svg` / `logo-512.svg`

Same as `logo.svg` but with viewBox matching the size. Use a larger canvas for readability.

**logo-192.svg:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="32" fill="BRAND_COLOR"/>
  <text x="96" y="115" text-anchor="middle" font-family="system-ui,sans-serif" font-size="72" font-weight="800" fill="#ffffff">APP_INITIAL</text>
</svg>
```

**logo-512.svg:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="64" fill="BRAND_COLOR"/>
  <text x="256" y="300" text-anchor="middle" font-family="system-ui,sans-serif" font-size="180" font-weight="800" fill="#ffffff">APP_INITIAL</text>
</svg>
```

### 4. Update `Index.html`

Add (or replace) the favicon link in `<head>`. If a `<link rel="icon">` already exists, replace it; otherwise add:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/logo-192.svg">
```

### 5. Update `manifest.json`

Replace these keys:
- `name` → App name
- `short_name` → Short name (first word of app name)
- `description` → App description (first sentence from PRD)
- `theme_color` → Brand color hex
- `background_color` → `#ffffff` (light) or `#1e293b` (dark)

Update the `icons` array to include both SVG and PNG entries:

```json
{
  "name": "APP_NAME",
  "short_name": "SHORT_NAME",
  "description": "APP_DESCRIPTION",
  "start_url": "/",
  "display": "standalone",
  "background_color": "BACKGROUND_COLOR",
  "theme_color": "BRAND_COLOR",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/logo-192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "/logo-512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "/logo-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/logo-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 6. Generate `generate-icons.js` (PNG conversion script)

Create this script for SVG → PNG conversion via `sharp`:

```js
const fs = require('fs');
const path = require('path');

async function convertIcons() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    try {
      const { execSync } = require('child_process');
      console.log('sharp not found, attempting one-time install...');
      execSync('npm install sharp --no-save', { stdio: 'pipe' });
      sharp = require('sharp');
    } catch (installErr) {
      console.log('sharp module could not be installed/loaded. SVG icons will be used as primary assets.');
      return;
    }
  }

  const sizes = [
    { src: 'logo-192.svg', dest: 'logo-192.png', size: 192 },
    { src: 'logo-512.svg', dest: 'logo-512.png', size: 512 },
    { src: 'favicon.svg', dest: 'favicon.png', size: 32 }
  ];

  for (const item of sizes) {
    const srcPath = path.join(__dirname, item.src);
    const destPath = path.join(__dirname, item.dest);
    if (fs.existsSync(srcPath)) {
      try {
        await sharp(srcPath).resize(item.size, item.size).png().toFile(destPath);
        console.log(`Generated: ${item.dest}`);
      } catch (err) {
        console.warn(`Could not generate ${item.dest}:`, err.message);
      }
    }
  }
  console.log('Icon processing completed.');
}

convertIcons().catch(err => {
  console.warn('Icon conversion ended with warning:', err.message);
});
```

### 7. Update `build.js`

In the existing `build.js`, update the icon/favicon handling section to:

1. **First**, try copying local SVGs (`favicon.svg`, `logo-192.svg`, `logo-512.svg`) to `dist/`.
2. **Then**, run `node generate-icons.js` to produce PNG versions.
3. **Then**, copy PNGs to `dist/`.
4. **Fallback**: if no SVG/PNG exists, download from the Flaticon fallback URL as before.

The updated section in `build.js`:

```js
// 1. Setup App Logo & Favicon (SVG → PNG pipeline)
const path = require('path');
const { execSync } = require('child_process');
const localSvgFavicon = path.join(srcDir, 'favicon.svg');
const localSvgLogo192 = path.join(srcDir, 'logo-192.svg');
const localSvgLogo512 = path.join(srcDir, 'logo-512.svg');
const localPngFavicon = path.join(srcDir, 'favicon.png');
const localPngLogo192 = path.join(srcDir, 'logo-192.png');
const localPngLogo512 = path.join(srcDir, 'logo-512.png');
const localLogo = path.join(srcDir, 'logo.png');
const logoUrl = 'https://cdn-icons-png.flaticon.com/512/2331/2331970.png';

const faviconPath = path.join(distDir, 'favicon.svg');
const logo192Path = path.join(distDir, 'logo-192.svg');
const logo512Path = path.join(distDir, 'logo-512.svg');
const faviconPngPath = path.join(distDir, 'favicon.png');
const logo192PngPath = path.join(distDir, 'logo-192.png');
const logo512PngPath = path.join(distDir, 'logo-512.png');

try {
  // Copy generated SVGs
  if (fs.existsSync(localSvgFavicon)) {
    fs.copyFileSync(localSvgFavicon, faviconPath);
    console.log('Copied favicon.svg to dist');
  }
  if (fs.existsSync(localSvgLogo192)) {
    fs.copyFileSync(localSvgLogo192, logo192Path);
    console.log('Copied logo-192.svg to dist');
  }
  if (fs.existsSync(localSvgLogo512)) {
    fs.copyFileSync(localSvgLogo512, logo512Path);
    console.log('Copied logo-512.svg to dist');
  }

  // Run PNG generation if SVGs exist but PNGs don't
  const genScript = path.join(srcDir, 'generate-icons.js');
  const needsPng =
    (fs.existsSync(localSvgFavicon) && !fs.existsSync(localPngFavicon)) ||
    (fs.existsSync(localSvgLogo192) && !fs.existsSync(localPngLogo192)) ||
    (fs.existsSync(localSvgLogo512) && !fs.existsSync(localPngLogo512));

  if (needsPng && fs.existsSync(genScript)) {
    console.log('Running generate-icons.js to produce PNGs...');
    execSync('node generate-icons.js', { cwd: srcDir, stdio: 'inherit' });
  }

  // Copy PNGs
  if (fs.existsSync(localPngFavicon)) {
    fs.copyFileSync(localPngFavicon, faviconPngPath);
    console.log('Copied favicon.png to dist');
  }
  if (fs.existsSync(localPngLogo192)) {
    fs.copyFileSync(localPngLogo192, logo192PngPath);
    console.log('Copied logo-192.png to dist');
  }
  if (fs.existsSync(localPngLogo512)) {
    fs.copyFileSync(localPngLogo512, logo512PngPath);
    console.log('Copied logo-512.png to dist');
  }

  // Fallback: download if nothing exists
  if (!fs.existsSync(logo192PngPath) && !fs.existsSync(logo192Path)) {
    if (fs.existsSync(localLogo)) {
      fs.copyFileSync(localLogo, logo192PngPath);
      fs.copyFileSync(localLogo, logo512PngPath);
      console.log('Copied local logo.png as base for PWA icons');
    } else {
      console.log('PWA icons missing. Downloading from fallback URL...');
      await downloadFile(logoUrl, logo512PngPath);
      fs.copyFileSync(logo512PngPath, logo192PngPath);
    }
  }
  if (!fs.existsSync(faviconPngPath) && !fs.existsSync(faviconPath)) {
    fs.copyFileSync(logo192PngPath, faviconPngPath);
    console.log('Copied logo-192.png to favicon.png as fallback');
  }

  console.log('PWA icons and favicon setup completed successfully.');
} catch (err) {
  console.error('Failed to set up PWA icons and favicon:', err.message);
}
```

### 8. Verify

Run `npm run build` and confirm:
- `dist/favicon.svg` exists
- `dist/logo-192.svg` and `dist/logo-512.svg` exist
- `dist/logo-192.png` and `dist/logo-512.png` exist (if `sharp` was available)
- `dist/manifest.json` has correct colors
- `dist/index.html` has the SVG favicon link

## Guardrails

- Always generate SVGs first — they work as favicons in all modern browsers (Chrome 80+, Firefox 41+, Safari 12+, Edge 80+).
- The favicon at 16×16 must use a bold letter with high contrast — avoid thin fonts or complex shapes.
- The brand color should have sufficient contrast against white text (≥4.5:1 ratio). If the PRD specifies a light color, use white text on the colored background but add a darker outline or use a darker shade of the same hue.
- Never replace existing user-created logo files (`logo.png`, `favicon.png`) without asking — the generated SVGs use different filenames.
- The `generate-icons.js` script auto-installs `sharp` if missing — no manual `npm install` needed.
- If `sharp` fails to install (e.g., no build tools), the SVGs still work as favicons and PWA icons in modern browsers.
