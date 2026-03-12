import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { OtpResendRegistrationDto } from '../../dto/otp-resend-register.dto';
import { UsersService } from '@/modules/master-data/users/users.service';
import { OtpsService } from '@/modules/identity/otps/otps.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { MS } from '@/common/utils/time.util';

@Injectable()
export class ResendOtpRegisterService {
	protected logCtx = this.constructor.name;

	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		private readonly userService: UsersService,
		private readonly otpService: OtpsService,
	) {}

	async execute(dto: OtpResendRegistrationDto): Promise<void> {
		const lockKey = `resend_otp_register_lock:${dto.email}`;

		const userEntity = await this.userService.findByEmailEntityOrThrow(dto.email);

		if (userEntity.isDeleted()) throw new BadRequestException('Akun tidak ditemukan');
		if (userEntity.isBanned()) {
			throw new BadRequestException(
				'Akun anda ditangguhkan, tidak dapat meminta kode baru. Silahkan hubungi admin',
			);
		}
		if (userEntity.isActive()) {
			throw new BadRequestException('Akun anda sudah aktif, tidak dapat meminta kode baru');
		}

		const isLocked = await this.cacheManager.get(lockKey);
		
		if (isLocked) throw new BadRequestException('Tunggu sebentar sebelum meminta kode baru.');

		await this.otpService.requestRegisterOtp({ userId: userEntity.id, to: dto.email });
		await this.cacheManager.set(lockKey, 'active', MS.MINUTE * 5);
	}
}
