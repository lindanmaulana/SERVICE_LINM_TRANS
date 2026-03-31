import { RoleAccepted } from '@/common/const/user-role.const';
import { UserStatusAccepted } from '@/common/const/user.const';
import { BaseMetaDto, BasePaginationDto } from '@/common/dto/pagination.dto';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { UserBaseSchema } from './user.dto';

export const SearchFieldsDto = z.string().optional();
export const RoleFieldsDto = z.enum(RoleAccepted).optional();
export const StatusFieldsDto = z.enum(UserStatusAccepted).optional();
export const DateRangeDto = z.object({
	gte: z
		.string()
		.refine((v) => !Number.isNaN(Date.parse(v)), { error: 'GTE invalid iso date' })
		.optional(),
	lte: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { error: 'LTE invalid iso date' }),
});

export const GetAllUserSchema = BasePaginationDto.extend({
	search: SearchFieldsDto,
	role: RoleFieldsDto,
	status: StatusFieldsDto,
});

export class GetAllUserDto extends createZodDto(GetAllUserSchema) {}

export const GetAllUserResponseDto = z.object({
	user: z.array(
		UserBaseSchema.omit({
			password: true,
		}),
	),
	meta: BaseMetaDto,
});

export type GetAllUserResponseDto = z.infer<typeof GetAllUserResponseDto>;
