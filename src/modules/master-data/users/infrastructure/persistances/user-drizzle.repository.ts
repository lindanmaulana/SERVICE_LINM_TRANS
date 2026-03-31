import { BaseRepository } from '@/core/database/drizzle/base.repository';
import * as schema from '@/core/database/drizzle/schema';
import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, ilike, or, param, SQL } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from '../../domain/entities/user.entity';
import { UserPersistanceMapper } from './user-persistance.mapper';
import { DB_TOKENS } from '@/common/const/token.const';
import { UserStatus } from '@/common/const/user.const';
import type { UserFilter, UserRepository } from '@/modules/master-data/users/domain/repositories/user.repository';
import { count } from 'drizzle-orm';

@Injectable()
export class UserDrizzleRepository extends BaseRepository {
	protected logContext = this.constructor.name;
	constructor(
		@Inject(DB_TOKENS.DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) public logger: Logger,
	) {
		super(logger, UserDrizzleRepository.name);
	}

	transaction(tx: any): UserRepository {
		return new UserDrizzleRepository(tx, this.logger);
	}

	async findAll(params: UserFilter): Promise<{ users: User[]; total: number }> {
		const filters: SQL<unknown>[] = []

		if (params.search) {
			filters.push(or(
				ilike(schema.UsersTable.name, `%${params.search}%`),
				ilike(schema.UsersTable.email, `%${params.search}%`)
			) as SQL )
		}

		if (params.role) filters.push(eq(schema.UsersTable.role, params.role))
		if (params.status) filters.push(eq(schema.UsersTable.status, params.status))

		const offset = (params.page - 1) * params.limit

		return this.execute(async () => { 
			const [results, totalResult] = await Promise.all([
				this.db
				.select()
				.from(schema.UsersTable)
				.where(and(...filters))
				.limit(params.limit)
				.offset(offset)
				.orderBy(desc(schema.UsersTable.createdAt)),

				this.db.select({value: count()})
				.from(schema.UsersTable).where(and(...filters))
			])

			return {
				users: results.map((result) => UserPersistanceMapper.toEntity(result)),
				total: totalResult[0].value
			}
		});
	}

	async create(user: User): Promise<User> {
		return this.execute(async () => {
			const record = UserPersistanceMapper.toPersistence(user);

			const [newUser] = await this.db.insert(schema.UsersTable).values(record).returning();

			return UserPersistanceMapper.toEntity(newUser);
		});
	}

	async update(user: User): Promise<User> {
		return this.execute(async () => {
			const record = UserPersistanceMapper.toPersistence(user);

			const [result] = await this.db
				.update(schema.UsersTable)
				.set(record)
				.where(eq(schema.UsersTable.id, user.id))
				.returning();

			return UserPersistanceMapper.toEntity(result);
		});
	}

	async delete(user: User): Promise<User> {
		return this.execute(async () => {
			const [result] = await this.db
				.update(schema.UsersTable)
				.set({
					deletedAt: user.deletedAt,
				})
				.returning();

			return UserPersistanceMapper.toEntity(result);
		});
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
				.select({
					id: schema.UsersTable.id,
					email: schema.UsersTable.email,
					password: schema.UsersTable.password,
					name: schema.UsersTable.name,
					role: schema.UsersTable.role,
					provider: schema.UsersTable.provider,
					providerId: schema.UsersTable.providerId,
					avatar: schema.UsersTable.avatar,
					status: schema.UsersTable.status,
					createdAt: schema.UsersTable.createdAt,
					updatedAt: schema.UsersTable.updatedAt,
					deletedAt: schema.UsersTable.deletedAt,
				})
				.from(schema.UsersTable)
				.where(eq(schema.UsersTable.email, email))
				.limit(1);

			if (!existingUser) return null;

			return UserPersistanceMapper.toEntity(existingUser);
		});
	}

	async activate(email: string): Promise<void> {
		return this.execute(async () => {
			this.logger.log('Activate User', { context: this.logContext });

			await this.db
				.update(schema.UsersTable)
				.set({
					status: UserStatus.ACTIVE,
				})
				.where(eq(schema.UsersTable.email, email));
		});
	}
}
