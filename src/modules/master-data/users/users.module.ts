import { REPOSITORY_TOKENS } from '@/common/const/token.const';
import { DrizzleModule } from '@/core/database/drizzle/drizzle.module';
import { Module } from '@nestjs/common';
import { UserDrizzleRepository } from './infrastructure/persistance/users-drizzle.repository';
import { UsersSharedService } from './users-shared.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

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
	],
	exports: [REPOSITORY_TOKENS.USER, UsersSharedService],
})
export class UsersModule {}
