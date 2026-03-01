import { createZodDto } from 'nestjs-zod';
import { OtpBaseSchema } from '@/modules/identity/otps/dto';

export const CreateOtpSchema = OtpBaseSchema.pick({
	userId: true,
	otpCode: true,
	type: true,
	expiryDate: true,
});
export class CreateOtpDto extends createZodDto(CreateOtpSchema) {
	static schema = CreateOtpSchema;
}

export const CreateOtpResponseSchema = OtpBaseSchema;
export class CreateOtpResponseDto extends createZodDto(CreateOtpResponseSchema) {}
