import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = join(__dirname, '..');
const generalDir = join(root, 'public', 'photos', 'general');
const thumbDir = join(root, 'public', 'photos', 'thumbnails');
const optimizedDir = join(root, 'public', 'photos', 'optimized');

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;
const QUALITY_GENERAL = 80;
const QUALITY_THUMB = 75;
const THUMB_WIDTH = 600;

async function processDirectory(inputDir, outputDir, { quality, maxWidth, maxHeight }) {
  const files = await readdir(inputDir);
  const imageFiles = files.filter(f => /\.(jpe?g|png|webp)$/i.test(f));

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of imageFiles) {
    const inputPath = join(inputDir, file);
    const beforeSize = (await stat(inputPath)).size;
    totalBefore += beforeSize;

    const baseName = file.replace(extname(file), '');
    const outputPath = join(outputDir, `${baseName}.webp`);

    await sharp(inputPath)
      .resize({
        width: maxWidth,
        height: maxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toFile(outputPath);

    const afterSize = (await stat(outputPath)).size;
    totalAfter += afterSize;

    const reduction = ((1 - afterSize / beforeSize) * 100).toFixed(1);
    console.log(`  ${file} → ${baseName}.webp  ${(beforeSize / 1024 / 1024).toFixed(1)}MB → ${(afterSize / 1024).toFixed(0)}KB  (-${reduction}%)`);
  }

  return { totalBefore, totalAfter };
}

async function main() {
  console.log('Optimizing full-size images...\n');
  const generalResult = await processDirectory(generalDir, optimizedDir, {
    quality: QUALITY_GENERAL,
    maxWidth: MAX_WIDTH,
    maxHeight: MAX_HEIGHT,
  });

  console.log('\nOptimizing thumbnails...\n');
  const thumbResult = await processDirectory(thumbDir, optimizedDir, {
    quality: QUALITY_THUMB,
    maxWidth: THUMB_WIDTH,
    maxHeight: THUMB_WIDTH,
  });

  const totalBefore = generalResult.totalBefore + thumbResult.totalBefore;
  const totalAfter = generalResult.totalAfter + thumbResult.totalAfter;
  const reduction = ((1 - totalAfter / totalBefore) * 100).toFixed(1);

  console.log(`\n========================================`);
  console.log(`Total: ${(totalBefore / 1024 / 1024).toFixed(0)}MB → ${(totalAfter / 1024 / 1024).toFixed(0)}MB  (-${reduction}%)`);
  console.log(`Optimized images saved to: ${optimizedDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
