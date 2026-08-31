<script lang="ts">
/**
 * 个人资料页面板（有机体）：基于 Logto Account API 的站内账户资料管理。
 * - 基本资料：昵称 / 网站 / 用户名 / 头像链接（无需安全验证，字段按配置开关）；
 * - 文案全部走 i18n；样式与 PassportPanel 同一视觉语言，仅用 M3E 语义 token。
 */

import Button from "@components/atoms/action/Button.svelte";
import Avatar from "@components/atoms/display/Avatar.svelte";
import Card from "@components/atoms/display/Card.svelte";
import LoadingIndicator from "@components/atoms/feedback/LoadingIndicator.svelte";
import TextField from "@components/atoms/input/TextField.svelte";
import PageHeader from "@components/molecules/PageHeader.svelte";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import {
	fetchPassportProfile,
	getPassportState,
	updatePassportProfile,
} from "@utils/passport";
import { showSnackbar } from "@utils/snackbar";
import { url } from "@utils/url-utils";
import { onMount } from "svelte";
import type { ResolvedPassportOptions } from "@/types/passportConfig";

let { options }: { options: NonNullable<ResolvedPassportOptions> } = $props();

type Phase = "loading" | "guest" | "unavailable" | "ready";

let phase = $state<Phase>("loading");
/** 读取资料/接口调用失败原因（如 Account API 未开启） */
let failureReason = $state("");

let avatar = $state("");
let name = $state("");
let nickname = $state("");
let username = $state("");
let website = $state("");

let profileBusy = $state(false);
/** 载入/保存成功后的基线快照，用于判断是否有未保存的更改 */
let baseline = $state({
	name: "",
	nickname: "",
	username: "",
	avatar: "",
	website: "",
});

function snapshotProfile() {
	baseline = { name, nickname, username, avatar, website };
}

/** 与基线逐字段比较，全部一致则视为无更改 */
function hasProfileChanges(): boolean {
	return (
		name !== baseline.name ||
		nickname !== baseline.nickname ||
		username !== baseline.username ||
		avatar !== baseline.avatar ||
		website !== baseline.website
	);
}

function toErrorMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

onMount(async () => {
	try {
		const state = await getPassportState(options);
		if (!state.authenticated) {
			phase = "guest";
			return;
		}
		const profile = await fetchPassportProfile(options);
		name = profile.name ?? "";
		nickname = profile.nickname ?? "";
		username = profile.username ?? "";
		avatar = profile.avatar ?? "";
		website = profile.website ?? "";
		snapshotProfile();
		phase = "ready";
	} catch (error) {
		// SDK 加载失败或 Account API 不可用时进入失败态，避免卡在加载中
		failureReason = toErrorMessage(error);
		phase = "unavailable";
	}
});

async function handleSaveProfile() {
	// 与载入/上次保存的基线一致时不发起请求，直接提示无更改
	if (!hasProfileChanges()) {
		showSnackbar(i18n(I18nKey.passportNoChanges), {
			icon: "material-symbols:info-rounded",
		});
		return;
	}
	profileBusy = true;
	try {
		// 仅提交配置声明为可编辑的字段（与 Logto Account API 字段权限一致）
		const fields = options.profileFields;
		const profile = await updatePassportProfile(options, {
			name: fields.name ? name || null : undefined,
			username: fields.username ? username || null : undefined,
			nickname: fields.nickname ? nickname || null : undefined,
			website: fields.website ? website || null : undefined,
			avatar: fields.avatar ? avatar || null : undefined,
		});
		name = profile.name ?? "";
		nickname = profile.nickname ?? "";
		username = profile.username ?? "";
		avatar = profile.avatar ?? "";
		website = profile.website ?? "";
		snapshotProfile();
		// 全站统一 Snackbar 反馈（文章复制链接同款事件总线）
		showSnackbar(i18n(I18nKey.passportProfileSaved), {
			icon: "material-symbols:check-circle-rounded",
		});
	} catch (error) {
		showSnackbar(
			`${i18n(I18nKey.passportActionFailed)}：${toErrorMessage(error)}`,
			{ icon: "material-symbols:error-outline-rounded" },
		);
	} finally {
		profileBusy = false;
	}
}
</script>

<Card
	color="var(--card-bg)"
	radius="l"
	class="passport-profile passport-section px-8 py-6"
>
	<PageHeader
		icon="material-symbols:manage-accounts-rounded"
		title={i18n(I18nKey.passportProfile)}
		subtitle={i18n(I18nKey.passportProfileBanner)}
	/>

	{#if phase === "loading"}
		<div class="passport-profile__state" aria-busy="true">
			<LoadingIndicator contained size={64} />
		</div>
	{:else if phase === "guest"}
		<div class="passport-profile__state">
			<div class="passport-profile__badge">
				<Icon icon="material-symbols:key-rounded" aria-hidden="true" />
			</div>
			<p class="passport-profile__text">
				{i18n(I18nKey.passportNeedSignIn)}
			</p>
			<Button
				variant="filled"
				href={url("/passport/")}
				label={i18n(I18nKey.passportBack)}
			></Button>
		</div>
	{:else if phase === "unavailable"}
		<div class="passport-profile__state">
			<div class="passport-profile__badge passport-profile__badge--error">
				<Icon
					icon="material-symbols:error-outline-rounded"
					aria-hidden="true"
				/>
			</div>
			<p class="passport-profile__text">
				{i18n(I18nKey.passportProfileUnavailable)}
			</p>
			{#if failureReason}
				<code class="passport-profile__reason">{failureReason}</code>
			{/if}
			<Button
				variant="filled"
				href={url("/passport/")}
				label={i18n(I18nKey.passportBack)}
			></Button>
		</div>
	{:else}
		<!-- 展示头部：头像 + 当前身份（展示与编辑分离，通行证主页 hero 同款） -->
		<div class="passport-profile__hero">
			<Avatar
				src={avatar}
				size={72}
				alt={nickname || name}
				fallback={(nickname || name)[0] ?? "?"}
			></Avatar>
			<div class="passport-profile__meta">
				<p class="passport-profile__display">
					{nickname || name || i18n(I18nKey.passportAnonymous)}
				</p>
				{#if username}
					<p class="passport-profile__handle">
						<Icon
							icon="material-symbols:alternate-email-rounded"
							aria-hidden="true"
						/>
						<span>{username}</span>
					</p>
				{/if}
			</div>
		</div>
		<!-- 可编辑字段：自适应两列网格（窄屏单列），头像链接独占整行 -->
		<div class="passport-profile__fields">
			{#if options.profileFields.name}
				<TextField
					variant="outlined"
					label={i18n(I18nKey.passportFieldName)}
					bind:value={name}
					disabled={profileBusy}
				></TextField>
			{/if}
			{#if options.profileFields.nickname}
				<TextField
					variant="outlined"
					label={i18n(I18nKey.passportFieldNickname)}
					bind:value={nickname}
					disabled={profileBusy}
				></TextField>
			{/if}
			{#if options.profileFields.website}
				<TextField
					variant="outlined"
					type="url"
					label={i18n(I18nKey.passportFieldWebsite)}
					bind:value={website}
					disabled={profileBusy}
				></TextField>
			{/if}
			{#if options.profileFields.username}
				<TextField
					variant="outlined"
					label={i18n(I18nKey.passportFieldUsername)}
					bind:value={username}
					disabled={profileBusy}
				></TextField>
			{/if}
			{#if options.profileFields.avatar}
				<div class="passport-profile__field--wide">
					<TextField
						variant="outlined"
						label={i18n(I18nKey.passportFieldAvatar)}
						bind:value={avatar}
						disabled={profileBusy}
					></TextField>
				</div>
			{/if}
		</div>
		<!-- 底部：保存动作右对齐；成功/失败走全局 Snackbar（文章复制链接同款） -->
		<div class="passport-profile__footer">
			<Button
				variant="filled"
				label={i18n(I18nKey.passportSaveProfile)}
				onclick={handleSaveProfile}
				disabled={profileBusy}
			></Button>
		</div>
	{/if}
</Card>

<style lang="stylus">
@import "../../../styles/breakpoints.styl"

/* 卡片容器（Card 原子根）移动端收窄内边距（同 compass/passport 风格） */
.passport-section
	display: block

	@media (max-width: bp-sm - 1px)
		padding: 1rem 0.75rem

/* 资料面板根：状态区 + 表单区块（PassportPanel 同款 BEM 嵌套） */
.passport-profile
	display: block

	/* —— 状态区块（加载 / 未登录 / 不可用）：居中，防布局跳动 —— */
	&__state
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		gap: var(--m3e-space-4)
		min-height: 16rem

	&__badge
		display: grid
		place-items: center
		width: 4rem
		height: 4rem
		border-radius: var(--shape-corner-full)
		background: var(--secondary-container)
		color: var(--on-secondary-container)
		> :global(svg)
			width: 2rem
			height: 2rem

	&__badge--error
		background: var(--error-container)
		color: var(--on-error-container)

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

	/* —— 展示头部：大头像 hero + 当前身份（通行证主页 hero 同款轮廓） —— */
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

	&__display
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

	/* —— 可编辑字段：两列网格，与 hero 之间用细分隔线过渡 —— */
	&__fields
		display: grid
		grid-template-columns: repeat(2, minmax(0, 1fr))
		gap: var(--m3e-space-4) var(--m3e-space-5)
		min-width: 0
		margin-top: var(--m3e-space-5)
		padding-top: var(--m3e-space-5)
		border-top: 1px solid var(--outline-variant)

	&__field--wide
		grid-column: 1 / -1
		min-width: 0

	/* —— 底部：保存动作右对齐（反馈由全局 Snackbar 承担） —— */
	&__footer
		display: flex
		justify-content: flex-end
		min-width: 0
		margin-top: var(--m3e-space-5)

	/* 窄屏：字段网格折叠为单列，容器内边距同步收窄 */
	@media (max-width: bp-sm - 1px)
		&__fields
			grid-template-columns: 1fr
</style>
