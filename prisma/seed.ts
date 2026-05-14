import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "data", "photography.db");
const blurPath = path.join(__dirname, "..", "data", "blur-data-urls.json");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const blurData: { kansai: Record<string, string | undefined> } = { kansai: {} };
if (fs.existsSync(blurPath)) {
  const parsed = JSON.parse(fs.readFileSync(blurPath, "utf8")) as Partial<typeof blurData>;
  blurData.kansai = parsed.kansai ?? {};
}

const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

const photos = [
  { id: "1", src: "/photos/kansai/optimized/DSC_1507.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1507.webp", title: "DSC_1507", location: "大阪街头", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1507.webp"] },
  { id: "2", src: "/photos/kansai/optimized/DSC_1512.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1512.webp", title: "DSC_1512", location: "大阪街头", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1512.webp"] },
  { id: "3", src: "/photos/kansai/optimized/DSC_1525.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1525.webp", title: "DSC_1525", location: "大阪街头", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1525.webp"] },
  { id: "4", src: "/photos/kansai/optimized/DSC_1531.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1531.webp", title: "DSC_1531", location: "大阪街头", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1531.webp"] },
  { id: "5", src: "/photos/kansai/optimized/DSC_1547.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1547.webp", title: "DSC_1547", location: "天守阁", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1547.webp"] },
  { id: "6", src: "/photos/kansai/optimized/DSC_1560.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1560.webp", title: "DSC_1560", location: "天守阁", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1560.webp"] },
  { id: "7", src: "/photos/kansai/optimized/DSC_1592.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1592.webp", title: "DSC_1592", location: "天守阁", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1592.webp"] },
  { id: "8", src: "/photos/kansai/optimized/DSC_1599.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1599.webp", title: "DSC_1599", location: "蓝天大厦", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1599.webp"] },
  { id: "9", src: "/photos/kansai/optimized/DSC_1610.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1610.webp", title: "DSC_1610", location: "蓝天大厦", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1610.webp"] },
  { id: "10", src: "/photos/kansai/optimized/DSC_1615.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1615.webp", title: "DSC_1615", location: "蓝天大厦", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1615.webp"] },
  { id: "11", src: "/photos/kansai/optimized/DSC_1629.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1629.webp", title: "DSC_1629", location: "京都街口", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1629.webp"] },
  { id: "12", src: "/photos/kansai/optimized/DSC_1631.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1631.webp", title: "DSC_1631", location: "京都街口", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1631.webp"] },
  { id: "13", src: "/photos/kansai/optimized/DSC_1640.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1640.webp", title: "DSC_1640", location: "京都街口", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1640.webp"] },
  { id: "14", src: "/photos/kansai/optimized/DSC_1644.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1644.webp", title: "DSC_1644", location: "京都街口", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1644.webp"] },
  { id: "15", src: "/photos/kansai/optimized/DSC_1651.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1651.webp", title: "DSC_1651", location: "清水寺", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1651.webp"] },
  { id: "16", src: "/photos/kansai/optimized/DSC_1657.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1657.webp", title: "DSC_1657", location: "清水寺", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1657.webp"] },
  { id: "17", src: "/photos/kansai/optimized/DSC_1671.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1671.webp", title: "DSC_1671", location: "清水寺", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1671.webp"] },
  { id: "18", src: "/photos/kansai/optimized/DSC_1681.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1681.webp", title: "DSC_1681", location: "清水寺", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1681.webp"] },
  { id: "19", src: "/photos/kansai/optimized/DSC_1685.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1685.webp", title: "DSC_1685", location: "清水寺", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1685.webp"] },
  { id: "20", src: "/photos/kansai/optimized/DSC_1700.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1700.webp", title: "DSC_1700", location: "伏见稻荷大社", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1700.webp"] },
  { id: "21", src: "/photos/kansai/optimized/DSC_1702.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1702.webp", title: "DSC_1702", location: "伏见稻荷大社", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1702.webp"] },
  { id: "22", src: "/photos/kansai/optimized/DSC_1706.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1706.webp", title: "DSC_1706", location: "伏见稻荷大社", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1706.webp"] },
  { id: "23", src: "/photos/kansai/optimized/DSC_1707.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1707.webp", title: "DSC_1707", location: "伏见稻荷大社", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1707.webp"] },
  { id: "24", src: "/photos/kansai/optimized/DSC_1803.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1803.webp", title: "DSC_1803", location: "鸭川", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1803.webp"] },
  { id: "25", src: "/photos/kansai/optimized/DSC_1858.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1858.webp", title: "DSC_1858", location: "伏见稻荷大社", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1858.webp"] },
  { id: "26", src: "/photos/kansai/optimized/DSC_1903.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1903.webp", title: "DSC_1903", location: "奈良鹿", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1903.webp"] },
  { id: "27", src: "/photos/kansai/optimized/DSC_1927.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1927.webp", title: "DSC_1927", location: "京都站", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1927.webp"] },
  { id: "28", src: "/photos/kansai/optimized/DSC_1933.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1933.webp", title: "DSC_1933", location: "金阁寺", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1933.webp"] },
  { id: "29", src: "/photos/kansai/optimized/DSC_1956.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1956.webp", title: "DSC_1956", location: "丰乡小学", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1956.webp"] },
  { id: "30", src: "/photos/kansai/optimized/DSC_1960.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1960.webp", title: "DSC_1960", location: "丰乡小学", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1960.webp"] },
  { id: "31", src: "/photos/kansai/optimized/DSC_1974.webp", thumbnail: "/photos/kansai/thumbnails/DSC_1974.webp", title: "DSC_1974", location: "丰乡小学", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_1974.webp"] },
  { id: "32", src: "/photos/kansai/optimized/DSC_2000.webp", thumbnail: "/photos/kansai/thumbnails/DSC_2000.webp", title: "DSC_2000", location: "丰乡小学", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_2000.webp"] },
  { id: "33", src: "/photos/kansai/optimized/DSC_2012.webp", thumbnail: "/photos/kansai/thumbnails/DSC_2012.webp", title: "DSC_2012", location: "丰乡小学", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_2012.webp"] },
  { id: "34", src: "/photos/kansai/optimized/DSC_2025.webp", thumbnail: "/photos/kansai/thumbnails/DSC_2025.webp", title: "DSC_2025", location: "丰乡小学", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_2025.webp"] },
  { id: "35", src: "/photos/kansai/optimized/DSC_2042.webp", thumbnail: "/photos/kansai/thumbnails/DSC_2042.webp", title: "DSC_2042", location: "丰乡小学", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_2042.webp"] },
  { id: "36", src: "/photos/kansai/optimized/DSC_2045.webp", thumbnail: "/photos/kansai/thumbnails/DSC_2045.webp", title: "DSC_2045", location: "丰乡小学", category: "kansai", width: 1600, height: 1067, blurDataURL: blurData.kansai["DSC_2045.webp"] },
];

async function main() {
  console.log(`Seeding ${photos.length} photos...`);

  await prisma.photo.deleteMany();

  for (const photo of photos) {
    await prisma.photo.create({ data: photo });
  }

  const count = await prisma.photo.count();
  console.log(`Done. ${count} photos in database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
