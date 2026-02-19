import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { OauthGooglePayload } from '@/common/interfaces/oauth-google-payload.interface';

declare module 'express' {
	interface Request {
		user: JwtPayload | OauthGooglePayload;
	}
}

export {};
