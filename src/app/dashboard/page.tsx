"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";

interface Message {
  id: string;
  subject: string;
  message: string;
  reply: string | null;
  repliedAt: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    fetchMessages();
  }, [user, authLoading]);

  async function fetchMessages() {
    try {
      const res = await fetch("/api/user/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted text-sm">
        加载中...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pt-24 pb-32">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-2xl font-serif tracking-widest">我的留言</h1>
          <p className="text-muted text-sm mt-1">
            {user?.name} · {messages.length} 条留言
          </p>
        </div>
        <button
          onClick={() => { logout(); router.push("/"); }}
          className="px-4 py-2 text-xs tracking-widest border border-border rounded-full text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          退出
        </button>
      </div>

      {error ? (
        <p className="text-red-400 text-sm text-center py-20">{error}</p>
      ) : messages.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted text-sm mb-4">你还没有留言</p>
          <button
            onClick={() => router.push("/contact")}
            className="px-6 py-2 text-xs tracking-widest border border-border rounded-full text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
          >
            去留言
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl bg-card border border-border p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <p className="text-xs text-accent tracking-widest">{msg.subject}</p>
                <span className="text-[10px] text-muted whitespace-nowrap">
                  {new Date(msg.createdAt).toLocaleString("zh-CN")}
                </span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">{msg.message}</p>

              {msg.reply ? (
                <div className="rounded-lg bg-accent/5 border border-accent/10 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-accent tracking-widest">管理员回复</span>
                    {msg.repliedAt && (
                      <span className="text-[10px] text-muted">
                        {new Date(msg.repliedAt).toLocaleString("zh-CN")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/80">{msg.reply}</p>
                </div>
              ) : (
                <p className="text-xs text-muted italic">等待回复中...</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
