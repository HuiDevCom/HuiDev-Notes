import type { NavBarLink } from "@/types/navBarConfig";

export type ResolvedNavBarLink = Omit<NavBarLink, "children"> & {
	children?: ResolvedNavBarLink[];
};

export function resolveNavBarLinks(links: NavBarLink[]): ResolvedNavBarLink[] {
	return links.map((link) => ({
		...link,
		children: link.children ? resolveNavBarLinks(link.children) : undefined,
	}));
}

/**
 * 当前 URL → 导航高亮标识（pageKey）。
 * 分类/标签筛选优先于归档页（与抽屉/分类栏的筛选优先语义一致）；
 * 文章页、自定义页等无匹配时返回空串（不点亮任何导航项）。
 */
export function resolvePageKey(
	url: Pick<URL, "pathname" | "searchParams">,
): string {
	const pathname = url.pathname.replace(/\/+$/, "") || "/";
	if (pathname === "/") return "home";
	if (url.searchParams.has("category")) return "categories";
	if (url.searchParams.has("tag")) return "tags";
	if (pathname === "/archive") return "archive";
	if (pathname === "/friends") return "friends";
	if (pathname === "/sponsor") return "sponsor";
	if (pathname === "/guestbook") return "guestbook";
	if (pathname === "/moments") return "moments";
	if (pathname === "/anime") return "anime";
	if (pathname === "/compass") return "compass";
	if (pathname === "/skills") return "skills";
	if (pathname === "/projects") return "projects";
	if (pathname === "/devices") return "devices";
	if (pathname === "/timeline") return "timeline";
	if (pathname === "/albums" || pathname.startsWith("/albums/"))
		return "albums";
	if (pathname === "/about") return "about";
	// 通行证资料页用独立高亮键（先于通用 /passport/ 前缀判断），
	// 避免登录页与资料页的二级菜单同时点亮；侧栏过滤不受影响（走 data-current-page）
	if (pathname.startsWith("/passport/profile")) return "passport-profile";
	if (pathname === "/passport" || pathname.startsWith("/passport/"))
		return "passport";
	return "";
}
