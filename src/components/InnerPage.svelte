<script lang="ts">
	import { onMount } from 'svelte';
	import { enabledNavItems, navBarConfig, profileConfig, siteConfig, umamiConfig } from '@/config';

	type Page = 'posts' | 'moments' | 'friends' | 'about';
	type Article = { slug: string; category: string; date: string; title: string; description: string; readTime: string; mark: string; tone: 'sky' | 'sunset' | 'mint'; coverImage?: string };
	type Moment = { slug: string; period: string; date: string; time: string; html: string; tag: string; icon: string; tone: 'sky' | 'night' | 'sunset' | 'mint' | 'sakura' | 'yuzu' };
	type Friend = { slug: string; name: string; url?: string; avatar?: string; category: string; mark: string; tone: 'sky' | 'mint' | 'sunset' | 'lilac'; status: 'active' | 'open'; descriptionHtml: string };

	let { page, posts = [], moments = [], friends = [] }: { page: Page; posts?: Article[]; moments?: Moment[]; friends?: Friend[] } = $props();
	const pad = (value: number) => String(value).padStart(2, '0');
	const activeFriendCount = friends.filter((friend) => friend.status === 'active').length;
	const openFriendCount = friends.length - activeFriendCount;
	const friendCountLabel = activeFriendCount
		? `${pad(activeFriendCount)} FRIENDS${openFriendCount ? ` · ${pad(openFriendCount)} OPEN` : ''}`
		: `${pad(openFriendCount)} OPEN SEATS`;
	const siteAvatarUrl = siteConfig.site
		? new URL(profileConfig.avatar, siteConfig.site).toString()
		: profileConfig.avatar;

	const pageMeta = {
		posts: { eyebrow: 'STORY ARCHIVE', title: '文章', subtitle: '沿着风的轨迹，翻阅所有故事。', count: `${pad(posts.length)} STORIES` },
		moments: { eyebrow: 'DAILY FRAGMENTS', title: '片刻', subtitle: '还没有长成文章，也舍不得忘记。', count: `${pad(moments.length)} MOMENTS` },
		friends: { eyebrow: 'DEAR FRIENDS', title: '友人帐', subtitle: '交换一小片世界，也交换彼此路过的风景。', count: friendCountLabel },
		about: { eyebrow: 'ABOUT THIS WORLD', title: '关于', subtitle: '在现实和想象之间，认真生活。', count: 'SINCE 2026' },
	}[page];

	const techStack = [
		{ name: 'Astro', version: '7', mark: 'A', role: 'CONTENT ENGINE', description: '负责内容集合、页面路由与静态构建。', tone: 'bg-[#e7f8ff] dark:bg-[#18394c]', accent: 'text-mizu' },
		{ name: 'Svelte', version: '5', mark: 'S', role: 'INTERACTION', description: '让筛选、主题与细节交互保持轻盈。', tone: 'bg-[#fff0e8] dark:bg-[#4a3028]', accent: 'text-[#ff7043]' },
		{ name: 'Tailwind', version: '4', mark: 'T', role: 'VISUAL SYSTEM', description: '组织色彩、间距与响应式视觉语言。', tone: 'bg-[#e8f9f6] dark:bg-[#1d413d]', accent: 'text-[#20b9ab]' },
		{ name: 'With love', version: '♡', mark: '愛', role: 'SITE SPIRIT', description: '最后一点无法写进配置文件的温度。', tone: 'bg-[#fff0f6] dark:bg-[#48283b]', accent: 'text-sakura' },
	];
	const interestTones = [
		'bg-[#e6f8ff] dark:bg-[#19374a]',
		'bg-[#fff0f6] dark:bg-[#45283c]',
		'bg-[#fff8d8] dark:bg-[#494021]',
	];

	const categories = ['全部', '代码魔法', '视觉研究', '异想日常'];
	const periods = ['全部', '早晨', '黄昏', '深夜'];
	const toneClasses = {
		sky: 'from-[#b9efff] to-[#d9d4ff] dark:from-[#1a4053] dark:to-[#312a62]',
		sunset: 'from-[#ffe0ed] to-[#ffe9ba] dark:from-[#4c2643] dark:to-[#4a3824]',
		mint: 'from-[#d5f7e4] to-[#fff3af] dark:from-[#1e453c] dark:to-[#484022]',
	};
	const momentToneClasses = {
		sky: 'bg-[#e6f8ff] dark:bg-[#19374a]',
		night: 'bg-[#efeaff] dark:bg-[#302b54]',
		sunset: 'bg-[#fff0e6] dark:bg-[#4b332d]',
		mint: 'bg-[#e9fff4] dark:bg-[#1d4038]',
		sakura: 'bg-[#ffe9f2] dark:bg-[#45283c]',
		yuzu: 'bg-[#fff8d8] dark:bg-[#494021]',
	};
	const friendToneClasses = {
		sky: 'from-[#c8efff] to-[#dcd7ff] dark:from-[#193d55] dark:to-[#302b57]',
		mint: 'from-[#d8f7e8] to-[#cfeeff] dark:from-[#20483d] dark:to-[#1e3b50]',
		sunset: 'from-[#fff0cb] to-[#ffdfea] dark:from-[#4b3d22] dark:to-[#492a3c]',
		lilac: 'from-[#f0e8ff] to-[#ffdfe9] dark:from-[#392d58] dark:to-[#492a3c]',
	};

	let darkMode = $state(false);
	let mobileOpen = $state(false);
	let activeCategory = $state('全部');
	let activePeriod = $state('全部');
	let query = $state('');
	let filteredArticles = $derived(posts.filter((article) =>
		(activeCategory === '全部' || article.category === activeCategory) &&
		(article.title.toLowerCase().includes(query.toLowerCase()) || article.description.toLowerCase().includes(query.toLowerCase())),
	));
	let filteredMoments = $derived(moments.filter((moment) => activePeriod === '全部' || moment.period === activePeriod));

	onMount(() => { darkMode = document.documentElement.classList.contains('dark'); });

	function toggleTheme() {
		darkMode = !darkMode;
		document.documentElement.classList.toggle('dark', darkMode);
		localStorage.setItem(siteConfig.theme.storageKey, darkMode ? 'dark' : 'light');
	}
</script>

<svelte:window onkeydown={(event: KeyboardEvent) => event.key === 'Escape' && (mobileOpen = false)} />

<div class="relative min-h-screen overflow-hidden bg-[#eef8ff] text-night transition-colors duration-500 dark:bg-night dark:text-white">
	<div aria-hidden="true" class="pointer-events-none fixed inset-0 overflow-hidden">
		<div class="absolute -left-48 top-20 size-[34rem] rounded-full bg-mizu/15 blur-3xl dark:bg-mizu/8"></div>
		<div class="absolute -right-48 top-[32rem] size-[38rem] rounded-full bg-sakura/10 blur-3xl dark:bg-sakura/8"></div>
		<div class="absolute inset-0 opacity-[.22] dark:opacity-[.07]" style="background-image: linear-gradient(rgba(35,55,99,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(35,55,99,.13) 1px, transparent 1px); background-size: 48px 48px;"></div>
	</div>

	<header class="relative z-50 px-4 pt-4 sm:px-6 lg:px-10">
		<div class="mx-auto flex h-17 max-w-[1440px] items-center justify-between rounded-2xl border-2 border-sky-ink/15 bg-white/80 px-4 shadow-[0_10px_40px_rgba(35,55,99,.08)] backdrop-blur-xl sm:px-6 dark:border-white/10 dark:bg-[#171c38]/85">
			<a href="/" class="group flex items-center gap-3 no-underline" aria-label={`${siteConfig.name}首页`}>
				<img src={siteConfig.logo} alt={siteConfig.logoAlt} class="anime-shadow-sm size-10 rotate-[-4deg] rounded-xl border-2 border-sky-ink bg-white object-cover transition-transform group-hover:rotate-3 dark:border-white" />
				<span><strong class="block text-base leading-tight tracking-[.16em] text-sky-ink dark:text-white">{siteConfig.name}</strong><small class="block text-[9px] font-bold tracking-[.23em] text-sky-ink/45 dark:text-white/45">{siteConfig.englishName}</small></span>
			</a>
			{#if navBarConfig.enable}
			<nav class="hidden items-center gap-1 rounded-full border border-sky-ink/10 bg-white/55 p-1 text-sm font-bold text-sky-ink/65 md:flex dark:border-white/10 dark:bg-white/5 dark:text-white/65" aria-label={navBarConfig.ariaLabel}>
				{#each enabledNavItems as item (item.key)}
					<a href={item.href} aria-current={page === item.key ? 'page' : undefined} class={`rounded-full px-5 py-2 no-underline transition ${page === item.key ? 'bg-sky-ink text-white shadow-sm dark:bg-mizu dark:text-night' : 'hover:bg-mizu/15 hover:text-sky-ink dark:hover:text-white'}`}>{item.label}</a>
				{/each}
			</nav>
			{/if}
			<div class="flex items-center gap-2">
				<button onclick={toggleTheme} class="grid size-10 cursor-pointer place-items-center rounded-full border-2 border-sky-ink/15 bg-white text-sky-ink transition hover:border-mizu dark:border-white/15 dark:bg-white/5 dark:text-white" aria-label={darkMode ? '切换至浅色主题' : '切换至深色主题'}>
					{#if darkMode}<span class="text-lg">☀</span>{:else}<span class="text-lg">☾</span>{/if}
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
					<a onclick={() => (mobileOpen = false)} href={item.href} target={item.external ? '_blank' : undefined} aria-current={page === item.key ? 'page' : undefined} class={`rounded-xl px-4 py-3 no-underline hover:bg-mizu/15 ${page === item.key ? 'bg-mizu/15' : ''}`}>{item.label}</a>
				{/each}
			</nav>
		{/if}
	</header>

	<main class="relative z-10">
		<section class="mx-auto max-w-[1440px] px-5 pt-20 pb-14 sm:px-8 lg:px-12 lg:pt-28">
			<div class="flex flex-col gap-8 border-b-2 border-sky-ink/15 pb-14 lg:flex-row lg:items-end lg:justify-between dark:border-white/10">
				<div>
					<a href="/" class="mb-8 inline-flex items-center gap-2 text-xs font-black tracking-widest text-sky-ink/45 no-underline transition hover:text-sakura dark:text-white/40">← BACK TO HOME</a>
					<p class="mb-3 text-xs font-black tracking-[.3em] text-sakura">{pageMeta.eyebrow}</p>
					<h1 class="font-display text-[clamp(4rem,9vw,8rem)] leading-none font-black tracking-[-.08em] text-sky-ink dark:text-white">{pageMeta.title}<span class="text-mizu">。</span></h1>
					<p class="mt-6 text-base font-medium text-sky-ink/55 sm:text-lg dark:text-white/50">{pageMeta.subtitle}</p>
				</div>
				<div class="flex items-center gap-3 self-start rounded-full border-2 border-sky-ink bg-yuzu px-5 py-2 text-xs font-black tracking-[.18em] text-sky-ink anime-shadow-sm lg:self-auto dark:border-white">{pageMeta.count}<span class="size-2 animate-pulse rounded-full bg-sakura"></span></div>
			</div>
		</section>

		{#if page === 'posts'}
			<section class="mx-auto max-w-[1440px] px-5 pb-28 sm:px-8 lg:px-12">
				<div class="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
					<div class="no-scrollbar flex gap-2 overflow-x-auto pb-1">
						{#each categories as category}
							<button onclick={() => (activeCategory = category)} class={`shrink-0 cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-bold transition ${activeCategory === category ? 'border-sky-ink bg-sky-ink text-white dark:border-mizu dark:bg-mizu dark:text-night' : 'border-sky-ink/15 bg-white text-sky-ink hover:border-mizu dark:border-white/10 dark:bg-white/5 dark:text-white'}`}>{category}</button>
						{/each}
					</div>
					<label class="flex w-full items-center gap-3 rounded-xl border-2 border-sky-ink/15 bg-white px-4 py-3 text-sky-ink lg:w-80 dark:border-white/10 dark:bg-white/5 dark:text-white">
						<svg class="size-5 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>
						<span class="sr-only">搜索文章</span><input bind:value={query} type="search" placeholder="搜索标题或内容…" class="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-sky-ink/35 dark:placeholder:text-white/30" />
					</label>
				</div>

				{#if filteredArticles.length}
					<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
						{#each filteredArticles as article (article.title)}
							<article class="group anime-shadow relative flex min-h-[390px] flex-col overflow-hidden rounded-2xl border-2 border-sky-ink bg-white transition duration-300 hover:-translate-y-2 dark:border-white/20 dark:bg-[#181d3a]">
								<div class={`relative h-44 overflow-hidden bg-linear-to-br ${toneClasses[article.tone]}`}>
									{#if article.coverImage}<img src={article.coverImage} alt="" class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />{/if}
									<div class="absolute inset-0 bg-linear-to-t from-sky-ink/35 via-transparent to-white/5"></div>
									{#if !article.coverImage}<span class="absolute -right-5 -bottom-10 font-display text-[9rem] font-black text-white/70 transition duration-500 group-hover:scale-110 dark:text-white/10">{article.mark}</span>{/if}
									<span class="absolute top-4 left-4 rounded-full border-2 border-sky-ink bg-white px-3 py-1 text-[10px] font-black text-sky-ink dark:border-white dark:bg-night dark:text-white">{article.category}</span>
								</div>
								<div class="flex flex-1 flex-col p-6"><div class="flex justify-between text-[10px] font-black tracking-widest text-sky-ink/40 dark:text-white/35"><span>{article.date}</span><span>{article.readTime}</span></div><h2 class="mt-5 text-2xl leading-snug font-black text-sky-ink dark:text-white">{article.title}</h2><p class="mt-3 text-sm leading-7 text-sky-ink/55 dark:text-white/50">{article.description}</p><a href={`/posts/${article.slug}`} class="mt-auto flex items-center justify-between pt-6 text-xs font-black text-sky-ink no-underline dark:text-mizu"><span>READ STORY</span><span class="grid size-9 place-items-center rounded-full border-2 border-current transition group-hover:rotate-45">↗</span></a></div>
							</article>
						{/each}
					</div>
				{:else}
					<div class="rounded-3xl border-2 border-dashed border-sky-ink/20 py-24 text-center dark:border-white/15"><p class="text-5xl">☁</p><h2 class="mt-5 text-xl font-black">风没有带来匹配的文章</h2><p class="mt-2 text-sm text-sky-ink/45 dark:text-white/40">换个关键词再试试看。</p></div>
				{/if}
			</section>
		{:else if page === 'moments'}
			<section class="mx-auto max-w-[1440px] px-5 pb-28 sm:px-8 lg:px-12">
				<div class="mb-10 flex gap-2 overflow-x-auto pb-1">
					{#each periods as period}
						<button onclick={() => (activePeriod = period)} class={`shrink-0 cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-bold transition ${activePeriod === period ? 'border-sky-ink bg-sky-ink text-white dark:border-mizu dark:bg-mizu dark:text-night' : 'border-sky-ink/15 bg-white text-sky-ink hover:border-sakura dark:border-white/10 dark:bg-white/5 dark:text-white'}`}>{period}</button>
					{/each}
				</div>
				<div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{#each filteredMoments as moment (moment.slug)}
						<article class={`group anime-shadow-sm relative flex min-h-[300px] flex-col overflow-hidden rounded-3xl border-2 border-sky-ink p-7 transition hover:-translate-y-1 dark:border-white/20 ${momentToneClasses[moment.tone]}`}>
							<div class="flex items-start justify-between"><p class="text-[10px] font-black tracking-[.2em] text-sky-ink/45 dark:text-white/40">{moment.date} · {moment.time}</p><span class="text-3xl text-sakura transition group-hover:rotate-12">{moment.icon}</span></div>
							<div class="my-auto font-display text-2xl leading-relaxed font-bold text-sky-ink dark:text-white"><span aria-hidden="true">“</span><div class="inline [&_p]:m-0 [&_p]:inline">{@html moment.html}</div><span aria-hidden="true">”</span></div>
							<div class="flex items-center justify-between text-xs font-bold text-sky-ink/45 dark:text-white/40"><span># {moment.tag}</span><span>{moment.period}</span></div>
						</article>
					{/each}
				</div>
			</section>
		{:else if page === 'friends'}
			<section class="mx-auto max-w-[1440px] px-5 pb-28 sm:px-8 lg:px-12">
				<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
					{#each friends as friend (friend.slug)}
						<article class={`group anime-shadow-sm relative isolate flex h-52 overflow-hidden rounded-3xl border-2 border-sky-ink bg-linear-to-br p-5 text-sky-ink transition duration-300 hover:-translate-y-2 dark:border-white/25 ${friend.status === 'open' ? 'border-dashed hover:border-solid' : ''} ${friendToneClasses[friend.tone]}`}>
							<div class="absolute -right-10 -top-12 -z-10 size-36 rounded-full border-[18px] border-white/25 transition duration-500 group-hover:scale-110 dark:border-white/5"></div>
							<span class="absolute right-5 bottom-0 -z-10 font-display text-[7.5rem] leading-none font-black text-white/55 transition duration-500 group-hover:rotate-6 group-hover:scale-110 dark:text-white/8">{friend.mark}</span>
							{#if friend.url}<a href={friend.url} target="_blank" rel="noopener noreferrer" class="absolute inset-0 z-20" aria-label={`访问 ${friend.name}`}></a>{/if}
							<div class="relative z-10 flex w-full flex-col justify-between">
								<div class="flex items-start justify-between gap-3">
									<span class="rounded-full border-2 border-sky-ink bg-white/80 px-3 py-1 text-[9px] font-black tracking-[.18em] text-sky-ink shadow-sm backdrop-blur-md dark:border-white dark:bg-night/70 dark:text-white">{friend.status === 'active' ? 'FRIEND LINK' : 'OPEN SEAT'}</span>
									{#if friend.avatar}<img src={friend.avatar} alt="" class="size-12 rounded-2xl border-2 border-sky-ink bg-white object-cover shadow-sm transition duration-300 group-hover:-rotate-3 group-hover:scale-105 dark:border-white" loading="lazy" referrerpolicy="no-referrer" />{/if}
								</div>
								<div>
									<p class="mb-1 text-[9px] font-black tracking-[.2em] text-sky-ink/40 dark:text-white/35">{friend.category}</p>
									<h2 class="flex items-center gap-2 font-display text-2xl font-black text-sky-ink dark:text-white">{friend.name}{#if friend.url}<span class="text-sm text-sakura transition group-hover:rotate-45">↗</span>{/if}</h2>
									<div class="mt-1 line-clamp-2 text-xs leading-5 text-sky-ink/60 [&_p]:m-0 dark:text-white/55">{@html friend.descriptionHtml}</div>
								</div>
							</div>
						</article>
					{/each}
				</div>

				<div id="exchange" class="mt-20 grid gap-7 lg:grid-cols-[1.1fr_.9fr]">
					<div class="anime-shadow rounded-3xl border-2 border-sky-ink bg-white p-7 dark:border-white/20 dark:bg-[#181d3a] sm:p-10">
						<p class="text-xs font-black tracking-[.25em] text-sakura">LINK EXCHANGE</p>
						<h2 class="mt-4 font-display text-3xl font-black text-sky-ink sm:text-5xl dark:text-white">来交换一张通往彼此世界的车票。</h2>
						<p class="mt-6 max-w-2xl text-base leading-8 text-sky-ink/55 dark:text-white/50">如果你也在认真维护自己的小站，欢迎交换友链。希望网站可以正常访问，内容以原创为主，并且不是纯商业或采集站点。</p>
						<div class="mt-9 grid gap-4 sm:grid-cols-3">
							<div class="rounded-2xl bg-[#e8f8ff] p-5 dark:bg-[#19374a]"><span class="text-xs font-black text-mizu">01</span><h3 class="mt-5 font-black">先认识</h3><p class="mt-2 text-xs leading-6 text-sky-ink/50 dark:text-white/45">逛一逛彼此的网站。</p></div>
							<div class="rounded-2xl bg-[#fff0f6] p-5 dark:bg-[#45283c]"><span class="text-xs font-black text-sakura">02</span><h3 class="mt-5 font-black">加链接</h3><p class="mt-2 text-xs leading-6 text-sky-ink/50 dark:text-white/45">先放好本站友链信息。</p></div>
							<div class="rounded-2xl bg-[#fff8d8] p-5 dark:bg-[#494021]"><span class="text-xs font-black text-[#d69d0b]">03</span><h3 class="mt-5 font-black">来敲门</h3><p class="mt-2 text-xs leading-6 text-sky-ink/50 dark:text-white/45">留下名称、地址和简介。</p></div>
						</div>
					</div>

					<aside class="anime-shadow relative overflow-hidden rounded-3xl border-2 border-sky-ink bg-sky-ink p-7 text-white dark:border-mizu sm:p-9">
						<div aria-hidden="true" class="absolute -right-10 -bottom-20 font-display text-[13rem] font-black text-white/5">{siteConfig.shortName}</div>
						<p class="text-xs font-black tracking-[.25em] text-mizu">MY SITE CARD</p>
						<div class="mt-8 flex items-center gap-4 border-b border-white/15 pb-7">
							<img src={profileConfig.avatar} alt={profileConfig.avatarAlt} class="size-16 shrink-0 rotate-[-4deg] rounded-2xl border-2 border-white bg-white object-cover anime-shadow-sm" />
							<div><h2 class="text-2xl font-black">{siteConfig.name}</h2><p class="mt-1 text-xs tracking-[.18em] text-white/50">{siteConfig.englishName}</p></div>
						</div>
						<dl class="relative mt-7 space-y-5 text-sm">
							<div><dt class="text-[10px] font-black tracking-[.2em] text-mizu">NAME</dt><dd class="mt-1 font-bold">{siteConfig.name}</dd></div>
							<div><dt class="text-[10px] font-black tracking-[.2em] text-mizu">URL</dt><dd class="mt-1 font-bold">{siteConfig.site || '请在 siteConfig 中配置'}</dd></div>
							<div><dt class="text-[10px] font-black tracking-[.2em] text-mizu">DESCRIPTION</dt><dd class="mt-1 leading-7 text-white/70">{siteConfig.description}</dd></div>
							<div><dt class="text-[10px] font-black tracking-[.2em] text-mizu">AVATAR</dt><dd class="mt-1 break-all font-bold">{siteAvatarUrl}</dd></div>
						</dl>
					</aside>
				</div>
			</section>
		{:else}
			<section class="mx-auto max-w-[1440px] px-5 pb-28 sm:px-8 lg:px-12">
				<div class="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
					<div class="anime-shadow relative overflow-hidden rounded-3xl border-2 border-sky-ink bg-sky-ink dark:border-mizu">
						<img src={profileConfig.aboutImage} alt={profileConfig.aboutImageAlt} class="aspect-[4/5] h-full w-full object-cover object-[70%_center]" />
						<div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-sky-ink/90 to-transparent p-7 pt-24 text-white"><p class="text-[10px] font-black tracking-[.25em] text-mizu">{profileConfig.role}</p><p class="mt-2 text-2xl font-black">{profileConfig.name} · {profileConfig.romanizedName}</p></div>
					</div>
					<div class="flex flex-col gap-6">
						<div class="rounded-3xl border-2 border-sky-ink bg-white p-8 anime-shadow dark:border-white/20 dark:bg-[#181d3a] sm:p-10">
							<p class="text-xs font-black tracking-[.25em] text-sakura">HELLO, WORLD!</p>
							<h2 class="mt-4 font-display text-3xl leading-snug font-black text-sky-ink sm:text-5xl dark:text-white">{profileConfig.headline}</h2>
							<p class="mt-6 border-l-4 border-sakura pl-4 font-display text-lg font-bold text-sky-ink/70 dark:text-white/65">“{profileConfig.signature}”</p>
							<div class="mt-7 space-y-5 text-base leading-8 text-sky-ink/60 dark:text-white/55">{#each profileConfig.bio as paragraph}<p>{paragraph}</p>{/each}</div>
						</div>
						<div class="grid gap-5 sm:grid-cols-3">
							{#each profileConfig.interests as interest, index (interest.title)}
								<div class={`rounded-2xl border-2 border-sky-ink p-5 anime-shadow-sm dark:border-white/20 ${interestTones[index % interestTones.length]}`}><span class="text-3xl">{interest.icon}</span><h3 class="mt-8 font-black">{interest.title}</h3><p class="mt-2 whitespace-pre-line text-xs leading-6 text-sky-ink/50 dark:text-white/45">{interest.description}</p></div>
							{/each}
						</div>
					</div>
				</div>

				<div class="mt-16 border-t-2 border-sky-ink/15 pt-12 dark:border-white/10">
					<div class="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p class="text-xs font-black tracking-[.25em] text-mizu">BEHIND THE SCENES</p>
							<h2 class="mt-4 font-display text-3xl font-black text-sky-ink sm:text-4xl dark:text-white">让技术保持锋利，<br />让表达仍有温度。</h2>
						</div>
						<p class="max-w-md text-sm leading-7 text-sky-ink/50 sm:text-right dark:text-white/45">这座小站的四块基石。它们决定页面如何生长，也决定故事以什么样子与你相遇。</p>
					</div>
					<div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
						{#each techStack as tech, index (tech.name)}
							<article class={`group anime-shadow-sm relative min-h-[245px] overflow-hidden rounded-3xl border-2 border-sky-ink p-6 transition duration-300 hover:-translate-y-2 dark:border-white/20 ${tech.tone}`}>
								<span class={`absolute -right-3 -bottom-8 font-display text-[8.5rem] leading-none font-black opacity-10 transition duration-500 group-hover:rotate-6 group-hover:scale-110 ${tech.accent}`}>{tech.mark}</span>
								<div class="relative flex h-full flex-col">
									<div class="flex items-start justify-between">
										<span class={`grid size-12 place-items-center rounded-2xl border-2 border-sky-ink bg-white font-display text-xl font-black anime-shadow-sm dark:border-white dark:bg-night ${tech.accent}`}>{tech.mark}</span>
										<span class="text-[10px] font-black tracking-[.2em] text-sky-ink/35 dark:text-white/35">0{index + 1}</span>
									</div>
									<div class="mt-auto pt-10">
										<p class={`text-[9px] font-black tracking-[.2em] ${tech.accent}`}>{tech.role}</p>
										<h3 class="mt-2 flex items-baseline gap-2 text-2xl font-black text-sky-ink dark:text-white"><span>{tech.name}</span><span class="font-display text-4xl">{tech.version}</span></h3>
										<p class="mt-3 text-xs leading-6 text-sky-ink/50 dark:text-white/45">{tech.description}</p>
									</div>
								</div>
							</article>
						{/each}
					</div>
				</div>
			</section>
		{/if}
	</main>

	<footer class="relative z-10 border-t-2 border-sky-ink/10 bg-white/50 px-5 py-10 dark:border-white/10 dark:bg-white/[.025] sm:px-8 lg:px-12">
		<div class="mx-auto flex max-w-[1440px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between"><div class="flex items-center gap-4"><img src={siteConfig.logo} alt="" class="size-11 rounded-xl border-2 border-sky-ink bg-white object-cover dark:border-white" /><div><strong class="text-base tracking-[.14em] text-sky-ink dark:text-white">{siteConfig.name}</strong><p class="mt-1 text-xs text-sky-ink/45 dark:text-white/40">{siteConfig.footer.tagline}</p></div></div><div class="flex items-center gap-6 text-xs font-bold tracking-wider text-sky-ink/45 dark:text-white/40"><span>{siteConfig.footer.copyright}</span>{#if umamiConfig.publicShare.enable && umamiConfig.publicShare.url}<a href={umamiConfig.publicShare.url} target="_blank" rel="noopener noreferrer" class="text-sky-ink no-underline hover:text-mizu dark:text-white">{umamiConfig.publicShare.label} ↗</a>{/if}<a href="/" class="text-sky-ink no-underline hover:text-sakura dark:text-white">返回首页 ↑</a></div></div>
	</footer>
</div>
