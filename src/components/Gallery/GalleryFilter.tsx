'use client';

import { motion } from 'framer-motion';
import { Category, CATEGORY_LABELS, CATEGORIES } from '@/lib/types';

interface Props {
  active: Category;
  onChange: (category: Category) => void;
}

export default function GalleryFilter({ active, onChange }: Props) {
  const categories: Category[] = [...CATEGORIES];

  return (
    <div className="flex items-center gap-1">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`relative px-3 py-1.5 text-sm tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded ${
            active === cat
              ? 'text-foreground'
              : 'text-muted hover:text-foreground/70'
          }`}
        >
          {CATEGORY_LABELS[cat]}
          {active === cat && (
            <motion.span
              layoutId="filter-underline"
              className="absolute bottom-0 left-2 right-2 h-px bg-accent"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
