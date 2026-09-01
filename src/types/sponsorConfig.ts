/**
 * 赞助页配置类型定义。
 * 遵循 Shirone 配置契约：配置放在 src/config/sponsorConfig.ts，
 * 数据放在 src/data/sponsor.ts，类型放在本文件；
 * 页面总开关关闭时 /sponsor/ 重定向 404 且导航隐藏。
 */

/** 单个赞助方式（打赏渠道） */
export interface SponsorMethod {
	/** 稳定标识（对应 config.disabledKeys / 测试选择器）。 */
	key: string;
	/** 渠道展示名（如 微信赞赏 / 爱发电）。 */
	name: string;
	/** Iconify 图标名（渠道品牌或通用图标）。 */
	icon?: string;
	/** 可选渠道说明（如「扫码时请备注昵称」）。 */
	description?: string;
	/** 收款码 / 二维码图片路径（站内绝对路径）。 */
	qrCode?: string;
	/** 外部赞助链接（与 qrCode 可并存；渲染「前往赞助」按钮）。 */
	link?: string;
	/** 可选独立开关；关闭后不参与渲染（优先使用 config.disabledKeys）。 */
	enable?: boolean;
}

/** 单条赞助记录（感谢名单条目） */
export interface SponsorRecord {
	/** 赞助者昵称。 */
	name: string;
	/** 头像图片路径；缺省时回退首字母头像。 */
	avatar?: string;
	/** 赞助金额展示文案（自由格式，如「¥ 20」）。 */
	amount?: string;
	/** 赞助日期（YYYY-MM-DD，原样渲染进 time[datetime]）。 */
	date?: string;
	/** 可选留言（赞助者附言或站长致谢）。 */
	message?: string;
	/** 可选赞助者主页链接。 */
	link?: string;
}

/** 赞助页全局配置（行为层） */
export interface SponsorConfig {
	/** 页面总开关；关闭后隐藏导航入口并将 /sponsor/ 重定向到 404。 */
	enable: boolean;
	/** 是否展示赞助名单区块；默认 true。 */
	showList?: boolean;
	/** 可选的用法/致谢提示，展示在页头下方的信息框中。 */
	usage?: string;
	/** 可选被禁用的赞助方式 key 列表。 */
	disabledKeys?: string[];
}
