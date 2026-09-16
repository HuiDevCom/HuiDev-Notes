import type { ProfileConfig } from '../types/profileConfig';

/** 博主资料与关于页内容。 */
export const profileConfig = {
	name: '风绘',
	romanizedName: 'KAZAMI',
	role: 'THE NOTE KEEPER',
	avatar: '/avatar.webp',
	avatarAlt: '微笑眨眼的粉发少女头像',
	banner: '/banner.webp',
	bannerAlt: '夏日湖边野餐的动漫少女',
	aboutImage: '/images/huidev-hero.webp',
	aboutImageAlt: '在云端花园里迎风翻开笔记的动漫少女',
	signature: '欲买桂花同载酒，终不似，少年游',
	headline: '我是风绘，一个在代码和幻想之间生活的人。',
	bio: [
		'白天构建网页和数字产品，夜晚记录那些不适合放进待办清单的念头。',
		'“风绘笔记”是一块缓慢生长的私人领地：这里有前端技术、视觉设计，也有散步时遇见的云和便利店灯光。',
	],
	interests: [
		{ icon: '⌘', title: '构建', description: 'Astro · Svelte\nWeb Experience' },
		{ icon: '✦', title: '观察', description: 'Visual Design\nAnime Culture' },
		{ icon: '☁', title: '记录', description: 'Daily Notes\nSmall Wonders' },
	],
	socialLinks: [],
} as const satisfies ProfileConfig;
