import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './modules/apps/app.module';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.set('trust-proxy', 'loopback');
	app.use(cookieParser(process.env.COOKIE_SECRET));

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

	const config = new DocumentBuilder()
		.setTitle('Linm Trans - Ticketing System')
		.setDescription('Dokumentasi API Service Ticketing System - Linm Trans')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('API', app, document);

	await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
