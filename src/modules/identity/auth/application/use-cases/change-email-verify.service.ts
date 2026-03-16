import { DB_TOKENS } from '@/common/const/token.const';
import { OtpsService } from '@/modules/identity/otps/otps.service';
import { UsersService } from '@/modules/master-data/users/users.service';
import {
	BadRequestException,
	ForbiddenException,
	HttpException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as schema from '@/core/database/drizzle/schema';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { ChangeEmailVerifyDto } from '../../dto';
import { OtpType } from '@/common/const/otp-type.const';

@Injectable()
export class ChangeEmailVerifyService {
	protected logCtx = this.constructor.name;

	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		@Inject(DB_TOKENS.DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
		private readonly userService: UsersService,
		private readonly otpService: OtpsService,
	) {}

	async execute(user: JwtPayload, dto: ChangeEmailVerifyDto): Promise<void> {
		const userEntity = await this.userService.findByIdEntityOrThrow(user.id);
		if (userEntity.isDeleted()) throw new NotFoundException('Akun tidak ditemukan');
		if (userEntity.isBanned()) throw new ForbiddenException('Akun anda ditangguhkan. Silahkan hubungi admin');
		if (!userEntity.isActive())
			throw new ForbiddenException('Akun anda melakukan aktivasi. Silahkan aktivasi terlebih dahulu');

		userEntity.changeEmail(user.email);

		const otpEntity = await this.otpService.findOneLatestByUserIdAndOtpCode(
			userEntity.id,
			dto.otpCode,
			OtpType.CHANGE_EMAIL,
		);

		if (!otpEntity || otpEntity === null) throw new BadRequestException('OTP tidak valid atau sudah kedaluarsa');
		if (otpEntity.isExpired()) throw new BadRequestException('OTP sudah kedaluarsa');
		if (otpEntity.type !== OtpType.CHANGE_EMAIL) throw new BadRequestException('OTP tidak valid');
		if (otpEntity.isUsed) throw new BadRequestException('OTP sudah digunakan');

		otpEntity.markAsUsed();
		otpEntity.adddAttempts();

		try {
			await this.db.transaction(async (tx) => {
				await this.otpService.verifyChangeEmail(otpEntity.id, tx);
				await this.userService.update(userEntity, tx);
			});
		} catch (err) {
			this.logger.error(`Transaction failed for ${user.email}: ${err.message}`, {
				context: this.logCtx,
				stack: err.stack,
			});

			if (err instanceof HttpException) throw err;

			throw new InternalServerErrorException('Gagal memproses perubahan email. Silahkan coba lagi nanti');
		}
	}
}
