import { BaseRepository } from '@/core/database/drizzle/base.repository';
import * as schema from '@/core/database/drizzle/schema';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from '../../domain/entities/user.entity';
import { UserPersistanceMapper } from './users-persistance.mapper';
import { DB_TOKENS } from '@/common/const/token.const';

@Injectable()
export class UserDrizzleRepository extends BaseRepository {
	protected logContext = this.constructor.name;
	constructor(
		@Inject(DB_TOKENS.DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) public logger: Logger,
	) {
		super(logger, UserDrizzleRepository.name);
	}

	async findById(id: string): Promise<User | null> {
		return this.execute(async () => {
			const [existingUser] = await this.db
				.select()
				.from(schema.UsersTable)
				.where(eq(schema.UsersTable.id, id))
				.limit(1);

			if (!existingUser) return null;

			return UserPersistanceMapper.toEntity(existingUser);
		});
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.execute(async () => {
			const [existingUser] = await this.db
				.select()
				.from(schema.UsersTable)
				.where(eq(schema.UsersTable.email, email))
				.limit(1);

			if (!existingUser) return null;

			return UserPersistanceMapper.toEntity(existingUser);
		});
	}

	async create(user: User): Promise<User> {
		return this.execute(async () => {
			const record = UserPersistanceMapper.toPersistence(user);

			const [newUser] = await this.db.insert(schema.UsersTable).values(record).returning();

			return UserPersistanceMapper.toEntity(newUser);
		});
	}
}
