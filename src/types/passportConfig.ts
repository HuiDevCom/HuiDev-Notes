/**
 * 风绘通行证（Logto 认证）配置类型。
 *
 * 接入模式为纯前端 SPA：使用 Logto 浏览器 SDK（@logto/browser）在客户端完成
 * OIDC 授权码 + PKCE 流程，令牌仅存浏览器，站点保持纯静态构建。
 */
/**
 * 资料页可编辑字段开关：须与 Logto 控制台 Account API 的字段权限保持一致
 * （权限为「关闭」或「只读」的字段应设为 false，避免提交即 400）。
 */
export type PassportProfileFields = {
	/** 姓名（Logto `name`，OIDC 显示名 claim） */
	name?: boolean;
	/** 用户名（Logto `username`） */
	username?: boolean;
	/** 头像链接（Logto `avatar`） */
	avatar?: boolean;
	/** 昵称（Logto `profile.nickname`） */
	nickname?: boolean;
	/** 个人网站链接（Logto `profile.website`，Logto Account API 文档中的标准 profile 属性） */
	website?: boolean;
};

export type PassportConfig = {
	/** 风绘通行证总开关：false 时页面短路、零 DOM、零请求、SDK 不进主 bundle */
	enable: boolean;
	/** Logto 部署端点（如 https://auth.example.com），必填 */
	endpoint: string;
	/** Logto 控制台创建的「单页应用」App ID，必填 */
	appId: string;
	/**
	 * OIDC scopes。默认获取基本身份与资料；
	 * `offline_access` 用于取得刷新令牌（Logto 建议显式声明）。
	 */
	scopes?: string[];
	/** 登出后跳转地址（相对站点根路径）；留空则留在通行证页 */
	postSignOutUrl?: string;
	/** Logto 登录完成后回到通行证页前的落地回调路径（相对站点根路径） */
	callbackPath?: string;
	/**
	 * 「个人信息与安全」入口：
	 * - `true`（默认）：进入主题内置个人资料页 `/passport/profile/`
	 *   （基于 Logto Account API 的站内资料管理）；
	 * - 字符串：跳转自定义外部地址（如 Logto 托管账户中心）；
	 * - `false`：隐藏该入口。
	 */
	accountCenter?: boolean | string;
	/** 资料页可编辑字段开关（默认全部可编辑） */
	profileFields?: PassportProfileFields;
};

/**
 * 解析后的通行证配置选项：未启用或关键参数缺失时为 null。
 */
export type ResolvedPassportOptions = {
	endpoint: string;
	appId: string;
	scopes: string[];
	postSignOutUrl: string;
	callbackPath: string;
	/** 账户入口形态：internal = 站内资料页；external = 外部地址；hidden = 不展示 */
	accountEntry: "internal" | "external" | "hidden";
	/** 外部地址（仅 accountEntry === "external" 时非空） */
	accountHref: string | null;
	/** 资料页可编辑字段（已合并默认值：未配置的字段视为可编辑） */
	profileFields: Required<PassportProfileFields>;
} | null;
