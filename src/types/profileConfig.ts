export interface ProfileInterest {
	icon: string;
	title: string;
	description: string;
}

export interface SocialLink {
	label: string;
	href: string;
	icon?: string;
}

export interface ProfileConfig {
	name: string;
	romanizedName: string;
	role: string;
	avatar: string;
	avatarAlt: string;
	banner: string;
	bannerAlt: string;
	aboutImage: string;
	aboutImageAlt: string;
	signature: string;
	headline: string;
	bio: readonly string[];
	interests: readonly ProfileInterest[];
	socialLinks: readonly SocialLink[];
}
