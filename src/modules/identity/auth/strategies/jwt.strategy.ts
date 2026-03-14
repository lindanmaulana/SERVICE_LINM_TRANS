import { JwtTypeToken } from '@/common/const/jwt-token-type.const';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private configService: ConfigService) {
		const jwtSecretKey = configService.get<string>('jwt.secretKey');

		if (!jwtSecretKey) {
			console.error('[JwtStrategy] JWT_SECRET_KEY is missing');
			throw new Error('Terjadi kesalahan sistem');
		}

		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => (req?.cookies?.access_token as string) || null,
			]),
			ignoreExpiration: false,
			secretOrKey: jwtSecretKey,
		});
	}

	validate(payload: JwtPayload): JwtPayload {
		if (payload.type !== JwtTypeToken.ACCESS_TOKEN) {
			console.error('[JwtResetPasswordStrategy] invalid token type');
			throw new UnauthorizedException('Terjadi kesalahan pada sistem');
		}

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
