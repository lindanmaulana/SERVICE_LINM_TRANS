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
