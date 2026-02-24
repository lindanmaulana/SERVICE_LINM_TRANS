export const DB_TOKENS = {
	DRIZZLE: Symbol('DrizzleAsyncProvider'),
} as const;

export const LIBRARY_TOKENS = {
	HASH: Symbol('LIB_HASH'),
	RESEND: Symbol('LIB_RESEND'),
} as const;

export const REPOSITORY_TOKENS = {
	USER: Symbol('USER_REPOSITORY'),
} as const;
