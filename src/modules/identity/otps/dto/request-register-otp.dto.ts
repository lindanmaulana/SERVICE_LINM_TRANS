import z from 'zod';
import { OtpBaseSchema } from './otp.dto';
import { createZodDto } from 'nestjs-zod';

export const RequestRegisterOtpSchema = OtpBaseSchema.pick({
	userId: true,
}).extend({
	to: z.string(),
});

export class RequestRegisterOtpDto extends createZodDto(RequestRegisterOtpSchema) {
	static schema = RequestRegisterOtpSchema;
}
