import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { Logger } from 'winston';
import { JwtConfig } from '@/core/config';

@Injectable()
export class JwtOptionsService implements JwtOptionsFactory {
	protected logContext = this.constructor.name;
	constructor(
		private configService: ConfigService,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
	) {}

	createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
		const jwt = this.configService.get<JwtConfig>('jwt') as JwtConfig;

		if (!jwt || !jwt.JwtSecretKey || !jwt.JwtExpiresIn) {
			this.logger.error('JWT Configuration failed', { context: this.logContext });
			throw new Error('Terjadi kesalahan pada sistem!');
		}

		return {
			secret: jwt.JwtSecretKey,
			signOptions: {
				expiresIn: jwt.JwtExpiresIn,
			},
		};
	}
}
