import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions, ThrottlerOptionsFactory } from '@nestjs/throttler';
import { ThrottlerConfig } from './throttler.config';

@Injectable()
export class ThrottlerOptionsService implements ThrottlerOptionsFactory {
	constructor(private configService: ConfigService) {}

	createThrottlerOptions(): Promise<ThrottlerModuleOptions> | ThrottlerModuleOptions {
		const throttler = this.configService.get<ThrottlerConfig>('throttler') as ThrottlerConfig;

		const options: ThrottlerModuleOptions = {
			throttlers: [
				{
					name: 'short',
					ttl: throttler.short.ttl,
					limit: throttler.short.limit,
				},
				{
					name: 'medium',
					ttl: throttler.medium.ttl,
					limit: throttler.medium.limit,
				},
				{
					name: 'long',
					ttl: throttler.long.ttl,
					limit: throttler.long.limit,
				},
			],

			errorMessage: 'Batas permintaan terlampaui. Silahkan coba lagi nanti.',
		};

		return options;
	}
}
