"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <>
      <ScrollProgress />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
          }
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <BackToTop />
    </>
  );
}
