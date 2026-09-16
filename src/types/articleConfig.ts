export interface ArticleConfig {
	toc: {
		enable: boolean;
		depth: 1 | 2 | 3;
	};
	previousNext: {
		enable: boolean;
	};
	readingProgress: {
		enable: boolean;
	};
	relatedPosts: {
		enable: boolean;
		limit: number;
	};
	share: {
		enable: boolean;
		copyLink: boolean;
		nativeShare: boolean;
	};
	cover: {
		label: string;
	};
	date: {
		locale: string;
		timeZone: string;
	};
}
