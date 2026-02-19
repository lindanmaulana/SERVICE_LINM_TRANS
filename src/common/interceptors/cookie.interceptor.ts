import {
	CallHandler,
	ExecutionContext,
	Injectable,
	InternalServerErrorException,
	NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable, tap } from 'rxjs';
import { COOKIE_NAME_KEY } from '../decorators/cookie-name.decorator';

@Injectable()
export class CookieInterceptor implements NestInterceptor {
	constructor(
		private reflector: Reflector,
		private configService: ConfigService,
	) {}

	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const res = context.switchToHttp().getResponse<Response>();

		const COOKIE_NAME = this.reflector.getAllAndOverride<string | undefined>(COOKIE_NAME_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!COOKIE_NAME) {
			console.error('Cookie name not configuration');
			throw new InternalServerErrorException('Terjadi kesalahan pada sistem, please try again later!');
		}

		const COOKIE_MAX_AGE_ACCESS_TOKEN = this.configService.get<number>('COOKIE_MAX_AGE_ACCESS_TOKEN');

		return next.handle().pipe(
			tap((data: Record<string, unknown>) => {
				const cookieValue = data[COOKIE_NAME];

				if (!cookieValue || typeof cookieValue !== 'string') {
					console.error('Cookie name invalid type', cookieValue);
					throw new InternalServerErrorException('Terjadi kesalahan pada sistem, please try again later!');
				}

				res.cookie(COOKIE_NAME, cookieValue, {
					httpOnly: false,
					maxAge: COOKIE_MAX_AGE_ACCESS_TOKEN,
				});
			}),
		);
	}
}
