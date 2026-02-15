import { defineConfig } from 'drizzle-kit';
import z from 'zod';
import * as dotenv from 'dotenv';
import { envSchema } from '@/core/config';

dotenv.config();

const validateEnv = () => {
	const result = envSchema.safeParse(process.env);

	if (!result.success) {
		console.error('Invalid environment variables', z.treeifyError(result.error));
		throw new Error('Invalid configuration');
	}

	return result.data;
};

const env = validateEnv();

export default defineConfig({
	dialect: 'postgresql',
	schema: '@/core/database/schema.ts',
	out: './drizzle',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
});
