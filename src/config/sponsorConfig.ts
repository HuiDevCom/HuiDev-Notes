import type { SponsorConfig } from "@/types/sponsorConfig";
import { withUserConfig } from "../utils/config-overlay.ts";

/**
 * 赞助页行为与展示配置。
 *
 * 遵循「配置管行为，数据管内容」原则：
 * - enable：页面总开关；false 时导航入口同步隐藏，访问 /sponsor/ 跳转 404；
 * - showList：是否展示「赞助名单」区块；
 * - disabledKeys：可选被禁用的赞助方式 key 列表；
 *
 * 注：赞助方式（收款码 / 外链）与赞助者名单等具体内容请在 `src/data/sponsor.ts` 中维护。
 */
export const sponsorConfig: SponsorConfig = withUserConfig("sponsor", {
	enable: true,
	showList: true,
	// usage: "赞助时请在留言中备注昵称，以便加入致谢名单。",
	// disabledKeys: [],
});
