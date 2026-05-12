"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Photo } from "@/lib/types";
import { useReducedMotion } from "@/lib/useReducedMotion";
import Lightbox from "@/components/Lightbox/Lightbox";

interface Props {
  photos: Photo[];
}

function seeded(seed: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return min + ((Math.abs(hash) % 1000) / 1000) * (max - min);
}

export default function MasonryGrid({ photos }: Props) {
  const [cursor, setCursor] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const layout = useMemo(
    () =>
      photos.map((photo) => {
        const rotate = seeded(photo.id + "r", -2.2, 2.2);
        const tx = seeded(photo.id + "tx", -10, 10);
        return { rotate, tx };
      }),
    [photos],
  );

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-muted">
        <svg
          className="w-16 h-16 mb-5 opacity-20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="0.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
          />
        </svg>
        <p className="text-sm tracking-widest">暂无作品</p>
      </div>
    );
  }

  const noAnim = reduced ? { opacity: 1, y: 0, scale: 1 } : undefined;

  return (
    <>
      <div className="columns-1 sm:columns-2 xl:columns-3 gap-10 lg:gap-16 px-6 max-w-6xl mx-auto">
        <AnimatePresence mode="popLayout">
          {photos.map((photo, index) => {
            const { rotate, tx } = layout[index];

            return (
              <motion.button
                key={photo.id}
                layout
                initial={noAnim ?? { opacity: 0, y: 48, scale: 0.9 }}
                animate={noAnim ?? { opacity: 1, y: 0, scale: 1 }}
                exit={noAnim ?? { opacity: 0, y: 24, scale: 0.95 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        duration: 0.55,
                        delay: index * 0.03,
                        ease: [0.16, 1, 0.3, 1],
                      }
                }
                className="break-inside-avoid mb-12 lg:mb-16 w-full group relative overflow-hidden rounded-2xl bg-card border border-white/[0.06] cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-shadow duration-500 hover:shadow-[0_0_60px_rgba(196,167,116,0.05)]"
                style={{
                  transform: `rotate(${rotate}deg) translateX(${tx}px)`,
                  transition: "transform 0.5s ease-out",
                }}
                onClick={() => setCursor(index)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "rotate(0deg) translateX(0px) scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    `rotate(${rotate}deg) translateX(${tx}px) scale(1)`;
                }}
                aria-label={`查看 ${photo.title}`}
              >
                <div className="relative overflow-hidden">
                  <motion.div
                    className="w-full"
                    initial={noAnim ?? { scale: 1.04 }}
                    whileInView={noAnim ?? { scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { duration: 0.65, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }
                    }
                  >
                    <Image
                      src={photo.thumbnail}
                      alt={photo.title}
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      unoptimized
                      className="w-full h-auto block transition-all duration-600 ease-out group-hover:scale-[1.04] group-hover:saturate-[1.1]"
                    />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "var(--background)" }}
                    initial={noAnim ?? { y: "0%" }}
                    whileInView={noAnim ?? { y: "-100%" }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { duration: 0.6, delay: index * 0.04 + 0.05, ease: [0.16, 1, 0.3, 1] }
                    }
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] tracking-widest bg-white/10 backdrop-blur-sm text-white/80 border border-white/[0.08] translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    {photo.location}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <p className="text-white text-sm font-serif tracking-wide">
                      {photo.title}
                    </p>
                    <p className="text-white/60 text-xs mt-1 tracking-wide">
                      {photo.location}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {cursor !== null && (
        <Lightbox
          photos={photos}
          cursor={cursor}
          onCursorChange={setCursor}
          onClose={() => setCursor(null)}
        />
      )}
    </>
  );
}
