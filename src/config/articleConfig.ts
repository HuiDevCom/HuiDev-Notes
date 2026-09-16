import type { ArticleConfig } from '../types/articleConfig';
import { siteConfig } from './siteConfig';

/** 文章详情页行为配置。 */
export const articleConfig = {
	toc: {
		enable: true,
		depth: 2,
	},
	previousNext: {
		enable: true,
	},
	cover: {
		label: 'HUIDEV STORY',
	},
	date: {
		locale: siteConfig.language,
		timeZone: siteConfig.timeZone,
	},
} as const satisfies ArticleConfig;
