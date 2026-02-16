import { timestamps } from '@/core/database/helpers/column.helpers';
import { boolean, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const SeatsTable = pgTable('seats', {
	id: uuid().primaryKey().defaultRandom(),
	scheduleId: uuid().notNull(),
	seatNumber: varchar({ length: 10 }).notNull(),
	isAvailable: boolean().notNull().default(true),
	...timestamps,
});
