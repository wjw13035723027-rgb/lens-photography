import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const photos = await prisma.photo.findMany({
      where: category ? { category } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(photos);
  } catch {
    return NextResponse.json(
      { error: "加载作品失败" },
      { status: 500 }
    );
  }
}
