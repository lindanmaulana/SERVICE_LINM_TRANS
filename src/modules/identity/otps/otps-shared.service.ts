import { OtpType } from '@/common/const/otp-type.const';
import { REPOSITORY_TOKENS } from '@/common/const/token.const';
import { MS } from '@/common/utils/time.util';
import { CreateOtpResponseDto, RequestRegisterOtpDto } from '@/modules/identity/otps/dto';
import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import otpGenerator from 'otp-generator';
import { Logger } from 'winston';
import { Otp } from './domain/entities/otp.entity';
import type { OtpRepository } from './domain/repositories/otp.repository';
import { MailSharedService } from '../mail/mail-shared.service';

@Injectable()
export class OtpsSharedService {
	protected logContext = this.constructor.name;

	constructor(
		@Inject(REPOSITORY_TOKENS.OTP) private readonly otpRepository: OtpRepository,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
		private readonly mailSharedService: MailSharedService,
	) {}
}
