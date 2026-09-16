import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

// Keep the loader on Node's native ESM path; Vite's Node 26 runner currently
// inlines a CommonJS transitive dependency from `astro/loaders` incorrectly.
const loadAstroLoaders = new Function('specifier', 'return import(specifier)') as (
	specifier: string,
) => Promise<typeof import('astro/loaders')>;
const { glob } = await loadAstroLoaders('astro/loaders');

export const collections = {
	posts: defineCollection({
		loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishedAt: z.coerce.date(),
			updatedAt: z.coerce.date().optional(),
			category: z.enum(['代码魔法', '视觉研究', '异想日常']),
			tags: z.array(z.string()).default([]),
			readingTime: z.string(),
			coverTone: z.enum(['sky', 'sunset', 'mint']),
			coverMark: z.string().max(2),
			coverImage: z.string().optional(),
			featured: z.boolean().default(false),
			toc: z.boolean().default(true),
			comment: z.boolean().default(true),
			draft: z.boolean().default(false),
		}),
	}),
	moments: defineCollection({
		loader: glob({ base: './src/content/moments', pattern: '**/*.{md,mdx}' }),
		schema: z.object({
			publishedAt: z.coerce.date(),
			period: z.enum(['早晨', '黄昏', '深夜']),
			tag: z.string(),
			icon: z.string().max(2),
			tone: z.enum(['sky', 'night', 'sunset', 'mint', 'sakura', 'yuzu']),
			draft: z.boolean().default(false),
		}),
	}),
	friends: defineCollection({
		loader: glob({ base: './src/content/friends', pattern: '**/*.{md,mdx}' }),
		schema: z.object({
			name: z.string(),
			url: z.url().optional(),
			avatar: z.string().optional(),
			category: z.string(),
			mark: z.string().max(2),
			tone: z.enum(['sky', 'mint', 'sunset', 'lilac']),
			status: z.enum(['active', 'open']).default('active'),
			order: z.number().int().nonnegative().default(0),
			draft: z.boolean().default(false),
		}),
	}),
};
