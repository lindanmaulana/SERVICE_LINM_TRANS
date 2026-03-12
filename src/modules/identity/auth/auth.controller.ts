import { CookieName } from '@/common/decorators/cookie-name.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { User } from '@/common/decorators/user.decorator';
import { Cookies } from '@/common/enums/cookies.enum';
import { CookieInterceptor } from '@/common/interceptors/cookie.interceptor';
import type { OauthGooglePayload } from '@/common/interfaces/oauth-google-payload.interface';
import { AuthService } from '@/modules/identity/auth/auth.service';
import {
	AuthhSignUpDto,
	AuthhSignUpResponseDto,
	AuthSigninDto,
	AuthSigninResponseDto,
} from '@/modules/identity/auth/dto';
import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { VerifyRegisterService } from './application/use-cases/verify-register.service';
import { AuthSignupVerifyAuthDto } from './dto/auth-signup-verify.dto';
import { OauthGoogleSigninResponseDto } from './dto/oauth-signin.dto';
import { OtpResendRegistrationDto } from './dto/otp-resend-register.dto';
import { ResendOtpRegisterService } from './application/use-cases/resend-otp-register.service';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private verifyRegisterService: VerifyRegisterService,
		private resendOtpRegisterService: ResendOtpRegisterService,
	) {}

	@Post('signin')
	@ResponseMessage('Login Berhasil', 'CUSTOM')
	@UseInterceptors(CookieInterceptor)
	@CookieName(Cookies.ACCESS_TOKEN)
	async signIn(@Body() dto: AuthSigninDto): Promise<AuthSigninResponseDto> {
		console.log('fungsi signin');
		return this.authService.signin(dto);
	}

	@Post('signup')
	@ResponseMessage('Registrasi Berhasil', 'CREATE')
	async signUp(@Body() dto: AuthhSignUpDto): Promise<AuthhSignUpResponseDto> {
		return this.authService.signUp(dto);
	}

	@Post('signup/verify')
	@ResponseMessage('Verifikasi akun berhasil', 'CUSTOM')
	async signUpVerify(@Body() dto: AuthSignupVerifyAuthDto): Promise<void> {
		return this.verifyRegisterService.execute(dto);
	}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	async signInWithGoogle() {}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	@UseInterceptors(CookieInterceptor)
	@CookieName(Cookies.ACCESS_TOKEN)
	async signInWithGoogleRedirect(@User() user: OauthGooglePayload): Promise<OauthGoogleSigninResponseDto> {
		return this.authService.signInGoogle(user);
	}

	@Post('otp/resend-register')
	async resendRegisterOtp(@Body() dto: OtpResendRegistrationDto): Promise<void> {
		return this.resendOtpRegisterService.execute(dto);
	}
}
