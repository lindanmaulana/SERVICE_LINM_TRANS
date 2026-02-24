import { createZodDto } from 'nestjs-zod';
import { OtpBaseSchema } from './otp.dto';

export const CreateOtpSchema = OtpBaseSchema.pick({
	user_id: true,
	otp_code: true,
	type: true,
	expiry_date: true,
});
export class CreateOtpDto extends createZodDto(CreateOtpSchema) {
	static schema = CreateOtpSchema;
}

export const CreateOtpResponseSchema = OtpBaseSchema;
export class CreateOtpResponseDto extends createZodDto(CreateOtpResponseSchema) {}
