import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: Request) {
  const payload = await getAuthUser(request);
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(messages);
}
