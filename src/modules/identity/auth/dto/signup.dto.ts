import { UserBaseSchema } from '@/modules/master-data/users/dto/user.dto';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const SignUpSchema = UserBaseSchema.pick({
	email: true,
	name: true,
	password: true,
}).extend({
	name: z.string().min(1, { error: 'Nama tidak boleh kosong!' }),
	password: z.string().min(8, { error: 'Password minimal 8 karakter' }),
});

export class SignUpDto extends createZodDto(SignUpSchema) {
	static schema = SignUpSchema;
}

export const SignUpResponseSchema = UserBaseSchema.omit({
	password: true,
	deletedAt: true,
});

export class SignUpResponseDto extends createZodDto(SignUpResponseSchema) {}
