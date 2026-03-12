import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

interface StandardPayload {
	data?: unknown;
	user?: unknown;
	meta?: unknown;
	access_token?: string;
}

interface SigninPayload {
	user?: unknown;
	access_token?: unknown;
}

interface FinalResponse {
	statusCode: number;
	success: boolean;
	message: string;
	data: unknown;
	meta?: unknown;
	access_token?: string;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
	constructor(private reflector: Reflector) {}

	intercept(ctx: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const httpCtx = ctx.switchToHttp();
		const res: Response = httpCtx.getResponse();

		const message = this.reflector.get<string>(RESPONSE_MESSAGE_KEY, ctx.getHandler()) || 'Operation Successful';
		const isObj = (val: unknown): val is Record<string, any> => val !== null && typeof val === 'object';

		return next.handle().pipe(
			map((payload: unknown): FinalResponse => {
				const response: FinalResponse = {
					statusCode: res.statusCode,
					success: true,
					message: message,
					data: null,
				};

				if (payload === null || payload === undefined) return response;

				if (typeof payload !== 'object' || Array.isArray(payload)) {
					response.data = payload;

					return response;
				}

				if (isObj(payload)) {
					const { data, user, meta, ...res } = payload as StandardPayload;

					// Fix this case, if access_token on the payload, remove access_token so as not to be exposed to the client
					response.data = user ? user : data;

					if (meta) response.meta = meta;
				}

				return response;
			}),
		);
	}
}
