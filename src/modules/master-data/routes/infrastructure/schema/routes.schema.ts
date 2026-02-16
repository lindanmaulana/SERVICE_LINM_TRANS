import { softDelete, timestamps } from '@/core/database/helpers/column.helpers';
import { pgTable, uuid, varchar, doublePrecision } from 'drizzle-orm/pg-core';

export const RoutesTable = pgTable('routes', {
	id: uuid().primaryKey().defaultRandom(),
	origin: varchar({ length: 100 }).notNull(),
	destination: varchar({ length: 100 }).notNull(),
	distance: doublePrecision().notNull(),
	...softDelete,
	...timestamps,
});
