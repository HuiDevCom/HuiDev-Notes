import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '@/config';
import { sortPosts } from '@/utils/taxonomy';

export async function GET(context: { site?: URL }) {
	const posts = sortPosts(await getCollection('posts', ({ data }) => !data.draft));

	return rss({
		title: siteConfig.name,
		description: siteConfig.description,
		site: context.site ?? new URL(siteConfig.site),
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.publishedAt,
			link: `/posts/${post.id}`,
			categories: [post.data.category, ...post.data.tags],
		})),
		customData: `<language>${siteConfig.language}</language>`,
	});
}
