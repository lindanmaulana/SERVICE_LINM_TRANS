import { JwtTypeToken } from "../const/jwt-token-type.const";

export interface OauthGooglePayload {
	email: string;
	name: string;
	provider: 'google';
	providerId: string;
	avatar: string | null;
	type: JwtTypeToken
}
