import type { GuestbookConfig } from "@/types/guestbookConfig";
import { withUserConfig } from "../utils/config-overlay.ts";

/**
 * 留言页行为配置。
 *
 * 遵循「配置管行为，数据管内容」原则：
 * - enable：页面总开关；false 时导航入口同步隐藏，访问 /guestbook/ 跳转 404；
 * - 留言数据由评论系统托管（commentConfig），评论未启用时页面展示占位提示；
 * - 引导语内容在 `src/data/guestbook.ts` 中维护。
 */
export const guestbookConfig: GuestbookConfig = withUserConfig("guestbook", {
	enable: true,
});
