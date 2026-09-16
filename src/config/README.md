# 配置目录约定

`src/config` 是主题行为与站点身份的唯一配置入口。页面和组件应从 `@/config` 消费配置，不直接读取环境变量或重复维护品牌常量。

## 分层原则

- `src/config/*Config.ts`：站点身份、功能开关、显示行为、排序规则和外部服务配置。
- `src/types/*Config.ts`：每个配置领域的 TypeScript 契约。
- `src/content/**`：文章、片刻、友链等由作者维护的内容实体。
- `.env`：部署环境提供的公开服务标识和地址，不提交到仓库。

## 当前配置

| 文件 | 职责 |
| --- | --- |
| `siteConfig.ts` | 域名、base、品牌、语言时区、SEO、主题、favicon 与页脚 |
| `profileConfig.ts` | 作者资料、关于页简介、兴趣与社交链接 |
| `navBarConfig.ts` | 导航开关、顺序与链接 |
| `articleConfig.ts` | 目录、相邻文章、日期和封面行为 |
| `commentConfig.ts` | Twikoo 开关、懒加载与服务配置 |
| `umamiConfig.ts` | Umami 开关、脚本、公开统计地址与隐私选项 |

## 新增配置领域

1. 在 `src/types/<domain>Config.ts` 定义类型。
2. 在 `src/config/<domain>Config.ts` 写带注释的默认值，并用 `satisfies` 校验。
3. 在 `src/config/index.ts` 注册导出。
4. 可选功能默认应支持完全短路：关闭时不输出 DOM、不请求外部资源。
5. 内容条目不要写进配置文件，应进入内容集合或 `src/data`。
