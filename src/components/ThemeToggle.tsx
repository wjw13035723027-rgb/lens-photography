"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="relative w-9 h-9 flex items-center justify-center text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
      aria-label={theme === "dark" ? "切换到浅色模式" : "切换到暗色模式"}
    >
      <motion.svg
        key={theme}
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {theme === "dark" ? (
          /* Sun — switch to light */
          <>
            <circle cx="9" cy="9" r="3.5" />
            <path d="M9 1v1.5M9 14.5V17M2.34 2.34l1.06 1.06M14.6 14.6l1.06 1.06M1 9h1.5M15.5 9H17M2.34 15.66l1.06-1.06M14.6 3.4l1.06-1.06" />
          </>
        ) : (
          /* Moon — switch to dark */
          <path d="M15 10.37A6 6 0 117.63 3 5 5 0 0015 10.37z" />
        )}
      </motion.svg>
    </button>
  );
}
