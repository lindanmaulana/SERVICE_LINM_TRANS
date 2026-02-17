import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { MS } from '@/common/utils/time.utils';
import { envSchema, throttlerConfig, ThrottlerOptionsService, WinstonConfig } from '@/core/config';
import { jwtConfig } from '@/core/config/jwt/jwt.config';
import { DatabaseModule } from '@/core/database/database.module';
import { AppController } from '@/modules/apps/app.controller';
import { AppService } from '@/modules/apps/app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { AuthModule } from '../auth/auth.module';
import { MasterDataModule } from '../master-data/master-data.module';
import { OperationsModule } from '../operations/operations.module';
import { TicketingModule } from '../ticketing/ticketing.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [throttlerConfig, jwtConfig],
			validate: (c) => envSchema.parse(c),
		}),
		DatabaseModule,
		AuthModule,
		MasterDataModule,
		OperationsModule,
		TicketingModule,
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			useClass: ThrottlerOptionsService,
		}),

		WinstonModule.forRootAsync({ useClass: WinstonConfig }),
		CacheModule.register({
			isGlobal: true,
			ttl: MS.MINUTE * 10,
		}),
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
