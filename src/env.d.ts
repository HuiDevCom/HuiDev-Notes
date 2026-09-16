/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly PUBLIC_SITE_URL?: string;
	readonly PUBLIC_TWIKOO_ENV_ID?: string;
	readonly PUBLIC_TWIKOO_REGION?: string;
	readonly PUBLIC_TWIKOO_CDN_URL?: string;
	readonly PUBLIC_UMAMI_WEBSITE_ID?: string;
	readonly PUBLIC_UMAMI_SCRIPT_URL?: string;
	readonly PUBLIC_UMAMI_HOST_URL?: string;
	readonly PUBLIC_UMAMI_DOMAINS?: string;
	readonly PUBLIC_UMAMI_SHARE_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
