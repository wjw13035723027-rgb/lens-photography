import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/currentUser";

export async function GET(request: Request) {
  const user = await requireAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(messages);
}
