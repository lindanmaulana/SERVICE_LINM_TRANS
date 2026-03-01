import { Injectable } from '@nestjs/common';
import { Otp } from '@/modules/identity/otps/domain/entities/otp.entity';
import { CreateOtpResponseDto } from '../../dto';

@Injectable()
export class OtpResponseMapper {
	static base(otp: Otp) {
		return {
			id: otp.id,
			userId: otp.userId,
			otpCode: otp.otpCode,
			isUsed: otp.isUsed,
			expiryDate: otp.expiryDate,
			type: otp.type,
			attempts: otp.attempts,
			createdAt: otp.createdAt,
			updatedAt: otp.updatedAt,
		};
	}

	static toCreate(otp: Otp): CreateOtpResponseDto {
		return this.base(otp);
	}
}
