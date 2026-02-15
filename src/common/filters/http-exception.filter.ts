import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

interface ExceptionResponse {
	message: string;
	errors?: Record<string, string>;
	statusCode: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const res: Response = ctx.getResponse();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = 'Internal server error';
		let errors: Record<string, string> | undefined = undefined;

		if (exception instanceof HttpException) {
			status = exception.getStatus();

			const resContent = exception.getResponse() as string | ExceptionResponse;

			if (typeof resContent === 'object' && resContent !== null) {
				message = resContent.message;
				errors = resContent.errors;
			} else {
				message = resContent;
			}
		} else if (exception instanceof Error) {
			message = process.env.NODE_ENV === 'production' ? 'Internal server error' : exception.message;
		}

		const finalErrorResponse = {
			statusCode: status,
			success: false,
			message: message,
			...(errors ? { errors: errors } : { errors: null }),
		};

		res.status(status).json(finalErrorResponse);
	}
}
