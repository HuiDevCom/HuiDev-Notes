import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { animeConfig } from "@/config/animeConfig";
import { devicesConfig } from "@/config/devicesConfig";
import { guestbookConfig } from "@/config/guestbookConfig";
import {
	passportConfig,
	resolvePassportOptions,
} from "@/config/passportConfig";
import { projectsConfig } from "@/config/projectsConfig";
import { skillsConfig } from "@/config/skillsConfig";
import { sponsorConfig } from "@/config/sponsorConfig";
import { timelineConfig } from "@/config/timelineConfig";
import type {
	NavBarConfig,
	NavBarConfigOverride,
	NavBarLink,
	NavBarLinkOverride,
} from "@/types/navBarConfig";
import { getUserConfig } from "../utils/config-overlay.ts";

/**
 * 导航栏配置（统一单一来源）。
 * - LinkPresets：命名链接预设表 —— 名称 / 地址 / 图标单点维护，可整体复用；
 * - navBarConfig：导航结构 —— 顺序 + 分组（children 子菜单），
 *   同时驱动顶栏下拉菜单与全端导航抽屉。
 * 新增入口：先在 LinkPresets 登记预设，再在 navBarConfig.links 按序引用。
 *
 * 内容仓可用 `config/nav-bar.yaml` 整体替换 `links`，写法见 `NavBarLinkOverride`。
 */
export const LinkPresets: Record<string, NavBarLink> = {
	Home: {
		name: i18n(I18nKey.home),
		url: "/",
		icon: "material-symbols:home-outline-rounded",
		pageKey: "home",
	},
	Archive: {
		name: i18n(I18nKey.archive),
		url: "/archive/",
		icon: "material-symbols:archive-outline-rounded",
		pageKey: "archive",
	},
	Friends: {
		name: i18n(I18nKey.friends),
		url: "/friends/",
		icon: "material-symbols:handshake-outline-rounded",
		pageKey: "friends",
	},
	Sponsor: {
		name: i18n(I18nKey.sponsor),
		url: "/sponsor/",
		icon: "material-symbols:favorite-outline-rounded",
		pageKey: "sponsor",
	},
	Guestbook: {
		name: i18n(I18nKey.guestbook),
		url: "/guestbook/",
		icon: "material-symbols:forum-outline-rounded",
		pageKey: "guestbook",
	},
	Moments: {
		name: i18n(I18nKey.moments),
		url: "/moments/",
		icon: "material-symbols:auto-awesome-outline-rounded",
		pageKey: "moments",
	},
	Anime: {
		name: i18n(I18nKey.anime),
		url: "/anime/",
		icon: "material-symbols:live-tv-outline-rounded",
		pageKey: "anime",
	},
	Compass: {
		name: i18n(I18nKey.compass),
		url: "/compass/",
		icon: "material-symbols:explore-rounded",
		pageKey: "compass",
	},
	Skills: {
		name: i18n(I18nKey.skills),
		url: "/skills/",
		icon: "material-symbols:workspaces-outline-rounded",
		pageKey: "skills",
	},
	Projects: {
		name: i18n(I18nKey.projects),
		url: "/projects/",
		icon: "material-symbols:deployed-code-outline-rounded",
		pageKey: "projects",
	},
	Devices: {
		name: i18n(I18nKey.devices),
		url: "/devices/",
		icon: "material-symbols:devices-rounded",
		pageKey: "devices",
	},
	Timeline: {
		name: i18n(I18nKey.timeline),
		url: "/timeline/",
		icon: "material-symbols:timeline-rounded",
		pageKey: "timeline",
	},
	Albums: {
		name: i18n(I18nKey.albums),
		url: "/albums/",
		icon: "material-symbols:photo-library-outline-rounded",
		pageKey: "albums",
	},
	Categories: {
		name: i18n(I18nKey.categories),
		url: "/categories/",
		icon: "material-symbols:folder-outline-rounded",
		pageKey: "categories",
	},
	Tags: {
		name: i18n(I18nKey.tags),
		url: "/tags/",
		icon: "material-symbols:tag-rounded",
		pageKey: "tags",
	},
	About: {
		name: i18n(I18nKey.about),
		url: "/about/",
		icon: "material-symbols:info-outline-rounded",
		pageKey: "about",
	},
	Passport: {
		name: i18n(I18nKey.passport),
		url: "/passport/",
		icon: "material-symbols:vpn-key-outline-rounded",
		pageKey: "passport",
	},
	PassportProfile: {
		name: i18n(I18nKey.passportProfile),
		url: "/passport/profile/",
		icon: "material-symbols:manage-accounts-rounded",
		// 独立高亮键：与 /passport/ 登录页区分，避免二级菜单双双点亮
		pageKey: "passport-profile",
	},
	GitHub: {
		name: "GitHub",
		url: "https://github.com/HuiDevCom/HuiDev-Notes",
		icon: "fa6-brands:github",
		external: true,
		pageKey: "github",
	},
	Umami: {
		name: "Umami",
		url: "https://umami.huidev.com/share/uMHtGWTow6pWGeo3",
		icon: "material-symbols:monitoring-outline-rounded",
		external: true,
		pageKey: "umami",
	},
};

const passportOptions = resolvePassportOptions(passportConfig);

/** 风绘通行证下拉菜单：仅在功能开启且凭据齐备时出现导航入口 */
const passportMenu: NavBarLink | null = passportOptions
	? {
			name: i18n(I18nKey.passport),
			icon: "material-symbols:vpn-key-outline-rounded",
			pageKey: "passport",
			children: [
				LinkPresets.Passport,
				...(passportOptions.accountEntry === "internal"
					? [LinkPresets.PassportProfile]
					: []),
				...(passportOptions.accountEntry === "external" &&
				passportOptions.accountHref
					? [
							{
								name: i18n(I18nKey.passportAccount),
								url: passportOptions.accountHref,
								icon: "material-symbols:manage-accounts-rounded",
								external: true,
							},
						]
					: []),
			],
		}
	: null;

const defaultNavBarConfig: NavBarConfig = {
	links: [
		LinkPresets.Home,
		LinkPresets.Archive,
		{
			// 社交下拉：友链 + 留言（均随各自页面开关显隐，全关时菜单隐藏）
			name: i18n(I18nKey.social),
			icon: "material-symbols:forum-outline-rounded",
			pageKey: "social",
			children: [
				LinkPresets.Friends,
				...(guestbookConfig.enable ? [LinkPresets.Guestbook] : []),
			],
		},
		LinkPresets.Moments,
		...(animeConfig.enable ? [LinkPresets.Anime] : []),
		LinkPresets.Albums,
		...(passportMenu ? [passportMenu] : []),
		{
			name: i18n(I18nKey.more),
			icon: "material-symbols:apps-rounded",
			children: [
				...(timelineConfig.enable ? [LinkPresets.Timeline] : []),
				...(projectsConfig.enable ? [LinkPresets.Projects] : []),
				...(devicesConfig.enable ? [LinkPresets.Devices] : []),
				...(skillsConfig.enable ? [LinkPresets.Skills] : []),
				// 分类/标签入口不进导航菜单（避免菜单项过多），预设已登记指向独立页面，
				// 需要时取消注释即可
				// LinkPresets.Categories,
				// LinkPresets.Tags,
				LinkPresets.About,
				...(sponsorConfig.enable ? [LinkPresets.Sponsor] : []),
				LinkPresets.Compass,
				LinkPresets.Umami,
				LinkPresets.GitHub,
			],
		},
	],
};

/** `$t:home` 形式的 i18n 引用前缀；不带前缀的 name 一律按字面量处理。 */
const I18N_REFERENCE_PREFIX = "$t:";

function fail(message: string): never {
	throw new Error(`[config] nav-bar：${message}`);
}

function resolveName(name: string): string {
	if (!name.startsWith(I18N_REFERENCE_PREFIX)) return name;

	const key = name.slice(I18N_REFERENCE_PREFIX.length);
	if (!Object.hasOwn(I18nKey, key)) {
		fail(
			`未知的 i18n 词条 "${key}"。可用词条见 src/i18n/i18nKey.ts；` +
				" 若本意是普通文本，去掉开头的 $t: 即可。",
		);
	}
	return i18n(I18nKey[key as keyof typeof I18nKey]);
}

/**
 * 把内容仓的声明式导航条目还原成 `NavBarLink`。
 *
 * 预设名与 i18n 词条只有在这里才能校验（`LinkPresets` 与 `I18nKey` 都住在代码仓，
 * 生成期的 Node 脚本受路径别名所限读不到），因此错误在构建加载配置时抛出。
 */
export function resolveNavBarLinks(
	entries: readonly NavBarLinkOverride[],
	presets: Record<string, NavBarLink> = LinkPresets,
): NavBarLink[] {
	return entries.map((entry) => {
		let base: NavBarLink | null = null;
		if (entry.preset !== undefined) {
			base = presets[entry.preset] ?? null;
			if (!base) {
				fail(
					`未知的预设 "${entry.preset}"。可用预设：${Object.keys(presets).join("、")}。`,
				);
			}
		}

		const name =
			entry.name !== undefined ? resolveName(entry.name) : base?.name;
		if (name === undefined) {
			fail("每个条目都需要 name，或用 preset 引用一个内置预设。");
		}

		// 未声明 children 时沿用预设自带的子菜单（已由 ...base 带入）。
		return {
			...base,
			name,
			...(entry.url !== undefined ? { url: entry.url } : {}),
			...(entry.icon !== undefined ? { icon: entry.icon } : {}),
			...(entry.pageKey !== undefined ? { pageKey: entry.pageKey } : {}),
			...(entry.external !== undefined ? { external: entry.external } : {}),
			...(entry.children
				? { children: resolveNavBarLinks(entry.children, presets) }
				: {}),
		};
	});
}

const userNavBar = getUserConfig("navBar") as NavBarConfigOverride | undefined;

export const navBarConfig: NavBarConfig = userNavBar
	? { links: resolveNavBarLinks(userNavBar.links) }
	: defaultNavBarConfig;
