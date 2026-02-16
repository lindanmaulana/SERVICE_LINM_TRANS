import { softDelete, timestamps } from '@/core/database/helpers/column.helpers';
import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['admin', 'customer']);

export const UsersTable = pgTable('users', {
	id: uuid().primaryKey().defaultRandom(),
	email: varchar({ length: 150 }).notNull().unique(),
	password: varchar({ length: 255 }),
	name: varchar({ length: 100 }),
	role: userRoleEnum().default('customer'),
	provider: varchar({ length: 20 }).notNull().default('local'),
	providerId: varchar({ length: 255 }),
	avatar: varchar(),
	...softDelete,
	...timestamps,
});

// export const UserRelations = relations(UsersTable, ({ one, many }) => ({
// 	bookings: many()
// }));
