import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const ForgotPasswordSchema = z.object({
	email: z.email({ error: 'Email tidak valid' }).min(1, { error: 'Email tidak boleh kosong' }),
});

export class ForgotPasswordDto extends createZodDto(ForgotPasswordSchema) {
	static schema = ForgotPasswordSchema;
}
