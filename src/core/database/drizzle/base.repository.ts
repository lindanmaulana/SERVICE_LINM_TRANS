import { InternalServerErrorException } from '@nestjs/common';
import { DrizzleError, DrizzleQueryError } from 'drizzle-orm';
import { Logger } from 'winston';

export abstract class BaseRepository {
	constructor(
		protected readonly logger: Logger,
		protected readonly context: string,
	) {}

	protected async execute<T>(operation: () => Promise<T>): Promise<T> {
		try {
			return await operation();
		} catch (err: unknown) {
			const logData: Record<string, unknown> = {
				context: this.context,
				message: 'Anunexpected error occurred!',
			};

			if (err instanceof Error) {
				logData.message = err.message;
				logData.stack = err.stack;
			}

			if (err instanceof DrizzleError) {
				logData.message = err.message;
				logData.cause = err.cause;
				logData.stack = err.stack;
				logData.name = err.name;
			}

			if (err instanceof DrizzleQueryError) {
				logData.message = err.message;
				logData.cause = err.cause;
				logData.stack = err.stack;
				logData.name = err.name;
				logData.query = err.query;
				logData.params = err.params;
			}

			this.logger.error('Database operation failed', logData);

			throw new InternalServerErrorException('Terjadi kesalahan pada sistem, please try again later!');
		}
	}
}
