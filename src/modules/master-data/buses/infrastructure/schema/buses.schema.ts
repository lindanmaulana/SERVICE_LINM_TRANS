import { softDelete, timestamps } from '@/core/database/helpers/column.helpers';
import { SchedulesTable } from '@/modules/operations/schedules/infrastructure/schema/schedules.schema';
import { CouponsTable } from '@/modules/ticketing/coupons/infrastructure/schema/coupons.schema';
import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar, integer } from 'drizzle-orm/pg-core';

export const BusesTable = pgTable('buses', {
	id: uuid().primaryKey().defaultRandom(),
	name: varchar({ length: 100 }).notNull(),
	plate_number: varchar({ length: 20 }).notNull().unique(),
	total_seats: integer().notNull(),
	...softDelete,
	...timestamps,
});

export const BusesRelations = relations(BusesTable, ({ many }) => ({
	schedules: many(SchedulesTable),
	coupons: many(CouponsTable),
}));
