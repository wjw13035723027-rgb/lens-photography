"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      login(data.token, data.user);
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="text-2xl font-serif tracking-widest text-center mb-8">登录</h1>
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱"
            required
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
            required
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
        </div>
        {error && <p className="text-red-400 text-xs mt-3 text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 px-6 py-3 rounded-xl bg-foreground text-background text-sm tracking-widest hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {loading ? "登录中..." : "登录"}
        </button>
        <p className="text-muted text-xs text-center mt-6">
          还没有账号？{" "}
          <Link href="/register" className="text-accent hover:text-accent-hover transition-colors">
            注册
          </Link>
        </p>
      </form>
    </div>
  );
}
