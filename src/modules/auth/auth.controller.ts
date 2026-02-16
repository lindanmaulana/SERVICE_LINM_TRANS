import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
	@Get('google')
	async googleAuth() {}

	@Get('google/callback')
	async googleAuthRedirect() {}
}
