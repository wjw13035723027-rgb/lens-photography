"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Photo, CATEGORY_LABELS, Category, CATEGORIES } from "@/lib/types";
import { useReducedMotion } from "@/lib/useReducedMotion";
import MasonryGrid from "@/components/Gallery/MasonryGrid";

function SkeletonGrid() {
  return (
    <div className="columns-1 sm:columns-2 xl:columns-3 gap-10 lg:gap-16 px-6 max-w-6xl mx-auto">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="break-inside-avoid mb-12 lg:mb-16 w-full">
          <div
            className="rounded-2xl bg-foreground/[0.03] animate-pulse"
            style={{ paddingBottom: `${60 + (i % 4) * 15}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function isValidCategory(slug: string): slug is Category {
  return (CATEGORIES as readonly string[]).includes(slug);
}

export default function ProjectClient() {
  const { slug } = useParams<{ slug: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const valid = isValidCategory(slug);
  const title = valid ? CATEGORY_LABELS[slug] : slug;
  const catIndex = valid ? CATEGORIES.indexOf(slug) : -1;
  const prevSlug = catIndex > 0 ? CATEGORIES[catIndex - 1] : null;
  const nextSlug = catIndex >= 0 && catIndex < CATEGORIES.length - 1 ? CATEGORIES[catIndex + 1] : null;

  const fetchPhotos = useCallback(() => {
    if (!valid) {
      setPhotos([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/photos?category=${encodeURIComponent(slug)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setPhotos(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug, valid]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return (
    <div className="mx-auto max-w-7xl px-6 pt-24 pb-32">
      <motion.div
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors tracking-widest font-mono mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 3L5 7l4 4" />
          </svg>
          BACK
        </Link>

        <p className="text-accent text-xs tracking-[0.2em] uppercase mb-3 font-mono">Series</p>
        <h1 className="text-3xl sm:text-4xl font-serif tracking-widest mb-3">{title}</h1>
        <p className="text-muted text-sm mb-16 tracking-wide">
          {loading ? "" : `${photos.length} 张作品`}
        </p>
      </motion.div>

      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-40 text-muted">
          <p className="text-sm tracking-widest">{error}</p>
          <button
            onClick={fetchPhotos}
            className="mt-4 px-6 py-2 text-xs tracking-widest border border-border rounded-full hover:bg-foreground hover:text-background transition-colors"
          >
            重试
          </button>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 text-muted">
          <p className="text-sm tracking-widest">
            {valid ? "该系列暂无作品" : "该系列不存在"}
          </p>
          <Link
            href="/"
            className="mt-4 px-6 py-2 text-xs tracking-widest border border-border rounded-full hover:bg-foreground hover:text-background transition-colors"
          >
            返回首页
          </Link>
        </div>
      ) : (
        <MasonryGrid photos={photos} />
      )}

      {/* Prev / Next */}
      <div className="mt-24 flex items-center justify-between pt-8 border-t border-border">
        {prevSlug ? (
          <Link
            href={`/projects/${prevSlug}`}
            className="group flex items-center gap-3 text-sm text-muted hover:text-foreground transition-colors tracking-widest"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M10 3L5 8l5 5" />
            </svg>
            {CATEGORY_LABELS[prevSlug as Category]}
          </Link>
        ) : (
          <div />
        )}
        {nextSlug && (
          <Link
            href={`/projects/${nextSlug}`}
            className="group flex items-center gap-3 text-sm text-muted hover:text-foreground transition-colors tracking-widest"
          >
            {CATEGORY_LABELS[nextSlug as Category]}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
