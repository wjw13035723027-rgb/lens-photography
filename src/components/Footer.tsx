"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const socialAccounts = [
  { label: "Instagram", id: "13035723027" },
  { label: "微博", id: "13035723027" },
  { label: "小红书", id: "13035723027" },
];

export default function Footer() {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();

  return (
    <>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="text-sm font-serif tracking-[0.3em] text-foreground">LENS</p>
            <p className="text-xs text-muted tracking-wide animate-reveal">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-8 text-xs text-muted tracking-widest">
            {socialAccounts.map(({ label }) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {active && (() => {
          const account = socialAccounts.find((a) => a.label === active)!;
          return (
            <motion.div
              className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6"
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.3 }}
              onClick={() => setActive(null)}
            >
              <motion.div
                className="bg-background rounded-2xl p-10 max-w-sm w-full shadow-2xl"
                initial={reduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
                transition={reduced ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-serif tracking-[0.2em]">{account.label}</h3>
                  <button
                    onClick={() => setActive(null)}
                    className="text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded"
                    aria-label="关闭"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4l10 10M14 4L4 14" />
                    </svg>
                  </button>
                </div>
                <div className="text-center py-4">
                  <span className="text-2xl text-foreground tracking-wide font-mono select-all">{account.id}</span>
                </div>
                <p className="text-xs text-muted/60 mt-6 text-center">点击空白处关闭</p>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}
