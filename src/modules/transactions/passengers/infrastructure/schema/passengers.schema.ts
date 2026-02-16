import { timestamps } from '@/core/database/helpers/column.helpers';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const PassengersTable = pgTable('passengers', {
	id: uuid().primaryKey().defaultRandom(),
	bookingId: uuid().notNull(),
	seatId: uuid().notNull(),
	name: varchar({ length: 100 }).notNull(),
	identityNo: varchar({ length: 30 }).notNull(),
	...timestamps,
});
