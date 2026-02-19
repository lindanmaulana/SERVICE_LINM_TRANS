import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { OauthGoogleSigninDto } from '../dto/auth-signin.dto';

export interface GoogleProfile {
	id: string;
	displayName: string;
	name: {
		familyName: string;
		givenName: string;
	};
	emails: Array<{
		value: string;
		verified: boolean;
	}>;
	photos: Array<{
		value: string;
	}>;
	provider: string;
	_json: {
		sub: string;
		name: string;
		givenName: string;
		familyName: string;
		picture: string;
		email: string;
		email_verified: boolean;
		locale: string;
	};
}

@Injectable()
export class OauthStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(private configService: ConfigService) {
		const CLIENT_ID = configService.get<string>('GOOGLE_CLIENT_ID');
		const CLIENT_SECRET = configService.get<string>('GOOGLE_CLIENT_SECRET');
		const CALLBACK_URL = configService.get<string>('GOOGLE_CALLBACK_URL');

		if (!CLIENT_ID || !CLIENT_SECRET || !CALLBACK_URL) {
			console.error('[JwtStrategy] JWT_SECRET_KEY is missing');
			throw new Error('Terjadi kesalahan sistem');
		}

		super({
			clientID: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
			callbackURL: CALLBACK_URL,
			scope: ['email', 'profile'],
		});
	}

	validate(accessToken: string, refreshToken: string, profile: GoogleProfile): OauthGoogleSigninDto {
		console.dir(profile, { depth: null });

		const { emails, photos, id: providerId, provider, displayName } = profile;

		const user = {
			email: emails[0].value,
			name: displayName,
			provider: provider,
			providerId: providerId,
			avatar: photos[0].value ?? null,
		};

		return user;
	}
}
