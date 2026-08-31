/**
 * 风绘通行证客户端封装：按需动态导入 @logto/browser（SPA + PKCE）。
 *
 * 模块本身不包含 Logto SDK 代码——仅当通行证页面岛组件加载时才会拉起
 * `import("@logto/browser")`，保证关闭态与其它页面零 SDK 字节。
 * 令牌由 SDK 持久化在浏览器存储中，站点保持纯静态、无服务端会话。
 */
import { url } from "@utils/url-utils";
import type { ResolvedPassportOptions } from "@/types/passportConfig";

type LogtoClient = import("@logto/browser").default;

export type PassportIdentity = {
	/** 用户名（Logto username，可能为空） */
	username?: string;
	/** 主邮箱（scope 含 email 时可用） */
	email?: string;
	/** 头像 URL */
	picture?: string;
	/** 显示名（name claim，可能为空） */
	name?: string;
};

export type PassportState = {
	authenticated: boolean;
	identity: PassportIdentity | null;
};

let clientPromise: Promise<LogtoClient> | null = null;

function toAbsoluteUrl(path: string): string {
	return new URL(url(path), window.location.origin).toString();
}

function callbackUri(options: NonNullable<ResolvedPassportOptions>): string {
	return toAbsoluteUrl(options.callbackPath);
}

function getLogtoClient(options: NonNullable<ResolvedPassportOptions>) {
	clientPromise ??= import("@logto/browser").then(
		(LogtoClient) =>
			new LogtoClient.default({
				endpoint: options.endpoint,
				appId: options.appId,
				scopes: options.scopes,
			}),
	);
	return clientPromise;
}

/** 路径相等判断（忽略末尾斜杠差异，避免精确匹配误判回调失败） */
function samePath(a: string, b: string): boolean {
	const normalize = (p: string) =>
		p !== "/" && p.endsWith("/") ? p.slice(0, -1) : p;
	return normalize(a) === normalize(b);
}

/** 当前 URL 是否为一次 OIDC 登录回调（带授权码/错误响应参数）。 */
export function isPassportCallbackPath(
	options: NonNullable<ResolvedPassportOptions>,
	href: string,
): boolean {
	const callback = new URL(callbackUri(options));
	const current = new URL(href);
	return (
		samePath(callback.pathname, current.pathname) &&
		(current.searchParams.has("code") || current.searchParams.has("error"))
	);
}

/** 读取当前登录态与可展示的用户身份信息。 */
export async function getPassportState(
	options: NonNullable<ResolvedPassportOptions>,
): Promise<PassportState> {
	const client = await getLogtoClient(options);
	if (!(await client.isAuthenticated())) {
		return { authenticated: false, identity: null };
	}
	const identity: PassportIdentity = {};
	try {
		const claims = await client.getIdTokenClaims();
		identity.name = claims.name ?? undefined;
		identity.username = claims.username ?? undefined;
		identity.picture = claims.picture ?? undefined;
		identity.email = claims.email ?? undefined;
	} catch {
		// id token 不可用时仍视为已登录，仅展示空资料
	}
	return { authenticated: true, identity };
}

/** 跳转 Logto 托管登录页（Logto 登录页内含注册入口，无需单独注册流程）。 */
export async function signInWithPassport(
	options: NonNullable<ResolvedPassportOptions>,
): Promise<void> {
	const client = await getLogtoClient(options);
	await client.signIn(callbackUri(options));
}

export type PassportCallbackResult = {
	success: boolean;
	/** 失败原因（OIDC 错误响应或 SDK 异常信息），用于页面展示与排查 */
	reason?: string;
};

/** 完成 OIDC 回调处理；失败时返回原因（调用方负责跳转回通行证页）。 */
export async function handlePassportSignInCallback(
	options: NonNullable<ResolvedPassportOptions>,
	currentHref: string,
): Promise<PassportCallbackResult> {
	if (!isPassportCallbackPath(options, currentHref)) {
		return { success: false };
	}
	const current = new URL(currentHref);
	// OIDC 错误响应（如 redirect_uri 未注册）：直接透传给页面展示
	const oauthError = current.searchParams.get("error");
	if (oauthError) {
		return {
			success: false,
			reason: current.searchParams.get("error_description") || oauthError,
		};
	}
	const client = await getLogtoClient(options);
	try {
		await client.handleSignInCallback(currentHref);
		return { success: true };
	} catch (error) {
		return {
			success: false,
			reason: error instanceof Error ? error.message : String(error),
		};
	}
}

/** 登出并跳回站点。 */
export async function signOutFromPassport(
	options: NonNullable<ResolvedPassportOptions>,
): Promise<void> {
	const client = await getLogtoClient(options);
	await client.signOut(toAbsoluteUrl(options.postSignOutUrl || "/passport/"));
}

/* ————————————————— Account API（主题内个人资料管理） —————————————————
 * 端点与流程见 Logto Account API 文档：
 * - 授权：client.getAccessToken() 取 opaque token，附 Bearer 头；
 * - GET  /api/my-account          读取资料；
 * - PATCH /api/my-account         更新 name/username/avatar（无需安全验证）；
 * - PATCH /api/my-account/profile 更新 nickname/website 等扩展属性。
 * 前置条件：Logto 控制台「登录与账户 > 账户中心」开启 Account API 并配置字段权限。
 */

export type PassportProfile = {
	id: string;
	username: string | null;
	/** 显示名（OIDC name claim） */
	name: string | null;
	/** 昵称（profile.nickname，Logto 账户中心同名字段） */
	nickname: string | null;
	/** 个人网站链接（profile.website，Logto 标准 profile 属性） */
	website: string | null;
	avatar: string | null;
	primaryEmail: string | null;
};

export type PassportProfilePatch = {
	name?: string | null;
	username?: string | null;
	nickname?: string | null;
	website?: string | null;
	avatar?: string | null;
};

/** 统一 Account API 请求：自动附带 opaque token，失败时抛出带状态码的错误。 */
async function accountApiRequest(
	options: NonNullable<ResolvedPassportOptions>,
	path: string,
	init?: {
		method?: string;
		body?: unknown;
	},
): Promise<unknown> {
	const client = await getLogtoClient(options);
	const token = await client.getAccessToken();
	const endpoint = options.endpoint.replace(/\/+$/, "");
	const headers: Record<string, string> = {
		"content-type": "application/json",
		authorization: `Bearer ${token}`,
	};
	const response = await fetch(`${endpoint}${path}`, {
		method: init?.method ?? "GET",
		headers,
		body: init?.body === undefined ? undefined : JSON.stringify(init.body),
	});
	if (!response.ok) {
		let detail = "";
		try {
			const data = (await response.json()) as { message?: string };
			detail = data?.message ?? "";
		} catch {
			// 非 JSON 错误体，忽略
		}
		throw new Error(`${response.status}${detail ? ` ${detail}` : ""}`.trim());
	}
	if (response.status === 204) {
		return null;
	}
	return response.json();
}

const text = (value: unknown): string | null =>
	typeof value === "string" && value ? value : null;

/** 将 Account API 返回的用户对象规整为 PassportProfile。 */
function toPassportProfile(data: Record<string, unknown>): PassportProfile {
	const profile =
		typeof data.profile === "object" && data.profile !== null
			? (data.profile as Record<string, unknown>)
			: undefined;
	return {
		id: text(data.id) ?? "",
		username: text(data.username),
		name: text(data.name),
		nickname: text(profile?.nickname),
		website: text(profile?.website),
		avatar: text(data.avatar),
		primaryEmail: text(data.primaryEmail),
	};
}

/** 读取当前用户资料（字段取决于 Logto 账户中心字段权限配置）。 */
export async function fetchPassportProfile(
	options: NonNullable<ResolvedPassportOptions>,
): Promise<PassportProfile> {
	const data = (await accountApiRequest(options, "/api/my-account")) as Record<
		string,
		unknown
	>;
	return toPassportProfile(data);
}

/**
 * 更新基本资料。name/username/avatar 走 PATCH /api/my-account（无需安全验证）；
 * nickname/website 属于 profile 扩展属性，走 PATCH /api/my-account/profile；
 * 完成后回读最新资料。
 */
export async function updatePassportProfile(
	options: NonNullable<ResolvedPassportOptions>,
	patch: PassportProfilePatch,
): Promise<PassportProfile> {
	const body: Record<string, string | null> = {};
	if (patch.name !== undefined) {
		body.name = patch.name || null;
	}
	if (patch.username !== undefined) {
		body.username = patch.username || null;
	}
	if (patch.avatar !== undefined) {
		body.avatar = patch.avatar || null;
	}
	if (Object.keys(body).length > 0) {
		await accountApiRequest(options, "/api/my-account", {
			method: "PATCH",
			body,
		});
	}
	const profileBody: Record<string, string | null> = {};
	if (patch.nickname !== undefined) {
		profileBody.nickname = patch.nickname || null;
	}
	if (patch.website !== undefined) {
		profileBody.website = patch.website || null;
	}
	if (Object.keys(profileBody).length > 0) {
		await accountApiRequest(options, "/api/my-account/profile", {
			method: "PATCH",
			body: profileBody,
		});
	}
	return fetchPassportProfile(options);
}
