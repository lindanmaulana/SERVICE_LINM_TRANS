import { envSchema, throttlerConfig, ThrottlerOptionsService } from '@/core/config';
import { DatabaseModule } from '@/core/database/database.module';
import { AppController } from '@/modules/apps/app.controller';
import { AppService } from '@/modules/apps/app.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

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
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
