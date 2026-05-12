import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = await getAuthUser(request);
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const reply = body.reply as string;

  if (!reply || reply.trim().length === 0) {
    return NextResponse.json({ error: "回复内容不能为空" }, { status: 400 });
  }

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: { reply: reply.trim(), repliedAt: new Date() },
  });

  return NextResponse.json(updated);
}
