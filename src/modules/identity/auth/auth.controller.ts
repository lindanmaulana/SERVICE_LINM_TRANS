import { CookieName } from '@/common/decorators/cookie-name.decorator';
import { User } from '@/common/decorators/user.decorator';
import { Cookies } from '@/common/enums/cookies.enum';
import { CookieInterceptor } from '@/common/interceptors/cookie.interceptor';
import type { OauthGooglePayload } from '@/common/interfaces/oauth-google-payload.interface';
import { AuthService } from '@/modules/identity/auth/auth.service';
import { AuthhSignUpDto, AuthhSignUpResponseDto } from '@/modules/identity/auth/dto/auth-signup.dto';
import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { OauthGoogleSigninResponseDto } from './dto/oauth-signin.dto';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';
import { SignupVerifyAuthDto } from './dto/auth-signup-verify.dto';
import { VerifyRegisterService } from './application/use-cases/verify-register.service';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private verifyRegisterService: VerifyRegisterService,
	) {}

	@Post('signin')
	@UseGuards(AuthGuard('jwt'))
	@UseInterceptors(CookieInterceptor)
	@CookieName(Cookies.ACCESS_TOKEN)
	async signIn() {}

	@Post('signup')
	@ResponseMessage('Registrasi Berhasil', 'CREATE')
	async signUp(@Body() dto: AuthhSignUpDto): Promise<AuthhSignUpResponseDto> {
		return this.authService.signUp(dto);
	}

	@Post('signup/verify/:email')
	@ResponseMessage('Verifikasi akun berhasil', 'CUSTOM')
	async signUpVerify(@Param('email') email: string, @Body() dto: SignupVerifyAuthDto): Promise<void> {
		return this.verifyRegisterService.execute(email, dto);
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
}
