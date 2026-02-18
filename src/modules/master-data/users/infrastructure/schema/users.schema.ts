import { softDelete, timestamps } from '@/core/database/helpers/column.helpers';
import { BookingsTable } from '@/modules/ticketing/bookings/infrastructure/schema/bookings.schema';
import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, uuid, varchar, text } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'CUSTOMER']);

export const UsersTable = pgTable('users', {
	id: uuid().primaryKey().defaultRandom(),
	email: varchar({ length: 150 }).notNull().unique(),
	password: varchar({ length: 255 }),
	name: varchar({ length: 100 }),
	role: userRoleEnum().default('CUSTOMER').notNull(),
	provider: varchar({ length: 20 }).notNull().default('local'),
	providerId: varchar('provider_id', { length: 255 }),
	avatar: text(),
	...softDelete,
	...timestamps,
});

export const UserRelations = relations(UsersTable, ({ many }) => ({
	bookings: many(BookingsTable),
}));
