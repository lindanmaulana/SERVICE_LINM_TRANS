import { LIBRARY_TOKENS } from '@/common/const/token.const';
import { JwtOptionsService } from '@/core/config';
import { DrizzleModule } from '@/core/database/drizzle/drizzle.module';
import {
	ChangeEmailRequestService,
	ChangeEmailVerifyService,
	ForgotPasswordService,
	ResetPasswordService,
	SigninGoogleService,
	SigninService,
	SignupResendOtpService,
	SignupService,
	SignupVerifyService,
	VerifyResetOtpService
} from '@/modules/identity/auth/application/use-cases';
import { UsersModule } from '@/modules/master-data/users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import bcrypt from 'bcrypt';
import { OtpsModule } from '../otps/otps.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtResetPasswordStrategy } from './strategies/jwt-reset-password.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OauthStrategy } from './strategies/oauth2.strategy';
import { JwtChangeEmailStrategy } from './strategies/jwt-change-email.strategy';

@Module({
	imports: [
		DrizzleModule,
		PassportModule,
		UsersModule,
		OtpsModule,
		JwtModule.registerAsync({ useClass: JwtOptionsService }),
	],
	providers: [
		AuthService,
		SigninService,
		SignupService,
		SigninGoogleService,
		SignupVerifyService,
		SignupResendOtpService,
		ForgotPasswordService,
		VerifyResetOtpService,
		ResetPasswordService,
		ChangeEmailRequestService,
		ChangeEmailVerifyService,
		OauthStrategy,
		JwtStrategy,
		JwtResetPasswordStrategy,
		JwtChangeEmailStrategy,
		{
			provide: LIBRARY_TOKENS.HASH,
			useValue: bcrypt,
		},
	],

	controllers: [AuthController],
})
export class AuthModule {}
