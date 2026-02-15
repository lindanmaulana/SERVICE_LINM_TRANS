import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtOptionsService } from '@/core/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LIBRARY_TOKENS } from '@/common/const/token.const';
import bcrypt from 'bcrypt';

@Module({
	imports: [PassportModule, JwtModule.registerAsync({ useClass: JwtOptionsService })],
	providers: [
		AuthService,
		JwtStrategy,
		{
			provide: LIBRARY_TOKENS.HASH,
			useValue: bcrypt,
		},
	],
	controllers: [AuthController],
})
export class AuthModule {}
