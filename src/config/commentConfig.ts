import type { CommentConfig } from '../types/commentConfig';
import { siteConfig } from './siteConfig';

/**
 * 评论系统配置。
 *
 * 关闭或缺少 envId 时不渲染生产环境 DOM，也不发起任何外部请求。
 */
export const commentConfig = {
	enable: true,
	provider: 'twikoo',
	lazyLoad: true,
	lazyLoadMargin: '320px',
	showDevSetupHint: true,
	heading: '把回声留在风里。',
	label: 'LEAVE A MESSAGE',
	twikoo: {
		envId: import.meta.env.PUBLIC_TWIKOO_ENV_ID?.trim()
			|| 'https://twikoo.huidev.com/',
		region: import.meta.env.PUBLIC_TWIKOO_REGION?.trim() ?? '',
		scriptUrl: import.meta.env.PUBLIC_TWIKOO_CDN_URL?.trim()
			|| 'https://cdn.jsdelivr.net/npm/twikoo@1.7.22/dist/twikoo.min.js',
		language: siteConfig.language,
	},
} as const satisfies CommentConfig;
