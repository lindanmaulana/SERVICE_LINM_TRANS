import { registerAs } from '@nestjs/config';

interface resendConfig {
	ResendApiKey: string;
	ResendFromEmail: string;
}

export const ResendConfig = registerAs(
	'resend',
	(): resendConfig => ({
		ResendApiKey: process.env.RESEND_API_KEY || '',
		ResendFromEmail: process.env.RESEND_FROM_EMAIL || '',
	}),
);
