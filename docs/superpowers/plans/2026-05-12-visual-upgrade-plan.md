# Visual Upgrade: Minimal Gallery Experience — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the LENS photography site with 6 refined interaction layers for a minimal, high-end gallery feel.

**Architecture:** Progressive enhancement — CSS `animation-timeline` as primary scroll driver with automatic fallback for unsupported browsers. Existing Framer Motion infrastructure stays as foundation. One new utility script for blur placeholder generation. No new npm dependencies.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion 12, TypeScript 5, sharp (already installed)

---

### Task 1: Hero Simplification

**Files:**
- Modify: `src/components/HomeClient.tsx:100-205`

- [ ] **Step 1: Remove floating orb animations**

Delete the two `motion.div` elements (lines 119-136) that render the amber and grey radial-gradient orbs.

- [ ] **Step 2: Reduce parallax intensity**

On line 68, change `window.scrollY * 0.35` to `window.scrollY * 0.15`:

```tsx
parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`;
```

- [ ] **Step 3: Increase title font size**

On line 158, change `text-6xl sm:text-7xl lg:text-9xl` to `text-7xl sm:text-8xl lg:text-9xl`:

```tsx
className="text-7xl sm:text-8xl lg:text-9xl font-black font-serif tracking-[-0.02em] text-foreground leading-[0.9]"
```

- [ ] **Step 4: Replace scroll indicator with minimal arrow**

Replace the existing scroll indicator div (lines 190-203) with a simpler version:

```tsx
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
```

- [ ] **Step 5: Commit**

```bash
git add src/components/HomeClient.tsx
git commit -m "refine: simplify hero — remove orbs, reduce parallax, minimal scroll indicator"
```

---

### Task 2: Image Reveal — HomeClient Cards

**Files:**
- Modify: `src/components/HomeClient.tsx:294-300`

- [ ] **Step 1: Wrap cover Image in reveal container**

Replace the existing `<Image>` inside the project card (around line 294-300) with a reveal wrapper:

```tsx
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
```

And remove `object-cover transition-all duration-600 ease-out group-hover:scale-[1.04] group-hover:saturate-[1.08]` from the old `<Image>` — the hover scale is now handled differently since the image is inside the reveal wrapper. Instead, apply hover scale to the outer `motion.div` card by adding a group-hover scale on the entire card container.

- [ ] **Step 2: Adjust hover effect on the outer card container**

On the `motion.div` card (around line 288), keep the card-level hover effect. Since the image reveal wrapper handles its own animation, remove the image-level hover classes and instead scale the reveal wrapper's inner div on hover:

Add to the reveal wrapper's inner motion.div:
```tsx
className="... group-hover:scale-[1.04] transition-transform duration-600 ease-out"
```

Remove the old image hover classes from the Image component (they're no longer on the Image element itself).

- [ ] **Step 3: Commit**

```bash
git add src/components/HomeClient.tsx
git commit -m "feat: add image reveal animation to home page cards"
```

---

### Task 3: Image Reveal — MasonryGrid

**Files:**
- Modify: `src/components/Gallery/MasonryGrid.tsx:83-106`

- [ ] **Step 1: Wrap each photo Image in reveal container**

Replace the `<Image>` element inside the `motion.button` (around lines 98-106) with the reveal pattern:

```tsx
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
    className="absolute inset-0"
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
```

The old `<Image>` and its surrounding code gets replaced by this block. The rest of the button (overlay, location badge, title text) stays as-is.

- [ ] **Step 2: Commit**

```bash
git add src/components/Gallery/MasonryGrid.tsx
git commit -m "feat: add image reveal animation to masonry grid photos"
```

---

### Task 4: Scroll-Driven Fade-in — CSS Foundation

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add `animate-reveal` utility class**

Append to `src/app/globals.css`:

```css
/* Scroll-driven reveal — falls back to visible on unsupported browsers */
.animate-reveal {
  opacity: 1;
}

@supports (animation-timeline: view()) {
  .animate-reveal {
    animation: reveal linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 30%;
  }
}

@keyframes reveal {
  from {
    opacity: 0;
    translate: 0 24px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add scroll-driven reveal CSS with browser fallback"
```

---

### Task 5: Scroll-Driven Fade-in — Apply to Pages

**Files:**
- Modify: `src/components/AboutClient.tsx`
- Modify: `src/components/ContactClient.tsx`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Add `animate-reveal` to About page content**

In `src/components/AboutClient.tsx`, add `className="animate-reveal"` to:
- The bio paragraph (line 32): `className="text-base leading-8 text-muted max-w-lg animate-reveal"`
- The gear heading (line 38): `className="text-xs tracking-[0.2em] text-muted uppercase mb-6 animate-reveal"`
- Each gear list item (line 41): `className="text-sm text-foreground/80 tracking-wide animate-reveal"`

- [ ] **Step 2: Add `animate-reveal` to Contact page form**

In `src/components/ContactClient.tsx`, add `className="animate-reveal"` to each form field container div. Wrap each `<div>` that contains label+input with the class:

```tsx
<div className="animate-reveal">
  <label ...>...</label>
  <input ... />
  ...
</div>
```

Apply to name, email, subject, message fields. Also to the heading/description lines 65-67 and submit button.

- [ ] **Step 3: Add `animate-reveal` to Footer**

In `src/components/Footer.tsx`, add `className="animate-reveal"` to the footer content.

```tsx
<p className="text-xs text-muted tracking-widest animate-reveal">© LENS</p>
```

- [ ] **Step 4: Add `animate-reveal` to Project detail page**

In `src/components/ProjectClient.tsx`, add `className="animate-reveal"` to the title and description lines 83-86:

```tsx
<p className="text-accent text-xs tracking-[0.2em] uppercase mb-3 font-mono animate-reveal">Series</p>
<h1 className="text-3xl sm:text-4xl font-serif tracking-widest mb-3 animate-reveal">{title}</h1>
<p className="text-muted text-sm mb-16 tracking-wide animate-reveal">...</p>
```

- [ ] **Step 5: Add `animate-reveal` to Hero text**

In `src/components/HomeClient.tsx`, add to the Hero text elements (keep existing Framer Motion as fallback):

The CSS class will be overridden by Framer Motion inline styles if JS is running. Add `className="animate-reveal"` as a progressive enhancement alongside the existing `initial`/`animate` props on lines 139-186. The CSS animation handles the case where JS-based animation is skipped (SSR or reduced motion).

- [ ] **Step 6: Commit**

```bash
git add src/components/AboutClient.tsx src/components/ContactClient.tsx src/components/Footer.tsx src/components/ProjectClient.tsx src/components/HomeClient.tsx
git commit -m "feat: apply scroll-driven fade-in to all page content"
```

---

### Task 6: Navbar Refinement

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Adjust scroll trigger and background opacity**

On line 24, change the scroll threshold from 48 to 80:
```tsx
const onScroll = () => setScrolled(window.scrollY > 80);
```

On line 56, change background opacity and transition duration:
```tsx
className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
  scrolled
    ? 'bg-background/50 backdrop-blur-2xl border-b border-white/[0.05]'
    : 'bg-transparent'
}`}
```

- [ ] **Step 2: Update mobile menu background**

On line 117, replace `bg-background/80 backdrop-blur-2xl` with `bg-background/95`:
```tsx
<div className="md:hidden bg-background/95 border-b border-white/[0.05]">
```

- [ ] **Step 3: Replace active indicator with font weight**

On line 48-50, change the link style function. Remove the bottom border indicator and use font weight:

```tsx
const linkClass = (href: string) =>
  `relative py-1 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded ${
    pathname === href ? 'text-foreground font-medium' : 'text-muted/60'
  }`;
```

Remove the active indicator span on lines 83-85:
```tsx
{pathname === href && (
  <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent" />
)}
```

Delete those 3 lines.

- [ ] **Step 4: Add logo size transition on scroll**

On line 63, change the LENS logo to shrink on scroll:

```tsx
<Link
  href="/"
  className={`font-serif tracking-[0.3em] text-foreground hover:opacity-70 transition-all duration-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded ${
    scrolled ? 'text-base' : 'text-lg'
  }`}
>
  LENS
</Link>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "refine: navbar — slower scroll transition, font-weight indicator, logo shrink"
```

---

### Task 7: Generate blurDataURL Script

**Files:**
- Create: `scripts/generate-blur.ts`

- [ ] **Step 1: Write the generation script**

Create `scripts/generate-blur.ts`:

```ts
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const PHOTOS_DIR = path.join(process.cwd(), "public", "photos");

// All category slugs under public/photos/
const categories = fs
  .readdirSync(PHOTOS_DIR)
  .filter((name) => {
    const full = path.join(PHOTOS_DIR, name);
    return fs.statSync(full).isDirectory() && name !== "avatar.jpg";
  });

async function generateBlur(srcPath: string): Promise<string> {
  const buffer = await sharp(srcPath).resize(10).webp({ quality: 20 }).toBuffer();
  const base64 = buffer.toString("base64");
  return `data:image/webp;base64,${base64}`;
}

async function main() {
  const results: Record<string, Record<string, string>> = {};

  for (const cat of categories) {
    results[cat] = {};
    const optimizedDir = path.join(PHOTOS_DIR, cat, "optimized");
    if (!fs.existsSync(optimizedDir)) continue;

    const files = fs.readdirSync(optimizedDir).filter((f) => f.endsWith(".webp"));
    for (const file of files) {
      const filePath = path.join(optimizedDir, file);
      console.log(`Generating blur for ${cat}/${file}...`);
      const blur = await generateBlur(filePath);
      results[cat][file] = blur;
    }
  }

  const outPath = path.join(process.cwd(), "data", "blur-data-urls.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`Written ${Object.values(results).reduce((s, r) => s + Object.keys(r).length, 0)} entries to ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 2: Run the script**

```bash
npx tsx scripts/generate-blur.ts
```

Expected: outputs `data/blur-data-urls.json` with 36 entries.

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-blur.ts data/blur-data-urls.json
git commit -m "feat: add blur placeholder generation script and data"
```

---

### Task 8: Photo Type + Seed Update for blurDataURL

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Add `blurDataURL` to Photo interface**

In `src/lib/types.ts`, add the optional field:

```ts
export interface Photo {
  id: string;
  src: string;
  thumbnail: string;
  title: string;
  location: string;
  category: Category;
  width: number;
  height: number;
  blurDataURL?: string;
}
```

- [ ] **Step 2: Update seed data with blurDataURL values**

Import the generated JSON and add blurDataURL to each photo entry. Update `prisma/seed.ts`:

Add import at top:
```ts
import blurData from "../data/blur-data-urls.json" with { type: "json" };
```

Update the photos array — add `blurDataURL: blurData.kansai["DSC_1507.webp"]` (matching filename) to each entry. Since all 36 photos are in the `kansai` key:

For each photo entry, add:
```ts
blurDataURL: blurData.kansai["DSC_1507.webp"],
```

(Each entry uses its own filename — DSC_1507, DSC_1512, etc.)

- [ ] **Step 3: Re-seed the database**

```bash
npx tsx prisma/seed.ts
```

Expected: `Done. 36 photos in database.`

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts prisma/seed.ts
git commit -m "feat: add blurDataURL to Photo model and seed data"
```

---

### Task 9: Progressive Image Loading — Components

**Files:**
- Modify: `src/components/HomeClient.tsx`
- Modify: `src/components/Gallery/MasonryGrid.tsx`
- Modify: `src/components/Lightbox/Lightbox.tsx`
- Modify: `src/components/AboutClient.tsx`

- [ ] **Step 1: Update HomeClient card images with blur placeholder**

In `src/components/HomeClient.tsx`, use the `ProjectMeta` interface to include `blurDataURL`. Then in the card Image, add `placeholder="blur"` and `blurDataURL`:

The `ProjectMeta` interface in `types.ts` doesn't have `blurDataURL`. Instead, pull it from the first photo of each category. In `HomeClient.tsx`, update the `projects` useMemo to include it:

```tsx
return CATEGORIES.filter((cat) => grouped[cat]?.length).map((cat): ProjectMeta & { blurDataURL?: string } => {
  const items = grouped[cat];
  const cover = items[0];
  return {
    slug: cat,
    title: CATEGORY_LABELS[cat],
    cover: cover.thumbnail,
    blurDataURL: cover.blurDataURL,
    description: `${items.length} 张作品`,
    year: "2025",
    photoCount: items.length,
  };
});
```

Then on the Image in the card reveal wrapper:
```tsx
<Image
  src={project.cover}
  alt={project.title}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
  unoptimized
  placeholder={project.blurDataURL ? "blur" : undefined}
  blurDataURL={project.blurDataURL}
  className="object-cover"
  style={{ transition: "filter 0.5s ease-out" }}
/>
```

- [ ] **Step 2: Update MasonryGrid images with blur placeholder**

In `src/components/Gallery/MasonryGrid.tsx`, update the Image inside the reveal wrapper:

```tsx
<Image
  src={photo.thumbnail}
  alt={photo.title}
  width={photo.width}
  height={photo.height}
  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
  unoptimized
  placeholder={photo.blurDataURL ? "blur" : undefined}
  blurDataURL={photo.blurDataURL}
  className="w-full h-auto block transition-all duration-600 ease-out group-hover:scale-[1.04] group-hover:saturate-[1.1]"
  style={{ filter: undefined, transition: "filter 0.5s ease-out, transform 0.6s ease-out" }}
/>
```

- [ ] **Step 3: Update Lightbox with thumbnail placeholder while loading**

In `src/components/Lightbox/Lightbox.tsx`, add a loading state that shows the thumbnail while the full image loads. Wrap the Image in a container that uses photo.thumbnail as background:

```tsx
<div
  className="max-w-[90vw] max-h-[82vh] relative"
  style={{
    backgroundImage: `url(${photo.thumbnail})`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
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
    draggable={false}
    style={{ transition: "opacity 0.5s ease-out" }}
  />
</div>
```

- [ ] **Step 4: Update AboutClient avatar**

In `src/components/AboutClient.tsx`, add `style={{ transition: "filter 0.5s ease-out" }}` to the avatar Image.

- [ ] **Step 5: Build and verify**

```bash
npm run build
```

Expected: build succeeds. Test locally with `npm run dev` — images should show blur placeholder then sharpen.

- [ ] **Step 6: Commit**

```bash
git add src/components/HomeClient.tsx src/components/Gallery/MasonryGrid.tsx src/components/Lightbox/Lightbox.tsx src/components/AboutClient.tsx
git commit -m "feat: progressive image loading with blur placeholders"
```

---

### Task 10: Lightbox Transition Polish

**Files:**
- Modify: `src/components/Lightbox/Lightbox.tsx`

- [ ] **Step 1: Change AnimatePresence mode from wait to sync**

On line 106, change `mode="wait"` to `mode="sync"`:

```tsx
<AnimatePresence mode="sync">
```

- [ ] **Step 2: Adjust transition timing and add scale**

Change the image motion.div (lines 107-112) animation props:

```tsx
<motion.div
  key={photo.id}
  initial={noAnim ?? { opacity: 0, scale: 1.02 }}
  animate={noAnim ?? { opacity: 1, scale: 1 }}
  exit={noAnim ?? { opacity: 0, scale: 0.98 }}
  transition={reduced ? { duration: 0 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
  ...
>
```

- [ ] **Step 3: Simplify bottom text animation**

On lines 133-136, change the title/location text from motion-based to simple fade:

```tsx
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
```

- [ ] **Step 4: Update close animation with scale**

The outer overlay (lines 64-70) already has a fade-out exit. Add a subtle scale to the exit:

```tsx
<motion.div
  className="fixed inset-0 z-[100] bg-black/97 flex items-center justify-center"
  initial={noAnim ?? { opacity: 0 }}
  animate={noAnim ?? { opacity: 1 }}
  exit={noAnim ?? { opacity: 0, scale: 0.97 }}
  transition={reduced ? { duration: 0 } : { duration: 0.4 }}
  onClick={onClose}
>
```

- [ ] **Step 5: Build and test locally**

```bash
npm run build
npm run dev
```

Verify: open a project detail page, click an image, navigate left/right — transitions should feel smoother with crossfade. Close should have subtle scale-down effect.

- [ ] **Step 6: Commit**

```bash
git add src/components/Lightbox/Lightbox.tsx
git commit -m "refine: lightbox — sync crossfade, subtle scale, smaller text"
```

---

## Verification Checklist

After all tasks complete, verify:
- [ ] `npm run build` succeeds with no errors
- [ ] Home page: Hero is clean (no orbs), cards reveal on scroll
- [ ] Project detail: masonry images reveal on scroll
- [ ] Scrolling: text fades in naturally on Chrome/Edge
- [ ] Firefox: text visible immediately (graceful fallback)
- [ ] Images: blur placeholder → sharp transition visible
- [ ] Lightbox: crossfade between images, smooth close
- [ ] Navbar: slow background transition, no bottom border on active link
