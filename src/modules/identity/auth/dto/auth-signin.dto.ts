import { UserBaseSchema } from '@/modules/master-data/users/dto/user.dto';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const AuthSignInSchema = UserBaseSchema.pick({
	email: true,
	password: true,
}).extend({
	password: z.string().min(1, { error: 'Password tidak boleh kosong!' }),
});

export class AuthSigninDto extends createZodDto(AuthSignInSchema) {
	static schema = AuthSignInSchema;
}

export const AuthSigninResponseSchema = z.object({
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

export class AuthSigninResponseDto extends createZodDto(AuthSigninResponseSchema) {}
