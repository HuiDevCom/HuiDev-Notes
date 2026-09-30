/**
 * 时间线页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/timelineConfig.ts 控制。
 */
import type { TimelineItem } from "@/types/timelineConfig";

export const timelineData: TimelineItem[] = [
	{
		title: "风绘笔记正式运行",
		date: "2026.06.15",
		category: "milestone",
		subtitle: "网站上线 · ICP 备案通过",
		description:
			"2026 年 6 月 15 日，风绘笔记开始运行，ICP备案也在同一天通过。从这里开始，记录开发实践，整理经验与教程。",
		tags: ["风绘笔记", "网站上线", "ICP备案"],
		links: [
			{
				label: "访问风绘笔记",
				url: "https://huidev.com",
				icon: "material-symbols:open-in-new-rounded",
			},
		],
		icon: "material-symbols:flag-rounded",
	},
	{
		title: "重构风绘笔记",
		date: "2026.09.29",
		category: "project",
		subtitle: "站点内容与体验整理",
		description:
			"重新梳理站点身份、主题视觉和内容组织，更新头像、横幅、导航、友链与关于页面；把模板动态替换为自己的记录，也为后续的经验总结与教程做好准备。",
		tags: ["站点重构", "内容整理"],
		icon: "material-symbols:construction-rounded",
	},
];

/** 获取所有时间线数据列表 */
export function getTimelineList(): TimelineItem[] {
	return timelineData;
}
