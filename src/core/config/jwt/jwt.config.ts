import { registerAs } from '@nestjs/config';

export interface JwtConfig {
	secretKey: string;
	expiresIn: number;

	resetSecretKey: string;
	resetExpiresIn: number;

	changeEmailSecretKey: string;
	changeEmailExpiresIn: number;
}

export const jwtConfig = registerAs(
	'jwt',
	(): JwtConfig => ({
		secretKey: process.env.JWT_SECRET_KEY ? process.env.JWT_SECRET_KEY : '',
		expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : 3600000,

		resetSecretKey: process.env.JWT_RESET_PASSWORD_KEY ? process.env.JWT_RESET_PASSWORD_KEY : '',
		resetExpiresIn: process.env.JWT_RESET_PASSWORD_EXPIRES_IN ? parseInt(process.env.JWT_RESET_PASSWORD_EXPIRES_IN) : 300000,

		changeEmailSecretKey: process.env.JWT_CHANGE_EMAIL_KEY ? process.env.JWT_CHANGE_EMAIL_KEY : '',
		changeEmailExpiresIn: process.env.JWT_CHANGE_EMAIL_EXPIRES_IN ? parseInt(process.env.JWT_CHANGE_EMAIL_EXPIRES_IN) : 300000
	}),
);
