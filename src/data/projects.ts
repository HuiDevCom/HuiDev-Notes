/**
 * 项目页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/projectsConfig.ts 控制。
 */
import type { ProjectItem } from "@/types/projectsConfig";

export const projectsData: ProjectItem[] = [
	{
		key: "huidev-api",
		title: "风绘 API",
		summary:
			"聚合主流大模型到同一个 OpenAI 兼容端点：一次接入、按量计费，切换模型只需改一行 model 参数——剩下的，交给风绘酱。",
		category: "backend",
		phase: "shipped",
		technologies: ["API"],
		icon: "material-symbols:api-rounded",
		cover: "/assets/projects/huidev-api.png",
		coverAlt: "风绘 API 控制台预览",
		featured: true,
		repository: "https://github.com/HuiDevCom/HuiDev-API",
		website: "https://api.huidev.com/",
		year: "2026",
	},
];

/** 获取所有项目数据列表 */
export function getProjectsList(): ProjectItem[] {
	return projectsData;
}
