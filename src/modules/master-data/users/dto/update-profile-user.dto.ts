import z from 'zod';
import { UserBaseSchema } from './user.dto';
import { createZodDto } from 'nestjs-zod';

export const UpdateProfileUserSchema = UserBaseSchema.pick({
	name: true,
}).extend({
	name: z.string().min(1, 'Nama minimal 1 karakter').optional(),
});

export class UpdateProfileUserDto extends createZodDto(UpdateProfileUserSchema) {
	static schema = UpdateProfileUserSchema;
}

export const UpdateProfileUserResponseSchema = UserBaseSchema.omit({
	providerId: true,
	password: true,
	deletedAt: true,
});
export class UpdateProfileUserResponseDto extends createZodDto(UpdateProfileUserResponseSchema) {}
