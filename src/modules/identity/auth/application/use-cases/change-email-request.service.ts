import { JwtTypeToken } from '@/common/const/jwt-token-type.const';
import { DB_TOKENS, LIBRARY_TOKENS } from '@/common/const/token.const';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { JwtConfig } from '@/core/config';
import * as schema from '@/core/database/drizzle/schema';
import { AuthResponseMapper } from '@/modules/identity/auth/infrastructure/auth-response.mapper';
import { OtpsService } from '@/modules/identity/otps/otps.service';
import { UsersService } from '@/modules/master-data/users/users.service';
import { Cache } from '@nestjs/cache-manager';
import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ChangeEmailRequestDto, ChangeEmailRequestResponseDto } from '../../dto/change-email-request.dto';

@Injectable()
export class ChangeEmailRequestService {
	protected logCtx = this.constructor.name;

	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		@Inject(LIBRARY_TOKENS.HASH) private readonly libHash: typeof bcrypt,
		@Inject(DB_TOKENS.DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
		private readonly jwtService: JwtService,
		private readonly userService: UsersService,
		private readonly otpService: OtpsService,
		private readonly cacheManager: Cache,
		private readonly configService: ConfigService,
	) {}

	async execute(user: JwtPayload, dto: ChangeEmailRequestDto): Promise<ChangeEmailRequestResponseDto> {
		const jwt = this.configService.get<JwtConfig>('jwt');
		if (!jwt) {
			this.logger.error('[Configuration JwtChangeEmail] konfigurasi environment tidak ditemukan', {
				context: this.logCtx,
			});

			throw new InternalServerErrorException('Terjadi kesalahan pada sistem');
		}

		const userEntity = await this.userService.findByEmailEntityOrThrow(user.email);

		if (!userEntity.password || userEntity.provider !== 'local') {
			throw new BadRequestException('Akun anda tidak mendukung untuk penggantian email');
		}
		if (userEntity.isDeleted()) throw new NotFoundException('Akun tidak ditemukan');
		if (userEntity.isBanned()) throw new ForbiddenException('Akun ditangguhkan. Silahkan hubungi admin');
		if (userEntity.isPending()) {
			throw new ForbiddenException('Akun anda belum aktif. Lakukan aktivasi terlebih dahulu');
		}

		const isComparePassword = await this.libHash.compare(dto.password, userEntity.password);
		if (!isComparePassword) throw new BadRequestException('Kredensial tidak valid');

		await this.otpService.requestChangeEmail(userEntity.id, {
			currentEmail: userEntity.email,
			newEmail: dto.email,
		});

		const changeEmailToken = await this.jwtService.signAsync(
			{
				id: userEntity.id,
				email: dto.email,
				role: userEntity.role,
				name: userEntity.name ?? 'User',
				status: userEntity.status,
				type: JwtTypeToken.CHANGE_EMAIL,
			},
			{
				secret: jwt.changeEmailSecretKey,
				expiresIn: jwt.changeEmailExpiresIn,
			},
		);

		return AuthResponseMapper.toChangeEmailRequest(userEntity, changeEmailToken);
	}
}
