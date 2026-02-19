import { DB_TOKENS } from '@/common/const/token.const';
import * as schema from '@/core/database/drizzle/schema';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Module({
	providers: [
		{
			provide: DB_TOKENS.DRIZZLE,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const connectionString = configService.get<string>('DATABASE_URL');

				const pool = new Pool({
					connectionString,
				});

				return drizzle(pool, { schema, casing: 'snake_case' }) as NodePgDatabase<typeof schema>;
			},
		},
	],
	exports: [DB_TOKENS.DRIZZLE],
})
export class DrizzleModule {}
