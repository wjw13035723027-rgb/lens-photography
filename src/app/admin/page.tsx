"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  reply: string | null;
  repliedAt: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replying, setReplying] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") {
      router.push("/login");
      return;
    }
    fetchMessages();
  }, [user, authLoading]);

  async function fetchMessages() {
    try {
      const res = await fetch("/api/admin/messages", {
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

  async function handleReply(id: string) {
    const text = replyText[id]?.trim();
    if (!text) return;
    setReplying((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/admin/messages/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, reply: data.reply, repliedAt: data.repliedAt } : m))
      );
      setReplyText((prev) => ({ ...prev, [id]: "" }));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setReplying((prev) => ({ ...prev, [id]: false }));
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
    <div className="mx-auto max-w-4xl px-6 pt-24 pb-32">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-2xl font-serif tracking-widest">留言管理</h1>
          <p className="text-muted text-sm mt-1">
            {messages.length} 条留言 · {user?.name}
          </p>
        </div>
        <button
          onClick={() => { logout(); router.push("/login"); }}
          className="px-4 py-2 text-xs tracking-widest border border-border rounded-full text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          退出
        </button>
      </div>

      {messages.length === 0 ? (
        <p className="text-muted text-sm text-center py-20">暂无留言</p>
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
                <div>
                  <p className="text-sm font-medium">{msg.name}</p>
                  <p className="text-xs text-muted mt-0.5">{msg.email}</p>
                </div>
                <span className="text-[10px] text-muted whitespace-nowrap">
                  {new Date(msg.createdAt).toLocaleString("zh-CN")}
                </span>
              </div>
              <p className="text-xs text-accent tracking-widest mb-2">{msg.subject}</p>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">{msg.message}</p>

              {msg.reply ? (
                <div className="rounded-lg bg-accent/5 border border-accent/10 p-4">
                  <p className="text-[10px] text-accent tracking-widest mb-1">你的回复</p>
                  <p className="text-sm text-foreground/80">{msg.reply}</p>
                  <p className="text-[10px] text-muted mt-1">
                    {msg.repliedAt && new Date(msg.repliedAt).toLocaleString("zh-CN")}
                  </p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    value={replyText[msg.id] || ""}
                    onChange={(e) =>
                      setReplyText((prev) => ({ ...prev, [msg.id]: e.target.value }))
                    }
                    placeholder="输入回复..."
                    className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    onClick={() => handleReply(msg.id)}
                    disabled={replying[msg.id] || !replyText[msg.id]?.trim()}
                    className="px-4 py-2 rounded-lg bg-foreground text-background text-xs tracking-widest hover:opacity-90 transition-opacity disabled:opacity-30"
                  >
                    {replying[msg.id] ? "发送中" : "回复"}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
