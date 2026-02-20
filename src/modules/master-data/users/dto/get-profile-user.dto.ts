import { UserBaseSchema } from '@/modules/master-data/users/dto/user.dto';
import { createZodDto } from 'nestjs-zod';

export const GetProfileUserResponseSchema = UserBaseSchema.omit({
	providerId: true,
	password: true,
	deletedAt: true,
});

export class GetProfileUserResponseDto extends createZodDto(GetProfileUserResponseSchema) {}
