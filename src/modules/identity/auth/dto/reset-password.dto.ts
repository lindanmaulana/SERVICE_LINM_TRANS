import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const ResetPasswordSchema = z.object({
	password: z.string().min(8, { error: 'Password minimal 8 karakter' }),
	confirmPassword: z.string().min(8, { error: 'Confirm password minimal 8 karakter' }),
});

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {
	static schema = ResetPasswordSchema;
}
