import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

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

	async validate(accessToken: string, refreshToken: string, profile: unknown): Promise<unknown> {}
}
