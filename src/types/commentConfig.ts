export interface TwikooConfig {
	envId: string;
	region: string;
	scriptUrl: string;
	language: string;
}

export interface CommentConfig {
	enable: boolean;
	provider: 'twikoo';
	lazyLoad: boolean;
	lazyLoadMargin: string;
	showDevSetupHint: boolean;
	heading: string;
	label: string;
	twikoo: TwikooConfig;
}
