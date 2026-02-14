import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './modules/apps/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
			const allowOrigins = ['https://domain-kamu.com', 'http://localhost:3000'];

			if (!origin || allowOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('System access denied, enable cors'));
			}
		},
		methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
		credentials: true,
	});

	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					...helmet.contentSecurityPolicy.getDefaultDirectives(),
					'script-src': ["'self'", "'unsafe-inline'"],
				},
			},
			hsts: { maxAge: 31536000, includeSubDomains: true },
			frameguard: {
				action: 'deny',
			},
		}),
	);

	await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
