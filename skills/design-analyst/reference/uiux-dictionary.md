# 📚 UI/UX Technical Dictionary — Vocabulary Referensi untuk Visual Audit

> **Tujuan:** Kamus istilah teknis supaya audit desain konsisten, akurat, dan tidak mengarang istilah.
> **Format:** `istilah` : definisi. Semua klaim audit WAJIB memakai istilah dari sini + nilai numerik spesifik (hex, px, rem, ratio).

---

## 🎨 COLOR & THEME

- **Primary color** : warna utama brand, dipakai untuk CTA dan elemen paling penting
- **Accent / Secondary** : warna pendukung untuk emphasis, tidak sekuat primary
- **Surface** : warna card/panel, biasanya 1 step lebih terang/gelap dari background
- **Hex code** : 6-digit color code (#RRGGBB) — wajib pakai ini, jangan "biru muda"
- **OKLCH** : color space modern (Tailwind v4 default) — lebih perceptually uniform dari HSL
- **Contrast ratio** : rasio kontras text vs background — WCAG AA butuh ≥4.5:1 body, ≥3:1 large text
- **Semantic colors** : warna dengan makna fungsional — success (green), warning (amber), error (red), info (blue)

## 🔤 TYPOGRAPHY

- **Geometric sans** : sans-serif berbasis bentuk geometris (Inter, Geist, Söhne) — modern SaaS standard
- **Humanist sans** : sans-serif dengan karakter lebih organik (Open Sans, Lato) — friendly
- **Grotesque** : sans-serif klasik (Helvetica, Neue Haas) — Swiss/editorial vibe
- **Editorial serif** : serif dengan kontras stroke tinggi (Playfair, Fraunces, GT Sectra) — premium magazine
- **Mono** : monospace (JetBrains Mono, Geist Mono) — developer tools, code blocks
- **Type scale** : ukuran heading bertingkat (H1 48-72px, H2 32-40px, H3 24px, body 16px)
- **Line-height (leading)** : tight 1.0-1.2 untuk display, normal 1.5-1.6 untuk body
- **Letter-spacing (tracking)** : negative untuk display besar (-0.02em), positive untuk small caps
- **Tabular figures** : angka dengan lebar sama — wajib untuk KPI numbers/data tables
- **Font weight** : 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

## 📐 LAYOUT & GRID

- **12-column grid** : standard web grid system, fleksibel untuk responsive
- **Bento grid** : grid asimetris dengan card ukuran berbeda (Apple-style)
- **Max content width** : batas lebar konten — biasanya 1200-1440px untuk readability
- **F-pattern** : pola baca user (horizontal kiri-kanan, scan vertikal) — untuk content-heavy
- **Z-pattern** : pola mata zigzag — untuk landing page dengan minimal text
- **Hero section** : section pertama landing page (headline + CTA + visual)
- **Above the fold** : area yang langsung terlihat tanpa scroll
- **Sticky** : element yang tetap fixed saat scroll (sticky header, sticky sidebar)

## 📏 SPACING

- **8px grid system** : spacing scale berbasis kelipatan 8 — standard industri
- **4px grid** : spacing scale lebih halus untuk UI dense (Linear, Notion)
- **Spacing tokens** : xs (4), sm (8), md (16), lg (24), xl (32), 2xl (48), 3xl (64)
- **Padding** : ruang dalam element (antara border dan konten)
- **Margin** : ruang di luar element (antara element dan tetangga)
- **Gap** : ruang antar element dalam flexbox/grid
- **Whitespace** : area kosong — generous (>40%) untuk premium, tight (<20%) untuk dense tools

## 🟦 SHAPE & RADIUS

- **Border radius** : sharp (0-2px), subtle (4-8px), rounded (12-16px), pillowy (20-32px), full (pill/circle)
- **Hairline border** : border 1px sangat tipis (#E5E7EB common) — pengganti shadow untuk depth
- **Pill shape** : border-radius full (9999px) — untuk badge, tag, button kecil

## 🌫️ ELEVATION & DEPTH

- **Flat design** : tanpa shadow, depth via warna/border
- **Subtle shadow** : `0 1px 2px rgba(0,0,0,0.05)` — modern SaaS standard
- **Hard shadow** : offset besar tanpa blur (`4px 4px 0 #000`) — neubrutalism signature
- **Glow** : `box-shadow: 0 0 20px <color>` — dark mode neon, gaming
- **Tonal elevation** : depth via step warna (Surface 1, Surface 2) — Material 3, iOS
- **Backdrop-filter** : CSS property untuk blur background — glassmorphism core

## 🧩 COMPONENTS

- **Atomic design** : atom (button) → molecule (search bar) → organism (header) — hierarchy komponen
- **Variant** : versi berbeda dari komponen sama — primary/secondary/ghost/destructive button
- **State** : kondisi interaktif — default, hover, active/pressed, focus, disabled, loading
- **Empty state** : tampilan saat tidak ada data — wajib ada untuk produk berkualitas
- **Skeleton loading** : placeholder shape saat data fetching — bukan spinner
- **FAB** : Floating Action Button (Material) — primary action floating
- **Affordance** : visual cue yang mengindikasikan element bisa di-interact
- **CTA** : Call-to-Action — primary button utama per screen
- **Modal / Dialog** : overlay focused yang mem-block background

## 🎬 MOTION & INTERACTION

- **Microinteraction** : feedback animasi kecil saat user beraksi (button click bounce, toggle slide)
- **Easing** : kurva animasi — ease-out (default), spring (playful), linear (jarang dipakai)
- **Duration** : 150ms (fast/snappy), 300ms (standard), 500ms+ (dramatic)
- **Hover state** : feedback saat cursor di atas — scale 1.02, shadow grow, color shift
- **Focus ring** : 2px outline saat element ter-focus — wajib untuk a11y

## ♿ ACCESSIBILITY

- **WCAG AA** : standard accessibility minimum — kontras 4.5:1 body, 3:1 large
- **WCAG AAA** : level lebih tinggi — kontras 7:1 body, 4.5:1 large
- **Touch target** : minimal 44x44px untuk mobile (Apple HIG) atau 48x48px (Material)
- **Focus indicator** : visual outline saat element ter-focus via keyboard — wajib visible
- **Semantic HTML** : pakai `<header>`, `<nav>`, `<main>`, `<button>` (bukan `<div>` untuk semua)

## 📱 RESPONSIVE

- **Breakpoints** : sm 640, md 768, lg 1024, xl 1280, 2xl 1536 (Tailwind standard)
- **Mobile-first** : design mulai dari mobile, scale up ke desktop
- **Fluid typography** : ukuran font yang scale via `clamp()` — bukan fixed px
- **Container query** : responsive berdasarkan parent size, bukan viewport

## 💼 DESIGN LANGUAGES (Visual Cues per Style)

- **Minimalist / Editorial** : whitespace >40%, max 1-2 accent, no shadow, typography dominan
- **Glassmorphism** : `backdrop-filter: blur(20px)`, transparency 60-80%, 1px white border rgba
- **Neumorphism** : dual shadow (light+dark), monochromatic, low contrast, no border
- **Neubrutalism** : border 2-4px solid black, hard shadow `4px 4px 0`, clash colors
- **Bento Grid** : asymmetric cards different sizes, radius 16-24px, mixed content types
- **Claymorphism** : inflated 3D shapes, soft saturated gradient, radius 20px+, soft shadow
- **Dark Mode Native** : background #0A0A0A-#1A1A1A, neon accent, glow shadow
- **Material Design 3** : dynamic color, FAB, ripple, tonal elevation, radius 16-28px
- **Liquid Glass (Apple)** : SF Pro, frosted glass bars, large titles, system blue #007AFF
- **Swiss / Grid-based** : Helvetica/Inter, 12-col strict, hairline horizontal, asymmetric balance
- **Bauhaus** : geometric primitives (circle/square/triangle), primary colors, form-follows-function
- **Y2K / Cyberpunk** : chrome gradient, glitch, neon pink/cyan, mesh gradient

---

## 🔧 ANALYSIS GUIDELINES

Saat melakukan visual audit dari screenshot, gunakan istilah dari dictionary ini + sebut nilai numerik spesifik:

✅ **Good:** "Saya melihat `backdrop-filter: blur(20px)` pada navbar + `1px white border rgba(255,255,255,0.2)` — strong indicator **glassmorphism**"

❌ **Bad:** "Navbar-nya keliatan transparan-transparan gimana gitu"

✅ **Good:** "Spacing follows **8px grid system** — card padding 24px (lg token), gap 16px (md token), section 48px (2xl token)"

❌ **Bad:** "Spacing-nya konsisten"

**Rule:** Setiap klaim teknis harus pakai vocabulary dari dictionary ini + sebut nilai numerik spesifik (hex, px, rem, ratio).
