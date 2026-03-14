import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { OauthGooglePayload } from '../interfaces/oauth-google-payload.interface';
import { JwtTypeToken } from '../const/jwt-token-type.const';

interface PassportInfo {
	message?: string;
}

@Injectable()
export class JwtResetPasswordGuard extends AuthGuard('jwt-reset') {
	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		return super.canActivate(context);
	}

	handleRequest<TUser = any>(err: any, user: TUser, info: PassportInfo, context: ExecutionContext): TUser {
		if (err || !user) {
			const details = info?.message || 'No details';

			throw err || new UnauthorizedException(`Authentication failed: ${details}`);
		}

		if (user['type'] !== JwtTypeToken.RESET_PASSWORD)
			throw new UnauthorizedException('Sesi tidak valid atau telah berakhir!');

		return user;
	}
}
