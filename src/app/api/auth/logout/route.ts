import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/authCookie";

export async function POST() {
  return clearAuthCookie(NextResponse.json({ success: true }));
}
