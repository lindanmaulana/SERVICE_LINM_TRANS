import { BaseRepository } from '@/core/database/drizzle/base.repository';
import { DrizzleAsyncProvider } from '@/core/database/drizzle/drizzle.provider';
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@/core/database/drizzle/schema';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UserDrizzleRepository extends BaseRepository {
	protected logContext = this.constructor.name;
	constructor(
		@Inject(DrizzleAsyncProvider) private readonly db: NodePgDatabase<typeof schema>,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) public logger: Logger,
	) {
		super(logger, UserDrizzleRepository.name);
	}
}
