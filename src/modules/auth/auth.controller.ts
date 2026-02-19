import { User } from '@/common/decorators/user.decorator';
import type { OauthGooglePayload } from '@/common/interfaces/oauth-google-payload.interface';
import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OauthGoogleSigninResponseDto } from '@/modules/auth/dto/auth-signin.dto';
import { AuthService } from '@/modules/auth/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CookieInterceptor } from '@/common/interceptors/cookie.interceptor';
import { CookieName } from '@/common/decorators/cookie-name.decorator';
import { Cookies } from '@/common/enums/cookies.enum';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	async googleAuth() {}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	@UseInterceptors(CookieInterceptor)
	@CookieName(Cookies.ACCESS_TOKEN)
	async googleAuthRedirect(@User() user: OauthGooglePayload): Promise<OauthGoogleSigninResponseDto> {
		return this.authService.signinGoogle(user);
	}
}
