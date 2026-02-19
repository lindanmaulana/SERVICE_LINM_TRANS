import { LIBRARY_TOKENS } from '@/common/const/token.const';
import { JwtOptionsService } from '@/core/config';
import { DrizzleModule } from '@/core/database/drizzle/drizzle.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import bcrypt from 'bcrypt';
import { UsersModule } from '../master-data/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OauthStrategy } from './strategies/oauth2.strategy';

@Module({
	imports: [DrizzleModule, PassportModule, UsersModule, JwtModule.registerAsync({ useClass: JwtOptionsService })],
	providers: [
		AuthService,
		OauthStrategy,
		JwtStrategy,
		{
			provide: LIBRARY_TOKENS.HASH,
			useValue: bcrypt,
		},
	],

	controllers: [AuthController],
})
export class AuthModule {}
