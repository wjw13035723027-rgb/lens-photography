"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Photo } from "@/lib/types";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface Props {
  photos: Photo[];
  cursor: number;
  onCursorChange: (index: number | null) => void;
  onClose: () => void;
}

export default function Lightbox({ photos, cursor, onCursorChange, onClose }: Props) {
  const photo = photos[cursor];
  const reduced = useReducedMotion();
  const touchStart = useRef<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);

  const goTo = useCallback(
    (dir: -1 | 1) => {
      const next = cursor + dir;
      if (next < 0) onCursorChange(photos.length - 1);
      else if (next >= photos.length) onCursorChange(0);
      else onCursorChange(next);
    },
    [cursor, photos.length, onCursorChange],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("lightbox-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("lightbox-open");
    };
  }, [onClose, goTo]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    setTouchDelta(e.touches[0].clientX - touchStart.current);
  };
  const onTouchEnd = () => {
    if (Math.abs(touchDelta) > 80) {
      goTo(touchDelta < 0 ? 1 : -1);
    }
    touchStart.current = null;
    setTouchDelta(0);
  };

  const noAnim = reduced ? { opacity: 1, scale: 1 } : undefined;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/97 flex items-center justify-center"
      initial={noAnim ?? { opacity: 0 }}
      animate={noAnim ?? { opacity: 1 }}
      exit={noAnim ?? { opacity: 0, scale: 0.97 }}
      transition={reduced ? { duration: 0 } : { duration: 0.4 }}
      onClick={onClose}
    >
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-6 py-5 z-10">
        <span className="text-white/40 text-xs tracking-[0.2em] uppercase">
          {String(cursor + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
          aria-label="关闭"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); goTo(-1); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white/80 transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
        aria-label="上一张"
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M22 8l-10 10 10 10" />
        </svg>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goTo(1); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 text-white/30 hover:text-white/80 transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
        aria-label="下一张"
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M14 8l10 10-10 10" />
        </svg>
      </button>

      <AnimatePresence mode="sync">
        <motion.div
          key={photo.id}
          initial={noAnim ?? { opacity: 0, scale: 1.02 }}
          animate={noAnim ?? { opacity: 1, scale: 1 }}
          exit={noAnim ?? { opacity: 0, scale: 0.98 }}
          transition={reduced ? { duration: 0 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[90vw] max-h-[90vh] relative"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            backgroundImage: `url(${photo.thumbnail})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transform: touchDelta ? `translateX(${touchDelta}px)` : undefined,
            transition: touchDelta ? "none" : undefined,
          }}
        >
          <Image
            src={photo.src}
            alt={photo.title}
            width={photo.width}
            height={photo.height}
            sizes="90vw"
            quality={85}
            className="max-w-full max-h-[82vh] object-contain select-none relative z-10"
            style={{ transition: "opacity 0.5s ease-out" }}
            draggable={false}
          />
          <div className="mt-5 text-center">
            <motion.p
              key={`title-${photo.id}`}
              initial={noAnim ?? { opacity: 0 }}
              animate={noAnim ?? { opacity: 1 }}
              transition={reduced ? { duration: 0 } : { duration: 0.35, delay: 0.1 }}
              className="text-white/90 text-xs font-serif tracking-wide"
            >
              {photo.title}
            </motion.p>
            <motion.p
              key={`loc-${photo.id}`}
              initial={noAnim ?? { opacity: 0 }}
              animate={noAnim ?? { opacity: 1 }}
              transition={reduced ? { duration: 0 } : { duration: 0.35, delay: 0.15 }}
              className="text-white/35 text-[11px] mt-1 tracking-wide"
            >
              {photo.location}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
