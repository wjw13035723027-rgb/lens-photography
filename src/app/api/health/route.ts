import { NextResponse } from "next/server";
import { getStaticPhotos } from "@/lib/staticPhotos";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const count = await prisma.photo.count();
    return NextResponse.json({ ok: true, photos: count, source: "database" });
  } catch (error) {
    console.error("Health check failed; using bundled photo catalog:", error);
    return NextResponse.json({
      ok: true,
      photos: getStaticPhotos().length,
      source: "bundled",
      database: false,
    });
  }
}
