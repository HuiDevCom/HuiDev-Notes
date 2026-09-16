import type { NavBarConfig, NavBarItem } from '../types/navBarConfig';
import { createSitePath } from './siteConfig';

/** 主导航配置；顺序即桌面端与移动端的显示顺序。 */
export const navBarConfig = {
	enable: true,
	ariaLabel: '主导航',
	items: [
		{ key: 'home', label: '首页', href: createSitePath('/'), enable: true },
		{ key: 'posts', label: '文章', href: createSitePath('/posts'), enable: true },
		{ key: 'moments', label: '片刻', href: createSitePath('/moments'), enable: true },
		{ key: 'friends', label: '友人帐', href: createSitePath('/friends'), enable: true },
		{ key: 'about', label: '关于', href: createSitePath('/about'), enable: true },
		{ key: 'search', label: '搜索', href: createSitePath('/search'), enable: true },
	],
} as const satisfies NavBarConfig;

export const enabledNavItems: readonly NavBarItem[] = navBarConfig.items.filter((item) => item.enable);
