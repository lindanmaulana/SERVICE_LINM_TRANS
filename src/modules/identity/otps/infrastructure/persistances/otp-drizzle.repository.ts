import { OtpType } from '@/common/const/otp-type.const';
import { DB_TOKENS } from '@/common/const/token.const';
import { BaseRepository } from '@/core/database/drizzle/base.repository';
import * as schema from '@/core/database/drizzle/schema';
import { Otp } from '@/modules/identity/otps/domain/entities/otp.entity';
import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { OtpPersistanceMapper } from './otp-persistance.mapper';

@Injectable()
export class OtpDrizzleRepository extends BaseRepository {
	protected logCtx = this.constructor.name;

	constructor(
		@Inject(DB_TOKENS.DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) public logger: Logger,
	) {
		super(logger, OtpDrizzleRepository.name);
	}

	async create(otp: Otp): Promise<Otp> {
		return this.execute(async () => {
			const record = OtpPersistanceMapper.toPersistance(otp);

			const [result] = await this.db.insert(schema.OtpsTable).values(record).returning();

			return OtpPersistanceMapper.toEntity(result);
		});
	}

	async findLatestByUserIdAndType(userId: string, type: OtpType): Promise<Otp | null> {
		return this.execute(async () => {
			this.logger.log('Find Latest Otp by user and type', { context: this.logCtx, userId: userId, type: type });

			const [result] = await this.db
				.select()
				.from(schema.OtpsTable)
				.where(and(eq(schema.OtpsTable.userId, userId), eq(schema.OtpsTable.type, type)))
				.orderBy(desc(schema.OtpsTable.createdAt))
				.limit(1);

			if (!result) return null;

			return OtpPersistanceMapper.toEntity(result);
		});
	}

	async invalidatedAllActiveOtp(userId: string, type: OtpType): Promise<boolean | null> {
		return this.execute(async () => {
			this.logger.log('Invalidated All Active Otp User', { context: this.logCtx, userId: userId });

			const [result] = await this.db
				.update(schema.OtpsTable)
				.set({ isUsed: true })
				.where(and(eq(schema.OtpsTable.userId, userId), eq(schema.OtpsTable.type, type)))
				.returning();

			if (!result) return null;

			return true;
		});
	}
}
