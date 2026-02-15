import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { envSchema, throttlerConfig, ThrottlerOptionsService } from '@/core/config';
import { WinstonConfig } from '@/core/config/winston.config';
import { DatabaseModule } from '@/core/database/database.module';
import { AppController } from '@/modules/apps/app.controller';
import { AppService } from '@/modules/apps/app.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';

@Module({
	imports: [
		DatabaseModule,
		ConfigModule.forRoot({
			isGlobal: true,
			load: [throttlerConfig],
			validate: (c) => envSchema.parse(c),
		}),

		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			useClass: ThrottlerOptionsService,
		}),

		WinstonModule.forRootAsync({ useClass: WinstonConfig }),
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseInterceptor,
		},
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
	],
})
export class AppModule {}
