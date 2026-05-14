import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/currentUser";
import { isRateLimited, rateLimitKey } from "@/lib/rateLimit";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "请输入姓名"),
  email: z.string().email("邮箱格式不正确"),
  subject: z.string().min(1, "请输入主题"),
  message: z.string().min(10, "留言至少 10 个字"),
});

export async function POST(request: Request) {
  try {
    if (isRateLimited(rateLimitKey(request, "contact"), { limit: 5, windowMs: 10 * 60 * 1000 })) {
      return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 });
    }

    const body = await request.json();

    if (body.website) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const authUser = await getCurrentUser(request);

    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        userId: authUser?.id ?? null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { error: "发送失败，请稍后重试" },
      { status: 500 }
    );
  }
}
