export interface UmamiConfig {
	enable: boolean;
	websiteId: string;
	scriptUrl: string;
	hostUrl: string;
	domains: string;
	publicShare: {
		enable: boolean;
		url: string;
		label: string;
	};
	stats: {
		enable: boolean;
		showOnHome: boolean;
		showOnPosts: boolean;
		compactNumbers: boolean;
		labels: {
			pageviews: string;
			visits: string;
		};
	};
	options: {
		respectDoNotTrack: boolean;
		excludeSearch: boolean;
		excludeHash: boolean;
	};
}
