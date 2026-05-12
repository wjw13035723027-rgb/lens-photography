"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useAuth } from "@/lib/AuthContext";

const schema = z.object({
  name: z.string().min(1, "请填写姓名"),
  email: z.string().email("邮箱格式不对"),
  subject: z.string().min(1, "请填写主题"),
  message: z.string().min(10, "留言至少 10 个字"),
  website: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ContactClient() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { user, token } = useAuth();
  const reduced = useReducedMotion();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSent(true);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "发送失败，请稍后重试");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 pt-32 pb-24">
      <motion.div
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }}
      >
        <p className="text-accent text-xs tracking-[0.2em] uppercase mb-4">Contact</p>
        <h1 className="text-3xl sm:text-4xl font-serif tracking-widest mb-4">联系</h1>
        <p className="text-muted text-sm mb-16 tracking-wide">合作、约拍、或其他事宜，欢迎来信。</p>

        {!user && (
          <p className="text-muted text-xs text-center mb-8">
            <Link href="/login" className="text-accent hover:text-accent-hover transition-colors">登录</Link>
            {" "}后留言可在仪表盘查看回复
          </p>
        )}

        {sent ? (
          <motion.div
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center"
          >
            <p className="text-2xl font-serif tracking-widest">感谢来信</p>
            <p className="text-muted text-sm mt-3 tracking-wide">我会尽快回复你。{user && "你可以在仪表盘查看回复进度。"}</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            <input type="text" {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" />

            {serverError && (
              <p className="text-red-400 text-sm text-center">{serverError}</p>
            )}

            <div>
              <label className="block text-xs tracking-[0.15em] text-muted uppercase mb-3" htmlFor="name">姓名</label>
              <input
                id="name"
                {...register("name")}
                className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted/40 outline-none transition-colors focus:border-foreground"
                placeholder="你的名字"
              />
              {errors.name && <p className="text-red-400 text-xs mt-2">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-[0.15em] text-muted uppercase mb-3" htmlFor="email">邮箱</label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted/40 outline-none transition-colors focus:border-foreground"
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-[0.15em] text-muted uppercase mb-3" htmlFor="subject">主题</label>
              <input
                id="subject"
                {...register("subject")}
                className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted/40 outline-none transition-colors focus:border-foreground"
                placeholder="约拍 / 合作 / 其他"
              />
              {errors.subject && <p className="text-red-400 text-xs mt-2">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-[0.15em] text-muted uppercase mb-3" htmlFor="message">留言</label>
              <textarea
                id="message"
                rows={5}
                {...register("message")}
                className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted/40 outline-none transition-colors focus:border-foreground resize-none"
                placeholder="写下你想说的..."
              />
              {errors.message && <p className="text-red-400 text-xs mt-2">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-3 bg-foreground text-background text-sm tracking-widest rounded-full hover:opacity-80 transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {isSubmitting ? "发送中…" : "发送"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
