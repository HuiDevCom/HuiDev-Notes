export interface ArticleConfig {
	toc: {
		enable: boolean;
		depth: 1 | 2 | 3;
	};
	previousNext: {
		enable: boolean;
	};
	cover: {
		label: string;
	};
	date: {
		locale: string;
		timeZone: string;
	};
}
