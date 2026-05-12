import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const PHOTOS_DIR = path.join(process.cwd(), "public", "photos");

// All category slugs under public/photos/
const categories = fs
  .readdirSync(PHOTOS_DIR)
  .filter((name) => {
    const full = path.join(PHOTOS_DIR, name);
    return fs.statSync(full).isDirectory();
  });

async function generateBlur(srcPath: string): Promise<string> {
  const buffer = await sharp(srcPath).resize(10).webp({ quality: 20 }).toBuffer();
  const base64 = buffer.toString("base64");
  return `data:image/webp;base64,${base64}`;
}

async function main() {
  const results: Record<string, Record<string, string>> = {};

  for (const cat of categories) {
    results[cat] = {};
    const optimizedDir = path.join(PHOTOS_DIR, cat, "optimized");
    if (!fs.existsSync(optimizedDir)) continue;

    const files = fs.readdirSync(optimizedDir).filter((f) => f.endsWith(".webp"));
    for (const file of files) {
      const filePath = path.join(optimizedDir, file);
      console.log(`Generating blur for ${cat}/${file}...`);
      const blur = await generateBlur(filePath);
      results[cat][file] = blur;
    }
  }

  const outPath = path.join(process.cwd(), "data", "blur-data-urls.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  const total = Object.values(results).reduce((s, r) => s + Object.keys(r).length, 0);
  console.log(`Written ${total} entries to ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
