/**
 * 项目页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/projectsConfig.ts 控制。
 */
import type { ProjectItem } from "@/types/projectsConfig";

export const projectsData: ProjectItem[] = [
	{
		key: "huidev-pan",
		title: "风绘云盘",
		summary:
			"风绘云盘提供安全可靠的云存储、多端同步、文件备份与分享服务，支持在线预览和便捷协作，帮助个人与团队轻松管理文档、照片、视频等重要资料，随时随地安全存取。",
		category: "cloud",
		phase: "shipped",
		technologies: ["Cloudrave"],
		icon: "material-symbols:cloud",
		website: "https://pan.huidev.com/",
	},
	{
		key: "huidev-api",
		title: "风绘 API",
		summary:
			"风绘 API 是基于 New API 打造的统一 AI 网关：把多家上游渠道聚合成一个标准接口，为每个应用发放独立令牌，实时掌握用量、额度与分组权限。改一行 base_url，即可无缝切换模型。",
		category: "ai",
		phase: "shipped",
		technologies: ["New API"],
		icon: "thesvg:new-api",
		website: "https://api.huidev.com",
	},
];

/** 获取所有项目数据列表 */
export function getProjectsList(): ProjectItem[] {
	return projectsData;
}
