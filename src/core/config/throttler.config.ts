import { registerAs } from '@nestjs/config';

export interface ThrottlerConfig {
	short: { ttl: number; limit: number };
	medium: { ttl: number; limit: number };
	long: { ttl: number; limit: number };
}

export const throttlerConfig = registerAs(
	'throttler',
	(): ThrottlerConfig => ({
		short: {
			ttl: process.env.THROTTLE_SHORT_TTL ? parseInt(process.env.THROTTLE_SHORT_TTL) : 1000,
			limit: process.env.THROTTLE_SHORT_LIMIT ? parseInt(process.env.THROTTLE_SHORT_LIMIT) : 5,
		},
		medium: {
			ttl: process.env.THROTTLE_MEDIUM_TTL ? parseInt(process.env.THROTTLE_MEDIUM_TTL) : 60000,
			limit: process.env.THROTTLE_MEDIUM_LIMIT ? parseInt(process.env.THROTTLE_MEDIUM_LIMIT) : 20,
		},
		long: {
			ttl: process.env.THROTTLE_LONG_TTL ? parseInt(process.env.THROTTLE_LONG_TTL) : 3600000,
			limit: process.env.THROTTLE_LONG_LIMIT ? parseInt(process.env.THROTTLE_LONG_LIMIT) : 1000,
		},
	}),
);
