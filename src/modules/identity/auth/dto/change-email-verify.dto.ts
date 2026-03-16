import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const ChangeEmailVerifySchema = z.object({
	otpCode: z.string().length(6, { error: 'OTP harus 6 digit' }),
});
export class ChangeEmailVerifyDto extends createZodDto(ChangeEmailVerifySchema) {
	static schema = ChangeEmailVerifySchema;
}
