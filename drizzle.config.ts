import { defineConfig } from 'drizzle-kit';
import z from 'zod';
import { envSchema } from './src/core/config';

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
	schema: './src/core/database/drizzle/schema.ts',
	out: './drizzle/migrations',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
});
