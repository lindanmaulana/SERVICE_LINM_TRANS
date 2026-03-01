import { Injectable } from '@nestjs/common';
import { Otp } from '@/modules/identity/otps/domain/entities/otp.entity';
import { Otps } from '@/modules/identity/otps/infrastructure/schemas/otp.schema';

@Injectable()
export class OtpPersistanceMapper {
	static toEntity(otp: Otps) {
		return Otp.restore({
			id: otp.id,
			user_id: otp.userId,
			otp_code: otp.otpCode,
			is_used: otp.isUsed,
			expiry_date: otp.expiryDate,
			type: otp.type,
			attempts: otp.attempts,
			created_at: otp.createdAt,
			updated_at: otp.updatedAt,
		});
	}

	static toPersistance(otp: Otps) {
		const data = {
			userId: otp.userId,
			otpCode: otp.otpCode,
			isUsed: otp.isUsed,
			expiryDate: otp.expiryDate,
			type: otp.type,
			attempts: otp.attempts,
			createdAt: otp.createdAt,
			updatedAt: otp.updatedAt,
		};

		Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

		return data;
	}
}
