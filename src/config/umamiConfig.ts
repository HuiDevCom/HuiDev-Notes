import type { UmamiConfig } from '../types/umamiConfig';
import { umamiDefaults } from './umamiDefaults';

/**
 * Umami 统计配置。
 *
 * 关闭或缺少 websiteId 时不会向页面注入统计脚本。
 */
export const umamiConfig = {
	enable: true,
	websiteId: import.meta.env.PUBLIC_UMAMI_WEBSITE_ID?.trim()
		|| umamiDefaults.websiteId,
	scriptUrl: import.meta.env.PUBLIC_UMAMI_SCRIPT_URL?.trim()
		|| umamiDefaults.scriptUrl,
	hostUrl: import.meta.env.PUBLIC_UMAMI_HOST_URL?.trim() ?? '',
	domains: import.meta.env.PUBLIC_UMAMI_DOMAINS?.trim() ?? '',
	publicShare: {
		enable: true,
		url: import.meta.env.PUBLIC_UMAMI_SHARE_URL?.trim()
			|| umamiDefaults.shareUrl,
		label: '站点统计',
	},
	stats: {
		enable: true,
		showOnHome: true,
		showOnPosts: true,
		compactNumbers: true,
		labels: {
			pageviews: '页面浏览',
			visits: '访问次数',
		},
	},
	options: {
		respectDoNotTrack: true,
		excludeSearch: true,
		excludeHash: true,
	},
} as const satisfies UmamiConfig;
