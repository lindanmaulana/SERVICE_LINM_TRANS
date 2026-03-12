import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const OtpResendRegistrationSchema = z.object({
	email: z.email({ error: 'Email tidak valid' }).min(1, { error: 'Email tidak boleh kosong' }),
});

export class OtpResendRegistrationDto extends createZodDto(OtpResendRegistrationSchema) {
	static schema = OtpResendRegistrationSchema;
}
