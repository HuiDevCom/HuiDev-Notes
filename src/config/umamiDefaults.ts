/**
 * Umami 的默认公开配置。
 *
 * 单独放在无浏览器依赖的文件中，供 Astro 集成与主题配置共同读取。
 */
export const umamiDefaults = {
	websiteId: '6c5ecfdf-dee0-4867-8f62-851be88239e4',
	scriptUrl: 'https://umami.huidev.com/script.js',
	shareUrl: 'https://umami.huidev.com/share/uMHtGWTow6pWGeo3',
} as const;
