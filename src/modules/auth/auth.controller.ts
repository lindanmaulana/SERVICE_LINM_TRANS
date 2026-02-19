import { User } from '@/common/decorators/user.decorator';
import type { OauthGooglePayload } from '@/common/interfaces/oauth-google-payload.interface';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OauthGoogleSigninResponseDto } from './dto/auth-signin.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	async googleAuth() {}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	async googleAuthRedirect(@User() user: OauthGooglePayload): Promise<OauthGoogleSigninResponseDto> {
		return this.authService.signinGoogle(user);
	}
}
