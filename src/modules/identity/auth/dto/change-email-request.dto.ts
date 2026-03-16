import { UserBaseSchema } from '@/modules/master-data/users/dto/user.dto';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const ChangeEmailRequestSchema = z.object({
	email: z.email({ error: 'Email tidak valid' }).min(1, { error: 'Email tidak boleh kosong' }),
	password: z.string().min(1, { error: 'Password tidak boleh kosong' }),
});
export class ChangeEmailRequestDto extends createZodDto(ChangeEmailRequestSchema) {
	static schema = ChangeEmailRequestSchema;
}

export const ChangeEmailRequestResponseSchema = z.object({
	user: UserBaseSchema.pick({
		id: true,
		email: true,
		name: true,
		role: true,
		status: true,
		provider: true,
		providerId: true,
		avatar: true,
		createdAt: true,
		updatedAt: true,
	}),

	change_email_token: z.string().min(1, { error: 'Token reset password tidak boleh kosong' }),
});
export class ChangeEmailRequestResponseDto extends createZodDto(ChangeEmailRequestResponseSchema) {}
