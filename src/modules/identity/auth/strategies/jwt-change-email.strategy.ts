import { Cookies } from '@/common/enums/cookies.enum';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtChangeEmailStrategy extends PassportStrategy(Strategy, 'jwt-change-email') {
	constructor(private configService: ConfigService) {
		const changeEmailKey = configService.get<string>('jwt.changeEmailSecretKey');

		if (!changeEmailKey) {
			console.error('[JwtChangeEmailStrategy] JWT_CHANGE_EMAIL_KEY is missing configuration');
			throw new InternalServerErrorException('Terjadi kesalahan pada sistem.');
		}

		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => (req?.cookies?.[Cookies.CHANGE_EMAIL_TOKEN] as string) || null,
			]),
			ignoreExpiration: false,
			secretOrKey: changeEmailKey,
		});
	}

	validate(payload: JwtPayload): JwtPayload {
		return {
			id: payload.id,
			email: payload.email,
			name: payload.name,
			role: payload.role,
			status: payload.status,
			type: payload.type,
		};
	}
}
