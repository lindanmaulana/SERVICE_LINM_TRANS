import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './modules/apps/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.getHttpAdapter().getInstance().disable('x-powered-by');

	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					...helmet.contentSecurityPolicy.getDefaultDirectives(),
					'script-src': ["'self'", "'unsafe-inline'"],
				},
			},
			xPoweredBy: false,
			frameguard: {
				action: 'deny',
			},
		}),
	);

	app.enableCors({
		origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
			const allowOrigins = [process.env.BASE_DOMAIN, process.env.WEB_DOMAIN];

			if (!origin || allowOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('System access denied, enable cors'));
			}
		},
		methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
		credentials: true,
	});

	app.set('trust-proxy', 'loopback');

	await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
