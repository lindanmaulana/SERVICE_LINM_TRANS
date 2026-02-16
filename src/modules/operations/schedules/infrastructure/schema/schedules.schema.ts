import { softDelete, timestamps } from '@/core/database/helpers/column.helpers';
import { pgTable, uuid, date, numeric } from 'drizzle-orm/pg-core';

export const SchedulesTable = pgTable('schedules', {
	id: uuid().primaryKey().defaultRandom(),
	busId: uuid().notNull(),
	routeId: uuid().notNull(),
	departureTime: date().notNull(),
	arrivalTime: date().notNull(),
	basePrice: numeric({ precision: 12, scale: 2 }).notNull(),
	...softDelete,
	...timestamps,
});
