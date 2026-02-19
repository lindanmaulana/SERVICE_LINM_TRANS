export interface OauthGooglePayload {
	email: string;
	name: string;
	provider: 'google';
	providerId: string;
	avatar: string | null;
}
