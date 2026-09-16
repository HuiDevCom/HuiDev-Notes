export type PageKey = 'home' | 'posts' | 'moments' | 'friends' | 'about' | 'search';

export interface NavBarItem {
	key: PageKey;
	label: string;
	href: string;
	enable: boolean;
	external?: boolean;
}

export interface NavBarConfig {
	enable: boolean;
	ariaLabel: string;
	items: readonly NavBarItem[];
}
