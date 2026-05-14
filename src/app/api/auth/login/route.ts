import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, getSafeUser, signToken } from "@/lib/auth";
import { setAuthCookie } from "@/lib/authCookie";
import { isRateLimited, rateLimitKey } from "@/lib/rateLimit";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(1, "请输入密码"),
});

export async function POST(request: Request) {
  try {
    if (isRateLimited(rateLimitKey(request, "login"), { limit: 10, windowMs: 15 * 60 * 1000 })) {
      return NextResponse.json({ error: "请求过于频繁，请稍后再试" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "邮箱或密码错误" }, { status: 401 });
    }

    const valid = await comparePassword(parsed.data.password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "邮箱或密码错误" }, { status: 401 });
    }

    const token = await signToken({ userId: user.id, role: user.role });
    return setAuthCookie(NextResponse.json({ user: getSafeUser(user) }), token);
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json({ error: "登录失败，请稍后重试" }, { status: 500 });
  }
}
