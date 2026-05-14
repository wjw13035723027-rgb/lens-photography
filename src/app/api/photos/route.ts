import { NextResponse } from "next/server";
import { getStaticPhotos } from "@/lib/staticPhotos";

async function getDatabasePhotos(category: string | null) {
  const { prisma } = await import("@/lib/prisma");

  return prisma.photo.findMany({
    where: category ? { category } : {},
    orderBy: { createdAt: "desc" },
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    const photos = await getDatabasePhotos(category);
    return NextResponse.json(photos.length > 0 ? photos : getStaticPhotos(category));
  } catch (error) {
    console.error("Photos database query failed; using bundled photo catalog:", error);
    return NextResponse.json(getStaticPhotos(category));
  }
}
