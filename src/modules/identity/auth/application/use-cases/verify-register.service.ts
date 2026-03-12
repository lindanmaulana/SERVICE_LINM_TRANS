import { DB_TOKENS } from '@/common/const/token.const';
import * as schema from '@/core/database/drizzle/schema';
import { OtpsService } from '@/modules/identity/otps/otps.service';
import { UsersService } from '@/modules/master-data/users/users.service';
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	GoneException,
	HttpException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AuthSignupVerifyAuthDto } from '../../dto';

@Injectable()
export class VerifyRegisterService {
	protected logCtx = this.constructor.name;
	constructor(
		@Inject(DB_TOKENS.DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		private readonly userService: UsersService,
		private readonly otpService: OtpsService,
	) {}

	async execute(dto: AuthSignupVerifyAuthDto): Promise<void> {
		const userEntity = await this.userService.findByEmailEntityOrThrow(dto.email);

		if (userEntity.isDeleted()) throw new NotFoundException(`Akun tidak ditemukan`);
		if (userEntity.isBanned()) throw new ForbiddenException(`Akun anda ditangguhkan. Silahkan hubungi admin`);
		if (userEntity.isActive()) throw new ConflictException('Akun anda sudah aktif');

		const otpEntity = await this.otpService.findLatestByUserIdEntityOrThrow(userEntity.id, 'REGISTER_VERIFICATION');

		if (otpEntity.isUsed) throw new GoneException('OTP sudah pernah digunakan. Silahkan minta kode baru');
		if (otpEntity.isExpired()) throw new BadRequestException('OTP sudah kedaluarsa');
		if (otpEntity.otpCode !== dto.otpCode) throw new BadRequestException('Kode OTP yang dimasukan salah');

		otpEntity.markAsUsed();
		userEntity.setActive();

		try {
			await this.db.transaction(async (tx) => {
				await this.otpService.verifyRegister(otpEntity.id, tx);
				await this.userService.activateUser(userEntity.email, tx);
			});
		} catch (err) {
			this.logger.error(`Transaction failed for ${dto.email}: ${err.message}`, {
				context: this.logCtx,
				stack: err.stack,
			});

			if (err instanceof HttpException) throw err;

			throw new InternalServerErrorException('Gagal memproses verifikasi. Silahkan coba beberapa saat lagi');
		}
	}
}
