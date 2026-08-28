/**
 * 友情链接数据配置（结构与 Mizuki 同款，便于互相迁移）。
 * 用于管理友情链接页面的数据：src/pages/friends.astro → organisms/FriendSection。
 *
 * 添加友链：在 friendsData 中追加一项即可，页面 / 筛选标签自动生成。
 * tags 会聚合为页面顶部的筛选 chip（OR 命中：选中多个标签时命中任一即显示）。
 */
export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 1,
		title: "风绘笔记",
		imgurl: "https://huidev.com/avatar.png",
		desc: "用代码构建，用文字记录",
		siteurl: "https://huidev.com",
		tags: ["Blog"],
	},
	{
		id: 2,
		title: "NorthZero的博客",
		imgurl: "https://nzdnzd.top/favicon.svg",
		desc: "o_O",
		siteurl: "https://nzdnzd.top",
		tags: ["Blog"],
	},
	{
		id: 3,
		title: "Nappig",
		imgurl: "https://q1.qlogo.cn/g?b=qq&nk=1503366755&s=640",
		desc: "暂无描述",
		siteurl: "https://www.nappig.com",
		tags: ["Blog"],
	},
	{
		id: 4,
		title: "午夜的Blog",
		imgurl: "https://q.qlogo.cn/headimg_dl?dst_uin=1343394737&spec=640&img_type=jpg",
		desc: "用代码表达言语的魅力，用代码书写山河的壮丽。",
		siteurl: "https://www.wuye2004.top",
		tags: ["Blog"],
	},
	{
		id: 5,
		title: "二叉树树",
		imgurl: "https://q2.qlogo.cn/headimg_dl?dst_uin=2726730791&spec=0",
		desc: "Protect What You Love.",
		siteurl: "https://2x.nz/",
		tags: ["Blog"],
	},
];

// 获取所有友情链接数据（稳定顺序，测试可复现）
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据（避免固定排序，按需使用）
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
