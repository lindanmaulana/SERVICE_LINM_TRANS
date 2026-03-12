import z from 'zod';
import { OtpBaseSchema } from '../../otps/dto';
import { createZodDto } from 'nestjs-zod';

export const AuthSignupVerifyAuthSchema = OtpBaseSchema.pick({
	otpCode: true,
}).extend({
	email: z.email({ error: 'Email tidak valid' }).min(1, { error: 'Email tidak boleh kosong' }),
});

export class AuthSignupVerifyAuthDto extends createZodDto(AuthSignupVerifyAuthSchema) {
	static schema = AuthSignupVerifyAuthSchema;
}
