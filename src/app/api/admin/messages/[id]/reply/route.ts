import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/currentUser";
import { z } from "zod";

const schema = z.object({
  reply: z.string().trim().min(1, "回复内容不能为空").max(2000, "回复内容不能超过 2000 字"),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdminUser(request);
  if (!user) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const existing = await prisma.contactMessage.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "留言不存在" }, { status: 404 });
  }

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: { reply: parsed.data.reply, repliedAt: new Date() },
  });

  return NextResponse.json(updated);
}
