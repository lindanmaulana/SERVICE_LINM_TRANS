export const JwtTypeToken = {
	ACCESS_TOKEN: 'ACCESS_TOKEN',
	RESET_PASSWORD: 'RESET_PASSWORD',
	CHANGE_EMAIL: 'CHANGE_EMAIL',
} as const;

export type JwtTypeToken = 'ACCESS_TOKEN' | 'RESET_PASSWORD' | 'CHANGE_EMAIL';
export const JwtTypeTokenAccepted = [
	JwtTypeToken.ACCESS_TOKEN,
	JwtTypeToken.RESET_PASSWORD,
	JwtTypeToken.CHANGE_EMAIL,
] as const;
