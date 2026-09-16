import type { APIRoute } from 'astro';
import { siteConfig } from '@/config';

export const GET: APIRoute = ({ site }) => {
	const base = site ?? new URL(siteConfig.site);
	const sitemap = new URL('sitemap-index.xml', base).toString();

	return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
