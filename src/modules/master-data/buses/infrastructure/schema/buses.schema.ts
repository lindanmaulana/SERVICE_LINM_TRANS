import { softDelete, timestamps } from '@/core/database/helpers/column.helpers';
import { pgTable, uuid, varchar, integer } from 'drizzle-orm/pg-core';

export const BusesTable = pgTable('buses', {
	id: uuid().primaryKey().defaultRandom(),
	name: varchar({ length: 100 }).notNull(),
	plate_number: varchar({ length: 20 }).notNull(),
	total_seats: integer().notNull(),
	...softDelete,
	...timestamps,
});
