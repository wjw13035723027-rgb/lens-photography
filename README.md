# LENS 摄影作品集

基于 Next.js App Router、Prisma 7、libSQL/Turso 的摄影作品展示站点。站点包含作品系列、照片灯箱、联系表单、用户留言面板和管理员回复面板。

## 本地开发

```bash
npm install
npm run prepare:local
npm run dev
```

打开 `http://localhost:3000` 查看页面。

`prepare:local` 会创建 `data/` 目录、生成 Prisma Client、把 schema 推到本地 SQLite/libSQL 文件并写入照片种子数据。这个脚本只用于本地开发。

## 常用脚本

```bash
npm run dev          # 启动开发服务器
npm run build        # 只做 Next.js 生产构建，不改数据库
npm run start        # 启动生产服务器
npm run lint         # ESLint
npm test             # Node test runner + tsx
npm run db:generate  # 生成 Prisma Client
npm run db:push      # 推送 schema，非破坏性默认命令
npm run db:seed      # 写入本地照片种子数据
```

`npm run db:push:force` 包含 `--accept-data-loss`，只应在你确认可以丢弃数据的本地数据库上手动运行。不要把它放进构建或部署流程。

## 环境变量

本地开发可以不配置远程数据库，代码会使用 `data/photography.db`。

生产部署必须配置：

```bash
JWT_SECRET=生成一个足够长的随机字符串
TURSO_URL=libsql://...
TURSO_TOKEN=...
```

在 Vercel 上部署时，如果缺少 `TURSO_URL`，应用会直接报错，避免把用户、留言或回复写入不可持久化的本地文件。非 Vercel 环境也可以设置 `TURSO_REQUIRED=true` 来强制要求远程数据库。

## 认证与后台

登录和注册接口会把 JWT 写入 `HttpOnly` cookie，客户端只保存安全的用户资料用于导航显示，不再把 token 写进 `localStorage`。后台接口会用 cookie 中的 `userId` 查询数据库，并以数据库里的当前 `role` 判断管理员权限。

普通注册用户默认是 `role = "user"`。需要管理员账号时，在数据库中把指定用户的 `role` 改为 `admin`。

## 图片与数据

照片资源位于 `public/photos/`。照片元数据由 `prisma/seed.ts` 写入数据库。`data/blur-data-urls.json` 是可选的低清占位图数据；如果文件不存在，seed 仍会运行，只是不会写入 `blurDataURL`。

相关脚本：

```bash
node scripts/optimize-images.mjs
node scripts/generate-thumbnails.mjs
tsx scripts/generate-blur.ts
```

## 部署注意

部署流程应分开处理数据库和构建：

1. 先在受控环境里运行数据库迁移或 `npm run db:push`。
2. 如需种子数据，手动运行 `npm run db:seed`，不要在生产构建中自动 seed。
3. 运行 `npm run build`。

`npm run build` 不会再执行 `prisma db push`、`--accept-data-loss` 或 seed，避免构建时误改生产数据。
