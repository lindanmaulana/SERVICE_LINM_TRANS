import { UserBaseSchema } from '@/modules/master-data/users/dto/user.dto';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const SignInSchema = UserBaseSchema.pick({
	email: true,
	password: true,
}).extend({
	password: z.string().min(1, { error: 'Password tidak boleh kosong!' }),
});

export class SigninDto extends createZodDto(SignInSchema) {
	static schema = SignInSchema;
}

export const SigninResponseSchema = z.object({
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

	access_token: z.string(),
});

export class SigninResponseDto extends createZodDto(SigninResponseSchema) {}
