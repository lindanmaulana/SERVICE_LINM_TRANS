import { UserBaseSchema } from '@/modules/master-data/users/dto/user.dto';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const AuthhSignUpSchema = UserBaseSchema.pick({
	email: true,
	name: true,
	password: true,
}).extend({
	name: z.string().min(1, { error: 'Nama tidak boleh kosong!' }),
	password: z.string().min(8, { error: 'Password minimal 8 karakter' }),
});

export class AuthhSignUpDto extends createZodDto(AuthhSignUpSchema) {
	static schema = AuthhSignUpSchema;
}

export const AuthhSignUpResponseSchema = UserBaseSchema.omit({
	password: true,
	deletedAt: true,
});

export class AuthhSignUpResponseDto extends createZodDto(AuthhSignUpResponseSchema) {}
