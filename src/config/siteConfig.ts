import type { FaviconConfig, SiteConfig } from '../types/siteConfig';

/**
 * 站点核心配置。
 *
 * 部署地址、品牌标识、语言时区、SEO、主题与页脚统一从这里读取。
 */
export const siteConfig = {
	// 可由环境变量覆盖；默认使用风绘笔记正式域名。
	site: import.meta.env.PUBLIC_SITE_URL?.trim() || 'https://huidev.com/',
	// 部署到域名根目录时保持为 /；部署到子目录时填写 /repo-name/。
	base: '/' as string,
	name: '风绘笔记',
	shortName: '風',
	englishName: 'HuiDev Notes',
	logo: '/logo.png',
	logoAlt: '风绘笔记图标',
	title: '风绘笔记｜把风写进次元',
	description: '用代码构建，用文字记录',
	language: 'zh-CN',
	locale: 'zh_CN',
	timeZone: 'Asia/Shanghai',
	// 标签页图标使用品牌矢量图（风 + 星）；favicon.ico 与 apple-touch-icon.png
	// 均由 public/favicon.svg 导出，替换图标时请一并更新这三份文件。
	favicons: [
		{ src: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
		{ src: '/favicon.ico', type: 'image/x-icon', sizes: '16x16 32x32 48x48' },
		{ src: '/apple-touch-icon.png', rel: 'apple-touch-icon', type: 'image/png', sizes: '180x180' },
	] as FaviconConfig[],
	theme: {
		color: '#eef8ff',
		defaultMode: 'system',
		storageKey: 'huidev-theme',
	},
	seo: {
		titleSeparator: '｜',
		openGraphType: 'website',
		twitterCard: 'summary_large_image',
	},
	footer: {
		tagline: '愿每一次记录，都听见风的方向。',
		copyright: `© ${new Date().getFullYear()} · KEEP THE WIND IN WORDS`,
	},
} as const satisfies SiteConfig;

/** 为内页生成统一格式的浏览器标题。 */
export const createPageTitle = (pageTitle: string) =>
	`${pageTitle}${siteConfig.seo.titleSeparator}${siteConfig.name}`;

/** 将站内路径转换为兼容 base 的链接。 */
export const createSitePath = (path: string) => {
	if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('#')) return path;
	const base = siteConfig.base === '/' ? '' : `/${siteConfig.base.replace(/^\/+|\/+$/g, '')}`;
	const pathname = path === '/' ? '/' : `/${path.replace(/^\/+/, '')}`;
	return `${base}${pathname}`;
};
