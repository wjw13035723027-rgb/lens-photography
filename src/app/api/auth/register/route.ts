import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSafeUser, hashPassword, signToken } from "@/lib/auth";
import { setAuthCookie } from "@/lib/authCookie";
import { isRateLimited, rateLimitKey } from "@/lib/rateLimit";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "请输入姓名"),
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(6, "密码至少 6 位"),
});

export async function POST(request: Request) {
  try {
    if (isRateLimited(rateLimitKey(request, "register"), { limit: 5, windowMs: 60 * 60 * 1000 })) {
      return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "该邮箱已注册" }, { status: 400 });
    }

    const hashed = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        password: hashed,
      },
    });

    const token = await signToken({ userId: user.id, role: user.role });
    return setAuthCookie(NextResponse.json({ user: getSafeUser(user) }), token);
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "注册失败，请稍后重试" }, { status: 500 });
  }
}
