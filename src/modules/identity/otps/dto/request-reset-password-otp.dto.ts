import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { OtpBaseSchema } from './otp.dto';

export const RequestResetPasswordOtpSchema = OtpBaseSchema.pick({
	userId: true,
}).extend({
	email: z.email({ error: 'Email tidak valid' }).min(1, { error: 'Email tidak boleh kosong' }),
});

export class RequestResetPasswordOtpDto extends createZodDto(RequestResetPasswordOtpSchema) {
	static schema = RequestResetPasswordOtpSchema;
}
