import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

async function main() {
  const adapter = new PrismaLibSql({
    url: "file:" + path.join(process.cwd(), "data", "photography.db"),
  });
  const prisma = new PrismaClient({ adapter });

  const photos = await prisma.photo.findMany();
  let count = 0;
  for (const p of photos) {
    const filename = p.thumbnail!.split("/").pop()!;
    const newThumb = "/photos/thumbnails/" + filename;
    if (p.thumbnail !== newThumb) {
      await prisma.photo.update({ where: { id: p.id }, data: { thumbnail: newThumb } });
      count++;
    }
  }
  console.log("Updated " + count + " thumbnail paths");
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
