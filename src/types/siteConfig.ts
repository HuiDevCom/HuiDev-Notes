export type ColorScheme = 'light' | 'dark' | 'system';

export interface FaviconConfig {
	src: string;
	type?: string;
	sizes?: string;
}

export interface SiteConfig {
	/** 部署域名，用于 canonical、Open Graph 与订阅地址。 */
	site: string;
	/** 子路径部署前缀，根域部署时保持为 /。 */
	base: string;
	name: string;
	shortName: string;
	englishName: string;
	logo: string;
	logoAlt: string;
	title: string;
	description: string;
	language: string;
	locale: string;
	timeZone: string;
	favicons: readonly FaviconConfig[];
	theme: {
		color: string;
		defaultMode: ColorScheme;
		storageKey: string;
	};
	seo: {
		titleSeparator: string;
		openGraphType: 'website' | 'article';
		twitterCard: 'summary' | 'summary_large_image';
	};
	footer: {
		tagline: string;
		copyright: string;
	};
}
