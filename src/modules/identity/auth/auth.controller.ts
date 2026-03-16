import { CookieName } from '@/common/decorators/cookie-name.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { User } from '@/common/decorators/user.decorator';
import { Cookies } from '@/common/enums/cookies.enum';
import { JwtChangeEmailGuard } from '@/common/guards/change-email.guard';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { JwtResetPasswordGuard } from '@/common/guards/reset-password.guard';
import { CookieInterceptor } from '@/common/interceptors/cookie.interceptor';
import type { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import type { OauthGooglePayload } from '@/common/interfaces/oauth-google-payload.interface';
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
	VerifyResetOtpService,
} from '@/modules/identity/auth/application/use-cases';
import {
	ChangeEmailRequestDto,
	ChangeEmailRequestResponseDto,
	ChangeEmailVerifyDto,
	ForgotPasswordDto,
	OauthGoogleSigninResponseDto,
	ResetPasswordDto,
	SignUpDto,
	SignUpResponseDto,
	SigninDto,
	SigninResponseDto,
	SignupResendOtpDto,
	SignupVerifyDto,
	VerifyResetOtpDto,
	VerifyResetOtpResponseDto,
} from '@/modules/identity/auth/dto';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
export class AuthController {
	constructor(
		private signinService: SigninService,
		private signinGoogleService: SigninGoogleService,

		private signupService: SignupService,
		private signupVerifyService: SignupVerifyService,
		private signupResendOtpService: SignupResendOtpService,

		private forgotPasswordService: ForgotPasswordService,
		private verifyResetOtpService: VerifyResetOtpService,
		private resetPasswordService: ResetPasswordService,

		private changeEmailRequestService: ChangeEmailRequestService,
		private changeEmailVerifyService: ChangeEmailVerifyService,
	) {}

	@Post('signin')
	@ResponseMessage('Login Berhasil', 'CUSTOM')
	@UseInterceptors(CookieInterceptor)
	@CookieName(Cookies.ACCESS_TOKEN)
	async signIn(@Body() dto: SigninDto): Promise<SigninResponseDto> {
		return this.signinService.execute(dto);
	}

	@Post('signup')
	@ResponseMessage('Registrasi Berhasil', 'CREATE')
	async signUp(@Body() dto: SignUpDto): Promise<SignUpResponseDto> {
		return this.signupService.execute(dto);
	}

	@Post('signup/verify')
	@ResponseMessage('Verifikasi akun berhasil', 'CUSTOM')
	async signUpVerify(@Body() dto: SignupVerifyDto): Promise<void> {
		return this.signupVerifyService.execute(dto);
	}

	@Post('signup/resend-otp')
	async signupResendOtp(@Body() dto: SignupResendOtpDto): Promise<void> {
		return this.signupResendOtpService.execute(dto);
	}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	async signInWithGoogle() {}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	@UseInterceptors(CookieInterceptor)
	@CookieName(Cookies.ACCESS_TOKEN)
	async signInWithGoogleRedirect(@User() user: OauthGooglePayload): Promise<OauthGoogleSigninResponseDto> {
		return this.signinGoogleService.execute(user);
	}

	@Post('forgot-password')
	@HttpCode(HttpStatus.OK)
	@ResponseMessage('Kode verifikasi berhasil di kirim', 'CUSTOM')
	async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
		return this.forgotPasswordService.execute(dto);
	}

	@Post('verify-reset-otp')
	@UseInterceptors(CookieInterceptor)
	@CookieName(Cookies.RESET_PASSWORD_TOKEN)
	@ResponseMessage('Verifikasi reset password berhasil', 'CUSTOM')
	async verifyResetOtp(@Body() dto: VerifyResetOtpDto): Promise<VerifyResetOtpResponseDto> {
		return this.verifyResetOtpService.execute(dto);
	}

	@Post('reset-password')
	@UseGuards(JwtResetPasswordGuard)
	@ResponseMessage('Password berhasil diubah', 'CUSTOM')
	async resetPassword(@User() user: JwtPayload, @Body() dto: ResetPasswordDto): Promise<void> {
		return this.resetPasswordService.execute(user, dto);
	}

	@Post('change-email/request')
	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(CookieInterceptor)
	@CookieName(Cookies.CHANGE_EMAIL_TOKEN)
	@ResponseMessage('Kode verifikasi berhasil di kirim', 'CUSTOM')
	async changeEmailRequest(
		@User() user: JwtPayload,
		@Body() dto: ChangeEmailRequestDto,
	): Promise<ChangeEmailRequestResponseDto> {
		return this.changeEmailRequestService.execute(user, dto);
	}

	@Post('change-email/verify')
	@UseGuards(JwtAuthGuard, JwtChangeEmailGuard)
	@ResponseMessage('Email berhasil di ubah', 'CUSTOM')
	async changeEmailVerify(@User() user: JwtPayload, @Body() dto: ChangeEmailVerifyDto): Promise<void> {
		return this.changeEmailVerifyService.execute(user, dto);
	}
}
