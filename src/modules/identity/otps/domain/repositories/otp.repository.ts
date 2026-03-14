import { OtpType } from '@/common/const/otp-type.const';
import { Otp } from '@/modules/identity/otps/domain/entities/otp.entity';

export interface OtpRepository {
	transaction(tx: any): OtpRepository;

	create(otp: Otp): Promise<Otp>;

	// findById(id: string): Promise<Otp>;
	// findByUserId(userId: string): Promise<Otp>;

	findOneLatestByUserIdAndOtpCode(userId: string, otpCode: string, type: OtpType): Promise<Otp | null>

	findLatestByUserIdAndType(userId: string, type: OtpType): Promise<Otp | null>;
	invalidatedAllActiveOtp(userId: string, type: OtpType): Promise<boolean | null>;

	consume(id: string): Promise<void>;
}
