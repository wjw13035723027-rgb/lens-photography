# Visual Upgrade: Minimal Gallery Experience

> 2026-05-12 · LENS Photography Portfolio
> 极简克制的高级画廊体验升级

## Overview

在现有结构不变的前提下，通过 6 个关键交互层打磨，让浏览体验从"功能齐全"升级为"安静但有力量"的高端画廊质感。所有改动都是对现有代码的参数调优或轻量包装，不引入新依赖，不改变布局结构。

## Design Principles

- **克制动效** — 动画存在但不应被注意到，服务于内容而非抢占注意力
- **渐进呈现** — 图片和文字慢慢浮现，模拟翻看画册的物理感
- **呼吸感** — 页面元素之间有"空气"，过渡自然不突兀
- **Fallback 优先** — 新特性用 CSS `@supports` 检测，不支持的浏览器自动退回到现有方案

---

## ① Image Reveal Animation · 图片揭幕动效

### 效果

图片进入视口时，一个与背景同色的遮罩从下往上滑开，将图片"揭"出来。图片本身伴有极轻微的 scale 呼吸（1.04 → 1），制造视觉深度。像翻开一本摄影集。

### 实现

- 每张图片外层包 `overflow-hidden` 容器
- 遮罩层 `position: absolute; background: var(--background)`，Framer Motion `whileInView` 驱动 `translateY: 0% → -100%`
- 图片同步 `scale(1.04 → 1)`
- Stagger 延迟 80ms（比当前 100ms 收紧）
- 缓动曲线统一为 `[0.16, 1, 0.3, 1]`（现有 cubic-bezier，保持不变）

### 范围

| 文件 | 位置 |
|------|------|
| `src/components/HomeClient.tsx` | 系列卡片封面图 |
| `src/components/Gallery/MasonryGrid.tsx` | 瀑布流缩略图 |

### 不改

卡片位置入场动画保留，只替换图片本身的呈现方式。

---

## ② Scroll-Driven Fade-in · 滚动驱动渐现

### 效果

文字和图片在滚动进入视口时随滚动位置自然浮现——滚动快慢绑定动画进度。像高端杂志排版那样"内容在呼吸中出现"。

### 实现

**层一：CSS `animation-timeline: view()`（主力）**
```css
@keyframes reveal {
  from { opacity: 0; translate: 0 24px; }
  to   { opacity: 1; translate: 0 0; }
}
.animate-reveal {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}
```

**层二：Framer Motion fallback**
```css
@supports not (animation-timeline: view()) {
  /* 退出现有 whileInView 逻辑 */
}
```

### 范围

首页 Hero 文字、关于页段落、联系页表单、项目详情页标题区、Footer 内容

### 不改

现有 Framer Motion 入场逻辑保留作为 fallback。

---

## ③ Navbar Refinement · 导航栏减法

### 改动

| 项 | Before | After |
|----|--------|-------|
| 滚动触发点 | 48px | 80px |
| 背景透明度 | `bg-background/60` | `bg-background/50` |
| 过渡时长 | `duration-500` | `duration-700` |
| 移动端菜单背景 | `bg-background/80 backdrop-blur-2xl` | `bg-background/95` |
| 活跃指示器 | 底部 `h-px bg-accent` 横线 | 去掉横线，活跃项字重 `font-medium`，非活跃项 `text-muted/60` |
| Logo 滚动反馈 | 不变 | 滚动后 `text-lg → text-base` 微缩 |

### 范围

`src/components/Navbar.tsx`

---

## ④ Progressive Image Loading · 图片渐进加载

### 效果

图片从模糊占位图平滑过渡到清晰原图，杜绝"闪现"感。

### 实现

- 利用 Next.js Image 的 `placeholder="blur"` + `blurDataURL`
- 过渡用 CSS `transition: filter 0.5s ease-out`
- 需要为每张照片生成 `blurDataURL`（微型 base64 缩略图）
- 构建脚本：用 sharp 从现有图片自动生成
- Lightbox 大图加载时以 thumbnail 做临时占位

### 范围

| 文件 | 说明 |
|------|------|
| `src/components/HomeClient.tsx` | 卡片封面 |
| `src/components/Gallery/MasonryGrid.tsx` | 瀑布流 |
| `src/components/Lightbox/Lightbox.tsx` | 大图 loading 态 |
| `src/components/AboutClient.tsx` | 头像 |
| `scripts/generate-blur.ts` | 新增：blurDataURL 生成脚本 |
| `src/lib/types.ts` | Photo 接口增加 `blurDataURL?: string` |

---

## ⑤ Lightbox Transition Polish · 灯箱过渡优化

### 改动

| 项 | Before | After |
|----|--------|-------|
| 切换模式 | `mode="wait"`（旧图先出，新图后入） | `mode="sync"`（两图同时过渡，crossfade 交融） |
| 过渡时长 | 300ms | 450ms |
| 图片 scale | 无 | 新图 `1.02 → 1`，旧图 `1 → 0.98` |
| 底部文字入场 | translateY + opacity | 纯 opacity fade |
| 底部文字字号 | 当前 | 小一号 |
| 关闭动画 | 纯 fade | fade + `scale: 1 → 0.97`（收起感） |

### 范围

`src/components/Lightbox/Lightbox.tsx`

### 不改

键盘导航、触摸手势、计数器显示逻辑。

---

## ⑥ Hero Simplification · 首页减法

### 改动

| 项 | Before | After |
|----|--------|-------|
| 漂浮光斑 | 2 个 `motion.div` radial-gradient 球 | 删除 |
| 视差强度 | `scrollY * 0.35` | `scrollY * 0.15`（几乎静止的呼吸感） |
| 标题字号 | `text-6xl sm:text-7xl lg:text-9xl` | `text-7xl sm:text-8xl lg:text-9xl` |
| 底部滚动指示器 | 圆角边框 + 弹跳小球动画 | 极简单箭头 SVG，透明度更低，位置稍低 |
| 背景图 + 渐变遮罩 + 段落 + EXIF 行 | 保留 | 保留 |

### 范围

`src/components/HomeClient.tsx`

---

## Implementation Order

1. **Hero Simplification** — 最先做，改动最小，立即见效
2. **Image Reveal** — 视觉冲击最大，核心改动
3. **Scroll-Driven Fade-in** — 体验铺层，影响面广
4. **Navbar Refinement** — 独立模块，无依赖
5. **Progressive Image Loading** — 需要生成脚本，稍有依赖
6. **Lightbox Polish** — 收尾细节

## Non-Goals

- 不引入新的 npm 依赖
- 不改变布局结构或路由
- 不添加新页面
- 不做 scroll-snap 或全屏分段浏览（违背"用户控制浏览速度"原则）
- 不做自定义光标（过度设计）
