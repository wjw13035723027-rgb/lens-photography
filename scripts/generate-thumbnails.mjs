import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'public', 'photos', 'optimized');
const outDir = path.join(root, 'public', 'photos', 'thumbnails');
const TARGET_WIDTH = 400;

if (!fs.existsSync(srcDir)) {
  console.error(`Source directory not found: ${srcDir}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter((f) => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));

console.log(`Generating thumbnails for ${files.length} images (${TARGET_WIDTH}px wide)...\n`);

let skipped = 0;
let generated = 0;

for (const file of files) {
  const srcPath = path.join(srcDir, file);
  const outPath = path.join(outDir, file);

  if (fs.existsSync(outPath)) {
    skipped++;
    continue;
  }

  try {
    await sharp(srcPath)
      .resize(TARGET_WIDTH, undefined, { withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(outPath);
    generated++;
  } catch (err) {
    console.error(`  Failed: ${file} — ${err.message}`);
  }
}

console.log(`Done. ${generated} generated, ${skipped} skipped.`);
