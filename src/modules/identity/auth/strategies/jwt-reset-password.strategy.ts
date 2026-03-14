import { JwtTypeToken } from '@/common/const/jwt-token-type.const';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(Strategy, 'jwt-reset') {
	constructor(private configService: ConfigService) {
		const jwtResetPasswordKey = configService.get<string>('jwt.resetSecretKey');

		if (!jwtResetPasswordKey) {
			console.error('[JwtResetPasswordStrategy] JWT_RESET_PASSWORD_KEY is missing configuration');
			throw new InternalServerErrorException('Terjadi kesalahan pada sistem.');
		}

		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => (req?.cookies?.reset_password_token as string) || null,
			]),
			ignoreExpiration: false,
			secretOrKey: jwtResetPasswordKey,
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
