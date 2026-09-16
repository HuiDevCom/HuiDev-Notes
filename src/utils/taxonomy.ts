import type { CollectionEntry } from 'astro:content';
import { siteConfig } from '@/config';

export type PublishedPost = CollectionEntry<'posts'>;

export interface PostCardData {
	slug: string;
	title: string;
	description: string;
	category: string;
	tags: string[];
	date: string;
	readingTime: string;
	coverImage?: string;
	coverMark: string;
	coverTone: 'sky' | 'sunset' | 'mint';
}

const dateFormatter = new Intl.DateTimeFormat('sv-SE', {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	timeZone: siteConfig.timeZone,
});

export const sortPosts = (posts: PublishedPost[]) =>
	[...posts].sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());

export const toPostCard = (post: PublishedPost): PostCardData => ({
	slug: post.id,
	title: post.data.title,
	description: post.data.description,
	category: post.data.category,
	tags: [...post.data.tags],
	date: dateFormatter.format(post.data.publishedAt),
	readingTime: post.data.readingTime,
	coverImage: post.data.coverImage,
	coverMark: post.data.coverMark,
	coverTone: post.data.coverTone,
});

export const toTaxonomySlug = (value: string) => value
	.normalize('NFKC')
	.trim()
	.toLocaleLowerCase('zh-CN')
	.replace(/\s+/g, '-')
	.replace(/[^\p{Letter}\p{Number}-]+/gu, '')
	.replace(/-+/g, '-')
	.replace(/^-|-$/g, '');

export const collectTerms = (posts: PublishedPost[], select: (post: PublishedPost) => readonly string[]) => {
	const terms = new Map<string, PublishedPost[]>();
	for (const post of posts) {
		for (const term of select(post)) {
			const items = terms.get(term) ?? [];
			items.push(post);
			terms.set(term, items);
		}
	}
	return [...terms.entries()].sort(([a], [b]) => a.localeCompare(b, siteConfig.language));
};

export const scoreRelatedPosts = (current: PublishedPost, candidates: PublishedPost[]) => candidates
	.filter((candidate) => candidate.id !== current.id)
	.map((candidate) => {
		const commonTags = candidate.data.tags.filter((tag) => current.data.tags.includes(tag)).length;
		const sameCategory = candidate.data.category === current.data.category ? 2 : 0;
		return { post: candidate, score: commonTags * 3 + sameCategory };
	})
	.sort((a, b) => b.score - a.score || b.post.data.publishedAt.valueOf() - a.post.data.publishedAt.valueOf())
	.map(({ post }) => post);
