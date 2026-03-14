import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const SignupResendOtpSchema = z.object({
	email: z.email({ error: 'Email tidak valid' }).min(1, { error: 'Email tidak boleh kosong' }),
});

export class SignupResendOtpDto extends createZodDto(SignupResendOtpSchema) {
	static schema = SignupResendOtpSchema;
}
