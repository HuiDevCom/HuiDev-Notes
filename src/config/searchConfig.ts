import type { SearchConfig } from '../types/searchConfig';

/** Pagefind 全文搜索配置；索引在生产构建完成后生成。 */
export const searchConfig = {
	enable: true,
	indexPostsOnly: true,
	maxResults: 12,
	placeholder: '搜索文章标题、标签或正文…',
	emptyText: '没有找到随风而来的结果。',
} as const satisfies SearchConfig;
