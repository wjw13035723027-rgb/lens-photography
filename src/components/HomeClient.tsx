"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Photo, Category, CATEGORY_LABELS, CATEGORIES, ProjectMeta } from "@/lib/types";
import { useReducedMotion } from "@/lib/useReducedMotion";

function seeded(seed: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return min + ((Math.abs(hash) % 1000) / 1000) * (max - min);
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-16 px-6 max-w-6xl mx-auto">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="w-full">
          <div
            className="rounded-2xl bg-foreground/[0.03] animate-pulse"
            style={{ paddingBottom: `${75 + (i % 3) * 8}%` }}
          />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-2/3 bg-foreground/[0.04] rounded animate-pulse" />
            <div className="h-2 w-1/3 bg-foreground/[0.03] rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomeClient() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const parallaxRef = useRef<HTMLDivElement>(null);

  const fetchPhotos = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch("/api/photos")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setPhotos(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (parallaxRef.current) {
          parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const projects = useMemo(() => {
    const grouped: Record<string, Photo[]> = {};
    for (const photo of photos) {
      if (!grouped[photo.category]) grouped[photo.category] = [];
      grouped[photo.category].push(photo);
    }

    return CATEGORIES.filter((cat) => grouped[cat]?.length).map((cat): ProjectMeta => {
      const items = grouped[cat];
      const cover = items[0];
      return {
        slug: cat,
        title: CATEGORY_LABELS[cat],
        cover: cover.thumbnail,
        description: `${items.length} 张作品`,
        year: "2025",
        photoCount: items.length,
      };
    });
  }, [photos]);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          ref={parallaxRef}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/photos/kansai/optimized/DSC_1700.webp"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />
        </div>


        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }
            }
            className="text-accent text-xs sm:text-sm tracking-[0.3em] uppercase mb-6 font-mono"
          >
            Photography Portfolio
          </motion.p>

          <motion.h1
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.8, delay: 0.1, ease: "easeOut" }
            }
            className="text-7xl sm:text-8xl lg:text-9xl font-black font-serif tracking-[-0.02em] text-foreground leading-[0.9]"
          >
            镜头之下
          </motion.h1>

          <motion.p
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.8, delay: 0.25, ease: "easeOut" }
            }
            className="mt-8 text-muted text-base sm:text-lg tracking-wide max-w-md mx-auto leading-relaxed font-serif"
          >
            光影之间，捕捉那些转瞬即逝的真实
          </motion.p>

          <motion.p
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.8, delay: 0.4, ease: "easeOut" }
            }
            className="mt-6 text-muted/50 text-xs tracking-[0.15em] font-mono"
          >
            ISO 400 · f/5.6 · 1/250s
          </motion.p>
        </div>

        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduced ? { duration: 0 } : { delay: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground/15">
            <path d="M6 8l4 4 4-4" />
          </svg>
        </motion.div>
      </section>

      {/* ── Project Cards ── */}
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-32">
        <div className="mb-16">
          <p className="text-accent text-xs tracking-[0.2em] uppercase mb-3 font-mono">
            Portfolio
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif tracking-widest">
            作品系列
          </h2>
          <p className="text-muted text-sm mt-2">
            {loading ? "" : `${projects.length} 个系列 · ${photos.length} 张作品`}
          </p>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-40 text-muted">
            <p className="text-sm tracking-widest">{error}</p>
            <button
              onClick={fetchPhotos}
              className="mt-4 px-6 py-2 text-xs tracking-widest border border-border rounded-full hover:bg-foreground hover:text-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            >
              重试
            </button>
          </div>
        ) : projects.length === 0 ? (
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
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
              />
            </svg>
            <p className="text-sm tracking-widest">暂无作品系列</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-16">
            {projects.map((project, i) => {
              const rotate = seeded(project.slug + "card", -1.5, 1.5);
              const tx = seeded(project.slug + "tx", -6, 6);

              return (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="block group"
                >
                  <motion.div
                    initial={
                      reduced
                        ? { opacity: 1 }
                        : { opacity: 0, y: 48, scale: 0.92 }
                    }
                    whileInView={
                      reduced
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, scale: 1 }
                    }
                    viewport={{ once: true, margin: "-80px" }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : {
                            duration: 0.6,
                            delay: i * 0.1,
                            ease: [0.16, 1, 0.3, 1],
                          }
                    }
                    className="relative overflow-hidden rounded-2xl bg-card border border-border/50 transition-shadow duration-500 ease-out hover:shadow-[0_0_80px_rgba(200,146,86,0.06)]"
                    style={{
                      rotate: `${rotate}deg`,
                      translate: `${tx}px 0`,
                      aspectRatio: "6/7",
                    }}
                  >
                    <div className="relative overflow-hidden">
                      <motion.div
                        className="w-full h-full"
                        initial={reduced ? { scale: 1 } : { scale: 1.04 }}
                        whileInView={reduced ? { scale: 1 } : { scale: 1 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={
                          reduced
                            ? { duration: 0 }
                            : { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }
                        }
                      >
                        <Image
                          src={project.cover}
                          alt={project.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          unoptimized
                          className="object-cover"
                        />
                      </motion.div>
                      <motion.div
                        className="absolute inset-0"
                        style={{ background: "var(--background)" }}
                        initial={reduced ? { y: "-100%" } : { y: "0%" }}
                        whileInView={reduced ? { y: "-100%" } : { y: "-100%" }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={
                          reduced
                            ? { duration: 0 }
                            : { duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }
                        }
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                      <div className="absolute inset-x-0 bottom-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <p className="text-foreground text-lg font-serif tracking-wide font-bold">
                          {project.title}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted tracking-widest font-mono">
                            {project.photoCount} 张
                          </span>
                          <span className="text-muted/40 text-[10px]">·</span>
                          <span className="text-xs text-muted tracking-widest font-mono">
                            {project.year}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
