import z from 'zod';

export const envSchema = z.object({
	PORT: z.coerce.number().default(3000),

	DATABASE_URL: z.url(),

	THROTTLE_SHORT_TTL: z.coerce.number().default(1000),
	THROTTLE_SHORT_LIMIT: z.coerce.number().default(5),
	THROTTLE_MEDIUM_TTL: z.coerce.number().default(60000),
	THROTTLE_MEDIUM_LIMIT: z.coerce.number().default(20),
	THROTTLE_LONG_TTL: z.coerce.number().default(3600000),
	THROTTLE_LONG_LIMIT: z.coerce.number().default(1000),

	BASE_DOMAIN: z.url(),
	WEB_DOMAIN: z.url(),

	COOKIE_SECRET: z.string(),
	COOKIE_MAX_AGE: z.coerce.number(),
	COOKIE_MAX_AGE_ACCESS_TOKEN: z.coerce.number(),

	JWT_SECRET_KEY: z.string(),
	JWT_EXPIRES_IN: z.coerce.number(),

	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	GOOGLE_CALLBACK_URL: z.url(),
});

export type TypeEnv = z.infer<typeof envSchema>;
