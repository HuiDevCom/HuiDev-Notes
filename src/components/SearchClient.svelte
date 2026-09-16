<script lang="ts">
	import { onMount } from 'svelte';
	import { searchConfig } from '@/config';

	type PagefindResult = {
		url: string;
		excerpt: string;
		meta: { title?: string; image?: string; image_alt?: string };
	};
	type PagefindApi = {
		init: () => Promise<void>;
		search: (query: string) => Promise<{ results: Array<{ data: () => Promise<PagefindResult> }> }>;
	};

	let query = $state('');
	let results = $state<PagefindResult[]>([]);
	let loading = $state(false);
	let ready = $state(false);
	let searched = $state(false);
	let unavailable = $state(false);
	let pagefind: PagefindApi | undefined;
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;
	let requestId = 0;

	onMount(async () => {
		try {
			const modulePath = '/pagefind/pagefind.js';
			pagefind = await import(/* @vite-ignore */ modulePath) as PagefindApi;
			await pagefind.init();
			ready = true;
			const initialQuery = new URLSearchParams(window.location.search).get('q')?.trim();
			if (initialQuery) {
				query = initialQuery;
				await search();
			}
		} catch {
			unavailable = true;
		}
	});

	async function search() {
		const value = query.trim();
		const currentRequest = ++requestId;
		if (!value || !pagefind) {
			results = [];
			searched = false;
			loading = false;
			return;
		}

		loading = true;
		searched = true;
		const response = await pagefind.search(value);
		const nextResults = await Promise.all(
			response.results.slice(0, searchConfig.maxResults).map((result) => result.data()),
		);
		if (currentRequest === requestId) {
			results = nextResults;
			loading = false;
		}
	}

	function handleInput(event: Event) {
		query = (event.currentTarget as HTMLInputElement).value;
		window.clearTimeout(debounceTimer);
		debounceTimer = window.setTimeout(search, 180);
	}
</script>

<div class="mx-auto max-w-4xl">
	<label class="anime-shadow-sm flex items-center gap-4 rounded-2xl border-2 border-sky-ink bg-white px-5 py-4 text-sky-ink dark:border-white/20 dark:bg-[#181d3a] dark:text-white">
		<svg class="size-6 shrink-0 text-mizu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>
		<span class="sr-only">全文搜索</span>
		<input value={query} oninput={handleInput} type="search" autocomplete="off" placeholder={searchConfig.placeholder} class="min-w-0 flex-1 border-0 bg-transparent text-base font-bold outline-none placeholder:font-medium placeholder:text-sky-ink/30 dark:placeholder:text-white/25" />
		{#if loading}<span class="size-4 animate-spin rounded-full border-2 border-mizu border-t-transparent" aria-label="正在搜索"></span>{/if}
	</label>

	{#if unavailable}
		<div class="mt-8 rounded-3xl border-2 border-dashed border-sky-ink/15 bg-white/40 px-6 py-16 text-center dark:border-white/10 dark:bg-white/[.03]">
			<p class="text-4xl">⌕</p><p class="mt-4 font-black">搜索索引会在生产构建后生成</p><p class="mt-2 text-sm text-sky-ink/45 dark:text-white/40">本地开发模式下暂不可用，部署后的站点可以正常全文搜索。</p>
		</div>
	{:else if ready && !searched}
		<div class="mt-10 grid gap-4 sm:grid-cols-3">
			<div class="rounded-2xl bg-[#e6f8ff] p-5 dark:bg-[#19374a]"><span class="text-2xl">文</span><p class="mt-8 text-xs font-black tracking-[.15em] text-sky-ink/50 dark:text-white/45">标题与正文</p></div>
			<div class="rounded-2xl bg-[#fff0f6] p-5 dark:bg-[#45283c]"><span class="text-2xl">#</span><p class="mt-8 text-xs font-black tracking-[.15em] text-sky-ink/50 dark:text-white/45">分类与标签</p></div>
			<div class="rounded-2xl bg-[#fff8d8] p-5 dark:bg-[#494021]"><span class="text-2xl">⌘</span><p class="mt-8 text-xs font-black tracking-[.15em] text-sky-ink/50 dark:text-white/45">静态、本地、快速</p></div>
		</div>
	{:else if searched && !loading && results.length === 0}
		<div class="mt-8 rounded-3xl border-2 border-dashed border-sky-ink/15 py-20 text-center dark:border-white/10"><p class="text-5xl">☁</p><h2 class="mt-5 text-xl font-black">{searchConfig.emptyText}</h2><p class="mt-2 text-sm text-sky-ink/45 dark:text-white/40">试试更短的关键词，或从分类和标签开始浏览。</p></div>
	{:else}
		<div class="mt-8 space-y-4" aria-live="polite">
			{#each results as result (result.url)}
				<a href={result.url} class="group grid gap-5 rounded-3xl border-2 border-sky-ink/15 bg-white/65 p-5 no-underline transition hover:-translate-y-1 hover:border-mizu sm:grid-cols-[120px_1fr] dark:border-white/10 dark:bg-white/5">
					{#if result.meta.image}<img src={result.meta.image} alt={result.meta.image_alt ?? ''} class="h-28 w-full rounded-2xl object-cover sm:h-full" loading="lazy" />{:else}<div class="grid h-24 place-items-center rounded-2xl bg-linear-to-br from-mizu/20 to-sakura/20 font-display text-4xl font-black text-sky-ink/25 sm:h-full dark:text-white/20">風</div>{/if}
					<div class="min-w-0 py-1"><h2 class="text-xl font-black text-sky-ink transition group-hover:text-mizu dark:text-white">{result.meta.title ?? '未命名文章'}</h2><div class="search-excerpt mt-3 line-clamp-3 text-sm leading-7 text-sky-ink/55 dark:text-white/50">{@html result.excerpt}</div><span class="mt-4 inline-flex text-[10px] font-black tracking-[.18em] text-sakura">READ RESULT →</span></div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.search-excerpt :global(mark) { border-radius: .25rem; background: rgba(255, 214, 110, .75); padding: .05rem .2rem; color: #233763; font-weight: 800; }
</style>
