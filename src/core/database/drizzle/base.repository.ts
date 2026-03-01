import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { error } from 'console';
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
			};

			if (err instanceof Error) {
				logData.name = err.name;
				logData.message = err.message;
				logData.stack = err.stack;

				const dbErr = err as any;
				logData.code = dbErr.code || dbErr.errno;
			}

			if (err instanceof DrizzleError) {
				logData.cause = err.cause;
			}

			if (err instanceof DrizzleQueryError) {
				logData.query = err.query;
				logData.params = err.params;
			}

			this.logger.error('Database operation failed', logData);

			const dbCode = (err as any).code || (err as any).errno;
			if (dbCode === '23503' || dbCode === 1451)
				throw new BadRequestException('Data tidak bisa di hapus karena masih digunakan dalam riwayat sistem!');

			console.log({err})
			throw new InternalServerErrorException('Terjadi kesalahan pada sistem, silahkan coba lagi nanti!');
		}
	}
}
