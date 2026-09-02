import type {
	PassportConfig,
	ResolvedPassportOptions,
} from "@/types/passportConfig";
import { withUserConfig } from "../utils/config-overlay.ts";

/**
 * 风绘通行证配置单一真源（Logto SPA 认证）。
 *
 * 遵循「零额外负担」原则：默认关闭（enable: false）。关闭或未配置端点/App ID 时，
 * 通行证页面短路为零 DOM，导航入口隐藏，@logto/browser 不进任何 bundle，
 * 也不产生任何外部网络请求。
 *
 * 使用前需在 Logto 控制台创建「单页应用（SPA）」类型的 Application：
 * - 记下 Endpoint 与 App ID 填入本配置；
 * - Redirect URI 添加 `https://<站点域名>/passport/callback/`；
 * - Post sign-out redirect URI 按需添加站点地址。
 */
export const passportConfig: PassportConfig = withUserConfig("passport", {
	/** 总开关：false 时完全不渲染通行证页面与导航入口 */
	enable: true,
	/** Logto 端点（在 Logto 控制台应用详情页查看），必填 */
	endpoint: "https://auth.huidev.com",
	/** Logto 单页应用 App ID，必填 */
	appId: "aeeasdw2uru0esslwp4an",
	/** OIDC scopes：身份 + 资料即可满足登录与个人资料页展示 */
	scopes: ["openid", "profile", "email", "offline_access"],
	/** 登出后跳转路径；留空则回到通行证页 */
	postSignOutUrl: "",
	/** 登录回调路径（需与 Logto 控制台 Redirect URI 一致） */
	callbackPath: "/passport/callback/",
	/** 账户入口：默认进入主题内置个人资料页，可设外部地址或关闭 */
	accountCenter: true,
	/**
	 * 资料页可编辑字段：须与 Logto 控制台 Account API 字段权限一致
	 * （权限为「关闭」或「只读」的字段设为 false，前端将隐藏并不提交该字段）。
	 */
	profileFields: {
		/** Logto「资料数据 → 姓名」当前为关闭 */
		name: false,
		/** Logto「身份标识 → 用户名」当前为只读 */
		username: false,
		avatar: true,
		nickname: true,
		website: true,
	},
});

/**
 * 解析并校验通行证配置。未启用或端点/App ID 缺失时返回 null。
 */
export function resolvePassportOptions(
	config: PassportConfig,
): ResolvedPassportOptions {
	if (!config.enable) {
		return null;
	}
	const endpoint = config.endpoint?.trim();
	const appId = config.appId?.trim();
	if (!endpoint || !appId) {
		return null;
	}
	const externalHref =
		typeof config.accountCenter === "string" ? config.accountCenter.trim() : "";
	const profileFields = config.profileFields ?? {};
	return {
		endpoint,
		appId,
		scopes:
			config.scopes && config.scopes.length > 0
				? config.scopes
				: ["openid", "profile", "email"],
		postSignOutUrl: config.postSignOutUrl?.trim() || "",
		callbackPath: config.callbackPath?.trim() || "/passport/callback/",
		accountEntry:
			config.accountCenter === false
				? "hidden"
				: externalHref
					? "external"
					: "internal",
		accountHref: externalHref || null,
		profileFields: {
			name: profileFields.name ?? true,
			username: profileFields.username ?? true,
			avatar: profileFields.avatar ?? true,
			nickname: profileFields.nickname ?? true,
			website: profileFields.website ?? true,
		},
	};
}

export type { ResolvedPassportOptions };
