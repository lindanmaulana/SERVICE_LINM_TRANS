import { createZodDto } from 'nestjs-zod';
import { UserBaseSchema } from './user.dto';

export const GetOneUserResponseSchema = UserBaseSchema.omit({
	password: true,
});

export class GetOneUserResponseDto extends createZodDto(GetOneUserResponseSchema) {}
