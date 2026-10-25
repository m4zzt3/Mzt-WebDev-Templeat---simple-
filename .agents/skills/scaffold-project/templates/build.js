const fs = require('fs');
const path = require('path');
const https = require('https');

const srcDir = __dirname;
const distDir = path.join(__dirname, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Helper to copy directory recursively
function copyDirSync(src, dest) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Helper to download a file
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: status ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function main() {
    console.log('Starting build process...');

    // 1. Copy assets directory if present
    const assetsSrc = path.join(srcDir, 'assets');
    const assetsDest = path.join(distDir, 'assets');
    if (fs.existsSync(assetsSrc)) {
        copyDirSync(assetsSrc, assetsDest);
        console.log('Copied assets directory to dist/assets');
    }

    // 2. Setup App Logo & Favicon (SVG + PNG Pipeline)
    const { execSync } = require('child_process');
    const localSvgFavicon = path.join(srcDir, 'favicon.svg');
    const localSvgLogo192 = path.join(srcDir, 'logo-192.svg');
    const localSvgLogo512 = path.join(srcDir, 'logo-512.svg');
    const localPngFavicon = path.join(srcDir, 'favicon.png');
    const localPngLogo192 = path.join(srcDir, 'logo-192.png');
    const localPngLogo512 = path.join(srcDir, 'logo-512.png');
    const localLogo = path.join(srcDir, 'logo.png');
    const logoUrl = 'https://cdn-icons-png.flaticon.com/512/2331/2331970.png'; // fallback icon

    const faviconSvgPath = path.join(distDir, 'favicon.svg');
    const logo192SvgPath = path.join(distDir, 'logo-192.svg');
    const logo512SvgPath = path.join(distDir, 'logo-512.svg');
    const faviconPngPath = path.join(distDir, 'favicon.png');
    const logo192PngPath = path.join(distDir, 'logo-192.png');
    const logo512PngPath = path.join(distDir, 'logo-512.png');

    try {
        // Copy generated SVGs if present
        if (fs.existsSync(localSvgFavicon)) {
            fs.copyFileSync(localSvgFavicon, faviconSvgPath);
            console.log('Copied favicon.svg to dist');
        }
        if (fs.existsSync(localSvgLogo192)) {
            fs.copyFileSync(localSvgLogo192, logo192SvgPath);
            console.log('Copied logo-192.svg to dist');
        }
        if (fs.existsSync(localSvgLogo512)) {
            fs.copyFileSync(localSvgLogo512, logo512SvgPath);
            console.log('Copied logo-512.svg to dist');
        }

        // Run PNG generation if SVGs exist and generate-icons.js is present
        const genScript = path.join(srcDir, 'generate-icons.js');
        const needsPng = (fs.existsSync(localSvgFavicon) && !fs.existsSync(localPngFavicon)) ||
                         (fs.existsSync(localSvgLogo192) && !fs.existsSync(localPngLogo192)) ||
                         (fs.existsSync(localSvgLogo512) && !fs.existsSync(localPngLogo512));

        if (needsPng && fs.existsSync(genScript)) {
            console.log('Running generate-icons.js to produce PNG icons...');
            try {
                execSync('node generate-icons.js', { cwd: srcDir, stdio: 'inherit' });
            } catch (genErr) {
                console.warn('generate-icons.js execution skipped/failed:', genErr.message);
            }
        }

        // Copy local PNG icons if present
        if (fs.existsSync(localPngFavicon)) {
            fs.copyFileSync(localPngFavicon, faviconPngPath);
            console.log('Copied favicon.png to dist');
        } else if (fs.existsSync(localLogo)) {
            fs.copyFileSync(localLogo, faviconPngPath);
        }

        if (fs.existsSync(localPngLogo192)) {
            fs.copyFileSync(localPngLogo192, logo192PngPath);
            console.log('Copied logo-192.png to dist');
        } else if (fs.existsSync(localLogo)) {
            fs.copyFileSync(localLogo, logo192PngPath);
        }

        if (fs.existsSync(localPngLogo512)) {
            fs.copyFileSync(localPngLogo512, logo512PngPath);
            console.log('Copied logo-512.png to dist');
        } else if (fs.existsSync(localLogo)) {
            fs.copyFileSync(localLogo, logo512PngPath);
        }

        if (fs.existsSync(localLogo)) {
            fs.copyFileSync(localLogo, path.join(distDir, 'logo.png'));
            console.log('Copied logo.png to dist');
        }

        const localFavIco = path.join(srcDir, 'favicon.ico');
        if (fs.existsSync(localFavIco)) {
            fs.copyFileSync(localFavIco, path.join(distDir, 'favicon.ico'));
            console.log('Copied favicon.ico to dist');
        }

        // Fallback: download if both PNG and SVG icons are missing
        if (!fs.existsSync(logo192PngPath) && !fs.existsSync(logo192SvgPath)) {
            console.log('PWA icons missing. Downloading from fallback URL...');
            await downloadFile(logoUrl, logo512PngPath);
            fs.copyFileSync(logo512PngPath, logo192PngPath);
        }
        if (!fs.existsSync(faviconPngPath) && !fs.existsSync(faviconSvgPath)) {
            if (fs.existsSync(logo192PngPath)) {
                fs.copyFileSync(logo192PngPath, faviconPngPath);
            }
        }

        console.log('PWA icons and favicon setup completed successfully.');
    } catch (err) {
        console.error('Failed to set up PWA icons and favicon:', err.message);
    }

    // 3. Copy manifest.json and sw.js to dist
    const manifestSrc = path.join(srcDir, 'manifest.json');
    const manifestDest = path.join(distDir, 'manifest.json');
    if (fs.existsSync(manifestSrc)) {
        fs.copyFileSync(manifestSrc, manifestDest);
        console.log('Copied manifest.json to dist');
    }

    const swSrc = path.join(srcDir, 'sw.js');
    const swDest = path.join(distDir, 'sw.js');
    if (fs.existsSync(swSrc)) {
        fs.copyFileSync(swSrc, swDest);
        console.log('Copied sw.js to dist');
    }

    // Read Stylesheet.html and JavaScript.html
    const stylesheetPath = path.join(srcDir, 'Stylesheet.html');
    const javascriptPath = path.join(srcDir, 'JavaScript.html');

    let stylesheetContent = '';
    let javascriptContent = '';

    if (fs.existsSync(stylesheetPath)) {
        stylesheetContent = fs.readFileSync(stylesheetPath, 'utf8');
    } else {
        console.error('Warning: Stylesheet.html not found.');
    }

    if (fs.existsSync(javascriptPath)) {
        javascriptContent = fs.readFileSync(javascriptPath, 'utf8');
    } else {
        console.error('Warning: JavaScript.html not found.');
    }

    // Find all HTML files to compile (exclude Stylesheet.html and JavaScript.html)
    const files = fs.readdirSync(srcDir);
    files.forEach(file => {
        if (file.endsWith('.html') && file !== 'Stylesheet.html' && file !== 'JavaScript.html') {
            const filePath = path.join(srcDir, file);
            let content = fs.readFileSync(filePath, 'utf8');

            console.log(`Compiling: ${file}...`);

            // Replace Stylesheet include directive (supports both <?= and <?!=)
            content = content.replace(/<\?(!?)=\s*include\(['"]Stylesheet['"]\);?\s*\?>/g, stylesheetContent);

            // Replace JavaScript include directive (supports both <?= and <?!=)
            content = content.replace(/<\?(!?)=\s*include\(['"]JavaScript['"]\);?\s*\?>/g, javascriptContent);

            // Replace serverData injection if present (supports both <?= and <?!=)
            content = content.replace(/<\?(!?)=\s*serverData\s*\?>/g, '{}');

            // Output filename (lowercase, spaces to hyphens)
            let outName = file.toLowerCase();
            if (outName === 'index.html') {
                outName = 'index.html';
            } else {
                outName = outName.replace(/\s+/g, '-');
            }

            const outPath = path.join(distDir, outName);
            fs.writeFileSync(outPath, content, 'utf8');
            console.log(`Saved compiled file to: dist/${outName}`);
        }
    });

    console.log('Build completed successfully!');
}

main().catch(err => {
    console.error('Build crashed:', err);
    process.exit(1);
});
