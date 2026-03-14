import { JwtTypeToken } from '@/common/const/jwt-token-type.const';
import { OtpType } from '@/common/const/otp-type.const';
import { OtpsService } from '@/modules/identity/otps/otps.service';
import { UsersService } from '@/modules/master-data/users/users.service';
import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseMapper } from '../../infrastructure/auth-response.mapper';
import { VerifyResetOtpDto, VerifyResetOtpResponseDto } from '@/modules/identity/auth/dto';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from '@/core/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class VerifyResetOtpService {
	protected logCtx = this.constructor.name;

	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		private readonly userService: UsersService,
		private readonly otpService: OtpsService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async execute(dto: VerifyResetOtpDto): Promise<VerifyResetOtpResponseDto> {
		const jwt = this.configService.get<JwtConfig>('jwt');

		if (!jwt) {
			this.logger.error('[Configuration JwtResetPassword] konfigurasi environment tidak ditemukan', {
				context: this.logCtx,
			});
			throw new InternalServerErrorException('Terjadi kesalahan pada sistem');
		}

		const userEntity = await this.userService.findByEmailEntityOrThrow(dto.email);
		if (userEntity.isDeleted()) throw new NotFoundException('Akun tidak ditemukan');
		if (userEntity.isBanned()) throw new ForbiddenException('Akun anda ditangguhkan. Silahkan hubungi admin');
		if (!userEntity.isActive())
			throw new ForbiddenException('Akun anda melakukan aktivasi. Silahkan aktivasi terlebih dahulu');

		const otpEntity = await this.otpService.findOneLatestByUserIdAndOtpCode(
			userEntity.id,
			dto.otpCode,
			OtpType.RESET_PASSWORD,
		);

		if (!otpEntity || otpEntity === null) throw new BadRequestException('OTP tidak valid atau sudah kedaluarsa');
		if (otpEntity.isExpired()) throw new BadRequestException('OTP sudah kedaluarsa');
		if (otpEntity.type !== OtpType.RESET_PASSWORD) throw new BadRequestException('OTP tidak valid');

		otpEntity.markAsUsed();
		otpEntity.adddAttempts();

		await this.otpService.verifyResetPassword(otpEntity.id);

		const resetPasswordToken = await this.jwtService.signAsync(
			{
				id: userEntity.id,
				email: userEntity.email,
				role: userEntity.role,
				name: userEntity.name ?? 'User',
				status: userEntity.status,
				type: JwtTypeToken.RESET_PASSWORD,
			},
			{
				secret: jwt.resetSecretKey,
				expiresIn: jwt.resetExpiresIn,
			},
		);

		return AuthResponseMapper.toVerifyResetPassword(userEntity, resetPasswordToken);
	}
}
