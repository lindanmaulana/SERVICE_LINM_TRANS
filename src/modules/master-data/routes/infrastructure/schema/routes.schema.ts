import { softDelete, timestamps } from '@/core/database/helpers/column.helpers';
import { SchedulesTable } from '@/modules/operations/schedules/infrastructure/schema/schedules.schema';
import { CouponsTable } from '@/modules/ticketing/coupons/infrastructure/schema/coupons.schema';
import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar, doublePrecision } from 'drizzle-orm/pg-core';

export const RoutesTable = pgTable('routes', {
	id: uuid().primaryKey().defaultRandom(),
	origin: varchar({ length: 100 }).notNull(),
	destination: varchar({ length: 100 }).notNull(),
	distance: doublePrecision().notNull(),
	...softDelete,
	...timestamps,
});

export const RoutesRelations = relations(RoutesTable, ({ one, many }) => ({
	coupons: many(CouponsTable),

	schedule: one(SchedulesTable, {
		fields: [RoutesTable.id],
		references: [SchedulesTable.routeId],
	}),
}));
