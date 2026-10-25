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
    { src: 'logo.svg', fallbackSrc: 'logo-512.svg', dest: 'logo.png', size: 512 },
    { src: 'favicon.svg', dest: 'favicon.png', size: 32 }
  ];

  for (const item of sizes) {
    let srcPath = path.join(__dirname, item.src);
    if (!fs.existsSync(srcPath) && item.fallbackSrc) {
      srcPath = path.join(__dirname, item.fallbackSrc);
    }
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
