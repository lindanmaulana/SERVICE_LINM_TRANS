import { registerAs } from '@nestjs/config';

export interface JwtConfig {
	JwtSecretKey: string;
	JwtExpiresIn: number;
}

export const jwtConfig = registerAs(
	'jwt',
	(): JwtConfig => ({
		JwtSecretKey: process.env.JWT_SECRET_KEY ? process.env.JWT_SECRET_KEY : '',
		JwtExpiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : 3600000,
	}),
);
