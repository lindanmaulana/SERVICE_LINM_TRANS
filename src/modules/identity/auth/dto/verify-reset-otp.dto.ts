import { UserBaseSchema } from '@/modules/master-data/users/dto/user.dto';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const VerifyResetOtpSchema = z.object({
	email: z.email({ error: 'Email tidak valid' }).min(1, { error: 'Email tidak boleh kosong' }),
	otpCode: z.string().length(6, { error: 'OTP harus 6 digit' }),
});

export class VerifyResetOtpDto extends createZodDto(VerifyResetOtpSchema) {
	static schema = VerifyResetOtpSchema;
}

export const VerifyResetOtpResponseSchema = z.object({
	user: UserBaseSchema.pick({
		id: true,
		email: true,
		name: true,
		role: true,
		status: true,
		provider: true,
		providerId: true,
		avatar: true,
		createdAt: true,
		updatedAt: true,
	}),

	reset_password_token: z.string().min(1, { error: 'Token reset password tidak boleh kosong' }),
});

export class VerifyResetOtpResponseDto extends createZodDto(VerifyResetOtpResponseSchema) {}
