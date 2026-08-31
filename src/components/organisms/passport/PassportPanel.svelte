<script lang="ts">
/**
 * 风绘通行证面板（有机体）：Logto SPA 登录态展示与操作。
 * 视觉语言与受保护内容密码门（PasswordGate）同款：外层 Card 页面容器 +
 * 左侧「马赛克色块 + primary 圆形印章」装饰视觉区 + 右侧内容区，窄屏折叠为单列。
 * SSR 直出加载态，挂载后读取浏览器端登录态（@logto/browser 由
 * utils/passport.ts 按需动态拉起，不进主 bundle）。
 * - main 模式：未登录 → 登录按钮；已登录 → 头像 + 资料卡 + 账户中心入口 + 登出；
 * - callback 模式：处理 OIDC 回调（code/state），完成后跳回通行证页；
 * - 文案全部走 i18n；样式仅用 M3E 语义 token 并遵循 prefers-reduced-motion。
 */
import Button from "@components/atoms/action/Button.svelte";
import Avatar from "@components/atoms/display/Avatar.svelte";
import Card from "@components/atoms/display/Card.svelte";
import LoadingIndicator from "@components/atoms/feedback/LoadingIndicator.svelte";
import PageHeader from "@components/molecules/PageHeader.svelte";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import {
	fetchPassportProfile,
	getPassportState,
	handlePassportSignInCallback,
	type PassportIdentity,
	signInWithPassport,
	signOutFromPassport,
} from "@utils/passport";
import { url } from "@utils/url-utils";
import { onMount } from "svelte";
import type { ResolvedPassportOptions } from "@/types/passportConfig";

let {
	options,
	mode = "main",
}: {
	options: NonNullable<ResolvedPassportOptions>;
	mode?: "main" | "callback";
} = $props();

type Phase =
	| "loading"
	| "guest"
	| "signedIn"
	| "callbackPending"
	| "callbackFailed";

let phase = $state<Phase>("loading");
let identity = $state<PassportIdentity | null>(null);
/** Account API 读取的可读资料（昵称/用户名/头像/邮箱）；失败时回退 ID token claims */
let account = $state<Awaited<ReturnType<typeof fetchPassportProfile>> | null>(
	null,
);
let busy = $state(false);
/** 回调失败的具体原因（OIDC 错误响应 / SDK 异常信息），便于排查 */
let failureReason = $state("");

/** 主页为纯展示态：合并 Account API 资料与 ID token claims */
const view = $derived.by(() => {
	if (!identity) return null;
	return {
		name:
			account?.nickname ||
			account?.name ||
			identity.name ||
			identity.username ||
			identity.email ||
			"",
		handle: account?.username || identity.username || "",
		email: account?.primaryEmail || identity.email || "",
		avatar: account?.avatar || identity.picture || "",
	};
});

onMount(async () => {
	if (mode === "callback") {
		phase = "callbackPending";
		try {
			const result = await handlePassportSignInCallback(
				options,
				window.location.href,
			);
			if (result.success) {
				window.location.assign(url("/passport/"));
				return;
			}
			failureReason = result.reason ?? "";
			if (failureReason) {
				console.warn("[passport] sign-in callback failed:", failureReason);
			}
		} catch (error) {
			// SDK 加载失败等异常也回落到失败态，避免卡在加载中
			failureReason = error instanceof Error ? error.message : String(error);
			console.warn("[passport] sign-in callback failed:", failureReason);
		}
		phase = "callbackFailed";
		return;
	}
	try {
		const state = await getPassportState(options);
		identity = state.identity;
		if (!state.authenticated) {
			phase = "guest";
			return;
		}
		phase = "signedIn";
		try {
			account = await fetchPassportProfile(options);
		} catch {
			// Account API 未开启或字段权限未配置时静默回退到 claims 展示
		}
	} catch {
		phase = "guest";
	}
});

async function handleSignIn() {
	busy = true;
	try {
		await signInWithPassport(options);
	} catch {
		busy = false;
	}
}

async function handleSignOut() {
	busy = true;
	try {
		await signOutFromPassport(options);
	} catch {
		busy = false;
	}
}
</script>

<Card color="var(--card-bg)" radius="l" class="passport-section px-8 py-6">
	<PageHeader
		icon="material-symbols:vpn-key-rounded"
		title={i18n(I18nKey.passport)}
		subtitle={i18n(I18nKey.passportBanner)}
	/>

	<div class="passport-gate">
		<!-- 装饰视觉区：倾斜马赛克色块 + primary 印章徽章（密码门同款） -->
		<div class="passport-gate__visual" aria-hidden="true">
			<div class="passport-gate__mosaic">
				<span class="passport-gate__tile passport-gate__tile--one"></span>
				<span class="passport-gate__tile passport-gate__tile--two"></span>
				<span class="passport-gate__tile passport-gate__tile--three"></span>
				<span class="passport-gate__tile passport-gate__tile--four"></span>
			</div>
			<div class="passport-gate__seal">
				<Icon icon="material-symbols:vpn-key-rounded" aria-hidden="true" />
			</div>
		</div>

		<div class="passport-gate__content">
			{#if mode === "callback" && phase === "callbackPending"}
				<!-- 回调处理中：区块位置的大号 contained 指示器（罗盘筛选同款） -->
				<div class="passport-gate__state">
					<LoadingIndicator contained size={64} />
					<p class="passport-gate__text">{i18n(I18nKey.passportCallback)}</p>
				</div>
			{:else if mode === "callback" && phase === "callbackFailed"}
				<div class="passport-gate__state">
					<div class="passport-gate__badge passport-gate__badge--error">
						<Icon
							icon="material-symbols:error-outline-rounded"
							aria-hidden="true"
						/>
					</div>
					<p class="passport-gate__text">{i18n(I18nKey.passportCallbackFailed)}</p>
				{#if failureReason}
					<code class="passport-gate__reason">{failureReason}</code>
				{/if}
				<Button
					variant="filled"
					href={url("/passport/")}
					label={i18n(I18nKey.passportBack)}
				></Button>
				</div>
			{:else if phase === "loading"}
				<div class="passport-gate__state" aria-busy="true">
					<LoadingIndicator contained size={64} />
				</div>
			{:else if phase === "guest"}
				<div class="passport-gate__hint">
					<Icon icon="material-symbols:key-rounded" aria-hidden="true" />
					<span>{i18n(I18nKey.passportNotSignedIn)}</span>
				</div>
				<div class="passport-gate__form">
					<Button
						variant="filled"
						icon="material-symbols:login-rounded"
						label={i18n(I18nKey.passportSignIn)}
						onclick={handleSignIn}
						disabled={busy}
						full
					></Button>
				</div>
			{:else if phase === "signedIn"}
			<!-- 展示态：大头像 hero + 可读资料行（编辑在资料页完成） -->
			<div class="passport-gate__hero">
				<Avatar
					src={view?.avatar || ""}
					size={80}
					alt={view?.name || ""}
					fallback={view?.name ? view.name[0] : "?"}
				></Avatar>
				<div class="passport-gate__meta">
					<p class="passport-gate__name">
						{view?.name || i18n(I18nKey.passportAnonymous)}
					</p>
					{#if view?.handle}
						<p class="passport-gate__handle">
							<Icon
								icon="material-symbols:alternate-email-rounded"
								aria-hidden="true"
							/>
							<span>{view.handle}</span>
						</p>
					{/if}
				</div>
			</div>
			{#if view?.email}
				<div class="passport-gate__rows">
					<div class="passport-gate__row">
						<Icon icon="material-symbols:mail-rounded" aria-hidden="true" />
						<span>{view.email}</span>
					</div>
				</div>
			{/if}
			<div
				class="passport-gate__actions"
				class:passport-gate__actions--single={options.accountEntry !==
					"internal"}
			>
				{#if options.accountEntry === "external"}
					<Button
						variant="filled"
						icon="material-symbols:manage-accounts-rounded"
						label={i18n(I18nKey.passportAccount)}
						href={options.accountHref}
						target="_blank"
						rel="noopener noreferrer"
					></Button>
					<Button
						variant="outlined"
						icon="material-symbols:logout-rounded"
						label={i18n(I18nKey.passportSignOut)}
						onclick={handleSignOut}
						disabled={busy}
					></Button>
				{:else if options.accountEntry === "internal"}
					<Button
						variant="filled"
						icon="material-symbols:person-rounded"
						label={i18n(I18nKey.passportProfile)}
						href={url("/passport/profile/")}
					></Button>
					<Button
						variant="outlined"
						icon="material-symbols:logout-rounded"
						label={i18n(I18nKey.passportSignOut)}
						onclick={handleSignOut}
						disabled={busy}
					></Button>
				{:else}
					<Button
						variant="outlined"
						icon="material-symbols:logout-rounded"
						label={i18n(I18nKey.passportSignOut)}
						onclick={handleSignOut}
						disabled={busy}
					></Button>
				{/if}
			</div>
		{/if}
		</div>
	</div>
</Card>

<style lang="stylus">
@import "../../../styles/breakpoints.styl"

/* 卡片容器（Card 原子根）移动端收窄内边距（同 compass/anime 风格） */
.passport-section
	display: block

	@media (max-width: bp-sm - 1px)
		padding: 1rem 0.75rem

/* 门型分栏面板：视觉区 + 内容区（PasswordGate 同款骨架） */
.passport-gate
	display: grid
	grid-template-columns: minmax(min(14rem, 42%), 0.8fr) minmax(0, 1.2fr)
	width: 100%
	min-height: 20rem
	margin-top: var(--m3e-space-1)
	overflow: hidden
	border: 1px solid var(--outline-variant)
	border-radius: var(--shape-corner-l)
	background: var(--surface-container-lowest)
	color: var(--on-surface)

	/* —— 装饰视觉区 —— */
	&__visual
		position: relative
		display: grid
		place-items: center
		min-width: 0
		overflow: hidden
		background: var(--surface-container-high)

	&__mosaic
		position: absolute
		inset: var(--m3e-space-6)
		display: grid
		grid-template-columns: 1.15fr 0.85fr
		grid-template-rows: 0.85fr 1.15fr
		gap: var(--m3e-space-3)
		transform: rotate(-3deg) scale(1.08)

	&__tile
		min-width: 0
		border-radius: var(--shape-corner-l)
		box-shadow: inset 0 0 0 1px var(--outline-variant)

	&__tile--one
		background: var(--primary-container)

	&__tile--two
		background: var(--tertiary-container)

	&__tile--three
		background: var(--secondary-container)

	&__tile--four
		background: var(--surface-container-highest)

	&__seal
		position: relative
		display: grid
		place-items: center
		width: 5rem
		height: 5rem
		border: var(--m3e-space-2) solid var(--surface-container-lowest)
		border-radius: var(--shape-corner-full)
		background: var(--primary)
		box-shadow: var(--m3e-elevation-3)
		color: var(--on-primary)
		> :global(svg)
			width: 2rem
			height: 2rem

	/* —— 内容区 —— */
	&__content
		display: flex
		flex-direction: column
		justify-content: center
		gap: var(--m3e-space-6)
		min-width: 0
		padding: var(--m3e-space-8)

	&__state
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		gap: var(--m3e-space-4)
		min-height: 14rem

	&__text
		margin: 0
		max-width: 26rem
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-large)
		line-height: 1.6
		text-align: center

	&__reason
		max-width: 100%
		padding: var(--m3e-space-2) var(--m3e-space-3)
		border-radius: var(--shape-corner-m)
		background: var(--surface-container-high)
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-small)
		font-family: var(--font-mono)
		overflow-wrap: anywhere

	&__badge
		display: grid
		place-items: center
		width: 4rem
		height: 4rem
		border-radius: var(--shape-corner-full)
		background: var(--error-container)
		color: var(--on-error-container)
		> :global(svg)
			width: 2rem
			height: 2rem

	/* 提示条：key 图标 + 文案（密码门 hint 同款） */
	&__hint
		display: flex
		align-items: center
		gap: var(--m3e-space-3)
		min-width: 0
		padding: var(--m3e-space-3) var(--m3e-space-4)
		border-radius: var(--shape-corner-m)
		background: var(--surface-container-high)
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-medium)
		> :global(svg)
			flex: none
			width: 1.25rem
			height: 1.25rem
			color: var(--primary)
		span
			min-width: 0
			overflow-wrap: anywhere

	&__form
		display: grid
		gap: var(--m3e-space-4)
		width: 100%

	/* 已登录展示态：大头像 hero + 可读资料行（展示与编辑分离） */
	&__hero
		display: flex
		align-items: center
		gap: var(--m3e-space-5)
		min-width: 0
		/* 大头像带描边轮廓，浅色背景上更立体（M3 avatar outline 规范） */
		> :global(.m3-avatar)
			box-shadow: 0 0 0 2px var(--outline-variant)

	&__meta
		flex: 1
		min-width: 0
		display: flex
		flex-direction: column
		gap: var(--m3e-space-1)

	&__name
		margin: 0
		color: var(--on-surface)
		font: var(--m3e-type-headline-small)
		overflow: hidden
		text-overflow: ellipsis
		white-space: nowrap

	&__handle
		margin: 0
		display: flex
		align-items: center
		gap: var(--m3e-space-1)
		min-width: 0
		color: var(--on-surface-variant)
		font: var(--m3e-type-body-medium)
		> :global(svg)
			flex: none
			width: 1rem
			height: 1rem
		span
			overflow: hidden
			text-overflow: ellipsis
			white-space: nowrap

	&__rows
		display: grid
		gap: var(--m3e-space-2)

	&__row
		display: flex
		align-items: center
		gap: var(--m3e-space-3)
		min-width: 0
		padding: var(--m3e-space-3) var(--m3e-space-4)
		border-radius: var(--shape-corner-m)
		background: var(--surface-container-high)
		color: var(--on-surface)
		font: var(--m3e-type-body-medium)
		> :global(svg)
			flex: none
			width: 1.25rem
			height: 1.25rem
			color: var(--primary)
		span
			min-width: 0
			overflow: hidden
			text-overflow: ellipsis
			white-space: nowrap

	/* 双动作按钮组：账户入口（资料/外部中心）/ 退出登录；窄屏纵排 */
	&__actions
		display: grid
		grid-template-columns: repeat(2, minmax(0, 1fr))
		gap: var(--m3e-space-3)

	&__actions--single
		grid-template-columns: 1fr

/* 窄屏：折叠为单列，视觉区压扁为顶部横幅（密码门同款节奏）。
   阈值取 bp-lg：主题带侧栏，内容列明显窄于视口，中窄窗口直接走单列更从容 */
@media (max-width: bp-lg - 1px)
	.passport-gate
		grid-template-columns: 1fr
		min-height: 0

		&__visual
			min-height: 11rem

		&__mosaic
			inset: var(--m3e-space-5)

		&__content
			padding: var(--m3e-space-6)

		&__actions
			grid-template-columns: 1fr

@media (max-width: bp-sm - 1px)
	.passport-gate
		&__visual
			min-height: 8.5rem

		&__mosaic
			inset: var(--m3e-space-4)
			gap: var(--m3e-space-2)

		&__seal
			width: 4rem
			height: 4rem
			border-width: var(--m3e-space-1)
			> :global(svg)
				width: 1.5rem
				height: 1.5rem

		&__content
			gap: var(--m3e-space-4)
			padding: var(--m3e-space-5)
</style>
