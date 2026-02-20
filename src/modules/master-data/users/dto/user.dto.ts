import { RoleAccepted, UserRole } from '@/common/const/user-role.const';
import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { UsersTable } from '../../master-data.schema';

// export const UserBaseSchema = z.object({
// 	id: z.string(),
// 	email: z.email().min(1, 'Email tidak boleh kosong!'),
// 	password: z.string().nullable().optional(),
// 	name: z.string().min(1, 'Nama tidak boleh kosong!'),
// 	role: z.enum(userRoleEnum.enumValues).default(userRoleEnum.enumValues[1]),
// 	provider: z.string().min(1, 'Provider tidak boleh kosong').default('local'),
// 	provider_id: z.string().nullable().optional(),
// 	avatar: z.string().nullable().optional(),
// 	created_at: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { error: 'Invalid iso date!' }),
// 	updated_at: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { error: 'Invalid iso date!' }),
// 	deleted_at: z
// 		.string()
// 		.refine((v) => !Number.isNaN(Date.parse(v)), { error: 'Invalid iso date!' })
// 		.nullable()
// 		.optional(),
// });

export const UserBaseSchema = createSelectSchema(UsersTable, {
	id: z.uuid({ error: 'Identitas user tidak valid' }),
	email: z.email().min(1, 'Email tidak boleh kosong!'),
	password: z.string().nullable(),
	name: z.string().nullable(),
	role: z.enum(RoleAccepted).default(UserRole.CUSTOMER),
	provider: z.string().min(1, 'Provider tidak boleh kosong').default('local'),
	providerId: z.string().nullable(),
	avatar: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.date().nullable(),
});
