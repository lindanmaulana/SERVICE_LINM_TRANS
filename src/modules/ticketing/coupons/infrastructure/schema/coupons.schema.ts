import { softDelete, timestamps } from '@/core/database/helpers/column.helpers';
import { BusesTable } from '@/modules/master-data/buses/infrastructure/schema/buses.schema';
import { RoutesTable } from '@/modules/master-data/routes/infrastructure/schema/routes.schema';
import { SchedulesTable } from '@/modules/operations/schedules/infrastructure/schema/schedules.schema';
import { BookingsTable } from '@/modules/ticketing/bookings/infrastructure/schema/bookings.schema';
import { relations } from 'drizzle-orm';
import { boolean, integer, numeric, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const couponTypeEnum = pgEnum('coupon_type', ['FIXED', 'PERCENTAGE']);

export const CouponsTable = pgTable('coupons', {
	id: uuid().primaryKey().defaultRandom(),
	code: varchar({ length: 50 }).notNull().unique(),
	type: couponTypeEnum().default('PERCENTAGE').notNull(),
	value: numeric({ precision: 12, scale: 2 }).notNull(),
	minPurchase: numeric({ precision: 12, scale: 2 }).notNull().default('0'),
	maxUsage: integer(),
	usedCount: integer().notNull().default(0),
	isActive: boolean().notNull().default(true),
	expiredDate: timestamp({ withTimezone: true }).notNull(),

	scheduleId: uuid().references(() => SchedulesTable.id),
	busId: uuid().references(() => BusesTable.id),
	routeId: uuid().references(() => RoutesTable.id),

	...softDelete,
	...timestamps,
});

export const CouponsRelations = relations(CouponsTable, ({ one, many }) => ({
	bookings: many(BookingsTable),

	schedule: one(SchedulesTable, {
		fields: [CouponsTable.scheduleId],
		references: [SchedulesTable.id],
	}),

	bus: one(BusesTable, {
		fields: [CouponsTable.busId],
		references: [BusesTable.id],
	}),

	route: one(RoutesTable, {
		fields: [CouponsTable.routeId],
		references: [RoutesTable.id],
	}),
}));
