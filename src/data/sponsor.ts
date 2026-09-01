/**
 * 赞助页内容数据（配置管行为，数据管内容）。
 * 用于赞助页面的具体内容：src/pages/sponsor.astro → organisms/SponsorSection。
 *
 * 添加赞助方式：在 sponsorMethodsData 中追加一项（收款码图片放 public/ 下，填站内绝对路径）；
 * 添加赞助者：在 sponsorRecordsData 中按日期倒序追加一条即可。
 */

import type { SponsorMethod, SponsorRecord } from "../types/sponsorConfig";

// 赞助方式数据（收款码图片放 public/images/sponsor/ 下，填站内绝对路径）
export const sponsorMethodsData: SponsorMethod[] = [
	{
		key: "wechat",
		name: "微信",
		icon: "fa6-brands:weixin",
		qrCode: "/images/sponsor/wechat.png",
	},
	{
		key: "alipay",
		name: "支付宝",
		icon: "fa6-brands:alipay",
		qrCode: "/images/sponsor/alipay.png",
	},
	{
		key: "afdian",
		name: "爱发电",
		icon: "simple-icons:afdian",
		description: "支持每月发电，解锁创作者动态",
		link: "https://afdian.com/a/HuiDevCom",
	},
];

// 赞助者名单数据（建议按日期倒序维护）
export const sponsorRecordsData: SponsorRecord[] = [
	{
		name: "风绘",
		amount: "¥ 50",
		date: "2026-09-01",
		avatar: "https://huidev.com/avatar.png",
	},
	{
		name: "匿名用户",
		amount: "¥ 20",
		date: "2026-09-01",
	},
];

// 获取所有赞助者记录（稳定顺序，测试可复现）
export function getSponsorRecords(): SponsorRecord[] {
	return sponsorRecordsData;
}
