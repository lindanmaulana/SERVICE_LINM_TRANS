import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '@/modules/master-data/users/users.service';
import { OtpsService } from '@/modules/identity/otps/otps.service';
import { Cache } from '@nestjs/cache-manager';
import { MS } from '@/common/utils/time.util';
import { ForgotPasswordDto } from '@/modules/identity/auth/dto';

@Injectable()
export class ForgotPasswordService {
	protected logCtx = this.constructor.name;

	constructor(
		private readonly userService: UsersService,
		private readonly otpService: OtpsService,
		private readonly cacheManager: Cache,
	) {}

	async execute(dto: ForgotPasswordDto): Promise<void> {
		const locKey = `request_reset_password:${dto.email}`;
		const userEntity = await this.userService.findByEmailEntityOrThrow(dto.email);

		if (userEntity.isDeleted()) throw new NotFoundException('Akun tidak ditemukan');
		if (userEntity.isBanned()) throw new ForbiddenException('Akun ditangguhkan. Silahkan hubungi admin');
		if (!userEntity.isActive())
			throw new ForbiddenException('Akun anda belum aktif, Lakukan aktivasi terlebih dahulu');

		const isLocked = await this.cacheManager.get(locKey);
		if (isLocked) throw new BadRequestException('Tunggu sebentar sebelum meminta kode baru');

		await this.otpService.requestResetPassword({ userId: userEntity.id, email: userEntity.email });
		await this.cacheManager.set(locKey, 'reset-password', MS.MINUTE * 5);
	}
}
