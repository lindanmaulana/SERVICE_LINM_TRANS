import { OtpType } from '@/common/const/otp-type.const';
import { REPOSITORY_TOKENS } from '@/common/const/token.const';
import { MS } from '@/common/utils/time.util';
import { RequestRegisterOtpDto } from '@/modules/identity/otps/dto';
import {
	BadRequestException,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	OnModuleInit,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import otpGenerator from 'otp-generator';
import { Logger } from 'winston';
import { MailService } from '../mail/mail.service';
import { Otp } from './domain/entities/otp.entity';
import type { OtpRepository } from './domain/repositories/otp.repository';
import { ConfigService } from '@nestjs/config';
import { MailSharedService } from '../mail/mail-shared.service';

@Injectable()
export class OtpsService implements OnModuleInit {
	protected logContext = this.constructor.name;
	private baseUrlClient: string;

	constructor(
		@Inject(REPOSITORY_TOKENS.OTP) private readonly otpRepository: OtpRepository,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		private configService: ConfigService,
		private readonly mailSharedService: MailSharedService,
	) {}

	onModuleInit() {
		const baseUrlClient = this.configService.get<string>('BASE_DOMAIN_CLIENT');

		if (!baseUrlClient) {
			this.logger.error('BASE_URL_CLIENT is not defined environment variable', { context: this.logContext });
			throw new InternalServerErrorException('Terjadi kesalahan pada sistem');
		}

		this.baseUrlClient = baseUrlClient;
	}

	async findOneLastetByUserId(userId: string, type: OtpType): Promise<Otp | null> {
		return await this.otpRepository.findLatestByUserIdAndType(userId, type);
	}

	async findLatestByUserIdEntityOrThrow(userId: string, type: OtpType): Promise<Otp> {
		const otpEntity = await this.otpRepository.findLatestByUserIdAndType(userId, type);

		if (!otpEntity) throw new NotFoundException('Otp tidak ditemukan');

		return otpEntity;
	}

	async findLatestByUserId(userId: string, type: OtpType) {}

	async requestRegisterOtp(dto: RequestRegisterOtpDto): Promise<boolean> {
		const otpEntity = await this.requestOtp(dto.userId, OtpType.REGISTER_VERIFICATION);

		await this.mailSharedService.sendMail({
			to: dto.to,
			otpCode: otpEntity.otpCode,
			verificationLink: `${this.baseUrlClient}/auth/register/verification`,
			subject: 'Konfirmasi Registrasi Akun - Linm Trans',
			templateName: 'register.template',
		});

		return true;
	}

	async requestResetPassword() {}

	private async requestOtp(userId: string, type: OtpType): Promise<Otp> {
		const lastOtp = await this.otpRepository.findLatestByUserIdAndType(userId, type);

		if (lastOtp && lastOtp.isCreatedWithinMinutes(2)) {
			throw new BadRequestException(`Mohon tunggu sebentar sebelum meminta OTP baru!`);
		}

		await this.otpRepository.invalidatedAllActiveOtp(userId, type);

		const code = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
		const expiry = new Date(Date.now() + MS.MINUTE * 5);

		const newOtp = Otp.create({
			user_id: userId,
			otp_code: code,
			type: type,
			expiry_date: expiry,
			is_used: false,
			attempts: 0,
		});

		return await this.otpRepository.create(newOtp);
	}

	findAll() {
		return `This action returns all otps`;
	}

	findOne(id: number) {
		return `This action returns a #${id} otp`;
	}

	update(id: number, updateOtpDto) {
		return `This action updates a #${id} otp`;
	}

	remove(id: number) {
		return `This action removes a #${id} otp`;
	}
}
