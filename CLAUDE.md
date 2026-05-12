# LENS · 摄影作品集网站

个人摄影作品展示网站，复古胶片暗房风格。镜头之下，光影之间。

## 技术栈

- **框架**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **样式**: Tailwind CSS 4
- **数据库**: SQLite (libsql) + Prisma 7 ORM
- **动画**: Framer Motion 12
- **认证**: jose (JWT) + bcryptjs
- **表单**: react-hook-form + zod
- **图片处理**: sharp
- **部署**: Vercel → [lens-photography.vercel.app](https://lens-photography.vercel.app)
- **GitHub**: github.com/wjw13035723027-rgb/lens-photography

## 目录结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx            # 首页 — 作品系列卡片墙
│   ├── layout.tsx          # 根布局 — 主题/认证/Navbar/Footer
│   ├── globals.css         # 全局样式 + 设计 token
│   ├── about/              # 关于页
│   ├── contact/            # 联系页
│   ├── projects/[slug]/    # 项目详情页 (动态路由)
│   ├── login/ register/    # 登录/注册
│   ├── dashboard/          # 用户仪表盘
│   ├── admin/              # 管理员后台
│   └── api/                # API 路由
│       ├── photos/         # 照片数据接口
│       ├── contact/        # 留言提交接口
│       ├── auth/           # 认证接口 (login/register/me)
│       ├── admin/messages/ # 管理员留言管理
│       └── user/messages/  # 用户留言查询
├── components/             # React 组件
│   ├── HomeClient.tsx      # 首页客户端组件
│   ├── ProjectClient.tsx   # 项目详情客户端
│   ├── Navbar.tsx          # 导航栏
│   ├── Footer.tsx          # 页脚
│   ├── ThemeProvider.tsx   # 主题上下文 (暗色/浅色)
│   ├── ThemeToggle.tsx     # 主题切换按钮
│   ├── Lightbox/           # 图片灯箱组件
│   ├── Gallery/            # 画廊筛选 + 瀑布流
│   ├── PageWrapper.tsx     # 页面过渡动画
│   ├── ScrollProgress.tsx  # 滚动进度条
│   └── BackToTop.tsx       # 回到顶部按钮
├── lib/                    # 工具库
│   ├── types.ts            # 核心类型 — Category/CATEGORIES/Photo
│   ├── auth.ts             # JWT 认证工具
│   ├── AuthContext.tsx      # 认证上下文
│   ├── prisma.ts           # Prisma 客户端单例
│   └── useReducedMotion.ts # 减少动画偏好检测
└── generated/prisma/       # Prisma 生成的客户端代码
public/photos/<slug>/      # 图片按系列分目录
│   ├── optimized/           # 大图 (1600px webp)
│   └── thumbnails/          # 缩略图 (600px webp)
prisma/
├── schema.prisma           # 数据库模型定义
└── seed.ts                 # 种子数据 (照片路径在此维护)
```

## 数据库模型

- **Photo** — 照片 (id, src, thumbnail, title, location, category, width, height)
- **User** — 用户 (id, name, email, password, role)
- **ContactMessage** — 留言 (id, name, email, subject, message, reply, userId)

## 设计系统

复古胶片暗房风格，双主题：

| 属性 | 暗色模式 | 浅色模式 |
|------|---------|---------|
| 背景 | #0D0B0A (暖暗棕) | #F5F0E8 (相纸白) |
| 强调色 | #C89256 (琥珀铜) | #C89256 |
| 文字 | #E8E0D5 (暖白) | #1A1510 (深棕) |

- **字体**: Noto Serif SC (标题 700-900, 正文 300-400), JetBrains Mono (标签/代码)
- **特效**: 胶片颗粒 SVG overlay + 暗色暗角 + Framer Motion 过渡
- **无障碍**: prefers-reduced-motion 全面支持, 跳转到内容链接

## 核心约定

### 添加新摄影系列

**第一步：准备图片文件**

在 `public/photos/<slug>/` 下新建两个子目录：

```
public/photos/tokyo/
├── optimized/     # 大图 (建议 1600px 宽 webp)
└── thumbnails/    # 缩略图 (建议 600px 宽 webp)
```

**第二步：注册系列**

修改 `src/lib/types.ts`：

```ts
export const CATEGORIES = ['kansai', 'tokyo'] as const;
export const CATEGORY_LABELS: Record<Category, string> = {
  kansai: '日本关西',
  tokyo: '东京',
};
```

**第三步：添加照片数据**

在 `prisma/seed.ts` 的 `photos` 数组中追加：

```ts
{ id: "37", src: "/photos/tokyo/optimized/xxx.webp", thumbnail: "/photos/tokyo/thumbnails/xxx.webp", title: "xxx", location: "东京", category: "tokyo", width: 1600, height: 1067 },
```

然后运行 `npx tsx prisma/seed.ts` 刷新数据库。

首页卡片、详情页路由 `/projects/[slug]`、前后导航、API 筛选全部自动生效。

### 组件模式

- 页面文件 (`page.tsx`) 只做 metadata 导出 + 渲染客户端组件
- 客户端逻辑集中在 `*Client.tsx` 组件中
- 主题通过 `ThemeProvider` + CSS 变量 `data-theme` 属性切换
- 主题偏好存储在 `localStorage` key `lens-theme`

## 常用命令

```bash
npm run dev      # 开发服务器 (localhost:3000)
npm run build    # 生产构建
npm run start    # 启动生产服务器
npm run lint     # ESLint 检查
```

## 当前状态 (2026-05-12)

**已完成**: 双主题系统、首页卡片墙、项目详情页框架、Category 类型系统、认证系统、留言系统、管理员后台

**待做**: 关于页增强、联系页视觉升级、项目详情深度叙事、Lightbox EXIF 展示、骨架屏加载、Footer 真实链接
