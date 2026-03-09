import z from 'zod';
import { OtpBaseSchema } from '../../otps/dto';
import { createZodDto } from 'nestjs-zod';

export const SignupVerifyAuthSchema = OtpBaseSchema.pick({
	otpCode: true,
});

export class SignupVerifyAuthDto extends createZodDto(SignupVerifyAuthSchema) {
	static schema = SignupVerifyAuthSchema;
}
