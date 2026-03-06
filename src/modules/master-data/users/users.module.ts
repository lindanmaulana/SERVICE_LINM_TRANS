import { LIBRARY_TOKENS, REPOSITORY_TOKENS } from '@/common/const/token.const';
import { DrizzleModule } from '@/core/database/drizzle/drizzle.module';
import { Module } from '@nestjs/common';
import { UserDrizzleRepository } from './infrastructure/persistances/user-drizzle.repository';
import { UsersSharedService } from './users-shared.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import bcrypt from 'bcrypt';

@Module({
	imports: [DrizzleModule],
	controllers: [UsersController],
	providers: [
		UsersService,
		UsersSharedService,
		{
			provide: REPOSITORY_TOKENS.USER,
			useClass: UserDrizzleRepository,
		},
		{
			provide: LIBRARY_TOKENS.HASH,
			useValue: bcrypt,
		},
	],
	exports: [REPOSITORY_TOKENS.USER, UsersService],
})
export class UsersModule {}
