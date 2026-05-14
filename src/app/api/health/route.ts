import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.photo.count();
    return NextResponse.json({ ok: true, photos: count });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({ ok: false, error: "健康检查失败" }, { status: 500 });
  }
}
