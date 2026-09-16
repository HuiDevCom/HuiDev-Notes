<script lang="ts">
	import { onMount } from 'svelte';
	import { enabledNavItems, navBarConfig, profileConfig, siteConfig, umamiConfig } from '@/config';

	type Tone = 'sky' | 'sunset' | 'mint';
	type Article = {
		slug: string;
		category: string;
		date: string;
		title: string;
		description: string;
		readTime: string;
		tone: Tone;
		mark: string;
		coverImage?: string;
	};
	type Moment = {
		slug: string;
		date: string;
		time: string;
		html: string;
		tag: string;
		icon: string;
		tone: 'sky' | 'night' | 'sunset' | 'mint' | 'sakura' | 'yuzu';
	};

	let { posts = [], moments = [] }: { posts?: Article[]; moments?: Moment[] } = $props();

	const categories = ['全部', '代码魔法', '视觉研究', '异想日常'];
	const previewCount = 3;
	const articleToneClasses: Record<Tone, string> = {
		sky: 'from-[#b9efff] via-[#e9fbff] to-[#d9d4ff] dark:from-[#1a4053] dark:via-[#182a43] dark:to-[#312a62]',
		sunset: 'from-[#ffe0ed] via-[#fff1f5] to-[#ffe9ba] dark:from-[#4c2643] dark:via-[#3d293f] dark:to-[#4a3824]',
		mint: 'from-[#d5f7e4] via-[#f1ffed] to-[#fff3af] dark:from-[#1e453c] dark:via-[#253d34] dark:to-[#484022]',
	};
	const momentToneClasses = {
		sky: 'bg-[#e6f8ff] dark:bg-[#19374a]',
		night: 'bg-[#efeaff] dark:bg-[#302b54]',
		sunset: 'bg-[#fff0e6] dark:bg-[#4b332d]',
		mint: 'bg-[#e9fff4] dark:bg-[#1d4038]',
		sakura: 'bg-[#ffe9f2] dark:bg-[#45283c]',
		yuzu: 'bg-[#fff8d8] dark:bg-[#494021]',
	};

	let activeCategory = $state('全部');
	let darkMode = $state(false);
	let mobileOpen = $state(false);
	let filteredArticles = $derived(
		(activeCategory === '全部' ? posts : posts.filter((article) => article.category === activeCategory))
			.slice(0, previewCount),
	);
	let latestMoments = $derived(moments.slice(0, 2));

	onMount(() => {
		darkMode = document.documentElement.classList.contains('dark');
	});

	function toggleTheme() {
		darkMode = !darkMode;
		document.documentElement.classList.toggle('dark', darkMode);
		localStorage.setItem(siteConfig.theme.storageKey, darkMode ? 'dark' : 'light');
	}

	function closeMenu() {
		mobileOpen = false;
	}
</script>

<svelte:window onkeydown={(event: KeyboardEvent) => event.key === 'Escape' && closeMenu()} />

<div class="relative min-h-screen overflow-hidden bg-[#eef8ff] text-night transition-colors duration-500 dark:bg-night dark:text-white">
	<div aria-hidden="true" class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
		<div class="absolute -left-32 top-40 h-96 w-96 rounded-full bg-mizu/20 blur-3xl dark:bg-mizu/10"></div>
		<div class="absolute -right-32 top-[38rem] h-[30rem] w-[30rem] rounded-full bg-sakura/15 blur-3xl dark:bg-sakura/10"></div>
		<span class="absolute top-[18%] left-[-2rem] h-3 w-16 rotate-[-14deg] rounded-full bg-white/80 blur-[1px] motion-safe:animate-[drift_14s_linear_infinite]"></span>
		<span class="absolute top-[46%] left-[-4rem] h-2 w-10 rotate-[-14deg] rounded-full bg-sakura/50 blur-[1px] motion-safe:animate-[drift_18s_linear_3s_infinite]"></span>
	</div>

	<header class="relative z-50 px-4 pt-4 sm:px-6 lg:px-10">
		<div class="mx-auto flex h-17 max-w-[1440px] items-center justify-between rounded-2xl border-2 border-sky-ink/15 bg-white/75 px-4 shadow-[0_10px_40px_rgba(35,55,99,.08)] backdrop-blur-xl sm:px-6 dark:border-white/10 dark:bg-[#171c38]/80">
		<a href="/" class="group flex items-center gap-3 no-underline" aria-label={`${siteConfig.name}首页`}>
				<img src={siteConfig.logo} alt={siteConfig.logoAlt} class="anime-shadow-sm size-10 rotate-[-4deg] rounded-xl border-2 border-sky-ink bg-white object-cover transition-transform group-hover:rotate-3 dark:border-white" />
				<span>
					<strong class="block text-base leading-tight tracking-[.16em] text-sky-ink dark:text-white">{siteConfig.name}</strong>
					<small class="block text-[9px] font-bold tracking-[.23em] text-sky-ink/45 dark:text-white/45">{siteConfig.englishName}</small>
				</span>
			</a>

			{#if navBarConfig.enable}
				<nav class="hidden items-center gap-1 rounded-full border border-sky-ink/10 bg-white/55 p-1 text-sm font-bold text-sky-ink/65 md:flex dark:border-white/10 dark:bg-white/5 dark:text-white/65" aria-label={navBarConfig.ariaLabel}>
					{#each enabledNavItems as item (item.key)}
						<a href={item.href} target={item.external ? '_blank' : undefined} aria-current={item.key === 'home' ? 'page' : undefined} class={`rounded-full px-5 py-2 no-underline transition ${item.key === 'home' ? 'bg-sky-ink text-white shadow-sm dark:bg-mizu dark:text-night' : 'hover:bg-mizu/15 hover:text-sky-ink dark:hover:text-white'}`}>{item.label}</a>
					{/each}
				</nav>
			{/if}

			<div class="flex items-center gap-2">
				<button onclick={toggleTheme} class="grid size-10 cursor-pointer place-items-center rounded-full border-2 border-sky-ink/15 bg-white text-sky-ink transition hover:-translate-y-0.5 hover:border-mizu dark:border-white/15 dark:bg-white/5 dark:text-white" aria-label={darkMode ? '切换至浅色主题' : '切换至深色主题'}>
					{#if darkMode}
						<svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"></path></svg>
					{:else}
						<svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 15.2A8.2 8.2 0 0 1 8.8 4 8.3 8.3 0 1 0 20 15.2Z"></path></svg>
					{/if}
				</button>
				{#if navBarConfig.enable}
					<button onclick={() => (mobileOpen = !mobileOpen)} class="grid size-10 cursor-pointer place-items-center rounded-full border-2 border-sky-ink/15 bg-white text-sky-ink md:hidden dark:border-white/15 dark:bg-white/5 dark:text-white" aria-label="打开导航" aria-expanded={mobileOpen}>
						<svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d={mobileOpen ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h10'}></path></svg>
					</button>
				{/if}
			</div>
		</div>

		{#if mobileOpen && navBarConfig.enable}
			<nav class="anime-shadow-sm mx-auto mt-3 grid max-w-[1440px] grid-cols-2 gap-2 rounded-2xl border-2 border-sky-ink bg-white p-3 text-center text-sm font-bold text-sky-ink md:hidden dark:border-mizu dark:bg-[#1b2142] dark:text-white" aria-label={navBarConfig.ariaLabel}>
				{#each enabledNavItems as item (item.key)}
					<a onclick={closeMenu} href={item.href} target={item.external ? '_blank' : undefined} aria-current={item.key === 'home' ? 'page' : undefined} class={`rounded-xl px-4 py-3 no-underline hover:bg-mizu/15 ${item.key === 'home' ? 'bg-mizu/15' : ''}`}>{item.label}</a>
				{/each}
			</nav>
		{/if}
	</header>

	<main id="top" class="relative z-10">
		<section class="mx-auto grid min-h-[calc(100vh-86px)] max-w-[1440px] items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[.88fr_1.12fr] lg:px-12 lg:py-10">
			<div class="relative z-20 max-w-2xl motion-safe:animate-[appear-up_.7s_ease-out_both]">
				<div class="mb-6 inline-flex rotate-[-2deg] items-center gap-2 rounded-full border-2 border-sky-ink bg-yuzu px-4 py-2 text-xs font-black tracking-[.16em] text-sky-ink anime-shadow-sm dark:border-white dark:bg-yuzu dark:text-night">
					<span class="size-2 animate-pulse rounded-full bg-sakura"></span>
					NOW · 風が吹いている
				</div>
				<p class="mb-3 text-sm font-black tracking-[.3em] text-mizu sm:text-base">WELCOME TO MY DAYDREAM</p>
				<h1 class="font-display text-[clamp(3.25rem,7vw,7rem)] leading-[.98] font-black tracking-[-.07em] text-sky-ink dark:text-white">
					把掠过世界的风，<br />
					<span class="relative inline-block text-sakura text-glow">
						写进次元。
						<svg class="absolute -right-12 -top-8 size-12 text-yuzu sm:-right-16 sm:size-16" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><path d="m32 0 5.7 20.3L56 8l-12.3 18.3L64 32l-20.3 5.7L56 56 37.7 43.7 32 64l-5.7-20.3L8 56l12.3-18.3L0 32l20.3-5.7L8 8l18.3 12.3L32 0Z"></path></svg>
					</span>
				</h1>
				<p class="mt-7 max-w-lg text-base leading-8 font-medium text-sky-ink/65 sm:text-lg dark:text-white/60">
					这里收藏代码、设计与日常幻想。<br class="hidden sm:block" />愿每一个平凡的瞬间，都有自己的主题曲。
				</p>
				<div class="mt-9 flex flex-wrap gap-4">
					<a href="/posts" class="anime-shadow inline-flex items-center gap-3 rounded-xl border-2 border-sky-ink bg-sky-ink px-6 py-3.5 text-sm font-black text-white no-underline transition hover:-translate-y-1 hover:bg-[#314a83] dark:border-mizu dark:bg-mizu dark:text-night">
						开始阅读
						<svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"></path></svg>
					</a>
					<a href="/moments" class="inline-flex items-center gap-2 rounded-xl border-2 border-sky-ink/20 bg-white/70 px-6 py-3.5 text-sm font-black text-sky-ink no-underline backdrop-blur transition hover:border-sakura hover:text-sakura dark:border-white/15 dark:bg-white/5 dark:text-white">
						看看今日片刻
					</a>
				</div>
				{#if umamiConfig.enable && umamiConfig.publicShare.enable && umamiConfig.stats.enable && umamiConfig.stats.showOnHome}
					<div
						data-huidev-umami
						data-umami-compact={String(umamiConfig.stats.compactNumbers)}
						data-state="idle"
						aria-label="全站访问统计"
						class="mt-7 grid max-w-sm grid-cols-2 gap-3"
					>
						<div class="rounded-2xl border-2 border-sky-ink/10 bg-white/65 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-white/5">
							<span class="block text-[10px] font-black tracking-[.16em] text-sky-ink/40 dark:text-white/35">{umamiConfig.stats.labels.pageviews}</span>
							<strong data-huidev-umami-pageviews aria-live="polite" class="mt-1 block text-xl font-black text-sky-ink dark:text-white">--</strong>
						</div>
						<div class="rounded-2xl border-2 border-sky-ink/10 bg-white/65 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-white/5">
							<span class="block text-[10px] font-black tracking-[.16em] text-sky-ink/40 dark:text-white/35">{umamiConfig.stats.labels.visits}</span>
							<strong data-huidev-umami-visits aria-live="polite" class="mt-1 block text-xl font-black text-sakura">--</strong>
						</div>
					</div>
				{/if}
				<div class="mt-12 flex items-center gap-4 text-xs font-bold tracking-wider text-sky-ink/45 dark:text-white/40">
					<div class="flex -space-x-2" aria-hidden="true">
						<span class="grid size-8 place-items-center rounded-full border-2 border-white bg-mizu text-white dark:border-night">✦</span>
						<span class="grid size-8 place-items-center rounded-full border-2 border-white bg-sakura text-white dark:border-night">風</span>
						<span class="grid size-8 place-items-center rounded-full border-2 border-white bg-lilac text-white dark:border-night">月</span>
					</div>
					<span>{String(posts.length).padStart(2, '0')} 篇随风生长的文字</span>
				</div>
			</div>

			<div class="relative mx-auto w-full max-w-[780px] motion-safe:animate-[appear-up_.8s_.12s_ease-out_both]">
				<div class="absolute -inset-3 rotate-2 rounded-[2rem] border-2 border-sky-ink/20 bg-mizu/25 dark:border-white/10 dark:bg-mizu/10"></div>
				<div class="anime-shadow relative overflow-hidden rounded-[1.65rem] border-2 border-sky-ink bg-sky-ink dark:border-mizu">
					<img src={profileConfig.banner} alt={profileConfig.bannerAlt} class="aspect-[3/2] w-full object-cover object-center" fetchpriority="high" />
					<div class="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-sky-ink/80 to-transparent"></div>
					<div class="absolute right-4 bottom-4 left-4 flex items-end justify-between text-white sm:right-6 sm:bottom-6 sm:left-6">
						<div>
							<p class="text-[10px] font-black tracking-[.25em] text-mizu">CHARACTER FILE · 001</p>
							<p class="mt-1 text-lg font-black sm:text-2xl">{profileConfig.name} · {profileConfig.romanizedName}</p>
						</div>
						<span class="rounded-full border border-white/40 bg-white/15 px-3 py-1.5 text-[10px] font-bold backdrop-blur">WIND CHASER</span>
					</div>
				</div>
				<div class="absolute -right-3 -top-5 rotate-6 rounded-lg border-2 border-sky-ink bg-white px-3 py-2 text-xs font-black text-sky-ink anime-shadow-sm sm:-right-5 dark:border-white dark:bg-sakura dark:text-white">NEW EPISODE!</div>
			</div>
		</section>

		<section id="articles" class="border-y-2 border-sky-ink/10 bg-white/55 py-24 backdrop-blur-sm dark:border-white/10 dark:bg-white/[.025]">
			<div class="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
				<div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p class="mb-3 text-xs font-black tracking-[.28em] text-sakura">LATEST STORIES / 最新记录</p>
						<h2 class="font-display text-4xl font-black tracking-[-.04em] text-sky-ink sm:text-6xl dark:text-white">今天读点什么？</h2>
					</div>
					<div class="no-scrollbar flex max-w-full gap-2 overflow-x-auto pb-1" aria-label="文章分类">
						{#each categories as category}
							<button
								onclick={() => (activeCategory = category)}
								class={`shrink-0 cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-bold transition hover:border-mizu ${activeCategory === category ? 'border-sky-ink bg-sky-ink text-white dark:border-mizu dark:bg-mizu dark:text-night' : 'border-sky-ink/15 bg-white text-sky-ink dark:border-white/10 dark:bg-white/5 dark:text-white'}`}
							>
								{category}
							</button>
						{/each}
					</div>
				</div>

				<div class="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
					{#each filteredArticles as article (article.title)}
						<article class="group anime-shadow flex min-h-[420px] flex-col overflow-hidden rounded-2xl border-2 border-sky-ink bg-white transition duration-300 hover:-translate-y-2 dark:border-white/20 dark:bg-[#181d3a]">
							<div class={`relative h-48 overflow-hidden bg-linear-to-br ${articleToneClasses[article.tone]}`}>
								{#if article.coverImage}<img src={article.coverImage} alt="" class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />{/if}
								<div class="absolute inset-0 bg-linear-to-t from-sky-ink/35 via-transparent to-white/5"></div>
								{#if !article.coverImage}<span class="absolute -right-5 -bottom-10 font-display text-[9rem] font-black text-white/70 transition duration-500 group-hover:scale-110 dark:text-white/10" aria-hidden="true">{article.mark}</span>{/if}
								<div class="absolute top-4 left-4 rounded-full border-2 border-sky-ink bg-white px-3 py-1 text-[10px] font-black tracking-wider text-sky-ink dark:border-white dark:bg-night dark:text-white">{article.category}</div>
								<div class="absolute right-4 bottom-4 flex gap-1" aria-hidden="true"><span class="size-2 rounded-full bg-sakura"></span><span class="size-2 rounded-full bg-mizu"></span><span class="size-2 rounded-full bg-yuzu"></span></div>
							</div>
							<div class="flex flex-1 flex-col p-6">
								<div class="flex items-center justify-between text-[11px] font-black tracking-widest text-sky-ink/45 dark:text-white/40"><span>2026.{article.date}</span><span>{article.readTime}</span></div>
								<h3 class="mt-5 text-2xl leading-snug font-black text-sky-ink dark:text-white"><a href={`/posts/${article.slug}`} class="no-underline after:absolute after:inset-0">{article.title}</a></h3>
								<p class="mt-4 text-sm leading-7 text-sky-ink/60 dark:text-white/55">{article.description}</p>
								<div class="mt-auto flex items-center justify-between pt-6 text-xs font-black text-sky-ink dark:text-mizu"><span>READ STORY</span><span class="grid size-9 place-items-center rounded-full border-2 border-current transition group-hover:rotate-45">↗</span></div>
							</div>
						</article>
					{/each}
				</div>
			</div>
		</section>

		<section id="moments" class="mx-auto grid max-w-[1440px] gap-8 px-5 py-24 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:px-12">
			<div class="flex flex-col justify-between rounded-3xl border-2 border-sky-ink bg-sky-ink p-8 text-white anime-shadow lg:p-10 dark:border-mizu dark:bg-[#1a2146]">
				<div>
					<p class="text-xs font-black tracking-[.28em] text-mizu">DAILY FRAGMENTS</p>
					<h2 class="mt-4 font-display text-5xl font-black tracking-[-.05em]">风经过的<br />小小片刻。</h2>
				</div>
				<div class="mt-14 flex items-end justify-between">
					<p class="max-w-52 text-sm leading-7 text-white/60">那些还没有长成文章，却舍不得忘记的念头。</p>
					<span class="motion-safe:animate-[float-soft_4s_ease-in-out_infinite] text-6xl text-yuzu">✦</span>
				</div>
			</div>

			<div class="grid gap-5 sm:grid-cols-2">
				{#each latestMoments as moment (moment.slug)}
					<article class={`relative overflow-hidden rounded-3xl border-2 border-sky-ink p-7 anime-shadow-sm dark:border-white/20 ${momentToneClasses[moment.tone]}`}>
						<p class="text-[10px] font-black tracking-[.2em] text-sakura">{moment.date} · {moment.time}</p>
						<div class="mt-14 font-display text-2xl leading-relaxed font-bold text-sky-ink dark:text-white"><span aria-hidden="true">“</span><div class="inline [&_p]:m-0 [&_p]:inline">{@html moment.html}</div><span aria-hidden="true">”</span></div>
						<p class="mt-10 text-xs font-bold text-sky-ink/45 dark:text-white/40"># {moment.tag}</p>
						<span class="absolute -right-4 -bottom-8 text-8xl text-sakura/10" aria-hidden="true">{moment.icon}</span>
					</article>
				{/each}
			</div>
		</section>
	</main>

	<footer id="about" class="relative z-10 border-t-2 border-sky-ink/10 bg-white/50 px-5 py-10 dark:border-white/10 dark:bg-white/[.025] sm:px-8 lg:px-12">
		<div class="mx-auto flex max-w-[1440px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-center gap-4">
				<img src={siteConfig.logo} alt="" class="size-11 rounded-xl border-2 border-sky-ink bg-white object-cover dark:border-white" />
				<div><strong class="text-base tracking-[.14em] text-sky-ink dark:text-white">{siteConfig.name}</strong><p class="mt-1 text-xs text-sky-ink/45 dark:text-white/40">{siteConfig.footer.tagline}</p></div>
			</div>
			<div class="flex flex-wrap items-center gap-6 text-xs font-bold tracking-wider text-sky-ink/45 dark:text-white/40"><span>{siteConfig.footer.copyright}</span><a href="/rss.xml" class="text-sky-ink no-underline hover:text-sakura dark:text-white">RSS</a>{#if umamiConfig.publicShare.enable && umamiConfig.publicShare.url}<a href={umamiConfig.publicShare.url} target="_blank" rel="noopener noreferrer" class="text-sky-ink no-underline hover:text-mizu dark:text-white">{umamiConfig.publicShare.label} ↗</a>{/if}<a href="#top" class="text-sky-ink no-underline hover:text-sakura dark:text-white">返回天空 ↑</a></div>
		</div>
	</footer>
</div>
