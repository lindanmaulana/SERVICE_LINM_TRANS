import z from 'zod';
import { OtpBaseSchema } from '../../otps/dto';
import { createZodDto } from 'nestjs-zod';

export const SignupVerifyAuthSchema = OtpBaseSchema.pick({
	otpCode: true,
}).extend({
	email: z.email(),
});

export class SignupVerifyAuthDto extends createZodDto(SignupVerifyAuthSchema) {
	static schema = SignupVerifyAuthSchema;
}
