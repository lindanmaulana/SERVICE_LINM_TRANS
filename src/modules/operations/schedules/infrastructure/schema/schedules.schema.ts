import { softDelete, timestamps } from '@/core/database/helpers/column.helpers';
import { BusesTable } from '@/modules/master-data/buses/infrastructure/schema/buses.schema';
import { RoutesTable } from '@/modules/master-data/routes/infrastructure/schema/routes.schema';
import { SeatsTable } from '@/modules/operations/seats/infrastructure/schema/seats.schema';
import { BookingsTable } from '@/modules/ticketing/bookings/infrastructure/schema/bookings.schema';
import { CouponsTable } from '@/modules/ticketing/coupons/infrastructure/schema/coupons.schema';
import { relations } from 'drizzle-orm';
import { numeric, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

export const SchedulesTable = pgTable('schedules', {
	id: uuid().primaryKey().defaultRandom(),
	busId: uuid()
		.references(() => BusesTable.id)
		.notNull(),
	routeId: uuid()
		.references(() => RoutesTable.id)
		.notNull(),
	departureTime: timestamp({ withTimezone: true }).notNull(),
	arrivalTime: timestamp({ withTimezone: true }).notNull(),
	basePrice: numeric({ precision: 12, scale: 2 }).notNull(),
	...softDelete,
	...timestamps,
});

export const SchedulesRelations = relations(SchedulesTable, ({ one, many }) => ({
	coupons: many(CouponsTable),
	bookings: many(BookingsTable),
	seats: many(SeatsTable),

	bus: one(BusesTable, {
		fields: [SchedulesTable.busId],
		references: [BusesTable.id],
	}),

	route: one(RoutesTable, {
		fields: [SchedulesTable.routeId],
		references: [RoutesTable.id],
	}),
}));
