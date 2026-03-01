import { OtpType } from '@/common/const/otp-type.const';
import { Otp } from '@/modules/identity/otps/domain/entities/otp.entity';

export interface OtpRepository {
	findById(id: string): Promise<Otp>;
	findByUserId(userId: string): Promise<Otp>;

	findLatestByUserIdAndType(userId: string, type: OtpType): Promise<Otp>;
	invalidatedAllActiveOtp(userId: string, type: OtpType): Promise<Otp>;

	create(otp: Otp): Promise<Otp>;
}
