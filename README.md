<div align="center">

![风绘笔记 · HuiDev Notes 封面](README.webp)

# 风绘笔记 · HuiDev Notes

**在风经过的地方，收集故事、灵感与生活的闪光。**

一个记录代码、设计与日常幻想的二次元风格中文博客。

![Node ≥22.12](https://img.shields.io/badge/Node-%E2%89%A522.12-339933?logo=nodedotjs&logoColor=white) ![Astro 7](https://img.shields.io/badge/Astro-7-FF5D01?logo=astro&logoColor=white) ![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white) ![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)

</div>

---

## ✦ 关于这里

> 白天构建网页和数字产品，夜晚记录那些不适合放进待办清单的念头。

「风绘笔记」是一块缓慢生长的私人领地：这里有前端技术、视觉研究，也有散步时遇见的云和便利店的灯光。站点以"风"为线索，用动画天空般的配色、硬边阴影与漂浮的云，把每一次访问变成一段短短的散步。

## ✦ 站点地图

| 页面 | 路径 | 说明 |
| :-- | :-- | :-- |
| 首页 | `/` | 风的入口：精选文章、分类筛选与漂浮的云 |
| 文章 | `/posts` | 长文归档，分为「代码魔法」「视觉研究」「异想日常」 |
| 片刻 | `/moments` | 还没有长成文章、却舍不得忘记的碎片（早晨 / 黄昏 / 深夜） |
| 友人帐 | `/friends` | 收藏认真生活、写作与创造的独立小站 |
| 关于 | `/about` | 关于风绘、关于这块领地的创作理念 |

## ✦ 技术栈

- **Astro 7** — 岛屿架构，页面默认零 JS，内容集合（Content Collections）驱动全站数据
- **Svelte 5** — 首页与内页的交互岛屿（分类筛选、主题切换、移动导航）
- **Tailwind CSS 4** — 全站样式，自定义主题色板与动画
- **TypeScript** — 内容 schema 由 Zod 校验，写错 frontmatter 会在构建时报错

## ✦ 项目结构

```text
/
├── public/
│   └── images/              # 文章封面与角色立绘（webp 优先）
├── src/
│   ├── components/
│   │   ├── HomePage.svelte  # 首页岛屿
│   │   └── InnerPage.svelte # 内页岛屿（posts / moments / friends / about）
│   ├── content/
│   │   ├── posts/           # 文章（Markdown）
│   │   ├── moments/         # 片刻（Markdown）
│   │   └── friends/         # 友人帐（Markdown）
│   ├── layouts/
│   │   ├── Layout.astro     # 全局 HTML 骨架（含暗色主题脚本）
│   │   └── PostLayout.astro # 文章详情页排版
│   ├── pages/               # 文件即路由
│   ├── styles/global.css    # 主题色板、动画与工具类
│   └── content.config.ts    # 内容集合 schema（Zod）
└── package.json
```

图片源文件（原始 PNG、MP4）保留在本地 `design/` 目录，不参与构建；`public/` 只保留站点实际加载的 WebP 与图标，首页与内页的文章、片刻卡片都直接读取内容集合。

## ✦ 开始运行

所有命令在项目根目录执行：

| 命令 | 作用 |
| :-- | :-- |
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 启动开发服务器（`localhost:4321`） |
| `pnpm build` | 构建生产站点到 `./dist/` |
| `pnpm preview` | 本地预览构建产物 |
| `pnpm check` | 运行 Astro 类型检查（内容 schema + 组件类型） |
| `pnpm astro ...` | 运行 Astro CLI，如 `astro add`、`astro sync` |

## ✦ 写作指南

内容全部是 Markdown，frontmatter 由 [content.config.ts](src/content.config.ts) 中的 Zod schema 校验。每个集合目录下都有 `_template.md.example` 可以直接复制。

**文章** `src/content/posts/*.md`

```yaml
---
title: "在城市入秋之前，去收集一场晚风"
description: "河岸、汽水和一段没有目的地的散步记录。"
publishedAt: 2026-08-28
category: "异想日常"      # 代码魔法 | 视觉研究 | 异想日常
tags: [散步, 城市]
readingTime: "4 min"
coverTone: "mint"         # sky | sunset | mint
coverMark: "風"           # 封面角标，最多 2 个字符
coverImage: "/images/post-evening-wind.webp"
featured: false
draft: false              # true 时不会出现在站点上
---
```

**片刻** `src/content/moments/*.md`

```yaml
---
publishedAt: 2026-09-16T20:30:00+08:00
period: "黄昏"            # 早晨 | 黄昏 | 深夜
tag: "随手记"
icon: "✦"
tone: "sunset"            # sky | night | sunset | mint | sakura | yuzu
draft: false
---
```

**友人帐** `src/content/friends/*.md`

```yaml
---
name: "等待星光的站台"
url: "https://example.com"
category: "创作"
mark: "星"
tone: "lilac"             # sky | mint | sunset | lilac
status: "active"          # active | open
order: 0
draft: false
---
```

## ✦ 调色盘

主题色定义在 [global.css](src/styles/global.css) 的 `@theme` 中：

| 名字 | 色值 | 用途 |
| :-- | :-- | :-- |
| `night` | `#11152b` | 深夜模式的底色 |
| `sky-ink` | `#233763` | 白昼的文字与描边 |
| `mizu` | `#48c7e8` | 水色：强调、链接与风 |
| `sakura` | `#ff7fa8` | 樱色：片刻与心动 |
| `yuzu` | `#ffd66e` | 柚子黄：灯光与点缀 |
| `cloud` | `#f7fbff` | 云白 |
| `lilac` | `#9387eb` | 丁香紫：友人帐与夜色过渡 |

配合 `anime-shadow` 硬边阴影、漂浮云带动画，以及跟随系统的明暗切换（`huidev-theme`）。

## ✦ 尾声

> 傍晚像一段很短的转场。我喜欢在这个时间散步，因为城市像是暂时忘记了自己必须高效运转。

愿这里的每一篇文字、每一段片刻，都像一阵刚好路过的风。

<div align="center">

**風 · HuiDev Notes** — 把风写进次元

</div>
